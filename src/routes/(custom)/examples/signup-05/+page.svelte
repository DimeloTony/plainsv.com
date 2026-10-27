<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import SignupForm from "./signup-form.svelte";
</script>

<PageMeta title="Signup 05 example" description="A simple email sign up with social sign ups." />

<!-- Centered sign up form. -->
<div class="loginPage not-typeset">
	<div class="loginPageInner">
		<SignupForm />
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
