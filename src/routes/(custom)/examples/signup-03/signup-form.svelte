<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#lib/components/ui/card/index.js";
	import { Field, FieldGroup, FieldLabel, FieldDescription } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	const { class: className, ...props }: CompProps<"div"> = $props();

	/** Keeps the demo form on the page instead of putting the password in the URL. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<div class={["signupForm", className]} {...props}>
	<Card>
		<!-- Centered title and instructions. -->
		<CardHeader class="centerText">
			<CardTitle class="welcomeTitle">Create your account</CardTitle>
			<CardDescription>Enter your email below to create your account</CardDescription>
		</CardHeader>

		<CardContent>
			<form onsubmit={handleSubmit}>
				<FieldGroup>
					<!-- Name and email fields. -->
					<Field>
						<FieldLabel for="name">Full Name</FieldLabel>
						<Input id="name" type="text" placeholder="John Doe" required />
					</Field>
					<Field>
						<FieldLabel for="email">Email</FieldLabel>
						<Input id="email" type="email" placeholder="m@example.com" required />
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
						<FieldDescription class="centerText">Already have an account? <a href="#sign-in">Sign in</a></FieldDescription>
					</Field>
				</FieldGroup>
			</form>
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

	.signupForm :global(.welcomeTitle) {
		font-size: 1.25rem; /* 20px */
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

	.signupForm :global(.centerText) {
		text-align: center;
	}

	.signupForm :global(.termsText) {
		padding-inline: var(--spacing-xl);
		font-size: var(--text-sm);
		text-align: center;
	}
</style>
