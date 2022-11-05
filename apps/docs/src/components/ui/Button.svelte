<script lang="ts">
	export let href: string | undefined = undefined;
</script>

<svelte:element
	this={href !== undefined ? 'a' : 'button'}
	{href}
	class="font-medium text-xl border-[3px] border-black dark:border-white px-3 py-1 min-w-[5rem] inline-block rounded-md"
>
	<slot />
</svelte:element>
