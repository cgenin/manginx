const sinon = require('sinon');
const Rx = require('rxjs/Rx');
const {throwError} = require('rxjs');
const mock = require('mock-require');
const {expect} = require('chai');
const CurrentModel = require('../models/CurrentModel');
const command = require('./index');

describe('cli\'s test', () => {

  function ko() {
    return {run: () => Rx.Observable.of(false)};
  }

  function ok() {
    return {run: () => Rx.Observable.of(true)};
  }

  function error() {
    return {run: () => throwError('An Error')};
  }

  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  /**
   * Command Start
   */

  it('should OK when Start an conf', (done) => {

    mock('../process/Start', ok);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'start'], () => done(), err => done(err));
  });

  it('should OK when Not start', (done) => {

    mock('../process/Start', ko);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'start'], () => done(), err => done(err));
  });
  it('should OK when start launch Error', (done) => {

    mock('../process/Start', error);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'start'], () => done(new Error()), () => done());
  });

  /**
   * Command Stop
   */

  it('should OK when Stop', (done) => {
    mock('../process/Stop', ok);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'stop'], () => done(), err => done(err));
  });

  it('should OK when Not stop', (done) => {
    mock('../process/Stop', ko);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'stop'], () => done(), err => done(err));
  });
  it('should OK when stop launch Error', (done) => {
    mock('../process/Stop', error);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'stop'], () => done(new Error()), () => done());
  });

  /**
   * Command Restart
   */

  it('should OK when Restart', (done) => {
    mock('../process/Start', ok);
    mock('../process/Stop', ok);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'restart'], () => done(), err => done(err));
  });

  it('should OK when Not stop and start OK', (done) => {
    mock('../process/Start', ok);
    mock('../process/Stop', ko);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'restart'], () => done(), err => done(err));
  });

  it('should OK when stop launch Error and start ok', (done) => {
    mock('../process/Start', ok);
    mock('../process/Stop', error);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'restart'], () => done(), (err) => done(err));
  });
  it('should OK when stop ok  and start launch Error ', (done) => {
    mock('../process/Start', error);
    mock('../process/Stop', ok);
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'restart'], () => done(), (err) => done(err));
  });

  /**
   * Command template
   */
  it('should command template call external function', (done) => {
    mock('./templateCommand', (args, successCallback) => {
      expect(args.length)
        .to
        .be
        .equal(4);
      expect(args[2])
        .to
        .be
        .equal('test1');
      expect(args[3])
        .to
        .be
        .equal('test2');
      successCallback();
    });
    const cmd = mock.reRequire('./index');
    cmd(['node', 'index.js', 'template', 'test1', 'test2'], () => done(), err => done(err));
  });

  /**
   * Command List
   */

  it('should OK when list used template', (done) => {
    sandbox.stub(CurrentModel, 'list')
      .returns(Rx.Observable.of({name: 'test'}));
    command(['node', 'index.js', 'list'], () => done(), err => done(err));
  });


  it('should OK when list used template with error', (done) => {
    sandbox.stub(CurrentModel, 'list')
      .returns(throwError('An error'));
    command(['node', 'index.js', 'list'], () => done(new Error('not OK')), () => done());
  });

  /**
   * Command Add
   */

  it('should OK current when add an template', (done) => {
    sandbox.stub(CurrentModel, 'add')
      .returns(Rx.Observable.of(true));
    command(['node', 'index.js', 'use', 'test'], () => done(), err => done(err));
  });
  it('should OK current when add an template which does not exist', (done) => {
    sandbox.stub(CurrentModel, 'add')
      .returns(Rx.Observable.of(false));
    command(['node', 'index.js', 'use', 'test'], () => done(), err => done(err));
  });
  it('should OK current when add an template with error', (done) => {
    sandbox.stub(CurrentModel, 'add')
      .returns(throwError('An error'));
    command(['node', 'index.js', 'use', 'test'], () => done(new Error('not OK')), () => done());
  });

  /**
   * Command Delete
   */

  it('should OK current when remove an used template', (done) => {
    sandbox.stub(CurrentModel, 'remove')
      .returns(Rx.Observable.of(true));
    command(['node', 'index.js', 'delete', 'test'], () => done(), err => done(err));
  });
  it('should OK current when remove an used template which does not exist', (done) => {
    sandbox.stub(CurrentModel, 'remove')
      .returns(Rx.Observable.of(false));
    command(['node', 'index.js', 'delete', 'test'], () => done(), err => done(err));
  });
  it('should OK current when remove an used template with error', (done) => {
    sandbox.stub(CurrentModel, 'remove')
      .returns(throwError('An error'));
    command(['node', 'index.js', 'delete', 'test'], () => done(new Error('not OK')), () => done());
  });
});