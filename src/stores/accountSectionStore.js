import { readable } from "svelte/store";

export const AccountSectionStore = readable([
    {Name: 'On Budget Accounts'},
    {Name: 'Tracking Accounts'},
    {Name: 'Closed Accounts'}]
);

export default AccountSectionStore;