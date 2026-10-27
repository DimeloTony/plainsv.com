<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Field, FieldGroup, FieldLabel, FieldDescription, FieldSeparator } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { GalleryVerticalEndIcon } from "@lucide/svelte";
	import { IconBrandApple, IconBrandGoogle } from "@tabler/icons-svelte";
	const { class: className, ...props }: CompProps<"div"> = $props();

	/** Keeps the demo form on the page instead of submitting it. */
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};
</script>

<div class={["loginForm", className]} {...props}>
	<form onsubmit={handleSubmit}>
		<FieldGroup>
			<!-- Brand, title, and sign up link. -->
			<div class="formHeading">
				<a href="/" class="brand" aria-label="Acme Inc.">
					<GalleryVerticalEndIcon />
				</a>
				<h1>Welcome to Acme Inc.</h1>
				<FieldDescription class="smallText">Don't have an account? <a href="#sign-up">Sign up</a></FieldDescription>
			</div>

			<!-- Email field. -->
			<Field>
				<FieldLabel for="email">Email</FieldLabel>
				<Input id="email" type="email" placeholder="m@example.com" required />
			</Field>
			<Field>
				<Button type="submit">Login</Button>
			</Field>

			<!-- Social logins, side by side on wider screens. -->
			<FieldSeparator>Or</FieldSeparator>
			<Field class="socialRow">
				<Button variant="outline" type="button"><IconBrandApple /> Continue with Apple</Button>
				<Button variant="outline" type="button"><IconBrandGoogle /> Continue with Google</Button>
			</Field>
		</FieldGroup>
	</form>

	<!-- Terms below the form. -->
	<FieldDescription class="termsText">By clicking continue, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</FieldDescription>
</div>

<style>
	.loginForm {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	/* Centered brand, title, and sign up link */
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
		font-size: 1.25rem; /* 20px */
		line-height: 1.75rem; /* 28px */
	}

	.brand {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-md);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		color: inherit;
	}

	.brand :global(svg) {
		width: 1.5rem; /* 24px */
		height: 1.5rem; /* 24px */
	}

	.loginForm :global(.smallText) {
		font-size: var(--text-sm);
	}

	/* Social buttons stack on small screens */
	.loginForm :global(.field.socialRow) {
		gap: var(--spacing-lg);
	}

	.loginForm :global(.termsText) {
		padding-inline: var(--spacing-xl);
		font-size: var(--text-sm);
		text-align: center;
	}

	/* Social buttons sit side by side once there is room */
	@media (min-width: 40rem) {
		.loginForm :global(.field.socialRow) {
			flex-direction: row;
		}

		.loginForm :global(.field.socialRow > *) {
			flex: 1;
		}
	}
</style>
