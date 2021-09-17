<script>
	import Navbar from "./components/Navbar.svelte";
	import Content from "./components/Content.svelte";
	import { onMount } from 'svelte';
	
	let activeTab = 'Yearly';


        let ynabAPIReady = false;
        let mounted = false;

	async function main() {
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

		const accessToken = await getAccessToken();
		const mainBudgetID = await getBudgetID();

	
	async function getAccounts(accessToken, mainBudgetID) {
 		var ynab = window.ynab;
  		const ynabAPI = new ynab.API(accessToken);
  		const accountResponse = await ynabAPI.accounts.getAccounts(mainBudgetID);
  		return accountResponse.data.accounts;
	}
	console.log(getAccounts(accessToken,mainBudgetID));
}

		
        onMount(() => {
            // The payment-form is ready.
            mounted = true;
            if (ynabAPIReady) {
                ynabAPIElements();
            }
        });
 
        function ynabAPILoaded() {
            // The external Stripe javascript is ready.
            ynabAPIReady = true;
            if (mounted) {
                ynabAPIElements();
            }
        }
 
        function ynabAPIElements() {
			main();
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