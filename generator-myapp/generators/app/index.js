const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name: ',
        default: 'test-project'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'choose a framework',
        choices: ['React', 'Vue', 'Angular'],
        default: 'React'
      }
    ]
    return this.prompt(prompts).then(answers => {
      this.name = answers.name
      this.framework = answers.framework
    })
  }
  writing() {
    this.fs.copyTpl(this.templatePath(), this.destinationPath(this.name))
  }
}
