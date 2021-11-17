<script>
    import { createEventDispatcher } from 'svelte';
    import NavOptionsStore from "../stores/navOptionsStore";
    import DateSelectionPopup from '../components/DateSelectionPopup.svelte';
    import HeatmapSettingsStore from '../stores/heatmapSettingsStore';

    const dispatch = createEventDispatcher();

    export let changeSelectedOption = () => {};
    export let refreshCalendar = () => {};
    
    var showPopup = false;

    let formattedStartDate, formattedEndDate;
    let incomeSelectedColor, expenseSelectedColor, netSelectedColor, incomeCurrentColor, expenseCurrentColor, netCurrentColor;

    $: $NavOptionsStore.startDate, formattedStartDate = formatSelectedDate($NavOptionsStore.startDate);
    $: $NavOptionsStore.endDate, formattedEndDate = formatSelectedDate($NavOptionsStore.endDate);
    $: $NavOptionsStore.selectedOption, setOptionColors();
    $: $HeatmapSettingsStore.Colors, setOptionColors();

    /**
     * Set the option colors used with the option icons.
     */
    function setOptionColors () {
        if ($NavOptionsStore.selectedOption === 'income') {
            incomeSelectedColor = `hsl(${$HeatmapSettingsStore.Colors.incomeHue}, ${$HeatmapSettingsStore.Colors.incomeSat}%, ${$HeatmapSettingsStore.Colors.incomeLum}%)`;
            expenseSelectedColor = 'rgba(187, 167, 167, 0.842)';
            netSelectedColor = 'rgba(187, 167, 167, 0.842)';
        } else if ($NavOptionsStore.selectedOption === 'expense') {
            incomeSelectedColor = 'rgba(187, 167, 167, 0.842)';
            expenseSelectedColor = `hsl(${$HeatmapSettingsStore.Colors.expenseHue}, ${$HeatmapSettingsStore.Colors.expenseSat}%, ${$HeatmapSettingsStore.Colors.expenseLum}%)`;
            netSelectedColor = 'rgba(187, 167, 167, 0.842)';
        } else {
            incomeSelectedColor = 'rgba(187, 167, 167, 0.842)';
            expenseSelectedColor = 'rgba(187, 167, 167, 0.842)';
            netSelectedColor = `hsl(${$HeatmapSettingsStore.Colors.expenseHue}, ${$HeatmapSettingsStore.Colors.expenseSat}%, ${$HeatmapSettingsStore.Colors.expenseLum}%)`;
        }
        incomeCurrentColor = `hsl(${$HeatmapSettingsStore.Colors.incomeHue}, ${$HeatmapSettingsStore.Colors.incomeSat}%, ${$HeatmapSettingsStore.Colors.incomeLum}%)`;
        expenseCurrentColor = `hsl(${$HeatmapSettingsStore.Colors.expenseHue}, ${$HeatmapSettingsStore.Colors.expenseSat}%, ${$HeatmapSettingsStore.Colors.expenseLum}%)`;
        netCurrentColor = `hsl(${$HeatmapSettingsStore.Colors.expenseHue}, ${$HeatmapSettingsStore.Colors.expenseSat}%, ${$HeatmapSettingsStore.Colors.expenseLum}%)`;
    }

    /**
     * Changes the selected style based on the style selected by the user.
     * @param {String} style style selected by user
    */
    function toggleSelectedStyle (style) {
        $NavOptionsStore.selectedStyle = style;
        refreshCalendar();
    }
    /**
     * Takes the supplied date object and formats it to be displayed as the main date range.
     * @param {Date} date date to be formatted
    */
    function formatSelectedDate (date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let newDate;

        if (month === 1) {
            newDate = 'Jan ' + year;
        } else if (month === 2) {
            newDate = 'Feb ' + year;
        } else if (month === 3) {
            newDate = 'Mar ' + year; 
        } else if (month === 4) {
            newDate = 'Apr ' + year;
        } else if (month === 5) {
            newDate = 'May ' + year;
        } else if (month === 6) {
            newDate = 'Jun ' + year;
        } else if (month === 7) {
            newDate = 'Jul ' + year; 
        } else if (month === 8) {
            newDate = 'Aug ' + year;
        } else if (month === 9) {
            newDate = 'Sep ' + year;
        } else if (month === 10) {
            newDate = 'Oct ' + year; 
        } else if (month === 11) {
            newDate = 'Nov ' + year;
        } else {
            newDate = 'Dec ' + year;
        }

        return newDate;
    }
    /**
     * Opens and closes the trans list popup.
     */
     function togglePopup () {
        showPopup = !showPopup;
    }
