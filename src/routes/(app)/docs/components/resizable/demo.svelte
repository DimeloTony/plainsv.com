<script lang="ts">
	import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#lib/components/ui/resizable/index.js";

	const { section = "preview" }: Props = $props();
	let sizes: number[] = $state([]);

	/** Live preview for one section of the resizable docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "vertical" | "handle" | "disabled";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Side panel beside a column of two stacked panels. -->
		<div class="demoFrame" style="height: 12rem">
			<ResizablePanelGroup onLayoutChange={(next) => (sizes = next)}>
				<ResizablePanel defaultSize={50} minSize={20}><div class="demoPanel">One</div></ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={50}>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={25}><div class="demoPanel">Two</div></ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize={75}><div class="demoPanel">Three</div></ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
		<p class="demoText">Sizes: {sizes.length ? sizes.map((size) => `${Math.round(size)}%`).join(", ") : "drag the handle"}</p>
	{:else if section === "vertical"}
		<!-- Header above content. -->
		<div class="demoFrame" style="height: 12rem">
			<ResizablePanelGroup direction="vertical">
				<ResizablePanel defaultSize={25}><div class="demoPanel">Header</div></ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={75}><div class="demoPanel">Content</div></ResizablePanel>
			</ResizablePanelGroup>
		</div>
	{:else if section === "handle"}
		<!-- Handle with a visible grip. -->
		<div class="demoFrame" style="height: 10rem">
			<ResizablePanelGroup>
				<ResizablePanel defaultSize={25} minSize={15} maxSize={40}><div class="demoPanel">Sidebar</div></ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={75}><div class="demoPanel">Content</div></ResizablePanel>
			</ResizablePanelGroup>
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

	.demoFrame {
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		width: 100%;
		max-width: 28rem;
		overflow: hidden;
	}

	.demoPanel {
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding: var(--spacing-xl);
		height: 100%;
		font-weight: 600;
		font-size: var(--text-sm);
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
