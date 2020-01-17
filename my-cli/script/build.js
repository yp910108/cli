/**
 * 调用 webpack 构建插件
 */
module.exports = function() {
  const buildFn = this.getBuilderFn()
  const { webpackCustom = {} } = this.getConfigs()
  this.console('开始build')
  buildFn({ env: 'production' }, webpackCustom)
}
