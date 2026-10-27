<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#lib/components/ui/card/index.js";
	import { Field, FieldGroup, FieldLabel, FieldDescription } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	const { ...props }: CompProps<"div"> = $props();

	/** Keeps the demo form on the page instead of putting the password in the URL. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<Card {...props}>
	<!-- Title and instructions. -->
	<CardHeader>
		<CardTitle>Create an account</CardTitle>
		<CardDescription>Enter your information below to create your account</CardDescription>
	</CardHeader>

	<!-- Account fields with the sign up actions. -->
	<CardContent>
		<form class="signupForm" onsubmit={handleSubmit}>
			<FieldGroup>
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
				<FieldGroup>
					<Field>
						<Button type="submit">Create Account</Button>
						<Button variant="outline" type="button">Sign up with Google</Button>
						<FieldDescription class="footNote">Already have an account? <a href="#sign-in">Sign in</a></FieldDescription>
					</Field>
				</FieldGroup>
			</FieldGroup>
		</form>
	</CardContent>
</Card>

<style>
	.signupForm :global(.footNote) {
		padding-inline: var(--spacing-xl);
		text-align: center;
	}
</style>
