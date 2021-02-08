main()

async function main() {
  const accessToken = await getAccessToken();
  const mainBudgetID = await getBudgetID();
  const transactions = await getTransactions(accessToken, mainBudgetID);
  var expenseTransactions = [];
  var incomeTransactions = [];

  storeTransactions(transactions);
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

function storeTransactions(transactions) {
  for(let transaction of transactions) {
    const amount = parseFloat($(transaction.amount));
    const transactionIndex = daysIntoYear(Date.parse($(transactions.Date)));
    (amount > 0 ? incomeTransactions[transactionIndex] = amount : expenseTransactions[transactionIndex] = amount);
    //console.log(`Amount: ${transaction.amount}`);
  }
}

function listTransactions (){

}

function daysIntoYear(transactionDate){
  return (Date.UTC(newtransactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}