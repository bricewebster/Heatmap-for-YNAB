<script>
    export let dropdowns;
</script>

<div class="dropdowns">
    <ul>
        {#each dropdowns as dropdown}
            <li>{dropdown}<span class="material-icons-round md-36">arrow_drop_down</span></li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .dropdowns {
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

        margin-right: 40px;

        color: white;
        
        cursor: pointer;
    }
</style>