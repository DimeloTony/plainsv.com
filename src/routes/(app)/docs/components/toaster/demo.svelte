<script lang="ts">
	import { Toaster, toast } from "#lib/components/ui/toaster/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { ToasterPosition } from "#lib/components/ui/toaster/index.js";

	const { section = "preview" }: Props = $props();
	const positions: ToasterPosition[] = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	// Settings of the demo toaster, set by the button that was clicked last.
	let position: ToasterPosition = $state("bottom-right");
	let size: UiSize = $state("md");
	let rounded: UiRounded = $state("lg");
	let expand = $state(false);
	let closeButton = $state(false);
	let richColors = $state(false);

	// Each section has its own toaster, so its settings do not reach the other demos.
	const toasterId = $derived(`toaster-demo-${section}`);

	/** Resolves after a moment, like a slow request. */
	const saveSettings = () => new Promise((resolve) => setTimeout(resolve, 1500));

	/** Rejects after a moment, like a failed request. */
	const failRequest = () => new Promise((_, reject) => setTimeout(() => reject(new Error("Network error")), 1500));

	/** Live preview for one section of the toaster docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "types" | "content" | "position" | "options" | "sizes" | "rounded";
	}
</script>

<div class="demo">
	<!-- Toaster for this section only. -->
	<Toaster id={toasterId} {position} {size} {rounded} {expand} {closeButton} {richColors} />

	{#if section === "preview"}
		<!-- Toast with a description and an action. -->
		<Button variant="outline" onclick={() => toast("Event has been created", { toasterId, description: "Sunday, December 3 at 9:00 AM", action: { label: "Undo", onClick: () => toast("Undone", { toasterId }) } })}>Show toast</Button>
	{:else if section === "types"}
		<!-- One button per toast type, and promises that succeed or fail. -->
		<div class="demoRow">
			<Button variant="outline" onclick={() => toast("Event has been created", { toasterId })}>Default</Button>
			<Button variant="outline" onclick={() => toast.success("Event has been created", { toasterId })}>Success</Button>
			<Button variant="outline" onclick={() => toast.info("Be at the area 10 minutes before the event time", { toasterId })}>Info</Button>
			<Button variant="outline" onclick={() => toast.warning("Event start time cannot be earlier than 8am", { toasterId })}>Warning</Button>
			<Button variant="outline" onclick={() => toast.error("Event has not been created", { toasterId })}>Error</Button>
			<Button variant="outline" onclick={() => toast.loading("Uploading files...", { toasterId, closeButton: true })}>Loading</Button>
			<Button variant="outline" onclick={() => toast.promise(saveSettings, { toasterId, loading: "Saving...", success: "Settings saved", error: "Could not save" })}>Promise</Button>
			<Button variant="outline" onclick={() => toast.promise(failRequest, { toasterId, loading: "Sending...", success: "Sent", error: (error) => `Could not send: ${error instanceof Error ? error.message : "unknown error"}` })}>Failing promise</Button>
		</div>
	{:else if section === "content"}
		<!-- Description, action and cancel buttons, a toast that stays open, and updating a toast by id. -->
		<div class="demoRow">
			<Button variant="outline" onclick={() => toast("Your file is ready", { toasterId, description: "report-2026.pdf, 2.4 MB" })}>Description</Button>
			<Button variant="outline" onclick={() => toast("Message archived", { toasterId, action: { label: "Undo", onClick: () => toast.success("Message restored", { toasterId }) }, cancel: { label: "Dismiss" } })}>Action and cancel</Button>
			<Button variant="outline" onclick={() => toast("Stays until closed", { toasterId, duration: Infinity, closeButton: true })}>Stays open</Button>
			<Button
				variant="outline"
				onclick={() => {
					const id = toast.loading("Connecting...", { toasterId });
					setTimeout(() => toast.success("Connected", { id, toasterId }), 1500);
				}}>Update by id</Button
			>
			<Button variant="outline" onclick={() => toast.dismiss()}>Dismiss all</Button>
		</div>
	{:else if section === "position"}
		<!-- One button per position; the demo toaster moves there. -->
		<div class="demoRow">
			{#each positions as value (value)}
				<Button
					variant="outline"
					onclick={() => {
						position = value;
						toast(`Position ${value}`, { toasterId });
					}}>{value}</Button
				>
			{/each}
		</div>
	{:else if section === "options"}
		<!-- Toggles for the toaster options; each click shows a toast with the current settings. -->
		<div class="demoRow">
			<Button variant={expand ? "default" : "outline"} onclick={() => (expand = !expand)}>Expand</Button>
			<Button variant={closeButton ? "default" : "outline"} onclick={() => (closeButton = !closeButton)}>Close button</Button>
			<Button variant={richColors ? "default" : "outline"} onclick={() => (richColors = !richColors)}>Rich colors</Button>
			<Button variant="outline" onclick={() => toast.error("Event has not been created", { toasterId, description: "Try again in a moment." })}>Show error</Button>
			<Button variant="outline" onclick={() => toast.success("Event has been created", { toasterId })}>Show success</Button>
		</div>
	{:else if section === "sizes"}
		<!-- One button per size. -->
		<div class="demoRow">
			{#each sizes as value (value)}
				<Button
					variant="outline"
					onclick={() => {
						size = value;
						toast.success(`Size ${value}`, { toasterId, description: "Padding, text, and icon follow the size." });
					}}>Size {value}</Button
				>
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- One button per rounded value. -->
		<div class="demoRow">
			{#each roundedValues as value (value)}
				<Button
					variant="outline"
					onclick={() => {
						rounded = value;
						toast(`Rounded ${value}`, { toasterId });
					}}>Rounded {value}</Button
				>
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoRow {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}
</style>
