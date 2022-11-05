import { derived, get } from 'svelte/store';
import { persistable } from './persistable';
import { watchMedia } from './watchMedia';

export type Theme = 'light' | 'dark';

const themePreference = derived(watchMedia('(prefers-color-scheme: dark)'), (dark) =>
	dark ? 'dark' : 'light'
);

const storedTheme = persistable<'light' | 'dark'>('theme');

export const theme = {
	...derived(
		[storedTheme, themePreference],
		([storedTheme, themePreference]) => storedTheme ?? themePreference
	),
	toggle() {
		storedTheme.set(get(this) === 'light' ? 'dark' : 'light');
	}
};
