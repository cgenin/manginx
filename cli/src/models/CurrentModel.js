const DB = require('../db');
const Model = require('./Model');


module.exports = Object.assign(Model(d => d.current()), {
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
      .delay(DB.DELAY_OF_UPDATE);
  },
  remove(name) {
    if (!name) {
      throw new Error('The name is required.');
    }
    return DB.initialize()
      .map(d => d.current())
      .map(current => current.remove(name))
      .delay(DB.DELAY_OF_UPDATE);
  }
});