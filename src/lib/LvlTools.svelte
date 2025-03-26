<script lang="ts">
	import Upload from '@lucide/svelte/icons/upload';
	import Download from '@lucide/svelte/icons/download';
	import ImageDown from '@lucide/svelte/icons/image-down';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { getGrid, GridStore, setGrid } from './store/GridStore.svelte';
	import Button from './components/ui/button/button.svelte';
	import html2canvas from '@cantoo/html2canvas';

	const store = getGrid();

	let fileInput: HTMLInputElement;
	let copied = false;
	let copyTimeout: ReturnType<typeof setTimeout>;

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
		a.download = 'grid.lvl';
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
			link.download = 'div-content.png';
			link.href = canvas.toDataURL('image/png');
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
</script>

<div class="flex flex-wrap justify-between gap-6 text-sm">
	<!-- File Actions -->
	<div class="flex flex-col items-center gap-1">
		<div class="flex items-center gap-2">
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
</div>

<input
	type="file"
	accept=".lvl,"
	class="hidden"
	bind:this={fileInput}
	onchange={handleFileUpload}
/>
