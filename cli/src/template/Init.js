const path = require('path');
const klaw = require('klaw');
const fs = require('fs-extra');
const { Observable } = require('rxjs/Rx');
const {iif} = require('rxjs');
const Npm = require('../process/Npm');
const env = require('../env');
const Generator = require('../Generator');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('Template creation -> ');


const TEMPLATE_HANDLEBARS = path.resolve(env.getInstallDir(), env.TEMPLATE_DIRECTORY, 'template');
const {
  bindNodeCallback, create, concat, of
} = Observable;

/**
 * "template init" command
 */
class Init {
  constructor(namePackage, targetDir) {
    this.namePackage = namePackage;
    this.targetDirectory = targetDir || process.cwd();
  }

  createDir() {
    const ensureDir = bindNodeCallback(fs.ensureDir);
    return of(this.targetDirectory)
      .map(currentPath => path.resolve(currentPath, this.namePackage))
      .flatMap(createdDirectory => ensureDir(createdDirectory)
        .map(() => createdDirectory));
  }

  copyFiles(createdDirectory) {
    return create((observer) => {
      klaw(TEMPLATE_HANDLEBARS)
        .on('data', (item) => {
          if (TEMPLATE_HANDLEBARS !== item.path) {
            observer.next(item);
          }
        })
        .on('end', () => {
          observer.complete();
        })
        .on('error', (err, item) => {
          logger.error(`The error file is ${item.path}`);
          observer.error(err);
        });
    })
      .flatMap(item => iif(
        () => item.stats.isDirectory(),
        this.createTemplateDirectory(createdDirectory, item),
        this.generateTemplate(createdDirectory, item)
      ));
  }


  // eslint-disable-next-line class-methods-use-this
  createTemplateDirectory(createdDirectory, item) {
    const ensureDir = bindNodeCallback(fs.ensureDir);
    return of(item.path)
      .map(p => p.replace(TEMPLATE_HANDLEBARS, ''))
      .map(addedDir => path.resolve(createdDirectory, `.${addedDir}`))
      .flatMap(dir2create => ensureDir(dir2create)
        .map(() => dir2create));
  }

  generateTemplate(createdDirectory, item) {
    const {namePackage} = this;
    return of(item.path)
      .map(p => p.replace(TEMPLATE_HANDLEBARS, ''))
      .map(templateFileRelativePath => path.resolve(createdDirectory, `.${templateFileRelativePath}`))
      .flatMap(fileTarget => new Generator(`template:${item.path}`)
        .compileFromFile(item.path)
        .generate({namePackage})
        .toFile(fileTarget));
  }

  run() {
    return this.createDir()
      .flatMap(createdDirectory => concat(
        of(createdDirectory),
        this.copyFiles(createdDirectory),
        Npm.install(createdDirectory)
      ));
  }
}

module.exports = Init;