const program = require('commander')
const {createProjectAction, addRStoreAction} = require('./actions')

const createCommends = () => {
  program
    .command('create <project>')
    .description('clone a repository into a folder')
    .action(project => createProjectAction(project))
  program
    .command('add store')
    .description('add store module')
    .action(addRStoreAction)
}
module.exports = createCommends
