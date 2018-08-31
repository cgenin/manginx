const path = require('path');
const Rx = require('rxjs/Rx');
const fs = require('fs-extra');
const env = require('../env');
const Generator = require('../Generator');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('⌨️');

const getFileName = (fpath) => {
  const extension = path.extname(fpath);
  return path.basename(fpath, extension);
};

class TemplatesConfiguration {
  constructor(usedTemplates, targetDirectory) {
    this.usedTemplates = usedTemplates;
    this.targetDirectory = targetDirectory;
  }

  getTemplates() {
    if (this.usedTemplates.length === 0) {
      logger.info('‼️ No templates selected. Used default instead');
      const testDefTemplate = path.resolve(env.getInstallDir(), 'servers', 'test.conf');
      return [{
        name: 'test',
        src: testDefTemplate
      }];
    }
    return this.usedTemplates;
  }


  createTemplatesDirectory() {
    const mkdirs = Rx.Observable.bindNodeCallback(fs.mkdirs);
    return Rx.Observable.of(env.templatesDirName(this.targetDirectory))
      .flatMap(dir => mkdirs(dir));
  }


  allTemplates() {
    const templates = this.getTemplates();
    return Rx.Observable.from(templates)
      .flatMap((t) => {
        const {name, src} = t;
        logger.info(`generation of template : '${name}'`);
        const datas = {
          generateDir: this.targetDirectory,
          installDir: env.getInstallDir()
        };
        const filename = getFileName(src);
        const fileNametarget = `${filename}.conf`;
        const targetFilePath = path.resolve(env.templatesDirName(this.targetDirectory), fileNametarget);
        return new Generator(`template:${name}`)
          .compileFromFile(src)
          .generate(datas)
          .toFile(targetFilePath);
      });
  }

  generate() {
    logger.info('launched...');
    return Rx.Observable.concat(
      this.createTemplatesDirectory(),
      this.allTemplates()
    );
  }
}

module.exports = TemplatesConfiguration;