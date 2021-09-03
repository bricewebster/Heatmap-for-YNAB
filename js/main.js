var expenseTransactions = new Array(366);
var incomeTransactions = new Array(366);
var transactionDays = new Array(366);
var defaultBudgetID;
var accountsFetched;
var ynabAccounts = new Array();
var categoriesFetched;
var ynabCategories = new Array();
var transactions;
var currencyDecimals;
var selectedYear = new Date().getFullYear(); //Set default year as current year.
var budgetOption = "income";
var sectionFlag = false;

main();

async function main() {
  const accessToken = await getAccessToken();
  const mainBudgetID = await getBudgetID();
  document.getElementById("selectedYear").innerHTML = selectedYear;
  leapYearCheck();
 // accountsFetched = await getAccounts(accessToken, mainBudgetID);
 // initAccounts();
 // categoriesFetched = await getCategories(accessToken, mainBudgetID);
 
  initCategories();
 
  //transactions = await getTransactions(accessToken, mainBudgetID);
  //listCategories();
  //currencyDecimals = await getCurrencyDecimals(accessToken, mainBudgetID);
  
  storeTransactionsMain();
  calendarPopulate(budgetOption);
}  

// function listCategories() {
//   for(let transaction of transactions) {
//     console.log('date: ' + transaction.date + 'amount: ' + transaction.amount + 'amountid: ' + transaction.amount_id + 'aname: ' + transaction.account_name + 'cname: ' + transaction.category_name + 'catid: ' + transaction.category_id);
//   }
// }

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

