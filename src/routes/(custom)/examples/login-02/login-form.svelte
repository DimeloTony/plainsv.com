<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSeparator } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { IconBrandGithub } from "@tabler/icons-svelte";
	const { class: className, ...props }: CompProps<"form"> = $props();

	/** Keeps the demo form on the page instead of putting the password in the URL. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<form class={["loginForm", className]} onsubmit={handleSubmit} {...props}>
	<FieldGroup>
		<!-- Title and instructions. -->
		<div class="formHeading">
			<h1>Login to your account</h1>
			<p>Enter your email below to login to your account</p>
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

		<!-- Social login and sign up link. -->
		<FieldSeparator>Or continue with</FieldSeparator>
		<Field>
			<Button variant="outline" type="button"><IconBrandGithub /> Login with GitHub</Button>
			<FieldDescription class="centerText">Don't have an account? <a href="#sign-up">Sign up</a></FieldDescription>
		</Field>
	</FieldGroup>
</form>

<style>
	.loginForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* Centered title above muted instructions */
	.formHeading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
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
