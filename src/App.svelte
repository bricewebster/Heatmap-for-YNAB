<script>
	import Navbar from "./components/Navbar.svelte";
	import Content from "./components/Content.svelte";
	import { onMount } from 'svelte';
	import CategorySectionStore from './stores/categorySectionStore';
	import CategoryListStore from './stores/categoryListStore';
	import AccountSectionStore from './stores/accountSectionStore';
	import AccountListStore from './stores/accountListStore';
	
	let activeTab = 'Yearly';

	let ynabAPIReady = false;
    let mounted = false;

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
	function initCategories(categoriesFetched) {
  		let categorySections =  [];
		let categoryLists = [];

  		for(let category of categoriesFetched) {
			if (category.name === 'Credit Card Payments') {
				continue;
			}
			let categorySection = {Id: category.id, Name: category.name};
			categorySections.push(categorySection);
    		for(let subcategory of category.categories) {
				let categoryList = {Id: category.id, subId: subcategory.id, subName: subcategory.name};
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
			let accountList;
			let accountType;
			if (account.closed) {
				accountType = 'Closed Accounts';
			} else if (!account.type) {
				accountType = 'Tracking Accounts';
			} else {
				accountType = 'On Budget Accounts';
			}
			accountList = {Name: account.name, Type: accountType};
			accountLists.push(accountList);
		}

		AccountListStore.update(currentList => {
			return currentList.length === 0 ? [...accountLists] : [currentList, ...accountLists];
		})
  }

</script>

<svelte:head>
  <script src="https://unpkg.com/ynab@1.21.0/dist/browser/ynab.js" on:load={ynabAPILoaded}></script>
</svelte:head>

<main>
	<Navbar bind:activeTab = {activeTab} />
	<Content {activeTab} />
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