const path = require('path');
const Rx = require('rxjs/Rx');
const pathIsAbsolute = require('path-is-absolute');
const DB = require('../db');

const toAbsolutePath = (obj) => {
  if (obj && obj.src && !pathIsAbsolute(obj.src)) {
    const currentPath = process.cwd();
    const newPath = {src: path.resolve(currentPath, obj.src)};
    return Object.assign({}, obj, newPath);
  }
  return obj;
};


module.exports = {
  toArray() {
    return DB.initialize()
      .map(() => DB.templates())
      .map(t => t.list());
  },

  list() {
    return this.toArray()
      .flatMap(list => Rx.Observable.from(list));
  },

  remove(arg) {
    const rem = name => DB.initialize()
      .map(() => DB.templates())
      .map(t => t.remove(name));
    const isString = typeof arg === 'string';
    if (isString) {
      return rem(arg);
    }
    const {name} = arg;
    return rem(name);
  },

  add(obj) {
    if (obj && obj.name === 'test') {
      throw new Error('This name is already used by internal management. Sorry. Please change 😅 ');
    }
    const target = toAbsolutePath(obj);
    return DB.initialize()
      .map(() => DB.templates())
      .map(templates => templates.add(target))
      .delay(20);
  }
};