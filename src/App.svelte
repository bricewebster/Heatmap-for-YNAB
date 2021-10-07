<script>
	import Navbar from "./components/Navbar.svelte";
	import Content from "./components/Content.svelte";
	import Loading from "./components/Loading.svelte";
	import { onMount } from 'svelte';
	import CategorySectionStore from './stores/categorySectionStore';
	import CategoryListStore from './stores/categoryListStore';
	import AccountListStore from './stores/accountListStore';
	import PayeeListStore from './stores/payeeListStore';
	import AllTransactionsStore from './stores/allTransactionsStore';
	import CurrentTransactionsStore from './stores/currentTransactionsStore';
	import CurrencyInfoStore from './stores/currencyInfoStore';
	
	let transactionsLoaded = false;
	let activeTab = 'Yearly';

	let ynabAPIReady = false;
    let mounted = false;

	var selectedYear = new Date().getFullYear();

	let selectedOption = 'income';

	onMount(() => {
        mounted = true;
        if (ynabAPIReady) {
            main();
        }
    });

	function ynabAPILoaded() {
        ynabAPIReady = true;
        if (mounted) {
            main();
        }
    }
	
	async function main() {
		const accessToken = await getAccessToken();
		const mainBudgetID = await getBudgetID();

		var ynab = window.ynab;
		const ynabAPI = await new ynab.API(accessToken);
		const categoriesFetched = await getCategories(ynabAPI, mainBudgetID);
		initCategories(categoriesFetched);
		const accountsFetched = await getAccounts(ynabAPI, mainBudgetID);
		initAccounts(accountsFetched);
		const payeesFetched = await getPayees(ynabAPI, mainBudgetID);
		initPayees(payeesFetched);
		const currencyInfo = await getCurrencyInfo(ynabAPI, mainBudgetID);
		$CurrencyInfoStore = currencyInfo;
		const transactionsFetch = await getTransactions(ynabAPI, mainBudgetID);
		$AllTransactionsStore = transactionsFetch;
		storeTransactionsMain();
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
	async function getCategories(ynabAPI, mainBudgetID) {
  		const categoryResponse = await ynabAPI.categories.getCategories(mainBudgetID);
  		return categoryResponse.data.category_groups;
	}
	async function getAccounts(ynabAPI, mainBudgetID) {
  		const accountResponse = await ynabAPI.accounts.getAccounts(mainBudgetID);
  		return accountResponse.data.accounts;
	}
	async function getPayees(ynabAPI, mainBudgetID) {
		const payeeResponse = await ynabAPI.payees.getPayees(mainBudgetID);
		return payeeResponse.data.payees;
	}
	async function getTransactions(ynabAPI, mainBudgetID) {
		const transactionResponse = await ynabAPI.transactions.getTransactions(mainBudgetID);
		return transactionResponse.data.transactions;
	}
	async function getCurrencyInfo(ynabAPI, mainBudgetID) {
  		const currencyResponse = await ynabAPI.budgets.getBudgetSettingsById(mainBudgetID);
		const currencySettings = currencyResponse.data.settings.currency_format;
		let currencyInfo = {Decimals: currencySettings.decimal_digits, decimalSeparator: currencySettings.decimal_separator, 
				            symbolFirst: currencySettings.symbol_first, Symbol: currencySettings.currency_symbol, 
							displaySymbol: currencySettings.display_symbol, groupSeparator: currencySettings.group_separator, dateFormat: currencyResponse.data.settings.date_format.format};
  		return currencyInfo;
	}
	function initCategories(categoriesFetched) {
  		let categorySections =  [];
		let categoryLists = [];

  		for(let category of categoriesFetched) {
			if (category.name === 'Credit Card Payments') {
				continue;
			}
			let categorySection = {Id: category.id, Name: category.name, Checked: true};
			categorySections.push(categorySection);
    		for(let subcategory of category.categories) {
				let categoryList = {Id: category.id, subId: subcategory.id, subName: subcategory.name, Checked: true};
				categoryLists.push(categoryList);
    		}
  		}

		CategorySectionStore.update(currentSections => {
			return currentSections.length === 0 ? [...categorySections] : [currentSections, ...categorySections];
		})

		CategoryListStore.update(currentList => {
			return currentList.length === 0 ? [...categoryLists] : [currentList, ...categoryLists];
		})
	}
	function initAccounts(accountsFetched) {
		let accountLists = [];

  		for (let account of accountsFetched) {
			let accountType;
			if (account.closed) {
				accountType = 'Closed Accounts';
			} else if (!account.on_budget) {
				accountType = 'Tracking Accounts';
			} else {
				accountType = 'On Budget Accounts';
			}
			let accountList = {Id: account.id, Name: account.name, Type: accountType, Checked: true};
			accountLists.push(accountList);
		}

		AccountListStore.update(currentList => {
			return currentList.length === 0 ? [...accountLists] : [currentList, ...accountLists];
		})
 	}
	function initPayees(payeesFetched) {
		let payeeLists = [];

		for (let payee of payeesFetched) {
			if (payee.deleted) {
				continue;
			}
			let payeeList = {Id: payee.id, Name: payee.name, Checked: true};
			payeeLists.push(payeeList);
		}

		payeeLists.sort((a,b) => (a.Name > b.Name) ? 1 : -1);

		PayeeListStore.update(currentList => {
			return currentList.length === 0 ? [...payeeLists] : [currentList, ...payeeLists];
		})
	}
	function storeTransactionsMain() {
		let currentTransList = []
		for(let transaction of $AllTransactionsStore) {
			//If there are subtransctions(which are just split transactions) then it loops through those
			if(transaction.subtransactions.length > 0) {
				for(let subtransaction of transaction.subtransactions) {
					let transactionInfo = storeTransactions(subtransaction);
					if(transactionInfo === undefined) {
						continue;
					}
					currentTransList.push(transactionInfo);
				}
			} else { 
				let transactionInfo = storeTransactions(transaction);
				if(transactionInfo === undefined) {
					continue;
				}
				currentTransList.push(transactionInfo);
			}
		}
		$CurrentTransactionsStore = currentTransList;
		transactionsLoaded = true;
	}
	function storeTransactions(transaction) {
		
  		const transactionDate = newNormalizedDate(transaction.date);
  		//If transaction isn't on selected year, is a transfer transaction, not a selected account, or not a selected category then it skips storing it
  		if (transactionSkipCheck(transaction, transactionDate)) {
    		return;
  		} else {
			const amount = ynab.utils.convertMilliUnitsToCurrencyAmount(transaction.amount, $CurrencyInfoStore.Decimals); //Converts to users currency in decimals
			let memo = transaction.memo === null ? '' : transaction.memo;
			let currentTrans = {Date: transactionDate, dateFormatted: formatDate(transactionDate), categoryName: transaction.category_name, accountName: transaction.account_name, payeeName: transaction.payee_name, Amount: amount, amountFormatted: formatAmount(amount), Memo: memo};
			return currentTrans;
		}
	}

	function transactionSkipCheck(transaction, transactionDate) {
		let withinYearCheck = transactionDate.getFullYear() !== selectedYear;
		let transferAccountCheck = transaction.transfer_account_id !== null;
		let categorySelectedFind = $CategoryListStore.find(item => item.subId === transaction.category_id);
		let categorySelectedCheck = categorySelectedFind === undefined ? true : !categorySelectedFind.Checked;
		let accountSelectedFind = $AccountListStore.find(item => item.Id=== transaction.account_id);
		let accountSelectedCheck = accountSelectedFind === undefined ? true : !accountSelectedFind.Checked;
		let payeeSelectedFind = $PayeeListStore.find(item => item.Id === transaction.payee_id);
		let payeeSelectedCheck = payeeSelectedFind === undefined ? true : !payeeSelectedFind.Checked;
		// console.log('with: ' + withinYearCheck + ' transaccount: ' + transferAccountCheck + ' accountSelected: ' + accountSelectedCheck + 'category: ' + categorySelectedCheck + 'payee: ' + payeeSelectedCheck)

		if (withinYearCheck || transferAccountCheck || categorySelectedCheck || accountSelectedCheck || payeeSelectedCheck) {
			// console.log('with: ' + withinYearCheck + ' transaccount: ' + transferAccountCheck + ' accountSelected: ' + accountSelectedCheck + 'category: ' + categorySelectedCheck + 'payee: ' + payeeSelectedCheck)
			return true;
		} else {
			return false;
		}
	}

	function newNormalizedDate(date){
  		return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * - 60000); //https://stackoverflow.com/a/14569783
	}

	function formatDate (date) {
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        let userDateFormat = $CurrencyInfoStore.dateFormat;
        let newDate;

        if (userDateFormat === 'YYYY/MM/DD') {
            newDate = year + '/' + month + '/' + day;
        } else if (userDateFormat === 'YYYY-MM-DD') {
            newDate = year + '-' + month + '-' + day;
        } else if (userDateFormat === 'DD-MM-YYYY') {
            newDate = day + '-' + month + '-' + year;
        } else if (userDateFormat === 'DD/MM/YYYY') {
            newDate = day + '/' + month + '/' + year;
        } else if (userDateFormat === 'DD.MM.YYYY') {
            newDate = day + '.' + month + '.' + year;
        } else if (userDateFormat === 'MM/DD/YYYY') {
            newDate = month + '/' + day + '/' + year;
        } else if (userDateFormat === 'YYYY.MM.DD') {
            newDate = year + '.' + month + '.' + day;
        } else {
            newDate = date;
        }

        return newDate;
    }
	function formatAmount (amount) {
        if (amount === 0) {
            return '0';
        }
        let amountSplit = String(amount).split('.');
        let beforeDecimal = amountSplit[0];
        let afterDecimal = amountSplit[1];
		let newBeforeDecimal = '';
		let newAfterDecimal = '';
        let finalAmount;
		let sign = '+';

		if (afterDecimal === undefined) {
			newAfterDecimal = $CurrencyInfoStore.decimalSeparator + addLeadingZeroes(0);
		} else {
			newAfterDecimal = $CurrencyInfoStore.decimalSeparator + afterDecimal + addLeadingZeroes($CurrencyInfoStore.Decimals - ($CurrencyInfoStore.Decimals - afterDecimal.length));
		}

		if (beforeDecimal.includes('-')) {
			beforeDecimal = beforeDecimal.replace('-', '');	
			sign = '-';
		}
        for (let index = beforeDecimal.length - 1; index >= 0; index--) {
            index % 4 === 0 & beforeDecimal.length > 3? newBeforeDecimal = beforeDecimal[index] + $CurrencyInfoStore.groupSeparator + newBeforeDecimal : newBeforeDecimal = beforeDecimal[index] + newBeforeDecimal;
        }
        if ($CurrencyInfoStore.displaySymbol) {
            $CurrencyInfoStore.symbolFirst ? finalAmount = sign + $CurrencyInfoStore.Symbol + newBeforeDecimal + newAfterDecimal : finalAmount = sign + newBeforeDecimal + newAfterDecimal + $CurrencyInfoStore.Symbol;
        } else {
            finalAmount = newBeforeDecimal + newAfterDecimal;
        }
        return finalAmount;
    }

	function addLeadingZeroes (currentZeroes) {
		let zeroes = '';
		console.log(zeroes)
		for (let count = currentZeroes; count < $CurrencyInfoStore.Decimals; count++) {
			zeroes = zeroes + '0';
		}
		console.log(zeroes)
		return zeroes;
	}
</script>

<svelte:head>
  <script src="https://unpkg.com/ynab@1.21.0/dist/browser/ynab.js" on:load={ynabAPILoaded}></script>
</svelte:head>

<main>
	{#if transactionsLoaded}
		<Navbar bind:activeTab = {activeTab} on:filterChange={storeTransactionsMain}/>
		<Content {activeTab} {selectedOption} {formatAmount}bind:selectedYear on:yearChange={storeTransactionsMain}/>
	{:else}
		<Loading />	
	{/if}

</main>

<style lang="scss">
	:global(:root){
		--ynab-dark-green: #003440;
		--ynab-teal: #00596f;
		--ynab-light-green: #009cc2;
		--ynab-light-blue: #4495d7;
	}

	main {
		margin: 0 auto;

		width: 100%;
		height: auto;
	}

</style>