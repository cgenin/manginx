const path = require('path');
const Rx = require('rxjs/Rx');
const pathIsAbsolute = require('path-is-absolute');
const {DEFAULT_NAME} = require('../env');
const DB = require('../db');
// const TemplatesConfiguration = require('../conf/TemplatesConfiguration');

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

  find(name) {
    return this.toArray()
      .flatMap((arr) => {
        const obj = arr.find(ob => ob.name === name);
        if (!obj) {
          throw new Error(`Template '${name}' not found. Please install it.`);
        }
        return Rx.Observable.of(obj);
      });
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
    const target = toAbsolutePath(obj);
    return DB.initialize()
      .map(() => DB.templates())
      .map(templates => templates.add(target))
      .delay(20);
  }
};