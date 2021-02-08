main()

async function main() {
  const accessToken = await getAccessToken();
  const mainBudgetID = await getBudgetID();
  const transactions = await getTransactions(accessToken, mainBudgetID);
  console.log(transactions);
  //storeTransactions();
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

async function getTransactions (accessToken, mainBudgetID) {
  var ynab = window.ynab;
  const ynabAPI = new ynab.API(accessToken);
  const transactionResponse = await ynabAPI.transactions.getTransactions(mainBudgetID);
  return transactionResponse.data.transactions;
}

function storeTransactions () {
  for(let transaction of transactions) {
    const amount = parseFloat($(transaction.amount));
    (amount > 0 ? '$2.00' : '$10.00');
    console.log(`Amount: ${transaction.amount}`);
  }
}