async function getCategories(accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const categoryResponse = await ynabAPI.categories.getCategories(mainBudgetID);
  return categoryResponse.data.category_groups;
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
 * Main function for storing transactions. Used mostly to loop through the subtransactions if there are any.
 */
function storeTransactionsMain() {
  for(let transaction of transactions) {
    //If there are subtransctions(which are just split transactions) then it loops through those
    if(transaction.subtransactions.length > 0) {
      for(let subtransaction of transaction.subtransactions) {
        storeTransactions(subtransaction, transaction.account_id);
      }
    } else { 
      storeTransactions(transaction, transaction.account_id);
    }
  }
  document.getElementById("loadStatus").innerHTML = "Status: Done";
}

/**
 * Stores the transactions into an array
 * @param {Object} transaction The transaction being stored.
 * @returns nothing
 */
function storeTransactions(transaction, transactionAccountID) {
  const transactionDate = newNormalizedDate(transaction.date);
  //If transaction isn't on selected year, is a transfer transaction, not a selected account, or not a selected category then it skips storing it
  if (transactionSkipCheck(transaction, transactionDate, transactionAccountID)) {
    return;
  } else {
    const amount = ynab.utils.convertMilliUnitsToCurrencyAmount(transaction.amount, currencyDecimals); //Converts to users currency in decimals
    const transactionIndex = daysIntoYear(transactionDate) - 1; //Gets the index of which day to store the transaction.
    transactionDays[transactionIndex] = (transactionDate.getMonth() + 1).toString().concat("/",transactionDate.getDate().toString()); //

    if (amount > 0) {
      (isNaN(incomeTransactions[transactionIndex]) ? incomeTransactions[transactionIndex] = amount : incomeTransactions[transactionIndex] = (parseFloat(incomeTransactions[transactionIndex]) + (parseFloat(amount))).toFixed(currencyDecimals));
    } else { 
      (isNaN(expenseTransactions[transactionIndex]) ? expenseTransactions[transactionIndex] = amount: expenseTransactions[transactionIndex] = (parseFloat(expenseTransactions[transactionIndex]) + (parseFloat(amount))).toFixed(currencyDecimals));
    }
  }
}

function transactionSkipCheck(transaction, transactionDate, transactionAccountID) {
  let withinYearCheck = transactionDate.getFullYear() !== selectedYear;
  let transferAccountCheck = transaction.transfer_account_id !== null;
  let accountSelectedCheck = !ynabAccounts[ynabAccounts.findIndex(ynabAccounts => ynabAccounts.id === transactionAccountID)].selected;
  if (withinYearCheck || transferAccountCheck || accountSelectedCheck || categorySelectedCheck(transaction)) {
    //console.log('with: ' + withinYearCheck + ' transaccount: ' + transferAccountCheck + ' accountSelected: ' + accountSelectedCheck + 'category: ' + categorySelectedCheck(transaction))
    return true;
  } else {
    return false;
  }
}

function categorySelectedCheck(transaction) {
  if (transaction.category_id !== null) {
    let categoryIndex = ynabCategories.findIndex(ynabCategories => ynabCategories.id === transaction.category_id);
    if (categoryIndex !== -1) {
      return !ynabCategories[categoryIndex].selected;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

/**
 * Initialize the accounts list
 */
function initAccounts() {
  var initAccountIndex = 0;
  var accountID;
  var htmlInsert;
  for (let account of accountsFetched) {
    if (account.type === 'otherLiability' ||account.type === 'otherAssest') {
      accountID = 'accounts-select-tracking';
    } else if (account.closed) {
      accountID = 'accounts-select-closed'
    } else {
      accountID = 'accounts-select-budget'
    }
    htmlInsert =  "<input type=\"checkbox\" id=\"" + account.id + "\" name=\"" + account.name + "\" value=\"" + account.name + "\" checked=\"true\" onchange=\"toggleAccountCheckbox(this.id)\">" + "<label for=\"" + account.name + "\">" + account.name + "</label><br></br>";
    document.getElementById(accountID).innerHTML += htmlInsert;
    ynabAccounts[initAccountIndex++] = new Account(account.id, account.name, accountID, account.closed, true);
  }
}

/**
 * Initialize the categories list
 */
function initCategories() {
  var initCategoryIndex = 0;
  var htmlInsert;
  for(let category of categoriesFetched){
    //if (category.name === 'Internal Master Category') { continue;}// May revisit but leaving on for now.
    htmlInsert =  "<input type=\"checkbox\" id=\"" + category.id + "\" name=\"" + category.name + "\" value=\"" + category.name + "\" checked=\"true\" onchange=\"toggleCategoryCheckboxSection(this.id)\">" + "<label for=\"" + category.name + "\">" + category.name + "</label><br></br>" + "<div id='cat-" + category.id + "'></div>";
    document.getElementById('categories-select').innerHTML += htmlInsert;
    for(let subcategory of category.categories) {
      htmlInsert =  "<input type=\"checkbox\" id=\"" + subcategory.id + "\" name=\"" + subcategory.name + "\" value=\"" + subcategory.name + "\" checked=\"true\" onchange=\"toggleCategoryCheckbox(this.id)\">" + "<label for=\"" + subcategory.name + "\">" + subcategory.name + "</label><br></br>";
      document.getElementById('cat-' + category.id).innerHTML += htmlInsert;
      ynabCategories[initCategoryIndex++] = new Category(subcategory.id, subcategory.name, category.id, true);
    }
  }
}

/**
 * Populates the color and data of each day on the calendar
 * @param {String} option 
 */
function calendarPopulate(option){
  var htmlInsert;
  var dayID;
  var dayColor;
  var incomeAmount;
  var expenseAmount;
  var netAmount;

  //console.log(incomeTransactions.filter(word => word.length > 0).length)

  for (transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}

    if(option === "income") {
      if (incomeTransactions[transactionIndex] == undefined) { continue;}

      htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Income: ".concat(incomeTransactions[transactionIndex].toString(), "</span></div>");
      dayColor = "#00a567";
    } else if (option === "expense") {
      if (expenseTransactions[transactionIndex] == undefined) { continue;}

      htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Expense: ".concat(expenseTransactions[transactionIndex].toString(), "</span></div>");
      dayColor = "#de5d83";
    } else if (option === "both" || option === "net") {
      if(incomeTransactions[transactionIndex] == undefined && expenseTransactions[transactionIndex] == undefined) {continue;}
      (incomeTransactions[transactionIndex] == undefined ? incomeAmount = 0 : incomeAmount = incomeTransactions[transactionIndex]);
      (expenseTransactions[transactionIndex] == undefined ? expenseAmount = 0 : expenseAmount = expenseTransactions[transactionIndex]);

      if (option === "both") {
        htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Income: ".concat(incomeAmount.toString(), "</br>", " Expense: ", expenseAmount.toString(), "</span></div>");
        dayColor = "#1962b1";
      } else {
        netAmount =  (parseFloat(incomeAmount) + parseFloat(expenseAmount)).toFixed(currencyDecimals);
        htmlInsert = "<div class=\"tooltip\"><span class=\"tooltiptext\">Net: ".concat(netAmount.toString(),"</span></div>");
        if (netAmount >= 0) {
          dayColor = "#FDFD96";
        } else {
          dayColor = "#ffb347";
        }
      }
    } else {}

    dayID = "cal-year-".concat(transactionDays[transactionIndex].toString());
    document.getElementById(dayID).innerHTML = htmlInsert;
    document.getElementById(dayID).style.background = dayColor;
  }
}

function heatMapColorPopulate() {
  //TODO: Decide on which options to use. So far its simple - only show days that have transactions, range - smallest to largest broken up by around 20 segments or so, transactions - same as range but with number of transactions
}

/**
 * Resets the color and day information for the calendar
 */
function resetDays() {
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
function resetTransactions() {
  for(transactionIndex = 0; transactionIndex <= 365; transactionIndex++) {
    if (transactionDays[transactionIndex] == undefined) { continue;}
    incomeTransactions[transactionIndex] = undefined;
    expenseTransactions[transactionIndex] = undefined;
  }
}

/**
 * Used when calendar needs refreshed with days & transactions reset and new values given.
 */
function refreshCalendar() {
  resetDays();
  resetTransactions();
  storeTransactionsMain();
  calendarPopulate(budgetOption);
}

function toggleCalendarType(calendarTypeElement, removeClassElements) {
  calendarTypeElement.className = "focus";
  document.getElementById(removeClassElements[0]).className = "";
  document.getElementById(removeClassElements[1]).className = "";
}

/**
 * Setup the calendar when the year is changed to clear out old data, store the correct years transactions and populate the new data
 * @param {String} yearOption Which button was clicked next to the year
 */
function toggleYearChange(yearOption) {
  yearOption === 'next' ? selectedYear +=1 : selectedYear -=1;
  document.getElementById("selectedYear").innerHTML = selectedYear;
  leapYearCheck();
  refreshCalendar();
}

/**
 * Setup the calendar when the budget option is changed to clear out old data and populate the new data
 * @param {String} option Option chosen by user such as income, expense, etc...
 */
function toggleBudgetOption(option) {
  budgetOption = option;
  resetDays();
  calendarPopulate(option);
}

/**
 * Update the calendar when the account checkboxes are toggled.
 * @param {String} accountCheckboxID The account ID of the checkbox that was toggled.
 */
function toggleAccountCheckbox(accountCheckboxID) {
  const accountIndex = ynabAccounts.findIndex(ynabAccounts => ynabAccounts.id === accountCheckboxID);
  ynabAccounts[accountIndex].selected = !ynabAccounts[accountIndex].selected;
  if (sectionFlag != true) {
    refreshCalendar();
  }
}

/**
 * Update the calendar when an account checkbox section is toggled
 * @param {string} accountSection The section that was clicked
 */
function toggleAccountCheckboxSection(accountSection) {
  sectionFlag = true;
  for (let account of ynabAccounts) {
    if (accountSection === account.type) {
      document.getElementById(account.id).click();
    } else {
      continue;
    }
  }
  sectionFlag = false;
  refreshCalendar();
}

function toggleCategoryCheckbox(categoryCheckboxID) {
  const categoryIndex = ynabCategories.findIndex(ynabCategories => ynabCategories.id === categoryCheckboxID);
  ynabCategories[categoryIndex].selected = !ynabCategories[categoryIndex].selected;
  if (sectionFlag = true) {
    refreshCalendar();
    sectionFlag = false;
  }
}

function toggleCategoryCheckboxSection(categorySection) {
  sectionFlag = true;
  for (let category of ynabCategories) {
    if (categorySection === category.type) {
      document.getElementById(category.id).click();
    } else {
      continue;
    }
  }
  sectionFlag = false;
  refreshCalendar();
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

/**
 * Used to determine if the current selected year is a leap year and if so it hides the 29th of Feb.
 */
function leapYearCheck() {
  isleapYear(selectedYear) ? document.getElementById("cal-year-2/29").style.visibility = "inherit" : document.getElementById("cal-year-2/29").style.visibility = "hidden";
}

/**
 * Calculates year provided to see if its a leap year and returns true or false.
 * @param {} year the year calculated
 * @returns true if it is a leap year else false.
 */
function isleapYear(year){
  return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

function Account(id, name, type, closed, selected) {
  this.id = id;
  this.name = name;
  this.type = type;
  this.closed = closed;
  this.selected = selected;
}

function Category(id, name, type, selected) {
  this.id = id;
  this.name = name;
  this.type = type;
  this.selected = selected;
}