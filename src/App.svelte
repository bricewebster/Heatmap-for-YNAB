<script>
	import ReportPage from "./components/ReportPage.svelte";
	import LandingPage from "./components/LandingPage.svelte";
	import ThemeContext from "./components/ThemeContext.svelte";

	let linkedYNABAccount = false;
	let debugMode = false;
	let accessToken;

	/**
	 * Checks if an access token is present in the params and if so it'll load up the app.
	 */
	function linkedCheck() {
		if (debugMode) {
			console.log('Debug Mode')
			linkedYNABAccount = true;
		} else {
			const urlSearchParams = new URLSearchParams(window.location.search);
			window.history.pushState({}, document.title, "/"); //Removes query strings for cleaner look
			const params = Object.fromEntries(urlSearchParams.entries());
			accessToken = params.token;
			let refreshToken = params.refresh
			if (accessToken != null) {
				localStorage.setItem("new", refreshToken);
				linkedYNABAccount = true;
			}
		}
    }
	linkedCheck();
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/site.webmanifest">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-LP5Q1TK7LQ"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-LP5Q1TK7LQ');
	</script>
</svelte:head>

<ThemeContext>
	<main>
		{#if linkedYNABAccount === false}
			<LandingPage/>
		{:else}
			<ReportPage {accessToken} {debugMode}/>	
		{/if}

	</main>
</ThemeContext>

<style lang="scss">
	/**
		Project uses outside in principle discribed on https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685 for css property organization.
	*/
	main {
		margin: 0 auto;

		width: 100%;
		height: 100%;
	}
</style>