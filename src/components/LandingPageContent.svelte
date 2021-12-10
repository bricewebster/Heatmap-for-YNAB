<script>
    import Button from "./Button.svelte";

    let url;
    let token = localStorage.getItem("new");
    let authButtonText;
    //If the refresh token isn't present it'll authenticate with YNAB, otherwise it uses the refresh token to get an auth code.
    if (token === "undefined") {
        authButtonText = 'Authorize Heatmap';
        url = 'https://heatmap-for-ynab.herokuapp.com/oauth/redirect/';
    } else {
        authButtonText = 'Open Heatmap';
        url = `https://heatmap-for-ynab.herokuapp.com/oauth/token?code=${token}&refresh=1`;
    }
</script>
<div class="title-container">
    <img class="logo" alt="HeatmapIcon" src="/images/HeatmapIcon2.png">
    <p class="title">Heatmap for YNAB</p>
</div>
<p class="explain">A report that displays your YNAB transactions in a heatmap style to get a bird's eye view of your budget.</p>
<img class="example" alt="HeatmapExample" src="/images/heatmapExample.PNG">
<div class="main-buttons">
    <a href="https://www.youneedabudget.com"><img  alt="WorksWithYNAB" src="/images/works_with_ynab.svg"></a>
    <Button type="tertiary" on:click={() => window.location.href = `${url}`}>{authButtonText}</Button>
</div>
<div class="section">
    <div class="section-title-container feat">
        <p class="section-title">Features</p>
    </div>
    <ul class="main-list">
        <div class="list-container">
        <li>Options</li>
        <ul class="sub-list">
            <li>Income - Transactions greater or equal to 0.</li>
            <li>Expense - Transactions less than 0.</li>
            <li>Net - Difference between income and expense transactions.</li>
        </ul>
        </div>
        <div class="list-container">
        <li>Heatmap styles</li>
        <ul class="sub-list">
            <li>Sequential - A gradual change from an option color at high end to darker saturated option color at the low end.</li>
            <li>Grouping - Group of 4 colors instead of gradual change of 1 color.</li>
            <li>Simple - Just a simple 1 color view with no changes.</li>
        </ul>
        </div>
        <div class="list-container">
        <li>Calendar Views</li>
        <ul class="sub-list">
            <li>Yearly - All 365/366 days of the year view. Seen from above screenshot.</li>
            <li>Monthly - Each of the 12 months of the year. (Ex. Aug, Sept, Oct)</li>
            <li>Days of Month - View of each day of the month. (Ex. 13th, 14th, 15th)</li>
            <li>Weeks of Month - Similar to days of month but by weeks. (Ex. 2nd Week(8th-14th))</li>
            <li>Days of Week - 7 days of the week. (Ex. Sun, Mon, Tue)</li>
        </ul>
        </div>
        <div class="list-container">
        <li>Similar YNAB functions</li>
        <ul class="sub-list">
            <li>Transactions List - Clicking on sections will bring up all the transaction for that section with the addition of sorting.</li>
            <li>Filters - Ability to limit transactions shown by Category, Accounts and the addition of Payees.</li>
            <li>Date Ranges - Look at transactions within a given date range.</li>
        </ul>
        </div>
    </ul>
</div>
<div class="section">
    <div class="section-title-container custom">
        <p class="section-title">Customization</p>
    </div>
    <ul class="main-list">
        <div class="list-container">
        <li>Color-blind Accessibility</li>
        <ul class="sub-list">
            <li>Options - Able to change income and expense colors</li>
            <li>Groupings - Change the 4 groups colors for income and expense</li>
        </ul>
        </div>
        <div class="list-container">
        <li>Themes</li>
        <ul class="sub-list">
            <li>Don't like the theme or want to change it up? There are the 3 YNAB themes along with the main heatmap one.</li>
        </ul>
        </div>
    </ul>
</div>
<style>
    .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        
        padding-top: 50px;
    }
    .logo {
        width: 100px;
    }
    .title {
        padding-left: 5px;

        font-size: 3em;
        color: var(--theme-primary);
        font-weight: bold;
    }
    .explain {
        margin: 50px auto 0 auto;

        width: 600px;

        font-size: 18px;
        color: #2E2E30;
        text-align: center;
    }
    .example {
        margin: 50px auto 0 auto;
        width: 1000px;
        
        border: 1px solid rgb(255,122,0);
        border-radius: 5px;

        box-shadow: 0 16px 64px rgba(255, 122, 0, 0.2);
    }
    .main-buttons {
        display: flex;
        justify-content: space-between;

        margin: 50px auto 80px auto;
        width: 600px;
    }
    .main-buttons img{
        width: 175px;
    }
    .section {
        margin: 10px auto 0 auto;
        width: 1000px;
    }
    .section-title-container {
        margin: 0 auto;
    }
    .section-title-container.feat {
        width: 150px;
    }
    .section-title-container.custom {
        width: 250px;
    }
    .section-title {
        display: inline-block;
        position: relative;
 
        margin: 0 auto;

        font-size: 2.25em;
        font-weight: bold;
        color: #2E2E30;
    }
    .section-title::before {
        content: '';
        position: absolute;

        bottom: 0px;
        left: 20%;
        width: 35%;
        height: 5px;

        background: var(--theme-secondary);


    }
    .section-title::after {
        content: '';
        position: absolute;

        bottom: 0px;
        left: 50%;
        width: 35%;
        height: 5px;

        background: var(--theme-secondary);

        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .list-container {
        display: inline-block;

        padding: 15px 0 0 15px;
        width: 49%;

        vertical-align: top;
    }
    .main-list, .sub-list {
        list-style: none;
    }
    .list-container > li{
        font-size: 25px;
        font-style: italic;
    }
    .sub-list {
        margin: 0 0 15px 25px;
    }
    .sub-list > li {
        margin-bottom: 5px;

        font-size: 20px;
    }
    .sub-list > li::before {
        display: inline-block; 
        content: "\2022";

        margin-left: -1em;
        width: 1em;

        font-weight: bold;
    }
    .sub-list > li::before {
        color: var(--theme-secondary);
    }
</style>