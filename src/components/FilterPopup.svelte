<script>
    import Button from "./Button.svelte";
    import CategorySectionStore from '../stores/categorySectionStore';
	import CategoryListStore from '../stores/categoryListStore';
    import AccountSectionStore from '../stores/accountSectionStore';
	import AccountListStore from '../stores/accountListStore';
    import PayeeListStore from '../stores/payeeListStore';

    let categorySections = $CategorySectionStore.map(data => ({...data}));
    let categoryLists = $CategoryListStore.map(data => ({...data}));
    let accountSections = $AccountSectionStore.map(data => ({...data}));
    let accountLists = $AccountListStore.map(data => ({...data}));
    let payeeLists = $PayeeListStore.map(data => ({...data}));

    export let togglePopup = () => {};
    export let filter;

    const toggleCategoryGroup = (groupID) => {

        let sectionSelected = categorySections.find(section => section.Id === groupID);
        sectionSelected.Checked = !sectionSelected.Checked;

        for (let list of categoryLists) {
            if (list.Id === groupID) {
                list.Checked = !list.Checked;
                categoryLists = categoryLists;
            }
        }
    }

    const toggleAccountGroup = (groupName) => {

        let sectionSelected = accountSections.find(section => section.Name === groupName);
        sectionSelected.Checked = !sectionSelected.Checked;

        for (let list of accountLists) {
            if (list.Type === groupName) {
                list.Checked = !list.Checked;
                accountLists = accountLists;
            }
        }
    }

    const toggleListItem = (itemID) => {
        let itemSelected;
        if (filter === 'Categories') {
            itemSelected = categoryLists.find(item => item.subId === itemID);
        } else if (filter === 'Accounts') {
            itemSelected = accountLists.find(item => item.Id === itemID);
        } else {
            itemSelected = payeeLists.find(item => item.Id === itemID);
        }
        itemSelected.Checked = !itemSelected.Checked;
    }

    const saveChanges = () => {
        $CategorySectionStore = categorySections;
        $CategoryListStore = categoryLists;
        $AccountSectionStore = accountSections;
        $AccountListStore = accountLists;
        $PayeeListStore = payeeLists;
        togglePopup();
    }
    
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
                {#each categorySections as catSection}
                    <li class="section">
                        <input type=checkbox value={catSection.Name} checked={catSection.Checked} on:click={() => toggleCategoryGroup(catSection.Id)}>{catSection.Name}
                    </li>
                    {#each categoryLists as catList}
                        {#if catList.Id === catSection.Id}
                            <li class="section-item"><input type=checkbox value={catList.subName} checked={catList.Checked} on:click={() => toggleListItem(catList.subId)}>{catList.subName}</li>
                        {/if}
                    {/each}
                {/each}
                </ul>
            {:else if filter === 'Accounts'}
                <ul>
                {#each accountSections as accountSection}
                    <li class="section"><input type=checkbox value={accountSection.Name} checked={accountSection.Checked} on:click={() => toggleAccountGroup(accountSection.Name)}>{accountSection.Name}</li>
                    {#each accountLists as accountList}
                         {#if accountList.Type === accountSection.Name}
                            <li class="section-item"><input type=checkbox value={accountList.Name} checked={accountList.Checked} on:click={() => toggleListItem(accountList.Id)}>{accountList.Name}</li>
                         {/if}
                    {/each}
                {/each}
                </ul>
            {:else}
                <ul>
                {#each payeeLists as payeeList}
                    <li class="section-item"><input type=checkbox value={payeeList.Name} checked={payeeList.Checked} on:click={() => toggleListItem(payeeList.Id)}>{payeeList.Name}</li>
                {/each}
                </ul>
            {/if}
    </div>
    <div class="buttons">
        <Button type="secondary" on:click={togglePopup}>Cancel</Button>
        <Button on:click={() => saveChanges()}>Done</Button>
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