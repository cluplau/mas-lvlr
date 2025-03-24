<script lang="ts">
	import Entity from './Entity.svelte';
	import {
		canHaveEntity,
		CellVariant,
		isAgentGoalCell,
		isBoxGoalCell,
		isEmptyCell,
		isFreeCell,
		isGoalCell,
		isWallCell,
		type Cell as CellType
	} from './store/cell';
	import { getGrid } from './store/GridStore.svelte';
	import { getTool } from './store/ToolStore.svelte';

	type Props = {
		cell: CellType;
		row: number;
		col: number;
	};

	const { cell, row, col }: Props = $props();

	const grid = getGrid();

	const tool = getTool();

	function paintCell(ev: MouseEvent) {
		if (ev.buttons == 1 && tool.tool && !tool.isDragging) {
			grid.setCell(row, col, tool.tool);
		}
	}

	function cellMouseDownHandler(ev: MouseEvent) {
		paintCell(ev);
	}

	function cellMouseOverHandler(ev: MouseEvent) {
		if (tool.tool != CellVariant.AgentGoal && tool.tool != CellVariant.BoxGoal) {
			paintCell(ev);
		}
	}

	function dragoverHandler(ev: DragEvent) {
		ev.preventDefault();
		if (!ev?.dataTransfer) return;
	}

	function cellDropHandler(ev: DragEvent) {
		ev.preventDefault();
		if (!ev?.dataTransfer) return;
		const entity = ev.dataTransfer.getData('entity');
		if (entity) {
			const d = JSON.parse(entity);
			grid.moveEntity(d.row, d.col, row, col);
			ev.stopPropagation();
			return;
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	class={[
		'cell',
		{
			'bg-[#c0c0c0]': canHaveEntity(cell),
			'bg-[black]': isWallCell(cell),
			'bg-[rgba(0, 0, 0, 0)]': isEmptyCell(cell)
		}
	]}
	onmousedown={cellMouseDownHandler}
	onmouseover={cellMouseOverHandler}
	ondragover={dragoverHandler}
	ondrop={cellDropHandler}
>
	{#if isBoxGoalCell(cell)}
		<div class="goal entity boxgoal">
			{cell.goalFor}
		</div>
	{:else if isAgentGoalCell(cell)}
		<div class="goal entity agentgoal">
			{cell.goalFor}
		</div>
	{/if}

	{#if canHaveEntity(cell) && cell.entity}
		<!-- Render the Entity if the cell has one -->
		<Entity {cell} {row} {col} />
	{/if}
</div>
