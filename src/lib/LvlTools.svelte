<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import Upload from '@lucide/svelte/icons/upload';
	import Download from '@lucide/svelte/icons/download';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { getGrid, setGrid } from './store/GridStore.svelte';
	import Button from './components/ui/button/button.svelte';

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
			store.fromLevel(level);
			console.log('Uploaded grid');
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
		console.log('Download triggered');
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
			console.log('Copied to clipboard');
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
