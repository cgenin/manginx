const { Observable } = require('rxjs/Rx');
const {exec} = require('child_process');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('npm:');
const {
  create
} = Observable;

const install = createdDirectory => create((observer) => {
  const cmd = exec('npm install', {
    cwd: createdDirectory,
    maxBuffer: 200 * 1024
  }, (error) => {
    if (error) {
      observer.error(error);
    } else {
      observer.complete();
    }
  });

  cmd.stdout.on('data', msg => logger.info(msg));
  cmd.stderr.on('data', msg => logger.error(msg));
});

module.exports = {install};