<script>
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let dayList = [];
    let dayCount = 31;
    let monthList = [{Number: 1, Word: 'Jan'}, {Number: 2, Word: 'Feb'}, {Number: 3, Word: 'Mar'}, {Number: 4, Word: 'Apr'}, {Number: 5, Word: 'May'},
                     {Number: 6, Word: 'Jun'}, {Number: 7, Word: 'Jul'}, {Number: 8, Word: 'Aug'}, {Number: 9, Word: 'Sep'}, {Number: 10, Word: 'Oct'},
                     {Number: 11, Word: 'Nov'}, {Number: 12, Word: 'Dec'}];
    export let selectedYear;
    export let selectedOption;

    $: $CurrentTransactionsStore, buildCalendarList();

    function buildCalendarList () {
        let list = [];
        for (let calendarList = 1; calendarList <= 12; calendarList++) {
            let dayAmount = daysInMonth(calendarList, selectedYear);
            let sublist = [];
            for (let day = 1; day <= dayAmount; day++) {
                let date = convertToDate(calendarList - 1, selectedYear, day);
                let amount = getTransactionsForDay(date);
                let dayClass = getDayClass(amount.Amount);
                let days = {Amount: amount.Amount, amountFormatted: amount.formattedAmount, Class: dayClass};
                sublist.push(days);
            }
            list.push(sublist);
        }
        dayList = list;
    }
    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    function convertToDate (month, year, day) {
        return new Date(year, month, day);
    }
    function toggleSelectedYear (buttonSelected) {
        selectedYear = buttonSelected === 'previous' ? selectedYear=selectedYear-1 : selectedYear=selectedYear+1;
        dispatch('yearChange', );
    }
    function toggleSelectedOption (option) {
        selectedOption = option;
        buildCalendarList();
    }
    function getTransactionsForDay (calendarDate) {
        let amount = 0;
        for (let transaction of $CurrentTransactionsStore) {
            if (transaction.Date.getTime() === calendarDate.getTime()) {
                
                if (selectedOption === 'income' & transaction.Amount > 0 || selectedOption === 'expense' & transaction.Amount < 0 || selectedOption === 'net') {
                    amount = (parseFloat(amount) + parseFloat(transaction.Amount)).toFixed($CurrencyInfoStore.Decimals);
                }
            }
        }
        let formattedAmount = formatAmount(amount);
        let finalAmount = {Amount: amount, formattedAmount: formattedAmount};
        return finalAmount;
    }
    function formatAmount (amount) {
        if (amount === 0) {
            return '0';
        }
        let amountSplit = String(amount).split('.');
        let beforeDecimal = amountSplit[0];
        let afterDecimal = amountSplit[1];
        let finalAmount;

        let newAfterDecimal = afterDecimal === undefined ? '' : $CurrencyInfoStore.decimalSeparator + afterDecimal;

        let newBeforeDecimal = '';
        for (let index = beforeDecimal.length - 1; index >= 0; index--) {
            index % 4 === 0 & beforeDecimal.length > 3? newBeforeDecimal = beforeDecimal[index] + $CurrencyInfoStore.groupSeparator + newBeforeDecimal : newBeforeDecimal = beforeDecimal[index] + newBeforeDecimal;
        }
        if ($CurrencyInfoStore.displaySymbol) {
            $CurrencyInfoStore.symbolFirst ? finalAmount = $CurrencyInfoStore.Symbol + newBeforeDecimal + newAfterDecimal : finalAmount = newBeforeDecimal + newAfterDecimal + $CurrencyInfoStore.Symbol;
        } else {
            finalAmount = newBeforeDecimal + newAfterDecimal;
        }
        return finalAmount;
    }
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
</script>
<div class="content">
    <div class="cal-year-container">
        <div class="cal-options">
            <button on:click={() => toggleSelectedOption('income')}><span class="material-icons-outlined md-36 income-icon">savings</span></button>
            <button on:click={() => toggleSelectedOption('expense')}><span class="material-icons-outlined md-36 expense-icon">paid</span></button>
            <button on:click={() => toggleSelectedOption('net')}><span class="material-icons-outlined md-36 net-icon">request_quote</span></button>
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
                            <th class="{day.Class} populated"><div class="tooltip"><span class="tooltiptext">{day.amountFormatted}</span></div></th>
                        {:else}
                            <th class="{day.Class}"></th>
                        {/if}
                    {/each}
                {/each}
            </table>
        </div>
        <div class="transactions-list">

        </div>
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

</style>