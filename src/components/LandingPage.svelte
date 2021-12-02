<script>
    import Button from "./Button.svelte";
</script>
<div class="content">
    <div class="title-container">
        <img class="logo" alt="HeatmapIcon" src="/images/HeatmapIcon2.png">
        <p class="title">Heatmap for YNAB</p>
    </div>
    <p class="explain">A report that displays your YNAB transactions in a heatmap style to get a bird's eye view of your budget.</p>
    <img class="example" alt="HeatmapExample" src="/images/heatmapExample.PNG">
    <div class="main-buttons">
        <a href="https://www.youneedabudget.com"><img  alt="WorksWithYNAB" src="/images/works_with_ynab.svg"></a>
        <Button type="tertiary">Authorize Report</Button>
    </div>
    <div class="section">
        <p class="section-title">Features</p>
    </div>
</div>
<style>
    .content {
        width: 100%;
        height: 100vh;

        background-color: #F1F2F4;

        overflow-y: auto;
    }
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

        margin: 50px auto 0 auto;
        width: 600px;
    }
    .main-buttons img{
        width: 175px;
    }
    .section {
        margin: 80px auto 0 auto;
        width: 800px;
    }
    .section-title {
        display: inline-block;
        position: relative;
 
        margin: 0 auto;

        font-size: 2.25em;
        font-weight: bold;
        color: #2E2E30;
    }
    .section-title::after {
        content: '';
        position: absolute;

        bottom: 0px;
        left: 0px;
        width: 75%;
        height: 5px;

        background: var(--theme-secondary);

        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
</style>

<!-- markup (zero or more items) goes here -->