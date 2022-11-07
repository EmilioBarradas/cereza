<script lang="ts">
	import Sun from '../icons/Sun.svelte';
	import { theme, type Theme } from '@/helpers/theme';
	import { browser } from '$app/environment';
	import Icon from './Icon.svelte';

	const script = `

<script>
    const storedTheme = localStorage.getItem("theme");
    const themePreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    const theme = storedTheme || themePreference;

    document.documentElement.classList.toggle('dark', theme === 'dark');
<\/script>

    `;

	const themeHandler = (theme: Theme) =>
		document.documentElement.classList.toggle('dark', theme === 'dark');

	$: browser && themeHandler($theme);
</script>

<svelte:head>
	{@html script}
</svelte:head>

<button on:click={() => theme.toggle()} class="h-6 w-6">
    <Icon icon={Sun} height="h-6" width="w-6" />
</button>

<style>
	:root.light {
		color-scheme: light;
	}

	:root.dark {
		color-scheme: dark;
	}
</style>
