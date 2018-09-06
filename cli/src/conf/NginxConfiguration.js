const Rx = require('rxjs/Rx');
const env = require('../env');
const Templates = require('../models/TemplatesModel');
const MainConfiguration = require('./MainConfiguration');
const TemplatesConfiguration = require('./TemplatesConfiguration');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('⚙️');

const generateAllTemplates = (targetDirectory, templates) =>
  Rx.Observable.concat(
    new TemplatesConfiguration(templates, targetDirectory).generate(),
    new MainConfiguration(targetDirectory).generate()
  );

module.exports = {
  run() {
    return env.targetDir()
      .flatMap((targetDirectory) => {
        logger.info(` ✹ Creation of the directory : ${targetDirectory}`);
        return Templates.toArray()
          .flatMap(templates => generateAllTemplates(targetDirectory, templates));
      })
      .do((fileName) => {
        logger.info(` ✹ creation of ${fileName}`);
      });
  }
};
