const program = require('commander');
const {createCategoryLogger} = require('./Logger');
const Templates = require('./templates/TemplatesModel');

const logger = createCategoryLogger('Template -> ');

const addCmd = 'add <name> <confFile>';
const addDescription = 'Add an new template';

const listCmd = 'list';
const listDescription = 'list all registered templates';


program
  .command(addCmd)
  .description(addDescription)
  .action((name, confFile) => {
    // TODO
  });

program
  .command(listCmd)
  .description(listDescription)
  .action(() => {
    logger.info('List of the templates : ');
    new Templates().list()
      .subscribe(
        (t) => {
          logger.info(`* ${t.name} : ${t.src}`);
        },
        (err) => {
          logger.error(err);
          process.exit(1);
        },
        () => {
          logger.info(' ❌ End of the list');
          process.exit();
        }
      );
  });

module.exports = (args) => {
  if (!args || args.length === 0) {
    logger.info(`use the command : add, remove, list.
        - ${addCmd} : ${addDescription}.
        - ${listCmd} : ${listDescription}.
         
      `);
  }
  const arr = [process.argv[0], process.argv[1]].concat(args);
  program.parse(arr);
};