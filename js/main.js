var expenseTransactions = new Array(366);
var incomeTransactions = new Array(366);
var transactionDays = new Array(366);
var yearChosen = 2020;

main()

async function main() {
  const accessToken = await getAccessToken();
  const mainBudgetID = await getBudgetID();
  const transactions = await getTransactions(accessToken, mainBudgetID);
  const currencyDecimals = await getCurrencyDecimals(accessToken, mainBudgetID);
  
  storeTransactions(transactions, currencyDecimals);
  tooltipPopulate();
}  

async function getAccessToken() {
  const response = await fetch('.vscode/accessToken.txt');
  const accessToken = await response.text();
  return accessToken;
}

async function getBudgetID() {
  const response = await fetch('.vscode/budgetID.txt');
  const budgetID = await response.text();
  return budgetID;
}

async function getTransactions(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const transactionResponse = await ynabAPI.transactions.getTransactions(mainBudgetID);
  return transactionResponse.data.transactions;
}

async function getCurrencyDecimals(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const budgetResponse = await ynabAPI.budgets.getBudgetSettingsById(mainBudgetID);
  return budgetResponse.data.settings.currency_format.decimal_digits;
}

function storeTransactions(transactions, currencyDecimals) {
  for(let transaction of transactions) {
    const transactionDate = newNormalizedDate(transaction.date);
    if(transactionDate.getFullYear() != yearChosen || transaction.transfer_account_id != null) {
      continue;
    } else {
      const amount = ynab.utils.convertMilliUnitsToCurrencyAmount(transaction.amount, currencyDecimals); //converts to users currency in decimals
      const transactionIndex = daysIntoYear(transactionDate) - 1;
      transactionDays[transactionIndex] = (transactionDate.getMonth() + 1).toString().concat("/",transactionDate.getDate().toString());
      //console.log(transactionDays[transactionIndex]);
      if (amount > 0) {
        (isNaN(incomeTransactions[transactionIndex]) ? incomeTransactions[transactionIndex] = amount : incomeTransactions[transactionIndex] = parseFloat(incomeTransactions[transactionIndex] + amount).toFixed(currencyDecimals));
      } else { 
        (isNaN(expenseTransactions[transactionIndex]) ? expenseTransactions[transactionIndex] = amount: expenseTransactions[transactionIndex] = parseFloat(expenseTransactions[transactionIndex] + amount).toFixed(currencyDecimals));
      }
    }
  }
}

function tooltipPopulate (){
  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    (incomeTransactions[transactionIndex] == undefined ? incomeTransactions[transactionIndex] = 0 : incomeTransactions[transactionIndex]);
    (expenseTransactions[transactionIndex] == undefined ? expenseTransactions[transactionIndex] = 0 : expenseTransactions[transactionIndex]);
    if (transactionDays[transactionIndex] == undefined) {
      continue;
    }
    const dayID = "cal-year-".concat(transactionDays[transactionIndex].toString());
    const htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Income: ".concat(incomeTransactions[transactionIndex].toString(), "</br>", " Expense: ", expenseTransactions[transactionIndex].toString(), "</span></div>");
    //console.log(dayID);
    //console.log(htmlInsert);
    document.getElementById(dayID).innerHTML += htmlInsert;
    //console.log(`Income Day: ${incomeIndex} , Income Amount: ${incomeTransactions[incomeIndex]}`);
  }
}

function daysIntoYear(transactionDate){
  return (Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function newNormalizedDate(date){
  return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * - 60000); //https://stackoverflow.com/a/14569783
}