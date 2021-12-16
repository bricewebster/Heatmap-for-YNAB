<script>
    import CalendarNavigation from "./CalendarNavigation.svelte";
    import HeatmapValue from "./HeatmapValue.svelte";
    import TransListPopup from '../components/TransListPopup.svelte';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';
    import NavOptionsStore from "../stores/navOptionsStore";

    var showPopup = false;
    var selectedSquare;
    var selectedList = [];
    var selectedAmount;
    export let populateTransactionList = () => {};
    export let populateSummaryList = () => {};
    export let formatDate = () => {};
    export let dayOfYear = () => {};
    export let getSelectedDaysTransactions = () => {};
    export let changeSelectedStyle = () => {};

    let dayList = [{Number: 1, Class: 'non-focused'}, {Number: 2, Class: 'non-focused'}, {Number: 3, Class: 'non-focused'}, {Number: 4, Class: 'non-focused'}, {Number: 5, Class: 'non-focused'}, {Number: 6, Class: 'non-focused'},
                    {Number: 7, Class: 'non-focused'}, {Number: 8, Class: 'non-focused'}, {Number: 9, Class: 'non-focused'}, {Number: 10, Class: 'non-focused'}, {Number: 11, Class: 'non-focused'}, {Number: 12, Class: 'non-focused'},
                    {Number: 13, Class: 'non-focused'}, {Number: 14, Class: 'non-focused'}, {Number: 15, Class: 'non-focused'}, {Number: 16, Class: 'non-focused'}, {Number: 17, Class: 'non-focused'}, {Number: 18, Class: 'non-focused'},
                    {Number: 19, Class: 'non-focused'}, {Number: 20, Class: 'non-focused'}, {Number: 21, Class: 'non-focused'}, {Number: 22, Class: 'non-focused'}, {Number: 23, Class: 'non-focused'}, {Number: 24, Class: 'non-focused'},
                    {Number: 25, Class: 'non-focused'}, {Number: 26, Class: 'non-focused'}, {Number: 27, Class: 'non-focused'}, {Number: 28, Class: 'non-focused'}, {Number: 29, Class: 'non-focused'}, {Number: 30, Class: 'non-focused'},
                    {Number: 31, Class: 'non-focused'}];
    let monthList = [{Number: 1, Word: 'Jan', Class: 'non-focused'}, {Number: 2, Word: 'Feb', Class: 'non-focused'}, {Number: 3, Word: 'Mar', Class: 'non-focused'}, {Number: 4, Word: 'Apr', Class: 'non-focused'}, 
                     {Number: 5, Word: 'May', Class: 'non-focused'}, {Number: 6, Word: 'Jun', Class: 'non-focused'}, {Number: 7, Word: 'Jul', Class: 'non-focused'}, {Number: 8, Word: 'Aug', Class: 'non-focused'}, 
                     {Number: 9, Word: 'Sep', Class: 'non-focused'}, {Number: 10, Word: 'Oct', Class: 'non-focused'}, {Number: 11, Word: 'Nov', Class: 'non-focused'}, {Number: 12, Word: 'Dec', Class: 'non-focused'}];
    
    let summaryList = [];
    let transactionList = [];

    //Reactively calls populateDayList when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, refreshCalendar();

    /**
     * Initialize the summary list which is just a summary of each day of the year.
     */
    function initializeSummaryList () {
        let list = [];

        for (let month = 1; month <= 12; month++) {
            let dayAmount = daysInMonth(2020, month);
            for (let day = 1; day <= dayAmount; day++) {
                let currentDate = dayDate(2020, month - 1, day);
                let currentDay = {dayOfYear: dayOfYear(currentDate) - 1, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none', Date: currentDate, dateFormatted: formatDate(currentDate), Month: month, Day: day};
                list.push(currentDay);
            }
        }
        summaryList = list;
    }
    /**
     * Initialize the transaction list which is an array of arrays for each day of the year.
     */
    function initializeTransactionList () {
        transactionList = [];
        let daysInYear = 366;
        
        for (let index = 1; index <= daysInYear; index++) {
            let transList = [];
            transactionList.push(transList);
        }
    }
    /**
     * Gets the amount of days in the supplied month.
     * @param {Int} year selected year
     * @param {Int} month supplied month
     * @return {Int} number of days in the month 
     */
    function daysInMonth (year, month) {
        return new Date(year, month, 0).getDate();
    }
    /**
     * Converts supplied month, year and day into a date object.
     * @param {Int} year selected year
     * @param {Int} month supplied month
     * @param {Int} day supplied day
     * @return {Date} date object based on year, month and day
     */
    function dayDate (year, month, day) {
        return new Date(year, month, day);
    }
    /**
     * Called when there is a change to where the calendar needs refreshed such as option, style or date change.
     */
    function refreshCalendar () {
        initializeTransactionList();
        transactionList = populateTransactionList(transactionList);
        initializeSummaryList();
        summaryList = populateSummaryList(summaryList, transactionList);
        summaryList = changeSelectedStyle(summaryList);
    }
    /**
     * When a day is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} date date clicked
     * @param {String} dateFormatted date clicked in user settings format
     * @param {String} amountFormatted amount for day clicked in user settings format
     */
    function dayClicked(date, dateFormatted, amountFormatted) {
        selectedSquare = dateFormatted;
        selectedList = getSelectedDaysTransactions(date);
        selectedAmount = amountFormatted;
        togglePopup();
    }
    /**
	 * Removes the year from the date formatted to be used when displaying the transactions popup title date.
	 * @param {String} date date to remove year from
	 * @return {String} a date as a string with year removed
	 */
	function removeYearFromDate (date) {
        let userDateFormat = $CurrencyInfoStore.dateFormat;
        let newDate;

        if (userDateFormat === 'YYYY/MM/DD' || userDateFormat === 'YYYY-MM-DD' || userDateFormat === 'YYYY.MM.DD') {
            newDate = date.substring(5,10);
        } else if (userDateFormat === 'DD-MM-YYYY' || userDateFormat === 'DD/MM/YYYY' || userDateFormat === 'DD.MM.YYYY' || userDateFormat === 'MM/DD/YYYY') {
            newDate = date.substring(0,5);
        } else {
            newDate = date;
        }
        return newDate;
    }
    /**
     * Changes the selected option based on what was selected and calls the update to the calendar.
     * @param {String} option option selected
     */
    function changeSelectedOption (option) {
        $NavOptionsStore.selectedOption = option;
        refreshCalendar();
    }
    /**
     * Highlights the month and day indicators based on the populated day that the users hovers over.
     * @param {Int} monthId month integer
     * @param {Int} dayId day integer
     */
    function highlightMonthDay (monthId, dayId) {
        for (let month of monthList) {
            month.Number === monthId ? month.Class = 'focused' : month.Class = 'non-focused';
        }
        for (let day of dayList) {
            day.Number == dayId ? day.Class = 'focused' : day.Class = 'non-focused';
        }
        monthList = monthList;
        dayList = dayList;
    }
    /**
     * Opens and closes the trans list popup.
     */
    function togglePopup () {
        showPopup = !showPopup;
    }
</script>
<div class="content">
    <div class="cal-year-container">
        <CalendarNavigation {changeSelectedOption} {refreshCalendar} selectedTab = "yearly" on:dateChange/>
        <table class="cal-year day-list">
            <tr>
            <th><p></p></th>
            {#each dayList as day}   
                <th><p class="{day.Class}">{day.Number}</p></th>
            {/each}
            </tr>
        </table>
        <div class="cal-year-subcontainer">
            <table class="cal-year month-list">
                {#each monthList as month}   
                    <tr><th><p class="{month.Class}">{month.Word}</p></th></tr>
                {/each}
            </table>
            <table class="cal-year cal-year-days">
                {#each monthList as month}
                    <tr>
                    {#each summaryList as day}
                        {#if month.Number === day.Month}
                            {#if day.Amount != 0}
                                <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.Date, removeYearFromDate(day.dateFormatted), day.amountFormatted)} on:mouseover={() => highlightMonthDay(day.Month, day.Day)} on:focus={() => highlightMonthDay() }><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><div class="amountPopup"><span class="amountPopupText">{day.amountFormatted}</span></div></div></div></div></th>
                            {:else}
                                <th class="{day.Class}"></th>
                            {/if}
                        {/if}
                    {/each}
                {/each}
            </table>
            <HeatmapValue />
        </div>
        {#if showPopup}
            <div class="backdrop" on:click|self={() => togglePopup()}>
                <TransListPopup {selectedSquare} {selectedList} {selectedAmount} popupType = 'yearly' {togglePopup}/>
            </div>
        {/if}
    </div>
</div>
<style lang="scss">
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 1020px;
    }
    .cal-year {
        display: inline-block;

        font-size: 12px;
    }
    .day-list {
        margin: 15px 0 0 5px;
    }
    .cal-year.cal-year-days {
        width: 860px;
        height: auto;
    }
    .cal-year tr {
        width: 100%;
        height: auto;
    }
    .cal-year th {
        width: 25px;
        height: 18px; 
    }
    .income {
        background-color: #00a567;

        transition-duration: 350ms;
    }
    .expense {
        background-color: #de5d83;

        transition-duration: 350ms;
    }
    .net {
        transition-duration: 350ms;
    }
    .none {
        background-color:  rgba(187, 167, 167, 0.842);

        transition-duration: 350ms;
    }
    .focused {
        color: var(--theme-secondary);

        transition: transform 250ms ease-in;
        transition-delay: 200ms;
    }
    .nonfocused {
        color: black;

        transition: transform 250ms ease-in;
        transition-delay: 200ms;
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
        bottom: -3px;
        left: -3px;

        width: 125.5%;
        height: 2px;
        content: '';

        background: var(--theme-secondary);
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;

        transform: scaleX(0);
        transform-origin: center;
        transition: transform 250ms ease-in;
        transition-delay: 500ms;
    }
    .populated-main-container:hover .populated-subcontainer::before {
        transform: scaleY(1);
        transition: transform 250ms ease-in;
        transition-delay: 200ms;
    }
    .populated-subcontainer::after {
        /* Left Line */
        position: absolute;
        top: -3px;
        left: -3px;

        width: 2px;
        height: 135%;
        content: '';

        background: var(--theme-secondary);
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;

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

        top: -3px;
        right: -3px;

        width: 2px;
        height: 135%;
        content: '';

        background: var(--theme-secondary);
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;

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
        top: -3px;
        left: -3px;

        width: 63.5%;
        height: 2px;
        content: '';

        background: var(--theme-secondary);
        border-top-left-radius: 2px;

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
        top: -3px;
        right: -3px;

        width: 63.5%;
        height: 2px;
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
    .amountPopup {
        position: relative;

        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .amountPopup .amountPopupText {
        position: absolute;
        top: -5px;
        left: 140%;

        padding: 5px;
        width: auto;

        background-color: white;
        border-radius: 5px;
        box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
        color: #636366;

        text-align: center;
        font-size: 12px;
   
        z-index: 1;
        visibility: hidden;
    }
    .amountPopup .amountPopupText::after {
        position: absolute;
        top: 50%;
        right: 100%;

        margin-top: -5px;
        content: "";

        border-width: 5px;
        border-style: solid;
        border-color: transparent white transparent transparent;
    }
    .amountPopup:hover .amountPopupText {
        visibility: visible;
    }
    .amountPopup:hover .amountPopupText:hover {
        visibility: hidden;
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