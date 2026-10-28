<script lang="ts">
	import { appData, mainNavLinks } from "#lib/data/app.js";
	import { useAppCtx } from "#lib/context/app.svelte.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "#lib/components/ui/navigation-menu/index.js";
	import { Logo, SearchMenu } from "#lib/components/shared/index.js";
	import { MoonIcon, SunIcon, SearchIcon } from "@lucide/svelte";
	import { IconBrandGithub } from "@tabler/icons-svelte";
	import type { LayoutProps } from "./$types";
	const app = useAppCtx();
	const { children }: LayoutProps = $props();
	let isSearchOpen = $state(false);
	const ThemeIcon = $derived(app.isDarkMode ? SunIcon : MoonIcon);
</script>

<div class="app">
	<header class="navHeader">
		<div class="nav maxWidth">
			<Logo href="/" />
			<!-- Main nav; each item opens a panel of its pages on hover. -->
			<NavigationMenu rounded="2xl" class="mainNav">
				<NavigationMenuList>
					<!-- Plain link to the getting started docs. -->
					<NavigationMenuItem>
						<NavigationMenuLink size="sm" rounded="lg" href="/docs" active={app.currentPathname === "/docs"}>Docs</NavigationMenuLink>
					</NavigationMenuItem>
					{#each mainNavLinks as navItem (navItem.href)}
						<NavigationMenuItem value={navItem.label}>
							<NavigationMenuTrigger size="sm" rounded="lg">{navItem.label}</NavigationMenuTrigger>
							<NavigationMenuContent align="end">
								<div class="mainNavPanel">
									<div class="mainNavPanelHeader">
										<NavigationMenuLink class="mainNavPanelLink" href={navItem.href} active={navItem.href === app.currentPathname}>
											<span class="mainNavLinkTitle">All {navItem.label.toLowerCase()}</span>
										</NavigationMenuLink>
										<!-- Search button opens the docs search. -->
										<Button size="icon-sm" variant="ghost" aria-label="Search docs" title="Search docs (⌘K)" onclick={() => (isSearchOpen = true)}>
											<SearchIcon />
										</Button>
									</div>
									<!-- Long lists, such as components, wrap into columns; every list scrolls down. -->
									<ul class={["mainNavLinks scroll-fade-y", navItem.links.length > 12 && "mainNavLinksColumns"]}>
										{#each navItem.links as link (link.href)}
											<li>
												<NavigationMenuLink rounded="lg" href={link.href} active={link.href === app.currentPathname}>
													<span class="mainNavLinkTitle">{link.label}</span>
													<!-- Show the description only when the link has one. -->
													{#if "description" in link}
														<span class="mainNavLinkText">{link.description}</span>
													{/if}
												</NavigationMenuLink>
											</li>
										{/each}
									</ul>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
					{/each}
				</NavigationMenuList>
			</NavigationMenu>
			<!-- On mobile, a search button replaces the main nav links. -->
			<Button class="mobileSearch" size="sm" variant="outline" rounded="lg" aria-label="Search docs" onclick={() => (isSearchOpen = true)}>
				<SearchIcon />
				Search docs
			</Button>
			<!-- Docs search, opened by the panel button, the mobile button, or Cmd+K. -->
			<SearchMenu bind:open={isSearchOpen} />
			<!-- GitHub repository link -->
			<Button href={appData.githubUrl} target="_blank" rel="noreferrer" size="icon-sm" variant="outline" rounded="lg" aria-label="GitHub repository" title="GitHub repository">
				<IconBrandGithub />
			</Button>
			<!-- Dark mode theme toggler -->
			<Button size="icon-sm" variant="outline" rounded="lg" aria-label="Toggle dark mode" onclick={() => app.toggleDarkMode()}>
				<ThemeIcon />
			</Button>
		</div>
	</header>
	<div class="content maxWidth">
		{@render children()}
	</div>
	<!-- Site footer with credits and the source link -->
	<footer class="footer maxWidth">
		<p>
			Built by <a href={appData.authorUrl} target="_blank" rel="noreferrer">DimeloTony</a>. The source code is available on
			<a href={appData.githubUrl} target="_blank" rel="noreferrer">GitHub</a>.
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		background-color: var(--background);
		width: 100%;
		min-height: 100dvh;
		overflow-x: clip;
		color: var(--foreground);
	}
	.navHeader {
		position: sticky;
		top: 0;
		z-index: 1;
		backdrop-filter: blur(4px);
		box-shadow: 0 1px 0 var(--border);
		height: var(--nav-height);
	}
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-sm);
		height: 100%;
	}
	.nav :global(.mainNav) {
		margin-left: auto;
	}
	.nav :global(.mobileSearch) {
		display: none;
		margin-left: auto;
	}
	/* On small screens, hide the main nav links and show the search button instead */
	@media (max-width: 48rem) {
		.nav :global(.mainNav) {
			display: none;
		}
		.nav :global(.mobileSearch) {
			display: inline-flex;
		}
	}
	.mainNavPanel {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		width: 28rem;
		max-width: 100%;
	}
	.mainNavPanelHeader {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}
	.mainNavPanelHeader :global(.mainNavPanelLink) {
		flex: 1;
	}
	.mainNavLinks {
		display: flex;
		flex-direction: column;
		margin: 0;
		border-top: 1px solid var(--border);
		padding: var(--spacing-xs) 0 0;
		max-height: 24rem;
		overflow-y: auto;
		list-style: none;
	}
	/* Long lists, such as components, wrap into three columns and scroll down */
	.mainNavLinksColumns {
		column-gap: var(--spacing-xs);
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
	}
	.mainNavLinksColumns li {
		flex: 0 0 calc((100% - var(--spacing-xs) * 2) / 3);
		min-width: 0;
	}
	.mainNavLinkTitle {
		font-weight: 500;
	}
	.mainNavLinkText {
		color: var(--muted-foreground);
		line-height: var(--line-height-sm);
	}
	.content {
		flex: 1;
		padding-top: 1rem;
	}
	.footer {
		padding: var(--spacing-xl) 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		text-align: center;
	}
	.footer p {
		margin: 0;
	}
	.footer a {
		color: var(--foreground);
		text-decoration: underline;
		text-underline-offset: 0.25rem;
	}
	.footer a:hover {
		color: var(--muted-foreground);
	}
</style>
