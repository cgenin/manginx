const Rx = require('rxjs/Rx');
const DB = require('../db');


module.exports = {
  add(name) {
    return DB.initialize()
      .map(d => d.templates()
        .list())
      .map(templates => templates.find(o => o.name === name))
      .map((find) => {
        if (!find) {
          throw new Error(`template ${name} not found`);
        }
        return find;
      })
      .map((template) => {
        const current = DB.current();
        if (current.list()
          .findIndex(o => o.name === name) !== -1) {
          throw new Error(`template ${name} already added`);
        }
        // eslint-disable-next-line no-unused-vars
        const {$loki, meta, ...obj} = template;
        return current.add(obj);
      })
      .delay(20);
  },
  list() {
    return DB.initialize()
      .map(d => d.current())
      .map(current => current.list())
      .flatMap(arr => Rx.Observable.from(arr));
  },
  remove(name) {
    if (!name) {
      throw new Error('The name is required.');
    }
    return DB.initialize()
      .map(d => d.current())
      .map(current => current.remove(name))
      .delay(20);
  }
};