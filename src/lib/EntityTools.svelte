<script lang="ts">
	import { Checkbox } from './components/ui/checkbox';
	import { Label } from './components/ui/label';
	import { CellVariant, EntityVariant } from './store/cell';
	import { toCSSColor } from './store/GridStore.svelte';
	import { getTool } from './store/ToolStore.svelte';

	const tool = getTool();

	const baseClasses = [
		'cell',
		'outline-emerald-600',
		'outline-2',
		'outline-offset-2',
		'rounded-sm'
	];
</script>

<div class="grid grid-cols-3 gap-4">
	<div class={[...baseClasses, { outline: tool.tool == EntityVariant.Box }]}>
		<button
			class="entity box"
			style={`--entity-color: ${toCSSColor(tool.color)}`}
			aria-label="empty"
			on:click={() => tool.setTool(EntityVariant.Box)}
		>
			{tool.nextBoxId}
		</button>
	</div>

	<div class={[...baseClasses, { outline: tool.tool == EntityVariant.Agent }]}>
		<button
			class="entity agent"
			style={`--entity-color: ${toCSSColor(tool.color)}`}
			aria-label="free"
			on:click={() => tool.setTool(EntityVariant.Agent)}
		>
			{tool.nextAgentId}
		</button>
	</div>
</div>

<div class="flex items-center space-x-2">
	<Checkbox id="auto_inc_box" bind:checked={tool.autoIncrementBox.current} />
	<Label
		for="auto_inc_box"
		class="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Auto increment box id
	</Label>
</div>

<div class="flex items-center space-x-2">
	<Checkbox id="auto_inc_agent" bind:checked={tool.autoIncrementAgent.current} />
	<Label
		for="auto_inc_agent"
		class="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Auto increment agent id
	</Label>
</div>
