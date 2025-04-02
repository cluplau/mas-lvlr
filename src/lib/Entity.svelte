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
		ev.dataTransfer.setData('entity', JSON.stringify({ row, col }));
		ev.stopPropagation();
	}

	function dblClickHandler() {
		grid.removeEntity(row, col);
	}

	function stopProp(e: Event) {
		e.stopImmediatePropagation();
	}

	function entityClickHandler(ev: MouseEvent) {
		let newId = '';

		if (!canHaveEntity(cell)) {
			return;
		}

		if (tool.tool == 'agent' && cell.entity?.type == 'agent') {
			newId = tool.nextAgentId;
		} else if (tool.tool == 'box' && cell.entity?.type == 'box') {
			newId = tool.nextBoxId;
		} else {
			return;
		}

		grid.setEntityDetails(row, col, tool.color, newId);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if canHaveEntity(cell) && cell.entity && isAgentEntity(cell.entity)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="entity agent"
		style={`--entity-color: ${toCSSColor(cell.entity.color)}`}
		draggable="true"
		onmousedown={stopProp}
		ondragstart={entityDragstartHandler}
		ondblclick={dblClickHandler}
		onclick={entityClickHandler}
	>
		{cell.entity.id}
	</div>
{:else if canHaveEntity(cell) && cell.entity && isBoxEntity(cell.entity)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="entity box"
		style={`--entity-color: ${toCSSColor(cell.entity.color)}`}
		draggable="true"
		ondragstart={entityDragstartHandler}
		ondblclick={dblClickHandler}
		onclick={entityClickHandler}
	>
		{cell.entity.id}
	</div>
{/if}
