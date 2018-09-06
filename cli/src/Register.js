const path = require('path');
const Rx = require('rxjs/Rx');
const TemplatesModel = require('./models/TemplatesModel');

class Register {
  constructor(filename) {
    this.templateDir = path.resolve(filename, '..');
  }

  add(name, src) {
    const {templateDir} = this;
    return TemplatesModel.remove(name)
      .flatMap((result) => {
        if (result) {
          console.log(`replace the old templates '${name}'`);
        }
        return TemplatesModel.add({
          name,
          src,
          templateDir
        })
          .map(added => ({
            name,
            added
          }));
      });
  }

  addAll(array) {
    const observables = array.map(({name, src}) => this.add(name, src));
    return Rx.Observable.concat(...observables);
  }

  run(...args) {
    if (!args || args.length === 0) {
      throw new Error('You must provide at least one template');
    }
    console.log('*** Add manginx\'s templates : ***');
    this.addAll(args).subscribe(
      ({name, added}) => console.log(`*** Template '${name}' - added : ${(added) ? '🏆' : '🤮'} ***`),
      err => console.error(err),
      () => console.log('*** End ***')
    );
  }
}

module.exports = Register;