const env = require('../env');
/**
 * Util Object for templates class.
 */
module.exports = {
  pathFormatter(path) {
    if (!path) {
      return '';
    }
    if (env.isWin()) {
      return path.replace(/([/\\])/g, '/');
    }
    return path;
  }
};