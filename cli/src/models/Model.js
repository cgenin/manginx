const { Observable } = require('rxjs/Rx');
const DB = require('../db');

const { from } = Observable;

module.exports = mapFunc => ({
  toArray() {
    return DB.initialize()
      .map(() => mapFunc(DB))
      .map(t => t.list());
  },

  list() {
    return this.toArray()
      .flatMap(list => from(list));
  }
});