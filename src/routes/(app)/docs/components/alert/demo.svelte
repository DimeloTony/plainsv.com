<script lang="ts">
	import { Alert, AlertTitle, AlertDescription, AlertAction } from "#lib/components/ui/alert/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { CircleCheckIcon, CircleAlertIcon, InfoIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the alert docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "destructive" | "action" | "size" | "rounded";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Alerts with and without an icon or description, used at the top of the page. -->
		<Alert>
			<CircleCheckIcon />
			<AlertTitle>Success! Your changes have been saved</AlertTitle>
			<AlertDescription>This is an alert with an icon, title, and description.</AlertDescription>
		</Alert>
		<Alert>
			<InfoIcon />
			<AlertTitle>This alert has a title and an icon. No description.</AlertTitle>
		</Alert>
	{:else if section === "destructive"}
		<!-- Destructive variant with a multi-paragraph description. -->
		<Alert variant="destructive">
			<CircleAlertIcon />
			<AlertTitle>Unable to process your payment.</AlertTitle>
			<AlertDescription>
				<p>Please verify your billing information and try again.</p>
				<p>Check your card details, ensure sufficient funds, and verify your billing address.</p>
			</AlertDescription>
		</Alert>
	{:else if section === "action"}
		<!-- Trailing action beside the title and description. -->
		<Alert>
			<InfoIcon />
			<AlertTitle>A new version is available</AlertTitle>
			<AlertDescription>Reload the page to get the latest features.</AlertDescription>
			<AlertAction>
				<Button size="sm" variant="outline">Reload</Button>
			</AlertAction>
		</Alert>
	{:else if section === "size"}
		<!-- Each size, from the tightest to the default. -->
		{#each sizes as size (size)}
			<Alert {size}>
				<InfoIcon />
				<AlertTitle>Size {size}</AlertTitle>
				<AlertDescription>Padding, gap, text, and icon size follow the size.</AlertDescription>
			</Alert>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the default radius. -->
		{#each roundedValues as rounded (rounded)}
			<Alert {rounded}>
				<InfoIcon />
				<AlertTitle>Rounded {rounded}</AlertTitle>
			</Alert>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
