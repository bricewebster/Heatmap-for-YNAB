<script>
    export let privacyPage;
</script>
<div class="content">
    <div class="back-container" on:click="{() => privacyPage = 0}">
        <span class="material-icons-outlined md-36 style-regular-icon icon">chevron_left</span>
        <p>Back</p>
    </div>
    <p class="title">Privacy Policy</p>
    <p class="subtitle">What data does Heatmap for YNAB collect and how is the data handled?</p>
    <p class="answers">Heatmap for YNAB collects information from your YNAB account once you provide authorization. Only information from the YNAB budgeting software itself is collected. We have no access to nor do we collect bank credentials or information. None of this data is stored or collected on a server. It is removed from your computer once the browswer is closed. Its sole purpose to populate the report and provide options to filter the results.</p>
    <p class="answers">Below is all of the information collected and its use:</p>
    <ul>
        <li>Budget Settings - Settings such as date and currency layout</li>
        <li>Budgets List - Allows for changing of budgets</li>
        <li>Categories List - Used for filtering report</li>
        <li>Accounts List - Used for filtering report</li>
        <li>Payees List - Used for filtering report</li>
        <li>Transactions List - Transactions for populating the report</li>
    </ul>
    <p></p>
    <p class="subtitle">Third-party services</p>
    <p>Heatmap for YNAB does not communicate with any third-party apps or services. This means data collected from YNAB stays within the report and is not sent anywhere else. No analytic or tracking software is used on the report.</p>
    <p class="subtitle">Changes to Privacy Policy</p>
    <p>This Privacy Policy may change in the future with updates to either YNAB or Heatmap for YNAB and they'll be listed on this page.</p>
    <p class="subtitle">Contact Information</p>
    <p>If you have any questions regarding Heatmap for YNAB's Privacy Policy, feel free to send an email to <a href="mailto:bricewebdev@gmail.com">bricewebdev@gmail.com</a>.</p>
</div>
<style>
    .content {
        margin: 30px auto 0 auto;
        width: 1000px;
    }
    .title {
        color: var(--theme-primary);

        font-size: 3em;
        font-weight: bold;
    }
    .subtitle {
        margin-top: 15px;

        font-size: 1.5em;
    }
    .answers {
        margin-left: 15px;
    }
    ul {
        margin-left: 35px;
    }
    .back-container {
        display: flex;
        align-items: center;

        width: 75px;

        cursor: pointer;
    }
</style>

<!-- markup (zero or more items) goes here -->