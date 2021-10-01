<script>
    import Button from "./Button.svelte";
    import CategorySectionStore from '../stores/categorySectionStore';
	import CategoryListStore from '../stores/categoryListStore';
    import AccountSectionStore from '../stores/accountSectionStore';
	import AccountListStore from '../stores/accountListStore';
    import PayeeListStore from '../stores/payeeListStore';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let categorySections = $CategorySectionStore.map(data => ({...data}));
    let categoryLists = $CategoryListStore.map(data => ({...data}));
    let accountSections = $AccountSectionStore.map(data => ({...data}));
    let accountLists = $AccountListStore.map(data => ({...data}));
    let payeeLists = $PayeeListStore.map(data => ({...data}));

    let filterAmountSelected = 'All';

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
        if (filter.Type === 'Categories') {
            itemSelected = categoryLists.find(item => item.subId === itemID);
        } else if (filter.Type === 'Accounts') {
            itemSelected = accountLists.find(item => item.Id === itemID);
        } else {
            itemSelected = payeeLists.find(item => item.Id === itemID);
        }
        itemSelected.Checked = !itemSelected.Checked;
    }

    const selectToggle = (option) => {

        let optionSelected = option === 'all' ? true : false;

        if (filter.Type === 'Categories') {
            for (let section of categorySections) {
                section.Checked = optionSelected;
            }
            for (let list of categoryLists) {
                list.Checked = optionSelected;
            }
            categorySections = categorySections;
            categoryLists = categoryLists;
        } else if (filter.Type === 'Accounts') {
            for (let section of accountSections) {
                section.Checked = optionSelected;
            }
            for (let list of accountLists) {
                list.Checked = optionSelected;
            }
            accountSections = accountSections;
            accountLists = accountLists;
        } else {
            for (let list of payeeLists) {
                list.Checked = optionSelected;
            }
            payeeLists = payeeLists;
        }
    }

    const saveChanges = () => {
        $CategorySectionStore = categorySections;
        $CategoryListStore = categoryLists;
        $AccountSectionStore = accountSections;
        $AccountListStore = accountLists;
        $PayeeListStore = payeeLists;
        checkSelected();
        filter.Amount = filterAmountSelected;
        dispatch('filterChange', );
        togglePopup();
    }

    const checkSelected = () => {
        let sectionCount = 0;
        let listCount = 0;
        if (filter.Type === 'Categories') {
            for (let section of categorySections) {
                if (section.Checked) {
                    sectionCount++;
                }
            }
            for (let list of categoryLists) {
                if (list.Checked) {
                    listCount++;
                }
            }
            if (sectionCount === 0 & listCount === 0)  {
                filterAmountSelected = 'No';
            } else if (categorySections.length != sectionCount || categoryLists.length != listCount) {
                filterAmountSelected = 'Some'
            } else {
                filterAmountSelected = 'All'
            }
        } else if (filter.Type === 'Accounts') {
            for (let section of accountSections) {
                if (section.Checked) {
                    sectionCount++;
                }
            }
            for (let list of accountLists) {
                if (list.Checked) {
                    listCount++;
                }
            }
            if (sectionCount === 0 & listCount === 0)  {
                filterAmountSelected = 'No';
            } else if (accountSections.length != sectionCount || accountLists.length != listCount) {
                filterAmountSelected = 'Some'
            } else {
                filterAmountSelected = 'All'
            }
        } else {
            for (let list of payeeLists) {
                if (list.Checked) {
                    listCount++;
                }
            }
            if (listCount === 0)  {
                filterAmountSelected = 'No';
            } else if (payeeLists.length != listCount) {
                filterAmountSelected = 'Some'
            } else {
                filterAmountSelected = 'All'
            }
        }
    }
    
</script>

<div class="popup {filter.Type}">
    <p class="title">{filter.Type}</p>
    <div class="selection">
        <ul>
            <li on:click={() => selectToggle('all')}>Select All</li>
            <li on:click={() => selectToggle('none')}>Select None</li>
        </ul>
    </div>
    <div class="list">
            {#if filter.Type === 'Categories'}
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
            {:else if filter.Type === 'Accounts'}
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

        background-color: white;
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

            margin: 3px 0px 0 4px;
            padding: .2em .6em;
            
            background: none;
            border-radius: 1000px;

            font-size: 13.5px;
            color: var(--ynab-light-blue);

            &:hover {
                background-color: var(--ynab-light-green);

                color: white;

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