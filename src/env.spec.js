/* eslint-disable no-undef,no-unused-expressions */
const env = require('./env');
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
});