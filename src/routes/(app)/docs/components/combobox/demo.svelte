<script lang="ts">
	import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem, ComboboxSeparator } from "#lib/components/ui/combobox/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { ChevronsUpDownIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const frameworks = [
		{ value: "sveltekit", label: "SvelteKit" },
		{ value: "next", label: "Next.js" },
		{ value: "nuxt", label: "Nuxt" },
		{ value: "remix", label: "Remix" },
		{ value: "astro", label: "Astro" },
	];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let framework = $state("sveltekit");
	const frameworkLabel = $derived(frameworks.find((item) => item.value === framework)?.label);

	/** Live preview for one section of the combobox docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "groups" | "controlled" | "sizes" | "rounded" | "states" | "trigger";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Searchable list of frameworks, used at the top of the page. -->
		<Combobox>
			<ComboboxTrigger class="demoTrigger">
				<ComboboxValue placeholder="Select framework..." />
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxInput placeholder="Search framework..." />
				<ComboboxList>
					<ComboboxEmpty>No framework found.</ComboboxEmpty>
					<ComboboxGroup>
						{#each frameworks as item (item.value)}
							<ComboboxItem value={item.value}>{item.label}</ComboboxItem>
						{/each}
					</ComboboxGroup>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	{:else if section === "groups"}
		<!-- Grouped options with headings, a separator, and keywords. -->
		<Combobox>
			<ComboboxTrigger class="demoTrigger">
				<ComboboxValue placeholder="Select timezone..." />
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxInput placeholder="Search timezone..." />
				<ComboboxList>
					<ComboboxEmpty>No timezone found.</ComboboxEmpty>
					<ComboboxGroup heading="Americas">
						<ComboboxItem value="America/New_York" keywords={["est", "eastern"]}>New York</ComboboxItem>
						<ComboboxItem value="America/Los_Angeles" keywords={["pst", "pacific"]}>Los Angeles</ComboboxItem>
					</ComboboxGroup>
					<ComboboxSeparator />
					<ComboboxGroup heading="Europe">
						<ComboboxItem value="Europe/London" keywords={["gmt"]}>London</ComboboxItem>
						<ComboboxItem value="Europe/Paris" keywords={["cet"]}>Paris</ComboboxItem>
					</ComboboxGroup>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	{:else if section === "controlled"}
		<!-- Value bound to state; the label prop names the starting value before the list first opens. -->
		<Combobox bind:value={framework}>
			<ComboboxTrigger class="demoTrigger">
				<ComboboxValue placeholder="Select framework..." label={frameworkLabel} />
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxInput placeholder="Search framework..." />
				<ComboboxList>
					<ComboboxEmpty>No framework found.</ComboboxEmpty>
					<ComboboxGroup>
						{#each frameworks as item (item.value)}
							<ComboboxItem value={item.value}>{item.label}</ComboboxItem>
						{/each}
					</ComboboxGroup>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
		<p class="demoValue">Value: {framework || "none"}</p>
	{:else if section === "sizes"}
		<!-- One combobox per size; the trigger, input, and items follow the size. -->
		{#each sizes as size (size)}
			<Combobox {size}>
				<ComboboxTrigger class="demoTrigger">
					<ComboboxValue placeholder="Size {size}" />
				</ComboboxTrigger>
				<ComboboxContent>
					<ComboboxInput placeholder="Search..." />
					<ComboboxList>
						<ComboboxGroup>
							{#each frameworks as item (item.value)}
								<ComboboxItem value={item.value}>{item.label}</ComboboxItem>
							{/each}
						</ComboboxGroup>
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Combobox {rounded}>
				<ComboboxTrigger class="demoTrigger">
					<ComboboxValue placeholder="Rounded {rounded}" />
				</ComboboxTrigger>
				<ComboboxContent>
					<ComboboxInput placeholder="Search..." />
					<ComboboxList>
						<ComboboxGroup>
							{#each frameworks as item (item.value)}
								<ComboboxItem value={item.value}>{item.label}</ComboboxItem>
							{/each}
						</ComboboxGroup>
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		{/each}
	{:else if section === "states"}
		<!-- A disabled combobox, and a list with a disabled item. -->
		<Combobox disabled>
			<ComboboxTrigger class="demoTrigger">
				<ComboboxValue placeholder="Disabled" />
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxList>
					<ComboboxEmpty>No framework found.</ComboboxEmpty>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
		<Combobox>
			<ComboboxTrigger class="demoTrigger">
				<ComboboxValue placeholder="Disabled item" />
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxInput placeholder="Search framework..." />
				<ComboboxList>
					<ComboboxGroup>
						{#each frameworks as item (item.value)}
							<ComboboxItem value={item.value} disabled={item.value === "remix"}>{item.label}</ComboboxItem>
						{/each}
					</ComboboxGroup>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	{:else if section === "trigger"}
		<!-- Ghost button that holds the value in place of the default trigger. -->
		<Combobox>
			<ComboboxTrigger>
				{#snippet trigger({ props })}
					<Button variant="ghost" {...props}>
						<ComboboxValue placeholder="Select framework..." />
						<ChevronsUpDownIcon />
					</Button>
				{/snippet}
			</ComboboxTrigger>
			<ComboboxContent>
				<ComboboxInput placeholder="Search framework..." />
				<ComboboxList>
					<ComboboxEmpty>No framework found.</ComboboxEmpty>
					<ComboboxGroup>
						{#each frameworks as item (item.value)}
							<ComboboxItem value={item.value}>{item.label}</ComboboxItem>
						{/each}
					</ComboboxGroup>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
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

	/* A fixed width keeps the trigger steady as the value changes */
	.demo :global(.demoTrigger) {
		width: 12.5rem;
	}

	.demoValue {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
