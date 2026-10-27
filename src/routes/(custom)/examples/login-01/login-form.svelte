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

<div class={["loginForm", className]} {...props}>
	<Card>
		<!-- Title and instructions. -->
		<CardHeader>
			<CardTitle>Login to your account</CardTitle>
			<CardDescription>Enter your email below to login to your account</CardDescription>
		</CardHeader>

		<!-- Email and password fields with the login actions. -->
		<CardContent>
			<form onsubmit={handleSubmit}>
				<FieldGroup>
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
						<Button variant="outline" type="button">Login with Google</Button>
						<FieldDescription class="centerText">Don't have an account? <a href="#sign-up">Sign up</a></FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</CardContent>
	</Card>
</div>

<style>
	.loginForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
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
</style>
