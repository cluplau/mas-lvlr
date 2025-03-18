<script lang="ts">
	import Cell from './Cell.svelte';
	import { getGrid } from './store/GridStore.svelte';

	const store = getGrid();
</script>

<div class="flex h-full items-center justify-center">
	<section
		class="grid aspect-square h-full max-h-[90vh] gap-[1px] bg-black"
		style={`
      grid-template-rows: repeat(${store.height}, 1fr); 
      grid-template-columns: repeat(${store.width}, 1fr);
      `}
	>
		{#each store.grid as row}
			{#each row as cell}
				<Cell {cell} />
			{/each}
		{/each}
	</section>
</div>
