<script lang="ts">
	import { CellVariant } from './store/cell';
	import { toCSSColor } from './store/GridStore.svelte';
	import { getTool } from './store/ToolStore.svelte';

	const tool = getTool();

	const baseClasses = [
		'cell',
		'rounded-sm',
		'outline-emerald-600',
		'outline-2',
		'outline-offset-2'
	];
</script>

<div class="grid grid-cols-4 grid-rows-2 gap-4">
	<button
		class={[...baseClasses, 'free', { outline: tool.tool == CellVariant.Free }]}
		aria-label="free"
		on:click={() => tool.setTool(CellVariant.Free)}
	>
	</button>

	<button
		class={[...baseClasses, 'wall', { outline: tool.tool == CellVariant.Wall }]}
		aria-label="wall"
		on:click={() => tool.setTool(CellVariant.Wall)}
	>
	</button>

	<div class={[...baseClasses, 'cell', { outline: tool.tool == CellVariant.BoxGoal }]}>
		<button
			class={['entity boxgoal']}
			style={`--entity-color: ${toCSSColor(tool.color)}`}
			aria-label="goal"
			on:click={() => tool.setTool(CellVariant.BoxGoal)}
		>
			{tool.nextBoxId}
		</button>
	</div>

	<div class={[...baseClasses, 'cell', { outline: tool.tool == CellVariant.AgentGoal }]}>
		<button
			class={['entity agentgoal']}
			style={`--entity-color: ${toCSSColor(tool.color)}`}
			aria-label="goal"
			on:click={() => tool.setTool(CellVariant.AgentGoal)}
		>
			{tool.nextAgentId}
		</button>
	</div>

	<button
		class={[
			...baseClasses,
			'empty border-2 border-background/40',
			{ outline: tool.tool == CellVariant.Empty }
		]}
		aria-label="empty"
		on:click={() => tool.setTool(CellVariant.Empty)}
	>
	</button>
</div>
