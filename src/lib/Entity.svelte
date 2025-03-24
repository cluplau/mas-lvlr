<script lang="ts">
	import { canHaveEntity, isAgentEntity, isBoxEntity, type Cell as CellType } from './store/cell';
	import { toCSSColor } from './store/GridStore.svelte';
	import { getTool } from './store/ToolStore.svelte';

	type Props = {
		cell: CellType;
		row: number;
		col: number;
	};

	const { cell, row, col }: Props = $props();

	const tool = getTool();

	function entityDragstartHandler(ev: DragEvent) {
		if (!ev?.dataTransfer) return;
		tool.isDragging = true;
		ev.dataTransfer.setData('entity', JSON.stringify({ row, col }));
		ev.stopPropagation();
	}

	function entityDragendHandler(ev: DragEvent) {
		tool.isDragging = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if canHaveEntity(cell) && cell.entity && isAgentEntity(cell.entity)}
	<div
		class="entity agent"
		style={`--entity-color: ${toCSSColor(cell.entity.color)}`}
		draggable="true"
		onmousedown={() => (tool.isDragging = true)}
		onmouseup={() => (tool.isDragging = false)}
		ondragstart={entityDragstartHandler}
		ondragendcapture={entityDragendHandler}
	>
		{cell.entity.id}
	</div>
{:else if canHaveEntity(cell) && cell.entity && isBoxEntity(cell.entity)}
	<div
		class="entity box"
		style={`--entity-color: ${toCSSColor(cell.entity.color)}`}
		draggable="true"
		ondragstart={entityDragstartHandler}
	>
		{cell.entity.id}
	</div>
{/if}
