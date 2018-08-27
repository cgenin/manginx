/* eslint-disable no-underscore-dangle */
const program = require('commander');
const Start = require('./process/Start');
const Stop = require('./process/Stop');
const {createCategoryLogger} = require('./Logger');

const logger = createCategoryLogger('Manginx');

program
  .command('start')
  .alias('s')
  .description('Start nginx')
  .action(() => {
    new Start().run()
      .subscribe((res) => {
        logger.info(res);
        process.exit();
      }, (err) => {
        logger.error(err);
        process.exit(1);
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
          logger.info('All processes stopped');
        }
      }, err => logger.error(err));
  });


program
  .command('restart')
  .alias('r')
  .description('restart the server')
  .action(() => {
    new Stop().run()
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
          logger.info('Reloaded.');
        }
        process.exit();
      }, (err) => {
        logger.error(err);
        process.exit(1);
      });
  });

program.parse(process.argv);