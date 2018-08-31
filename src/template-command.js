const program = require('commander');
const {createCategoryLogger} = require('./Logger');
const Templates = require('./models/TemplatesModel');

const logger = createCategoryLogger('Template -> ');

const addCmd = 'add <name> <confFile>';
const addDescription = 'Add an new template';

const removeCmd = 'remove <name>';
const removeDescription = 'Remove an template';


const listCmd = 'list';
const listDescription = 'list all registered templates';


module.exports = (args, successCallback, errorCallback) => {
  program
    .command(addCmd)
    .description(addDescription)
    .action((name, confFile) => {
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

  if (!args || args.length === 0) {
    logger.info(`use the command : add, remove, list.
        - ${addCmd} : ${addDescription}.
        - ${removeCmd} : ${removeDescription}.
        - ${listCmd} : ${listDescription}.
         
      `);
  }
  const arr = [process.argv[0], process.argv[1]].concat(args);
  program.parse(arr);
};