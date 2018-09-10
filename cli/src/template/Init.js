const path = require('path');
const klaw = require('klaw');
const fs = require('fs-extra');
const Rx = require('rxjs/Rx');
const {iif} = require('rxjs');
const {exec} = require('child_process');
const env = require('../env');
const Generator = require('../Generator');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('Template creation -> ');


const TEMPLATE_HANDLEBARS = path.resolve(env.getInstallDir(), env.TEMPLATE_DIRECTORY, 'template');

/**
 * "template init" command
 */
class Init {
  constructor(namePackage) {
    this.namePackage = namePackage;
  }

  createDir() {
    const ensureDir = Rx.Observable.bindNodeCallback(fs.ensureDir);
    return Rx.Observable.of(process.cwd())
      .map(currentPath => path.resolve(currentPath, this.namePackage))
      .flatMap(createdDirectory => ensureDir(createdDirectory)
        .map(() => createdDirectory));
  }

  copyFiles(createdDirectory) {
    return Rx.Observable.create((observer) => {
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

  static install(createdDirectory) {
    return Rx.Observable.create((observer) => {
      const cmd = exec('npm install', {
        cwd: createdDirectory,
        maxBuffer: 200 * 1024
      }, (error) => {
        if (error) {
          observer.error(error);
        } else {
          observer.complete();
        }
      });

      const consoleOutput = (msg) => {
        logger.info(`npm: ${msg}`);
      };
      cmd.stdout.on('data', consoleOutput);
      cmd.stderr.on('data', consoleOutput);
    });
  }

  run() {
    return this.createDir()
      .flatMap(createdDirectory => Rx.Observable.concat(
        Rx.Observable.of(createdDirectory),
        this.copyFiles(createdDirectory),
        Init.install(createdDirectory)
      ));
  }

  // eslint-disable-next-line class-methods-use-this
  createTemplateDirectory(createdDirectory, item) {
    const ensureDir = Rx.Observable.bindNodeCallback(fs.ensureDir);
    return Rx.Observable.of(item.path)
      .map(p => p.replace(TEMPLATE_HANDLEBARS, ''))
      .map(addedDir => path.resolve(createdDirectory, `.${addedDir}`))
      .flatMap(dir2create => ensureDir(dir2create))
      .map(() => item.path);
  }

  generateTemplate(createdDirectory, item) {
    const {namePackage} = this;
    return Rx.Observable.of(item.path)
      .map(p => p.replace(TEMPLATE_HANDLEBARS, ''))
      .map(templateFileRelativePath => path.resolve(createdDirectory, `.${templateFileRelativePath}`))
      .flatMap(fileTarget => new Generator(`template:${item.path}`)
        .compileFromFile(item.path)
        .generate({namePackage})
        .toFile(fileTarget));
  }
}

module.exports = Init;