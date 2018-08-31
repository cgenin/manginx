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
        return current.add(template);
      });
  },

  remove(name) {
    if (!name) {
      throw new Error('The name is required.');
    }
    return DB.initialize()
      .map(d => d.current())
      .map(current => current.remove(name));
  }
};