const path = require('path');
const sinon = require('sinon');
const { Observable } = require('rxjs/Rx');
const tempDir = require('temp-dir');
const uuid = require('uuid/v1');
const fs = require('fs-extra');
const {expect} = require('chai');
const env = require('../env');
const TemplatesModel = require('../models/TemplatesModel');
const TemplatesConfiguration = require('./TemplatesConfiguration');
const { of } = Observable;

describe('TemplatesConfiguration\'s class ', () => {
  const src = path.resolve(__filename, '..', 'test.conf');
  const defTemplate = {
    name: 'templatesconfiguration',
    src
  };
  const tmpDir = path.resolve(tempDir, uuid());
  fs.mkdirsSync(tmpDir);

  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should getTemplates with default when empty array', (done) => {
    sandbox.stub(TemplatesModel, 'find').returns(of({
      name: env.DEFAULT_TEMPLATE,
      src: '/test'
    }));
    new TemplatesConfiguration([], tmpDir).getTemplates()
      .subscribe((array) => {
        expect(array.length).to.be.equal(1);
        const obj = array[0];
        expect(obj.name).to.be.equal(env.DEFAULT_TEMPLATE);
        done();
      }, err => done(err));
  });

  it('should getTemplates with the array when the array is not empty', (done) => {
    new TemplatesConfiguration([defTemplate], tmpDir).getTemplates()
      .subscribe((array) => {
        expect(array.length).to.be.equal(1);
        const obj = array[0];
        expect(obj.name).to.be.equal(defTemplate.name);
        expect(obj.src).to.be.equal(defTemplate.src);
        done();
      }, err => done(err));
  });

  it('should generate all the templates', (done) => {
    const delimiter =  (env.isWin()) ? '\\' : '/';
    let index = 0;
    new TemplatesConfiguration([defTemplate], tmpDir).generate()
      .subscribe(
        (pathFile) => {
          if (index === 0) {

            expect(pathFile).to.be.string(delimiter + 'servers');
          }
          if (index === 1) {
            expect(pathFile).to.be.string(delimiter + 'servers' + delimiter + 'test.conf');
          }
          index += 1;
        },
        err => done(err),
        () => done()
      );
  });
});