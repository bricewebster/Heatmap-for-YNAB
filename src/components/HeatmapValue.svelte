<script>
    import HeatmapSettingsStore from '../stores/heatmapSettingsStore';
    import NavOptionsStore from "../stores/navOptionsStore";
    import { fade } from 'svelte/transition';

    let values = {Income: '', Expense: ''};

    $: $NavOptionsStore.selectedOption, $NavOptionsStore.selectedStyle, valueSet();

    function valueSet () {
        if ($NavOptionsStore.selectedOption === 'income') {
            if ($NavOptionsStore.selectedStyle === 'regular') {
                values.Income = 'regular';
                values.Expense = '';
            } else if ($NavOptionsStore.selectedStyle === 'group') {
                values.Income = 'group';
                values.Expense = '';
            } else {
                values.Income = 'simple';
                values.Expense = '';
            }
        } else if ($NavOptionsStore.selectedOption === 'expense') {
            if ($NavOptionsStore.selectedStyle === 'regular') {
                values.Income = '';
                values.Expense = 'regular';
            } else if ($NavOptionsStore.selectedStyle === 'group') {
                values.Income = '';
                values.Expense = 'group';
            } else {
                values.Income = '';
                values.Expense = 'simple';
            }
        } else {
            if ($NavOptionsStore.selectedStyle === 'regular') {
                values.Income = 'regular';
                values.Expense = 'regular';
            } else if ($NavOptionsStore.selectedStyle === 'group'){
                values.Income = 'group';
                values.Expense = 'group';
            } else {
                values.Income = 'simple';
                values.Expense = 'simple';
            }
        }
    }
</script>
<div class="content">
    <p class="title">Values:</p>
    {#if values.Income === 'regular'}
        <div class="values" in:fade>
            <p>Income</p>
            <div class="value-container">
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 100%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>Highest</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 50%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>Middle</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 20%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>Lowest</p>
                </div>
            </div>
        </div>
    {/if}
    {#if values.Expense === 'regular'}
        <div class="values" in:fade>
            <p>Expense</p>
            <div class="value-container">
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 100%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>Highest</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 50%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>Middle</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 20%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>Lowest</p>
                </div>
            </div>
        </div>
    {/if}
    {#if values.Income === 'group'}
        <div class="values" in:fade>
            <p>Income</p>
            <div class="value-container">
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeTopHue}, {$HeatmapSettingsStore.Colors.incomeTopSat}%, {$HeatmapSettingsStore.Colors.incomeTopLum}%);"></div>
                    <p>Top 10%</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHighHue}, {$HeatmapSettingsStore.Colors.incomeHighSat}%, {$HeatmapSettingsStore.Colors.incomeHighLum}%);"></div>
                    <p>High</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeLowHue}, {$HeatmapSettingsStore.Colors.incomeLowSat}%, {$HeatmapSettingsStore.Colors.incomeLowLum}%);"></div>
                    <p>Low</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeBottomHue}, {$HeatmapSettingsStore.Colors.incomeBottomSat}%, {$HeatmapSettingsStore.Colors.incomeBottomLum}%);"></div>
                    <p>Bottom 10%</p>
                </div>
            </div>
        </div>
    {/if}
    {#if values.Expense === 'group'}
        <div class="values" in:fade>
            <p>Expense</p>
            <div class="value-container">
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseTopHue}, {$HeatmapSettingsStore.Colors.expenseTopSat}%, {$HeatmapSettingsStore.Colors.expenseTopLum}%);"></div>
                    <p>Top 10%</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHighHue}, {$HeatmapSettingsStore.Colors.expenseHighSat}%, {$HeatmapSettingsStore.Colors.expenseHighLum}%);"></div>
                    <p>High</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseLowHue}, {$HeatmapSettingsStore.Colors.expenseLowSat}%, {$HeatmapSettingsStore.Colors.expenseLowLum}%);"></div>
                    <p>Low</p>
                </div>
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseBottomHue}, {$HeatmapSettingsStore.Colors.expenseBottomSat}%, {$HeatmapSettingsStore.Colors.expenseBottomLum}%);"></div>
                    <p>Bottom 10%</p>
                </div>
            </div>
        </div>
    {/if}
    {#if values.Income === 'simple'}
        <div class="values" in:fade>
            <p>Income</p>
            <div class="value-container">
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.incomeHue}, 100%, {$HeatmapSettingsStore.Colors.incomeLum}%);"></div>
                    <p>All</p>
                </div>
            </div>
        </div>
    {/if}
    {#if values.Expense === 'simple'}
        <div class="values" in:fade>
            <p>Expense</p>
            <div class="value-container">
                <div class="value">
                    <div class="value-square" style="background-color: hsl({$HeatmapSettingsStore.Colors.expenseHue}, 100%, {$HeatmapSettingsStore.Colors.expenseLum}%);"></div>
                    <p>All</p>
                </div>
            </div>
        </div>
    {/if}
</div>
<style>
    .content {
        display: inline-block;
        
        width: 118px;

        vertical-align: top;
    }
    .title {
        font-weight: bold;
        text-align: center;
    }
    .value-square {
        display: inline-block;
        
        height: 18px;
        width: 25px;
    }
    .value-container {
        margin-top: 4px;
    }
    .value {
        display: flex;
        align-items: center;

        margin-bottom: 5px;
    }
    .value p {
        display: inline-block;

        margin-left: 5px;
    }
</style>