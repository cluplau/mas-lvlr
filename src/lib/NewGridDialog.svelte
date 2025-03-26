<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { CellVariant } from './store/cell';
	import { getGrid } from './store/GridStore.svelte';

	let grid = getGrid();

	const baseClasses = [
		'cell',
		'rounded-sm',
		'outline-emerald-600',
		'outline-2',
		'outline-offset-2'
	];

	let open = $state(false);

	let newName = $state('New level');
	let newWidth = $state(20);
	let newHeight = $state(14);
	let newCellVariant = $state(CellVariant.Free);

	function onCreateNewGrid() {
		grid.fromDimensions(newWidth, newHeight, newCellVariant, newName);
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={[buttonVariants({ variant: 'ghost', size: 'sm' })]}>New</Dialog.Trigger>
	<Dialog.Content class="bg-secondary sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create new level</Dialog.Title>
			<Dialog.Description>
				Select dimensions and fill cell to create a new level. Note that this will override the
				current level
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-5 items-center gap-4">
				<Label for="name" class="text-right">Width</Label>
				<Input id="name" type="number" bind:value={newWidth} max="50" min="3" />
			</div>
			<div class="grid grid-cols-5 items-center gap-4">
				<Label for="username" class="text-right">Height</Label>
				<Input id="username" type="number" bind:value={newHeight} max="50" min="3" />
			</div>

			<div class="mt-4 grid grid-cols-5 items-center gap-4">
				<div></div>
				<button
					class={[...baseClasses, 'free', { outline: newCellVariant == CellVariant.Free }]}
					aria-label="free"
					onclick={() => (newCellVariant = CellVariant.Free)}
				>
				</button>

				<button
					class={[...baseClasses, 'wall', { outline: newCellVariant == CellVariant.Wall }]}
					aria-label="wall"
					onclick={() => (newCellVariant = CellVariant.Wall)}
				>
				</button>

				<button
					class={[
						...baseClasses,
						'empty border-2 border-background/40',
						{ outline: newCellVariant == CellVariant.Empty }
					]}
					aria-label="empty"
					onclick={() => (newCellVariant = CellVariant.Empty)}
				>
				</button>
			</div>
		</div>

		<Dialog.Footer>
			<Button type="submit" onclick={onCreateNewGrid}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
