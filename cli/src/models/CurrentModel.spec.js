const sinon = require('sinon');
const Rx = require('rxjs/Rx');
const {expect} = require('chai');
const CurrentModel = require('./CurrentModel');
const DB = require('../db');

const defModel = {name: 'essai', src: '/some/Path'};

describe('CurrentModel\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(DB, 'initialize').returns(Rx.Observable.of(DB));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should toArray returns an array', (done) => {
    sandbox.stub(DB, 'current')
      .returns({
        list: () => [defModel]
      });
    CurrentModel.toArray()
      .subscribe(
        (arr) => {
          expect(arr).to.be.an.instanceof(Array);
          done();
        },
        err => done(err)
      );
  });


  it('should add model if ok', (done) => {
    sandbox.stub(DB, 'templates').returns({
      list: () => [defModel]
    });
    sandbox.stub(DB, 'current').returns({
      list: () => [],
      add: () => true
    });
    CurrentModel.add(defModel.name)
      .subscribe(
        (res) => {
          expect(res).to.be.equal(true);
          done();
        },
        err => done(err)
      );
  });

  it('should add throw error if already added', (done) => {
    sandbox.stub(DB, 'templates').returns({
      list: () => [defModel]
    });
    sandbox.stub(DB, 'current').returns({
      list: () => [defModel],
      add: () => true
    });
    CurrentModel.add(defModel.name)
      .subscribe(
        (res) => {
          expect(res).to.be.equal(false);
          done(new Error('not ok'));
        },
        () => done()
      );
  });

  it('should add throw error if not exists', (done) => {
    sandbox.stub(DB, 'templates').returns({
      list: () => []
    });
    sandbox.stub(DB, 'current').returns({
      list: () => [],
      add: () => true
    });
    CurrentModel.add(defModel.name)
      .subscribe(
        (res) => {
          expect(res).to.be.equal(false);
          done(new Error('not ok'));
        },
        () => done()
      );
  });

  it('should remove if Ok', (done) => {
    sandbox.stub(DB, 'current').returns({
      list: () => [defModel],
      remove: () => true
    });
    CurrentModel.remove(defModel.name)
      .subscribe(
        (res) => {
          expect(res).to.be.equal(true);
          done();
        },
        err => done(err)
      );
  });

  it('should remove throw exception if name == null', (done) => {
    try {
      CurrentModel.remove(null);
      done(new Error('not ok'));
    } catch (err) {
      done();
    }
  });
});