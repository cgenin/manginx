/* eslint-disable import/no-dynamic-require,global-require */
const path = require('path');
const {Observable} = require('rxjs/Rx');
const fs = require('fs-extra');
const Templates = require('./Templates');
const env = require('../env');
const TemplatesModel = require('../models/TemplatesModel');
const Generator = require('../Generator');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('⌨️');
const {bindNodeCallback, concat, of} = Observable;

const getFileName = (fpath) => {
  const extension = path.extname(fpath);
  return path.basename(fpath, extension);
};

const executeHooks = (original, hooks) => {
  if (!hooks || hooks.length === 0) {
    return of(original);
  }
  const observables = hooks.map((h) => {
    const relativePath = path.relative(__dirname, h);
    const mod = require(relativePath);
    return mod();
  });
  return concat(...observables)
    .reduce((acc, o) => Object.assign(acc, o), original);
};

class TemplatesConfiguration {
  constructor(usedTemplates, targetDirectory) {
    this.usedTemplates = usedTemplates;
    this.targetDirectory = targetDirectory;
  }

  getTemplates() {
    if (this.usedTemplates.length === 0) {
      logger.info('‼️ No templates selected. Used default instead');
      return TemplatesModel.find(env.DEFAULT_TEMPLATE)
        .map(defTemplate => [defTemplate]);
    }
    return of(this.usedTemplates);
  }


  createTemplatesDirectory() {
    const mkdirs = bindNodeCallback(fs.mkdirs);
    return of(env.templatesDirName(this.targetDirectory))
      .flatMap(dir => mkdirs(dir));
  }


  allTemplates() {
    return this.getTemplates()
      .flatMap((templates) => {
        const templatesObs = templates
          .map((t) => {
            const {
              name, src, hooks, templateDir, ...others
            } = t;
            const original = Object.assign({
              generateDir: Templates.pathFormatter(this.targetDirectory),
              installDir: Templates.pathFormatter(env.getInstallDir()),
              templateDir: Templates.pathFormatter(templateDir)
            }, others);
            const filename = getFileName(src);
            const fileNametarget = `${filename}.conf`;
            const targetFilePath = path.resolve(env.templatesDirName(this.targetDirectory), fileNametarget);
            return of(true)
              .flatMap(() => {
                logger.info(`generation of template : '${name}'`);
                return executeHooks(original, hooks)
                  .flatMap(datas => new Generator(`template:${name}`)
                    .compileFromFile(src)
                    .generate(datas)
                    .toFile(targetFilePath));
              });
          });
        return concat(...templatesObs);
      });
  }

  generate() {
    logger.info('launched...');
    return concat(
      this.createTemplatesDirectory(),
      this.allTemplates()
    );
  }
}


module.exports = TemplatesConfiguration;