<script>
    import TransListPopup from '../components/TransListPopup.svelte';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    var showPopup = false;
    var selectedDay;
    var selectedDayList = [];
    var selectedAmount;

    let dayList = [];
    let dayCount = 31;
    let monthList = [{Number: 1, Word: 'Jan'}, {Number: 2, Word: 'Feb'}, {Number: 3, Word: 'Mar'}, {Number: 4, Word: 'Apr'}, {Number: 5, Word: 'May'},
                     {Number: 6, Word: 'Jun'}, {Number: 7, Word: 'Jul'}, {Number: 8, Word: 'Aug'}, {Number: 9, Word: 'Sep'}, {Number: 10, Word: 'Oct'},
                     {Number: 11, Word: 'Nov'}, {Number: 12, Word: 'Dec'}];
    export let selectedYear;
    export let selectedOption;
    export let formatAmount = () => {};

    //Reactively calls populateDayList when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, populateDayList();

    /**
     * Populates the daylist used to build the yearly calendar.
     */
    function populateDayList () {
        let list = [];
        for (let calendarList = 1; calendarList <= 12; calendarList++) {
            let dayAmount = daysInMonth(calendarList, selectedYear);
            let sublist = [];
            for (let day = 1; day <= dayAmount; day++) {
                let date = convertToDate(calendarList - 1, selectedYear, day);
                let transInfo = getTransactionsInfoForDay(date);
                let dayClass = getDayClass(transInfo.Amount);
                let days = {Amount: transInfo.Amount, amountFormatted: transInfo.formattedAmount, Class: dayClass, Date: date, dateFormatted: transInfo.dateFormatted};
                sublist.push(days);
            }
            list.push(sublist);
        }
        dayList = list;
    }
    /**
     * Gets the amount of days in the supplied month.
     * @param {String} month supplied month
     * @param {String} year selected year
     * @returns {Int} number of days in the month 
     */
    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    /**
     * Converts supplised month, year, and day into Date object.
     * @param {String} month supplied month
     * @param {String} year selected year
     * @param {String} day supplied day
     * @returns {Date} Date object based on parameters
     */
    function convertToDate (month, year, day) {
        return new Date(year, month, day);
    }
    /**TODO:Function has two redundancies, one is it loops through the same list multiple times for each day and the other is it sets the date formatted multiple times. Need to improve this.
     * Gets the total amount for the supplied day based on the selected option.
     * @param {Date} calendarDate day supplied
     * @returns {Int} total amount for the supplied day
     */
    function getTransactionsInfoForDay (calendarDate) {
        let amount = 0;
        let dateFormatted;
        for (let transaction of $CurrentTransactionsStore) {
            if (transaction.Date.getTime() === calendarDate.getTime()) {
                
                if (selectedOption === 'income' & transaction.Amount > 0 || selectedOption === 'expense' & transaction.Amount < 0 || selectedOption === 'net') {
                    amount = (parseFloat(amount) + parseFloat(transaction.Amount)).toFixed($CurrencyInfoStore.Decimals);
                    dateFormatted = transaction.dateFormatted;
                }
            }
        }
        let formattedAmount = formatAmount(amount);
        let finalAmount = {Amount: amount, formattedAmount: formattedAmount, dateFormatted: dateFormatted};
        return finalAmount;
    }
    /**
     * Determine the class to be used based on the supplied amount and selected option.
     * @param {Int} amount supplied amount
     * @returns class to be used
     */
    function getDayClass (amount) {
        let dayClass;
        if (selectedOption === 'income' & amount != 0) {
            dayClass = 'income';
        } else if (selectedOption === 'expense' & amount != 0) {
            dayClass = 'expense';
        } else if (selectedOption === 'net' & amount != 0) {
            dayClass = amount > 0 ? 'net-pos' : 'net-neg';
        } else {
            dayClass = "none";
        }
        return dayClass;
    }
    /**
     * When a day is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} date date clicked
     * @param {String} dateFormatted date clicked in user settings format
     * @param {String} amountFormatted amount for day clicked in user settings format
     */
    function dayClicked(date, dateFormatted, amountFormatted) {
        selectedDay = dateFormatted;
        selectedDayList = getSelectedDaysTransactions(date);
        selectedAmount = amountFormatted;
        togglePopup();
    }
    /**
     * Get all the transactions for the selected day and populate them in a list.
     * @param {Date} date day selected
     * @returns {Array of Objects} transactions for day selected
     */
    function getSelectedDaysTransactions (date) {
        let transactionList = [];
        for (let day of $CurrentTransactionsStore) {
            if (day.Date.getTime() === date.getTime()) {
                if (selectedOption === 'income' & day.Amount > 0) {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                } else if (selectedOption === 'expense' & day.Amount < 0) {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                } else if (selectedOption === 'net') {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                }
            }
        }
        return transactionList;
    }
     /**
     * Toggles the selected year based on button clicked and calls the update to transactions.
     * @param {String} buttonSelected name of button selected
     */
     function toggleSelectedYear (buttonSelected) {
        selectedYear = buttonSelected === 'previous' ? selectedYear=selectedYear-1 : selectedYear=selectedYear+1;
        dispatch('yearChange', );
    }
    /**
     * Changes the selected option based on what was selected and calls the update to the calendar.
     * @param {String} option option selected
     */
    function changeSelectedOption (option) {
        selectedOption = option;
        populateDayList();
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
        <div class="cal-options">
            <button on:click={() => changeSelectedOption('income')}><span class="material-icons-outlined md-36 income-icon">savings</span></button>
            <button on:click={() => changeSelectedOption('expense')}><span class="material-icons-outlined md-36 expense-icon">paid</span></button>
            <button on:click={() => changeSelectedOption('net')}><span class="material-icons-outlined md-36 net-icon">request_quote</span></button>
        </div>
        <div class="year-selector">
            <button on:click={() => toggleSelectedYear('previous')}><span class="material-icons-outlined md-36">chevron_left</span></button>
            <p>{selectedYear}</p>
            <button on:click={() => toggleSelectedYear('next')}><span class="material-icons-outlined md-36">chevron_right</span></button>
        </div>
        <table class="cal-year day-list">
            <tr>
            <th><p></p></th>
            {#each Array(dayCount) as _, day}   
                <th><p>{day + 1}</p></th>
            {/each}
            </tr>
        </table>
        <div class="cal-year-subcontainer">
            <table class="cal-year month-list">
                {#each monthList as month}   
                    <tr><th><p>{month.Word}</p></th></tr>
                {/each}
            </table>
            <table class="cal-year cal-year-days">
                {#each dayList as month}
                    <tr>
                    {#each month as day}
                        {#if day.Amount != 0}
                            <th class="{day.Class} populated" on:click={() => dayClicked(day.Date, day.dateFormatted, day.amountFormatted)}><div class="tooltip"><span class="tooltiptext">{day.amountFormatted}</span></div></th>
                        {:else}
                            <th class="{day.Class}"></th>
                        {/if}
                    {/each}
                {/each}
            </table>
        </div>
        {#if showPopup}
            <div class="backdrop" on:click|self={() => togglePopup()}>
                <TransListPopup {togglePopup} {selectedDay} {selectedDayList} {selectedAmount}/>
            </div>
        {/if}
    </div>
</div>
<style lang="scss">
    .cal-options {
        display: inline-block;
        margin: 15px 0 0 25px;
        width: 213px;

        & button {
            margin-right: 20px;
            background: none;
            border: none;

            cursor: pointer;
        }
    }
    .income-icon {
        color: #00a567;
    }
    .expense-icon {
        color: #de5d83;
    }
    .net-icon {
        color: #ffb347;
    }
    .year-selector {
        display: inline-block;

        margin: 0 auto 15px 105px;
        width: 215px;
    }
    .year-selector p{
        display: inline-block;

        margin: 0 10px;

        font-size: 2.2em;
    }
    .year-selector button{
        background: none;
        border: none;
        border-radius: 5px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

        cursor: pointer;
    }
    .cal-year-container{
        display: block;
        
        margin: 50px auto 0 auto;
        width: 1000px;
    }
    .cal-year {
        display: inline-block;

        font-size: 12px;
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
    .populated {
        cursor: pointer;
    }
    .tooltip {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 100px;
    bottom: 100%;
    left: 50%;
    margin-left: -50px;
    background-color: black;
    color: #fff;
    text-align: center;
    font-size: 10px;
    padding: 5px 0;
    border-radius: 6px;
   
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }
  
  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  .tooltip .tooltiptext::after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
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