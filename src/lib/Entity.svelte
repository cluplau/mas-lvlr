<script lang="ts">
	import { canHaveEntity, isAgentEntity, isBoxEntity, type Cell as CellType } from './store/cell';
	import { getGrid, toCSSColor } from './store/GridStore.svelte';
	import { getTool } from './store/ToolStore.svelte';

	type Props = {
		cell: CellType;
		row: number;
		col: number;
	};

	const { cell, row, col }: Props = $props();

	const tool = getTool();
	const grid = getGrid();

	function entityDragstartHandler(ev: DragEvent) {
		if (!ev?.dataTransfer) return;
		tool.setIsDragging(true);
		ev.dataTransfer.setData('entity', JSON.stringify({ row, col }));
		ev.stopPropagation();
	}

	function entityDragendHandler(ev: DragEvent) {
		setTimeout(() => {
			tool.setIsDragging(false);
		}, 200);
	}

	function dblClickHandler() {
		grid.removeEntity(row, col);
	}

	function stopProp(e: Event) {
		e.stopImmediatePropagation();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if canHaveEntity(cell) && cell.entity && isAgentEntity(cell.entity)}
	<div
		class="entity agent"
		style={`--entity-color: ${toCSSColor(cell.entity.color)}`}
		draggable="true"
		onmousedown={stopProp}
		onmouseup={() => tool.setIsDragging(false)}
		ondragstart={entityDragstartHandler}
		ondragendcapture={entityDragendHandler}
		ondblclick={dblClickHandler}
	>
		{cell.entity.id}
	</div>
{:else if canHaveEntity(cell) && cell.entity && isBoxEntity(cell.entity)}
	<div
		class="entity box"
		style={`--entity-color: ${toCSSColor(cell.entity.color)}`}
		draggable="true"
		ondragstart={entityDragstartHandler}
		ondblclick={dblClickHandler}
	>
		{cell.entity.id}
	</div>
{/if}
