<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { GalleryVerticalEndIcon } from "@lucide/svelte";
	import LoginForm from "./login-form.svelte";
</script>

<PageMeta title="Login 03 example" description="A login card with social logins on a muted background." />

<!-- Brand above a centered login card. -->
<div class="loginPage not-typeset">
	<div class="loginPageInner">
		<a href="/" class="brand">
			<span class="brandLogo"><GalleryVerticalEndIcon /></span>
			Acme Inc.
		</a>
		<LoginForm />
	</div>
</div>

<style>
	/* Full-height muted page that centers the form */
	.loginPage {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xl);
		background-color: var(--muted);
		padding: var(--spacing-xl);
		min-height: 100svh;
	}

	.loginPageInner {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		width: 100%;
		max-width: 24rem; /* 384px */
	}

	/* Brand link centered above the card */
	.brand {
		display: flex;
		align-items: center;
		align-self: center;
		gap: var(--spacing-sm);
		color: inherit;
		font-weight: 500;
		text-decoration: none;
	}

	.brandLogo {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-md);
		background-color: var(--primary);
		width: var(--control-height-xs);
		height: var(--control-height-xs);
		color: var(--primary-foreground);
	}

	.brandLogo :global(svg) {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}

	@media (min-width: 48rem) {
		.loginPage {
			padding: calc(var(--spacing-xl) + var(--spacing-lg)); /* 40px */
		}
	}
</style>
