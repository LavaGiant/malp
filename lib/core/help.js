const program = require('commander')
const helpOptions = async () => {
  program.option('-d, --dest <dest>', 'a destination folder, 例如: -d src/pages, 错误/src/pages（需要在项目根路径进行）');
  program.option('-l, --language <language>', 'The language you choose', 'ts')
}

module.exports = helpOptions
