<script lang="ts">
	import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, type BreadcrumbProps } from "#lib/components/ui/breadcrumb/index.js";
	import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "#lib/components/ui/dropdown-menu/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { HouseIcon, SlashIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];

	/** Live preview for one section of the breadcrumb docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "separator" | "dropdown" | "collapsed" | "icons" | "sizes";
	}
</script>

<!-- Home, Components, and the current page, reused by the sizes section. -->
{#snippet basicBreadcrumb(props: Omit<BreadcrumbProps, "children">)}
	<Breadcrumb {...props}>
		<BreadcrumbList>
			<BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem><BreadcrumbLink href="/docs/components">Components</BreadcrumbLink></BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Collapsed middle items in a menu, used at the top of the page. -->
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<DropdownMenu size="lg">
						<DropdownMenuTrigger>
							{#snippet trigger({ props })}
								<Button variant="ghost" size="icon-sm" aria-label="Show more pages" {...props}><BreadcrumbEllipsis /></Button>
							{/snippet}
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Documentation</DropdownMenuItem>
							<DropdownMenuItem>Themes</DropdownMenuItem>
							<DropdownMenuItem>GitHub</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbLink href="/docs/components">Components</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	{:else if section === "separator"}
		<!-- Slash icon in place of the default chevron. -->
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
				<BreadcrumbItem><BreadcrumbLink href="/docs/components">Components</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
				<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	{:else if section === "dropdown"}
		<!-- The current section opens a menu of its siblings. -->
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<DropdownMenu size="lg">
						<DropdownMenuTrigger>
							{#snippet trigger({ props })}
								<button class="demoMenuTrigger" {...props}>Components</button>
							{/snippet}
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Documentation</DropdownMenuItem>
							<DropdownMenuItem>Themes</DropdownMenuItem>
							<DropdownMenuItem>GitHub</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	{:else if section === "collapsed"}
		<!-- A plain ellipsis for items that are left out. -->
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbLink href="/docs/components">Components</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	{:else if section === "icons"}
		<!-- An icon before the home label scales with the size. -->
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem><BreadcrumbLink href="/"><HouseIcon />Home</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbLink href="/docs/components">Components</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	{:else if section === "sizes"}
		<!-- One breadcrumb per size. -->
		{#each sizes as size (size)}
			{@render basicBreadcrumb({ size })}
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	/* Bare button that matches the breadcrumb links */
	.demoMenuTrigger {
		display: flex;
		align-items: center;
		cursor: pointer;
		outline: none;
		border: 0;
		border-radius: var(--radius-xs);
		background-color: transparent;
		padding: 0;
		color: inherit;
		font: inherit;
	}

	.demoMenuTrigger:hover {
		color: var(--foreground);
	}

	.demoMenuTrigger:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}
</style>
