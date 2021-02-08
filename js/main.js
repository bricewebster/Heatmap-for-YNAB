getTransactions();

function getTransactions () {
  var ynab = window.ynab;
  const accessToken = persAuthToken.data;
  const ynabAPI = new ynab.API(accessToken);
  
  (async function() {
  const transactionResponse = await ynabAPI.transactions.getTransactions(mainBudget.id);
  const transactions = transactionResponse.data.transactions;
  for(let transaction of transactions) {
    const amount = parseFloat($(transaction.amount));
    (amount > 0 ? '$2.00' : '$10.00');
    console.log(`Amount: ${transaction.amount}`);
  }
  })();
}