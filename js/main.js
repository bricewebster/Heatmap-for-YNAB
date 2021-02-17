var expenseTransactions = new Array(366);
var incomeTransactions = new Array(366);
var transactionDays = new Array(366);
var defaultBudgetID;
var accounts;
var selectedAccounts = new Array();
var transactions;
var currencyDecimals;
var currentYear = new Date().getFullYear(); //Set default year as current year.
var budgetOption;

main();

async function main() {
  const accessToken = await getAccessToken();
  const mainBudgetID = await getBudgetID();
  accounts = await getAccounts(accessToken, mainBudgetID);
  initAccounts();
  transactions = await getTransactions(accessToken, mainBudgetID);
  currencyDecimals = await getCurrencyDecimals(accessToken, mainBudgetID);
  
  storeTransactions('dummy');
  calendarPopulate("income");
}  

/**
 * Grabs personal access token for testing. (Will replace in the future)
 */
async function getAccessToken() {
  const response = await fetch('.vscode/accessToken.txt');
  const accessToken = await response.text();
  return accessToken;
}

/**
 * Grabs personal main budget ID for testing. (Will replace in the future)
 */
async function getBudgetID() {
  const response = await fetch('.vscode/budgetID.txt');
  const budgetID = await response.text();
  return budgetID;
}

/**
 * Fetches all of the accounts fom the user's YNAB account
 * @param {String} accessToken User's access token
 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
 * @returns {*} Accounts object
 */
async function getAccounts(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const accountResponse = await ynabAPI.accounts.getAccounts(mainBudgetID);
  return accountResponse.data.accounts;
}

/**
 * Fetches all transactions from the user's YNAB account
 * @param {String} accessToken User's access token
 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
 * @returns {*} Transactions object
 */
async function getTransactions(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const transactionResponse = await ynabAPI.transactions.getTransactions(mainBudgetID);
  return transactionResponse.data.transactions;
}

/**
 * Fetches the user's currency in decimals(Might expand to currency symbol later)
 * @param {*} accessToken User's access token
 * @param {*} mainBudgetID User's main budget ID(Might be replaced later)
 * @returns {Number} The amount of decimals in the user's currency
 */
async function getCurrencyDecimals(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const budgetResponse = await ynabAPI.budgets.getBudgetSettingsById(mainBudgetID);
  return budgetResponse.data.settings.currency_format.decimal_digits;
}

/**
 * Stores the transactions into an array
 * @param {String} yearOption Which button was clicked next to the year
 */
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
    if (transactionDate.getFullYear() != currentYear || transaction.transfer_account_id != null || selectedAccounts.indexOf(transaction.account_id) < 0) {
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

/**
 * Initialize the accounts list
 */
function initAccounts() {
  var initAccountIndex = 0;
  for (let account of accounts) {
    selectedAccounts[initAccountIndex++] = account.id;
    htmlInsert =  "<input type=\"checkbox\" id=\"account-name-" + account.name + "\" name=\"" + account.name + "\" value=\"" + account.name + "\" checked=\"true\" onchange=\"toggleAccountCheckbox('" + account.id + "')\">" + "<label for=\"" + account.name + "\">" + account.name + "</label><br></br>";
    document.getElementById("accounts-select").innerHTML += htmlInsert;
  }
}

/**
 * Update the account list when the account checkboxes are toggled.
 * @param {String} accountCheckboxID The account ID of the checkbox that was toggled.
 */
function toggleAccountCheckbox(accountCheckboxID) {
  const accountIndex = selectedAccounts.indexOf(accountCheckboxID);
  accountIndex > -1 ? selectedAccounts.splice(accountIndex, 1) : selectedAccounts.push(accountCheckboxID);
  storeTransactions('dummy');
  calendarPopulate(budgetOption);
}

/**
 * Populates the color and data of each day on the calendar
 * @param {String} option Option chosen by user such as income, expense, etc...
 */
function calendarPopulate(option){
  var htmlInsert;
  var dayID;
  var dayColor;
  var incomeAmount;
  var expenseAmount;
  var netAmount;

  resetDays();//Resets the day info and colors so that they don't show incorrectly

  budgetOption = option;

  for (transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
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

/**
 * Resets the color and day information for the calendar
 */
function resetDays () {
  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}
    dayID = "cal-year-".concat(transactionDays[transactionIndex].toString());
    document.getElementById(dayID).innerHTML = "";
    document.getElementById(dayID).style.background = "rgba(187, 167, 167, 0.842)";
  }
}

/**
 * Resets the transactions arrays
 */
function resetTransactions () {
  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}
    incomeTransactions[transactionIndex] = undefined;
    expenseTransactions[transactionIndex] = undefined;
  }
}

/**
 * Sets up the calendar when the year is changed to clear out data, store the correct years transactions and populate the data
 * @param {String} yearOption Which button was clicked next to the year
 */
function yearChange (yearOption) {
  resetDays();
  resetTransactions();
  storeTransactions(yearOption);
  calendarPopulate(budgetOption);
}

/**
 * Get the day of the year from the supplied date
 * @param {*} transactionDate Date to get the day of the year from
 * @returns Day of the year
 */
function daysIntoYear(transactionDate){
  return (Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

/**
 * Normalize the supplied date so there isn't an offset issue with timezones
 * @param {*} date The date being normalized
 * @returns Normalized date
 */
function newNormalizedDate(date){
  return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * - 60000); //https://stackoverflow.com/a/14569783
}