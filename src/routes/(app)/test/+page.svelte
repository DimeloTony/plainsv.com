<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.ts";
	import { CopyIcon } from "@lucide/svelte";
	import { IconBrandGithub } from "@tabler/icons-svelte";
	import { IconBrandGoogle } from "@tabler/icons-svelte";
	import { IconBrandVercel } from "@tabler/icons-svelte";
</script>

<div class="page">
	<!-- Sign in links -->
	<div class="buttons">
		<Button href="/api/auth/google" variant="outline" data-sveltekit-reload>
			<IconBrandGoogle />
			Sign in with Google
		</Button>
		<Button href="/api/auth/github" variant="outline" data-sveltekit-reload>
			<IconBrandGithub />
			Sign in with GitHub
		</Button>
		<Button href="/api/auth/vercel" variant="outline" data-sveltekit-reload>
			<IconBrandVercel />
			Sign in with Vercel
		</Button>
	</div>

	<div class="buttons">
		<Button size="icon-xs" variant="outline">
			<CopyIcon />
		</Button>
		<Button size="icon-sm" variant="outline">
			<CopyIcon />
		</Button>
		<Button size="icon-md" variant="outline">
			<CopyIcon />
		</Button>
		<Button size="icon-lg" variant="outline">
			<CopyIcon />
		</Button>
	</div>

	<div class="buttons">
		<Button size="icon-xs" variant="bare">
			<CopyIcon />
		</Button>
		<Button size="icon-sm" variant="bare">
			<CopyIcon />
		</Button>
		<Button size="icon-md" variant="bare">
			<CopyIcon />
		</Button>
		<Button size="icon-lg" variant="bare">
			<CopyIcon />
		</Button>
	</div>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}
	.buttons {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md) var(--spacing-lg);
		color: var(--muted-foreground);
	}
</style>
