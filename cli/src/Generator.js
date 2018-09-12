const Handlebars = require('handlebars');
const { Observable } = require('rxjs/Rx');
const fs = require('fs-extra');

const { bindNodeCallback, of } = Observable;
const TEMPLATES = {};

class Generator {
  constructor(id) {
    this.id = id;
    this.result = null;
    this.template = TEMPLATES[id];
  }

  compileFromFile(pathToFile) {
    const buff = fs.readFileSync(pathToFile);
    return this.compile(buff.toString());
  }

  compile(text) {
    if (!this.template) {
      TEMPLATES[this.id] = Handlebars.compile(text);
      this.template = TEMPLATES[this.id];
    }
    return this;
  }

  generate(datas) {
    this.result = this.template(datas);
    return this;
  }

  toText() {
    if (!this.template) {
      throw new Error('you must call compile\'s method before');
    }
    if (!this.result) {
      throw new Error('you must call generate\'s method before');
    }
    return of(this.result);
  }

  toFile(filePath) {
    const outputFile = bindNodeCallback(fs.outputFile);
    return this.toText()
      .flatMap(t => outputFile(filePath, t))
      .map(() => filePath);
  }
}

module.exports = Generator;