<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.ts";
	import { CopyIcon } from "@lucide/svelte";
	import { IconBrandGithub } from "@tabler/icons-svelte";
	import { IconBrandGoogle } from "@tabler/icons-svelte";
	import { IconBrandVercel } from "@tabler/icons-svelte";

	let { data } = $props();

	// Each provider, with the avatar host that shows the user signed in with it
	const providers = [
		{ provider: "google", label: "Google", imageHost: "googleusercontent.com", icon: IconBrandGoogle },
		{ provider: "github", label: "GitHub", imageHost: "githubusercontent.com", icon: IconBrandGithub },
		{ provider: "vercel", label: "Vercel", imageHost: "vercel.com", icon: IconBrandVercel },
	];

	// A sign out link for the provider the user signed in with, and sign in links for the rest
	const authLinks = $derived(
		providers.map((item) => {
			const signedIn = data.userData?.image.includes(item.imageHost) ?? false;
			return {
				provider: item.provider,
				icon: item.icon,
				// Come back to this page after sign in or sign out
				href: signedIn ? "/api/auth/signout?callbackURL=/test" : `/api/auth/${item.provider}?callbackURL=/test`,
				title: signedIn ? `Sign out of ${item.label}` : `Sign in with ${item.label}`,
				// Show sign out in red
				variant: signedIn ? ("destructive" as const) : ("outline" as const),
			};
		}),
	);
</script>

<div class="page">
	<!-- Sign in and sign out links -->
	<div class="buttons">
		{#each authLinks as link (link.provider)}
			<Button href={link.href} variant={link.variant} data-sveltekit-reload>
				<link.icon />
				{link.title}
			</Button>
		{/each}
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
