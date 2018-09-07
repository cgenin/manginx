const Lokijs = require('lokijs');
const Rx = require('rxjs/Rx');
const Env = require('./env');

let instance = null;
const CONF_DB = 'configuration';
const TEMPLATES_DB = 'templates';
const CURRENT_DB = 'current';
const DB_NAMES = [CONF_DB, CURRENT_DB, TEMPLATES_DB];

class ArrayColl {
  constructor(db, coll) {
    this.coll = coll;
    this.db = db;
  }

  clear() {
    this.coll.clear();
    this.db.saveDatabase();
  }

  list() {
    return this.coll.data || [];
  }

  add(obj) {
    if (!obj) {
      throw new Error('The obj to add ust not be null.');
    }
    if (!obj.name) {
      throw new Error('the property \'name\' must be provided.');
    }

    if (obj.name && this.list()
      .findIndex(o => obj.name === o.name) !== -1) {
      throw new Error('Impossible to add becausse already exists. Please remove Before');
    }

    this.coll.insert(obj);
    this.db.saveDatabase();
    return true;
  }

  remove(arg) {
    const isString = typeof arg === 'string';
    const searchName = (isString) ? arg : arg.name;
    if (!searchName) {
      throw new Error('Impossible to remove empty name.');
    }
    const res = this.list()
      .find(obj => obj.name === searchName);
    if (!res) {
      return true;
    }
    this.coll.remove(res);
    this.db.saveDatabase();
    return true;
  }
}

class SingletonColl {
  constructor(db, coll) {
    this.coll = coll;
    this.db = db;
  }

  state() {
    return this.coll.findOne();
  }

  save(diff) {
    const newValues = Object.assign(this.state(), diff);
    this.coll.update(newValues);
    this.db.saveDatabase();
    return true;
  }
}

class DB {
  constructor() {
    this.DELAY_OF_UPDATE = 20;
  }

  initialize(dbPath) {
    if (instance) {
      return Rx.Observable.of(instance);
    }

    return Rx.Observable.create((observer) => {
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
    });
  }

  configuration() {
    return this.getSingleton(CONF_DB);
  }

  templates() {
    const collection = this.db.getCollection(TEMPLATES_DB);
    return new ArrayColl(this.db, collection);
  }

  current() {
    const collection = this.db.getCollection(CURRENT_DB);
    return new ArrayColl(this.db, collection);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }

  getSingleton(collectionName) {
    const confCollection = this.db.getCollection(collectionName);

    if (!confCollection.findOne()) {
      confCollection.insert({});
    }

    return new SingletonColl(this.db, confCollection);
  }
}


module.exports = new DB();
