/* eslint-disable no-mixed-operators,no-param-reassign */
const path = require('path');
const winston = require('winston');
const env = require('./env');

const rootDir = env.getConfFileRootDir();
const {format, transports} = winston;


const arrayTransport = [
  new transports.File({
    filename: path.resolve(rootDir, 'manginx.error.log'),
    level: 'error'
  }),
  new transports.File({filename: path.resolve(rootDir, 'combined.log')}),
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  })
];

const logger = winston.createLogger({
  level: 'info',
  format: format.json(),
  transports: arrayTransport
});

module.exports = {
  logger,
  winston,
  createCategoryLogger(name) {
    const addCat = obj => `${name} ${obj}`;
    return {
      info(obj) {
        logger.info(addCat(obj));
      },
      error(obj) {
        logger.error(addCat(obj));
      }
    };
  }
};