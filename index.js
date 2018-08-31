#!/usr/bin/env node

const successCallback = () => {
  process.exit();
};

const errorCallback = () => {
  process.exit(1);
};

require('./src/main')(process.argv, successCallback, errorCallback);