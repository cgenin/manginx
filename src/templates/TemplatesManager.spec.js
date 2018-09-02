const sinon = require('sinon');
const mock = require('mock-require');
const fs = require('fs-extra');
const Rx = require('rxjs/Rx');
const {expect} = require('chai');
const TemplatesModel = require('../models/TemplatesModel');

class MainConfigurationMock {
  constructor(targetDirectory) {

    expect(fs.pathExistsSync(targetDirectory))
      .to
      .be
      .equal(true);
  }

  generate() {
    return Rx.Observable.of('test2');
  }
}

class TemplatesConfigurationMock {
  constructor(useTemplates, targetDirectory) {
    expect(fs.pathExistsSync(targetDirectory))
      .to.be.equal(true);
    expect(useTemplates).to.be.empty;
  }

  generate() {
    return Rx.Observable.of('test1');
  }
}

describe('TemplatesManager\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    mock.stopAll();
  });

  it('should run', (done) => {
    let index = 1;
    sandbox.stub(TemplatesModel, 'toArray')
      .returns(Rx.Observable.of([]));
    mock('../conf/MainConfiguration', MainConfigurationMock);
    mock('../conf/TemplatesConfiguration', TemplatesConfigurationMock);
    const TemplatesManager = mock.reRequire('./TemplatesManager');
    TemplatesManager.run()
      .subscribe(
        (res) => {
          expect(res).to.be.equal(`test${index}`);
          index = index + 1;
        },
        err => done(err),
        () => {
          done();
        }
      );
  });
});