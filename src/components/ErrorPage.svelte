<script>
    export let errorStatus;
    export let loadingLog = [];
</script>
<div class="content">
    <div class="error-status-container">
        <span class="material-icons-outlined md-36 style-regular-icon icon">error</span>
        <p>There was an error loading the page.</p>
        <p>Error: {errorStatus}</p>
        <p>Log: </p>
        {#each loadingLog as log}
            <p>{log}</p>
        {/each}
    </div>
</div>
<style>
   .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: #F1F2F4;
        color: #2E2E30;

        width: 100vw;
        height: 100vh;
   }
   .error-status-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
   }
</style>