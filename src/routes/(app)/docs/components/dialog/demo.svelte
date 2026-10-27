<script lang="ts">
	import { Dialog, DialogTrigger, DialogContent } from "#lib/components/ui/dialog/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();
	const variants = ["default", "secondary", "outline", "ghost"] as const;
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isControlledOpen = $state(false);

	/** Live preview for one section of the dialog docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "trigger" | "controlled" | "variant" | "size" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Default trigger button and content panel. -->
		<Dialog>
			<DialogTrigger>Open dialog</DialogTrigger>
			<DialogContent>
				<p class="demoText">Click the backdrop or press Escape to close.</p>
			</DialogContent>
		</Dialog>
	{:else if section === "trigger"}
		<!-- Custom trigger element in place of the default button. -->
		<Dialog>
			<DialogTrigger>
				{#snippet trigger({ props })}
					<button class="demoTrigger" type="button" {...props}>Open with a custom trigger</button>
				{/snippet}
			</DialogTrigger>
			<DialogContent>
				<p class="demoText">The trigger snippet receives the props that open the dialog.</p>
			</DialogContent>
		</Dialog>
	{:else if section === "controlled"}
		<!-- Open state bound to a variable and changed from outside the dialog. -->
		<Button variant="outline" onclick={() => (isControlledOpen = true)}>Open from outside</Button>
		<p class="demoText">Open: {isControlledOpen}</p>
		<Dialog bind:open={isControlledOpen}>
			<DialogContent>
				<div class="demoStack">
					<p class="demoText">This dialog has no trigger; a bound variable opens it.</p>
					<Button onclick={() => (isControlledOpen = false)}>Done</Button>
				</div>
			</DialogContent>
		</Dialog>
	{:else if section === "variant"}
		<!-- Each variant of the content panel. -->
		{#each variants as variant (variant)}
			<Dialog {variant}>
				<DialogTrigger>{variant}</DialogTrigger>
				<DialogContent>
					<p class="demoText">Variant {variant}</p>
				</DialogContent>
			</Dialog>
		{/each}
	{:else if section === "size"}
		<!-- Each size of the content panel. -->
		{#each sizes as size (size)}
			<Dialog {size}>
				<DialogTrigger>Size {size}</DialogTrigger>
				<DialogContent>
					<p class="demoText">Size {size}</p>
				</DialogContent>
			</Dialog>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the default radius. -->
		{#each roundedValues as rounded (rounded)}
			<Dialog {rounded}>
				<DialogTrigger>Rounded {rounded}</DialogTrigger>
				<DialogContent>
					<p class="demoText">Rounded {rounded}</p>
				</DialogContent>
			</Dialog>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoStack {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-lg);
	}

	.demoTrigger {
		cursor: pointer;
		border: 0;
		background-color: transparent;
		padding: 0;
		color: var(--primary);
		font: inherit;
		font-size: var(--text-sm);
		text-decoration: underline;
		text-underline-offset: 0.25rem; /* 4px */
	}

	.demoTrigger:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.demoText {
		margin: 0;
		font-size: var(--text-sm);
	}
</style>
