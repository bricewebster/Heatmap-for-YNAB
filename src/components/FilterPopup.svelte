<script>
    import Button from "./Button.svelte";
    import CategorySectionStore from '../stores/categorySectionStore';
	import CategoryListStore from '../stores/categoryListStore';
    import AccountSectionStore from '../stores/accountSectionStore';
	import AccountListStore from '../stores/accountListStore';
    import PayeeListStore from '../stores/payeeListStore';

    export let togglePopup = () => {};
    export let filter;
    
</script>

<div class="popup {filter}">
    <p class="title">{filter}</p>
    <div class="selection">
        <ul>
            <li>Select All</li>
            <li>Select None</li>
        </ul>
    </div>
    <div class="list">
            {#if filter === 'Categories'}
                <ul>
                {#each $CategorySectionStore as catSection}
                    <li class="section">{catSection.Name}</li>
                    {#each $CategoryListStore as catList}
                        {#if catList.Id === catSection.Id}
                            <li class="section-item">{catList.subName}</li>
                        {/if}
                    {/each}
                {/each}
                </ul>
            {:else if filter === 'Accounts'}
                <ul>
                {#each $AccountSectionStore as accountSection}
                    <li class="section">{accountSection.Name}</li>
                    {#each $AccountListStore as accountList}
                         {#if accountList.Type === accountSection.Name}
                             <li class="section-item">{accountList.Name}</li>
                         {/if}
                    {/each}
                {/each}
                </ul>
            {:else}
                <ul>
                {#each $PayeeListStore as payeeList}
                    <li class="section-item">{payeeList.Name}</li>
                {/each}
                </ul>
            {/if}
    </div>
    <div class="buttons">
        <Button type="secondary" on:click={togglePopup}>Cancel</Button>
        <Button>Done</Button>
    </div>
</div>

<style lang="scss">
    .popup {
        position: absolute;
        right: 200px;

        margin-top: 30px;

        width:  250px;
        height: 350px;

        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);

        opacity: 1;
    }
    .title {
        margin: 15px 0 5px 15px;

        font-size: 1em;
        font-weight: 700;
        color: #383e41;
    }

    .selection {
        margin: 5px 15px 0 15px;
        height: 35px;

        border-top: 1px solid rgba(0, 0, 0, 0.15);
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        & li {
            display: inline-block;
            margin: 5px 5px 0 10px;
            background: none;

            font-size: 13.5px;
            color: var(--ynab-light-blue);

            &:hover {
                color: var(--ynab-dark-green);

                cursor: pointer;
            }
        }
    }
    .list {
        margin: 15px 0 0 15px;
        width: 220px;
        height: 200px;

        font-size: .9rem;

        overflow-y: scroll;
    }
    .section {
        font-weight: bold;
    }
    .section-item {
        margin-left: 20px;
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