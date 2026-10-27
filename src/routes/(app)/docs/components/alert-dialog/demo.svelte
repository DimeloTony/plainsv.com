<script lang="ts">
	import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, type AlertDialogProps } from "#lib/components/ui/alert-dialog/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import { Trash2Icon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let isControlledOpen = $state(false);
	let isDeleting = $state(false);
	let lastResult = $state("none");

	/** Keeps the dialog open while a fake request runs, then closes it. */
	const handleDelete = async (e: MouseEvent) => {
		// Stop the action from closing the dialog until the request finishes.
		e.preventDefault();
		isDeleting = true;
		await new Promise((resolve) => setTimeout(resolve, 1500));
		isDeleting = false;
		lastResult = "deleted";
		isControlledOpen = false;
	};

	/** Live preview for one section of the alert dialog docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "trigger" | "controlled" | "sizes" | "rounded";
	}
</script>

<!-- Confirmation reused by the sizes and rounded sections. -->
{#snippet basicAlertDialog(props: Omit<AlertDialogProps, "children">, label: string)}
	<AlertDialog {...props}>
		<AlertDialogTrigger>{label}</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Default confirmation used at the top of the page. -->
		{@render basicAlertDialog({}, "Show dialog")}
	{:else if section === "trigger"}
		<!-- Destructive icon button trigger and a destructive action. -->
		<AlertDialog>
			<AlertDialogTrigger>
				{#snippet trigger({ props })}
					<Button variant="destructive" {...props}><Trash2Icon />Delete project</Button>
				{/snippet}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this project?</AlertDialogTitle>
					<AlertDialogDescription>The project and its deployments will be removed for everyone on your team.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	{:else if section === "controlled"}
		<!-- Opened from a plain button; the action waits for a fake request before closing. -->
		<Button variant="outline" onclick={() => (isControlledOpen = true)}>Delete account</Button>
		<AlertDialog bind:open={isControlledOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete your account?</AlertDialogTitle>
					<AlertDialogDescription>Your account will be deleted right away. This cannot be undone.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting} onclick={() => (lastResult = "canceled")}>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive" disabled={isDeleting} onclick={handleDelete}>
						{#if isDeleting}<Spinner />{/if}
						Delete account
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
		<p class="demoText">Open: {isControlledOpen}. Last result: {lastResult}.</p>
	{:else if section === "sizes"}
		<!-- One alert dialog per size; the radius follows the size. -->
		<div class="demoRow">
			{#each sizes as size (size)}
				{@render basicAlertDialog({ size }, `Size ${size}`)}
			{/each}
		</div>
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		<div class="demoRow">
			{#each roundedValues as rounded (rounded)}
				{@render basicAlertDialog({ rounded }, `Rounded ${rounded}`)}
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

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
