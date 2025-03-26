<script lang="ts">
	import Entity from './Entity.svelte';
	import {
		canHaveEntity,
		CellVariant,
		EntityVariant,
		isAgentGoalCell,
		isBoxGoalCell,
		isCellVariant,
		isEmptyCell,
		isEntityVariant,
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
		if (isCellVariant(tool.tool)) {
			if (tool.tool == CellVariant.AgentGoal) {
				grid.setCell(row, col, tool.tool, tool.nextAgentId);
				return;
			}
			if (tool.tool == CellVariant.BoxGoal) {
				grid.setCell(row, col, tool.tool, tool.nextBoxId);
				return;
			}
			grid.setCell(row, col, tool.tool);
			return;
		}

		if (isEntityVariant(tool.tool)) {
			if (tool.tool == EntityVariant.Agent) {
				grid.addEntity(row, col, {
					type: tool.tool,
					id: tool.nextAgentId,
					color: tool.color
				});
				tool.incrementAgentId();
			} else if (tool.tool == EntityVariant.Box) {
				grid.addEntity(row, col, {
					type: tool.tool,
					id: tool.nextBoxId,
					color: tool.color
				});
				tool.incrementBoxId();
			}
		}
	}

	function cellClickHandler(ev: MouseEvent) {
		paintCell(ev);
	}

	function cellMouseOverHandler(ev: MouseEvent) {
		if (ev.buttons != 1 || tool.isDragging) {
			return;
		}
		if (
			tool.tool != CellVariant.Wall &&
			tool.tool != CellVariant.Free &&
			tool.tool != CellVariant.Empty
		) {
			return;
		}
		paintCell(ev);
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
			free: canHaveEntity(cell),
			wall: isWallCell(cell),
			empty: isEmptyCell(cell)
		}
	]}
	onclick={cellClickHandler}
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
