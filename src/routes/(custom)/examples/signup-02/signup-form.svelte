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

<form class={["signupForm", className]} onsubmit={handleSubmit} {...props}>
	<FieldGroup>
		<!-- Title and instructions. -->
		<div class="formHeading">
			<h1>Create your account</h1>
			<p>Fill in the form below to create your account</p>
		</div>

		<!-- Account fields. -->
		<Field>
			<FieldLabel for="name">Full Name</FieldLabel>
			<Input id="name" type="text" placeholder="John Doe" required />
		</Field>
		<Field>
			<FieldLabel for="email">Email</FieldLabel>
			<Input id="email" type="email" placeholder="m@example.com" required />
			<FieldDescription>We'll use this to contact you. We will not share your email with anyone else.</FieldDescription>
		</Field>
		<Field>
			<FieldLabel for="password">Password</FieldLabel>
			<Input id="password" type="password" required />
			<FieldDescription>Must be at least 8 characters long.</FieldDescription>
		</Field>
		<Field>
			<FieldLabel for="confirm-password">Confirm Password</FieldLabel>
			<Input id="confirm-password" type="password" required />
			<FieldDescription>Please confirm your password.</FieldDescription>
		</Field>
		<Field>
			<Button type="submit">Create Account</Button>
		</Field>

		<!-- Social sign up and sign in link. -->
		<FieldSeparator>Or continue with</FieldSeparator>
		<Field>
			<Button variant="outline" type="button"><IconBrandGithub /> Sign up with GitHub</Button>
			<FieldDescription class="footNote">Already have an account? <a href="#sign-in">Sign in</a></FieldDescription>
		</Field>
	</FieldGroup>
</form>

<style>
	.signupForm {
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

	.signupForm :global(.footNote) {
		padding-inline: var(--spacing-xl);
		text-align: center;
	}
</style>
