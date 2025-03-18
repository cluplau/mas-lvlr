<script lang="ts">
	import type { Snippet } from 'svelte';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		children: Snippet;
		id: number;
		onselect: (i: number) => void;
		ondelete: (i: number) => void;
		ondownload: (i: number) => void;
		onrenamestart: (i: number) => void;
	}

	let { children, id, onselect, ondelete, ondownload, onrenamestart }: Props = $props();
</script>

<div class="w-w-full flex pl-2">
	<button
		onclick={() => onselect(id)}
		class="w-full text-left font-mono text-primary underline-offset-4 hover:underline"
	>
		{@render children()}
	</button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="sm" class="relative size-8 p-0 text-primary">
					<span class="sr-only">Open menu</span>
					<Ellipsis />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content side="right" align="start" trapFocus={false}>
			<DropdownMenu.Item onclick={() => onrenamestart(id)}>Rename</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => ondownload(id)}>Download</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => ondelete(id)}>Delete</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
