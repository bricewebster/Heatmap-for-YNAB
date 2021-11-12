<script>
	import Navbar from "./components/Navbar.svelte";
	import Content from "./components/Content.svelte";
	import Loading from "./components/Loading.svelte";
	import { onMount } from 'svelte';
	import navOptionsStore from './stores/navOptionsStore';
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
	 * Fetches all of the categories fom the user's YNAB account.
	 * @param {Object} ynabAPI ynabAPI object used to get info from YNAB
	 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Group Objects 
	 */
	async function getCategories(ynabAPI, mainBudgetID) {
  		const categoryResponse = await ynabAPI.categories.getCategories(mainBudgetID);
  		return categoryResponse.data.category_groups;
	}
	/**
	 * Fetches all of the accounts fom the user's YNAB account
	 * @param {Object} ynabAPI ynabAPI object used to get info from YNAB
	 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Account Objects 
	 */
	async function getAccounts(ynabAPI, mainBudgetID) {
  		const accountResponse = await ynabAPI.accounts.getAccounts(mainBudgetID);
  		return accountResponse.data.accounts;
	}
	/**
	 * Fetches all of the payees fom the user's YNAB account.
	 * @param {Object} ynabAPI ynabAPI object used to get info from YNAB
	 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Payee Objects
	 */
	async function getPayees(ynabAPI, mainBudgetID) {
		const payeeResponse = await ynabAPI.payees.getPayees(mainBudgetID);
		return payeeResponse.data.payees;
	}
	/**
	 * Fetches all of the transactions from the user's YNAB account.
	 * @param {Object} ynabAPI ynabAPI object used to get info from YNAB
	 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
	 * @returns {Array of Objects} Transaction Objects
	 */
	async function getTransactions(ynabAPI, mainBudgetID) {
		const transactionResponse = await ynabAPI.transactions.getTransactions(mainBudgetID);
		return transactionResponse.data.transactions;
	}
	/**
	 * Fetches the user settings from the user's YNAB account.
	 * @param {Object} ynabAPI ynabAPI object used to get info from YNAB
	 * @param {String} mainBudgetID User's main budget ID(Might be replaced later)
	 * @returns {Object} User's Setting Object
	 */
	async function getCurrencyInfo(ynabAPI, mainBudgetID) {
  		const currencyResponse = await ynabAPI.budgets.getBudgetSettingsById(mainBudgetID);
		const currencySettings = currencyResponse.data.settings.currency_format;
		let currencyInfo = {Decimals: currencySettings.decimal_digits, decimalSeparator: currencySettings.decimal_separator, 
				            symbolFirst: currencySettings.symbol_first, Symbol: currencySettings.currency_symbol, 
							displaySymbol: currencySettings.display_symbol, groupSeparator: currencySettings.group_separator, dateFormat: currencyResponse.data.settings.date_format.format};
  		return currencyInfo;
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

		CategorySectionStore.update(currentSections => {
			return currentSections.length === 0 ? [...categorySections] : [currentSections, ...categorySections];
		})

		CategoryListStore.update(currentList => {
			return currentList.length === 0 ? [...categoryLists] : [currentList, ...categoryLists];
		})
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

		AccountListStore.update(currentList => {
			return currentList.length === 0 ? [...accountLists] : [currentList, ...accountLists];
		})
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

		PayeeListStore.update(currentList => {
			return currentList.length === 0 ? [...payeeLists] : [currentList, ...payeeLists];
		})
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
	 * @returns nothing or new transaction object
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

<main>
	{#if transactionsLoaded}
		<Navbar bind:activeTab = {activeTab} on:filterChange={storeTransactionsMain}/>
		<Content {activeTab} {formatAmount} {formatDate} {dayToWeek} on:dateChange={storeTransactionsMain}/>
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