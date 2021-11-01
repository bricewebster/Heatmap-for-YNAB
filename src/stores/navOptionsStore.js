import { writable } from "svelte/store";

export const navOptionsStore = writable(
    {firstDate: '', startDate: new Date(2019, 0, 1), endDate: new Date(2021, 11, 31), selectedOption: 'income', selectedStyle: 'regular'}
);

export default navOptionsStore;