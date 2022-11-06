<script lang="ts">
	import Features from '@/components/landing/Features.svelte';
	import Footer from '@/components/landing/Footer.svelte';
	import Hero from '@/components/landing/Hero.svelte';
	import Pitch from '@/components/landing/Pitch.svelte';
</script>

<svelte:head>
    <title>Cereza</title>
</svelte:head>

<main class="pt-24 pb-8 px-24 flex flex-col relative dark:bg-zinc-900">
	<section>
		<Hero />
	</section>

	<section class="mt-24">
		<Features />
	</section>

	<section class="mt-32">
		<Pitch />
	</section>

	<section class="mt-16">
		<Footer />
	</section>
</main>
