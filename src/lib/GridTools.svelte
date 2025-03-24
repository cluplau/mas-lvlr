<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { getGrid } from './store/GridStore.svelte';
	import Button from './components/ui/button/button.svelte';

	const store = getGrid();
</script>

<div class="flex flex-wrap justify-between gap-6 text-sm">
	<div class="flex flex-col items-center gap-1">
		<span class="font-semibold text-white">Rows: {store.height}</span>
		<div class="flex gap-2">
			<Button size="icon" onclick={() => store.removeRow()} disabled={store.height <= 3}>
				<Minus />
			</Button>
			<Button size="icon" onclick={() => store.addRow()} disabled={store.height >= 50}>
				<Plus />
			</Button>
		</div>
	</div>

	<div class="flex flex-col items-center gap-1">
		<span class="font-semibold text-white">Cols: {store.width}</span>
		<div class="flex gap-2">
			<Button size="icon" onclick={() => store.removeColumn()} disabled={store.width <= 3}>
				<Minus />
			</Button>

			<Button size="icon" onclick={() => store.addColumn()} disabled={store.width >= 50}>
				<Plus />
			</Button>
		</div>
	</div>
</div>
