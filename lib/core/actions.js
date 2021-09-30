const fs = require('fs')
const { sep, resolve } = require('path')
const { promisify } = require('util')

const dl = promisify(require('download-git-repo'))

const { reactTsRepo, reactJsRepo } = require('../config/repo-config')

const { ejsCompile, writeToFile } = require('../utils/file')

const languagePath = resolve(__dirname, '../config/local.json')

const createProjectAction = (project, language) => {
  const la = language === ('js' || 'javascript') ? 'js' : 'ts'
  const isJs = la === 'js'
  fs.writeFile(languagePath, JSON.stringify({language: la}), async err => {
    if(!err) {
      console.log(`\x1B[34mMalp CLI v${require('../../package.json').version}\x1B[0m`)
      console.log(`\x1B[32m√\x1B[0m  \x1B[33mYou chose ${isJs ? 'JavaScript' : 'TypeScript'}\x1B[0m`)
      console.log(`⚙️  Creating project in \x1B[1m${process.cwd()}\x1B[0m.`)
      console.log('✨ \x1B[36mmalp helps you create your project, please wait a moment.\x1B[0m\n\n')
      const repo = isJs ? reactJsRepo : reactTsRepo
      await dl(repo, project, { clone: true })
      console.log(`\x1B[32mSuccessfully created project ${project}\x1B[0m.`)
      console.log(`Get started with the following commands:\n`)
      console.log(`\x1B[36m$ cd ${project} \n$ yarn \n$ yarn start\x1B[0m`)
    }else{
      console.log(`\x1B[31m${err}\x1B[0m`)
    }
  })
}
const addRStoreAction = (dest = process.cwd()) => {
  fs.readFile(languagePath, 'utf8', async (err, data) => {
    if(!err) {
      const {language} = JSON.parse(data)
      // 终端路径名字
      const cmdPathArray = dest.split(dest === process.cwd() ? sep : '/')
      const fileName = cmdPathArray[cmdPathArray.length - 1]
      const indexTemplate = await ejsCompile(`react/store/${language}/index.${language}.ejs`)
      const constantsTemplate = await ejsCompile(`react/store/${language}/constants.${language}.ejs`, { fileName })
      const actionTemplate = await ejsCompile(`react/store/${language}/action.${language}.ejs`)
      const reducerTemplate = await ejsCompile(`react/store/${language}/reducer.${language}.ejs`)
      fs.mkdir(`${dest}/store`, err => {
        if(!err) {
          // 写入文件
          writeToFile(resolve(dest, `store/index.${language}`), indexTemplate)
          writeToFile(resolve(dest, `store/constants.${language}`), constantsTemplate)
          writeToFile(resolve(dest, `store/actionCreators.${language}`), actionTemplate)
          writeToFile(resolve(dest, `store/reducer.${language}`), reducerTemplate)
          console.log(`\x1B[32mSuccess: The store module is created in ${dest}\x1B[0m`)
        }else{
          console.log(`\x1B[31mError: The file already exists, mkdir ${dest}\x1B[0m`)
        }
      })
    }else{
      console.log(`\x1B[31m${err}\x1B[0m`)
    }
  })
}

module.exports = {
  createProjectAction,
  addRStoreAction
}