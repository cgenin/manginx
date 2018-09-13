const sinon = require('sinon');
const mock = require('mock-require');
const fs = require('fs-extra');
const { Observable } = require('rxjs/Rx');
const {expect} = require('chai');
const CurrentModel = require('../models/CurrentModel');

const { of } = Observable;

class MainConfigurationMock {
  constructor(targetDirectory) {

    expect(fs.pathExistsSync(targetDirectory))
      .to
      .be
      .equal(true);
  }

  generate() {
    return of('test2');
  }
}

class TemplatesConfigurationMock {
  constructor(useTemplates, targetDirectory) {
    expect(fs.pathExistsSync(targetDirectory))
      .to.be.equal(true);
    expect(useTemplates).to.be.empty;
  }

  generate() {
    return of('test1');
  }
}

class WindowsRequiredDirsMock {
  constructor(targetDirectory) {
    expect(fs.pathExistsSync(targetDirectory))
      .to.be.equal(true);
  }

  generate() {
    return of('test3');
  }
}

describe('NginxConfiguration\'s test', () => {
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
    sandbox.stub(CurrentModel, 'toArray')
      .returns(of([]));
    mock('./MainConfiguration', MainConfigurationMock);
    mock('./TemplatesConfiguration', TemplatesConfigurationMock);
    mock('./WindowsRequiredDirs', WindowsRequiredDirsMock);
    const TemplatesManager = mock.reRequire('./NginxConfiguration');
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