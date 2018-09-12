const path = require('path');
const uuid = require('uuid/v1');
const tempDir = require('temp-dir');
const {expect} = require('chai');

const WindowsRequiredDirs = require('./WindowsRequiredDirs');
const absPath = path.resolve(tempDir, `test${uuid()}`);

describe('WindowsRequiredDirs\'s test', () => {
  it('should generate', (done) => {
    new WindowsRequiredDirs(absPath)
      .generate()
      .subscribe(
        (dir) => {
          expect((dir.indexOf('logs') !== -1 || dir.indexOf('temp') !== -1)).to.be.equal(true);
        },
        err => done(err),
        () => done());
  });
});