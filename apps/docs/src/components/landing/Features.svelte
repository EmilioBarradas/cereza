<script lang="ts">
	interface Feature {
		title: string;
		description: string;
		icon: string;
	}

	const features: Feature[] = [
		{
			title: 'Simple',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam aperiam omnis aliquid, sunt magnam reprehenderit nisi.',
			icon: '✨'
		},
		{
			title: 'Type Safe',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam aperiam omnis aliquid, sunt magnam reprehenderit nisi.',
			icon: '🔑'
		},
		{
			title: 'Type Safe',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam aperiam omnis aliquid, sunt magnam reprehenderit nisi.',
			icon: '🔑'
		},
		{
			title: 'Type Safe',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam aperiam omnis aliquid, sunt magnam reprehenderit nisi.',
			icon: '🔑'
		},
		{
			title: 'Type Safe',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam aperiam omnis aliquid, sunt magnam reprehenderit nisi.',
			icon: '🔑'
		},
		{
			title: 'Type Safe',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam aperiam omnis aliquid, sunt magnam reprehenderit nisi.',
			icon: '🔑'
		}
	];
</script>

<div class="flex justify-center">
	<div class="max-w-6xl grid grid-cols-3 gap-12">
		{#each features as { title, description, icon }}
			<div class="space-y-2">
				<h2 class="text-2xl font-medium inline">{icon} {title}</h2>
				<p class="text-lg">{description}</p>
			</div>
		{/each}
	</div>
</div>
