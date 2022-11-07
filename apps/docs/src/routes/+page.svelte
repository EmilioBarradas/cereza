<script lang="ts">
	import Features from '@/components/landing/Features.svelte';
	import Footer from '@/components/landing/Footer.svelte';
	import Hero from '@/components/landing/Hero.svelte';
	import Pitch from '@/components/landing/Pitch.svelte';
</script>

<svelte:head>
    <title>Cereza</title>
</svelte:head>

<main class="pt-24 pb-8 px-24 flex flex-col relative dark:bg-[#111] space-y-32 transition-all">
	<section>
		<Hero />
	</section>

	<section>
		<Features />
	</section>

	<section>
		<Pitch />
	</section>

	<section>
		<Footer />
	</section>
</main>
