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

    let summaryList = [{Month: 0, Amount: 0, amountFormatted: '', displayName: 'January', Rank: 0, Color: '', Class: 'none'}, {Month: 1, Amount: 0, amountFormatted: '', displayName: 'February',  Rank: 0, Color: '', Class: 'none'},
                       {Month: 2, Amount: 0, amountFormatted: '', displayName: 'March',  Rank: 0, Color: '', Class: 'none'}, {Month: 3, Amount: 0, amountFormatted: '', displayName: 'April',  Rank: 0, Color: '', Class: 'none'},
                       {Month: 4, Amount: 0, amountFormatted: '', displayName: 'May',  Rank: 0, Color: '', Class: 'none'}, {Month: 5, Amount: 0, amountFormatted: '', displayName: 'June',  Rank: 0, Color: '', Class: 'none'},
                       {Month: 6, Amount: 0, amountFormatted: '', displayName: 'July',  Rank: 0, Color: '', Class: 'none'}, {Month: 7, Amount: 0, amountFormatted: '', displayName: 'August',  Rank: 0, Color: '', Class: 'none'},
                       {Month: 8, Amount: 0, amountFormatted: '', displayName: 'September',  Rank: 0, Color: '', Class: 'none'}, {Month: 9, Amount: 0, amountFormatted: '', displayName: 'October',  Rank: 0, Color: '', Class: 'none'},
                       {Month: 10, Amount: 0, amountFormatted: '', displayName: 'November',  Rank: 0, Color: '', Class: 'none'}, {Month: 11, Amount: 0, amountFormatted: '', displayName: 'December',  Rank: 0, Color: '', Class: 'none'}];
    
    let transactionList;

    
    //Reactively calls refreshCalendar when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, refreshCalendar();

    /**
     * Main function that refreshes the calendar. It is called when sections of the calendar are updated.
     */
    function refreshCalendar () {
        transactionList = [[],[],[],[],[],[],[],[],[],[],[],[]];
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
     * When a month is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} month month clicked
     * @param {String} dateFormatted month clicked in user settings format
     * @param {String} amountFormatted amount for month clicked in user settings format
     */
     function dayClicked(month, displayName, amountFormatted) {
        selectedSquare = displayName;
        selectedList = getSelectedDaysTransactions(month);
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
    <CalendarNavigation {changeSelectedOption} {refreshCalendar} selectedTab = "monthly" on:dateChange/>
    <div class="cal-container">
        <table class="cal-month">
            {#each Array(2) as _, mainIndex}
            <tr>
                {#each summaryList as month, index}
                    {#if index < 6 & mainIndex === 0}
                        {#if month.Amount != 0}
                            <th class="{month.Class} populated" style="{month.Color}" on:click={() => dayClicked(month.Month, month.displayName, month.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{month.displayName}</p><p class="amount">{month.amountFormatted}</p></div></div></div></th>
                        {:else}
                            <th class="{month.Class}"><p>{month.displayName}</p></th>
                        {/if}
                    {/if}
                    {#if index >= 6 & mainIndex === 1}
                        {#if month.Amount != 0}
                            <th class="{month.Class} populated" style="{month.Color}" on:click={() => dayClicked(month.Month, month.displayName, month.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{month.displayName}</p><p class="amount">{month.amountFormatted}</p></div></div></div></th>
                        {:else}
                            <th class="{month.Class}"><p>{month.displayName}</p></th>
                        {/if}
                    {/if}
                {/each}
            </tr>
            {/each}
        </table>
    <HeatmapValue />
    </div>
    {#if showPopup}
        <div class="backdrop" on:click|self={() => togglePopup()}>
            <TransListPopup {selectedSquare} {selectedList} {selectedAmount} popupType = 'monthly' {togglePopup}/>
        </div>
    {/if}
</div>

<style>
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 765px;
    }
    .cal-container {
        margin: 15px auto 0 auto;
        width: 765px;
    }
    .cal-month {
        display: inline-block;

        margin-right: 5px;
        width: 635px;
        height: auto;

        border-spacing: 5px;

        font-size: 12px;
    }
    .cal-month tr {
        width: 100%;
        height: auto;
    }
    .cal-month th {
        position: relative;

        width: 100px;
        height: 55px; 
    }
    .date {
        position: absolute;
        top: 0;
        left: 0;

        margin: 5px 0 0 5px;
    }
    .amount {
        display: flex;
        justify-content: center;
        align-items: center;

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
        position: absolute;
        bottom: -6px;
        left: -6px;

        width: 112.25%;
        height: 5px;
        content: '';

        background: var(--theme-secondary);
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
        position: absolute;
        top: -6px;
        left: -6px;

        width: 5px;
        height: 114%;
        content: '';

        background: var(--theme-secondary);
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
        position: absolute;
        top: -6px;
        right: -6px;

        width: 5px;
        height: 114%;
        content: '';

        background: var(--theme-secondary);
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
        position: absolute;
        top: -6px;
        left: -6px;

        width: 63.5%;
        height: 5px;
        content: '';

        background: var(--theme-secondary);
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
        position: absolute;
        top: -6px;
        right: -6px;

        width: 63.5%;
        height: 5px;
        content: '';

        background: var(--theme-secondary);
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

<!-- markup (zero or more items) goes here -->