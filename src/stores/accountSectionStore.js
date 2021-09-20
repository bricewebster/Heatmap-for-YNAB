import { writable } from "svelte/store";

export const AccountSectionStore = writable(
    {name: 'On Budget Accounts'},
    {name: 'Tracking Accounts'},
    {name: 'Closed Accounts'} 
);

export default AccountSectionStore;