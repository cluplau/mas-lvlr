<script lang="ts">
	import ColorTools from '$lib/ColorTools.svelte';
	import EntityTools from '$lib/EntityTools.svelte';
	import GridTools from '$lib/GridTools.svelte';
	import LvlTools from '$lib/LvlTools.svelte';
	import PaintTools from '$lib/PaintTools.svelte';
	import { setGrid } from '$lib/store/GridStore.svelte';
	import { setTool } from '$lib/store/ToolStore.svelte';
	import '../app.css';
	let { children } = $props();

	setGrid();
	setTool();
</script>

<main class="dark flex h-screen w-screen bg-background/80">
	<div class="flex min-w-64 flex-col gap-4 p-4">
		<h1 class=" text-xl text-white">Paint brush</h1>

		<div class="grid grid-cols-3 grid-rows-2 gap-4">
			<PaintTools />
		</div>

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Entities</h1>
		<EntityTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Colors</h1>
		<ColorTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Grid</h1>
		<GridTools />

		<hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
		<h1 class="text-xl text-white">Tools</h1>
		<LvlTools />
	</div>

	<div class="max-h-full w-full p-4">
		{@render children()}
	</div>
</main>
