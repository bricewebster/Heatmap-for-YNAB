<script>
    export let privacyPage;
</script>
<div class="content">
    <div class="back-container" on:click="{() => privacyPage = 0}">
        <span class="material-icons-outlined md-36 style-regular-icon icon">chevron_left</span>
        <p>Back</p>
    </div>
    <p class="title">Privacy Policy</p>
    <p class="subtitle">What data does Heatmap for YNAB collect?</p>
    <p></p>
    <p class="subtitle">How does Heatmap for YNAB handle your data?</p>
    <p></p>
    <p class="subtitle">Third-party services</p>
    <p></p>
    <p class="subtitle">Changes to Privacy Policy</p>
    <p></p>
    <p class="subtitle">Contact Information</p>
    <p></p>
</div>
<style>
    .content {
        margin: 30px auto 0 auto;
        width: 1000px;
    }
    .title {
        font-size: 3em;
        font-weight: bold;
        color: var(--theme-primary);
    }
    .back-container {
        display: flex;
        align-items: center;

        width: 75px;

        cursor: pointer;
    }
</style>

<!-- markup (zero or more items) goes here -->