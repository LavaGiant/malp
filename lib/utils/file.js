const path = require('path')
const fs = require('fs')

const ejs = require('ejs')

const ejsCompile = (templateName, data={}, options = {}) => {
  const templatePosition = `../templates/${templateName}`
  const templatePath = path.resolve(__dirname, templatePosition)
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { data }, options, (err, result) => {
      if(err) return reject(err)
      resolve(result)
    })
  })
}

const writeToFile = (path, content) => {
  if (fs.existsSync(path)) {
    console.log('\x1B[31mThe file already exists\x1B[0m')
    return;
  }
  return fs.promises.writeFile(path, content)
}

module.exports = {
  ejsCompile,
  writeToFile
}
