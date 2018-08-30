/* eslint-disable no-underscore-dangle */
const program = require('commander');
const templateCommand = require('./template-command');
const Start = require('./process/Start');
const Stop = require('./process/Stop');
const {createCategoryLogger} = require('./Logger');
const packageJson = require('../package');

const logger = createCategoryLogger('Manginx');

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
        process.exit();
      }, (err) => {
        console.error(err);
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
        process.exit();
      }, (err) => {
        logger.error(err);
        process.exit(1);
      });
  });

program
  .command('template [otherArgs...]')
  .action((otherArgs) => {
    templateCommand(otherArgs);
  });

program.parse(process.argv);