const fs = require('fs').promises
const { sep, resolve } = require('path')
const { promisify } = require('util')

const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const dl = promisify(require('download-git-repo'))

const { reactTsRepo, reactJsRepo } = require('../config/repo-config')

const { ejsCompile, writeToFile } = require('../utils/file')
const { errorLog, successLog } = require('../utils/log')

const languagePath = resolve(__dirname, '../config/local.json')

const createProjectAction = async project => {
  const { language } = await inquirer.prompt({
    type: 'list',
    name: 'language',
    message: 'Choose the language you want to use',
    choices: ['TypeScript', 'JavaScript']
  })
  const isJs = language === 'JavaScript'
  try {
    await fs.writeFile(languagePath, JSON.stringify({ language }))
    console.log(chalk.gray(`Malp CLI v${require('../../package.json').version}\n`))
    console.log(`✨ Creating project in ${chalk.underline(process.cwd())}.`)
    const spinner = ora(chalk.cyan('malp helps you create your project, please wait a moment.'))
    spinner.start()
    const repo = isJs ? reactJsRepo : reactTsRepo
    try {
      await dl(repo, project, { clone: true })
      spinner.succeed()
      successLog(`Successfully created project ${project}.`)
      console.log(`Get started with the following commands:\n`)
      console.log(chalk.cyan(`$ cd ${project} \n$ yarn \n$ yarn start`))
    } catch (e) {
      spinner.fail()
      errorLog('Network problem, please try again.')
    }
  } catch (err) {
    errorLog(err)
  }
}

const addRStoreAction = async () => {
  let dest = process.cwd()
  const { isAddPath } = await inquirer.prompt({
    type: 'confirm',
    name: 'isAddPath',
    message: `${dest} This path will be added.`,
    default: true
  })
  if (!isAddPath) {
    const { inputAddPath } = await inquirer.prompt({
      type: 'input',
      message: 'Please enter manually(Example: src/pages/index).',
      name: 'inputAddPath'
    })
    dest = inputAddPath
  }
  try {
    const data = await fs.readFile(languagePath, 'utf8')
    const language = JSON.parse(data)?.language === 'TypeScript' ? 'ts' : 'js'
    // 终端路径名字
    const cmdPathArray = dest.split(dest === process.cwd() ? sep : '/')
    const fileName = cmdPathArray[cmdPathArray.length - 1]
    const indexTemplate = await ejsCompile(`react/store/${language}/index.${language}.ejs`)
    const constantsTemplate = await ejsCompile(`react/store/${language}/constants.${language}.ejs`, { fileName })
    const actionTemplate = await ejsCompile(`react/store/${language}/action.${language}.ejs`)
    const reducerTemplate = await ejsCompile(`react/store/${language}/reducer.${language}.ejs`)
    try {
      await fs.mkdir(`${dest}/store`)
      writeToFile(resolve(dest, `store/index.${language}`), indexTemplate)
      writeToFile(resolve(dest, `store/constants.${language}`), constantsTemplate)
      writeToFile(resolve(dest, `store/actionCreators.${language}`), actionTemplate)
      writeToFile(resolve(dest, `store/reducer.${language}`), reducerTemplate)
      successLog(`Success: The store module is created in ${dest}.`)
    } catch (e) {
      errorLog(`Error: The file already exists, mkdir ${dest}.`)
    }
  } catch (err) {
    errorLog(err)
  }
}

const chooseLanguageAction = async () => {
  try {
    const data = await fs.readFile(languagePath, 'utf8')
    const language = JSON.parse(data)?.language
    const otherLanguage = language === 'TypeScript' ? 'JavaScript' : 'TypeScript'
    const { isChange } = await inquirer.prompt({
      type: 'confirm',
      name: 'isChange',
      message: `The currently selected language is ${chalk.blue(language)}. Do you want to change it to ${chalk.blue(otherLanguage)}?`,
      default: true
    })
    isChange && await fs.writeFile(languagePath, JSON.stringify({ language: otherLanguage }))
  } catch (err) {
    errorLog(err)
  }
}

module.exports = {
  createProjectAction,
  addRStoreAction,
  chooseLanguageAction
}