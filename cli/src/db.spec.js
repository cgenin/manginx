/* eslint-disable no-unused-expressions */
const path = require('path');
const Rx = require('rxjs/Rx');
const fs = require('fs-extra');
const tempDir = require('temp-dir');
const uuid = require('uuid/v1');
const {expect} = require('chai');
const db = require('./db');

describe('Db\'s test', () => {
  const absPath = path.resolve(tempDir, `db.test.${uuid()}.json`);

  it('test creation db', (done) => {
    const readFile = Rx.Observable.bindNodeCallback(fs.readFile);
    db.initialize(absPath)
      .delay(db.DELAY_OF_UPDATE)
      .flatMap((d) => {
        expect(d).to.be.not.null;
        expect(d).to.be.an('object');
        return readFile(absPath, 'utf-8');
      })
      .subscribe((txt) => {
        expect(txt).to.have.string('configuration');
        db.close();
        done();
      }, err => done(err));
  });

  it('test set conf data', (done) => {
    db.initialize(absPath).map(d => d.configuration())
      .map((conf) => {
        expect(conf.state()).to.be.not.null;
        expect(conf.state()).to.be.not.undefined;
        expect(conf.save({test: 1})).to.be.equal(true);
        return conf.state();
      })
      .subscribe((res) => {
        const {test} = res;
        expect(test).to.be.equal(1);
        db.close();
        done();
      }, err => done(err));
  });

  it('test current data', (done) => {
    db.initialize(absPath).map(d => d.current())
      .subscribe((conf) => {
        expect(conf.list()).to.be.empty;
        db.close();
        done();
      }, err => done(err));
  });

  it('test template list', (done) => {
    db.initialize(absPath)
      .map(d => d.templates())
      .map((template) => {
        expect(template.list().length).to.be.equal(0);
        expect(template.add({name: 'test', test: 2})).to.be.equal(true);
        return template.list();
      })
      .delay(db.DELAY_OF_UPDATE)
      .subscribe((res) => {
        expect(res.length).to.be.equal(1);
        const {test, name} = res[0];
        expect(name).to.be.equal('test');
        expect(test).to.be.equal(2);
        db.close();
        done();
      }, err => done(err));
  });

  it('test template does add doublon\'s name', (done) => {
    db.initialize(absPath)
      .map(d => d.templates())
      .map((template) => {
        expect(template.add({name: 'doublon', test: 2})).to.be.equal(true);
        template.add({name: 'doublon', test: 2});
        return template.list();
      })
      .delay(db.DELAY_OF_UPDATE)
      .subscribe(() => {
        expect(false).to.be.equal(1);
        db.close();
        done();
      }, () => {
        done();
      });
  });

  it('test template does add with null', (done) => {
    db.initialize(absPath)
      .map(d => d.templates())
      .map((template) => {
        return         template.add();
      })
      .subscribe((r) => {
        expect(r).to.be.equal(false);
        db.close();
        done();
      }, (err) => {
        expect(err).to.be.instanceOf(Error);
        done();
      });
  });

  it('test template does add with name property', (done) => {
    db.initialize(absPath)
      .map(d => d.templates())
      .map((template) => {
        return         template.add({});
      })
      .subscribe((r) => {
        expect(r).to.be.equal(false);
        db.close();
        done();
      }, (err) => {
        expect(err).to.be.instanceOf(Error);
        done();
      });
  });


  it('test template can remove obj', (done) => {
    db.initialize(absPath)
      .map(d => d.templates())
      .map((template) => {
        expect(template.add({name: 'removal', test: 3})).to.be.equal(true);
        return template;
      })
      .delay(db.DELAY_OF_UPDATE)
      .map((template) => {
        expect(template.remove({name: 'removal'})).to.be.equal(true);
        expect(template.remove({name: 'removal'})).to.be.equal(true);
        return template;
      })
      .subscribe((t) => {
        const index = t.list().findIndex(o => (o.name === 'removal'));
        expect(index).to.be.equal(-1);
        db.close();
        done();
      }, () => {
        done();
      });
  });

  it('test template with remove must called with name', (done) => {
    db.initialize(absPath)
      .map(d => d.templates())
      .map((template) => {
        template.remove({test: 3});
        return false;
      })
      .subscribe((t) => {
        expect(t).to.be.equal(true);
        db.close();
        done();
      }, (err) => {
        expect(err).to.be.instanceOf(Error);
        db.close();
        done();
      });
  });
});