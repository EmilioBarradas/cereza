import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export const persistable = <T extends string>(key: string): Writable<T | null> => {
	if (!browser) {
		return writable(null);
	}

	const value = localStorage.getItem(key) as T | null;
	const store = writable(value);

	store.subscribe((newValue) => {
		if (newValue === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, newValue);
		}
	});

	window.addEventListener('storage', ({ key: changedKey, oldValue, newValue }) => {
		if (changedKey !== key || oldValue === newValue) return;

		store.set(newValue as T);
	});

	return store;
};
