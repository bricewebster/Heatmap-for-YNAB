<script>
    import LandingPageContent from "./LandingPageContent.svelte";
    import PrivacyPageContent from "./PrivacyPageContent.svelte";
    import ScreenshotPageContent from "./ScreenshotPageContent.svelte";

    let privacyPage = 0;
    let screenshotPage = 0;
    let currentYear = new Date().getFullYear();
</script>
<div class="content">
    {#if privacyPage}
        <PrivacyPageContent bind:privacyPage = {privacyPage}/>
    {:else if screenshotPage}
        <ScreenshotPageContent bind:screenshotPage = {screenshotPage}/>
    {:else}
        <LandingPageContent bind:screenshotPage = {screenshotPage}/>
    {/if}
    <div class="footer">
        <div class="copyright-section">
            <small>&copy; {currentYear} <a href="mailto:bricewebdev@gmail.com">Brice Webster</a></small>
        </div>
        <div class="legal">
            <small>Heatmap for YNAB is an unofficial report for YNAB</small>
        </div>
        <div class="links">
            <small class="privacy" on:click="{() => privacyPage = 1}">Privacy Policy</small>
            <small>Contact</small>
        </div>
    </div>
</div>
<style>
    .content {
        width: 100%;
        height: 100vh;

        background-color: #F1F2F4;

        overflow-y: auto;
    }
    .footer {
        display: flex;
        justify-content: space-between;

        margin: 85px auto 10px auto;
        width: 1000px;
    }
    .copyright-section a {
        color: #FF7A00;

        text-decoration: none;
    }
    .links small {
        color: #FF7A00;

        font-weight: bold;
        
        cursor: pointer;
    }
    .links .privacy {
        padding-right: 5px;

        border-right: 2px solid #FF7A00;
    }
 
</style>