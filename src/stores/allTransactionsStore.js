import { writable } from "svelte/store";

export const allTransactionsStore = writable([]);

export default allTransactionsStore;