/* eslint-disable no-undef,no-unused-expressions */
const env = require('./env');
const fs = require('fs-extra');
const {expect} = require('chai');

describe('test of env class', () => {
  it('should getConfFileRootDir return not null', () => {
    const confFileRootDir = env.getConfFileRootDir();
    expect(confFileRootDir).to.be.not.null;
    expect(confFileRootDir).to.be.not.empty;
  });
  it('should getDbFilePath return not null', () => {
    const confFileRootDir = env.getDbFilePath();
    expect(confFileRootDir).to.be.not.null;
    expect(confFileRootDir).to.be.not.undefined;
    expect(confFileRootDir).to.be.not.empty;
  });

  it('should getInstallDir', () => {
    expect(env.getInstallDir()).to.have.string('manginx');
  });
  it('should targetDir create an empty dir', (done) => {
    env.targetDir().subscribe(
      (res) =>{
        expect(fs.pathExistsSync(res)).to.be.equal(true);
        done();
      },
      (err) => {
        done(err);
      }
    );
  });
});