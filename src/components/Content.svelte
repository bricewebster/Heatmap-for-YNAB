<script>
    import YearlyContent from "./YearlyContent.svelte";
    import MonthlyContent from "./MonthlyContent.svelte";
    import DailyContent from "./DailyContent.svelte";

    export let activeTab
    export let selectedYear;
</script>

<div class="content">
    {#if activeTab === 'Yearly'}
        <YearlyContent bind:selectedYear/>
    {:else if activeTab === 'Monthly'}
        <MonthlyContent />
    {:else}
        <DailyContent />
    {/if}
</div>

<style>
    .content {
        width: 100%;

        border-top: 5px solid var(--ynab-dark-green);

        line-height: normal;
    }
</style>
