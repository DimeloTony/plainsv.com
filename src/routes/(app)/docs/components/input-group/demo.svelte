<script lang="ts">
	import { InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon, InputGroupButton, InputGroupText } from "#lib/components/ui/input-group/index.js";
	import { SearchIcon, MailIcon, CopyIcon, ArrowUpIcon, PlusIcon, CheckIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	let isCopied = $state(false);

	/** Shows the copied check for a moment. */
	const copyUrl = () => {
		isCopied = true;
		setTimeout(() => (isCopied = false), 1500);
	};

	/** Live preview for one section of the input group docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "text" | "button" | "textarea" | "sizes" | "rounded" | "states";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Search with an icon at the start and a count at the end. -->
		<InputGroup>
			<InputGroupInput placeholder="Search..." />
			<InputGroupAddon><SearchIcon /></InputGroupAddon>
			<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
		</InputGroup>
	{:else if section === "text"}
		<!-- URL prefix and suffix, and an email icon. -->
		<InputGroup>
			<InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
			<InputGroupInput placeholder="example" />
			<InputGroupAddon align="inline-end"><InputGroupText>.com</InputGroupText></InputGroupAddon>
		</InputGroup>
		<InputGroup>
			<InputGroupAddon><MailIcon /></InputGroupAddon>
			<InputGroupInput type="email" placeholder="you@example.com" />
		</InputGroup>
	{:else if section === "button"}
		<!-- Copy button inside the field. -->
		<InputGroup>
			<InputGroupInput value="https://plainsv.com/r/input-group.json" readonly />
			<InputGroupAddon align="inline-end">
				<InputGroupButton size="icon-xs" aria-label="Copy" onclick={copyUrl}>
					{#if isCopied}<CheckIcon />{:else}<CopyIcon />{/if}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	{:else if section === "textarea"}
		<!-- Prompt box with a toolbar below the text. -->
		<InputGroup>
			<InputGroupTextarea placeholder="Ask, search, or chat..." />
			<InputGroupAddon align="block-end">
				<InputGroupButton variant="outline" size="icon-xs" rounded="pill" aria-label="Add file"><PlusIcon /></InputGroupButton>
				<InputGroupText>52% used</InputGroupText>
				<InputGroupButton variant="default" size="icon-xs" rounded="pill" aria-label="Send" style="margin-left: auto"><ArrowUpIcon /></InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	{:else if section === "sizes"}
		<!-- One group per size. -->
		{#each sizes as size (size)}
			<InputGroup {size}>
				<InputGroupInput placeholder="Size {size}" />
				<InputGroupAddon><SearchIcon /></InputGroupAddon>
			</InputGroup>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const as rounded (rounded)}
			<InputGroup {rounded}>
				<InputGroupInput placeholder="Rounded {rounded}" />
				<InputGroupAddon><SearchIcon /></InputGroupAddon>
			</InputGroup>
		{/each}
		<!-- A textarea group uses 3xl, since a pill would turn it into an oval. -->
		<InputGroup rounded="3xl">
			<InputGroupTextarea placeholder="Rounded 3xl with a textarea" />
			<InputGroupAddon align="block-end">
				<InputGroupButton variant="default" size="icon-xs" rounded="pill" aria-label="Send" style="margin-left: auto"><ArrowUpIcon /></InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	{:else if section === "states"}
		<!-- Disabled and invalid states come from the input. -->
		<InputGroup>
			<InputGroupInput placeholder="Disabled" disabled />
			<InputGroupAddon><SearchIcon /></InputGroupAddon>
		</InputGroup>
		<InputGroup>
			<InputGroupInput placeholder="Invalid" aria-invalid="true" />
			<InputGroupAddon><MailIcon /></InputGroupAddon>
		</InputGroup>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demo > :global(.inputGroup) {
		max-width: 24rem;
	}
</style>
