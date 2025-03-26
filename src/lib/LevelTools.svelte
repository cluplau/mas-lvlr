<script lang="ts">
	import Upload from '@lucide/svelte/icons/upload';
	import Download from '@lucide/svelte/icons/download';
	import ImageDown from '@lucide/svelte/icons/image-down';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { getGrid } from './store/GridStore.svelte';
	import Button from './components/ui/button/button.svelte';
	import html2canvas from '@cantoo/html2canvas';
	import Input from './components/ui/input/input.svelte';
	import { Label } from './components/ui/label';

	const store = getGrid();

	let fileInput: HTMLInputElement;
	let copied = false;
	let copyTimeout: ReturnType<typeof setTimeout>;
	let grid = getGrid();

	function uploadGrid() {
		fileInput.click();
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const level = reader.result?.toString() ?? '';
			store.load(level);
		};
		reader.readAsText(file);
	}

	function downloadGrid() {
		const data = store.toString();
		const blob = new Blob([data], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${grid.name || 'New level'}.lvl`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function downloadGridScreenshot() {
		const element = document.getElementById('grid_visualization');

		if (element == null) {
			alert('Unable to create png');
			return;
		}

		html2canvas(element, {
			scale: 3,
			backgroundColor: null
		}).then((canvas) => {
			const link = document.createElement('a');
			link.href = canvas.toDataURL('image/png');
			link.download = `${grid.name || 'New level'}.png`;
			link.click();
		});
	}

	async function copyGrid() {
		const data = store.toString();
		try {
			await navigator.clipboard.writeText(data);
			copied = true;
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function preventBubble(e: Event) {
		e.stopPropagation();
	}
</script>

<div class="grid grid-cols-4 items-center gap-4">
	<Label for="level_name">Name</Label>
	<Input id="level_name" bind:value={store.name} class="col-span-3" onchange={preventBubble} />
</div>

<div class="flex flex-wrap gap-6 text-sm">
	<!-- File Actions -->
	<div class="flex w-full flex-row justify-between">
		<Button size="icon" onclick={uploadGrid}>
			<Upload />
		</Button>

		<Button size="icon" onclick={downloadGrid}>
			<Download />
		</Button>

		<Button size="icon" onclick={downloadGridScreenshot}>
			<ImageDown />
		</Button>

		<Button size="icon" onclick={copyGrid}>
			{#if copied}
				<Check />
			{:else}
				<Copy />
			{/if}
		</Button>
	</div>
</div>

<input
	type="file"
	accept=".lvl,"
	class="hidden"
	bind:this={fileInput}
	onchange={handleFileUpload}
/>
