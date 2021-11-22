<script>
    import Tabs from "./Tabs.svelte";
    import Filters from "./Filters.svelte";
    import SettingsPopup from "./SettingsPopup.svelte"

    let tabs = ['Yearly', 'Monthly', 'Days of Month', 'Weeks of Month', 'Days of Week'];
    let filters = [{Amount: 'All', Type: 'Categories'}, {Amount: 'All', Type: 'Accounts'}, {Amount: 'All', Type: 'Payees'}];

    export let activeTab;

    var showPopup = false;
    
    /**
     * When the tab changes, set the active tab to the selected tab.
     * @param {Object} e event Object
     */
    const tabChange = (e) => {
        activeTab = e.detail;
    }
    /**
     * Opens and closes the trans list popup.
     */
     function togglePopup () {
        showPopup = !showPopup;
    }
</script>

<div class="navbar">
  <div class="title-container">
    <p class="title">Heatmap for YNAB</p>
    <span class="material-icons-round md-36" on:click="{() => togglePopup()}">settings</span>
  </div>
  <Tabs {activeTab} {tabs} on:tabChange={tabChange}/>
  <Filters {filters} on:filterChange/>
  {#if showPopup}
        <div class="backdrop" on:click|self={() => togglePopup()}>
            <SettingsPopup {togglePopup} on:colorChange on:budgetChange/>
        </div>
  {/if}  
</div>

<style lang="scss">
    .navbar {
        position: relative;

        height: 90px;
        
        background-color: var(--ynab-light-green);
    }
    .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        
        padding-top: 10px;
    }
    .title {
        padding-right: 15px;

        font-size: 1.75em;
        color: white;
        font-weight: bold;
    }
    span {
        color: white;

        cursor: pointer;
    }
    .backdrop {
        position: fixed;

        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        z-index: 10;
    }
</style>

