<script lang="ts">
	import type { Agent } from './cell';
	import { toCSSColor } from './store/GridStore.svelte';

	type Props = {
		agent: Agent;
	};

	const { agent }: Props = $props();
</script>

<div
	style={`--entity-color: ${toCSSColor(agent.color)}`}
	class="type flex h-[80%] w-[80%] cursor-pointer items-center justify-center rounded-full bg-[--entity-color] text-[60cqmin] font-bold"
>
	{agent.id}
</div>
