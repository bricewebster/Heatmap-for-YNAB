import { writable } from "svelte/store";

export const BudgetInfoStore = writable({
    List: [],
    Selected: ''
});

export default BudgetInfoStore;