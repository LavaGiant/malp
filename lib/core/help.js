const program = require('commander')
const helpOptions = () => {
  program.option('-l, --language', 'The language you choose')
  program.option('-d, --dest <dest>', 'a destination folder, 例如: -d src/pages, 错误/src/pages（需要在项目根路径进行）');
}

module.exports = helpOptions
