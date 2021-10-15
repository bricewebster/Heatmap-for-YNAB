<script>
    import CurrentTransactionsStore from '../stores/currentTransactionsStore';
    import CurrencyInfoStore from '../stores/currencyInfoStore';


    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let formatAmount = () => {};
    export let daysInYear = () => {};
    export let getTransactionsInfoForDay = () => {};
    export let getDayClass = () => {};

    let dayList = [{dayOfYear: 1, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 2, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 3, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 4, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 5, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 6, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 7, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 8, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 9, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 10, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 11, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 12, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 13, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 14, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 15, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 16, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 17, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 18, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 19, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 20, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 21, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 22, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 23, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 24, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 25, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 26, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 27, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 28, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 29, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}, {dayOfYear: 30, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''},
                       {dayOfYear: 31, Amount: 0, amountFormatted: '', Rank: 0, Color: '', Class: ''}];
    
    let fullDayList = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]

    //Reactively calls populateDayList when currentTransactionStore is updated anywhere in project.
    $: $CurrentTransactionsStore, populateDayList();

    function populateDayList () {
        let list = [];
        for (let transaction of $CurrentTransactionsStore) {
            if (selectedOption === 'income' & transaction.Amount > 0 || selectedOption === 'expense' & transaction.Amount < 0 || selectedOption === 'net' || transaction.Amount != 0) {
                let amount = parseFloat(parseFloat(transaction.Amount).toFixed($CurrencyInfoStore.Decimals));
                let formattedAmount = formatAmount(amount);
                let dateFormatted = transaction.dateFormatted;
                let dayOfYear = daysInYear(transaction.Date);
                let days = {Amount: amount, amountFormatted: formattedAmount, dayOfYear: dayOfYear, dateFormatted: dateFormatted};
                fullDayList[dayOfYear].push(days);
               // let dayClass = getDayClass(transInfo.Amount);
                dayList[dayOfYear].Amount = dayList[dayOfYear].Amount + amount;
            }
        }
        console.log(dayList)
        //setHeatmapStyle(selectedStyle, yearDayList);
    }





</script>
<div class="content">
    <p>Monthly Content</p>
</div>
<style>
    .content{
        display: block;
        
        margin: 50px auto 0 auto;
        width: 880px;
    }
</style>