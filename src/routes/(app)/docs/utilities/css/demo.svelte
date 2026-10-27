<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "shimmer" }: Props = $props();
	const items = Array.from({ length: 12 }, (_, index) => `Item ${index + 1}`);
	const chips = Array.from({ length: 12 }, (_, index) => `Chip ${index + 1}`);
	const shimmerVariables: Example[] = [
		{ label: "--shimmer-color: var(--destructive)", style: "--shimmer-color: var(--destructive)", text: "Custom color" },
		{ label: "--shimmer-color: color-mix(...)", style: "--shimmer-color: color-mix(in oklch, var(--destructive) 50%, transparent)", text: "Custom color at 50%" },
		{ label: "--shimmer-duration: 0.75s", style: "--shimmer-duration: 0.75s", text: "Fast sweep" },
		{ label: "--shimmer-duration: 3s", style: "--shimmer-duration: 3s", text: "Slow sweep" },
		{ label: "--shimmer-spread: 1rem", style: "--shimmer-spread: 1rem", text: "Narrow highlight" },
		{ label: "--shimmer-spread: 5rem", style: "--shimmer-spread: 5rem", text: "Wide highlight" },
		{ label: "--shimmer-angle: 0deg", style: "--shimmer-angle: 0deg", text: "Straight highlight" },
		{ label: "--shimmer-angle: 60deg", style: "--shimmer-angle: 60deg", text: "Steep highlight" },
	];
	const verticalEdges: Example[] = [
		{ label: "scroll-fade-y", class: "scroll-fade-y" },
		{ label: "scroll-fade-t", class: "scroll-fade-t" },
		{ label: "scroll-fade-b", class: "scroll-fade-b" },
		{ label: "scroll-fade-none", class: "scroll-fade scroll-fade-none" },
	];
	const horizontalEdges: Example[] = [
		{ label: "scroll-fade-l", class: "scroll-fade-l" },
		{ label: "scroll-fade-r", class: "scroll-fade-r" },
		{ label: "scroll-fade-s", class: "scroll-fade-s" },
		{ label: "scroll-fade-e", class: "scroll-fade-e" },
		{ label: 'scroll-fade-x dir="rtl"', class: "scroll-fade-x", dir: "rtl" },
	];
	const scrollFadeVariables: Example[] = [
		{ label: "--scroll-fade-size: 4rem", style: "--scroll-fade-size: 4rem" },
		{ label: "--scroll-fade-t-size: 1rem; --scroll-fade-b-size: 5rem", style: "--scroll-fade-t-size: 1rem; --scroll-fade-b-size: 5rem" },
		{ label: "--scroll-fade-reveal: 1rem", style: "--scroll-fade-reveal: 1rem" },
		{ label: "--scroll-fade-reveal: 12rem", style: "--scroll-fade-reveal: 12rem" },
	];
	let replayCount = $state(0);
	let isLoading = $state(true);

	/** Live example for one section of the CSS utilities docs */
	interface Props {
		/** Which utility examples to demo */
		section?: "shimmer" | "shimmer-variables" | "shimmer-modifiers" | "scroll-fade" | "scroll-fade-edges" | "scroll-fade-variables";
	}

	/** One labeled example */
	interface Example {
		/** Caption shown above the example */
		label: string;
		/** Utility classes added to the example */
		class?: string;
		/** Inline CSS variables set on the example */
		style?: string;
		/** Text direction of the example */
		dir?: "ltr" | "rtl";
		/** Shimmer text */
		text?: string;
	}
</script>

