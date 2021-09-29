const program = require('commander')
const {createProjectAction, addRStoreAction} = require('./actions')

const createCommends = () => {
  program
    .command('create <project>')
    .description('clone a repository into a folder')
    .action(project => createProjectAction(project, program.opts().language))
  program
    .command('add store')
    .description('add store module, 例如: malp add store -d pages/index')
    .action(_ => addRStoreAction(program.opts().dest))
}
module.exports = createCommends