</script>
<div class="cal-navigation">
    <div class="cal-options">
        <button style="--incomeSelectedColor: {incomeSelectedColor}; --incomeCurrentColor: {incomeCurrentColor}" on:click={() => changeSelectedOption('income')}><div class="desc-popup"><span class="material-icons-outlined md-36 income-icon icon" class:selected={$NavOptionsStore.selectedOption === 'income'} class:nonselected-icon={$NavOptionsStore.selectedOption != 'income'}>savings</span><div class="desc-text income">Income</div></div></button>
        <button style="--expenseSelectedColor: {expenseSelectedColor}; --expenseCurrentColor: {expenseCurrentColor}" on:click={() => changeSelectedOption('expense')}><div class="desc-popup"><span class="material-icons-outlined md-36 expense-icon icon" class:selected={$NavOptionsStore.selectedOption === 'expense'} class:nonselected-icon={$NavOptionsStore.selectedOption != 'expense'}>paid</span><div class="desc-text expense">Expense</div></div></button>
        <button style="--netSelectedColor: {netSelectedColor}; --netCurrentColor: {netCurrentColor}; --incomeSelectedColor: {incomeSelectedColor}; --incomeCurrentColor: {incomeCurrentColor}" on:click={() => changeSelectedOption('net')}><div class="desc-popup"><span class="material-icons-outlined md-36 net-icon icon" class:selected={$NavOptionsStore.selectedOption === 'net'} class:nonselected-icon={$NavOptionsStore.selectedOption != 'net'}>request_quote</span><div class="desc-text net">Net</div></div></button>
    </div>
    <div class="cal-date" on:click={() => togglePopup()}>
        <div class="cal-date-container">
            <p>{formattedStartDate} - {formattedEndDate}</p><span class="material-icons-round md-36">arrow_drop_down</span>
        </div>
    </div>
    <div class="cal-styles">
        <button on:click={() => toggleSelectedStyle('regular')}><div class="desc-popup"><span class="material-icons-outlined md-36 style-regular-icon icon" class:selected={$NavOptionsStore.selectedStyle === 'regular'} class:nonselected-icon={$NavOptionsStore.selectedStyle != 'regular'}>local_fire_department</span><div class="desc-text seq">Sequential</div></div></button>
        <button on:click={() => toggleSelectedStyle('group')}><div class="desc-popup"><span class="material-icons-outlined md-36 style-group-icon icon" class:selected={$NavOptionsStore.selectedStyle === 'group'} class:nonselected-icon={$NavOptionsStore.selectedStyle != 'group'}>whatshot</span><div class="desc-text group">Grouping</div></div></button>
        <button on:click={() => toggleSelectedStyle('simple')}><div class="desc-popup"><span class="material-icons-outlined md-36 style-simple-icon icon" class:selected={$NavOptionsStore.selectedStyle === 'simple'} class:nonselected-icon={$NavOptionsStore.selectedStyle != 'simple'}>fireplace</span><div class="desc-text simple">Simple</div></div></button>
    </div>
    {#if showPopup}
        <div class="backdrop" on:click|self={() => togglePopup()}>
            <DateSelectionPopup {togglePopup} on:dateChange/>
        </div>
    {/if}
</div>

<style lang="scss">
    .cal-navigation {
        display: block;
    
        height: 50px;
    }
    .cal-options {
        float: left;
        margin-left: 25px;
        width: 213px;

        & button {
            margin-right: 20px;
            background: none;
            border: none;
        }
    }
    .icon {
        cursor: pointer;
    }
    .income-icon.selected {
        color: var(--incomeSelectedColor);

        transition-duration: 350ms;
    }
    .income-icon:hover {
        color: var(--incomeCurrentColor);

        transition-duration: 350ms;
    }
    .expense-icon.selected {
        color: var(--expenseSelectedColor);

        transition-duration: 350ms;
    }
    .expense-icon:hover {
        color: var(--expenseCurrentColor);

        transition-duration: 350ms;
    }
    .net-icon.selected {
        color: var(--netSelectedColor);

        transition-duration: 350ms;
    }
    .net-icon:hover {
        color: var(--netCurrentColor);

        transition-duration: 350ms;
    }
    .nonselected-icon {
        color: rgba(187, 167, 167, 0.842);

        transition-duration: 350ms;
    }
    .cal-date {
        float: left;

        margin-left: 90px;
        width: 300px;

        cursor: pointer;
    }
    .cal-date:hover {
        color: var(--ynab-light-green);
    }
    .cal-date:hover span {
        color: var(--ynab-light-green);
    }
    .cal-date-container {
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .cal-date p {
        margin: 0 5px;

        font-size: 1.5em;
    }
    .cal-styles {
        float: right;

        width: 223px;

        & button {
            margin-left: 20px;
            background: none;
            border: none;
        }
    }
    .style-regular-icon.selected, .style-regular-icon:hover {
        color: #B31313;
    }
    .style-group-icon.selected, .style-group-icon:hover {
        color: #FF9000;
    }
    .style-simple-icon.selected, .style-simple-icon:hover {
        color: #FEDE17;
    }
    .desc-popup {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .desc-popup .desc-text {
        position: absolute;

        bottom: 125%;
        left: -90%;
        padding: 5px;
        width: 100px;

        border-radius: 5px;
  
        color: white;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
   
        z-index: 1;
        opacity: 0;
        transition-duration: 350ms;
    }
    .desc-popup .desc-text.income {
        background-color: var(--incomeCurrentColor);
    }
    .desc-popup .desc-text.expense {
        background-color: var(--expenseCurrentColor);
    }
    .desc-popup .desc-text.net {
        background-color: var(--incomeCurrentColor);
    }
    .desc-popup .desc-text.seq {
        background-color: #B31313;
    }
    .desc-popup .desc-text.group {
        background-color: #FF9000;
    }
    .desc-popup .desc-text.simple {
        background-color: #FEDE17;
    }
    .desc-popup .desc-text:after {
        content: "";
        position: absolute;

        top: 100%;
        left: 50%;
        margin-left: -5px;

        border-width: 5px;
        border-style: solid;
    }
    .desc-popup .desc-text.income:after {
        border-color: var(--incomeCurrentColor) transparent transparent transparent;
    }
    .desc-popup .desc-text.expense:after {
        border-color: var(--expenseCurrentColor) transparent transparent transparent;
    }
    .desc-popup .desc-text.net:after {
        border-color: var(--incomeCurrentColor) transparent transparent transparent;
    }
    .desc-popup .desc-text.seq:after {
        border-color: #B31313 transparent transparent transparent;
    }
    .desc-popup .desc-text.group:after {
        border-color: #FF9000 transparent transparent transparent;
    }
    .desc-popup .desc-text.simple:after {
        border-color: #FEDE17 transparent transparent transparent;
    }
    .icon:hover + .desc-text{
        opacity: 1;
        transition-duration: 350ms;
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