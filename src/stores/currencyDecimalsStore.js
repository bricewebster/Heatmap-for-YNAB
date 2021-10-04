import { writable } from 'svelte/store';

export const currencyDecimalsStore = writable(0);

export default currencyDecimalsStore;