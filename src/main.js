/* eslint-disable no-underscore-dangle */
const program = require('commander');
const templateCommand = require('./templateCommand');
const Start = require('./process/Start');
const Stop = require('./process/Stop');
const CurrentModel = require('./models/CurrentModel');
const {createCategoryLogger} = require('./Logger');
const packageJson = require('../package');

const logger = createCategoryLogger('Manginx');

module.exports = (args, successCallback, errorCallback) => {
  program
    .version(packageJson.version);

  program
    .command('start')
    .alias('s')
    .description('Start nginx')
    .action(() => {
      new Start().run()
        .subscribe((res) => {
          if (!res) {
            logger.info('Nginx has failed to start 💥');
          } else {
            logger.info('Nginx started 🌈');
          }
          successCallback();
        }, (err) => {
          console.error(err);
          logger.error(err);
          errorCallback();
        });
    });

  program
    .command('stop')
    .alias('k')
    .description('Stop all nginx process.')
    .action(() => {
      new Stop().run()
        .subscribe((res) => {
          if (res) {
            logger.info('All processes stopped. 🌈');
          }
        }, err => logger.error(err));
    });


  program
    .command('restart')
    .alias('r')
    .description('restart the server')
    .action(() => {
      new Stop().run()
        .flatMap(() => {
          logger.info('process succefully stopped.');
          return new Start().run();
        })
        .catch((err) => {
          if (err._errors && err._errors[0]) {
            logger.error(err._errors[0].message);
          } else {
            logger.error(err);
          }
          return new Start().run();
        })
        .subscribe((res) => {
          if (res) {
            logger.info('Reloaded. 🌈');
          }
          successCallback();
        }, (err) => {
          logger.error(err);
          errorCallback();
        });
    });

  program
    .command('template [otherArgs...]')
    .action((otherArgs) => {
      const arr = [process.argv[0], process.argv[1]].concat(otherArgs);
      templateCommand(arr, successCallback, errorCallback);
    });

  program.command('use <name>')
    .action((name) => {
      CurrentModel.add(name)
        .subscribe((res) => {
          if (res) {
            logger.info('Successfully added. 🌈');
          } else {
            logger.info('Command not added. 🚫');
          }
          successCallback();
        }, (err) => {
          logger.error(err);
          errorCallback();
        });
    });

  program.command('eject <name>')
    .action((name) => {
      CurrentModel.remove(name)
        .subscribe((res) => {
          if (res) {
            logger.info('Successfully removed. 🌈');
          } else {
            logger.info('Command failed. 🚫');
          }
          successCallback();
        }, (err) => {
          logger.error(err);
          errorCallback();
        });
    });

  program.help(() => successCallback());
  program.parse(args);
};
