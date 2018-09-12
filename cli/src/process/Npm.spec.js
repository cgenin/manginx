const sinon = require('sinon');
const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');
const Mock = require('mock-require');
const {Observable} = require('rxjs/Rx');
const tempDir = require('temp-dir');
const {expect} = require('chai');
const {COMMAND_INSTALL} = require('./Npm');

describe('Npm\'s test', () => {
  const createdDirectory = '/my/dir';
  const testParams = (cmd, opt)=>{
    expect(cmd).to.be.equal(COMMAND_INSTALL);
    const { cwd } = opt;
    expect(cwd).to.be.equal(createdDirectory);
  };

  it('should call npm install without error then OK', (done) => {
    Mock('child_process',{
      exec(cmd, opt, cb){
        testParams(cmd, opt);
        cb();
      }
    });
    Mock.reRequire('./Npm');
    require('./Npm').install(createdDirectory).subscribe(
      () => {},
      err => done(err),
      () => done()
    )
  });

  it('should call npm install with error then OK', (done) => {
    Mock('child_process',{
      exec(cmd, opt, cb){
        testParams(cmd, opt);
        cb(new Error('an error'));
      }
    });
    Mock.reRequire('./Npm');
    require('./Npm').install(createdDirectory).subscribe(
      () => {},
      err => done(),
      () => done(new Error('not ok'))
    )
  });
});