<script lang="ts">
	import { PageMeta } from "#lib/components/shared/index.js";
	import SettingsDialog from "./settings-dialog.svelte";
</script>

<PageMeta title="Sidebar 13 example" description="A sidebar in a dialog." />

<!-- Centered button that opens the settings dialog. -->
<div class="dialogPage not-typeset">
	<SettingsDialog />
</div>

<style>
	.dialogPage {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100svh;
	}
</style>
