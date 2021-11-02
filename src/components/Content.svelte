<script>
    import YearlyContent from "./YearlyContent.svelte";
    import MonthlyContent from "./MonthlyContent.svelte";
    import DailyContent from "./DailyContent.svelte";
    import navOptionsStore from '../stores/navOptionsStore';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';

    export let activeTab
    export let selectedYear;
    export let selectedStartDate;
    export let selectedEndDate;
    export let selectedOption;
    export let selectedStyle;
    export let formatAmount = () => {};
    export let formatDate = () => {};

     /**
     * Populates the transaction list.
     */
     function populateTransactionList (transactionList) {
        for (let transaction of $CurrentTransactionsStore) {
            if ($navOptionsStore.selectedOption === 'income' & transaction.Amount > 0 || $navOptionsStore.selectedOption === 'expense' & transaction.Amount < 0 || $navOptionsStore.selectedOption === 'net' & transaction.Amount != 0) {
                let amount = parseFloat(parseFloat(transaction.Amount).toFixed($CurrencyInfoStore.Decimals));
                let formattedAmount = formatAmount(amount);
                let dateFormatted = transaction.dateFormatted;
                let day;
                let dayIndex;
                if (activeTab === 'Yearly') {
                    dayIndex = dayOfYear(transaction.Date);
                    dayIndex = !isLeapYear(transaction.Date.getFullYear()) & dayIndex >= 60 ? dayIndex : dayIndex - 1;
                    day = {Amount: amount, amountFormatted: formattedAmount, Date: transaction.Date, dateFormatted: dateFormatted, Month: transaction.Date.getMonth() + 1, Day: transaction.Date.getDate()};
                } else if (activeTab === 'Monthly') {
                    dayIndex = transaction.Date.getDate() - 1;
                    day = {Amount: amount, amountFormatted: formattedAmount, dateFormatted: dateFormatted, dayOfMonth: dayIndex};
                } else {
                    dayIndex = transaction.Date.getDay();
                    day = {Amount: amount, amountFormatted: formattedAmount, dateFormatted: dateFormatted, dayOfWeek: dayIndex};
                }
                transactionList[dayIndex].push(day);
               // let dayClass = getDayClass(transInfo.Amount);
            }
        }
        console.log(transactionList)
        return transactionList;
    }
     /**
     * Populates the summary list.
     */
     function populateSummaryList (summaryList, transactionList) {
        let dayIndex = 0;
        for (let day of transactionList) {
            let amount = 0;
            for (let transaction of day) {
                amount = parseFloat((parseFloat(amount) + parseFloat(transaction.Amount)).toFixed($CurrencyInfoStore.Decimals));
            }
            summaryList[dayIndex].Amount = amount;
            summaryList[dayIndex].amountFormatted = formatAmount(summaryList[dayIndex].Amount);
            summaryList[dayIndex].Class = getDayClass(summaryList[dayIndex].Amount);
            console.log(summaryList[dayIndex])
            dayIndex++;
        }

        return summaryList;
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
    /**
     * Determine the class to be used based on the supplied amount and selected option.
     * @param {Int} amount supplied amount
     * @returns {String} class to be used
     */
    function getDayClass (amount) {
        let dayClass;
        if ($navOptionsStore.selectedOption === 'income' & amount != 0) {
            dayClass = 'income';
        } else if ($navOptionsStore.selectedOption === 'expense' & amount != 0) {
            dayClass = 'expense';
        } else if ($navOptionsStore.selectedOption === 'net' & amount != 0) {
            dayClass = amount > 0 ? 'net-pos' : 'net-neg';
        } else {
            dayClass = "none";
        }
        return dayClass;
    }
    /**
     * Get all the transactions for the selected day and populate them in a list.
     * @param {Date} date day selected
     * @return {Array of Objects} transactions for day selected
     */
    function getSelectedDaysTransactions (date, tabOption) {
        let transactionList = [];
        for (let day of $CurrentTransactionsStore) {
            let compare;
            if (tabOption === 'year') {
                compare = (day.Date.getMonth() === date.getMonth() & day.Date.getDate() === date.getDate());
            } else if (tabOption === 'month') {
                compare = day.dayOfMonth === date;
            } else {
                compare = day.dayOfWeek === date;
            }
            if (compare) {
                if ($navOptionsStore.selectedOption === 'income' & day.Amount > 0) {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                } else if ($navOptionsStore.selectedOption === 'expense' & day.Amount < 0) {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                } else if ($navOptionsStore.selectedOption === 'net') {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                }
            }
        }
        console.log(transactionList)
        return transactionList;
    }
    /**
     * Gets the day of the year based on the date provided between 1-366. For example if today is 10/21 then it would return 294.
     * @param {Date} transactionDate date of the transaction
     * @return {Int} day of the year.
     */
    function dayOfYear (transactionDate) {
        return (Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    }
     /**
      * Calculates year provided to see if its a leap year and returns true or false.
      * @param {String} year the year calculated
      * @return {Boolean} true if it is a leap year else false.
    */
    function isLeapYear(year){
        return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
    }
    /**
     * When a style button is clicked, the style is changed to that selected style.
     * @param {String} style selected style
     * @param {Array of Objects} summaryList list to apply style change to
     * @return {Array of Objects} list with changed style
     */
    function changeSelectedStyle (summaryList) {
        let list = setHeatmapStyle(summaryList);
        summaryList = applyHeatMapColor(list, summaryList);
        return summaryList;
    }
    /**
     * Main function that sets the new heatmap style that was selected. If the selected style isn't simple then it breaks down the day list provided and ranks them smallest to largest.
     * Calls a function with ranked list to set heatmap colors and then returns that list.
     * @param {Array of Objects} daylist list of days change the heatmap style of
     * @return {Array of Objects} new list with changed heatmap colors
     */
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
        console.log(list)
        setHeatmapColors(amountToColor, list);
        return list;
    }
    /**
     * Creates a new list from the provided list with duplicates removed, sorts it and returns the new list.
     * @param {Array of Objects} list day list to be sorted and duplicates removed
     * @return {Array of Objects} new day list with duplicates removed and sorted
     */
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
    /**
     * Set the heatmap colors based on the selected option and style to the provided list and returns the list
     * @param {Int} amountToColor amount of days to be colored
     * @param {Array of Objects} list list of days to apply selected styles to
     * @return {Array of Objects} list of days with selected style colors to be assigned 
     */
    function setHeatmapColors (amountToColor, list) {
        let increment = 100 / amountToColor;
        let background;
        for (let day of list) {
            let s;
            if (selectedStyle === 'regular') {
                s = increment * day.Rank;
                if ($navOptionsStore.selectedOption === 'income') {
                    background = 'background: hsl(157,' + s + '%, 32%)';
                } else if ($navOptionsStore.selectedOption === 'expense') {
                    background = 'background: hsl(342,' + s + '%, 62%)';
                }
            } else if (selectedStyle === 'group') {
                let placement = (day.Rank / amountToColor) * 100;
                if (placement >= 90) {
                    if ($navOptionsStore.selectedOption === 'expense') {
                        background = 'background: hsl(343,63%,54%)';
                    } else if ($navOptionsStore.selectedOption === 'income') {
                        background = 'background: hsl(52, 84%, 73%)';
                    }
                } else if (placement >= 50 & placement < 90) {
                    if ($navOptionsStore.selectedOption === 'expense') {
                        background = 'background: hsl(4,66%,60%)';
                    } else if ($navOptionsStore.selectedOption  === 'income') {
                        background = 'background: hsl(76, 52%, 63%)';
                    }
                } else if (placement >= 10 & placement < 50) {
                    if ($navOptionsStore.selectedOption === 'expense') {
                        background = 'background: hsl(22,75%,57%)';
                    } else if ($navOptionsStore.selectedOption === 'income') {
                        background = 'background: hsl(111, 39%, 57%)';
                    }
                } else {
                    if ($navOptionsStore.selectedOption === 'expense') {
                        background = 'background: hsl(34,81%,54%)';
                    } else if ($navOptionsStore.selectedOption === 'income') {
                     
                        background = 'background: hsl(157, 100%, 32%)';
                    }
                }
                // if (selectedOption === 'income') {
                //     background = 'background: hsl(157,' + s + '%, 32%)';
                // }// else if (selectedOption === 'expense') {
                //     background = 'background: hsl(334,' + s + '%, 55%)';
                // }
            } else {
                if ($navOptionsStore.selectedOption === 'income') {
                    background = 'background: #00a567';
                } else if ($navOptionsStore.selectedOption === 'expense') {
                    background = 'background: #de5d83';
                }
            }
            day.Color = background;
        }
    }
    /**
     * Takes a list and sets the colors for the heatmap style change and returns the list.
     * @param {Array of Objects} list list that will be applied to current list
     * @param {Array of Objects} fullList list that is to be updated with new colors
     * @return {Array of Objects} changed main list to new style color
     */
     function applyHeatMapColor (list, summaryList) {
        for (let day of list) {
            if (activeTab === 'Yearly') {
                summaryList[day.dayOfYear].Color = day.Color;
            } else if (activeTab === 'Monthly') {
                summaryList[day.dayOfMonth].Color = day.Color;
            } else {
                summaryList[day.dayOfWeek].Color = day.Color;
            }
        }
        return summaryList;
    }
</script>

<div class="content">
    {#if activeTab === 'Yearly'}
        <YearlyContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} {dayOfYear} {formatDate} bind:selectedOption bind:selectedStyle bind:selectedYear bind:selectedStartDate bind:selectedEndDate on:yearChange />
    {:else if activeTab === 'Monthly'}
        <MonthlyContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
    {:else}
        <DailyContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
    {/if}
</div>

<style>
    .content {
        width: 100%;

        border-top: 5px solid var(--ynab-dark-green);

        line-height: normal;
    }
</style>
