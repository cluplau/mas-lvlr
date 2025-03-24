<script lang="ts">
	import { getTool } from './store/ToolStore.svelte';
	import type { Color } from './store/cell';

	const tool = getTool();

	const colorMap: Record<Color, string> = {
		blue: '#3050fe',
		red: '#ff0000',
		cyan: '#02ffff',
		purple: '#6001b0',
		green: '#02ff00',
		orange: '#ff8001',
		pink: '#f060c0',
		grey: '#707070',
		lightblue: '#70c0ff',
		brown: '#602f00'
	};

	const baseClasses = [
		'cell',
		'outline-emerald-600',
		'outline-2',
		'outline-offset-2',
		'border-2',
		'rounded-full',
		'min-w-4',
		'w-full'
	];
</script>

<div class="grid grid-cols-5 grid-rows-2 gap-2">
	{#each Object.entries(colorMap) as [color, hex]}
		<button
			class={[...baseClasses, `bg-[--color]`, { outline: tool.color === color }]}
			style={`--color: ${hex}`}
			aria-label={color}
			on:click={() => tool.setColor(color as Color)}
		></button>
	{/each}
</div>
