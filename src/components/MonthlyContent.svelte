<script>
    import CalendarNavigation from "./CalendarNavigation.svelte";
    import TransListPopup from '../components/TransListPopup.svelte';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import { fade } from 'svelte/transition';

    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let populateTransactionList = () => {};
    export let populateSummaryList = () => {};
    export let getSelectedDaysTransactions = () => {};
    export let changeSelectedStyle = () => {};

    var showPopup = false;
    let selectedDay;
    let selectedDayList = [];
    let selectedAmount;

    let summaryList = [{dayOfMonth: 0, Amount: 0, amountFormatted: '', displayName: '1st', Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 1, Amount: 0, amountFormatted: '', displayName: '2nd',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 2, Amount: 0, amountFormatted: '', displayName: '3rd',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 3, Amount: 0, amountFormatted: '', displayName: '4th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 4, Amount: 0, amountFormatted: '', displayName: '5th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 5, Amount: 0, amountFormatted: '', displayName: '6th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 6, Amount: 0, amountFormatted: '', displayName: '7th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 7, Amount: 0, amountFormatted: '', displayName: '8th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 8, Amount: 0, amountFormatted: '', displayName: '9th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 9, Amount: 0, amountFormatted: '', displayName: '10th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 10, Amount: 0, amountFormatted: '', displayName: '11th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 11, Amount: 0, amountFormatted: '', displayName: '12th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 12, Amount: 0, amountFormatted: '', displayName: '13th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 13, Amount: 0, amountFormatted: '', displayName: '14th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 14, Amount: 0, amountFormatted: '', displayName: '15th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 15, Amount: 0, amountFormatted: '', displayName: '16th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 16, Amount: 0, amountFormatted: '', displayName: '17th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 17, Amount: 0, amountFormatted: '', displayName: '18th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 18, Amount: 0, amountFormatted: '', displayName: '19th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 19, Amount: 0, amountFormatted: '', displayName: '20th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 20, Amount: 0, amountFormatted: '', displayName: '21st',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 21, Amount: 0, amountFormatted: '', displayName: '22nd',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 22, Amount: 0, amountFormatted: '', displayName: '23rd',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 23, Amount: 0, amountFormatted: '', displayName: '24th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 24, Amount: 0, amountFormatted: '', displayName: '25th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 25, Amount: 0, amountFormatted: '', displayName: '26th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 26, Amount: 0, amountFormatted: '', displayName: '27th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 27, Amount: 0, amountFormatted: '', displayName: '28th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 28, Amount: 0, amountFormatted: '', displayName: '29th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 29, Amount: 0, amountFormatted: '', displayName: '30th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 30, Amount: 0, amountFormatted: '', displayName: '31st',  Rank: 0, Color: '', Class: 'none'}];
    
    let transactionList;

    //Reactively calls refreshCalendar when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, refreshCalendar();

    /**
     * Main function that refreshes the calendar. It is called when sections of the calendar are updated.
     */
    function refreshCalendar () {
        transactionList = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        transactionList = populateTransactionList(transactionList);
        summaryList = populateSummaryList(summaryList, transactionList);
        summaryList = changeSelectedStyle(summaryList);
    }
    /**
     * Change selected option to what was choosen by the user.
     * @param {String} option option choosen by user
     */
    function changeSelectedOption (option) {
        selectedOption = option;
        refreshCalendar();
    }
    /**
     * When a day is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} day day clicked
     * @param {String} dateFormatted day clicked in user settings format
     * @param {String} amountFormatted amount for day clicked in user settings format
     */
     function dayClicked(day, displayName, amountFormatted) {
        selectedDay = displayName + ' of the month';
        selectedDayList = getSelectedDaysTransactions(day, 'month');
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
    <CalendarNavigation {selectedOption} {changeSelectedOption} {refreshCalendar} bind:selectedYear bind:selectedStyle on:dateChange/>
    <table class="cal-month">
        {#each Array(5) as _, mainIndex}
        <tr>
            {#each summaryList as day, index}
                {#if index < 7 & mainIndex === 0}
                    {#if day.Amount != 0}
                        <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{day.displayName}</p><p class="amount">{day.amountFormatted}</p></div></div></div></th>
                    {:else}
                        <th class="{day.Class}"><p>{day.displayName}</p></th>
                    {/if}
                {/if}
                {#if index >= 7 & index <= 13 & mainIndex === 1}
                    {#if day.Amount != 0}
                        <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{day.displayName}</p><p class="amount">{day.amountFormatted}</p></div></div></div></th>
                    {:else}
                        <th class="{day.Class}"><p>{day.displayName}</p></th>
                    {/if}
                {/if}
                {#if index > 13 & index <= 20 & mainIndex === 2}
                    {#if day.Amount != 0}
                        <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{day.displayName}</p><p class="amount">{day.amountFormatted}</p></div></div></div></th>
                    {:else}
                        <th class="{day.Class}"><p>{day.displayName}</p></th>
                    {/if}
                {/if}
                {#if index > 20 & index <= 27 & mainIndex === 3}
                    {#if day.Amount != 0}
                        <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{day.displayName}</p><p class="amount">{day.amountFormatted}</p></div></div></div></th>
                    {:else}
                        <th class="{day.Class}"><p>{day.displayName}</p></th>
                    {/if}
                {/if}
                {#if index > 28 & mainIndex === 4}
                    {#if day.Amount != 0}
                        <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><p class="date">{day.displayName}</p><p class="amount">{day.amountFormatted}</p></div></div></div></th>
                    {:else}
                        <th class="{day.Class}"><p>{day.displayName}</p></th>
                    {/if}
                {/if}
            {/each}
        </tr>
        {/each}
    </table>
    {#if showPopup}
        <div class="backdrop" on:click|self={() => togglePopup()}>
            <TransListPopup {selectedDay} {selectedDayList} {selectedAmount} popupType = 'monthly' {togglePopup}/>
        </div>
    {/if}
</div>
<style>
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 880px;
    }
    .cal-month {
        display: block;

        margin: 15px auto 0 auto;
        width: 745px;
        height: auto;

        font-size: 12px;

        border-spacing: 5px;
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
    .net-pos {
        background-color: #fdfd96;
        
        transition-duration: 350ms;
    }
    .net-neg {
        background-color: #ffb347;
        
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

        background: var(--ynab-dark-green);

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

        background: var(--ynab-dark-green);
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

        background: var(--ynab-dark-green);
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

        background: var(--ynab-dark-green);
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

        background: var(--ynab-dark-green);
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
    }
</style>