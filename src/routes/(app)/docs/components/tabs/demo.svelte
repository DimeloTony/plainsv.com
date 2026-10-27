<script lang="ts">
	import { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps } from "#lib/components/ui/tabs/index.js";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "#lib/components/ui/card/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { AppWindowIcon, CodeIcon, SettingsIcon, EyeIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const variants: TabsProps["variant"][] = ["default", "outline", "ghost", "line"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let activeTab = $state("overview");

	/** Live preview for one section of the tabs docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "line" | "variants" | "vertical" | "controlled" | "icons" | "sizes" | "rounded" | "disabled" | "trigger";
	}
</script>

<!-- Three short tabs reused by most sections. -->
{#snippet basicTabs(props: Omit<TabsProps, "children">)}
	<Tabs defaultValue="overview" {...props}>
		<TabsList>
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="analytics">Analytics</TabsTrigger>
			<TabsTrigger value="reports">Reports</TabsTrigger>
		</TabsList>
		<TabsContent value="overview">A summary of your account activity.</TabsContent>
		<TabsContent value="analytics">Traffic and engagement over time.</TabsContent>
		<TabsContent value="reports">Exports you have scheduled.</TabsContent>
	</Tabs>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Account and password forms in cards, used at the top of the page. -->
		<Tabs defaultValue="account" style="width: 100%; max-width: 24rem">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="demoField">
							<Label for="demoTabsName">Name</Label>
							<Input id="demoTabsName" value="Pedro Duarte" />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save changes</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="demoField">
							<Label for="demoTabsPassword">New password</Label>
							<Input id="demoTabsPassword" type="password" />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save password</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	{:else if section === "line"}
		<!-- Underlined active tab. -->
		{@render basicTabs({ variant: "line" })}
	{:else if section === "variants"}
		<!-- One set of tabs per visual style. -->
		{#each variants as variant (variant)}
			{@render basicTabs({ variant })}
		{/each}
	{:else if section === "vertical"}
		<!-- The list sits beside the panel, and up and down arrows move between tabs. -->
		{@render basicTabs({ orientation: "vertical" })}
		{@render basicTabs({ orientation: "vertical", variant: "line" })}
	{:else if section === "controlled"}
		<!-- Tabs bound to state, with a button that opens a tab from outside. -->
		<Tabs bind:value={activeTab}>
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="analytics">Analytics</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">The active tab is {activeTab}.</TabsContent>
			<TabsContent value="analytics">The active tab is {activeTab}.</TabsContent>
		</Tabs>
		<Button variant="outline" size="sm" onclick={() => (activeTab = activeTab === "overview" ? "analytics" : "overview")}>Switch tab</Button>
	{:else if section === "icons"}
		<!-- Icons before each label scale with the size. -->
		<Tabs defaultValue="preview" variant="line">
			<TabsList>
				<TabsTrigger value="preview"><AppWindowIcon />Preview</TabsTrigger>
				<TabsTrigger value="code"><CodeIcon />Code</TabsTrigger>
				<TabsTrigger value="settings"><SettingsIcon />Settings</TabsTrigger>
			</TabsList>
		</Tabs>
	{:else if section === "sizes"}
		<!-- One set of tabs per size; the radius follows the size. -->
		{#each sizes as size (size)}
			{@render basicTabs({ size })}
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			{@render basicTabs({ rounded })}
		{/each}
	{:else if section === "disabled"}
		<!-- A disabled trigger is skipped by the arrow keys. -->
		<Tabs defaultValue="overview">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
				<TabsTrigger value="reports">Reports</TabsTrigger>
			</TabsList>
		</Tabs>
	{:else if section === "trigger"}
		<!-- Custom buttons that switch variant with the active tab. -->
		<Tabs defaultValue="preview" variant="ghost">
			<TabsList>
				<TabsTrigger value="preview">
					{#snippet trigger({ props })}
						<Button variant={props["data-state"] === "active" ? "secondary" : "ghost"} size="sm" {...props}>
							<EyeIcon />
							Preview
						</Button>
					{/snippet}
				</TabsTrigger>
				<TabsTrigger value="code">
					{#snippet trigger({ props })}
						<Button variant={props["data-state"] === "active" ? "secondary" : "ghost"} size="sm" {...props}>
							<CodeIcon />
							Code
						</Button>
					{/snippet}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="preview">The rendered component.</TabsContent>
			<TabsContent value="code">The component source.</TabsContent>
		</Tabs>
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

	.demoField {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
</style>
