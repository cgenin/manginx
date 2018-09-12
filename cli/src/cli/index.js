/* eslint-disable no-underscore-dangle */
const {Command} = require('commander');
const templateCommand = require('./templateCommand');
const Start = require('../process/Start');
const Stop = require('../process/Stop');
const CurrentModel = require('../models/CurrentModel');
const {createCategoryLogger} = require('../Logger');
const packageJson = require('../../package');

const logger = createCategoryLogger('Manginx');

const portDescription = 'Port definition. Used by \'start\' and \'restart\' command. By default : 80 ';
const portCommand = '-p, --port <n>';

module.exports = (args, successCallback, errorCallback) => {
  const program = new Command('manginx');
  program
    .version(packageJson.version);

  const getStart = (cmd) => {
    const {port} = cmd;
    if (port) {
      return new Start(port);
    }
    return new Start();
  };

  program
    .command('start')
    .alias('-s')
    .option(portCommand, portDescription, parseInt)
    .description('Start nginx')
    .action((cmd) => {
      getStart(cmd)
        .run()
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
    .alias('-k')
    .description('Stop all nginx process.')
    .action(() => {
      new Stop().run()
        .subscribe((res) => {
          if (res) {
            logger.info('All processes stopped. 🌈');
          }
          successCallback();
        }, (err) => {
          logger.error(err);
          errorCallback();
        });
    });


  program
    .command('restart')
    .alias('-r')
    .option(portCommand, portDescription, parseInt)
    .description('restart the server')
    .action((cmd) => {
      new Stop().run()
        .flatMap(() => {
          logger.info('process successfully stopped.');
          return getStart(cmd)
            .run();
        })
        .catch((err) => {
          if (err._errors && err._errors[0]) {
            logger.error(err._errors[0].message);
          } else {
            logger.error(err);
          }
          return getStart(cmd)
            .run();
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
    .description('Command for registering, list or remove templates. tape "template -h" for more information')
    .action((otherArgs) => {
      const arr = [process.argv[0], process.argv[1]].concat(otherArgs);
      templateCommand(arr, successCallback, errorCallback);
    });

  program.command('use <name>')
    .alias('-u')
    .description(' add an template to the next nginx configuration')
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

  program.command('list')
    .alias('-l')
    .description('List the used templates')
    .action(() => {
      logger.info('*** Used Templates : *** ');
      CurrentModel.list()
        .subscribe(
          (res) => {
            logger.info(`*** ${res.name} 🚀`);
          }, (err) => {
            logger.error(err);
            errorCallback();
          },
          () => {
            logger.info('*** End *** ');
            successCallback();
          }
        );
    });

  program.command('delete <name>')
    .alias('-d')
    .description('Remove an configuration template')
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

  program.parse(args);
};
