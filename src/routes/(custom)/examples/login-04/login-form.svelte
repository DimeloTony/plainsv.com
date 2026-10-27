<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Card, CardContent } from "#lib/components/ui/card/index.js";
	import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSeparator } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { IconBrandApple, IconBrandGoogle, IconBrandMeta } from "@tabler/icons-svelte";
	const { class: className, ...props }: CompProps<"div"> = $props();

	/** Keeps the demo form on the page instead of putting the password in the URL. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<div class={["loginForm", className]} {...props}>
	<Card class="splitCard">
		<CardContent class="splitCardContent">
			<form class="formPane" onsubmit={handleSubmit}>
				<FieldGroup>
					<!-- Title and instructions. -->
					<div class="formHeading">
						<h1>Welcome back</h1>
						<p>Login to your Acme Inc account</p>
					</div>

					<!-- Email and password fields. -->
					<Field>
						<FieldLabel for="email">Email</FieldLabel>
						<Input id="email" type="email" placeholder="m@example.com" required />
					</Field>
					<Field>
						<div class="passwordRow">
							<FieldLabel for="password">Password</FieldLabel>
							<a href="#forgot-password" class="forgotLink">Forgot your password?</a>
						</div>
						<Input id="password" type="password" required />
					</Field>
					<Field>
						<Button type="submit">Login</Button>
					</Field>

					<!-- One icon button per social login. -->
					<FieldSeparator>Or continue with</FieldSeparator>
					<Field class="socialRow">
						<Button variant="outline" type="button" aria-label="Login with Apple"><IconBrandApple /></Button>
						<Button variant="outline" type="button" aria-label="Login with Google"><IconBrandGoogle /></Button>
						<Button variant="outline" type="button" aria-label="Login with Meta"><IconBrandMeta /></Button>
					</Field>
					<FieldDescription class="centerText">Don't have an account? <a href="#sign-up">Sign up</a></FieldDescription>
				</FieldGroup>
			</form>

			<!-- Cover panel, shown beside the form on wider screens. -->
			<div class="cover" aria-hidden="true"></div>
		</CardContent>
	</Card>

	<!-- Terms below the card. -->
	<FieldDescription class="termsText">By clicking continue, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</FieldDescription>
</div>

<style>
	.loginForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* The card has no padding, so the cover reaches its edges */
	.loginForm :global(.card.splitCard) {
		padding: 0;
		overflow: hidden;
	}

	.loginForm :global(.cardContent.splitCardContent) {
		flex-direction: row;
		gap: 0;
	}

	.formPane {
		flex: 1;
		padding: var(--spacing-xl);
	}

	/* Centered title above muted instructions */
	.formHeading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		text-align: center;
	}

	.formHeading h1 {
		margin: 0;
		font-weight: 700;
		font-size: 1.5rem; /* 24px */
		line-height: 2rem; /* 32px */
	}

	.formHeading p {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-md);
		text-wrap: balance;
	}

	/* Password label with the reset link at the end */
	.passwordRow {
		display: flex;
		align-items: center;
	}

	.forgotLink {
		margin-left: auto;
		color: inherit;
		font-size: var(--text-sm);
		text-decoration: none;
		text-underline-offset: 0.125rem; /* 2px */
	}

	.forgotLink:hover {
		text-decoration: underline;
	}

	/* The separator text sits on the card color */
	.loginForm :global(.fieldSeparatorText) {
		background-color: var(--card);
	}

	/* Three equal icon buttons in a row */
	.loginForm :global(.field.socialRow) {
		flex-direction: row;
		gap: var(--spacing-lg);
	}

	.loginForm :global(.field.socialRow > *) {
		flex: 1;
	}

	.loginForm :global(.centerText) {
		text-align: center;
	}

	.loginForm :global(.termsText) {
		padding-inline: var(--spacing-xl);
		font-size: var(--text-sm);
		text-align: center;
	}

	/* Muted cover panel in place of an image */
	.cover {
		display: none;
		flex: 1;
		background-color: var(--muted);
	}

	@media (min-width: 48rem) {
		.formPane {
			padding: calc(var(--spacing-xl) + var(--spacing-sm)); /* 32px */
		}

		.cover {
			display: block;
		}
	}
</style>
