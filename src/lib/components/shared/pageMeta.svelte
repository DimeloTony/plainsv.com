<script lang="ts">
	import { page } from "$app/state";
	import { appData } from "#lib/data/app.js";
	const { title, description, disableIndex, ogType = "website", image = "/images/og.png", imageAlt }: Props = $props();
	const fullPageTitle = $derived(title ? `${title} | ${appData.name}` : `${appData.name} | ${appData.title}`);
	const pageDescription = $derived(description || appData.description);
	const pageImageAlt = $derived(imageAlt || `${appData.name}: ${appData.title}`);
	const imageUrl = $derived(new URL(image, page.url.origin).href);
	// Drop the query string and hash so every variant of a page shares one canonical URL.
	const canonicalUrl = $derived(page.url.origin + page.url.pathname);
	const robots = $derived(disableIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
	// PROPS
	interface Props {
		title?: string;
		description?: string;
		ogType?: "website" | "article";
		image?: string;
		imageAlt?: string;
		disableIndex?: boolean;
	}
</script>

<svelte:head>
	<!-- Primary -->
	<title>{fullPageTitle}</title>
	<meta name="title" content={fullPageTitle} />
	<meta name="description" content={pageDescription} />
	<meta name="robots" content={robots} />
	<!-- Canonical -->
	<link rel="canonical" href={canonicalUrl} />
	<!-- LLMs -->
	<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />
	<!-- Icons -->
	<link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/images/apple-icon.png" />
	<!-- PWA -->
	<link rel="manifest" href="/manifest.json" />
	<meta name="application-name" content={appData.name} />
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
	<meta name="color-scheme" content="light dark" />
	<!-- Apple -->
	<meta name="apple-mobile-web-app-title" content={appData.name} />
	<!-- Open Graph -->
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={appData.name} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullPageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={pageImageAlt} />
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullPageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={pageImageAlt} />
</svelte:head>
