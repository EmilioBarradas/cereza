<script lang="ts">
	import ThemeToggle from '@/components/ui/ThemeToggle.svelte';
	import '../app.postcss';
</script>

<svelte:head>
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:title" content="Cereza 🍒" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/open_graph.png" />
    <meta property="og:url" content="https://cereza.dev" />
    <meta property="og:description" content="An open-source Docker container deployment and management system." />

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
