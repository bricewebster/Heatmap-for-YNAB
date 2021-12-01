<script>
    import CalendarNavigation from "./CalendarNavigation.svelte";
    import HeatmapValue from "./HeatmapValue.svelte";
    import TransListPopup from '../components/TransListPopup.svelte';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import NavOptionsStore from "../stores/navOptionsStore";

    export let populateTransactionList = () => {};
    export let populateSummaryList = () => {};
    export let getSelectedDaysTransactions = () => {};
    export let changeSelectedStyle = () => {};

    var showPopup = false;
    let selectedSquare;
    let selectedList = [];
    let selectedAmount;

    let summaryList = [{Week: 0, Amount: 0, amountFormatted: '', displayName: 'Week 1 \n(1-7)', Rank: 0, Color: '', Class: 'none'}, 
                       {Week: 1, Amount: 0, amountFormatted: '', displayName: 'Week 2 \n(8-14)', Rank: 0, Color: '', Class: 'none'},
                       {Week: 2, Amount: 0, amountFormatted: '', displayName: 'Week 3 \n(15-21)', Rank: 0, Color: '', Class: 'none'},
                       {Week: 3, Amount: 0, amountFormatted: '', displayName: 'Week 4 \n(22-28)', Rank: 0, Color: '', Class: 'none'},
                       {Week: 4, Amount: 0, amountFormatted: '', displayName: 'Week 5 \n(29-31)', Rank: 0, Color: '', Class: 'none'}];
    let transactionList;

    //Reactively calls refreshCalendar when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, refreshCalendar();

    /**
     * Main function that refreshes the calendar. It is called when sections of the calendar are updated.
     */
     function refreshCalendar () {
        transactionList = [[],[],[],[],[]];
        transactionList = populateTransactionList(transactionList);
        summaryList = populateSummaryList(summaryList, transactionList);
        summaryList = changeSelectedStyle(summaryList);
    }
    /**
     * Change selected option to what was choosen by the user.
     * @param {String} option option choosen by user
     */
    function changeSelectedOption (option) {
        $NavOptionsStore.selectedOption = option;
        refreshCalendar();
    }
    /**
     * When a day is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} week week clicked
     * @param {String} dateFormatted week clicked in user settings format
     * @param {String} amountFormatted amount for week clicked in user settings format
     */
     function dayClicked(week, displayName, amountFormatted) {
        selectedSquare = displayName;
        selectedList = getSelectedDaysTransactions(week);
        selectedAmount = amountFormatted;
        togglePopup();
    }
    /**
     * Opens and closes the trans list popup.
     */
     function togglePopup () {
        showPopup = !showPopup;
    }
</script>
<div class="content">
    <CalendarNavigation {changeSelectedOption} {refreshCalendar} selectedTab = "weeksofmonth" on:dateChange/>
    <div class="cal-container">
        <table class="cal-week">
            {#each summaryList as week}
                {#if week.Amount != 0}
                    <th class="{week.Class} populated" style="{week.Color}" on:click={() => dayClicked(week.Week, week.displayName, week.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{week.displayName}</p><p class="amount">{week.amountFormatted}</p></div></div></div></th>
                {:else}
                    <th class="{week.Class}"><p>{week.displayName}</p></th>
                {/if}
            {/each}
        </table>
        <HeatmapValue />
    </div>
    {#if showPopup}
        <div class="backdrop" on:click|self={() => togglePopup()}>
            <TransListPopup {selectedSquare} {selectedList} {selectedAmount} popupType = 'weeksofmonth' {togglePopup}/>
        </div>
    {/if}    
</div>
<style>
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 660px;
    }
    .cal-container {
        margin: 15px auto 0 auto;
    }
    .cal-week {
        display: inline-block;

        width: 535px;
        height: auto;

        font-size: 12px;

        border-spacing: 5px;
    }
    .cal-week th {
        position: relative;
        width: 100px;
        height: 65px; 
    }
    .date {
        position: absolute;
        top: 0;
        left: 25px;
        margin: 5px 0 0 5px;
        
        white-space: pre-line;
    }
    .amount {
        display: flex;
        justify-content: center;
        align-items: flex-end;

        padding-bottom: 10px;
        height: 100%;
    }
    .income {
        background-color: #00a567;
        color: white;
        
        transition-duration: 350ms;
    }
    .expense {
        background-color: #de5d83;
        color: white;
        
        transition-duration: 350ms;
    }
    .net {
        color: white;

        transition-duration: 350ms;
    }
    .none {
        background-color:  rgba(187, 167, 167, 0.842);
        
        transition-duration: 350ms;
    }
    .populated {
        cursor: pointer;
    }
    .populated-main-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .populated-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .populated-subcontainer {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .populated-subcontainer::before {
        /* Bottom Line */
        content: '';
        position: absolute;

        bottom: -6px;
        left: -6px;
        width: 112.25%;
        height: 5px;

        background: var(--theme-tertiary);

        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

        transform: scaleX(0);
        transform-origin: center;
        transition: transform 250ms ease-in;
        transition-delay: 500ms;
    }
    .populated-main-container:hover .populated-subcontainer::before {
        transform: scaleX(1);
        transition: transform 250ms ease-in;
        transition-delay: 200ms;
    }
    .populated-subcontainer::after {
        /* Left Line */
        content: '';
        position: absolute;

        top: -6px;
        left: -6px;
        width: 5px;
        height: 114%;

        background: var(--theme-tertiary);
        border-top-left-radius: 5px;

        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 250ms ease-in;
        transition-delay: 300ms;
    }
    .populated-main-container:hover .populated-subcontainer::after {
        transform: scaleY(1);
        transition: transform 250ms ease-in;
        transition-delay: 400ms;
    }
    .populated-container::before {
        /* Right Line */
        content: '';
        position: absolute;

        top: -6px;
        right: -6px;
        width: 5px;
        height: 114%;

        background: var(--theme-tertiary);
        border-top-right-radius: 5px;

        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 250ms ease-in;
        transition-delay: 300ms;
    }
    .populated-main-container:hover .populated-container::before {
        transform: scaleY(1);
        transform-origin: bottom;
        transition: transform 250ms ease-in;
        transition-delay: 400ms;
    }
    .populated-container::after {
        /* Top Left Line */
        content: '';
        position: absolute;

        top: -6px;
        left: -6px;
        width: 63.5%;
        height: 5px;

        background: var(--theme-tertiary);
        border-top-left-radius: 5px;

        transform: scaleX(0);
        transform-origin: left;
        transition: transform 250ms ease-in;
        transition-delay: 100ms;
    }
    .populated-main-container:hover .populated-container::after {
        transform: scaleX(1);
        transition: transform 250ms ease-in;
        transition-delay: 600ms;
    }
    .populated-main-container::before {
        /* Top Right Line */
        content: '';
        position: absolute;

        top: -6px;
        right: -6px;
        width: 63.5%;
        height: 5px;

        background: var(--theme-tertiary);
        border-top-right-radius: 5px;

        transform: scaleX(0);
        transform-origin: right;
        transition: transform 250ms ease-in;
        transition-delay: 100ms;
    }
    .populated-main-container:hover::before {
        transform: scaleX(1);
        transition: transform 250ms ease-in;
        transition-delay: 600ms;
    }
    .backdrop {
        position: fixed;

        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        z-index: 10;
        overflow-y: auto;
    }
</style>