const path = require('path');
const Rx = require('rxjs/Rx');
const fs = require('fs-extra');
const Generator = require('./Generator');
const env = require('../env');


class MainConfiguration {
  constructor(targetDirectory) {
    this.targetDirectory = targetDirectory;
  }

  copyMimeTypes() {
    const mimeTypeSrcFile = path.resolve(env.getInstallDir(), 'conf', 'mime.types');
    const targetFile = path.resolve(this.targetDirectory, 'mime.types');
    const copy = Rx.Observable.bindNodeCallback(fs.copy);
    return copy(mimeTypeSrcFile, targetFile)
      .map(() => targetFile);
  }

  generateMainConfFile() {
    const mainTemplatePath = path.resolve(env.getInstallDir(), 'conf', 'nginx.conf.hbs');
    const targetFile = path.resolve(this.targetDirectory, 'nginx.conf');
    const datas = {
      generateDir: this.targetDirectory,
      installDir: env.getInstallDir()
    };
    return new Generator('MainConfiguration')
      .compileFromFile(mainTemplatePath)
      .generate(datas)
      .toFile(targetFile);
  }

  generate() {
    return Rx.Observable.concat(
      this.copyMimeTypes(),
      this.generateMainConfFile()
    );
  }
}

module.exports = MainConfiguration;