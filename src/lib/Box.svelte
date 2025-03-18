<script lang="ts">
	import type { Box } from './cell';
	import { toCSSColor } from './store/GridStore.svelte';

	type Props = {
		box: Box;
	};

	const { box }: Props = $props();
</script>

<div
	style={`--entity-color: ${toCSSColor(box.color)}`}
	class="flex h-[80%] w-[80%] cursor-pointer items-center justify-center bg-[--entity-color] text-[80%] font-bold"
>
	{box.id}
</div>
