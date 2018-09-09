const path = require('path');
const Rx = require('rxjs/Rx');
const fs = require('fs-extra');
const Generator = require('../Generator');
const env = require('../env');

const CONF_DIRECTORY = 'conf';

class MainConfiguration {
  constructor(targetDirectory, port) {
    this.targetDirectory = targetDirectory;
    this.port = port;
  }

  copyMimeTypes() {
    const mimeTypeSrcFile = path.resolve(env.getInstallDir(), env.TEMPLATE_DIRECTORY, CONF_DIRECTORY, 'mime.types');
    const targetFile = this.getMimetypesFilePath();
    const copy = Rx.Observable.bindNodeCallback(fs.copy);
    return copy(mimeTypeSrcFile, targetFile)
      .map(() => targetFile);
  }

  getMimetypesFilePath() {
    return path.resolve(this.targetDirectory, 'mime.types');
  }


  generateMainConfFile() {
    const {port} = this;
    const mainTemplatePath = path.resolve(
      env.getInstallDir(), env.TEMPLATE_DIRECTORY,
      CONF_DIRECTORY, 'nginx.conf.hbs'
    );
    const targetFile = this.getMainconfFilePath();
    const datas = {
      port,
      generateDir: this.targetDirectory,
      installDir: env.getInstallDir()
    };
    return new Generator('MainConfiguration')
      .compileFromFile(mainTemplatePath)
      .generate(datas)
      .toFile(targetFile);
  }

  getMainconfFilePath() {
    return path.resolve(this.targetDirectory, 'nginx.conf');
  }

  generate() {
    return Rx.Observable.concat(
      this.copyMimeTypes(),
      this.generateMainConfFile()
    );
  }
}

module.exports = MainConfiguration;