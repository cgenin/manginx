const { Observable } = require('rxjs/Rx');
const env = require('../env');
const CurrentModel = require('../models/CurrentModel');
const MainConfiguration = require('./MainConfiguration');
const TemplatesConfiguration = require('./TemplatesConfiguration');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('⚙️');
const { concat } = Observable;

const generateAllTemplates = (targetDirectory, templates, port) =>
  concat(
    new TemplatesConfiguration(templates, targetDirectory).generate(),
    new MainConfiguration(targetDirectory, port).generate()
  );

module.exports = {
  run(port) {
    return env.targetDir()
      .flatMap((targetDirectory) => {
        logger.info(` ✹ Creation of the directory : ${targetDirectory}`);
        return CurrentModel.toArray()
          .flatMap(templates => generateAllTemplates(targetDirectory, templates, port));
      })
      .do((fileName) => {
        logger.info(` ✹ creation of ${fileName}`);
      });
  }
};
