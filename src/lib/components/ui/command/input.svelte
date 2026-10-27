<script lang="ts">
	import { SearchIcon } from "@lucide/svelte";
	import { useCompCtx } from "./ctx.svelte.js";
	import type { InputProps } from "./index.js";
	const { oninput, class: className, ...props }: InputProps = $props();
	const ctx = useCompCtx();

	/** Updates the search as the user types. */
	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		oninput?.(e);
		ctx.setSearch(e.currentTarget.value);
	};
</script>

<!-- Search field that filters the list; focus stays here while the highlight points at an item. -->
<div class={["commandInput", className]}>
	<SearchIcon aria-hidden="true" />
	<input class="commandInputField" type="text" role="combobox" aria-label="Search" aria-expanded="true" aria-controls={ctx.listId} aria-activedescendant={ctx.activeId} aria-autocomplete="list" autocomplete="off" spellcheck="false" value={ctx.search} oninput={handleInput} {...props} />
</div>

<style>
	/* Base wrapper; the inline padding lines the icon up with the item content below */
	.commandInput {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--spacing-sm);
		box-sizing: border-box;
		border-bottom: 1px solid var(--border);
		padding-inline: calc(var(--spacing-xs) + var(--command-item-padding-inline));
		height: var(--command-input-height);
	}

	.commandInput :global(svg) {
		flex-shrink: 0;
		width: var(--command-icon);
		height: var(--command-icon);
		color: var(--muted-foreground);
	}

	/* Bare input that fills the wrapper */
	.commandInputField {
		flex: 1;
		outline: none;
		border: 0;
		background-color: transparent;
		padding: 0;
		min-width: 0;
		height: 100%;
		color: inherit;
		font: inherit;
	}

	.commandInputField::placeholder {
		color: var(--muted-foreground);
	}

	/* =============== States =============== */

	/* Disabled state */
	.commandInputField:disabled {
		opacity: 50%;
		cursor: not-allowed;
	}
</style>
