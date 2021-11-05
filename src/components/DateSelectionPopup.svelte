<script>
    import Button from "./Button.svelte";
    import NavOptionsStore from "../stores/navOptionsStore";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let togglePopup = () => {};

    let startMonths = [{Number: 0, Name: 'January', Disabled: ''}, {Number: 1, Name: 'February', Disabled: ''}, {Number: 2, Name: 'March', Disabled: ''},  {Number: 3, Name: 'April', Disabled: ''},  {Number: 4, Name: 'May', Disabled: ''},
                  {Number: 5, Name: 'June', Disabled: ''}, {Number: 6, Name: 'July', Disabled: ''}, {Number: 7, Name: 'August', Disabled: ''},  {Number: 8, Name: 'September', Disabled: ''},  {Number: 9, Name: 'October', Disabled: ''},
                  {Number: 10, Name: 'November', Disabled: ''}, {Number: 11, Name: 'December', Disabled: ''}];
    let endMonths = [{Number: 0, Name: 'January', Disabled: ''}, {Number: 1, Name: 'February', Disabled: ''}, {Number: 2, Name: 'March', Disabled: ''},  {Number: 3, Name: 'April', Disabled: ''},  {Number: 4, Name: 'May', Disabled: ''},
                  {Number: 5, Name: 'June', Disabled: ''}, {Number: 6, Name: 'July', Disabled: ''}, {Number: 7, Name: 'August', Disabled: ''},  {Number: 8, Name: 'September', Disabled: ''},  {Number: 9, Name: 'October', Disabled: ''},
                  {Number: 10, Name: 'November', Disabled: ''}, {Number: 11, Name: 'December', Disabled: ''}];
    let Years = [];

    let selected = {startMonth: $NavOptionsStore.startDate.getMonth(), startYear: $NavOptionsStore.startDate.getFullYear(), endMonth: $NavOptionsStore.endDate.getMonth(), endYear: $NavOptionsStore.endDate.getFullYear()};
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    populateLists()

    /**
     * Main function for populating the month and years lists.
    */
    function populateLists () {
        populateYears();
        populateMonths();
    }
    /**
     * Populates the year list starting from first transaction year to current year.
    */
    function populateYears () {
        let startYear = $NavOptionsStore.firstDate.getFullYear();
        Years = [];
        for (let index = startYear; index <= currentYear; index ++) {
            Years.push(index);
        }
    }
    /**
     * Populates the month lists and disables them depending on the year and months.
     * @param {String} selectedDate which month dropdown was selected
     */
    function populateMonths (selectedDate) {
        let fromStartMonth;
        let fromEndMonth;
        let toStartMonth;
        let toEndMonth;

        //startYear and endYear are equal and startMonth is greater than endMonth and startYear was selected then it'll adjust the endMonth.
        if (selected.startYear === selected.endYear & selected.startMonth > selected.endMonth & selectedDate === 'start') {
            selected.endMonth = selected.startMonth;
        }
        //startYear and endYear are equal and startMonth is greater than endMonth and endYear was selected then it'll adjust the startMonth.
        if (selected.startYear === selected.endYear & selected.startMonth > selected.endMonth & selectedDate === 'end') {
            selected.startMonth = selected.endMonth;
        }

        //Sets the from start and end month indexes.
        if (selected.startYear === $NavOptionsStore.firstDate.getFullYear()) {
            fromStartMonth = $NavOptionsStore.firstDate.getMonth();
            fromEndMonth = 11;
        } else if (selected.startYear === currentYear) {
            fromStartMonth = 0
            fromEndMonth = currentMonth;
        } else {
            fromStartMonth = 0;
            fromEndMonth = 11;
        }

        //Sets the to start and end month indexes.
        if (selected.endYear === $NavOptionsStore.firstDate.getFullYear()) {
            toStartMonth = $NavOptionsStore.firstDate.getMonth();
            toEndMonth = 11;
        } else if (selected.endYear === currentYear) {
            toStartMonth = 0;
            toEndMonth = currentMonth;
        } else {
            toStartMonth = 0;
            toEndMonth = 11;
        }
        
        for (let month of startMonths) {
            if (month.Number < fromStartMonth || month.Number > fromEndMonth & selected.startYear === currentYear) {
                month.Disabled = true;
            } else {
                month.Disabled = '';
            }
        }

        for (let month of endMonths) {
            if (month.Number < toStartMonth & selected.endYear === selected.startYear|| month.Number > toEndMonth) {
                month.Disabled = 'Disabled';
            } else {
                month.Disabled = '';
            }
        }
        startMonths = startMonths;
        endMonths = endMonths;
    }
    /**
     * Function called when a year select dropdown is changed. Contains a lot of logic checks to make sure dates aren't illogical which will cause errors.
     * @param {String} selectedDate which year dropdown was selected
     */
    function yearSelectChange (selectedDate) {
        //startYear greater than endYear and selected new startYear then End year adjusted. Ex. May 2021 June 2020 -> May 2021 June 2021
        if (selected.startYear > selected.endYear & selectedDate === 'start') {
            selected.endYear = selected.startYear;    
        }
        //endYear less than startYear and selected new endYear then startYear adjusted. Ex. May 2020 June 2019 -> May 2019 June 2019
        if (selected.endYear < selected.startYear & selectedDate === 'end') {
            selected.startYear = selected.endYear;    
        }
        //startYear equals firstDate(year) and if startMonth is before firstDate(month) then it'll change the startMonth to the firstDate(month).
        if (selected.startYear === $NavOptionsStore.firstDate.getFullYear() & selected.startMonth < $NavOptionsStore.firstDate.getMonth()) {
            selected.startMonth = $NavOptionsStore.firstDate.getMonth();
        }
        //startYear equals currentYear and startMonth is after currentMonth then it'll change the startMonth to the currentMonth .
        if (selected.startYear === currentYear & selected.startMonth > currentMonth) {
            selected.startMonth = currentMonth;
        }
        //endYear equals firstDate(year) and endMonth is before firstDate(month) then it'll change the endMonth to the firstDate(month).
        if (selected.endYear === $NavOptionsStore.firstDate.getFullYear() & selected.endMonth < $NavOptionsStore.firstDate.getMonth()) {
            selected.endMonth = $NavOptionsStore.firstDate.getMonth();
        }
        //endYear equals currentYear and endMonth is after currentMonth then it'll change the endMonth to the currentMonth.
        if (selected.endYear === currentYear & selected.endMonth > currentMonth) {
            selected.endMonth = currentMonth;
        }
        //startYear and endYear are equal and startMonth is greater than endMonth and startYear was selected then it'll adjust the endMonth.
        if (selected.startYear === selected.endYear & selected.startMonth > selected.endMonth & selectedDate === 'start') {
            selected.endMonth = selected.startMonth;
        }
        //startYear and endYear are equal and startMonth is greater than endMonth and endYear was selected then it'll adjust the startMonth.
        if (selected.startYear === selected.endYear & selected.startMonth > selected.endMonth & selectedDate === 'end') {
            selected.startMonth = selected.endMonth;
        }
        
        populateMonths();
    }
    /**
     * Changes the dates when a date option is selected such as Current Month or All Dates.
     * @param {String} option date option selected
     */
    function dateOptionSelected(option) {
        if (option === 'currentMonth') {
            selected.startMonth = currentMonth;
            selected.endMonth = currentMonth;
            selected.startYear = currentYear;
            selected.endYear = currentYear;
        } else if (option === 'currentQuarter') {
            selected.startMonth = new Date(currentYear, currentMonth - 2).getMonth();
            selected.endMonth = currentMonth;
            selected.startYear = new Date(currentYear, currentMonth - 2).getFullYear();
            selected.endYear = currentYear;
        } else if (option === 'currentYear') {
            selected.startMonth = 0;
            selected.endMonth = currentMonth;
            selected.startYear = currentYear;
            selected.endYear = currentYear;
        } else if (option === 'lastYear') {
            selected.startMonth = 0;
            selected.endMonth = 11;
            selected.startYear = currentYear - 1;
            selected.endYear = currentYear - 1;
        } else {
            selected.startMonth = $NavOptionsStore.firstDate.getMonth();
            selected.endMonth = currentMonth;
            selected.startYear = $NavOptionsStore.firstDate.getFullYear();
            selected.endYear = currentYear;
        }
        saveChanges();
    }
    /**
     * Save the changes that were made to the dates.
    */
    function saveChanges () {
        $NavOptionsStore.startDate = new Date(selected.startYear, selected.startMonth);
        $NavOptionsStore.endDate = new Date(selected.endYear, selected.endMonth + 1, 0);
        dispatch('dateChange', );
        togglePopup();
    }

