<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import { GalleryVerticalEndIcon } from "@lucide/svelte";
	import LoginForm from "./login-form.svelte";
</script>

<PageMeta title="Login 02 example" description="A two column login page with a cover image." />

<div class="loginPage not-typeset">
	<!-- Form column with the brand at the top. -->
	<div class="formColumn">
		<div class="brandRow">
			<a href="/" class="brand">
				<span class="brandLogo"><GalleryVerticalEndIcon /></span>
				Acme Inc.
			</a>
		</div>
		<div class="formArea">
			<div class="formAreaInner">
				<LoginForm />
			</div>
		</div>
	</div>

	<!-- Cover panel, shown on wide screens only. -->
	<div class="cover" aria-hidden="true"></div>
</div>

<style>
	/* Full-height page split into two columns on wide screens */
	.loginPage {
		display: flex;
		min-height: 100svh;
	}

	.formColumn {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: var(--spacing-xl);
	}

	/* Brand link, centered on small screens and at the start on wider ones */
	.brandRow {
		display: flex;
		justify-content: center;
	}

	.brand {
		display: flex;
		align-items: center;
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

	/* The form sits in the middle of the remaining space */
	.formArea {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.formAreaInner {
		width: 100%;
		max-width: 20rem; /* 320px */
	}

	/* Muted cover panel in place of an image */
	.cover {
		display: none;
		flex: 1;
		background-color: var(--muted);
	}

	@media (min-width: 48rem) {
		.formColumn {
			padding: calc(var(--spacing-xl) + var(--spacing-lg)); /* 40px */
		}

		.brandRow {
			justify-content: flex-start;
		}
	}

	@media (min-width: 64rem) {
		.cover {
			display: block;
		}
	}
</style>
