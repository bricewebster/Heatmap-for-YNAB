<script>
    import YearlyContent from "./YearlyContent.svelte";
    import MonthlyContent from "./MonthlyContent.svelte";
    import DailyContent from "./DailyContent.svelte";
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';

    export let activeTab
    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let formatAmount = () => {};
    export let formatDate = () => {};

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
     * @return {Array of Objects} transactions for day selected
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
    /**
     * Gets the day of the year based on the date provided between 1-366. For example if today is 10/21 then it would return 294.
     * @param {Date} transactionDate date of the transaction
     * @return {Int} day of the year.
     */
    function dayOfYear (transactionDate) {
        return (Date.UTC(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()) - Date.UTC(transactionDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
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
        <YearlyContent {formatAmount} {getDayClass} {getSelectedDaysTransactions} {dayOfYear} {setHeatmapStyle} {convertToDate} {formatDate} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
    {:else if activeTab === 'Monthly'}
        <MonthlyContent {formatAmount} {dayOfYear} {getDayClass} {getSelectedDaysTransactions} {setHeatmapStyle} bind:selectedOption bind:selectedStyle bind:selectedYear on:yearChange/>
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
