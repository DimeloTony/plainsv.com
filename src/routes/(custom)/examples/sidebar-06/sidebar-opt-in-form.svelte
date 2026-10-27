<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#lib/components/ui/card/index.js";
	import { SidebarInput } from "#lib/components/ui/sidebar/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	/** Keeps the demo form on the page instead of submitting it. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<!-- Newsletter sign up in a compact card. -->
<div class="optInForm">
	<Card size="md" class="optInCard">
		<CardHeader>
			<CardTitle class="optInTitle">Subscribe to our newsletter</CardTitle>
			<CardDescription>Opt-in to receive updates and news about the sidebar.</CardDescription>
		</CardHeader>
		<CardContent>
			<form class="optInFields" onsubmit={handleSubmit}>
				<SidebarInput type="email" placeholder="Email" aria-label="Email" />
				<Button type="submit" class="subscribeButton">Subscribe</Button>
			</form>
		</CardContent>
	</Card>
</div>

<style>
	/* Flat card with tighter spacing */
	.optInForm :global(.card.optInCard) {
		gap: var(--spacing-sm);
		box-shadow: none;
	}

	.optInForm :global(.optInTitle) {
		font-size: var(--text-sm);
	}

	.optInFields {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-sm) * 1.25); /* 10px */
	}

	/* Full-width button in the sidebar's primary color */
	.optInForm :global(form .button.subscribeButton) {
		box-shadow: none;
		background-color: var(--sidebar-primary);
		width: 100%;
		color: var(--sidebar-primary-foreground);
	}
</style>
