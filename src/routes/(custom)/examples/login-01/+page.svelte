<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import LoginForm from "./login-form.svelte";
</script>

<PageMeta title="Login 01 example" description="A simple login form in a card." />

<!-- Centered login card. -->
<div class="loginPage not-typeset">
	<div class="loginPageInner">
		<LoginForm />
	</div>
</div>

<style>
	/* Full-height page that centers the form */
	.loginPage {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--spacing-xl);
		width: 100%;
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