</script>

<div class="popup">
    <p class="title">Timeframe</p>
    <div class="selection">
        <ul>
            <li on:click={() => dateOptionSelected('currentMonth')}>This Month</li>
            <li on:click={() => dateOptionSelected('currentQuarter')}>Latest 3 Months</li>
            <li on:click={() => dateOptionSelected('currentYear')}>This Year</li>
            <li on:click={() => dateOptionSelected('lastYear')}>Last Year</li>
            <li on:click={() => dateOptionSelected('all')}>All Dates</li>
        </ul>
    </div>
    <div class="date-selection">
        <ul>
            <li class="label from">From: </li>
            <li>
                <select name="startmonths" bind:value={selected.startMonth} on:change="{() => populateMonths('start')}">
                    {#each startMonths as month}
                        <option value={month.Number} disabled={month.Disabled}>{month.Name}</option>
                    {/each}
                </select>
            </li>
            <li>
                <select name="startYears" bind:value={selected.startYear} on:change="{() => yearSelectChange('start')}">
                    {#each Years as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
            </li>
            <li class="label to">To: </li>
            <li>
                <select name="endmonths" bind:value={selected.endMonth} on:change="{() => populateMonths('end')}">
                    {#each endMonths as month}
                        <option value={month.Number} disabled={month.Disabled}>{month.Name}</option>
                    {/each}
                </select>
            </li>
            <li>
                <select name="endYears" bind:value={selected.endYear} on:change="{() => yearSelectChange('end')}">
                    {#each Years as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
            </li>
        </ul>
    </div>
    <div class="buttons">
        <Button type="secondary" on:click={togglePopup}>Cancel</Button>
        <Button on:click={() => saveChanges()}>Done</Button>
    </div>
</div>

<style lang="scss">
    .popup {
        position: absolute;
        top: 180px;
        right: 730px;

        margin-top: 30px;

        width:  460px;
        height: 180px;

        background-color: white;
        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);

        color: #383e41;

        opacity: 1;
    }
    .title {
        margin: 15px 0 5px 15px;

        font-size: 1em;
        font-weight: 700;
        color: #383e41;
    }
    .selection {
        margin: 0px 15px;
        

        border-top: 1px solid rgba(0, 0, 0, 0.15);
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        & ul {
            margin: 6px 0;
        }

        & li {
            display: inline-block;

            margin-right: 4px;
            padding: .2em .6em;
            
            background: none;
            border-radius: 1000px;

            font-size: 12.6px;
            color: var(--ynab-light-blue);

            &:hover {
                background-color: var(--ynab-light-green);

                color: white;

                cursor: pointer;
            }
        }
    }
    .date-selection {
        margin: 15px 0 0 15px;
        height: 35px;

        font-size: .9rem;

        & li {
            float: left;
            list-style: none;
            
            padding-right: 0.3em;
        }
        & select {
            border: 0.125rem solid #8e8e93;
            border-radius: 0.25rem;

            color: #383e41;
        }
    }
    .label {
        font-weight: 600;
        line-height: 1.5;

        &.from {
            margin-left: 10px;
        }
        &.to {
            margin-left: 10px;
        }
    }
    .buttons {
        float: right;

        margin: 15px 10px 0 0;
        width: 140px;
    }
    .popup::after {
        content: " ";
        position: absolute;
        bottom: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent white transparent;
    }
</style>

<!-- markup (zero or more items) goes here -->