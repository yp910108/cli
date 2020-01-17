const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

class Utils {
  /**
   * 获取某个包的安装情况
   * 返回 0 表示未安装 1 表示安装并非最新 2 表示安装最新
   * @param {*} pkgName
   * @param {*} targetDir
   */
  getInstalledStatus(pkgName, targetDir) {
    const genObj = this.getInstalledPkgs(targetDir)
    if (!genObj[pkgName]) return 0
    const lts = execSync(`npm view ${pkgName} version`) + '' // buffer 转 string
    if (genObj[pkgName] === lts.trim()) return 2
    return 1
  }

  /**
   * 获取路径下已安装的 generator 包
   * @param {*} targetDir
   */
  getInstalledGenerators(targetDir) {
    const dependencies = this.getInstalledPkgs(targetDir)
    Object.keys(dependencies).forEach(v => {
      if (!v.match(/^gen-/)) delete dependencies[v]
    })
    return dependencies
  }

  /**
   * 获取路径下已经安装的包
   * @param {*} targetDir
   */
  getInstalledPkgs(targetDir) {
    const pkgJsonFile = path.join(targetDir, 'package.json')
    if (!fs.existsSync(pkgJsonFile)) return {}
    const pkgJson = require(pkgJsonFile)
    return pkgJson.dependencies || {}
  }

  /**
   * 获取 build 方法
   */
  getBuilderFn() {
    const { builder } = this.getConfigs()
    const status = this.getInstalledStatus(builder, process.cwd())
    switch (status) {
      case 0:
        this.console(
          `检测到工程并未添加${builder}，将自动为您安装最新版`,
          'red'
        )
        this.console(`安装${builder}中...`)
        execSync(`npm i ${builder}@latest -S`, { cwd: process.cwd() })
        break
      case 1:
        this.console(
          `检测到您的${builder}并非最新版，推荐在工程下 npm i ${builder}@latest -S 进行更新`
        )
        break
      default:
    }
    return require(path.join(process.cwd(), 'node_modules', builder))
  }

  getConfigs() {
    let configs
    try {
      configs = require(path.join(process.cwd(), './maoda.js'))
    } catch (e) {
      // do nothing
    }
    if (!configs || !configs.builder) {
      this.console(
        '请确保工程根路径下有 maoda.js 文件，且文件中配置了 builder 属性',
        'red'
      )
      process.exit(1)
    }
    return configs
  }
}

module.exports = Utils
