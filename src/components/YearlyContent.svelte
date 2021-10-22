<script>
    import CalendarNavigation from "./CalendarNavigation.svelte";
    import TransListPopup from '../components/TransListPopup.svelte';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';

    var showPopup = false;
    var selectedDay;
    var selectedDayList = [];
    var selectedAmount;
    export let formatAmount = () => {};
    export let formatDate = () => {};
    export let convertToDate = () => {};
    export let getDayClass = () => {};
    export let getSelectedDaysTransactions = () => {};
    export let dayOfYear = () => {};
    export let setHeatmapStyle = () => {};

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
    
    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;

    //Reactively calls populateDayList when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, refreshCalendar();

    /**
     * Initialize the summary list which is just a summary of each day of the year.
     */
    function initializeSummaryList () {
        let list = [];

        for (let month = 1; month <= 12; month++) {
            let dayAmount = daysInMonth(selectedYear, month);
            for (let day = 1; day <= dayAmount; day++) {
                let currentDate = dayDate(selectedYear, month - 1, day);
                let currentDay = {dayOfYear: 0, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none', Date: currentDate, dateFormatted: formatDate(currentDate), Month: month, Day: day};
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
        let daysInYear = isLeapYear(selectedYear) ? 366 : 365;
        
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
      * Calculates year provided to see if its a leap year and returns true or false.
      * @param {String} year the year calculated
      * @return {Boolean} true if it is a leap year else false.
    */
    function isLeapYear(year){
        return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
    }

    function refreshCalendar () {
        populateTransactionList();
        populateSummaryList();
        changeSelectedStyle(selectedStyle, summaryList);
    }

    /**
     * Populates the transaction list.
     */
    function populateTransactionList () {
        initializeTransactionList();
        for (let transaction of $CurrentTransactionsStore) {
            if (selectedOption === 'income' & transaction.Amount > 0 || selectedOption === 'expense' & transaction.Amount < 0 || selectedOption === 'net' & transaction.Amount != 0) {
                let amount = parseFloat(parseFloat(transaction.Amount).toFixed($CurrencyInfoStore.Decimals));
                let formattedAmount = formatAmount(amount);
                let dateFormatted = transaction.dateFormatted;
                let dayIndex = dayOfYear(transaction.Date) - 1;
                let day = {Amount: amount, amountFormatted: formattedAmount, Date: transaction.Date, dateFormatted: dateFormatted, Month: transaction.Date.getMonth() + 1, Day: transaction.Date.getDate()};
                transactionList[dayIndex].push(day);
               // let dayClass = getDayClass(transInfo.Amount);
            }
        }
    }

    /**
     * Populates the summary list.
     */
    function populateSummaryList () {
        initializeSummaryList();
        let dayIndex = 0;
        for (let day of transactionList) {
            let amount = 0;
            for (let transaction of day) {
                amount = parseFloat((parseFloat(amount) + parseFloat(transaction.Amount)).toFixed($CurrencyInfoStore.Decimals));
            }
            summaryList[dayIndex].dayOfYear = dayIndex;
            summaryList[dayIndex].Amount = amount;
            summaryList[dayIndex].amountFormatted = formatAmount(summaryList[dayIndex].Amount);
            summaryList[dayIndex].Class = getDayClass(summaryList[dayIndex].Amount);
            dayIndex++;
        }
    }
    /**
     * When a day is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} date date clicked
     * @param {String} dateFormatted date clicked in user settings format
     * @param {String} amountFormatted amount for day clicked in user settings format
     */
    function dayClicked(date, dateFormatted, amountFormatted) {
        selectedDay = dateFormatted;
        selectedDayList = getSelectedDaysTransactions(date, 'year');
        selectedAmount = amountFormatted;
        togglePopup();
    }
    /**
     * Changes the selected option based on what was selected and calls the update to the calendar.
     * @param {String} option option selected
     */
    function changeSelectedOption (option) {
        selectedOption = option;
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
     * When a style button is clicked, the style is changed to that selected style.
     * @param {String} style selected style
     * @param {Array of Objects} daylist list of days of the year
     */
    function changeSelectedStyle (style, daylist) {
        selectedStyle = style;
        let list = setHeatmapStyle(daylist);
        summaryList = applyHeatMapColor(list, summaryList);
    }
    /**
     * Takes a list and sets the colors for the heatmap style change and returns the list.
     * @param {Array of Objects} list list that will be applied to current list
     * @param {Array of Objects} fullList list that is to be updated with new colors
     */
    function applyHeatMapColor (list, fullList) {
        for (let day of list) {
           fullList[day.dayOfYear].Color = day.Color;
        }
        return fullList;
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
        <CalendarNavigation {selectedOption} {selectedStyle} list = {summaryList} {changeSelectedOption} {changeSelectedStyle} bind:selectedYear on:yearChange/>
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
                                <th class="{day.Class} populated" style="{day.Color}" on:click={() => dayClicked(day.Date, day.dateFormatted, day.amountFormatted)} on:mouseover={() => highlightMonthDay(day.Month, day.Day)} on:focus={() => highlightMonthDay() }><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><div class="amountPopup"><span class="amountPopupText">{day.amountFormatted}</span></div></div></div></div></th>
                            {:else}
                                <th class="{day.Class}"></th>
                            {/if}
                        {/if}
                    {/each}
                {/each}
            </table>
        </div>
        {#if showPopup}
            <div class="backdrop" on:click|self={() => togglePopup()}>
                <TransListPopup {selectedDay} {selectedDayList} {selectedAmount} popupType = 'yearly' {togglePopup}/>
            </div>
        {/if}
    </div>
</div>
<style lang="scss">
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 880px;
    }
    .cal-year {
        display: inline-block;

        font-size: 12px;
    }
    .day-list {
        margin: 15px 0 0 5px;
    }
    .cal-year.cal-year-days {
        width: 840px;
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
    }
    .expense {
        background-color: #de5d83;
    }
    .net-pos {
        background-color: #fdfd96;
    }
    .net-neg {
        background-color: #ffb347;
    }
    .none {
        background-color:  rgba(187, 167, 167, 0.842);
    }
    .focused {
        color: var(--ynab-light-green);
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
        content: '';
        position: absolute;

        bottom: -3px;
        left: -3px;
        width: 125.5%;
        height: 2px;

        background: var(--ynab-dark-green);

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
        content: '';
        position: absolute;

        top: -3px;
        left: -3px;
        width: 2px;
        height: 135%;

        background: var(--ynab-dark-green);
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
        content: '';
        position: absolute;

        top: -3px;
        right: -3px;
        width: 2px;
        height: 135%;

        background: var(--ynab-dark-green);
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
        content: '';
        position: absolute;

        top: -3px;
        left: -3px;
        width: 63.5%;
        height: 2px;

        background: var(--ynab-dark-green);
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
        content: '';
        position: absolute;

        top: -3px;
        right: -3px;
        width: 63.5%;
        height: 2px;

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
        content: "";
        position: absolute;

        top: 50%;
        right: 100%;
        margin-top: -5px;

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
    }
</style>