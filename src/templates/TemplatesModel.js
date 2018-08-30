/* eslint-disable class-methods-use-this */
const Rx = require('rxjs/Rx');
const DB = require('../db');

class TemplatesModel {
  toArray() {
    return DB.initialize()
      .map(() => DB.templates())
      .map(t => t.list());
  }

  list() {
    return this.toArray()
      .flatMap(list => Rx.Observable.from(list));
  }
}

module.exports = TemplatesModel;