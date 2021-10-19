<script>
    import CalendarNavigation from "./CalendarNavigation.svelte";
    import TransListPopup from '../components/TransListPopup.svelte';
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';

    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let formatAmount = () => {};
    export let daysInYear = () => {};
    export let  getSelectedDaysTransactions = () => {};
    export let getDayClass = () => {};

    var showPopup = false;
    let selectedDay;
    let selectedDayList = [];
    let selectedAmount;

    let dayList = [{dayOfMonth: 1, Amount: 0, amountFormatted: '', displayName: '1st', Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 2, Amount: 0, amountFormatted: '', displayName: '2nd',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 3, Amount: 0, amountFormatted: '', displayName: '3rd',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 4, Amount: 0, amountFormatted: '', displayName: '4th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 5, Amount: 0, amountFormatted: '', displayName: '5th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 6, Amount: 0, amountFormatted: '', displayName: '6th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 7, Amount: 0, amountFormatted: '', displayName: '7th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 8, Amount: 0, amountFormatted: '', displayName: '8th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 9, Amount: 0, amountFormatted: '', displayName: '9th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 10, Amount: 0, amountFormatted: '', displayName: '10th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 11, Amount: 0, amountFormatted: '', displayName: '11th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 12, Amount: 0, amountFormatted: '', displayName: '12th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 13, Amount: 0, amountFormatted: '', displayName: '13th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 14, Amount: 0, amountFormatted: '', displayName: '14th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 15, Amount: 0, amountFormatted: '', displayName: '15th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 16, Amount: 0, amountFormatted: '', displayName: '16th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 17, Amount: 0, amountFormatted: '', displayName: '17th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 18, Amount: 0, amountFormatted: '', displayName: '18th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 19, Amount: 0, amountFormatted: '', displayName: '19th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 20, Amount: 0, amountFormatted: '', displayName: '20th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 21, Amount: 0, amountFormatted: '', displayName: '21st',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 22, Amount: 0, amountFormatted: '', displayName: '22nd',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 23, Amount: 0, amountFormatted: '', displayName: '22nd',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 24, Amount: 0, amountFormatted: '', displayName: '24th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 25, Amount: 0, amountFormatted: '', displayName: '25th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 26, Amount: 0, amountFormatted: '', displayName: '26th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 27, Amount: 0, amountFormatted: '', displayName: '27th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 28, Amount: 0, amountFormatted: '', displayName: '28th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 29, Amount: 0, amountFormatted: '', displayName: '29th',  Rank: 0, Color: '', Class: 'none'}, {dayOfMonth: 30, Amount: 0, amountFormatted: '', displayName: '30th',  Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 31, Amount: 0, amountFormatted: '', displayName: '31st',  Rank: 0, Color: '', Class: 'none'}];
    
    let fullDayList = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]

    //Reactively calls populateDayList when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, populateFullDayList();

    function populateFullDayList () {
        let list = [];
        for (let transaction of $CurrentTransactionsStore) {
            if (selectedOption === 'income' & transaction.Amount > 0 || selectedOption === 'expense' & transaction.Amount < 0 || selectedOption === 'net' & transaction.Amount != 0) {
                let amount = parseFloat(parseFloat(transaction.Amount).toFixed($CurrencyInfoStore.Decimals));
                let formattedAmount = formatAmount(amount);
                let dateFormatted = transaction.dateFormatted;
               // console.log(transaction.Date)
                let dayOfYear = daysInYear(transaction.Date);
                let dayOfMonth = transaction.Date.getDate() - 1;
                //console.log(dayOfMonth)
                let days = {Amount: amount, amountFormatted: formattedAmount, dayOfYear: dayOfYear, dateFormatted: dateFormatted, dayOfMonth: dayOfMonth};
                fullDayList[dayOfMonth].push(days);
               // let dayClass = getDayClass(transInfo.Amount);
            }
        }

        populateDayList()
        //setHeatmapStyle(selectedStyle, yearDayList);
    }

    function populateDayList() {
        let dayIndex = 0;
        for (let day of fullDayList) {
            let amount = 0;
            for (let transaction of day) {
                amount = parseFloat((parseFloat(amount) + parseFloat(transaction.Amount)).toFixed($CurrencyInfoStore.Decimals));
            }
            dayList[dayIndex].Amount = amount;
            dayList[dayIndex].amountFormatted = formatAmount(dayList[dayIndex].Amount);
            dayList[dayIndex].Class = getDayClass(dayList[dayIndex].Amount);
            dayIndex++;
        }
    }

    function changeSelectedOption (option) {
        selectedOption = option;
        populateFullDayList();
    }

    function changeSelectedStyle () {
        let b = 0;
    }
    /**
     * When a day is clicked on the calendar, set all the information to be passed to the trans list popup and then call it.
     * @param {Date} date date clicked
     * @param {String} dateFormatted date clicked in user settings format
     * @param {String} amountFormatted amount for day clicked in user settings format
     */
     function dayClicked(day, displayName, amountFormatted) {
         console.log(day)
        selectedDay = displayName + ' of the month';
        selectedDayList = getSelectedDaysTransactions(day, 'month');
        selectedAmount = amountFormatted;
        togglePopup();
    }
    /**
     * Opens and closes the trans list popup.
     */
     function togglePopup () {
        showPopup = !showPopup;
    }

</script>
<div class="content">
    <CalendarNavigation {selectedOption} {selectedStyle} list = {dayList} {changeSelectedOption} {changeSelectedStyle}  bind:selectedYear on:yearChange/>
    <table class="cal-month">
        {#each Array(5) as _, mainIndex}
        <tr>
            {#each dayList as day, index}
                {#if index < 7 & mainIndex === 0}
                    <th class="{day.Class}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}>{day.displayName}</th>
                {/if}
                {#if index >= 7 & index <= 13 & mainIndex === 1}
                    <th class="{day.Class}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}>{day.displayName}</th>
                {/if}
                {#if index > 13 & index <= 20 & mainIndex === 2}
                    <th class="{day.Class}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}>{day.displayName}</th>
                {/if}
                {#if index > 20 & index <= 27 & mainIndex === 3}
                    <th class="{day.Class}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}>{day.displayName}</th>
                {/if}
                {#if index > 28 & mainIndex === 4}
                    <th class="{day.Class}" on:click={() => dayClicked(day.dayOfMonth, day.displayName, day.amountFormatted)}>{day.displayName}</th>
                {/if}
            {/each}
        </tr>
        {/each}
    </table>
    {#if showPopup}
        <div class="backdrop" on:click|self={() => togglePopup()}>
            <TransListPopup {selectedDay} {selectedDayList} {selectedAmount} {togglePopup}/>
        </div>
    {/if}
</div>
<style>
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 880px;
    }
    .cal-month {
        display: inline-block;

        margin: 0 auto;
        width: 780px;
        height: auto;

        font-size: 12px;

        border-spacing: 5px;
    }
    .cal-month tr {
        width: 100%;
        height: auto;
    }
    .cal-month th {
        width: 100px;
        height: 55px; 
    }
    .income {
        background-color: #00a567;
        color: white;
    }
    .expense {
        background-color: #de5d83;
        color: white;
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
    .backdrop {
        position: fixed;

        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        z-index: 10;
    }
</style>