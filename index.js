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
      checkAmount()
    } else if(action === "Depositar") {
      deposit()
    } else if(action === "Sacar") {
      withdraw()
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
  }
  ]).then((answer) => {
    const accountName = answer['account']

    if(!checkAccount(accountName)) {
      return deposit()
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Digite o valor que você gostaria de depositar:'
      }
    ]).then((answer) => {
      const amount = answer['amount']

      // add an amount
      addAmount(accountName, amount)

    }).catch((err) => console.log(err))

  }).catch((err) => console.log(err))
}

// show account balance
function checkAmount() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Escreva o nome da conta na qual você gostaria de consultar o saldo:'
    }
  ]).then((answer) => {
    const accountName = answer['accountName']

    if(!accountName) {
      console.log('Você não especificou a conta na qual quer ver o saldo!')
      return checkAmount()
    }

    if(!checkAccount(accountName)) {
      return checkAmount()
    }

    checkBalance(accountName)

    operation()
  })
}

// withdraw an amount to user account
function withdraw() {
  inquirer.prompt([
  {
    name: 'account',
    message: 'Qual o nome da conta que você gostaria de sacar?'
  }
  ]).then((answer) => {
    const accountName = answer['account']

    if(!checkAccount(accountName)) {
      return withdraw()
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Digite o valor que você gostaria de sacar:'
      }
    ]).then((answer) => {
      const amount = answer['amount']

      // withdraw an amount
      removeAmount(accountName, amount)

    }).catch((err) => console.log(err))

  }).catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if(amount <= 0) {
    console.log(chalk.red('Não é possível sacar esse valor!'))
    return withdraw()
  }

  if(accountData.balance < amount) {
    console.log(chalk.red('Você NÃO possui esse valor em sua conta!'))
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.log(err) 
  )

  console.log(chalk.green(`O valor de R$${amount} foi retirado de sua conta!`))
  return operation()
}

function checkAccount(accountName) {
  if(!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Essa conta não existe, tente novamente!'))
    return false
  }

  return true
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if(amount <= 0 || !amount) {
    console.log(bgRed.black('Não é possível depositar um valor menor ou igual a zero!'))
    return deposit()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.log(err) 
  )

  console.log(chalk.green(`O valor de R$${amount} foi depositado em sua conta!`))
  return operation()
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r' //ler o arquivo
  })

  return JSON.parse(accountJSON)
}

function checkBalance(accountName) {
  const accountData = getAccount(accountName)
  return console.log(chalk.bgGreen.black(`O saldo total da sua conta é de: R$${accountData.balance}`))
}