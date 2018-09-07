#!/usr/bin/env node

const cli = require('./src/cli');

const successCallback = () => {
  process.exit();
};

const errorCallback = () => {
  process.exit(1);
};

cli(process.argv, successCallback, errorCallback);