<script lang="ts">
	import ThemeToggle from '@/components/ui/ThemeToggle.svelte';
	import '../app.postcss';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="sticky top-12 mr-12 h-0 z-10 flex justify-end">
	<ThemeToggle />
</div>

<slot />
