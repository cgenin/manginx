const sinon = require('sinon');
const Rx = require('rxjs/Rx');
const {throwError} = require('rxjs');
const {expect} = require('chai');
const {DEFAULT_TEMPLATE} = require('../env');

const Templates = require('../models/TemplatesModel');
const templateCommand = require('./templateCommand');

const defModel = {
  name: 'n',
  src: '/src'
};

describe('template-command\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should default', (done) => {
    sandbox.stub(Templates, 'list')
      .returns(Rx.Observable.of(defModel));
    templateCommand(['node', 'index.js'], () => done(), err => done(err));
  });
  it('should list', (done) => {
    sandbox.stub(Templates, 'list')
      .returns(Rx.Observable.of(defModel));
    templateCommand(['node', 'index.js', 'list'], () => done(), err => done(err));
  });
  it('should list when error occured', (done) => {
    sandbox.stub(Templates, 'list')
      .returns(throwError('An error message'));
    templateCommand(['node', 'index.js', 'list'], () => done(new Error('not ok')), err => done());
  });
  it('should OK if add with result added', (done) => {
    sandbox.stub(Templates, 'add')
      .returns(Rx.Observable.of(true));
    templateCommand(['node', 'index.js', 'add', 'test', '/mon/path'], () => done(), err => done(err));
  });
  it('should OK when template is not added', (done) => {
    sandbox.stub(Templates, 'add')
      .returns(Rx.Observable.of(false));
    templateCommand(['node', 'index.js', 'add', 'test', '/mon/path'], () => done(), err => done(err));
  });
  it('should  OK when template added with error', (done) => {
    sandbox.stub(Templates, 'add')
      .returns(throwError('an error occured'));
    templateCommand(['node', 'index.js', 'add', 'test', '/mon/path'], () => done(new Error('not  OK')), err => done());
  });
  it('should add with error if default templates', (done) => {
    try {
      templateCommand(['node', 'index.js', 'add', DEFAULT_TEMPLATE, '/mon/path'], () => done(new Error('not OK')), err => done(err));
    } catch (e) {
      // TEST OK
      done();
    }
  });

  it('should  OK when template removed ', (done) => {
    sandbox.stub(Templates, 'remove')
      .returns(Rx.Observable.of(true));
    templateCommand(['node', 'index.js', 'remove', 'test'], () => done(), err => done(err));
  });

  it('should  OK when template removed with error', (done) => {
    sandbox.stub(Templates, 'remove')
      .returns(throwError('an error occured'));
    templateCommand(['node', 'index.js', 'remove', 'test'], () => done(new Error('not  OK')), err => done());
  });
});