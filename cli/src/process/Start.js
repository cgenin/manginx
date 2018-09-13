const {Observable} = require('rxjs/Rx');
const path = require('path');
const childProcess = require('child_process');
const DB = require('../db');
const NginxConfiguration = require('../conf/NginxConfiguration');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('nginx\'s logs -> ');
const {create} = Observable;

function logOutput(buf) {
  const lines = buf.toString()
    .split('\n');
  lines.forEach((line) => {
    if (line.length) {
      if (line.match(/\[debug\]/)) {
        logger.info('d:', line);
      } else {
        logger.info(line);
      }
    }
  });
}

class Start {
  constructor(port) {
    this.port = port || process.env.MANGINX_PORT || 80;
  }

  static testIfExist(commandName) {
    return create((observer) => {
      const nginx = childProcess.spawn(commandName, ['-v']);
      nginx.stdout.on('data', logOutput);
      nginx.stderr.on('data', logOutput);
      nginx.stderr.on('data', (buff) => {
        if (buff.toString()
          .match(/nginx version/)) {
          observer.next(commandName);
          observer.complete();
        } else {
          observer.error(new Error('No nginx global command found.'));
          observer.complete();
        }
      });
    });
  }

  static launch(command, confFile) {
    const cwd = path.resolve(confFile, '..');
    return create((observer) => {
      let started = false;
      const nginx = childProcess.spawn(command, ['-c', confFile], {cwd, detached: true});
      nginx.stdout.on('data', logOutput);
      nginx.stderr.on('data', logOutput);
      nginx.stderr.on('data', (buff) => {
        const str = buff.toString();
        if (!started && str.match(/start worker process \d+/)) {
          started = true;
          observer.next(true);
          observer.complete();
        }
      });
    });
  }

  start(nginxPath) {
    // if current install not defined, try to test if nginx exist in the PATH.
    const commandName = nginxPath || 'nginx';
    if (!nginxPath) {
      logger.info('No Installed nginx found. Used global installation instead.');
    }
    return Start.testIfExist(commandName)
      .do(() => logger.info(`Use Port : ${this.port}`))
      .flatMap(c => NginxConfiguration.run(this.port)
        .last()
        .flatMap((confFile) => {
          logger.info(`Start process of ${confFile}`);
          return Start.launch(c, confFile);
        }));
  }

  run() {
    return DB.initialize()
      .flatMap((db) => {
        const conf = db.configuration()
          .state();
        return this.start(conf.installedPath);
      });
  }
}

module.exports = Start;