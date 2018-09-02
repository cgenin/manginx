const {expect} = require('chai');
const templateCommand = require('./templateCommand');

describe('template-command', () => {
  it('should run without args', (done) => {
    templateCommand(['node', 'index.js'], () => done(), (err) => done(err));
  });
  it('should help', (done) => {
    templateCommand(['node', 'index.js', '-h'], () => done(), (err) => done(err));
  });
});