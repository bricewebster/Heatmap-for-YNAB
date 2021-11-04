import { writable } from "svelte/store";

export const navOptionsStore = writable(
    {firstDate: new Date(2019, 10, 1), startDate: new Date(new Date().getFullYear(), 0), endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), selectedOption: 'income', selectedStyle: 'regular'}
);

export default navOptionsStore;