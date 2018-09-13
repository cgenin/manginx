const path = require('path');
const {Observable} = require('rxjs/Rx');
const fs = require('fs-extra');
const Templates = require('./Templates');
const Generator = require('../Generator');
const env = require('../env');

const CONF_DIRECTORY = 'conf';
const {bindNodeCallback, concat} = Observable;

class MainConfiguration {
  constructor(targetDirectory, port, templates) {
    this.targetDirectory = targetDirectory;
    this.port = port;
    this.templates = templates;
  }

  copyMimeTypes() {
    const mimeTypeSrcFile = path.resolve(env.getInstallDir(), env.TEMPLATE_DIRECTORY, CONF_DIRECTORY, 'mime.types');
    const targetFile = this.getMimetypesFilePath();
    const copy = bindNodeCallback(fs.copy);
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
    const modulesConfPaths = this.templates
      .map(({src}) => path.basename(src))
      .map(basename => path.resolve(env.templatesDirName(this.targetDirectory), basename))
      .map(p => Templates.pathFormatter(p));
    const datas = {
      port,
      modulesConfPaths,
      generateDir: Templates.pathFormatter(this.targetDirectory),
      installDir: Templates.pathFormatter(env.getInstallDir())
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
    return concat(
      this.copyMimeTypes(),
      this.generateMainConfFile()
    );
  }
}

module.exports = MainConfiguration;