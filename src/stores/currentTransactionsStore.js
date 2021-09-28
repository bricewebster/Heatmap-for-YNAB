import { writable } from "svelte/store";

export const currentTransactionsStore = writable([]);

export default currentTransactionsStore;