<script>
    import Button from "./Button.svelte";

    export let togglePopup = () => {};
</script>
<div class="popup">
    <p class="title">Heatmap Settings</p>
    <div class="option-list">
        <div class="option">
            <p class="option-title">Colors:</p>
            <div class="option-section-container">
                <div class="option-section">
                    <label for="income-colorPicker">Income</label>
                    <input type="color" id="income-colorPicker" value="#0000ff">
                    <label for="income-top-colorPicker">Top 10%</label>
                    <input type="color" id="income-top-colorPicker" value="#0000ff">
                    <label for="income-high-colorPicker">High</label>
                    <input type="color" id="income-high-colorPicker" value="#0000ff">
                    <label for="income-low-colorPicker">Low</label>
                    <input type="color" id="income-low-colorPicker" value="#0000ff">
                    <label for="income-bottom-colorPicker">Bottom 10%</label>
                    <input type="color" id="income-bottom-colorPicker" value="#0000ff">
                </div>
                <div class="option-section">
                    <label for="expense-colorPicker">Expense</label>
                    <input type="color" id="expense-colorPicker" value="#0000ff">
                    <label for="expense-top-colorPicker">Top 10%</label>
                    <input type="color" id="expense-top-colorPicker" value="#0000ff">
                    <label for="expense-high-colorPicker">High</label>
                    <input type="color" id="expense-high-colorPicker" value="#0000ff">
                    <label for="expense-low-colorPicker">Low</label>
                    <input type="color" id="expense-low-colorPicker" value="#0000ff">
                    <label for="expense-bottom-colorPicker">Bottom 10%</label>
                    <input type="color" id="expense-bottom-colorPicker" value="#0000ff">
                </div>
            </div>
        </div>
    </div>
    <div class="buttons">
        <Button type="secondary" on:click={togglePopup}>Cancel</Button>
        <Button on:click={() => saveChanges()}>Done</Button>
    </div>
</div>
<style lang="scss">
    .popup {
        position: absolute;
        right: 700px;

        margin-top: 70px;

        width:  450px;
        height: 350px;

        background-color: white;
        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);

        opacity: 1;
    }
    .title {
        margin: 15px 15px 5px 15px;

        font-size: 1em;
        font-weight: 700;
        color: #383e41;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }
    .option-list {
        margin: 15px 0 0 15px;
        width: 400pxx;
        height: 200px;

        font-size: .9rem;
    }
    .option-title {
        font-size: 1.25em;
    }
    .option-section-container {
        display: flex;
        flex-direction: row;

        height: 100px;
    }
    .option-section input {
        display: block;
    }
    .section {
        font-weight: bold;

        font-size: .9em;

        list-style: none;
    }
    .section-item {
        margin-left: 20px;
        
        font-size: .8em;

        list-style: none;
    }
    .buttons {
        float: right;

        margin: 15px 10px 0 0;
        width: 140px;
    }

    .Categories {
        top: 95px;
        right: 455px;
    }
    .Accounts {
        top: 95px;
        right: 275px;
    }
    .Payees {
        top: 95px;
        right: 105px;
    }
    .Accounts::after, .Categories::after, .Payees::after {
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