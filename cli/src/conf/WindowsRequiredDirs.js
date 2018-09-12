const path = require('path');
const fs = require('fs-extra');
const {Observable} = require('rxjs/Rx');

const {bindNodeCallback, concat} = Observable;
const mkdirs = bindNodeCallback(fs.mkdirs);

class WindowsRequiredDirs {
  constructor(targetDirectory) {
    this.targetDirectory = targetDirectory;
  }

  createDirectory(name) {
    const logDirPath = path.resolve(this.targetDirectory, name);
    return mkdirs(logDirPath).map(() => logDirPath);
  }

  createLogs() {
    return this.createDirectory('logs');
  }

  createTemp() {
    return this.createDirectory('temp');
  }

  generate() {
    return concat(
      this.createLogs(),
      this.createTemp()
    );
  }
}

module.exports = WindowsRequiredDirs;