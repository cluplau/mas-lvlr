<script lang="ts">
	import Cell from './Cell.svelte';
	import { getGrid } from './store/GridStore.svelte';

	const store = getGrid();
</script>

<section
	id="grid_visualization"
	class="border-s-[hsl(var(--background) / 0.4)] mx-auto grid max-h-full"
	style={`
      grid-template-rows: repeat(${store.height}, minmax(0, 1fr)); 
      grid-template-columns: repeat(${store.width}, minmax(0, 1fr));
      aspect-ratio: ${store.width} / ${store.height}
      `}
>
	{#each store.grid as grid_row, row}
		{#each grid_row as cell, col (cell.id)}
			<Cell {cell} {row} {col} />
		{/each}
	{/each}
</section>
