const sinon = require('sinon');
const {expect} = require('chai');
const Stop = require('./Stop');

describe('Stop\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should kill', (done) => {
    new Stop(() => Promise.resolve('test')).run()
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