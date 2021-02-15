var expenseTransactions = new Array(366);
var incomeTransactions = new Array(366);
var transactionDays = new Array(366);
var transactions;
var currencyDecimals;
var currentYear = 2020;
var budgetOption;

main();

async function main() {
  const accessToken = await getAccessToken();
  const mainBudgetID = await getBudgetID();
  await getTransactions(accessToken, mainBudgetID);
  currencyDecimals = await getCurrencyDecimals(accessToken, mainBudgetID);
  
  storeTransactions('dummy');
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
  transactions = transactionResponse.data.transactions;
  return;
}

async function getCurrencyDecimals(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const budgetResponse = await ynabAPI.budgets.getBudgetSettingsById(mainBudgetID);
  return budgetResponse.data.settings.currency_format.decimal_digits;
}

function storeTransactions(yearOption) {
  resetTransactions();
  if (yearOption === 'next') {
    currentYear += 1;
  } else if (yearOption === 'previous') {
    currentYear -= 1;
  } else {}
  document.getElementById("currentYear").innerHTML = currentYear;
  for(let transaction of transactions) {
    const transactionDate = newNormalizedDate(transaction.date);
    if (transactionDate.getFullYear() != currentYear || transaction.transfer_account_id != null) {
      continue;
    } else {
      const amount = ynab.utils.convertMilliUnitsToCurrencyAmount(transaction.amount, currencyDecimals); //converts to users currency in decimals
      const transactionIndex = daysIntoYear(transactionDate) - 1;
      transactionDays[transactionIndex] = (transactionDate.getMonth() + 1).toString().concat("/",transactionDate.getDate().toString());
      if (amount > 0) {
        (isNaN(incomeTransactions[transactionIndex]) ? incomeTransactions[transactionIndex] = amount : incomeTransactions[transactionIndex] = (parseFloat(incomeTransactions[transactionIndex]) + (parseFloat(amount))).toFixed(currencyDecimals));
      } else { 
        (isNaN(expenseTransactions[transactionIndex]) ? expenseTransactions[transactionIndex] = amount: expenseTransactions[transactionIndex] = (parseFloat(expenseTransactions[transactionIndex]) + (parseFloat(amount))).toFixed(currencyDecimals));
      }
    }
  }
  document.getElementById("loadStatus").innerHTML = "Status: Done";
}

function calendarPopulate(option){
  var htmlInsert;
  var dayID;
  var dayColor;
  var incomeAmount;
  var expenseAmount;
  var netAmount;

  resetDays();//Resets the day info and colors so that they don't show incorrectly

  budgetOption = option;

  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}

    if(option === "income") {
      if (incomeTransactions[transactionIndex] == undefined) { continue;}

      htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Income: ".concat(incomeTransactions[transactionIndex].toString(), "</span></div>");
      dayColor = "green";
    } else if (option === "expense") {
      if (expenseTransactions[transactionIndex] == undefined) { continue;}

      htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Expense: ".concat(expenseTransactions[transactionIndex].toString(), "</span></div>");
      dayColor = "red";
    } else if (option === "both" || option === "net") {
      if(incomeTransactions[transactionIndex] == undefined && expenseTransactions[transactionIndex] == undefined) {continue;}
      (incomeTransactions[transactionIndex] == undefined ? incomeAmount = 0 : incomeAmount = incomeTransactions[transactionIndex]);
      (expenseTransactions[transactionIndex] == undefined ? expenseAmount = 0 : expenseAmount = expenseTransactions[transactionIndex]);

      if (option === "both") {
        htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Income: ".concat(incomeAmount.toString(), "</br>", " Expense: ", expenseAmount.toString(), "</span></div>");
        dayColor = "rgb(119, 119, 233)";
      } else {
        netAmount =  (parseFloat(incomeAmount) + parseFloat(expenseAmount)).toFixed(currencyDecimals);
        htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Net: ".concat(netAmount.toString(),"</span></div>");
        if (netAmount >= 0) {
          dayColor = "yellow";
        } else {
          dayColor = "orange";
        }
      }
    } else {}

    dayID = "cal-year-".concat(transactionDays[transactionIndex].toString());
    document.getElementById(dayID).innerHTML = htmlInsert;
    document.getElementById(dayID).style.background = dayColor;
  }
}

function resetDays () {
  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}
    dayID = "cal-year-".concat(transactionDays[transactionIndex].toString());
    document.getElementById(dayID).innerHTML = "";
    document.getElementById(dayID).style.background = "rgba(187, 167, 167, 0.842)";
  }
}

function resetTransactions () {
  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}
    incomeTransactions[transactionIndex] = undefined;
    expenseTransactions[transactionIndex] = undefined;
  }
}

function yearChange (yearOption) {
  resetDays();
  resetTransactions();
  storeTransactions(yearOption);
  calendarPopulate(budgetOption);
}

function daysIntoYear(transactionDate){
  return (Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function newNormalizedDate(date){
  return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * - 60000); //https://stackoverflow.com/a/14569783
}