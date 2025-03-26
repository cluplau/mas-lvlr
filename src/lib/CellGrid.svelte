<script lang="ts">
	import Cell from './Cell.svelte';
	import { getGrid } from './store/GridStore.svelte';

	const store = getGrid();
</script>

<div
	class="mx-auto box-content max-h-[calc(100%-32px)] overflow-hidden rounded-md bg-secondary p-4"
	style={`aspect-ratio: ${store.width} / ${store.height}`}
>
	<section
		id="grid_visualization"
		class="border-s-[hsl(var(--background) / 0.4)] grid"
		style={`
      grid-template-rows: repeat(${store.height}, minmax(0, 1fr)); 
      grid-template-columns: repeat(${store.width}, minmax(0, 1fr));
      `}
	>
		{#each store.grid as grid_row, row}
			{#each grid_row as cell, col (cell.id)}
				<Cell {cell} {row} {col} />
			{/each}
		{/each}
	</section>
</div>
