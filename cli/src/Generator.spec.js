/* eslint-disable no-plusplus */
const path = require('path');
const fs = require('fs-extra');
const { Observable } = require('rxjs/Rx');
const tempDir = require('temp-dir');
const uuid = require('uuid/v1');
const Generator = require('./Generator');
const {expect} = require('chai');

const testTemplate = '<div>{{name}}</div>';
const testTemplate2 = '<span>{{name}}</span>';
const { bindNodeCallback, concat } = Observable;

describe('test Generator class', () => {
  it('should generate template with cache', (done) => {
    let nb = 1;
    const obs = new Generator('id1').compile(testTemplate)
      .generate({name: 'test1'}).toText();
    const obs2 = new Generator('id1').generate({name: 'test2'}).toText();
    concat(obs, obs2).subscribe((t) => {
      expect(t).to.be.equal(`<div>test${nb}</div>`);
      nb++;
      if (nb === 3) {
        done();
      }
    }, (err) => {
      done(err);
    });
  });
  it('should select the good template', (done) => {
    new Generator('id1').compile(testTemplate);
    const obs = new Generator('id2').compile(testTemplate2).generate({name: 'test3'}).toText();
    obs.subscribe((t) => {
      expect(t).to.be.equal('<span>test3</span>');
      done();
    }, (err) => {
      done(err);
    });
  });

  it('should create an file', (done) => {
    const absPath = path.resolve(tempDir, `test${uuid()}`);
    const readFile = bindNodeCallback(fs.readFile);
    new Generator('id1')
      .compile(testTemplate)
      .generate({name: 'test3'})
      .toFile(absPath)
      .flatMap(() => readFile(absPath, 'utf8'))
      .subscribe((txt) => {
        expect(txt).to.be.equal('<div>test3</div>');
        done();
      }, err => done(err));
  });
});