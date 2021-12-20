const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

operation()

function operation() {
  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'O que você deseja fazer?',
    choices: [
      'Criar conta',
      'Consultar Saldo',
      'Depositar',
      'Sacar',
      'Sair'
    ]
  }]).then((answer) => {
    const action = answer['action']

    if(action === "Criar conta") {
      createAccount()
    } else if(action === "Consultar Saldo") {

    } else if(action === "Depositar") {
      deposit()
    } else if(action === "Sacar") {

    } else if(action === "Sair") {
      console.log(chalk.bgBlue('Obrigado por utilizar o Accounts!'))
      process.exit() //Encerra a execução do sistema
    } else {
      console.log(bgRed('Você selecionou uma opção inválida! Selecione novamente:'))
      operation()
    }

  }).catch((err) => console.log(err))
}

//create an account
function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
  console.log(chalk.bgGreen('Defina as opções da sua conta a seguir:'))

  buildAccount()
}

function buildAccount() {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Escreva um nome para sua conta:'
    }
  ]).then((answer) => {
    const nameAccount = answer['accountName']
    console.info(nameAccount)

    if(!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts')
    }

    if(fs.existsSync(`accounts/${nameAccount}.json`)) {
      console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome:'))
      buildAccount()
      return
    }

    fs.writeFileSync(`accounts/${nameAccount}.json`, '{"balance": 0}',
    (err) => {
      console.log(err)
    })

    console.log(chalk.green('Parabéns, a sua conta foi criada!'))
    operation()
    
  }).catch((err) => console.log(err))
}

// add an amount to user account
function deposit() {
  inquirer.prompt([
  {
    name: 'account',
    message: 'Qual o nome da conta que você gostaria de depositar?'
  },
  {
    name: 'deposit',
    message: 'Digite o valor  que você deseja depositar: '
  }
  ]).then((answer) => {
    const accountName = answer['account']
    const valueDeposit = answer['deposit']

    if(!checkAccount(accountName)) {
      return deposit()
    }

  }).catch((err) => console.log(err))
}

function checkAccount(accountName) {
  if(!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Essa conta não existe, tente novamente!'))
    return false
  }

  return true
}