<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedYear;
    export let selectedOption;
    export let selectedStyle;
    export let list = [];

    export let changeSelectedOption = () => {};
    export let changeSelectedStyle = () => {};

    /**
     * Toggles the selected year based on button clicked and calls the update to transactions.
     * @param {String} buttonSelected name of button selected
     */
     function toggleSelectedYear (buttonSelected) {
        selectedYear = buttonSelected === 'previous' ? selectedYear = selectedYear - 1 : selectedYear = selectedYear + 1;
        dispatch('yearChange', );
    }
</script>

<div class="cal-options">
    <button on:click={() => changeSelectedOption('income')}><span class="material-icons-outlined md-36 income-icon" class:selected={selectedOption === 'income'} class:nonselected-icon={selectedOption != 'income'}>savings</span></button>
    <button on:click={() => changeSelectedOption('expense')}><span class="material-icons-outlined md-36 expense-icon" class:selected={selectedOption === 'expense'} class:nonselected-icon={selectedOption != 'expense'}>paid</span></button>
    <button on:click={() => changeSelectedOption('net')}><span class="material-icons-outlined md-36 net-icon" class:selected={selectedOption === 'net'} class:nonselected-icon={selectedOption != 'net'}>request_quote</span></button>
</div>
<div class="year-selector">
    <button on:click={() => toggleSelectedYear('previous')}><span class="material-icons-outlined md-24">chevron_left</span></button>
    <p>{selectedYear}</p>
    <button on:click={() => toggleSelectedYear('next')}><span class="material-icons-outlined md-24">chevron_right</span></button>
</div>
<div class="cal-styles">
    <button on:click={() => changeSelectedStyle('regular', list)}><span class="material-icons-outlined md-36 style-regular-icon" class:selected={selectedStyle === 'regular'} class:nonselected-icon={selectedStyle != 'regular'}>local_fire_department</span></button>
    <button on:click={() => changeSelectedStyle('group', list)}><span class="material-icons-outlined md-36 style-group-icon" class:selected={selectedStyle === 'group'} class:nonselected-icon={selectedStyle != 'group'}>whatshot</span></button>
    <button on:click={() => changeSelectedStyle('simple', list)}><span class="material-icons-outlined md-36 style-simple-icon" class:selected={selectedStyle === 'simple'} class:nonselected-icon={selectedStyle != 'simple'}>fireplace</span></button>
</div>

<style lang="scss">
    .cal-options {
        float: left;
        margin-left: 25px;
        width: 213px;

        & button {
            margin-right: 20px;
            background: none;
            border: none;

            cursor: pointer;
        }
    }
    .income-icon.selected, .income-icon:hover {
        color: #00a567;
    }
    .expense-icon.selected, .expense-icon:hover {
        color: #de5d83;
    }
    .net-icon.selected, .net-icon:hover {
        color: #ffb347;
    }
    .nonselected-icon {
        color:  rgba(187, 167, 167, 0.842);
    }
    .year-selector {
        float: left;

        margin-left: 118px;
        width: 245px;
    }
    .year-selector p{
        display: inline-block;

        margin: 0 5px;

        font-size: 2.2em;
    }
    .year-selector button{
        background: none;
        border: none;
     
        cursor: pointer;
    }
    .cal-styles {
        float: right;

        width: 223px;

        & button {
            margin-left: 20px;
            background: none;
            border: none;

            cursor: pointer;
        }
    }
    .style-regular-icon.selected, .style-regular-icon:hover {
        color: #B31313;
    }
    .style-group-icon.selected, .style-group-icon:hover {
        color: #FF9000;
    }
    .style-simple-icon.selected, .style-simple-icon:hover {
        color: #FEDE17;
    }
</style>