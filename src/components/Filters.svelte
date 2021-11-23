<script>
    import FilterPopup from "./FilterPopup.svelte";

    let selectedFilter;
    let showFilter = false;
    export let filters;

    /**
     * Opens and closes the popup and sets the selectedFilter variable to the filter that was selected.
     * @param {String} filter filter selected
     */
    const togglePopup = (filter) => {
        showFilter = !showFilter;
        selectedFilter = filter;
    }
</script>

<div class="filters">
    <ul>
        {#each filters as filter}
            <li on:click={() => togglePopup(filter.Type)}>{filter.Amount} {filter.Type}<span class="material-icons-round md-36">arrow_drop_down</span></li>
            {#if showFilter & filter.Type === selectedFilter}
                <div class="backdrop" on:click|self={() => togglePopup()}>
                    <FilterPopup {togglePopup} bind:filter on:filterChange/>
                </div>
            {/if}
        {/each}
    </ul>
</div>

<style lang="scss">
    .filters {
        float: right;
        
        margin-right: 100px;

        @media screen and (max-width: 1690px) {
            margin-right: 25px;
        }
        @media screen and (max-width: 1365px) {
            margin-right: 5px;
        }
    }
    ul {
        display: flex;

        margin: 0;  
        padding-inline-start: 0;
    }
    li {
        display: flex;
        align-items: center;

        margin-right: 50px;

        color: white;
        
        cursor: pointer;
        transition: all 250ms ease-in;

        &:hover {
            color: var(--ynab-dark-green);

            transition: all 250ms ease-in;
        }        
        @media screen and (max-width: 1365px) {
            margin-right: 25px;
        }
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