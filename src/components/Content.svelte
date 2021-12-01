<script>
    import YearlyContent from "./YearlyContent.svelte";
    import MonthlyContent from "./MonthlyContent.svelte";
    import DaysOfMonthContent from "./DaysOfMonthContent.svelte";
    import WeeksOfMonthContent from "./WeeksOfMonthContent.svelte";
    import DailyContent from "./DailyContent.svelte";
    import NavOptionsStore from "../stores/navOptionsStore";
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';
    import HeatmapSettingsStore from '../stores/heatmapSettingsStore';

    export let activeTab
    export let formatAmount = () => {};
    export let formatDate = () => {};
    export let dayToWeek = () => {};

     /**
     * Populates the transaction list.
     */
     function populateTransactionList (transactionList) {
        for (let transaction of $CurrentTransactionsStore) {
            if ($NavOptionsStore.selectedOption === 'income' & transaction.Amount > 0 || $NavOptionsStore.selectedOption === 'expense' & transaction.Amount < 0 || $NavOptionsStore.selectedOption === 'net' & transaction.Amount != 0) {
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
                    dayIndex = transaction.Date.getMonth();
                    day = {Amount: amount, amountFormatted: formattedAmount, dateFormatted: dateFormatted, Month: dayIndex};
                } else if (activeTab === 'Days of Month') {
                    dayIndex = transaction.Date.getDate() - 1;
                    day = {Amount: amount, amountFormatted: formattedAmount, dateFormatted: dateFormatted, dayOfMonth: dayIndex};
                } else if (activeTab === 'Weeks of Month') {
                    dayIndex = dayToWeek(transaction.Date);
                    day = {Amount: amount, amountFormatted: formattedAmount, dateFormatted: dateFormatted, Week: dayIndex};
                } else {
                    dayIndex = transaction.Date.getDay();
                    day = {Amount: amount, amountFormatted: formattedAmount, dateFormatted: dateFormatted, dayOfWeek: dayIndex};
                }
                transactionList[dayIndex].push(day);
               // let dayClass = getDayClass(transInfo.Amount);
            }
        }
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
            dayIndex++;
        }

        return summaryList;
    }
    /**
     * Converts supplised month, year, and day into Date object.
     * @param {String} month supplied month
     * @param {String} year selected year
     * @param {String} day supplied day
     * @return {Date} Date object based on parameters
     */
    function convertToDate (month, year, day) {
        return new Date(year, month, day);
    }
    /**
     * Determine the class to be used based on the supplied amount and selected option.
     * @param {Int} amount supplied amount
     * @return {String} class to be used
     */
    function getDayClass (amount) {
        let dayClass;
        if ($NavOptionsStore.selectedOption === 'income' & amount != 0) {
            dayClass = 'income';
        } else if ($NavOptionsStore.selectedOption === 'expense' & amount != 0) {
            dayClass = 'expense';
        } else if ($NavOptionsStore.selectedOption === 'net' & amount != 0) {
            dayClass = 'net';
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
    function getSelectedDaysTransactions (date) {
        let transactionList = [];
        for (let day of $CurrentTransactionsStore) {
            let compare;
            if (activeTab === 'Yearly') {
                compare = (day.Date.getMonth() === date.getMonth() & day.Date.getDate() === date.getDate());
            } else if (activeTab === 'Monthly') {
                compare = day.Month === date;
            } else if (activeTab === 'Days of Month') {
                compare = day.dayOfMonth === date;
            } else if (activeTab === 'Weeks of Month') {
                compare = day.Week === date;
            } else {
                compare = day.dayOfWeek === date;
            }
            if (compare) {
                if ($NavOptionsStore.selectedOption === 'income' & day.Amount > 0) {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                } else if ($NavOptionsStore.selectedOption === 'expense' & day.Amount < 0) {
                    day.amountFormatted = formatAmount(day.Amount);
                    transactionList.push(day);
                } else if ($NavOptionsStore.selectedOption === 'net') {
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
        let list = [];
        if ($NavOptionsStore.selectedOption === 'net') {
            let posList = getSignList('positive', summaryList);
            let tempPosList = setHeatmapStyle(posList);
            let negList = getSignList('negative', summaryList);
            let tempNegList = setHeatmapStyle(negList);
            summaryList = combineSignLists(tempPosList, tempNegList, summaryList);
        } else {
            list = setHeatmapStyle(summaryList);
            summaryList = applyHeatMapColor(list, summaryList);
        }
        return summaryList;
    }
    /**
     * Creates a list of positive and negative days.
     * @param {String} sign list to build based on sign
     * @param {Array of Objects} summaryList list to break down
     * @return {Array of Objects} list based on supplied sign
     */
    function getSignList (sign, summaryList) {
        let signList = [];
        if (sign === 'positive') {
            for (let list of summaryList) {
                if (list.Amount >= 0) {
                    signList.push(list);
                }
            }
        } else {
            for (let list of summaryList) {
                if (list.Amount < 0) {
                    signList.push(list);
                }
            }
        }
        return signList;
    }
    /**
     * Takes positive & negative list and combines them into summarylist.
     * @param {Array of Objects} posList list of positive days
     * @param {Array of Objects} negList list of negative days
     * @param {Array of Objects} summaryList list to merge sign lists into
     * @return {Array of Objects} summarylist with pos and neg lists combined
     */
    function combineSignLists (posList, negList, summaryList) {

        for (let list of posList) {
            if (activeTab === 'Yearly') {
                summaryList[list.dayOfYear] = list;
            } else if (activeTab === 'Monthly') {
                summaryList[list.Month] = list;
            } else if (activeTab === 'Days of Month') {
                summaryList[list.dayOfMonth] = list;
            } else if (activeTab === 'Weeks of Month') {
                summaryList[list.Week] = list;
            } else {
                summaryList[list.dayOfWeek] = list;
            }
        }

        for (let list of negList) {
            if (activeTab === 'Yearly') {
                summaryList[list.dayOfYear] = list;
            } else if (activeTab === 'Monthly') {
                summaryList[list.Month] = list;
            } else if (activeTab === 'Days of Month') {
                summaryList[list.dayOfMonth] = list;
            } else if (activeTab === 'Weeks of Month') {
                summaryList[list.Week] = list;
            } else {
                summaryList[list.dayOfWeek] = list;
            }
        }
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
        if ($NavOptionsStore.selectedStyle != 'simple') {
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
            if ($NavOptionsStore.selectedStyle === 'regular') {
            
                //console.log('s', s, 'rank', day.Rank);

                if ($NavOptionsStore.selectedOption === 'income' || $NavOptionsStore.selectedOption === 'net' & day.Amount >= 0) {
                    s = increment * (amountToColor - day.Rank);
                    background = `background: hsl(${$HeatmapSettingsStore.Colors.incomeHue}, ${s}%, ${$HeatmapSettingsStore.Colors.incomeLum}%)`;
                } else if ($NavOptionsStore.selectedOption === 'expense' || $NavOptionsStore.selectedOption === 'net' & day.Amount < 0) {
                    s = increment * day.Rank;
                    background = `background: hsl(${$HeatmapSettingsStore.Colors.expenseHue}, ${s}%, ${$HeatmapSettingsStore.Colors.expenseLum}%)`;
                }
            } else if ($NavOptionsStore.selectedStyle === 'group') {
                let placement = (day.Rank / amountToColor) * 100;
                if (placement >= 90) {
                    if ($NavOptionsStore.selectedOption === 'expense' || $NavOptionsStore.selectedOption === 'net' & day.Amount < 0) {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.expenseTopHue}, ${$HeatmapSettingsStore.Colors.expenseTopSat}%, ${$HeatmapSettingsStore.Colors.expenseTopLum}%)`;
                    } else {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.incomeBottomHue}, ${$HeatmapSettingsStore.Colors.incomeBottomSat}%, ${$HeatmapSettingsStore.Colors.incomeBottomLum}%)`;
                    }
                } else if (placement >= 50 & placement < 90) {
                    if ($NavOptionsStore.selectedOption === 'expense' || $NavOptionsStore.selectedOption === 'net' & day.Amount < 0) {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.expenseHighHue}, ${$HeatmapSettingsStore.Colors.expenseHighSat}%, ${$HeatmapSettingsStore.Colors.expenseHighLum}%)`;
                    } else {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.incomeLowHue}, ${$HeatmapSettingsStore.Colors.incomeLowSat}%, ${$HeatmapSettingsStore.Colors.incomeLowLum}%)`;
                    }
                } else if (placement >= 10 & placement < 50) {
                    if ($NavOptionsStore.selectedOption === 'expense' || $NavOptionsStore.selectedOption === 'net' & day.Amount < 0) {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.expenseLowHue}, ${$HeatmapSettingsStore.Colors.expenseLowSat}%, ${$HeatmapSettingsStore.Colors.expenseLowLum}%)`;
                    } else {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.incomeHighHue}, ${$HeatmapSettingsStore.Colors.incomeHighSat}%, ${$HeatmapSettingsStore.Colors.incomeHighLum}%)`;
                    }
                } else {
                    if ($NavOptionsStore.selectedOption === 'expense' || $NavOptionsStore.selectedOption === 'net' & day.Amount < 0) {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.expenseBottomHue}, ${$HeatmapSettingsStore.Colors.expenseBottomSat}%, ${$HeatmapSettingsStore.Colors.expenseBottomLum}%)`;
                    } else {
                        background = `background: hsl(${$HeatmapSettingsStore.Colors.incomeTopHue}, ${$HeatmapSettingsStore.Colors.incomeTopSat}%, ${$HeatmapSettingsStore.Colors.incomeTopLum}%)`;
                    }
                }
            } else {
                if ($NavOptionsStore.selectedOption === 'income' || $NavOptionsStore.selectedOption === 'net' & day.Amount >= 0) {
                    background = `background: hsl(${$HeatmapSettingsStore.Colors.incomeHue}, 100%, ${$HeatmapSettingsStore.Colors.incomeLum}%)`;
                } else{
                    background = `background: hsl(${$HeatmapSettingsStore.Colors.expenseHue}, ${$HeatmapSettingsStore.Colors.expenseSat}%, ${$HeatmapSettingsStore.Colors.expenseLum}%)`;
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
                summaryList[day.Month].Color = day.Color;
            } else if (activeTab === 'Days of Month') {
                summaryList[day.dayOfMonth].Color = day.Color;
            } else if (activeTab === 'Weeks of Month') {
                summaryList[day.Week].Color = day.Color;
            } else {
                summaryList[day.dayOfWeek].Color = day.Color;
            }
        }
        return summaryList;
    }
</script>

<div class="content">
    {#if activeTab === 'Yearly'}
        <YearlyContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} {dayOfYear} {formatDate} on:dateChange/>
    {:else if activeTab === 'Monthly'}
        <MonthlyContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} on:dateChange/>
    {:else if activeTab === 'Days of Month'}
        <DaysOfMonthContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} on:dateChange/>
    {:else if activeTab === 'Weeks of Month'}
        <WeeksOfMonthContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} on:dateChange/>
    {:else}
        <DailyContent {populateTransactionList} {populateSummaryList} {getSelectedDaysTransactions} {changeSelectedStyle} on:dateChange/>
    {/if}
</div>

<style>
    .content {
        width: 100%;

        border-top: 5px solid var(--theme-secondary);

        line-height: normal;
    }
</style>
