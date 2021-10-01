<script>
    import Tabs from "./Tabs.svelte";
    import Filters from "./Filters.svelte";

    let tabs = ['Yearly', 'Monthly', 'Daily'];
    let filters = [{Amount: 'All', Type: 'Categories'}, {Amount: 'All', Type: 'Accounts'}, {Amount: 'All', Type: 'Payees'}];

    export let activeTab;
    
    const tabChange = (e) => {
        activeTab = e.detail;
    }

</script>

<div class="navbar">
  <h1>Heatmap for YNAB</h1>
  <Tabs {activeTab} {tabs} on:tabChange={tabChange}/>
  <Filters {filters} on:filterChange/>
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

