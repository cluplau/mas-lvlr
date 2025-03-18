<script lang="ts">
	import Agent from './Agent.svelte';
	import Box from './Box.svelte';
	import type { Cell as CellType } from './cell';
	import { hasEntity, isAgent, isBox, isGoal } from './store/GridStore.svelte';

	type Props = {
		cell: CellType;
	};

	const { cell }: Props = $props();

	const cellStyles = {
		free: '#c0c0c0',
		wall: 'black',
		goal: '#dfdf02',
		empty: ''
	};
</script>

<div
	style={`--bg-color: ${cellStyles[cell.type]}`}
	class={`@container flex aspect-square select-none items-center justify-center bg-[var(--bg-color)]`}
>
	{#if hasEntity(cell) && cell.entity}
		{#if isAgent(cell.entity)}
			<Agent agent={cell.entity} />
		{:else if isBox(cell.entity)}
			<Box box={cell.entity} />
		{/if}
	{:else if isGoal(cell)}
		{cell.id}
	{/if}
</div>
