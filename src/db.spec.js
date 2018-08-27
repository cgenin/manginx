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
      .delay(500)
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
});