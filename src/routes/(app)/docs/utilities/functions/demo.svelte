<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { useFunc, useFuncLive } from "#lib/functions/index.js";

	const { section = "call" }: Props = $props();
	let email = $state("ada@example.com");
	let prompt = $state("Hello there");
	let file: File | undefined = $state();
	let result = $state("");
	let isError = $state(false);
	let isLoading = $state(false);
	let throwError = $state(false);
	let tickerLog: string[] = $state([]);
	// Recreate the stream when `throwError` changes; it only connects in the live section, where the markup reads it
	const ticker = $derived(useFuncLive("liveTicker", { throwError }));

	// Log every event and error from the live ticker, only in the live section so other sections stay disconnected
	$effect(() => {
		if (section !== "live") return;
		return ticker.onEvent((data) => (tickerLog = [`#${data.count} ${data.price.toFixed(2)}`, ...tickerLog].slice(0, 5)));
	});
	$effect(() => {
		if (section !== "live") return;
		return ticker.onError((message) => (tickerLog = [`Error: ${message}`, ...tickerLog].slice(0, 5)));
	});

	/** Shows a function response below the form. */
	function showResponse(response: { error: boolean; data: string }) {
		isError = response.error;
		result = response.data;
	}

	/** Calls the public `userCreate` function with the email. */
	async function createUser(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		// Wait at least 300 ms so the loading state is visible.
		showResponse(await useFunc("userCreate", { email }, false));
		isLoading = false;
	}

	/** Calls the private `userDeletePrivate` function, which fails without a signed-in user. */
	async function deletePrivateUser(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		showResponse(await useFunc("userDeletePrivate", { email }, false));
		isLoading = false;
	}

	/** Uploads the chosen file as form data to `fileUpload`. */
	async function uploadFile(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData();
		// If a file was chosen: send it; otherwise the handler returns an error.
		if (file) formData.append("file", file);
		isLoading = true;
		const response = await useFunc("fileUpload", formData, false);
		isLoading = false;
		// If the upload failed: show the error message.
		if (response.error) return showResponse(response);
		showResponse({ error: false, data: `${response.data.name} (${response.data.size} bytes, ${response.data.type})` });
	}

	/** Streams the `textStream` reply into the result one word at a time. */
	async function streamText(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		showResponse({ error: false, data: "" });
		const response = await useFunc("textStream", { prompt });
		// If the request failed: show the error instead of streaming.
		if (response.error) {
			isLoading = false;
			return showResponse(response);
		}
		for await (const word of response.data) result += word;
		isLoading = false;
	}

	/** Reconnects the ticker, turning off the error test when it is on. */
	function reconnectTicker() {
		// If the error test is on: turn it off, which opens a new stream. Otherwise reopen the current one.
		if (throwError) throwError = false;
		else ticker.reconnect();
	}

	/** Live example for one section of the functions docs */
	interface Props {
		/** Which function call to demo */
		section?: "call" | "private" | "upload" | "stream" | "live";
	}
</script>

<div class="demo">
	{#if section === "call"}
		<!-- Public function with validated JSON input. Clear the email to see a validation error. -->
		<form class="demoForm" onsubmit={createUser}>
			<input class="demoInput" type="text" aria-label="Email" placeholder="Email" bind:value={email} />
			<Button type="submit" disabled={isLoading}>Create user</Button>
		</form>
	{:else if section === "private"}
		<!-- Private function that rejects requests without a signed-in user. -->
		<form class="demoForm" onsubmit={deletePrivateUser}>
			<input class="demoInput" type="text" aria-label="Email" placeholder="Email" bind:value={email} />
			<Button type="submit" variant="destructive" disabled={isLoading}>Delete user</Button>
		</form>
	{:else if section === "upload"}
		<!-- Form data upload; the handler reads the file and returns its details. -->
		<form class="demoForm" onsubmit={uploadFile}>
			<input class="demoInput" type="file" aria-label="File" onchange={(e) => (file = e.currentTarget.files?.[0])} />
			<Button type="submit" disabled={isLoading}>Upload</Button>
		</form>
	{:else if section === "stream"}
		<!-- Server-sent events read as an async generator. -->
		<form class="demoForm" onsubmit={streamText}>
			<input class="demoInput" type="text" aria-label="Prompt" placeholder="Prompt" bind:value={prompt} />
			<Button type="submit" disabled={isLoading}>Stream reply</Button>
		</form>
	{:else if section === "live"}
		<!-- Live stream read through `useFuncLive`, with controls to reconnect, disconnect, and fail it. -->
		<div class="demoForm">
			<Button variant="outline" onclick={reconnectTicker}>Reconnect</Button>
			<Button variant="outline" onclick={() => ticker.disconnect()}>Disconnect</Button>
			<Button variant="destructive" onclick={() => (throwError = true)}>Cause error</Button>
			<span class="demoStatus" role="status">{ticker.connected ? "Connected" : "Disconnected"}</span>
		</div>
		{#if ticker.current?.error}
			<output class="demoResult" data-error="true">{ticker.current.data}</output>
		{:else if ticker.current}
			<output class="demoResult">Price {ticker.current.data.price.toFixed(2)} at {ticker.current.data.time.toLocaleTimeString()}</output>
		{/if}
		{#if tickerLog.length}
			<ul class="demoLog" aria-label="Ticker events">
				{#each tickerLog as entry, i (i)}
					<li>{entry}</li>
				{/each}
			</ul>
		{/if}
	{/if}

	<!-- Response from the last call. -->
	{#if result}
		<output class="demoResult" data-error={isError}>{result}</output>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoForm {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.demoInput {
		flex: 1 1 14rem;
		border: 1px solid var(--input);
		border-radius: var(--radius-md);
		background-color: transparent;
		padding-inline: var(--spacing-md);
		height: var(--control-height-md);
		color: var(--foreground);
		font-size: var(--text-sm);
	}

	.demoStatus {
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}

	.demoLog {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		margin: 0;
		padding: 0;
		list-style: none;
		color: var(--muted-foreground);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: var(--text-xs);
	}

	.demoInput[type="file"] {
		padding-block: var(--spacing-xs);
	}

	.demoResult {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background-color: var(--muted);
		padding: var(--spacing-sm) var(--spacing-md);
		color: var(--foreground);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
		white-space: pre-wrap;
	}

	/* States */
	.demoInput:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	.demoResult[data-error="true"] {
		border-color: var(--destructive);
		color: var(--destructive);
	}
</style>
