<script>
    import Button from "./Button.svelte";
    import HeatmapSettingsStore from '../stores/heatmapSettingsStore';
    import { getContext } from 'svelte';
    const { theme, toggle } = getContext('theme');
    import { createEventDispatcher } from 'svelte';
    import { scale } from 'svelte/transition';

    export let togglePopup = () => {};

    const dispatch = createEventDispatcher();

    let incomeColor = hslToHex($HeatmapSettingsStore.Colors.incomeHue, $HeatmapSettingsStore.Colors.incomeSat, $HeatmapSettingsStore.Colors.incomeLum);
    let expenseColor = hslToHex($HeatmapSettingsStore.Colors.expenseHue, $HeatmapSettingsStore.Colors.expenseSat, $HeatmapSettingsStore.Colors.expenseLum);
    let incomeTopColor = hslToHex($HeatmapSettingsStore.Colors.incomeTopHue, $HeatmapSettingsStore.Colors.incomeTopSat, $HeatmapSettingsStore.Colors.incomeTopLum);
    let incomeHighColor = hslToHex($HeatmapSettingsStore.Colors.incomeHighHue, $HeatmapSettingsStore.Colors.incomeHighSat, $HeatmapSettingsStore.Colors.incomeHighLum);
    let incomeLowColor = hslToHex($HeatmapSettingsStore.Colors.incomeLowHue, $HeatmapSettingsStore.Colors.incomeLowSat, $HeatmapSettingsStore.Colors.incomeLowLum);
    let incomeBottomColor = hslToHex($HeatmapSettingsStore.Colors.incomeBottomHue, $HeatmapSettingsStore.Colors.incomeBottomSat, $HeatmapSettingsStore.Colors.incomeBottomLum);
    let expenseTopColor = hslToHex($HeatmapSettingsStore.Colors.expenseTopHue, $HeatmapSettingsStore.Colors.expenseTopSat, $HeatmapSettingsStore.Colors.expenseTopLum);
    let expenseHighColor = hslToHex($HeatmapSettingsStore.Colors.expenseHighHue, $HeatmapSettingsStore.Colors.expenseHighSat, $HeatmapSettingsStore.Colors.expenseHighLum);
    let expenseLowColor = hslToHex($HeatmapSettingsStore.Colors.expenseLowHue, $HeatmapSettingsStore.Colors.expenseLowSat, $HeatmapSettingsStore.Colors.expenseLowLum);
    let expenseBottomColor = hslToHex($HeatmapSettingsStore.Colors.expenseBottomHue, $HeatmapSettingsStore.Colors.expenseBottomSat, $HeatmapSettingsStore.Colors.expenseBottomLum);
    let colorSelectedFlag = 0;

    let selectedBudget = $HeatmapSettingsStore.selectedBudget.Id;
    let budgetSelectedFlag = 0;

    let themes = ['Heatmap', 'YNAB Classic', 'YNAB Default', 'YNAB Dark'];
    let selectedTheme = $theme.name;
    let themeSelectedFlag = 0;

    /**
     * Save any changes that are made either to the colors or budget selected.
     * @param {String} saveOption used for the colors to determine if its setting the defaults or not
     */
    function saveChanges (saveOption) {
        if (colorSelectedFlag || saveOption === 'defaults') {
            if (saveOption === 'defaults') {
                $HeatmapSettingsStore.Colors.incomeHue = $HeatmapSettingsStore.defaultColors.incomeHue; 
                $HeatmapSettingsStore.Colors.incomeSat = $HeatmapSettingsStore.defaultColors.incomeSat;
                $HeatmapSettingsStore.Colors.incomeLum = $HeatmapSettingsStore.defaultColors.incomeLum;
                $HeatmapSettingsStore.Colors.expenseHue = $HeatmapSettingsStore.defaultColors.expenseHue;
                $HeatmapSettingsStore.Colors.expenseSat = $HeatmapSettingsStore.defaultColors.expenseSat;
                $HeatmapSettingsStore.Colors.expenseLum = $HeatmapSettingsStore.defaultColors.expenseLum;
                $HeatmapSettingsStore.Colors.incomeTopHue = $HeatmapSettingsStore.defaultColors.incomeTopHue;
                $HeatmapSettingsStore.Colors.incomeTopSat = $HeatmapSettingsStore.defaultColors.incomeTopSat;
                $HeatmapSettingsStore.Colors.incomeTopLum = $HeatmapSettingsStore.defaultColors.incomeTopLum;
                $HeatmapSettingsStore.Colors.incomeHighHue = $HeatmapSettingsStore.defaultColors.incomeHighHue;
                $HeatmapSettingsStore.Colors.incomeHighSat = $HeatmapSettingsStore.defaultColors.incomeHighSat;
                $HeatmapSettingsStore.Colors.incomeHighLum = $HeatmapSettingsStore.defaultColors.incomeHighLum;
                $HeatmapSettingsStore.Colors.incomeLowHue = $HeatmapSettingsStore.defaultColors.incomeLowHue;
                $HeatmapSettingsStore.Colors.incomeLowSat = $HeatmapSettingsStore.defaultColors.incomeLowSat;
                $HeatmapSettingsStore.Colors.incomeLowLum = $HeatmapSettingsStore.defaultColors.incomeLowLum;
                $HeatmapSettingsStore.Colors.incomeBottomHue = $HeatmapSettingsStore.defaultColors.incomeBottomHue;
                $HeatmapSettingsStore.Colors.incomeBottomSat = $HeatmapSettingsStore.defaultColors.incomeBottomSat;
                $HeatmapSettingsStore.Colors.incomeBottomLum = $HeatmapSettingsStore.defaultColors.incomeBottomLum;
                $HeatmapSettingsStore.Colors.expenseTopHue = $HeatmapSettingsStore.defaultColors.expenseTopHue;
                $HeatmapSettingsStore.Colors.expenseTopSat = $HeatmapSettingsStore.defaultColors.expenseTopSat;
                $HeatmapSettingsStore.Colors.expenseTopLum = $HeatmapSettingsStore.defaultColors.expenseTopLum;
                $HeatmapSettingsStore.Colors.expenseHighHue = $HeatmapSettingsStore.defaultColors.expenseHighHue;
                $HeatmapSettingsStore.Colors.expenseHighSat = $HeatmapSettingsStore.defaultColors.expenseHighSat;
                $HeatmapSettingsStore.Colors.expenseHighLum = $HeatmapSettingsStore.defaultColors.expenseHighLum;
                $HeatmapSettingsStore.Colors.expenseLowHue = $HeatmapSettingsStore.defaultColors.expenseLowHue;
                $HeatmapSettingsStore.Colors.expenseLowSat = $HeatmapSettingsStore.defaultColors.expenseLowSat;
                $HeatmapSettingsStore.Colors.expenseLowLum = $HeatmapSettingsStore.defaultColors.expenseLowLum;
                $HeatmapSettingsStore.Colors.expenseBottomHue = $HeatmapSettingsStore.defaultColors.expenseBottomHue;
                $HeatmapSettingsStore.Colors.expenseBottomSat = $HeatmapSettingsStore.defaultColors.expenseBottomSat;
                $HeatmapSettingsStore.Colors.expenseBottomLum = $HeatmapSettingsStore.defaultColors.expenseBottomLum;
            } else {
                let incomeHSL = hexToHSL(incomeColor);
                $HeatmapSettingsStore.Colors.incomeHue = incomeHSL.h; 
                $HeatmapSettingsStore.Colors.incomeSat = incomeHSL.s; 
                $HeatmapSettingsStore.Colors.incomeLum = incomeHSL.l;
                let expenseHSL = hexToHSL(expenseColor);
                $HeatmapSettingsStore.Colors.expenseHue = expenseHSL.h;
                $HeatmapSettingsStore.Colors.expenseSat = expenseHSL.s;
                $HeatmapSettingsStore.Colors.expenseLum = expenseHSL.l;
                let incomeTopHSL = hexToHSL(incomeTopColor);
                $HeatmapSettingsStore.Colors.incomeTopHue = incomeTopHSL.h;
                $HeatmapSettingsStore.Colors.incomeTopSat = incomeTopHSL.s; 
                $HeatmapSettingsStore.Colors.incomeTopLum = incomeTopHSL.l;
                let incomeHighHSL = hexToHSL(incomeHighColor);
                $HeatmapSettingsStore.Colors.incomeHighHue = incomeHighHSL.h
                $HeatmapSettingsStore.Colors.incomeHighSat = incomeHighHSL.s
                $HeatmapSettingsStore.Colors.incomeHighLum = incomeHighHSL.l;
                let incomeLowHSL = hexToHSL(incomeLowColor);
                $HeatmapSettingsStore.Colors.incomeLowHue = incomeLowHSL.h;
                $HeatmapSettingsStore.Colors.incomeLowSat = incomeLowHSL.s;
                $HeatmapSettingsStore.Colors.incomeLowLum = incomeLowHSL.l;
                let incomeBottomHSL = hexToHSL(incomeBottomColor);
                $HeatmapSettingsStore.Colors.incomeBottomHue = incomeBottomHSL.h;
                $HeatmapSettingsStore.Colors.incomeBottomSat = incomeBottomHSL.s;
                $HeatmapSettingsStore.Colors.incomeBottomLum = incomeBottomHSL.l;
                let expenseTopHSL = hexToHSL(expenseTopColor);
                $HeatmapSettingsStore.Colors.expenseTopHue = expenseTopHSL.h;
                $HeatmapSettingsStore.Colors.expenseTopSat = expenseTopHSL.s;
                $HeatmapSettingsStore.Colors.expenseTopLum = expenseTopHSL.l;
                let expenseHighHSL = hexToHSL(expenseHighColor);
                $HeatmapSettingsStore.Colors.expenseHighHue = expenseHighHSL.h;
                $HeatmapSettingsStore.Colors.expenseHighSat = expenseHighHSL.s;
                $HeatmapSettingsStore.Colors.expenseHighLum = expenseHighHSL.l;
                let expenseLowHSL = hexToHSL(expenseLowColor);
                $HeatmapSettingsStore.Colors.expenseLowHue = expenseLowHSL.h;
                $HeatmapSettingsStore.Colors.expenseLowSat = expenseLowHSL.s;
                $HeatmapSettingsStore.Colors.expenseLowLum = expenseLowHSL.l;
                let expenseBottomHSL = hexToHSL(expenseBottomColor);
                $HeatmapSettingsStore.Colors.expenseBottomHue = expenseBottomHSL.h;
                $HeatmapSettingsStore.Colors.expenseBottomSat = expenseBottomHSL.s;
                $HeatmapSettingsStore.Colors.expenseBottomLum = expenseBottomHSL.l;
            }
            dispatch('colorChange', );
        }
        if (budgetSelectedFlag) {
            $HeatmapSettingsStore.selectedBudget.Id = selectedBudget;
            dispatch('budgetChange', );
        }
        if (themeSelectedFlag) {
            toggle(selectedTheme);
            localStorage.setItem("theme", selectedTheme);
        }
        togglePopup();
    }
    /**
     * Convert supplied hsl values to hex code.
     * @param h hue of hsl
     * @param s saturation of hsl
     * @param l lightness of hsl
     * @return {String} hex code value of supplied hsl
     */
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    /**
     * Convert supplied hex value to hsl values.
     * @param {String} hex supplied hex value to convert
     * @return {Object} object containing h,s,l values of converted hex value 
     */
    function hexToHSL(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);

        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }

        s = s*100;
        s = Math.round(s);
        l = l*100;
        l = Math.round(l);
        h = Math.round(360*h);

        return {h, s, l};
    }
