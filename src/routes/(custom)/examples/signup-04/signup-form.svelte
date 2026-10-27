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

<div class={["signupForm", className]} {...props}>
	<Card class="splitCard">
		<CardContent class="splitCardContent">
			<form class="formPane" onsubmit={handleSubmit}>
				<FieldGroup>
					<!-- Title and instructions. -->
					<div class="formHeading">
						<h1>Create your account</h1>
						<p>Enter your email below to create your account</p>
					</div>

					<!-- Email field. -->
					<Field>
						<FieldLabel for="email">Email</FieldLabel>
						<Input id="email" type="email" placeholder="m@example.com" required />
						<FieldDescription>We'll use this to contact you. We will not share your email with anyone else.</FieldDescription>
					</Field>

					<!-- Password and confirmation side by side, with one hint below. -->
					<Field>
						<Field class="passwordPair">
							<Field>
								<FieldLabel for="password">Password</FieldLabel>
								<Input id="password" type="password" required />
							</Field>
							<Field>
								<FieldLabel for="confirm-password">Confirm Password</FieldLabel>
								<Input id="confirm-password" type="password" required />
							</Field>
						</Field>
						<FieldDescription>Must be at least 8 characters long.</FieldDescription>
					</Field>
					<Field>
						<Button type="submit">Create Account</Button>
					</Field>

					<!-- One icon button per social sign up. -->
					<FieldSeparator>Or continue with</FieldSeparator>
					<Field class="socialRow">
						<Button variant="outline" type="button" aria-label="Sign up with Apple"><IconBrandApple /></Button>
						<Button variant="outline" type="button" aria-label="Sign up with Google"><IconBrandGoogle /></Button>
						<Button variant="outline" type="button" aria-label="Sign up with Meta"><IconBrandMeta /></Button>
					</Field>
					<FieldDescription class="centerText">Already have an account? <a href="#sign-in">Sign in</a></FieldDescription>
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
	.signupForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* The card has no padding, so the cover reaches its edges */
	.signupForm :global(.card.splitCard) {
		padding: 0;
		overflow: hidden;
	}

	.signupForm :global(.cardContent.splitCardContent) {
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
		font-size: var(--text-sm);
		text-wrap: balance;
	}

	/* Two equal fields in a row */
	.signupForm :global(.field.passwordPair) {
		flex-direction: row;
		gap: var(--spacing-lg);
	}

	.signupForm :global(.field.passwordPair > *) {
		flex: 1;
		min-width: 0;
	}

	/* The separator text sits on the card color */
	.signupForm :global(.fieldSeparatorText) {
		background-color: var(--card);
	}

	/* Three equal icon buttons in a row */
	.signupForm :global(.field.socialRow) {
		flex-direction: row;
		gap: var(--spacing-lg);
	}

	.signupForm :global(.field.socialRow > *) {
		flex: 1;
	}

	.signupForm :global(.centerText) {
		text-align: center;
	}

	.signupForm :global(.termsText) {
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
