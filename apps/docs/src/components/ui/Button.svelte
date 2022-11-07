<script lang="ts">
	export let href: string | undefined = undefined;
</script>

<svelte:element
	this={href !== undefined ? 'a' : 'button'}
	{href}
	class="
        font-medium text-xl px-4 py-2.5 min-w-[6rem] rounded-md bg-rose-600
        shadow-lg shadow-rose-300/50 dark:shadow-rose-900/50
        inline-flex justify-center
        active:translate-y-0.5
    "
>
	<slot />
</svelte:element>
