const Lokijs = require('lokijs');
const Rx = require('rxjs/Rx');
const Env = require('./env');

let instance = null;
const CONF_DB = 'configuration';
const RUN_DB = 'runner';
const DB_NAMES = [CONF_DB, RUN_DB];


class SingletonColl {
  constructor(coll) {
    this.coll = coll;
  }

  state() {
    return this.coll.findOne();
  }

  save(diff) {
    const newValues = Object.assign(this.state(), diff);
    this.coll.update(newValues);
    return true;
  }
}

class DB {
  initialize(dbPath) {
    if (instance) {
      return Rx.Observable.of(instance);
    }

    return Rx.Observable.create((observer) => {
      try {
        const filePath = dbPath || Env.getDbFilePath();
        this.db = new Lokijs(filePath, {autosave: true});

        this.db.loadDatabase({}, (err) => {
          if (err) {
            observer.error(err);
            return;
          }

          DB_NAMES.forEach((collName) => {
            if (!this.db.getCollection(collName)) {
              this.db.addCollection(collName);
            }
          });
          this.db.saveDatabase();
          instance = this;
          observer.next(this);
          observer.complete();
        });
      } catch (e) {
        observer.error(e);
      }
    });
  }

  configuration() {
    return this.getSingleton(CONF_DB);
  }

  runner() {
    return this.getSingleton(RUN_DB);
  }

  close() {
    this.db.close();
  }

  getSingleton(collectionName) {
    const confCollection = this.db.getCollection(collectionName);

    if (!confCollection.findOne()) {
      confCollection.insert({});
    }

    return new SingletonColl(confCollection);
  }
}


module.exports = new DB();
