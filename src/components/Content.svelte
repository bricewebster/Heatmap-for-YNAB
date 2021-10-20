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
    function getSelectedDaysTransactions (date, tabOption) {
        let transactionList = [];
        for (let day of $CurrentTransactionsStore) {
            let compare;
            if (tabOption === 'year') {
                compare = day.Date.getTime() === date.getTime();
            } else if (tabOption === 'month') {
                compare = day.dayOfMonth === date;
            }
            if (compare) {
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
    function setHeatmapStyle (daylist) {
        let list = daylist.map(data => ({...data}));
        let amountToColor;
        if (selectedStyle != 'simple') {
            let sortList = daylist.map(data => ({...data}));
            let sorted = sortHeatmapList(sortList);
            let rank = new Map(sorted.map((x, i) => [x, i + 1]));
            amountToColor = rank.size;
            for(let day of list) {
                day.Rank = rank.get(day.Amount);
            }
        }
        setHeatmapColors(amountToColor, list);
        return list;
    }
    function sortHeatmapList (list) {
        var unique = [];
        var distinct = [];
        for (let i = 0; i < list.length; i++ ) {
            if (!unique[list[i].Amount]){
                distinct.push(list[i].Amount);
                unique[list[i].Amount] = 1;
            }
        }
        return distinct.sort((a,b) => b- a);
    }
    function setHeatmapColors (amountToColor, list) {
        let increment = 100 / amountToColor;
        let background;
        for (let day of list) {
            let s;
            if (selectedStyle === 'regular') {
                s = increment * day.Rank;
                if (selectedOption === 'income') {
                    background = 'background: hsl(157,' + s + '%, 32%)';
                } else if (selectedOption === 'expense') {
                    background = 'background: hsl(342,' + s + '%, 62%)';
                }
            } else if (selectedStyle === 'group') {
                let placement = (day.Rank / amountToColor) * 100;
                if (placement >= 90) {
                    if (selectedOption === 'expense') {
                        background = 'background: hsl(343,63%,54%)';
                    } else if (selectedOption === 'income') {
                        background = 'background: hsl(52, 84%, 73%)';
                    }
                } else if (placement >= 50 & placement < 90) {
                    if (selectedOption === 'expense') {
                        background = 'background: hsl(4,66%,60%)';
                    } else if (selectedOption === 'income') {
                        background = 'background: hsl(76, 52%, 63%)';
                    }
                } else if (placement >= 10 & placement < 50) {
                    if (selectedOption === 'expense') {
                        background = 'background: hsl(22,75%,57%)';
                    } else if (selectedOption === 'income') {
                        background = 'background: hsl(111, 39%, 57%)';
                    }
                } else {
                    if (selectedOption === 'expense') {
                        background = 'background: hsl(34,81%,54%)';
                    } else if (selectedOption === 'income') {
                     
                        background = 'background: hsl(157, 100%, 32%)';
                    }
                }
                // if (selectedOption === 'income') {
                //     background = 'background: hsl(157,' + s + '%, 32%)';
                // }// else if (selectedOption === 'expense') {
                //     background = 'background: hsl(334,' + s + '%, 55%)';
                // }
            } else {
                if (selectedOption === 'income') {
                    background = 'background: #00a567';
                } else if (selectedOption === 'expense') {
                    background = 'background: #de5d83';
                }
            }
            day.Color = background;
        }
    }
</script>

<div class="content">
    {#if activeTab === 'Yearly'}
        <YearlyContent {convertToDate} {getTransactionsInfoForDay} {getDayClass} {getSelectedDaysTransactions} {daysInYear} {setHeatmapStyle} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
    {:else if activeTab === 'Monthly'}
        <MonthlyContent {formatAmount} {daysInYear} {getDayClass} {getSelectedDaysTransactions} {setHeatmapStyle} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
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
