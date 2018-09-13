const sinon = require('sinon');
const Rx = require('rxjs/Rx');
const {expect} = require('chai');
const TemplatesModel = require('./TemplatesModel');
const DB = require('../db');
const env = require('../env');

const defModel = {name: 'essai', src: 'Path'};

describe('TemplatesModel\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(DB, 'initialize')
      .returns(Rx.Observable.of(DB));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should toArray returns an array', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        list: () => [defModel]
      });
    TemplatesModel.toArray()
      .subscribe(
        (arr) => {
          expect(arr).to.be.an.instanceof(Array);
          done();
        },
        err => done(err)
      );
  });

  it('should find returns an result', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        list: () => [defModel]
      });
    TemplatesModel.find(defModel.name)
      .subscribe(
        (r) => {
          expect(r).to.be.equal(defModel);
          done();
        },
        err => done(err)
      );
  });

  it('should find returns an error if not found', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        list: () => [defModel]
      });
    TemplatesModel.find('darkvador')
      .subscribe(
        () => {
          expect(false).to.be.equal(true);
        },
        err => {
          expect(err.message).to.be.string('darkvador');
          done();
        }
      );
  });


  it('should list returns an observable of results', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        list: () => [defModel, defModel]
      });
    let size = 0;
    TemplatesModel.list()
      .subscribe(
        (r) => {
          expect(r).to.be.equal(defModel);
          size += 1;
        },
        err => done(err),
        () => {
          expect(size).to.be.equal(2);
          done();
        }
      );
  });

  it('should add if OK', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        add: (o) => {
          const {name, src} = o;
          expect(name).to.be.equal(defModel.name);
          if(!env.isWin()){
              expect(src).to.be.match(/^\//);
          }
          expect(src).to.be.string(defModel.src);
          return true;
        }
      });
    TemplatesModel.add(defModel)
      .subscribe(
        (r) => {
          expect(r).to.be.true;
          done();
        },
        err => done(err));
  });

  it('should remove if correct name', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        remove: (name) => {
          expect(name).to.be.equal(defModel.name);
          return true;
        }
      });
    TemplatesModel.remove(defModel.name)
      .subscribe(
        (r) => {
          expect(r).to.be.true;
          done();
        },
        err => done(err));
  });

  it('should remove if correct object', (done) => {
    sandbox.stub(DB, 'templates')
      .returns({
        remove: (name) => {
          expect(name).to.be.equal(defModel.name);
          return true;
        }
      });
    TemplatesModel.remove(defModel)
      .subscribe(
        (r) => {
          expect(r).to.be.true;
          done();
        },
        err => done(err));
  });
});