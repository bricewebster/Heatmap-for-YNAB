<script>
    import Button from "./Button.svelte";

    export let togglePopup = () => {};
    export let selectedDay;
    export let selectedDayList;
    export let selectedAmount;

    console.log(selectedDayList)
</script>

<div class="popup">
    <div class="content">
        <div class="title-container">
            <p class="title"><span class="material-icons-outlined md-24">event_note</span>{selectedDay}</p>
            <p class="amount">{selectedAmount}</p>
        </div>
        <div class="trans-list">
            <table class="column-header">
                <tr>
                    <th>Category</th>
                    <th>Account</th>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>Memo</th>
                    <th>Amount</th>
                </tr>
            </table>
            <table class="list">
                {#each selectedDayList as day}
                    <tr>
                        <th title="{day.categoryName}">{day.categoryName}</th>
                        <th title="{day.accountName}">{day.accountName}</th>
                        <th title="{day.dateFormatted}">{day.dateFormatted}</th>
                        <th title="{day.payeeName}">{day.payeeName}</th>
                        <th title="{day.Memo}">{day.Memo}</th>
                        <th title="{day.amountFormatted}">{day.amountFormatted}</th>
                    </tr>
                {/each}
            </table>
        </div>
        <div class="button">
            <Button on:click={togglePopup}>Close</Button>
        </div>
    </div>
</div>

<style lang="scss">
   .popup {
        position: relative;
   
        margin: 520px auto 0 auto;

        width:  600px;
        height: 350px;

        background-color: white;
        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);

        opacity: 1;
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
    .content {
        padding: .765em .765em 0;
    }
    .title-container {
        display: flex;

        color: #636366;
        font-weight: 400;
        font-size: 1.2em;
    }
    .title {
        display: flex;
        align-items: center;
    }
    span {
        padding-right: 5px;
    }
    .amount {
        margin-top: 5px;
        margin-left: auto;
    }
    .trans-list {
        margin-top: 5px;
        width: 100%;
    }
    tr {
        width: 100%;
    }
    th {
        width: 16%;
        
        display: inline-block;
        padding: .25em 0;

        font-size: .75em;
        letter-spacing: .05em;
        font-weight: 100;
        color: #383e41;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    th:last-child {
            padding-right: .5rem;

            border-right: none;

            text-align: right;
    }
    .column-header {
        display: flex;

        border-top: 1px solid #d1d1d6;
        border-bottom: 1px solid #d1d1d6;

        overflow-y: scroll;
            
        & th {
            border-right: 1px solid #d1d1d6;

            text-transform: uppercase;
        }
    }
    .list {
        display: block;

        height: 220px;
        border-bottom: 1px solid #d1d1d6;

        overflow-y: scroll;
        & tr {
            display: block;
            
            border-bottom: 1px solid #d1d1d6;
        }

        & tr:last-child {
            border: none;
        }

        & th {
            cursor: pointer;
        }
    }
    .button {
        float: right;

        margin-top: 16px;
    }
</style>

<!-- markup (zero or more items) goes here -->