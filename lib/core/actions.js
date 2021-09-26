const fs = require('fs')
const { sep, resolve } = require('path')
const { promisify } = require('util')

const dl = promisify(require('download-git-repo'))

const { reactTsRepo, reactJsRepo } = require('../config/repo-config')

const { ejsCompile, writeToFile } = require('../utils/file')

const createProjectAction = async (project, language) => {
  // 1.提示信息
  console.log('malp helps you create your project, please wait a moment~');
  const repo = language === ('js' || 'javascript') ? reactJsRepo : reactTsRepo
  await dl(repo, project, { clone: true })
}

const addRStoreAction = async (dest = process.cwd()) => {
  // 终端路径名字
  const cmdPathArray = dest.split(sep)
  const fileName = cmdPathArray[cmdPathArray.length - 1]
  const indexTemplate = await ejsCompile('react/store/ts/index.ts.ejs')
  const constantsTemplate = await ejsCompile('react/store/ts/constants.ts.ejs', { fileName })
  const actionTemplate = await ejsCompile('react/store/ts/action.ts.ejs')
  const reducerTemplate = await ejsCompile('react/store/ts/reducer.ts.ejs')
  fs.mkdirSync(`${dest}/store`)
  // 写入文件
  writeToFile(resolve(dest, `store/index.ts`), indexTemplate)
  writeToFile(resolve(dest, `store/constants.ts`), constantsTemplate)
  writeToFile(resolve(dest, `store/actionCreators.ts`), actionTemplate)
  writeToFile(resolve(dest, `store/reducer.ts`), reducerTemplate)
}

module.exports = {
  createProjectAction,
  addRStoreAction
}