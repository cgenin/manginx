const sinon = require('sinon');
const Rx = require('rxjs/Rx');
const {expect} = require('chai');
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

  it('should list', (done) => {
    sandbox.stub(Templates, 'list').returns(Rx.Observable.of(defModel));
    templateCommand(['node', 'index.js', 'list'], () => done(), (err) => done(err));
  });

});