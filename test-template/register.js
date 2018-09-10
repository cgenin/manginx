const path = require('path');
const {Register} = require('@manginx/cli');
const packageJson = require('./package');

const {name} = packageJson;
const src = path.resolve(__dirname, 'location.conf');
const option = path.resolve(__dirname, 'hook', 'static.js');
const hooks = [option];
new Register(__filename).run(
  // Getting started example
  {name, src},
  {
    name: 'interactive-example',
    src: path.resolve(__dirname, 'interactive.conf'),
    hooks
  }
);