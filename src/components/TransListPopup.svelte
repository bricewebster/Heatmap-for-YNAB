<script>
    import Button from "./Button.svelte";
    import { scale } from 'svelte/transition';

    export let togglePopup = () => {};
    export let selectedSquare;
    export let selectedList;
    export let selectedAmount;
    export let popupType;

    //Direction of true is descending and false is ascending.
    let sectionSorted = {Section: 'Date', Direction: true};
    
    /**
     * Changes which section is being sorted and the directon of the sort.
     * @param {String} sectionClicked section clicked
     */
    function changeSortedSection (sectionClicked) {
        if (sectionClicked === sectionSorted.Section) {
            sectionSorted.Direction = !sectionSorted.Direction;
        } else {
            sectionSorted = {Section: sectionClicked, Direction: true};
        }
        if (sectionSorted.Section === 'Category') {
            if (sectionSorted.Direction) {
                selectedList.sort((a,b) => (scrubCharacters(a.categoryName) > scrubCharacters(b.categoryName)) ? 1 : -1);
            } else {
                selectedList.sort((a,b) => (scrubCharacters(a.categoryName) < scrubCharacters(b.categoryName)) ? 1 : -1);
            }
        } else if (sectionSorted.Section === 'Account') {
            if (sectionSorted.Direction) {
                selectedList.sort((a,b) => (scrubCharacters(a.accountName) > scrubCharacters(b.accountName)) ? 1 : -1);
            } else {
                selectedList.sort((a,b) => (scrubCharacters(a.accountName) < scrubCharacters(b.accountName)) ? 1 : -1);
            }
        } else if (sectionSorted.Section === 'Date') {
            if (sectionSorted.Direction) {
                selectedList.sort((a,b) => (a.dateFormatted > b.dateFormatted) ? 1 : -1);
            } else {
                selectedList.sort((a,b) => (a.dateFormatted < b.dateFormatted) ? 1 : -1);
            }
        } else if (sectionSorted.Section === 'Payee') {
            if (sectionSorted.Direction) {
                selectedList.sort((a,b) => (scrubCharacters(a.payeeName) > scrubCharacters(b.payeeName)) ? 1 : -1);
            } else {
                selectedList.sort((a,b) => (scrubCharacters(a.payeeName) < scrubCharacters(b.payeeName)) ? 1 : -1);
            }
        } else if (sectionSorted.Section === 'Memo') {
            if (sectionSorted.Direction) {
                selectedList.sort((a,b) => (scrubCharacters(a.Memo) > scrubCharacters(b.Memo)) ? 1 : -1);
            } else {
                selectedList.sort((a,b) => (scrubCharacters(a.Memo) < scrubCharacters(b.Memo)) ? 1 : -1);
            }
        } else if (sectionSorted.Section === 'Amount') {
            if (sectionSorted.Direction) {
                selectedList.sort((a,b) => (a.Amount > b.Amount) ? 1 : -1);
            } else {
                selectedList.sort((a,b) => (a.Amount < b.Amount) ? 1 : -1);
            }
        }
        selectedList = selectedList;
    }

    /**
     * Scrubs the characters to only include numbers, letters and lowercase for easier sorting.
     * @param {String} string string to be scrubbed
     * @return {String} scrubbed string
     */
    function scrubCharacters (string) {
        string = string.replace(/[^0-9a-z]/gi, '');
        string = string.toLowerCase().trim();
        return string;
    }
</script>

