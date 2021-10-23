const program = require('commander')
const chalk = require('chalk')
const {createProjectAction, addRStoreAction} = require('./actions')

const createCommends = () => {
  program
    .command('create <project>')
    .description('clone a repository into a folder')
    .action(project => createProjectAction(project))
  program
    .command('add <modules>')
    .description('add project module, include: store')
    .action(modules => {
      if(modules === 'store') {
        addRStoreAction()
      }else{
        console.log(chalk.red(`The ${modules} module is not currently supported.`))
      }
    })
}
module.exports = createCommends
