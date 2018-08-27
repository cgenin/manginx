const Rx = require('rxjs/Rx');
const fkill = require('fkill');

class Stop {
// eslint-disable-next-line class-methods-use-this
  run() {
    return Rx.Observable.fromPromise(fkill('nginx'))
      .map(() => true);
  }
}

module.exports = Stop;