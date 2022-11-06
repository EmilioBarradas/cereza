<script>
	import Button from '@/components/ui/Button.svelte';
	import RightArrow from '@/components/icons/RightArrow.svelte';
	import Star from '@/components/icons/Star.svelte';
</script>

<div class="text-center flex flex-col items-center">
	<img
		src="logo.png"
		alt="The Cereza Logo"
		class="h-64 w-64 select-none"
		draggable="false"
	/>

	<h1 class="font-semibold text-7xl leading-normal">Cereza</h1>
	<p class="text-2xl font-medium max-w-[32rem]">
		An open-source Docker container deployment and management system.
	</p>

	<div class="mt-8 flex gap-4 flex-wrap justify-center">
		<Button href="/getting-started">
			<div class="flex items-center space-x-1.5">
				<RightArrow />
				<p class="whitespace-nowrap">Get Started</p>
			</div>
		</Button>

		<Button href="https://github.com/EmilioBarradas/cereza">
			<div class="flex items-center space-x-1.5">
				<Star />
				<p class="whitespace-nowrap">Star</p>
			</div>
		</Button>
	</div>
</div>
