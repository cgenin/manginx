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
      Templates.remove(name)
        .subscribe(
          (t) => {
            logger.info(`✖︎ '${t}' was successfully removed.`);
          },
          (err) => {
            logger.error(err);
            errorCallback();
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

  program.help(() => successCallback());

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