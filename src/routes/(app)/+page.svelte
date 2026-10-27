<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { appData, componentLinks } from "#lib/data/app.js";
	import { Avatar, AvatarFallback } from "#lib/components/ui/avatar/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Kbd, KbdGroup } from "#lib/components/ui/kbd/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { PackageCommand } from "#lib/components/ui/package-command/index.js";
	import { Progress } from "#lib/components/ui/progress/index.js";
	import { Slider } from "#lib/components/ui/slider/index.js";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import { Switch } from "#lib/components/ui/switch/index.js";
	import { ArrowRightIcon } from "@lucide/svelte";

	const radii: UiRounded[] = ["xs", "md", "xl", "3xl", "pill"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;
	const people = ["AT", "JL", "MK", "RS"];
	// Split the component names into two rows that scroll in opposite directions.
	const half = Math.ceil(componentLinks.length / 2);
	const marqueeRows = [componentLinks.slice(0, half), componentLinks.slice(half)];
	let volume = $state([40]);
</script>

<PageMeta />

<!-- Home: centered hero, a bento grid of live components, and every component name. -->
<main class="catalog">
	<header class="catalogHero">
		<Badge variant="outline" size="lg" rounded="pill" href="/docs/components">
			{componentLinks.length} components · Svelte 5 runes
			<ArrowRightIcon />
		</Badge>
		<h1 class="catalogTitle">Build with plain Svelte.</h1>
		<p class="catalogDescription">{appData.description}</p>
		<div class="catalogActions">
			<Button size="lg" rounded="xl" href="/docs">Get started</Button>
			<Button size="lg" rounded="xl" variant="outline" href="/examples">See examples</Button>
		</div>
		<PackageCommand class="catalogCommand" command="remote0 add https://plainsv.com/r/button.json" />
	</header>

	<!-- Bento grid; each tile is a live component and a link to its docs. -->
	<section class="catalogGrid" aria-label="Component previews">
		<article class="catalogTile catalogTileWide">
			<div class="catalogDemo">
				<div class="catalogStack">
					{#each radii as item (item)}
						<Button rounded={item} variant={item === "pill" ? "default" : "outline"}>{item}</Button>
					{/each}
				</div>
			</div>
			<a class="catalogTileLink" href="/docs/styling"><span>Rounded</span><span class="catalogTileText">One prop, from <code>xs</code> to <code>pill</code></span></a>
		</article>

		<article class="catalogTile">
			<div class="catalogDemo catalogDemoColumn">
				<div class="catalogField">
					<Label for="catalogWifi">Wi-Fi</Label>
					<Switch id="catalogWifi" defaultChecked />
				</div>
				<div class="catalogField">
					<Label for="catalogBluetooth">Bluetooth</Label>
					<Switch id="catalogBluetooth" />
				</div>
			</div>
			<a class="catalogTileLink" href="/docs/components/switch"><span>Switch</span><ArrowRightIcon /></a>
		</article>

		<article class="catalogTile">
			<div class="catalogDemo catalogDemoColumn">
				<Slider bind:value={volume} thumbLabels={["Volume"]} />
				<Progress value={volume[0]} aria-label="Volume level" />
				<span class="catalogValue">{volume[0]}%</span>
			</div>
			<a class="catalogTileLink" href="/docs/components/slider"><span>Slider</span><ArrowRightIcon /></a>
		</article>

		<article class="catalogTile">
			<div class="catalogDemo">
				<div class="catalogAvatars">
					{#each people as person (person)}
						<Avatar size="lg" variant="outline"><AvatarFallback>{person}</AvatarFallback></Avatar>
					{/each}
				</div>
			</div>
			<a class="catalogTileLink" href="/docs/components/avatar"><span>Avatar</span><ArrowRightIcon /></a>
		</article>

		<article class="catalogTile">
			<div class="catalogDemo catalogDemoColumn">
				<Input type="search" placeholder="Search docs…" aria-label="Search docs" />
				<span class="catalogHint">Press <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup> anywhere</span>
			</div>
			<a class="catalogTileLink" href="/docs/components/input"><span>Input</span><ArrowRightIcon /></a>
		</article>

		<article class="catalogTile catalogTileWide">
			<div class="catalogDemo">
				<div class="catalogStack">
					{#each sizes as item (item)}
						<Button size={item} variant="secondary">Size {item}</Button>
					{/each}
				</div>
			</div>
			<a class="catalogTileLink" href="/docs/components/button"><span>Size</span><span class="catalogTileText">Padding, text, and radius scale together</span></a>
		</article>

		<article class="catalogTile">
			<div class="catalogDemo">
				<div class="catalogStack">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="destructive">Destructive</Badge>
				</div>
			</div>
			<a class="catalogTileLink" href="/docs/components/badge"><span>Badge</span><ArrowRightIcon /></a>
		</article>

		<article class="catalogTile catalogTileWide">
			<div class="catalogDemo">
				<div class="catalogStack">
					{#each variants as item (item)}
						<Button variant={item}>{item}</Button>
					{/each}
				</div>
			</div>
			<a class="catalogTileLink" href="/docs/styling"><span>Variant</span><span class="catalogTileText">The shadcn names you already know</span></a>
		</article>

		<article class="catalogTile">
			<div class="catalogDemo catalogDemoColumn">
				<div class="catalogStack">
					{#each sizes as item (item)}
						<Spinner size={item} />
					{/each}
				</div>
				<span class="catalogHint shimmer">Generating your app…</span>
			</div>
			<a class="catalogTileLink" href="/docs/components/spinner"><span>Spinner</span><ArrowRightIcon /></a>
		</article>
	</section>

	<!-- Every component name, scrolling slowly; it stops for reduced motion. -->
	<nav class="catalogMarquee" aria-label="All components">
		{#each marqueeRows as row, rowIndex (rowIndex)}
			<div class={["catalogMarqueeRow", rowIndex === 1 && "catalogMarqueeReverse"]}>
				<!-- Render the row twice so the loop has no gap; hide the copy from assistive tech. -->
				{#each [0, 1] as copy (copy)}
					<ul class="catalogMarqueeList" aria-hidden={copy === 1}>
						{#each row as link (link.href)}
							<li><a href={link.href} tabindex={copy === 1 ? -1 : undefined}>{link.label}</a></li>
						{/each}
					</ul>
				{/each}
			</div>
		{/each}
	</nav>
</main>

<style>
	.catalog {
		display: flex;
		flex-direction: column;
		gap: 5rem;
		padding: 4rem 0 6rem;
	}

	/* Hero */
	.catalogHero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xl);
		text-align: center;
	}

	.catalogTitle {
		font-weight: 600;
		font-size: clamp(2.75rem, 8vw, 5.5rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
	}

	.catalogDescription {
		max-width: 36rem;
		color: var(--muted-foreground);
		font-size: var(--text-md);
		line-height: 1.6;
		text-wrap: balance;
	}

	.catalogActions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--spacing-md);
	}

	.catalogHero :global(.catalogCommand) {
		width: 100%;
		max-width: 34rem;
		text-align: start;
	}

	/* Grid */
	.catalogGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
		gap: var(--spacing-lg);
	}

	.catalogTile {
		display: flex;
		flex-direction: column;
		transition: border-color 150ms;
		border: 1px solid var(--border);
		border-radius: var(--radius-2xl);
		background-color: var(--card);
		overflow: hidden;
	}

	.catalogDemo {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		background-image: radial-gradient(color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px);
		background-size: 1rem 1rem;
		padding: 2rem var(--spacing-xl);
		min-height: 11rem;
	}

	.catalogDemoColumn {
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-lg);
	}

	.catalogStack {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.catalogField {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
	}

	.catalogValue {
		align-self: flex-end;
		color: var(--muted-foreground);
		font-size: var(--text-xs);
		font-family: var(--font-mono, ui-monospace, monospace);
	}

	.catalogAvatars {
		display: flex;
	}

	.catalogAvatars > :global(* + *) {
		margin-inline-start: calc(var(--spacing-sm) * -1);
		box-shadow: 0 0 0 2px var(--card);
	}

	.catalogHint {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--muted-foreground);
		font-size: var(--text-xs);
	}

	.catalogTileLink {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
		border-top: 1px solid var(--border);
		padding: var(--spacing-md) var(--spacing-lg);
		color: var(--foreground);
		font-weight: 500;
		font-size: var(--text-sm);
	}

	.catalogTileLink :global(svg) {
		width: 1rem;
		height: 1rem;
		color: var(--muted-foreground);
	}

	.catalogTileText {
		color: var(--muted-foreground);
		font-weight: 400;
		text-align: end;
	}

	.catalogTileText code {
		font-family: var(--font-mono, ui-monospace, monospace);
	}

	/* Marquee */
	.catalogMarquee {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
		overflow: hidden;
	}

	.catalogMarqueeRow {
		display: flex;
		animation: catalogMarquee 80s linear infinite;
		width: max-content;
	}

	.catalogMarqueeReverse {
		animation-direction: reverse;
	}

	.catalogMarqueeList {
		display: flex;
		gap: var(--spacing-sm);
		margin: 0;
		padding: 0 var(--spacing-sm) 0 0;
		list-style: none;
	}

	.catalogMarqueeList a {
		display: inline-flex;
		transition:
			border-color 150ms,
			color 150ms;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		padding: var(--spacing-sm) var(--spacing-lg);
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		white-space: nowrap;
	}

	@keyframes catalogMarquee {
		to {
			transform: translateX(-50%);
		}
	}

	/* States */
	.catalogTile:has(.catalogTileLink:hover) {
		border-color: var(--ring);
	}

	.catalogTileLink:focus-visible,
	.catalogMarqueeList a:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.catalogMarqueeList a:hover {
		border-color: var(--ring);
		color: var(--foreground);
	}

	.catalogMarquee:hover .catalogMarqueeRow,
	.catalogMarquee:focus-within .catalogMarqueeRow {
		animation-play-state: paused;
	}

	@media (min-width: 64rem) {
		.catalogTileWide {
			grid-column: span 2;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.catalogMarquee {
			overflow-x: auto;
		}

		.catalogMarqueeRow {
			animation: none;
		}
	}
</style>
