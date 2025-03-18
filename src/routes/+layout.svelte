<script lang="ts">
	import { setGrid } from '$lib/store/GridStore.svelte';
	import '../app.css';
	let { children } = $props();

	setGrid();
</script>

<main class="dark flex h-screen w-screen gap-9 overflow-hidden bg-background/80">
	<div class="flex flex-col">
		<h1 class="text-4xl text-primary">MAS Level maker</h1>
	</div>

	<div class="h-full overflow-auto">
		{@render children()}
	</div>
</main>
