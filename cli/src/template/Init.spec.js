const sinon = require('sinon');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid/v1');
const {Observable} = require('rxjs/Rx');
const tempDir = require('temp-dir');
const {expect} = require('chai');
const Init = require('./Init');
const Npm = require('../process/Npm');

const namePackage = 'dark-vador';

describe('Init\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should init', (done) => {
    sandbox.stub(Npm, 'install').returns(Observable.of('mock'));
    const targetDirectory = path.resolve(tempDir, `test${uuid()}`);
    new Init(namePackage, targetDirectory).run()
      .subscribe(pathCreated => {
          if (pathCreated !== 'mock' ) {
            expect(pathCreated).to.be.string(targetDirectory);
            expect(pathCreated).to.be.string(namePackage);
            if(pathCreated.indexOf('package.json') !== -1) {
              const txt = fs.readFileSync(pathCreated);
              expect(txt.toString()).to.be.string(namePackage);
            }
          }
        },
        err => done(err),
        () => done());
  });
});