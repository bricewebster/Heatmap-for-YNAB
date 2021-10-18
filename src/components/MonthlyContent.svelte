<script>
    import CalendarNavigation from "./CalendarNavigation.svelte";
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';


    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let formatAmount = () => {};
    export let daysInYear = () => {};
    // export let getTransactionsInfoForDay = () => {};
    export let getDayClass = () => {};

    let dayList = [{dayOfMonth: 1, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 2, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 3, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 4, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 5, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 6, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 7, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 8, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 9, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 10, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 11, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 12, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 13, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 14, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 15, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 16, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 17, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 18, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 19, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 20, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 21, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 22, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 23, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 24, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 25, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 26, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 27, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 28, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 29, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}, {dayOfYear: 30, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'},
                       {dayOfMonth: 31, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: 'none'}];
    
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
        console.log(dayList)
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
            console.log(dayList[dayIndex].Amount)
            dayIndex++;
        }
    }

    function changeSelectedOption () {
        let a = 0;
    }

    function changeSelectedStyle () {
        let b = 0;
    }


</script>
<div class="content">
    <CalendarNavigation {selectedOption} {selectedStyle} list = {dayList} {changeSelectedOption} {changeSelectedStyle}  bind:selectedYear on:yearChange/>
    <table class="cal-month">
        {#each Array(5) as _, mainIndex}
        <tr>
            {#each dayList as day, index}
             
                {#if index < 7 & mainIndex === 0}
                    <th class="{day.Class}"></th>
                {/if}
                {#if index >= 7 & index <= 13 & mainIndex === 1}
                    <th class="{day.Class}"></th>
                {/if}
                {#if index > 13 & index <= 20 & mainIndex === 2}
                    <th class="{day.Class}"></th>
                {/if}
                {#if index > 20 & index <= 27 & mainIndex === 3}
                    <th class="{day.Class}"></th>
                {/if}
                {#if index > 28 & mainIndex === 4}
                    <th class="{day.Class}"></th>
                {/if}
               
            {/each}
        </tr>
            <!-- {#each dayList as day, index} -->
                <!-- <tr>
                {#if index >= 6 & index <= 12}
                    <th class="{day.Class}">{index}</th>
                {/if}
                </tr>
            {/each}
            {#each dayList as day, index}
                <tr>
                {#if index > 12 & index <= 19}
                    <th class="{day.Class}">{index}</th>
                {/if}
                </tr>
            {/each}
            {#each dayList as day, index}
                <tr>
                {#if index > 19 & index <= 26}
                    <th class="{day.Class}">{index}</th>
                {/if}
                </tr>
            {/each}
            {#each dayList as day, index}
                <tr>
                {#if index > 27}
                    <th class="{day.Class}">{index}</th>
                {/if}
                </tr>
            {/each} -->
            {/each}
    </table>
</div>
<style>
    .content {
        display: block;
        
        margin: 50px auto 0 auto;
        width: 880px;
    }
    .cal-month {
        display: inline-block;

        width: 840px;
        height: auto;

        font-size: 12px;
    }
    .cal-month tr {
        width: 100%;
        height: auto;
    }
    .cal-month th {
        padding: 10px;
        width: 150px;
        height: 55px; 
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
</style>