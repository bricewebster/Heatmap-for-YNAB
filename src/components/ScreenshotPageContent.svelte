<script>
    export let screenshotPage;
</script>
<div class="content">
    <div class="back-container" on:click="{() => screenshotPage = 0}">
        <span class="material-icons-outlined md-36 style-regular-icon icon">chevron_left</span>
        <p>Back</p>
    </div>
    <p class="title">Screenshots</p>
    <p>The below screenshots are not all encompassing of every option and style but give a general idea of how the heatmap looks when used.</p>
    <p class="image-title">App Overview - Heatmap Theme</p>
    <img class="example" alt="App Overview Heatmap Theme" src="/images/appOverviewHeatmapTheme.PNG">
    <p class="image-title">App Overview - Dark Theme</p>
    <img class="example" alt="App Overview Heatmap Theme" src="/images/appOverviewDarkTheme.PNG">
    <p class="image-title">Monthly Tab</p>
    <img class="example" alt="Monthly Tab" src="/images/monthlyTabExample.PNG">
    <p class="image-title">Days of Month Tab</p>
    <img class="example" alt="Days of Month Tab" src="/images/daysOfMonthTabExample.PNG">
    <p class="image-title">Weeks of Month Tab</p>
    <img class="example" alt="Weeks of Month Tab" src="/images/monthlyTabExample.PNG">
    <p class="image-title">Days of Week Tab</p>
    <img class="example" alt="Days of Week Tab" src="/images/daysOfWeekTabExample.PNG">
    <p class="image-title">Settings Popup</p>
    <img class="example" alt="Settings Popup" src="/images/settingsPopupExample.PNG">
    <p class="image-title">Transaction Popup</p>
    <img class="example" alt="Transaction Popup" src="/images/transactionPopupExample.PNG">
    <p class="image-title">Date Selection Popup</p>
    <img class="example" alt="Date Selection Popup" src="/images/dateSelectionExample.PNG">
</div>
<style>
    .content {
        margin: 30px auto 0 auto;
        width: 1000px;
    }
    .back-container {
        display: flex;
        align-items: center;

        width: 75px;

        cursor: pointer;
    }
    .title {
        color: #FA4E5D;

        font-size: 3em;
        font-weight: bold;
    }
    .image-title {
        text-align: center;
        font-size: 2em;
        font-weight: bold;
    }
    .example {
        margin: 10px auto 50px auto;
        width: 1000px;
        
        border: 1px solid rgb(255,122,0);
        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(255, 122, 0, 0.2);
    }
</style>