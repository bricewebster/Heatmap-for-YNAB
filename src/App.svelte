<script>
	import Navbar from "./components/Navbar.svelte";
	import Content from "./components/Content.svelte";
	
	let activeTab = 'Yearly';

	console.log(activeTab)

</script>

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