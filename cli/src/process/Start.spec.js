const sinon = require('sinon');
const { Observable } = require('rxjs/Rx');
const childProcess = require('child_process');
const TemplatesManager = require('../conf/NginxConfiguration');
const {expect} = require('chai');
const Start = require('./Start');
const DB = require('../db');

const CONST_TESTIF = 'nginx version V1.0.0';
const { of } = Observable;

describe('Start\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  class Std {
    constructor(str) {
      this.str = str;
    }

    on(name, fn) {
      fn(this.str);
    }
  }

  it('should testIfExist return the path if ok', (done) => {
    sandbox.stub(childProcess, 'spawn')
      .returns({
        stderr: new Std(CONST_TESTIF),
        stdout: new Std(CONST_TESTIF)
      });
    Start.testIfExist('onePath')
      .subscribe(
        (res) => {
          expect(res)
            .to
            .be
            .equal('onePath');
          done();
        },
        (err) => {
          done(err);
        }
      );
  });

  it('should testIfExist return an error if ko', (done) => {
    sandbox.stub(childProcess, 'spawn')
      .throws(new Error('test'));
    Start.testIfExist('onePath')
      .subscribe(
        (res) => {
          done(new Error(res));
        },
        (err) => {
          expect(err.message)
            .to
            .be
            .equal('test');
          done();
        }
      );
  });

  it('should testIfExist return an unknwn std if ko', (done) => {
    sandbox.stub(childProcess, 'spawn')
      .returns({
        stderr: new Std('Other'),
        stdout: new Std('Other')
      });
    Start.testIfExist('onePath')
      .subscribe(
        (res) => {
          done(new Error(res));
        },
        (err) => {
          expect(err.message)
            .to
            .be
            .equal('No nginx global command found.');
          done();
        }
      );
  });

  const stubForCallingStart = function () {
    sandbox.stub(childProcess, 'spawn')
      .onFirstCall()
      .returns({
        stderr: new Std(CONST_TESTIF),
        stdout: new Std(CONST_TESTIF)
      })
      .onSecondCall()
      .returns({
        stderr: new Std('start worker process 89'),
        stdout: new Std('start worker process 89')
      });
    sandbox.stub(TemplatesManager, 'run')
      .onFirstCall()
      .returns(of('test'));
  };

  it('should start return true', (done) => {
    stubForCallingStart();
    new Start().start()
      .subscribe(
        (res) => {
          expect(res)
            .to
            .be
            .equal(true);
          done();
        },
        (err) => {
          done(err);
        }
      );
  });

  it('should run return true', (done) => {
    stubForCallingStart();
    sandbox.stub(DB, 'initialize')
      .returns(of({
        configuration() {
          return {
            state() {
              return {installedPath: 'test.json'};
            }
          };
        }
      }));
    new Start().run()
      .subscribe(
        (res) => {
          expect(res).to.be.equal(true);
          done();
        },
        (err) => {
          done(err);
        }
      );
  });
});