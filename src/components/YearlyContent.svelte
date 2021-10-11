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

    let dayList = [{Number: 1, Class: 'non-focused'}, {Number: 2, Class: 'non-focused'}, {Number: 3, Class: 'non-focused'}, {Number: 4, Class: 'non-focused'}, {Number: 5, Class: 'non-focused'}, {Number: 6, Class: 'non-focused'},
                    {Number: 7, Class: 'non-focused'}, {Number: 8, Class: 'non-focused'}, {Number: 9, Class: 'non-focused'}, {Number: 10, Class: 'non-focused'}, {Number: 11, Class: 'non-focused'}, {Number: 12, Class: 'non-focused'},
                    {Number: 13, Class: 'non-focused'}, {Number: 14, Class: 'non-focused'}, {Number: 15, Class: 'non-focused'}, {Number: 16, Class: 'non-focused'}, {Number: 17, Class: 'non-focused'}, {Number: 18, Class: 'non-focused'},
                    {Number: 19, Class: 'non-focused'}, {Number: 20, Class: 'non-focused'}, {Number: 21, Class: 'non-focused'}, {Number: 22, Class: 'non-focused'}, {Number: 23, Class: 'non-focused'}, {Number: 24, Class: 'non-focused'},
                    {Number: 25, Class: 'non-focused'}, {Number: 26, Class: 'non-focused'}, {Number: 27, Class: 'non-focused'}, {Number: 28, Class: 'non-focused'}, {Number: 29, Class: 'non-focused'}, {Number: 30, Class: 'non-focused'},
                    {Number: 31, Class: 'non-focused'}];
    let monthList = [{Number: 1, Word: 'Jan', Class: 'non-focused'}, {Number: 2, Word: 'Feb', Class: 'non-focused'}, {Number: 3, Word: 'Mar', Class: 'non-focused'}, {Number: 4, Word: 'Apr', Class: 'non-focused'}, 
                     {Number: 5, Word: 'May', Class: 'non-focused'}, {Number: 6, Word: 'Jun', Class: 'non-focused'}, {Number: 7, Word: 'Jul', Class: 'non-focused'}, {Number: 8, Word: 'Aug', Class: 'non-focused'}, 
                     {Number: 9, Word: 'Sep', Class: 'non-focused'}, {Number: 10, Word: 'Oct', Class: 'non-focused'}, {Number: 11, Word: 'Nov', Class: 'non-focused'}, {Number: 12, Word: 'Dec', Class: 'non-focused'}];
    let fullDayList = [];
    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
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
                let days = {Amount: transInfo.Amount, amountFormatted: transInfo.formattedAmount, Rank: 0, Class: dayClass, Date: date, Month: calendarList, Day: day, dateFormatted: transInfo.dateFormatted};
                sublist.push(days);
            }
            list.push(sublist);
        }
        fullDayList = list;
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
        if (selectedStyle === 'regular') {
            if (selectedOption === 'income' & amount != 0) {
                dayClass = 'income';
            } else if (selectedOption === 'expense' & amount != 0) {
                dayClass = 'expense';
            } else if (selectedOption === 'net' & amount != 0) {
                dayClass = amount > 0 ? 'net-pos' : 'net-neg';
            } else {
                dayClass = "none";
            }
        } else {

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
    function highlightMonthDay (monthId, dayId) {
       // console.log('month ' + monthId + ' day ' + dayId)
        for (let month of monthList) {
            month.Number === monthId ? month.Class = 'focused' : month.Class = 'non-focused';
        }
        for (let day of dayList) {
            day.Number == dayId ? day.Class = 'focused' : day.Class = 'non-focused';
        }
        monthList = monthList;
        dayList = dayList;
    }
    function changeSelectedStyle (style) {
        selectedStyle = style;
        setHeatmapStyle(style, fullDayList);
    }
    function setHeatmapStyle (style, daylist) {
        console.log(daylist)

        let rankings = daylist;
        for(let month = 0; month < rankings.length; month++) {
            rankings[month].sort((a,b) => (a.Amount < b.Amount) ? 1 : -1);
            console.log(rankings[month]);
            for(let day = 0; day < daylist[month].length; day++) {
               // console.log(daylist[month][day])
                daylist[month][day].Rank = rankings[month].indexOf(daylist[month][day].Date);
            }
        }
      
        // console.log(rankings)
        
        // for(let month in daylist) {
        //     for(let day in month){
        //         daylist.Rank = rankings.indexOf(day.Date);
        //     }
        // }

       console.log(daylist)
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
            <button on:click={() => changeSelectedOption('income')}><span class="material-icons-outlined md-36 income-icon" class:selected={selectedOption === 'income'} class:nonselected-icon={selectedOption != 'income'}>savings</span></button>
            <button on:click={() => changeSelectedOption('expense')}><span class="material-icons-outlined md-36 expense-icon" class:selected={selectedOption === 'expense'} class:nonselected-icon={selectedOption != 'expense'}>paid</span></button>
            <button on:click={() => changeSelectedOption('net')}><span class="material-icons-outlined md-36 net-icon" class:selected={selectedOption === 'net'} class:nonselected-icon={selectedOption != 'net'}>request_quote</span></button>
        </div>
        <div class="year-selector">
            <button on:click={() => toggleSelectedYear('previous')}><span class="material-icons-outlined md-36">chevron_left</span></button>
            <p>{selectedYear}</p>
            <button on:click={() => toggleSelectedYear('next')}><span class="material-icons-outlined md-36">chevron_right</span></button>
        </div>
        <div class="cal-styles">
            <button on:click={() => changeSelectedStyle('regular', fullDayList)}><span class="material-icons-outlined md-36 style-regular-icon" class:selected={selectedStyle === 'regular'} class:nonselected-icon={selectedStyle != 'regular'}>local_fire_department</span></button>
            <button on:click={() => changeSelectedStyle('simple', fullDayList)}><span class="material-icons-outlined md-36 style-simple-icon" class:selected={selectedStyle === 'simple'} class:nonselected-icon={selectedStyle != 'simple'}>whatshot</span></button>
        </div>
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
                {#each fullDayList as month}
                    <tr>
                    {#each month as day}
                        {#if day.Amount != 0}
                            <th class="{day.Class} populated" on:click={() => dayClicked(day.Date, day.dateFormatted, day.amountFormatted)} on:mouseover={() => highlightMonthDay(day.Month, day.Day)} on:focus={() => highlightMonthDay() }><div class="populated-main-container"><div class="populated-container"><div class="populated-subcontainer"><div class="amountPopup"><span class="amountPopupText">{day.amountFormatted}</span></div></div></div></div></th>
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
    .income-icon.selected, .income-icon:hover {
        color: #00a567;
    }
    .expense-icon.selected, .expense-icon:hover {
        color: #de5d83;
    }
    .net-icon.selected, .net-icon:hover {
        color: #ffb347;
    }
    .nonselected-icon {
        color:  rgba(187, 167, 167, 0.842);
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
    .cal-styles {
        float: right;

        margin: 15px 0 0 0px;
        width: 143px;

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
    .style-simple-icon.selected, .style-simple-icon:hover {
        color: #FF9000;
    }
    .cal-year-container{
        display: block;
        
        margin: 50px auto 0 auto;
        width: 880px;
    }
    .cal-year {
        display: inline-block;

        font-size: 12px;
    }
    .day-list {
        margin-left: 5px;
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