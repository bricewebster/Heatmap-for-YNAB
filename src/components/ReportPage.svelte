<script>
    import Navbar from "./Navbar.svelte";
	import Content from "./Content.svelte";
	import Loading from "./Loading.svelte";
	import { onMount } from 'svelte';
	import HeatmapSettingsStore from '../stores/heatmapSettingsStore';
	import navOptionsStore from '../stores/navOptionsStore';
	import CategorySectionStore from '../stores/categorySectionStore';
	import CategoryListStore from '../stores/categoryListStore';
	import AccountListStore from '../stores/accountListStore';
	import PayeeListStore from '../stores/payeeListStore';
	import AllTransactionsStore from '../stores/allTransactionsStore';
	import CurrentTransactionsStore from '../stores/currentTransactionsStore';
	import CurrencyInfoStore from '../stores/currencyInfoStore';

	export let accessToken;

    let activeTab = 'Yearly';

    let ynabAPIReady = false;
    let mounted = false;
    let transactionsLoaded = false;
    let ynabAPI;

    let budgetID;

    //Once the component mounts, it will run the main function if the YNAB API js file has downloaded.

	onMount(() => {
		mounted = true;
		if (ynabAPIReady) {
			main();
		}
	});

	/**
	 * Once the YNAB API js file has been downloaded, it checks if the component has mounted and then runs the main function if so.
	 */
	function ynabAPILoaded() {
        ynabAPIReady = true;
        if (mounted) {
			main();
        }
    }
	
	
	/**
	 * The main function that fetches all the information needed for the heatmap from the User's account.
	 */
	async function main() {
		var ynab = window.ynab;
		ynabAPI = await new ynab.API(accessToken);
		const budgetsFetched = await getBudgets();
		const budgetID = await initBudgets(budgetsFetched);

		await getBudgetInfo(budgetID);
		storeTransactionsMain(); 
		console.timeEnd('main')
	}
	/**
	 * Fetches all of the budget info (Categories, Accounts, Payees, Currency Info, & Transactions).
	 * @param {String} budgetID ID of the budget to fetch info from
	 */
	async function getBudgetInfo (budgetID) {
		const categoriesFetched = getCategories(budgetID);
		const accountsFetched = getAccounts(budgetID);
		const payeesFetched = getPayees(budgetID);
		const currencyInfo = getCurrencyInfo(budgetID);
		const transactionsFetch = getTransactions(budgetID);

		let fetchedValues = await Promise.all([categoriesFetched, accountsFetched, payeesFetched, currencyInfo, transactionsFetch]);
		initCategories(fetchedValues[0]);
		initAccounts(fetchedValues[1]);
		initPayees(fetchedValues[2]);
		$CurrencyInfoStore = fetchedValues[3];
		$AllTransactionsStore = fetchedValues[4];
	}
	/**
	 * Updates the budget info when a new budget is selected from the budget settings window.
	 */
	async function budgetUpdate () {
		transactionsLoaded = false;
		await getBudgetInfo($HeatmapSettingsStore.selectedBudget.Id);
		storeTransactionsMain();
	}
	/**
	 * Fetches all of the budgets from the user's YNAB account.
	 * @return {Array of Objects} Budget Objects
	 */
	async function getBudgets() {
		const budgetResponse = await ynabAPI.budgets.getBudgets();
		return budgetResponse.data;
	}
	/**
	 * Fetches all of the categories fom the user's YNAB account.
	 * @param {String} budgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Category Objects 
	 */
	async function getCategories(budgetID) {
  		const categoryResponse = await ynabAPI.categories.getCategories(budgetID);
  		return categoryResponse.data.category_groups;
	}
	/**
	 * Fetches all of the accounts fom the user's YNAB account
	 * @param {String} budgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Account Objects 
	 */
	async function getAccounts(budgetID) {
  		const accountResponse = await ynabAPI.accounts.getAccounts(budgetID);
  		return accountResponse.data.accounts;
	}
	/**
	 * Fetches all of the payees fom the user's YNAB account.
	 * @param {String} budgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Payee Objects
	 */
	async function getPayees(budgetID) {
		const payeeResponse = await ynabAPI.payees.getPayees(budgetID);
		return payeeResponse.data.payees;
	}
	/**
	 * Fetches all of the transactions from the user's YNAB account.
	 * @param {String} budgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Transaction Objects
	 */
	async function getTransactions(budgetID) {
		const transactionResponse = await ynabAPI.transactions.getTransactions(budgetID);
		return transactionResponse.data.transactions;
	}
	/**
	 * Fetches the user settings from the user's YNAB account.
	 * @param {String} budgetID User's main budget ID(Might be replaced later)
	 * @returns {Object} User's Setting Object
	 */
	async function getCurrencyInfo(budgetID) {
  		const currencyResponse = await ynabAPI.budgets.getBudgetSettingsById(budgetID);
		const currencySettings = currencyResponse.data.settings.currency_format;
		let currencyInfo = {Decimals: currencySettings.decimal_digits, decimalSeparator: currencySettings.decimal_separator, 
				            symbolFirst: currencySettings.symbol_first, Symbol: currencySettings.currency_symbol, 
							displaySymbol: currencySettings.display_symbol, groupSeparator: currencySettings.group_separator, dateFormat: currencyResponse.data.settings.date_format.format};
  		return currencyInfo;
	}
	/**
	 * Initializes the budgets list and selected budget.
	 * @param {Array Objects} budgetsFetched budgets Objects
	 * @return {String} ID of budget to be used for first fetch
	 */
	async function initBudgets (budgetsFetched) {
		let budgetID;

		if(budgetsFetched.default_budget === null) {
			budgetID = 'last-used';
		} else {
			budgetID = 'default';
		}
		$HeatmapSettingsStore.selectedBudget.Id = budgetsFetched.default_budget.id;

		for(let budget of budgetsFetched.budgets) {
			let budgetList = {Id: budget.id, Name: budget.name};
			$HeatmapSettingsStore.Budgets.push(budgetList);
		}
		
		return budgetID;
	}
	/**
	 * Initiates the categories list by taking the categories and store the needed information in a section and list store.
	 * @param {Array of Objects} categoriesFetched Categories fetched Objects
	 */
	function initCategories(categoriesFetched) {
  		let categorySections =  [];
		let categoryLists = [];

  		for(let category of categoriesFetched) {
			//Skips the credit card payments category as its not included in YNAB reports.
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

		$CategorySectionStore = categorySections;
		$CategoryListStore = categoryLists;
	}
	/**
	 * Initiates the accounts list by taking the accounts and store the needed information in a section and list store.
	 * @param {Array of Objects} accountsFetched Accounts fetched Objects
	 */
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

		$AccountListStore = accountLists;
 	}
	/**
	 * Initiates the payees list by taking the payees and store the needed information in a list store. 
	 * @param {Array of Objects} payeesFetched Payee fetched Objects
	 */
	function initPayees(payeesFetched) {
		let payeeLists = [];

		for (let payee of payeesFetched) {
			if (payee.deleted) {
				continue;
			}
			let payeeList = {Id: payee.id, Name: payee.name, Checked: true};
			payeeLists.push(payeeList);
		}

		//Sorts the payee list in alphabetical order
		payeeLists.sort((a,b) => (a.Name > b.Name) ? 1 : -1);

		$PayeeListStore = payeeLists;
	}
	/**
	 * Main function for taking the transactions and storing them based on filters, options, and selected year.
	 */
	function storeTransactionsMain() {
		let currentTransList = [];
		let firstDateCheckSet = true;
		for(let transaction of $AllTransactionsStore) {
			if (firstDateCheckSet)  {
				$navOptionsStore.firstDate = newNormalizedDate(transaction.date);
				firstDateCheckSet = false;
			}
			//If there are subtransctions(which are just split transactions) then it loops through those
			if(transaction.subtransactions.length > 0) {
				for(let subtransaction of transaction.subtransactions) {
					let transactionInfo = storeTransaction(subtransaction);
					if(transactionInfo === undefined) {
						continue;
					}
					currentTransList.push(transactionInfo);
				}
			} else { 
				let transactionInfo = storeTransaction(transaction);
				if(transactionInfo === undefined) {
					continue;
				}
				currentTransList.push(transactionInfo);
			}
		}
		$CurrentTransactionsStore = currentTransList;
		transactionsLoaded = true;
	}
	/**
	 * Takes a transaction, makes sure it meets the criteria and returns nothing or a new transaction object with needed information.
	 * @param {Object} transaction Transaction Object
	 * @return nothing or new transaction object
	 */
	function storeTransaction(transaction) {
  		const transactionDate = newNormalizedDate(transaction.date);
  		//If transaction isn't on selected year, is a transfer transaction, not a selected account, or not a selected category then it skips storing it.
  		if (transactionSkipCheck(transaction, transactionDate)) {
    		return;
  		} else {
			const amount = ynab.utils.convertMilliUnitsToCurrencyAmount(transaction.amount, $CurrencyInfoStore.Decimals); //Converts to users currency in decimals.
			let memo = transaction.memo === null ? '' : transaction.memo; //Some memos are null for some reason. This makes them blank strings.
			let currentTrans = {Date: transactionDate, dateFormatted: formatDate(transactionDate), Month: transactionDate.getMonth(), dayOfMonth: transactionDate.getDate() - 1, Week: dayToWeek(transactionDate), dayOfWeek: transactionDate.getDay(), categoryName: transaction.category_name, accountName: transaction.account_name, payeeName: transaction.payee_name, Amount: amount, amountFormatted: formatAmount(amount), Memo: memo};
			return currentTrans;
		}
	}

	/**
	 * Checks if the transaction meets the criteria to be skipped and returns true if so. 
	 * Criteria are the following; not the selected year, is a transfer account, category not selected, account not selected, & payee not selected.
	 * @param {Object} transaction transaction Object
	 * @param {Date} transactionDate transaction Date
	 * @return {Boolen} true if transaction is to be skipped else false
	 */
	function transactionSkipCheck(transaction, transactionDate) {
		let withinYearCheck = !(transactionDate >= $navOptionsStore.startDate & transactionDate <= $navOptionsStore.endDate);
		let transferAccountCheck = transaction.transfer_account_id !== null;
		let categorySelectedFind = $CategoryListStore.find(item => item.subId === transaction.category_id);
		let categorySelectedCheck = categorySelectedFind === undefined ? true : !categorySelectedFind.Checked;
		let accountSelectedFind = $AccountListStore.find(item => item.Id=== transaction.account_id);
		let accountSelectedCheck = accountSelectedFind === undefined ? true : !accountSelectedFind.Checked;
		let payeeSelectedFind = $PayeeListStore.find(item => item.Id === transaction.payee_id);
		let payeeSelectedCheck = payeeSelectedFind === undefined ? true : !payeeSelectedFind.Checked;

		if (withinYearCheck || transferAccountCheck || categorySelectedCheck || accountSelectedCheck || payeeSelectedCheck) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Normalize the supplied date so there isn't an offset issue with timezones
	 * @param {Date} date The date being normalized
	 * @return {Date} normalized Date
	 */
	function newNormalizedDate(date){
  		return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * - 60000); //https://stackoverflow.com/a/14569783
	}
	/**
	 * Takes the supplied date and returns the week of the month.
	 * @param {Date} date date object of the date to conver
	 * @return {String} week of the month 
	 */
	function dayToWeek (date) {
		let day = date.getDate();
		let week;

		if (day >= 1 & day <= 7) {
			week = 0;
		} else if (day >= 8 & day <= 14) {
			week = 1;
		} else if (day >= 15 & day <= 21) {
			week = 2;
		} else if (day >= 22 & day <= 28) {
			week = 3;
		} else {
			week = 4;
		}

		return week;
	}
	/**
	 * Formats the supplied date based on the User's settings.
	 * @param {Date} date date to be formatted
	 * @return {String} a string formatted
	 */
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
	/**
	 * Formats supplied amount based on User's settings.
	 * @param amount the amount to be formatted
	 * @return {String} the amount formatted
	 */
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

		//This section adds the decimal symbol along with the cents and leading zeroes. If there is nothing after the decimal then it just adds the leading zeroes.
		if (afterDecimal != undefined) {
			newAfterDecimal = $CurrencyInfoStore.decimalSeparator + afterDecimal + addLeadingZeroes($CurrencyInfoStore.Decimals - ($CurrencyInfoStore.Decimals - afterDecimal.length));
		} else {
			newAfterDecimal = $CurrencyInfoStore.decimalSeparator + addLeadingZeroes(0);
		}

		//If the amount is negative then it changes the sign to -, otherwise it just leaves it as +.
		if (beforeDecimal.includes('-')) {
			beforeDecimal = beforeDecimal.replace('-', '');	
			sign = '-';
		}
		//Adds the group separator every after every 3 digits starting from right to left.
		let digitCursor = 1;
        for (let index = beforeDecimal.length - 1; index >= 0; index--) {
            digitCursor === 4 & beforeDecimal.length > 3? newBeforeDecimal = beforeDecimal[index] + $CurrencyInfoStore.groupSeparator + newBeforeDecimal : newBeforeDecimal = beforeDecimal[index] + newBeforeDecimal;
			digitCursor++
		}
		//Either displays the symbol first if that is set, otherwise its displayed last.
        if ($CurrencyInfoStore.displaySymbol) {
            $CurrencyInfoStore.symbolFirst ? finalAmount = sign + $CurrencyInfoStore.Symbol + newBeforeDecimal + newAfterDecimal : finalAmount = sign + newBeforeDecimal + newAfterDecimal + $CurrencyInfoStore.Symbol;
        } else {
            finalAmount = newBeforeDecimal + newAfterDecimal;
        }
        return finalAmount;
    }

	/**
	 * Takes the parameter to add determine the amount of leading zeroes needed and returns a string with that amount.
	 * @param {Number} currentZeroes amount of leading zeroes needed
	 * @return {String} string with the determined amount of zeroes
	 */
	function addLeadingZeroes (currentZeroes) {
		let zeroes = '';
		for (let count = currentZeroes; count < $CurrencyInfoStore.Decimals; count++) {
			zeroes = zeroes + '0';
		}
		return zeroes;
	}
</script>

<svelte:head>
	<script src="https://unpkg.com/ynab@1.21.0/dist/browser/ynab.js" on:load={ynabAPILoaded}></script>
</svelte:head>

<div>
    {#if transactionsLoaded === true}
		<Navbar bind:activeTab = {activeTab} on:filterChange={storeTransactionsMain} on:colorChange={storeTransactionsMain} on:budgetChange={budgetUpdate}/>
		<Content {activeTab} {formatAmount} {formatDate} {dayToWeek} on:dateChange={storeTransactionsMain}/>
    {:else}
    	<Loading />	
    {/if}
</div>