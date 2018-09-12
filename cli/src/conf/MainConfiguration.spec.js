const path = require('path');
const tempDir = require('temp-dir');
const uuid = require('uuid/v1');
const fs = require('fs-extra');
const {expect} = require('chai');
const MainConfiguration = require('./MainConfiguration');


describe('MainConfiguration\'s class ', () => {
  const tmpDir = path.resolve(tempDir, uuid());
  fs.mkdirsSync(tmpDir);

  it('should copy mime.types ', (done) => {
    new MainConfiguration(tmpDir, 89, [])
      .copyMimeTypes()
      .subscribe((p) => {
        expect(fs.pathExistsSync(p)).to.be.equal(true);
        done();
      }, err => done(err));
  });

  it('should create main conf file ', (done) => {
    new MainConfiguration(tmpDir, 89, [])
      .generateMainConfFile()
      .subscribe((p) => {
        expect(fs.pathExistsSync(p)).to.be.equal(true);
        done();
      }, err => done(err));
  });

  it('should generate call the copy and the creation of main File', (done) => {
    const mainConfiguration = new MainConfiguration(tmpDir, 89, []);
    const mainconfFilePath = mainConfiguration.getMainconfFilePath();
    const mimetypesFilePath = mainConfiguration.getMimetypesFilePath();
    const paths = [mimetypesFilePath, mainconfFilePath];
    let index = 0;
    mainConfiguration
      .generate()
      .subscribe((p) => {
        const currentPath = paths[index];
        expect(p).to.be.equal(currentPath);
        index += 1;
        if (paths.length === index) { done(); }
      }, err => done(err));
  });
});