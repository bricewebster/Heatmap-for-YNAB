<script>
    import Button from "./Button.svelte";
    import NavOptionsStore from "../stores/navOptionsStore";

    export let togglePopup = () => {};

    let startMonths = [{Number: 0, Name: 'January', Disabled: ''}, {Number: 1, Name: 'February', Disabled: ''}, {Number: 2, Name: 'March', Disabled: ''},  {Number: 3, Name: 'April', Disabled: ''},  {Number: 4, Name: 'May', Disabled: ''},
                  {Number: 5, Name: 'June', Disabled: ''}, {Number: 6, Name: 'July', Disabled: ''}, {Number: 7, Name: 'August', Disabled: ''},  {Number: 8, Name: 'September', Disabled: ''},  {Number: 9, Name: 'October', Disabled: ''},
                  {Number: 10, Name: 'November', Disabled: ''}, {Number: 11, Name: 'December', Disabled: ''}];
    let endMonths = [{Number: 0, Name: 'January', Disabled: ''}, {Number: 1, Name: 'February', Disabled: ''}, {Number: 2, Name: 'March', Disabled: ''},  {Number: 3, Name: 'April', Disabled: ''},  {Number: 4, Name: 'May', Disabled: ''},
                  {Number: 5, Name: 'June', Disabled: ''}, {Number: 6, Name: 'July', Disabled: ''}, {Number: 7, Name: 'August', Disabled: ''},  {Number: 8, Name: 'September', Disabled: ''},  {Number: 9, Name: 'October', Disabled: ''},
                  {Number: 10, Name: 'November', Disabled: ''}, {Number: 11, Name: 'December', Disabled: ''}];

    let Years = [];

    populateYearLists()

    function populateYearLists () {
        let startYear = $NavOptionsStore.firstDate.getFullYear();
        let startMonth = $NavOptionsStore.firstDate.getMonth();
        let endYear = $NavOptionsStore.endDate.getFullYear();
        let endMonth = $NavOptionsStore.endDate.getFullYear();
        let currentYear = new Date().getFullYear();


        for (let index = startYear; index <= currentYear; index ++) {
            Years.push(index);
        }

        for (let month of startMonths) {
            if (month.Number < startMonth) {
                month.Disabled = true;
            } else {
                month.Disabled = '';
            }
        }

        for (let month of endMonths) {
            if (month.Number > endMonth) {
                month.Disabled = 'Disabled';
            } else {
                month.Disabled = '';
            }
        }


    }
</script>

<div class="popup">
    <p class="title">Timeframe</p>
    <div class="selection">
        <ul>
            <li on:click={() => selectToggle('all')}>This Month</li>
            <li on:click={() => selectToggle('none')}>Latest 3 Months</li>
            <li on:click={() => selectToggle('none')}>This Year</li>
            <li on:click={() => selectToggle('none')}>Last Year</li>
            <li on:click={() => selectToggle('none')}>All Dates</li>
        </ul>
    </div>
    <div class="date-selection">
        <ul>
            <li class="label from">From: </li>
            <li>
                <select name="startmonths">
                    {#each startMonths as month}
                        <option value={month.Number} disabled={month.Disabled}>{month.Name}</option>
                    {/each}
                </select>
            </li>
            <li>
                <select name="startYears">
                    {#each Years as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
            </li>
            <li class="label to">To: </li>
            <li>
                <select name="endmonths">
                    {#each endMonths as month}
                        <option value={month.Number} disabled={month.Disabled}>{month.Name}</option>
                    {/each}
                </select>
            </li>
            <li>
                <select name="endYears">
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
    .showpopup {
        opacity: 1;
    }
</style>

<!-- markup (zero or more items) goes here -->