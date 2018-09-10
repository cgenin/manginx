const inquirer = require('inquirer');
const Rx = require('rxjs/Rx');

module.exports = () =>
  Rx.Observable.create((observer) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'ctxt',
        message: 'Customize your html file ?',
        choices: [
          'test',
          'dark',
          'vador',
          'luke',
          new inquirer.Separator(),
          'other'
        ]
      }, {
        type: 'input',
        name: 'otherCtxt',
        message: 'You choose \'Other\' option. Please tape your context : ',
        when(answers) {
          return answers.ctxt === 'other';
        }
      }
    ])
      .then((answers) => {
        observer.next(answers);
        observer.complete();
      })
      .catch(err => observer.error(err));
  })
    .map((answers) => {
      const {ctxt, otherCtxt} = answers;
      const chooseCtxt = otherCtxt || ctxt;
      console.log(`After Nginx start, you can access at your custom html file at '/${chooseCtxt}.html'`);

      return {
        comment: 'Static text',
        chooseCtxt
      };
    });
