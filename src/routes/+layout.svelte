<script lang="ts">
	import "../styles/app.css";
	import { untrack } from "svelte";
	import { setAppCtx } from "#lib/context/app.svelte.js";
	import { Toaster } from "#lib/components/ui/toaster/index.js";
	import type { LayoutProps } from "./$types";
	import type { AppCtxProps } from "#lib/context/app.svelte.js";
	// VARIABLES
	const { children, data }: LayoutProps = $props();
	const app = setAppCtx(data);
	const appContextData: AppCtxProps = $derived({ isDarkMode: data.isDarkMode, isMobile: data.isMobile, userData: data.userData });
	// UPDATE APP CONTEXT WHENEVER DATA VALUES CHANGE
	$effect(() => void (appContextData && untrack(() => app.isMounted) && untrack(() => Object.assign(app, appContextData))));
</script>

<Toaster richColors />
{@render children()}
