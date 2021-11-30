<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let tabs;
    export let activeTab;

</script>

<div class="tabs">
    <ul>
        {#each tabs as tab}
            <li class:active={tab === activeTab} on:click={() => dispatch('tabChange', tab)}>
                <div>{tab}</div>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .tabs {
        display: inline-block;
        position: absolute;
    }
    ul {
        margin: 0;  
        padding-inline-start: 0;
    }
    li {
        display: inline-block;

        margin-left: 20px;
        padding: 0px 5px 5px 5px;
  
        background: none;
        border: none;
  
        font-size: 1.2em;
        color: white;
  
        cursor: pointer;

        transition: color 200ms ease-in;

        &:hover {
            color: var(--heatmap-secondary);

            transition: all 250ms ease-in;
        }
      
        &.active {
            background: white;
            border: 5px solid var(--heatmap-secondary);
            border-bottom: 5px solid transparent;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
  
            color: var(--heatmap-secondary);
            transition: background 250ms ease-out;
        }
    }
</style>
