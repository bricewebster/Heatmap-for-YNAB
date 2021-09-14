<script>
    import Tabs from "./Tabs.svelte";
    import Dropdowns from "./Dropdowns.svelte";

    let tabs = ['Yearly', 'Monthly', 'Daily'];
    let dropdowns = ['All Categories', 'All Accounts', 'All Sources'];

    export let activeTab;

    const tabChange = (e) => {
        activeTab = e.detail;
    }

</script>

<div class="navbar">
  <h1>Heatmap for YNAB</h1>
  <Tabs {activeTab} {tabs} on:tabChange={tabChange}/>
  <Dropdowns {dropdowns}/>
</div>

<style lang="scss">
    .navbar {
        position: relative;

        height: 90px;
        
        background-color: var(--ynab-light-green);
    }
    h1 {
        padding-top: 10px;
        
        text-align: center;
        font-size: 1.75em;
        color: white;
    }
</style>

