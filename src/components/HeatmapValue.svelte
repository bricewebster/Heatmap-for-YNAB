<script>
    import HeatmapSettingsStore from '../stores/heatmapSettingsStore';

    export let values = {Income: 'regular', Expense: 'regular'};
</script>
<div class="content">
    <p class="title">Values:</p>
    <div class="values-container">
        {#if values.Income === 'regular'}
            <div class="values">
                <p>Income</p>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 100%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>Highest</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 50%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>Middle</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 0%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>Lowest</p>
                </div>
            </div>
        {/if}
        {#if values.Expense === 'regular'}
            <div class="values">
                <p>Expense</p>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 100%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>Highest</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 50%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>Middle</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 0%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>Lowest</p>
                </div>
            </div>
        {/if}
    </div>
</div>
<style>
    .content {
        display: inline-block;
    }
    .title {
        font-weight: bold;
    }
    .value-square {
        display: inline-block;
        height: 20px;
        width: 20px;
    }
    .value p {
        display: inline-block;
    }
</style>