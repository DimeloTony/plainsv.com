<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import SignupForm from "./signup-form.svelte";
</script>

<PageMeta title="Signup 01 example" description="A simple sign up form in a card." />

<!-- Centered sign up card. -->
<div class="loginPage not-typeset">
	<div class="loginPageInner">
		<SignupForm />
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
