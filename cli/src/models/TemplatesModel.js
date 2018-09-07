const path = require('path');
const Rx = require('rxjs/Rx');
const pathIsAbsolute = require('path-is-absolute');
const Model = require('./Model');
const DB = require('../db');


const toAbsolutePath = (obj) => {
  if (obj && obj.src && !pathIsAbsolute(obj.src)) {
    const currentPath = process.cwd();
    const newPath = {src: path.resolve(currentPath, obj.src)};
    return Object.assign({}, obj, newPath);
  }
  return obj;
};


module.exports = Object.assign(Model(d => d.templates()), {
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
      .map(t => t.remove(name)).delay(DB.DELAY_OF_UPDATE);
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
      .delay(DB.DELAY_OF_UPDATE);
  }
});