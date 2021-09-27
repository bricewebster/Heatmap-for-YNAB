<script>
    let dayLists = [];
    let dayCount = 31;
    let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var selectedYear = new Date().getFullYear();

    buildCalendarList();

    function buildCalendarList () {
        let dayList = [];
        for (let calendarList = 1; calendarList <= 12; calendarList++) {
            let dayAmount = daysInMonth(calendarList, selectedYear);
            let days = {Month: calendarList, Day: dayAmount};
            dayList.push(days);
        }
        dayLists = dayList;
    }
    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    function toggleSelectedYear (buttonSelected) {
        selectedYear = buttonSelected === 'previous' ? selectedYear=selectedYear-1 : selectedYear=selectedYear+1;
        buildCalendarList();
    }
</script>
<div class="content">
    <div class="cal-year-container">
        <div class="cal-options">
            <button on:click={() => toggleSelectedYear('previous')}><span class="material-icons-outlined md-36 income">savings</span></button>
            <button on:click={() => toggleSelectedYear('previous')}><span class="material-icons-outlined md-36 expense">paid</span></button>
            <button on:click={() => toggleSelectedYear('previous')}><span class="material-icons-outlined md-36 net">request_quote</span></button>
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
                    <tr><th><p>{month}</p></th></tr>
                {/each}
            </table>
            <table class="cal-year cal-year-days">
                {#each dayLists as month}
                    <tr>
                    {#each Array(month.Day) as _, day}
                        <th></th>
                    {/each}
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</div>
<style lang="scss">
    .cal-options {
        display: inline-block;
        margin: 15px auto 0 auto;
        width: 300px;

        & button {
            margin-right: 20px;
            background: none;
            border: none;
        }
    }
    .income {
        color: #00a567;
    }
    .expense {
        color: #de5d83;
    }
    .net {
        color: #ffb347;
    }
    .year-selector {
        display: inline-block;

        margin: 0 auto 15px auto;
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
    .cal-year.cal-year-days th {
        background-color:  rgba(187, 167, 167, 0.842);
    }
</style>