<div class="popup {popupType}" in:scale="{{duration: 150}}">
    <div class="content">
        <div class="title-container">
            <p class="title"><span class="material-icons-outlined md-24">event_note</span>{selectedSquare}</p>
            <p class="amount">{selectedAmount}</p>
        </div>
        <div class="trans-list">
            <table class="column-header">
                <tr>
                    <th>
                        <div class="label-container" on:click={() => changeSortedSection('Category')}>
                            <p class="label">Category</p>
                            {#if sectionSorted.Section === 'Category'}
                                {#if sectionSorted.Direction}
                                    <span class="material-icons-outlined md-24">arrow_drop_up</span>
                                {:else}
                                    <span class="material-icons-outlined md-24">arrow_drop_down</span>
                                {/if}
                            {/if}
                        </div>
                    </th>
                    <th>
                        <div class="label-container" on:click={() => changeSortedSection('Account')}>
                            <p class="label">Account</p>
                            {#if sectionSorted.Section === 'Account'}
                                {#if sectionSorted.Direction}
                                    <span class="material-icons-outlined md-24">arrow_drop_up</span>
                                {:else}
                                    <span class="material-icons-outlined md-24">arrow_drop_down</span>
                                {/if}
                            {/if}
                        </div>
                    </th>
                    <th>
                        <div class="label-container" on:click={() => changeSortedSection('Date')}>
                            <p class="label">Date</p>
                            {#if sectionSorted.Section === 'Date'}
                                {#if sectionSorted.Direction}
                                    <span class="material-icons-outlined md-24">arrow_drop_up</span>
                                {:else}
                                    <span class="material-icons-outlined md-24">arrow_drop_down</span>
                                {/if}
                            {/if}
                        </div>
                    </th>
                    <th>
                        <div class="label-container" on:click={() => changeSortedSection('Payee')}>
                            <p class="label">Payee</p>
                            {#if sectionSorted.Section === 'Payee'}
                                {#if sectionSorted.Direction}
                                    <span class="material-icons-outlined md-24">arrow_drop_up</span>
                                {:else}
                                    <span class="material-icons-outlined md-24">arrow_drop_down</span>
                                {/if}
                            {/if}
                        </div>
                    </th>
                    <th>
                        <div class="label-container" on:click={() => changeSortedSection('Memo')}>
                            <p class="label">Memo</p>
                            {#if sectionSorted.Section === 'Memo'}
                                {#if sectionSorted.Direction}
                                    <span class="material-icons-outlined md-24">arrow_drop_up</span>
                                {:else}
                                    <span class="material-icons-outlined md-24">arrow_drop_down</span>
                                {/if}
                            {/if}
                        </div>
                    </th>
                    <th>
                        <div class="label-container" on:click={() => changeSortedSection('Amount')}>
                            <p class="label">Amount</p>
                            {#if sectionSorted.Section === 'Amount'}
                                {#if sectionSorted.Direction}
                                    <span class="material-icons-outlined md-24">arrow_drop_up</span>
                                {:else}
                                    <span class="material-icons-outlined md-24">arrow_drop_down</span>
                                {/if}
                            {/if}
                        </div>
                    </th>
                </tr>
            </table>
            <table class="list">
                {#each selectedList as day}
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

        background-color: var(--theme-popup);
        border-radius: 5px;
        box-shadow: 0 5px 64px rgba(0, 0, 0, 0.2);

        opacity: 1;
    }
    .popup.yearly {
        right: 60px;

        margin: 520px auto 0 auto;

        @media screen and (max-width: 1690px) {
            margin-top: 350px;
        }
        @media screen and (max-width: 1366px) {
            margin-top: 230px;
        }
    }
    .popup.daysofmonth {
        right: 75px;

        margin: 540px auto 0 auto;

        @media screen and (max-width: 1690px) {
            margin-top: 350px;
        }
        @media screen and (max-width: 1366px) {
            margin-top: 230px;
        }
    }
    .popup.monthly {
        right: 65px;

        margin: 380px auto 0 auto;

        @media screen and (max-width: 1366px) {
            margin-top: 250px;
        }
    }
    .popup.weeksofmonth {
        right: 20px;

        margin: 340px auto 0 auto;

        @media screen and (max-width: 1366px) {
            margin-top: 230px;
        }
    }
    .popup.daily {
        right: 70px;

        margin: 310px auto 0 auto;

        @media screen and (max-width: 1366px) {
            margin-top: 255px;
        }
    }
    .popup::after {
        position: absolute;
        bottom: 100%;
        left: 50%;

        margin-left: -5px;
        content: " ";

        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent var(--theme-popup) transparent;
    }
    .popup.yearly::after, .popup.dayofmonth::after {
        @media screen and (max-width: 1690px) {
           display: none;
        }
    }
    .popup.monthly::after, .popup.weeksofmonth::after, .popup.daily::after {
        @media screen and (max-width: 1366px) {
            display: none;
        }
    }
    .content {
        padding: .765em .765em 0;
    }
    .title-container {
        display: flex;

        color: var(--theme-tertiarytext);

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
        display: inline-block;

        padding: .25em 0;
        width: 16%;

        color: var(--theme-secondarytext);

        font-size: .75em;
        letter-spacing: .05em;
        font-weight: 100;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;

        overflow: hidden;
    }
    .label-container {
        display: flex;
        flex-direction: row;
        align-items: center;

        cursor: pointer;
    }
    .label {
        align-content: flex-start;
    }
    th:last-child {
        padding-right: .5rem;

        border-right: none;

        text-align: right;
    }
    .column-header {
        display: flex;

        border-top: 1px solid var(--theme-border);
        border-bottom: 1px solid var(--theme-border);

        overflow-y: scroll;
            
        & th {
            border-right: 1px solid var(--theme-border);

            text-transform: uppercase;
        }
    }
    .list {
        display: block;

        height: 220px;

        border-bottom: 1px solid var(--theme-border);

        overflow-y: scroll;
        
        & tr {
            display: block;
            
            border-bottom: 1px solid var(--theme-border);
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