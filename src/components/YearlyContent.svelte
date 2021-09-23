<script>
    let dayList = [];
    var selectedYear = new Date().getFullYear();

    const buildCalendarList = () => {
        for (let calendarList = 1; calendarList <= 12; calendarList++) {
            let days = daysInMonth(calendar)
            for (let calendarList)
        }
    }

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
</script>
<div class="content">
    <p>Yearly Content</p>
</div>
<style>
    /* your styles go here */
</style>