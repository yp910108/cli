const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const minimist = require('minimist')
const homeDir = require('osenv').home() // 跨平台
const mkdirp = require('mkdirp') // 跨平台
const inquirer = require('inquirer')
const yoemanEnv = require('yeoman-environment').createEnv()
const pkg = require('./package.json')
const execSync = require('child_process').execSync
const Utils = require('./utils')

class M extends Utils {
  constructor(args) {
    super()
    this.args = args
    this.bindTools()
    this.checkTplDir()
    const cmdArr = fs
      .readdirSync(path.join(__dirname, 'script'))
      .map(item => item.split('.')[0])
    if (!cmdArr.includes(process.argv[2])) {
      console.log('Usage: ycli <command> [options]\n')
      console.log('Options:')
      cmdArr.forEach(item => console.log(`  ${item}`))
      if (process.argv[2]) {
        console.log(
          chalk.red(`\n  Unknown option ${chalk.yellow(process.argv[2])}.`)
        )
      }
    } else {
      const cmd = require(path.join(__dirname, 'script', process.argv[2]))
      this.checkCliUpdate()
      cmd.call(this) // script 里的命令函数可读取 this 实例
    }
  }
  bindTools() {
    this.chalk = chalk
    this.dir = {
      home: homeDir,
      tpl: path.join(homeDir, '.maoda'),
      cwd: process.cwd()
    }
    this.yoemanEnv = yoemanEnv
    this.inquirer = inquirer
  }
  checkCliUpdate() {
    const pkgName = pkg.name
    const version = pkg.version
    try {
      const ltsVersion = execSync(`npm view ${pkgName} version`) + ''
      if (ltsVersion.trim() !== version) {
        this.console(
          `cli 版本过旧，建议执行 npm i -g ${pkgName}@latest 升级 cli：${version} -> ${ltsVersion}`
        )
      }
    } catch (e) {
      // do nothing
    }
  }
  checkTplDir() {
    mkdirp(this.dir.tpl)
    const pkgFile = path.join(this.dir.tpl, 'package.json')
    if (!fs.existsSync(pkgFile)) {
      fs.writeFileSync(
        pkgFile,
        JSON.stringify({
          name: '_',
          description: '_',
          repository: '_',
          license: 'MIT'
        })
      )
    }
  }
  console(data, color = 'yellow') {
    const fn = chalk[color] || chalk.yellow
    console.log(fn(data))
  }
}

module.exports = new M(minimist(process.argv))
