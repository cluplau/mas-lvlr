<script lang="ts">
	import ColorTools from '$lib/ColorTools.svelte';
	import EntityTools from '$lib/EntityTools.svelte';
	import GridTools from '$lib/GridTools.svelte';
	import LevelTools from '$lib/LevelTools.svelte';
	import CellTools from '$lib/CellTools.svelte';
	import { getGrid, setGrid } from '$lib/store/GridStore.svelte';
	import { getTool, setTool } from '$lib/store/ToolStore.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { RenderScan } from 'svelte-render-scan';
	import { onMount } from 'svelte';
	import NewGridDialog from '$lib/NewGridDialog.svelte';
	import MetaTags from '$lib/MetaTags.svelte';
	import { goto, replaceState } from '$app/navigation';

	let { children } = $props();
	setGrid();
	setTool();
	const grid = getGrid();
	const tool = getTool();

	function handleKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLInputElement | null;
		const tag = target?.tagName?.toLowerCase();

		if (tag === 'input' || tag === 'textarea') {
			return;
		}

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

	const levelString = $page.url.searchParams.get('lvl');

	if (levelString) {
		const level = atob(levelString);
		grid.load(level);
		$page.url.searchParams.delete('lvl');
		goto($page.url);
	}
</script>

{#if dev && false}
	<RenderScan />
{/if}

<MetaTags />

<main class="flex h-screen w-screen">
	<div
		class="m-4 flex max-h-screen w-64 min-w-64 flex-col gap-4 overflow-y-auto rounded-md bg-secondary p-4"
	>
		<div class="flex flex-row justify-between">
			<h1 class="text-xl">Level</h1>
			<NewGridDialog></NewGridDialog>
		</div>
		<LevelTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl">Grid</h1>
		<GridTools />
		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

		<h1 class=" text-xl">Cells</h1>
		<CellTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl">Entities</h1>
		<EntityTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl">Colors</h1>
		<ColorTools />
	</div>

	<div class="m-4 max-h-full w-full content-center">
		{@render children()}
	</div>
</main>
