const program = require('commander')

const { createProjectAction, addRStoreAction } = require('./actions')
const { errorLog } = require('../utils/log')

const createCommends = () => {
  program
    .command('create <project>')
    .description('clone a repository into a folder')
    .action(project => createProjectAction(project))
  program
    .command('add <modules>')
    .description('add project module, include: store')
    .action(modules => {
      if (modules === 'store') {
        addRStoreAction()
      } else {
        errorLog(`The ${modules} module is not currently supported.`)
      }
    })
}
module.exports = createCommends
