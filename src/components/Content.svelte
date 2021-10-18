<script>
    import YearlyContent from "./YearlyContent.svelte";
    import MonthlyContent from "./MonthlyContent.svelte";
    import DailyContent from "./DailyContent.svelte";
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';

    export let activeTab
    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let formatAmount = () => {};

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
                    amount = parseFloat((parseFloat(amount) + parseFloat(transaction.Amount)).toFixed($CurrencyInfoStore.Decimals));
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
    function daysInYear (transactionDate) {
        return (Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    }
</script>

<div class="content">
    {#if activeTab === 'Yearly'}
        <YearlyContent {convertToDate} {getTransactionsInfoForDay} {getDayClass} {getSelectedDaysTransactions} {daysInYear} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
    {:else if activeTab === 'Monthly'}
        <MonthlyContent {selectedOption} {selectedYear} {selectedStyle} {formatAmount} {daysInYear} {getDayClass}/>
    {:else}
        <DailyContent />
    {/if}
</div>

<style>
    .content {
        width: 100%;

        border-top: 5px solid var(--ynab-dark-green);

        line-height: normal;
    }
</style>
