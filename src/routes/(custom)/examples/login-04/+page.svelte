<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import LoginForm from "./login-form.svelte";
</script>

<PageMeta title="Login 04 example" description="A login card split into a form and a cover image." />

<!-- Centered split login card. -->
<div class="loginPage not-typeset">
	<div class="loginPageInner">
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
		background-color: var(--muted);
		padding: var(--spacing-xl);
		min-height: 100svh;
	}

	.loginPageInner {
		width: 100%;
		max-width: 24rem; /* 384px */
	}

	/* The card widens to fit both columns */
	@media (min-width: 48rem) {
		.loginPage {
			padding: calc(var(--spacing-xl) + var(--spacing-lg)); /* 40px */
		}

		.loginPageInner {
			max-width: 56rem; /* 896px */
		}
	}
</style>
