const {DEFAULT_TEMPLATE} = require('../env');
const {createCategoryLogger} = require('../Logger');
const Templates = require('../models/TemplatesModel');
const Init = require('../template/Init');
const {Command} = require('commander');

const logger = createCategoryLogger('Template -> ');

const addCmd = 'add <name> <confFile>';
const addDescription = 'Add an new template';

const removeCmd = 'remove <name>';
const removeDescription = 'Remove an template';


const listCmd = 'list';
const listDescription = 'list all registered templates';

const initCmd = 'init <name>';
const initDescription = 'Initalize an module template';


module.exports = (args, successCallback, errorCallback) => {
  const program = new Command('subCommandTemplate');
  program
    .command(addCmd)
    .description(addDescription)
    .action((name, confFile) => {
      if (name === DEFAULT_TEMPLATE) {
        throw new Error('This name is already used by internal management. Sorry. Please change 😅 ');
      }
      Templates.add({
        name,
        src: confFile
      })
        .subscribe(
          (added) => {
            if (added) {
              logger.info('Successful added. 🌈');
            } else {
              logger.info('This template was not added. 😱');
            }
            successCallback();
          },
          (err) => {
            logger.error(err);
            errorCallback();
          }
        );
    });

  program
    .command(removeCmd)
    .description(removeDescription)
    .action((name) => {
      Templates.remove(name)
        .subscribe(
          (t) => {
            if (t) {
              logger.info(`✖︎ '${name}' was successfully removed.`);
            }
            successCallback();
          },
          (err) => {
            logger.error(err);
            errorCallback();
          }
        );
    });


  program
    .command(initCmd)
    .description(initDescription)
    .action((name) => {
      new Init(name).run()
        .subscribe(
          (t) => {
            logger.info(` * Creation of '${t}'`);
          },
          (err) => {
            logger.error(err);
            errorCallback();
          },
          () => {
            logger.info(' * End of the creation. ');
            logger.info('Please execute these commands for initializing the project :  ');
            logger.info(`$ cd  ${name}`);
            logger.info('$ npm install');
            successCallback();
          }
        );
    });

  program
    .command(listCmd)
    .description(listDescription)
    .action(() => {
      logger.info('** List of the templates : **');
      Templates.list()
        .subscribe(
          (t) => {
            logger.info(`🚔 ${t.name} : ${t.src}`);
          },
          (err) => {
            logger.error(err);
            errorCallback();
          },
          () => {
            logger.info('** End of the list **');
            successCallback();
          }
        );
    });


  if (!args || args.length === 2) {
    logger.info(`use the command : add, remove, list.
        - ${addCmd} : ${addDescription}.
        - ${removeCmd} : ${removeDescription}.
        - ${listCmd} : ${listDescription}.
         
      `);
    successCallback();
    return;
  }
  program.parse(args);
};