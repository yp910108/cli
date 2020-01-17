const inquirer = require('inquirer')
const env = require('yeoman-environment').createEnv()

module.exports = () => {
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'input your name'
      },
      {
        name: 'choice',
        type: 'list',
        message: 'choose your favourite fruit',
        choices: ['apple', 'banana', 'mango']
      }
    ])
    .then(answers => {
      console.log(answers)
      env.register(
        require.resolve('../../generator-myapp/generators/app'),
        'myapp'
      )
      env.run('myapp')
    })
}
