<script>
    import FilterPopup from "./FilterPopup.svelte";

    let selectedFilter;
    export let filters;
</script>

<div class="filters">
    <ul>
        {#each filters as filter}
            <li on:click={() => selectedFilter = filter}>All {filter}<span class="material-icons-round md-36">arrow_drop_down</span></li>
        {/each}
        <FilterPopup {selectedFilter} />
    </ul>
</div>

<style lang="scss">
    .filters {
        float: right;
        
        margin-right: 100px;
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

        &:hover {
            color: var(--ynab-dark-green);

            transition: all 250ms ease-in;
        }
    }
</style>