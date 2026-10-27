<script lang="ts">
	import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "#lib/components/ui/navigation-menu/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CircleHelpIcon, CircleIcon, CircleCheckIcon, LayoutGridIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const components = [
		{ title: "Alert", href: "/docs/components/alert", description: "A callout for important messages." },
		{ title: "Dialog", href: "/docs/components/dialog", description: "A modal window with a trigger and content." },
		{ title: "Progress", href: "/docs/components/progress", description: "Shows how far a task has come." },
		{ title: "Tabs", href: "/docs/components/tabs", description: "Panels shown one at a time." },
	];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	const variants = ["default", "outline", "ghost", "secondary"] as const;
	let openValue = $state("");

	/** Live preview for one section of the navigation menu docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "links" | "controlled" | "variants" | "sizes" | "rounded" | "overrides" | "trigger";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Two items with content panels and a top-level link. -->
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul class="demoGrid">
							<li class="demoFeatured">
								<NavigationMenuLink href="/docs">
									<span class="demoLinkTitle">PlainSv</span>
									<span class="demoLinkText">Components styled with Svelte style blocks and theme tokens.</span>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="/docs">
									<span class="demoLinkTitle">Introduction</span>
									<span class="demoLinkText">What the registry holds and how it is built.</span>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="/docs/components">
									<span class="demoLinkTitle">Installation</span>
									<span class="demoLinkText">Add any item with the remote0 CLI.</span>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Components</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul class="demoGrid demoGridTwo">
							{#each components as component (component.title)}
								<li>
									<NavigationMenuLink href={component.href}>
										<span class="demoLinkTitle">{component.title}</span>
										<span class="demoLinkText">{component.description}</span>
									</NavigationMenuLink>
								</li>
							{/each}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink href="/docs/components">Docs</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	{:else if section === "links"}
		<!-- Simple and icon links, an active top-level link, and content aligned to the end. -->
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink href="/docs" active>Home</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Simple</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul class="demoStack">
							<li><NavigationMenuLink href="/docs/components">Components</NavigationMenuLink></li>
							<li><NavigationMenuLink href="/docs">Get started</NavigationMenuLink></li>
							<li><NavigationMenuLink href="/examples">Examples</NavigationMenuLink></li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>With icon</NavigationMenuTrigger>
					<NavigationMenuContent align="end">
						<ul class="demoStack">
							<li><NavigationMenuLink href="##" class="demoIconLink"><CircleHelpIcon />Backlog</NavigationMenuLink></li>
							<li><NavigationMenuLink href="##" class="demoIconLink"><CircleIcon />To do</NavigationMenuLink></li>
							<li><NavigationMenuLink href="##" class="demoIconLink"><CircleCheckIcon />Done</NavigationMenuLink></li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	{:else if section === "controlled"}
		<!-- Open item bound to a variable. -->
		<NavigationMenu bind:value={openValue}>
			<NavigationMenuList>
				{#each ["docs", "blog"] as item (item)}
					<NavigationMenuItem value={item}>
						<NavigationMenuTrigger>{item === "docs" ? "Docs" : "Blog"}</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul class="demoStack">
								<li><NavigationMenuLink href="##">Latest</NavigationMenuLink></li>
								<li><NavigationMenuLink href="##">Archive</NavigationMenuLink></li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				{/each}
			</NavigationMenuList>
		</NavigationMenu>
		<p class="demoValue">Open: {openValue || "none"}</p>
	{:else if section === "variants"}
		<!-- One menu per variant; triggers and top-level links follow it. -->
		{#each variants as variant (variant)}
			<NavigationMenu {variant} aria-label="Variant {variant}">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>{variant}</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul class="demoStack">
								<li><NavigationMenuLink href="##">Components</NavigationMenuLink></li>
								<li><NavigationMenuLink href="##">Plugins</NavigationMenuLink></li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="##">Docs</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		{/each}
	{:else if section === "sizes"}
		<!-- One menu per size; triggers, panels, and links follow the size. -->
		{#each sizes as size (size)}
			<NavigationMenu {size} aria-label="Size {size}">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Size {size}</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul class="demoStack">
								<li><NavigationMenuLink href="##">Components</NavigationMenuLink></li>
								<li><NavigationMenuLink href="##">Plugins</NavigationMenuLink></li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="##">Docs</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<NavigationMenu {rounded} aria-label="Rounded {rounded}">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Rounded {rounded}</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul class="demoStack">
								<li><NavigationMenuLink href="##">Components</NavigationMenuLink></li>
								<li><NavigationMenuLink href="##">Plugins</NavigationMenuLink></li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		{/each}
	{:else if section === "overrides"}
		<!-- Parts that set their own variant, size, and radius over the menu's. -->
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Default</NavigationMenuTrigger>
					<NavigationMenuContent size="lg" rounded="lg">
						<ul class="demoStack">
							<li><NavigationMenuLink href="##">Components</NavigationMenuLink></li>
							<li><NavigationMenuLink href="##" rounded="pill">Plugins</NavigationMenuLink></li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger variant="outline" rounded="pill">Pill</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul class="demoStack">
							<li><NavigationMenuLink href="##">Latest</NavigationMenuLink></li>
							<li><NavigationMenuLink href="##">Archive</NavigationMenuLink></li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink href="##" variant="secondary" size="sm">Sign in</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	{:else if section === "trigger"}
		<!-- Custom ghost button with an icon in place of the default trigger. -->
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						{#snippet trigger({ props })}
							<Button variant="ghost" {...props}>
								<LayoutGridIcon />
								Components
							</Button>
						{/snippet}
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul class="demoGrid demoGridTwo">
							{#each components as component (component.title)}
								<li>
									<NavigationMenuLink href={component.href}>
										<span class="demoLinkTitle">{component.title}</span>
										<span class="demoLinkText">{component.description}</span>
									</NavigationMenuLink>
								</li>
							{/each}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
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
		min-height: 6rem;
	}

	/* Panel layouts; lists drop their bullets and spacing */
	.demoGrid,
	.demoStack {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.demoGrid {
		display: grid;
		grid-template-columns: 0.75fr 1fr;
		gap: var(--spacing-xs);
		width: 28rem;
		max-width: 100%;
	}

	.demoGridTwo {
		grid-template-columns: 1fr 1fr;
		width: 32rem;
	}

	/* Featured link spans both rows of the first column */
	.demoFeatured {
		grid-row: span 2;
	}

	.demoFeatured :global(.navigationMenuLink) {
		justify-content: flex-end;
		box-sizing: border-box;
		background: linear-gradient(to bottom, var(--muted), color-mix(in oklab, var(--muted) 50%, transparent));
		padding: var(--spacing-lg);
		height: 100%;
	}

	.demoStack {
		display: flex;
		flex-direction: column;
		width: 12rem;
	}

	.demo :global(.demoIconLink) {
		flex-direction: row;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.demoLinkTitle {
		font-weight: 500;
	}

	.demoLinkText {
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		line-height: 1.375;
	}

	.demoValue {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
