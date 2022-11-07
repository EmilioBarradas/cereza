<script>
	import Button from '@/components/ui/Button.svelte';
	import RightArrow from '@/components/icons/RightArrow.svelte';
	import Star from '@/components/icons/Star.svelte';
	import Icon from '../ui/Icon.svelte';
</script>

<div class="text-center flex flex-col items-center">
	<img
		src="logo.png"
		alt="The Cereza Logo"
		class="h-64 w-64 select-none"
		draggable="false"
	/>

	<h1 class="mt-6 font-semibold text-7xl leading-snug dark:text-zinc-100">Cereza</h1>
	<p class="text-2xl max-w-[32rem] dark:text-zinc-200">
		An open-source Docker container deployment and management system.
	</p>

	<div class="mt-12 flex gap-4 flex-wrap justify-center text-white">
		<Button href="/getting-started">
			<div class="flex items-center space-x-2">
                <Icon icon={RightArrow} />
				<p class="whitespace-nowrap">Get Started</p>
			</div>
		</Button>

		<Button href="https://github.com/EmilioBarradas/cereza">
			<div class="flex items-center space-x-2">
                <Icon icon={Star} />
				<p class="whitespace-nowrap">Star</p>
			</div>
		</Button>
	</div>
</div>
