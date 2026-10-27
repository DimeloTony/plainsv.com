<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#lib/components/ui/card/index.js";
	import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSeparator } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { IconBrandApple, IconBrandGoogle } from "@tabler/icons-svelte";
	const { class: className, ...props }: CompProps<"div"> = $props();

	/** Keeps the demo form on the page instead of putting the password in the URL. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<div class={["loginForm", className]} {...props}>
	<Card>
		<!-- Centered title and instructions. -->
		<CardHeader class="centerText">
			<CardTitle class="welcomeTitle">Welcome back</CardTitle>
			<CardDescription>Login with your Apple or Google account</CardDescription>
		</CardHeader>

		<CardContent>
			<form onsubmit={handleSubmit}>
				<FieldGroup>
					<!-- Social logins. -->
					<Field>
						<Button variant="outline" type="button"><IconBrandApple /> Login with Apple</Button>
						<Button variant="outline" type="button"><IconBrandGoogle /> Login with Google</Button>
					</Field>
					<FieldSeparator>Or continue with</FieldSeparator>

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
						<FieldDescription class="centerText">Don't have an account? <a href="#sign-up">Sign up</a></FieldDescription>
					</Field>
				</FieldGroup>
			</form>
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

	.loginForm :global(.welcomeTitle) {
		font-size: 1.25rem; /* 20px */
	}

	/* The separator text sits on the card color */
	.loginForm :global(.fieldSeparatorText) {
		background-color: var(--card);
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
		text-underline-offset: 0.25rem; /* 4px */
	}

	.forgotLink:hover {
		text-decoration: underline;
	}

	.loginForm :global(.centerText) {
		text-align: center;
	}

	.loginForm :global(.termsText) {
		padding-inline: var(--spacing-xl);
		font-size: var(--text-sm);
		text-align: center;
	}
</style>
