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
    <img class="logo" alt="HeatmapIcon" src="/images/HeatmapIcon.png">
    <p class="title">Heatmap for YNAB</p>
  </div>
  <Tabs {activeTab} {tabs} on:tabChange={tabChange}/>
  <Filters {filters} on:filterChange/>
  <div class="settings">
    <div class="settings-container" on:click="{() => togglePopup()}">
        <p class="settings-text">Settings</p>
        <span class="material-icons-round md-24 settings-icon">settings</span>
    </div>
  </div>
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
        
        background-color: var(--theme-primary);
    }
    .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        
        padding-top: 10px;
    }
    .logo {
        width: 50px;
    }
    .title {
        padding-left: 5px;

        font-size: 1.75em;
        color: white;
        font-weight: bold;
    }
    .settings {
        position: relative;

        margin: 0 auto;
        width: 90px;

        transition: all 250ms ease-in;

        @media screen and (max-width: 1449px) {
            left: 50px;
        }
        @media screen and (max-width: 1365px) {
            left: 100px;
        }
    }
    .settings-container {
        display: flex;
        align-items: center;

        margin-top: 5px;

        cursor: pointer;

        &:hover .settings-text, &:hover .settings-icon {
            color: var(--theme-secondary);

            transition: all 250ms ease-in;
        }
    }
    .settings-text {
        margin-right: 5px;

        color: white;

        transition: all 250ms ease-in;
    }
    .settings-icon{
        color: white;

        transition: all 250ms ease-in;
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

