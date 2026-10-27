<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import LoginForm from "./login-form.svelte";
</script>

<PageMeta title="Login 05 example" description="A simple email login with social logins." />

<!-- Centered login form. -->
<div class="loginPage not-typeset">
	<div class="loginPageInner">
		<LoginForm />
	</div>
</div>

<style>
	/* Full-height page that centers the form */
	.loginPage {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xl);
		background-color: var(--background);
		padding: var(--spacing-xl);
		min-height: 100svh;
	}

	.loginPageInner {
		width: 100%;
		max-width: 24rem; /* 384px */
	}

	@media (min-width: 48rem) {
		.loginPage {
			padding: calc(var(--spacing-xl) + var(--spacing-lg)); /* 40px */
		}
	}
</style>