<!-- Opt out of typeset so the docs prose styles don't add margins to the examples. -->
<div class="demo not-typeset">
	{#if section === "shimmer"}
		<!-- Default shimmer on muted text and on regular text. -->
		<figure class="demoExample">
			<figcaption class="demoLabel">shimmer</figcaption>
			<p class="demoText shimmer">Generating response...</p>
		</figure>
		<figure class="demoExample">
			<figcaption class="demoLabel">shimmer on foreground text</figcaption>
			<p class="demoText demoTextForeground shimmer">Thinking about your request...</p>
		</figure>
	{:else if section === "shimmer-variables"}
		<!-- One example per shimmer variable value. -->
		{#each shimmerVariables as example (example.label)}
			<figure class="demoExample">
				<figcaption class="demoLabel">{example.label}</figcaption>
				<p class="demoText shimmer" style={example.style}>{example.text}</p>
			</figure>
		{/each}
	{:else if section === "shimmer-modifiers"}
		<!-- Remount the text on replay so the single sweep runs again. -->
		<figure class="demoExample">
			<figcaption class="demoLabel">shimmer-once</figcaption>
			<div class="demoControls">
				{#key replayCount}
					<p class="demoText shimmer shimmer-once">Sweeps once</p>
				{/key}
				<Button size="xs" variant="outline" onclick={() => replayCount++}>Replay</Button>
			</div>
		</figure>
		<figure class="demoExample">
			<figcaption class="demoLabel">shimmer-reverse</figcaption>
			<p class="demoText shimmer shimmer-reverse">Sweeps the other way</p>
		</figure>
		<!-- Toggle shimmer-none to stop the effect without removing the shimmer class. -->
		<figure class="demoExample">
			<figcaption class="demoLabel">shimmer-none</figcaption>
			<div class="demoControls">
				<p class={["demoText shimmer", !isLoading && "shimmer-none"]}>{isLoading ? "Loading results..." : "Results loaded"}</p>
				<Button size="xs" variant="outline" onclick={() => (isLoading = !isLoading)}>{isLoading ? "Finish loading" : "Start loading"}</Button>
			</div>
		</figure>
		<figure class="demoExample">
			<figcaption class="demoLabel">shimmer dir="rtl"</figcaption>
			<p class="demoText shimmer" dir="rtl">جارٍ إنشاء الرد...</p>
		</figure>
	{:else if section === "scroll-fade"}
		<!-- Default vertical and horizontal fades. -->
		<figure class="demoExample">
			<figcaption class="demoLabel">scroll-fade</figcaption>
			<ul class="demoList scroll-fade">
				{#each items as item (item)}
					<li class="demoListItem">{item}</li>
				{/each}
			</ul>
		</figure>
		<figure class="demoExample">
			<figcaption class="demoLabel">scroll-fade-x</figcaption>
			<ul class="demoRow scroll-fade-x">
				{#each chips as chip (chip)}
					<li class="demoChip">{chip}</li>
				{/each}
			</ul>
		</figure>
	{:else if section === "scroll-fade-edges"}
		<!-- Vertical edge classes side by side. -->
		<div class="demoGrid">
			{#each verticalEdges as example (example.label)}
				<figure class="demoExample">
					<figcaption class="demoLabel">{example.label}</figcaption>
					<ul class="demoList demoListSmall {example.class}">
						{#each items as item (item)}
							<li class="demoListItem">{item}</li>
						{/each}
					</ul>
				</figure>
			{/each}
		</div>

		<!-- Horizontal edge classes, including logical edges and a right-to-left row. -->
		{#each horizontalEdges as example (example.label)}
			<figure class="demoExample">
				<figcaption class="demoLabel">{example.label}</figcaption>
				<ul class="demoRow {example.class}" dir={example.dir}>
					{#each chips as chip (chip)}
						<li class="demoChip">{chip}</li>
					{/each}
				</ul>
			</figure>
		{/each}
	{:else if section === "scroll-fade-variables"}
		<!-- One vertical list per scroll fade variable value. -->
		<div class="demoGrid">
			{#each scrollFadeVariables as example (example.label)}
				<figure class="demoExample">
					<figcaption class="demoLabel">{example.label}</figcaption>
					<ul class="demoList demoListSmall scroll-fade" style={example.style}>
						{#each items as item (item)}
							<li class="demoListItem">{item}</li>
						{/each}
					</ul>
				</figure>
			{/each}
		</div>
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

	.demoGrid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
	}

	.demoExample {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		min-width: 0;
	}

	.demoLabel {
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		font-family: var(--font-mono, ui-monospace, monospace);
	}

	.demoControls {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	/* The sweep spans the element's full width, so fit it to the text. */
	.demoText {
		width: fit-content;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.demoTextForeground {
		color: var(--foreground);
	}

	.demoList {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-sm);
		width: 100%;
		max-width: 16rem;
		height: 12rem;
		overflow-y: auto;
		list-style: none;
	}

	.demoListSmall {
		width: 10rem;
		height: 10rem;
	}

	.demoListItem {
		border-radius: var(--radius-md);
		background-color: var(--muted);
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: var(--text-sm);
	}

	.demoRow {
		display: flex;
		gap: var(--spacing-sm);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-sm);
		width: 100%;
		max-width: 28rem;
		overflow-x: auto;
		list-style: none;
	}

	.demoChip {
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background-color: var(--muted);
		padding: var(--spacing-xs) var(--spacing-md);
		font-size: var(--text-sm);
	}
</style>
