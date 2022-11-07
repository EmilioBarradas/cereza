<script lang="ts">
	import type { SvelteComponent } from "svelte";

    export let icon: typeof SvelteComponent;
    export let height: `h-${string}` = 'h-5';
    export let width: `w-${string}` = 'w-5';
    export let color = "";
</script>

<span class="{height} {width} {color}">
    <svelte:component this={icon} />
</span>
