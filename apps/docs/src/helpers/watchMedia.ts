import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const watchMedia = (query: string) => {
	const store = writable(false);

	if (browser) {
		const media = window.matchMedia(query);
		const changeHandler = (evt: MediaQueryListEvent) => store.set(evt.matches);

		store.set(media.matches);
		media.addEventListener('change', changeHandler);
	}

	return store;
};
