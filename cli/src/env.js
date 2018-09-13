const os = require('os');
const path = require('path');
const { Observable } = require('rxjs/Rx');
const fs = require('fs-extra');
const tempDir = require('temp-dir');
const uuid = require('uuid/v1');

const { bindNodeCallback } = Observable;
const fileName = 'manginx.json';
const DEFAULT_TEMPLATE = '@manginx/test';
const TEMPLATE_DIRECTORY = 'handlebars';
const isWin = process.platform === 'win32';

module.exports = {
  DEFAULT_TEMPLATE,
  TEMPLATE_DIRECTORY,
  isWin() {
    return isWin;
  },
  getConfFileRootDir() {
    return os.homedir();
  },
  getDbFilePath() {
    return path.resolve(this.getConfFileRootDir(), fileName);
  },
  getInstallDir() {
    return path.resolve(__filename, '..', '..');
  },
  templatesDirName(targetDirectory) {
    return path.resolve(targetDirectory, 'servers');
  },
  targetDir() {
    const absPath = path.resolve(tempDir, uuid());
    const mkdirs = bindNodeCallback(fs.mkdirs);
    return mkdirs(absPath)
      .map(() => absPath);
  }

};