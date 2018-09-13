const path = require('path');
const {Observable} = require('rxjs/Rx');
const fs = require('fs-extra');
const {iif} = require('rxjs');
const fkill = require('fkill');
const env = require('../env');


const {fromPromise, bindNodeCallback} = Observable;

class Stop {
  constructor(killer) {
    this.killer = killer || fkill;
  }

  stopForUnix() {
    return fromPromise(this.killer('nginx'))
      .map(() => true);
  }

  stopForWindows() {
    const readFile = bindNodeCallback(fs.readFile);
    const pidFile = path.resolve(env.getInstallDir(), 'logs', 'nginx.pid');
    return readFile(pidFile)
      .flatMap(pid => this.killer(pid, {tree: true, force: true}))
      .map(() => true);
  }

  // eslint-disable-next-line class-methods-use-this
  run() {
    return iif(
      () => env.isWin(),
      this.stopForWindows(),
      this.stopForUnix()
    );
  }
}

module.exports = Stop;