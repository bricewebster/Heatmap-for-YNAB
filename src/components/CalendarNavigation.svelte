<script>
    import { createEventDispatcher } from 'svelte';
    import NavOptionsStore from "../stores/navOptionsStore";
    import DateSelectionPopup from '../components/DateSelectionPopup.svelte';

    const dispatch = createEventDispatcher();

    export let changeSelectedOption = () => {};
    export let refreshCalendar = () => {};
    
    var showPopup = false;

    let formattedStartDate, formattedEndDate;

    $: $NavOptionsStore.startDate, formattedStartDate = formatSelectedDate($NavOptionsStore.startDate);
    $: $NavOptionsStore.endDate, formattedEndDate = formatSelectedDate($NavOptionsStore.endDate);

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
        <button on:click={() => changeSelectedOption('income')}><div class="desc-popup"><div class="desc-text income">Income</div><span class="material-icons-outlined md-36 income-icon" class:selected={$NavOptionsStore.selectedOption === 'income'} class:nonselected-icon={$NavOptionsStore.selectedOption != 'income'}>savings</span></div></button>
        <button on:click={() => changeSelectedOption('expense')}><div class="desc-popup"><div class="desc-text expense">Expense</div><span class="material-icons-outlined md-36 expense-icon" class:selected={$NavOptionsStore.selectedOption === 'expense'} class:nonselected-icon={$NavOptionsStore.selectedOption != 'expense'}>paid</span></div></button>
        <button on:click={() => changeSelectedOption('net')}><div class="desc-popup"><div class="desc-text net">Net</div><span class="material-icons-outlined md-36 net-icon" class:selected={$NavOptionsStore.selectedOption === 'net'} class:nonselected-icon={$NavOptionsStore.selectedOption != 'net'}>request_quote</span></div></button>
    </div>
    <div class="cal-date" on:click={() => togglePopup()}>
        <div class="cal-date-container">
            <p>{formattedStartDate} - {formattedEndDate}</p><span class="material-icons-round md-36">arrow_drop_down</span>
        </div>
    </div>
    <div class="cal-styles">
        <button on:click={() => toggleSelectedStyle('regular')}><div class="desc-popup"><div class="desc-text seq">Sequential</div><span class="material-icons-outlined md-36 style-regular-icon" class:selected={$NavOptionsStore.selectedStyle === 'regular'} class:nonselected-icon={$NavOptionsStore.selectedStyle != 'regular'}>local_fire_department</span></div></button>
        <button on:click={() => toggleSelectedStyle('group')}><div class="desc-popup"><div class="desc-text group">Grouping</div><span class="material-icons-outlined md-36 style-group-icon" class:selected={$NavOptionsStore.selectedStyle === 'group'} class:nonselected-icon={$NavOptionsStore.selectedStyle != 'group'}>whatshot</span></div></button>
        <button on:click={() => toggleSelectedStyle('simple')}><div class="desc-popup"><div class="desc-text simple">Simple</div><span class="material-icons-outlined md-36 style-simple-icon" class:selected={$NavOptionsStore.selectedStyle === 'simple'} class:nonselected-icon={$NavOptionsStore.selectedStyle != 'simple'}>fireplace</span></div></button>
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

            cursor: pointer;
        }
    }
    .income-icon.selected, .income-icon:hover {
        color: #00a567;

        transition-duration: 350ms;
    }
    .expense-icon.selected, .expense-icon:hover {
        color: #de5d83;

        transition-duration: 350ms;
    }
    .net-icon.selected, .net-icon:hover {
        color: #ffb347;

        transition-duration: 350ms;
    }
    .nonselected-icon {
        color:  rgba(187, 167, 167, 0.842);

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
    .cal-date p{
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

            cursor: pointer;
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
        background-color: #00a567;
    }
    .desc-popup .desc-text.expense {
        background-color: #de5d83;
    }
    .desc-popup .desc-text.net {
        background-color: #ffb347;
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
        border-color: #00a567 transparent transparent transparent;
    }
    .desc-popup .desc-text.expense:after {
        border-color: #de5d83 transparent transparent transparent;
    }
    .desc-popup .desc-text.net:after {
        border-color: #ffb347 transparent transparent transparent;
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
    .desc-popup:hover .desc-text {
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