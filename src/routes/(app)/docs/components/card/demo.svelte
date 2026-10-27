<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "#lib/components/ui/card/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { ChevronRightIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the card docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "action" | "links" | "size" | "rounded" | "login";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Full card with every section, used at the top of the page. -->
		<Card>
			<CardHeader>
				<CardTitle>Notifications</CardTitle>
				<CardDescription>Choose what you hear about.</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="demoBody">You have 3 unread messages.</p>
			</CardContent>
			<CardFooter>
				<Button size="sm">Mark as read</Button>
				<Button size="sm" variant="ghost">Settings</Button>
			</CardFooter>
		</Card>
	{:else if section === "action"}
		<!-- Header action beside the title and description. -->
		<Card>
			<CardHeader>
				<CardTitle>Team members</CardTitle>
				<CardDescription>Invite people to your project.</CardDescription>
				<CardAction>
					<Button size="sm" variant="outline">Invite</Button>
				</CardAction>
			</CardHeader>
		</Card>
	{:else if section === "links"}
		<!-- Cards rendered as anchors through `href`. -->
		<Card href="/docs/components">
			<CardHeader>
				<CardTitle>Browse components</CardTitle>
				<CardDescription>Opens the components list.</CardDescription>
				<CardAction><ChevronRightIcon /></CardAction>
			</CardHeader>
		</Card>
		<Card href="/docs/components" disabled>
			<CardHeader>
				<CardTitle>Disabled link</CardTitle>
				<CardDescription>Drops its href.</CardDescription>
				<CardAction><ChevronRightIcon /></CardAction>
			</CardHeader>
		</Card>
	{:else if section === "size"}
		<!-- Each size, from the tightest to the default. -->
		{#each sizes as size (size)}
			<Card {size}>
				<CardHeader>
					<CardTitle>Size {size}</CardTitle>
					<CardDescription>Padding, gap, and radius follow the size.</CardDescription>
				</CardHeader>
			</Card>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			<Card {rounded}>
				<CardHeader>
					<CardTitle>Rounded {rounded}</CardTitle>
				</CardHeader>
			</Card>
		{/each}
	{:else if section === "login"}
		<!-- Login form composed from the card, input, and button components. -->
		<Card class="demoLogin">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>Enter your email below to login to your account</CardDescription>
				<CardAction>
					<Button variant="link">Sign Up</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<!-- The submit button lives in the footer, so it targets this form by id. -->
				<form id="demoLoginForm" class="demoLoginForm" onsubmit={(e) => e.preventDefault()}>
					<div class="demoLoginField">
						<Label for="demoLoginEmail">Email</Label>
						<Input id="demoLoginEmail" type="email" placeholder="m@example.com" required />
					</div>
					<div class="demoLoginField">
						<div class="demoLoginLabelRow">
							<Label for="demoLoginPassword">Password</Label>
							<a class="demoLoginForgot" href="##">Forgot your password?</a>
						</div>
						<Input id="demoLoginPassword" type="password" required />
					</div>
				</form>
			</CardContent>
			<CardFooter class="demoLoginFooter">
				<Button type="submit" form="demoLoginForm" class="demoLoginButton">Login</Button>
				<Button variant="outline" class="demoLoginButton">Login with Google</Button>
			</CardFooter>
		</Card>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	/* Cards grow from a 12rem minimum to fill each row */
	.demo > :global(.card) {
		flex: 1 1 12rem;
	}

	/* Login form card */
	.demo > :global(.demoLogin) {
		max-width: 24rem;
	}

	.demoLoginForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.demoLoginField {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.demoLoginLabelRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.demoLoginForgot {
		color: var(--foreground);
		font-size: var(--text-sm);
		text-decoration: none;
		text-underline-offset: 0.25rem; /* 4px */
	}

	.demoLoginForgot:hover {
		text-decoration: underline;
	}

	/* Stack the footer buttons at full width */
	.demo :global(.demoLoginFooter) {
		flex-direction: column;
	}

	.demo :global(.demoLoginButton) {
		width: 100%;
	}

	.demoBody {
		margin: 0;
		color: var(--muted-foreground);
	}
</style>
