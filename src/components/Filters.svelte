<script>
    import FilterPopup from "./FilterPopup.svelte";

    let selectedFilter;
    let showFilter = false;
    export let filters;

    const togglePopup = () => {
        showFilter = !showFilter;
    }
</script>

<div class="filters">
    <ul>
        {#each filters as filter}
            <li on:click={() => selectedFilter = filter}>All {filter}<span class="material-icons-round md-36">arrow_drop_down</span></li>
            <FilterPopup {filter} {selectedFilter}/>
        {/each}
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