import { writable } from "svelte/store";

export const AccountSectionStore = writable([
    {Name: 'On Budget Accounts', Checked: true},
    {Name: 'Tracking Accounts', Checked: true},
    {Name: 'Closed Accounts', Checked: true}]
);

export default AccountSectionStore;