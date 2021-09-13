var ynab = window.ynab;
var accessToken = persAuthToken.data;

//alert(accessToken);

const ynabAPI = new ynab.API(accessToken);

(async function() {
  const budgetsResponse = await ynabAPI.budgets.getBudgets();
  const budgets = budgetsResponse.data.budgets;
  for(let budget of budgets) {
    console.log(`Budget Name: ${budget.name}, Budget Id: ${budget.id}`);
  }
})();