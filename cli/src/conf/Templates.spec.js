const sinon = require('sinon');
const {expect} = require('chai');
const env = require('../env');
const Templates = require('./Templates');


describe('Templates\'s test', () => {
  const pathUnix = '/tmp/toto/dir';
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should pathFormatter return empty string if null or undefined', () => {
    sandbox.stub(env, 'isWin')
      .returns(true);
   expect( Templates.pathFormatter(null)).to.be.equal('');
   expect( Templates.pathFormatter(undefined)).to.be.equal('');
  });

  it('should pathFormatter return path if path on unix system', () => {
    sandbox.stub(env, 'isWin')
      .returns(false);
    expect( Templates.pathFormatter(pathUnix)).to.be.equal(pathUnix);
  });


  it('should pathFormatter return formatted if path on windows system', () => {
    sandbox.stub(env, 'isWin')
      .returns(true);
    expect( Templates.pathFormatter('c:\\mon\\dir')).to.be.equal('c:/mon/dir');
  });
});