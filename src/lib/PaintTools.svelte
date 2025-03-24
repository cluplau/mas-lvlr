<script lang="ts">
	import { CellVariant } from './store/cell';
	import { getTool } from './store/ToolStore.svelte';

	const tool = getTool();

	const baseClasses = ['cell', 'outline-emerald-600', 'outline-2', 'outline-offset-2', 'border-2'];
</script>

<button
	class={[
		...baseClasses,
		'rounded-sm',
		'bg-[rgba(0,0,0,0)]',
		{ outline: tool.tool == CellVariant.Empty }
	]}
	aria-label="empty"
	on:click={() => tool.setTool(CellVariant.Empty)}
></button>

<button
	class={['rounded-sm', ...baseClasses, 'bg-[#c0c0c0]', { outline: tool.tool == CellVariant.Free }]}
	aria-label="free"
	on:click={() => tool.setTool(CellVariant.Free)}
></button>

<button
	class={['rounded-sm', ...baseClasses, 'bg-[black]', { outline: tool.tool == CellVariant.Wall }]}
	aria-label="wall"
	on:click={() => tool.setTool(CellVariant.Wall)}
></button>

<button
	class={[
		'rounded-sm',
		...baseClasses,
		'bg-[#dfdf02]',
		{ outline: tool.tool == CellVariant.BoxGoal }
	]}
	aria-label="goal"
	on:click={() => tool.setTool(CellVariant.BoxGoal)}
>
	A
</button>

<button
	class={[
		'rounded-full',
		...baseClasses,
		'bg-[#dfdf02]',
		{ outline: tool.tool == CellVariant.AgentGoal }
	]}
	aria-label="goal"
	on:click={() => tool.setTool(CellVariant.AgentGoal)}
>
	0
</button>
