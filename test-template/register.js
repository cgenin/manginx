const path = require('path');
const {Register} = require('@manginx/cli');
const packageJson = require('./package');

const {name} = packageJson;
const src = path.resolve(__dirname, 'location.conf');
new Register(__filename).run({name, src});