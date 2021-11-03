import { writable } from "svelte/store";

export const navOptionsStore = writable(
    {firstDate: new Date(2019, 10, 1), startDate: new Date(2019, 10, 1), endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date(new Date().getFullYear(),  new Date().getMonth() + 1, 0).getDate()), selectedOption: 'income', selectedStyle: 'regular'}
);

export default navOptionsStore;