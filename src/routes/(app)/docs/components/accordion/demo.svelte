<script lang="ts">
	import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "#lib/components/ui/accordion/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { PlusIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const faqs = [
		{ value: "item-1", question: "Is it accessible?", answer: "Yes. It adheres to the WAI-ARIA design pattern." },
		{ value: "item-2", question: "Is it styled?", answer: "Yes. It comes with default styles that match the other components." },
		{ value: "item-3", question: "Is it animated?", answer: "Yes. It slides open and closed, unless you ask for reduced motion." },
	];
	let openValues: string[] = $state(["item-2"]);

	/** Live preview for one section of the accordion docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "multiple" | "controlled" | "disabled" | "variant" | "size" | "rounded" | "trigger";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- One item open at a time. -->
		<Accordion>
			{#each faqs as faq (faq.value)}
				<AccordionItem value={faq.value}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else if section === "multiple"}
		<!-- Several items open at once, two open at the start. -->
		<Accordion multiple defaultValue={["item-1", "item-2"]}>
			{#each faqs as faq (faq.value)}
				<AccordionItem value={faq.value}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else if section === "controlled"}
		<!-- Open values bound to a variable and changed from outside the accordion. -->
		<div class="demoActions">
			<Button variant="outline" size="sm" onclick={() => (openValues = ["item-3"])}>Open the last item</Button>
			<Button variant="outline" size="sm" onclick={() => (openValues = [])}>Close all</Button>
			<p class="demoText">Open: {JSON.stringify(openValues)}</p>
		</div>
		<Accordion bind:value={openValues}>
			{#each faqs as faq (faq.value)}
				<AccordionItem value={faq.value}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else if section === "disabled"}
		<!-- The middle item cannot be opened, and the arrow keys skip it. -->
		<Accordion>
			{#each faqs as faq, index (faq.value)}
				<AccordionItem value={faq.value} disabled={index === 1}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else if section === "variant"}
		<!-- Bordered box around the items. -->
		<Accordion variant="outline">
			{#each faqs as faq (faq.value)}
				<AccordionItem value={faq.value}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else if section === "size"}
		<!-- Each size, in the outline variant so the padding shows. -->
		{#each sizes as size (size)}
			<Accordion variant="outline" {size}>
				<AccordionItem value="item">
					<AccordionTrigger>Size {size}</AccordionTrigger>
					<AccordionContent>Padding, text, and the chevron follow the size.</AccordionContent>
				</AccordionItem>
			</Accordion>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Accordion variant="outline" {rounded}>
				<AccordionItem value="item">
					<AccordionTrigger>Rounded {rounded}</AccordionTrigger>
					<AccordionContent>The box and the focus ring use this radius.</AccordionContent>
				</AccordionItem>
			</Accordion>
		{/each}
	{:else if section === "trigger"}
		<!-- Custom trigger whose plus turns into a cross while open. -->
		<Accordion>
			{#each faqs as faq (faq.value)}
				<AccordionItem value={faq.value}>
					<AccordionTrigger>
						{#snippet trigger({ props })}
							<button class="demoTrigger" type="button" {...props}>
								<PlusIcon aria-hidden="true" />
								{faq.question}
							</button>
						{/snippet}
					</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoActions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.demoText {
		margin: 0;
		font-size: var(--text-sm);
	}

	/* Custom trigger with a leading plus */
	.demoTrigger {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		cursor: pointer;
		outline: none;
		border: 0;
		background-color: transparent;
		padding: var(--spacing-lg) 0;
		width: 100%;
		color: inherit;
		font: inherit;
		font-weight: 500;
		text-align: left;
	}

	.demoTrigger :global(svg) {
		flex-shrink: 0;
		transition: rotate 200ms cubic-bezier(0.4, 0, 0.2, 1);
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
		color: var(--muted-foreground);
	}

	.demoTrigger:focus-visible {
		text-decoration: underline;
	}

	/* The plus turns into a cross while open */
	.demoTrigger[data-state="open"] :global(svg) {
		rotate: 45deg;
	}
</style>
