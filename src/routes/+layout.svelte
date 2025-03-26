<script lang="ts">
	import ColorTools from '$lib/ColorTools.svelte';
	import EntityTools from '$lib/EntityTools.svelte';
	import GridTools from '$lib/GridTools.svelte';
	import LvlTools from '$lib/LvlTools.svelte';
	import CellTools from '$lib/CellTools.svelte';
	import { setGrid } from '$lib/store/GridStore.svelte';
	import { getTool, setTool } from '$lib/store/ToolStore.svelte';
	import '../app.css';
	let { children } = $props();

	import { dev } from '$app/environment';
	import { RenderScan } from 'svelte-render-scan';
	import { onMount } from 'svelte';

	setGrid();
	setTool();

	const tool = getTool();

	function handleKeyDown(event: KeyboardEvent) {
		const key = event.key.toUpperCase();

		// Check for A-Z
		if (/^[A-Z]$/.test(key)) {
			tool.nextBoxId = key;
		}
		// Check for 0-9
		else if (/^[0-9]$/.test(key)) {
			tool.nextAgentId = key;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

{#if dev && false}
	<RenderScan />
{/if}

<main class="dark flex h-screen w-screen bg-background/80">
	<div
		class="m-4 flex max-h-screen min-w-64 flex-col gap-4 overflow-y-auto rounded-md bg-foreground/10 p-4"
	>
		<h1 class="text-xl text-white">Grid</h1>
		<GridTools />
		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

		<h1 class=" text-xl text-white">Cells</h1>
		<CellTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Entities</h1>
		<EntityTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Colors</h1>
		<ColorTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Tools</h1>
		<LvlTools />
	</div>

	<div class="max-h-full w-full content-center p-4">
		{@render children()}
	</div>
</main>