</script>
<div class="popup" in:scale="{{duration: 150}}">
    <p class="title">Heatmap Settings</p>
    <div class="option-list">
        <div class="option">
            <p class="option-title">Colors: <span on:click="{() => saveChanges('defaults')}">Defaults</span></p>
            <div class="option-section">
                <label for="income-colorPicker">Income</label>
                <input type="color" id="income-colorPicker" bind:value={incomeColor} on:change="{() => colorSelectedFlag = 1}">
                <div class="option-grouping">
                    <label for="income-top-colorPicker">Top 10%</label>
                    <input type="color" id="income-top-colorPicker" bind:value={incomeTopColor} on:change="{() => colorSelectedFlag = 1}">
                    <label for="income-high-colorPicker">High</label>
                    <input type="color" id="income-high-colorPicker" bind:value={incomeHighColor} on:change="{() => colorSelectedFlag = 1}">
                    <label for="income-low-colorPicker">Low</label>
                    <input type="color" id="income-low-colorPicker" bind:value={incomeLowColor} on:change="{() => colorSelectedFlag = 1}">
                    <label for="income-bottom-colorPicker">Bottom 10%</label>
                    <input type="color" id="income-bottom-colorPicker" bind:value={incomeBottomColor} on:change="{() => colorSelectedFlag = 1}">
                </div>
            </div>
            <div class="option-section">
                <label for="expense-colorPicker">Expense</label>
                <input type="color" id="expense-colorPicker" bind:value={expenseColor} on:change="{() => colorSelectedFlag = 1}">
                <div class="option-grouping">
                    <label for="expense-top-colorPicker">Top 10%</label>
                    <input type="color" id="expense-top-colorPicker" bind:value={expenseTopColor} on:change="{() => colorSelectedFlag = 1}">
                    <label for="expense-high-colorPicker">High</label>
                    <input type="color" id="expense-high-colorPicker" bind:value={expenseHighColor} on:change="{() => colorSelectedFlag = 1}">
                    <label for="expense-low-colorPicker">Low</label>
                    <input type="color" id="expense-low-colorPicker" bind:value={expenseLowColor} on:change="{() => colorSelectedFlag = 1}">
                    <label for="expense-bottom-colorPicker">Bottom 10%</label>
                    <input type="color" id="expense-bottom-colorPicker" bind:value={expenseBottomColor} on:change="{() => colorSelectedFlag = 1}">
                </div>
            </div>
            <div class="option-twocolumn">
                <div class="option-twocolumn-section">
                    <p class="option-title">Budget:</p>
                    <div class="option-section">
                        <select class="budget-select" name="budgets" bind:value={selectedBudget} on:change="{() => budgetSelectedFlag = 1}">
                            {#each $HeatmapSettingsStore.Budgets as budget}
                                <option value={budget.Id}>{budget.Name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <div class="option-twocolumn-section">
                    <p class="option-title">Theme:</p>
                    <div class="option-section">
                        <select class="theme-select" name="themes" bind:value={selectedTheme} on:change="{() => themeSelectedFlag = 1}">
                            {#each themes as theme}
                                <option value={theme}>{theme}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="buttons">
        <Button type="secondary" on:click={togglePopup}>Cancel</Button>
        <Button on:click={() => saveChanges('regular')}>Done</Button>
    </div>
</div>
<style lang="scss">
    .popup {
        position: relative;

        margin: 125px auto 0 auto;
        padding-top: 2px;
        width: 500px;
        height: 425px;

        background-color: white;
        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);

        opacity: 1;

        @media screen and (max-width: 1449px) {
            left: 50px;
        }
        @media screen and (max-width: 1365px) {
            left: 100px;
        }
    }
    .popup::after {
        position: absolute;
        bottom: 100%;
        left: 50%;

        margin-left: -5px;
        content: " ";

        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent white transparent;
    }
    .title {
        margin: 15px 15px 5px 15px;
        
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        color: #383e41;

        font-size: 1em;
        font-weight: 700;
    }
    .option-twocolumn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        margin-right: 40px;
    }
    .option-list {
        margin: 15px 0 0 15px;
        height: 300px;

        font-size: .9rem;
    }
    .option-title {
        font-size: 1.25em;
    }
    .option-section {
        display: block;

        margin-left: 5px;
    }
    .option-section > input {
        display: block;

        width: 50px;
        height: 27px;

        cursor: pointer;
    }
    .option-section > label {
        cursor: pointer;
    }
    .option-grouping {
        margin: 10px 0 10px 10px;
    }
    .option-grouping > label {
        cursor: pointer;
    }
    .option-grouping > input {
        display: inline-block;

        margin-right: 10px;
        width: 50px;
        height: 27px;

        cursor: pointer;
    }
    span {
            display: inline-block;

            margin: 3px 0px 0 4px;
            padding: .2em .6em;
            
            background: none;
            border-radius: 1000px;
            color: var(--theme-primary);

            font-size: 13.5px;

            &:hover {
                background-color: var(--theme-primary);

                color: white;

                cursor: pointer;
            }
        }
    .buttons {
        float: right;

        margin: 15px 10px 0 0;
        width: 140px;
    }
    .budget-select {
        margin-top: 10px;
        height: 30px;
    }
    .theme-select {
        margin-top: 10px;
        height: 30px;
    }
</style>