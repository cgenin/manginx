const sinon = require('sinon');
const { Observable } = require('rxjs/Rx');
const {throwError} = require('rxjs');
const {expect} = require('chai');
const TemplatesModel = require('./models/TemplatesModel');
const {Register} = require('./Export');
const db = require('./db');

const { of } = Observable;

describe('Export\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(db, 'initialize').returns(of({}));

  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should register if all good', () => {
    sandbox.stub(TemplatesModel, 'remove').returns(of(true));
    sandbox.stub(TemplatesModel, 'add').returns(of(true));
    new Register(__filename).run({name:'test', src:'src'});
  });


  it('should register without error if not added', () => {
    sandbox.stub(TemplatesModel, 'remove').returns(of(false));
    sandbox.stub(TemplatesModel, 'add').returns(of(false));
    new Register(__filename).run({name:'test not added', src:'src'});
  });

  it('should register without error if an error occur', () => {
    sandbox.stub(TemplatesModel, 'remove').returns(throwError('An Error'));
    new Register(__filename).run({name:'test not added', src:'src'});
  });

  it('should register with error if not correctly called', () => {
    try{
      new Register(__filename).run();
    } catch (e) {
      expect(e.message).to.be.string('template');
    }
  });

});