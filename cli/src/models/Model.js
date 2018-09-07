const Rx = require('rxjs/Rx');
const DB = require('../db');

module.exports = mapFunc => ({
  toArray() {
    return DB.initialize()
      .map(() => mapFunc(DB))
      .map(t => t.list());
  },

  list() {
    return this.toArray()
      .flatMap(list => Rx.Observable.from(list));
  }
});