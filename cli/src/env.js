const os = require('os');
const path = require('path');
const Rx = require('rxjs/Rx');
const fs = require('fs-extra');
const tempDir = require('temp-dir');
const uuid = require('uuid/v1');

const fileName = 'manginx.json';
const DEFAULT_TEMPLATE = '@manginx/test';
const TEMPLATE_DIRECTORY = 'template';


module.exports = {
  DEFAULT_TEMPLATE,
  TEMPLATE_DIRECTORY,
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
    const mkdirs = Rx.Observable.bindNodeCallback(fs.mkdirs);
    return mkdirs(absPath)
      .map(() => absPath);
  }
};