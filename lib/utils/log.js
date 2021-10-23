const chalk = require('chalk')
const symbols = require('log-symbols')

const errorLog = info => {
  console.log(symbols.error, chalk.red(info))
}

const successLog = info => {
  console.log(symbols.success, chalk.green(info))
}

module.exports = {
  errorLog,
  successLog
}
