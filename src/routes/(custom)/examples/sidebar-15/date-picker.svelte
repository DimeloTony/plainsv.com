<script lang="ts">
	import { SidebarGroup, SidebarGroupContent } from "#lib/components/ui/sidebar/index.js";
	import { Calendar } from "#lib/components/ui/calendar/index.js";
	// The 12th of this month starts selected.
	const today = new Date();
	let date = $state(new Date(today.getFullYear(), today.getMonth(), 12));
</script>

<!-- Month calendar with month and year selects, on the sidebar background. -->
<SidebarGroup style="padding-inline: 0">
	<SidebarGroupContent>
		<Calendar bind:value={date} captionLayout="dropdown" variant="ghost" style="margin-inline: auto" />
	</SidebarGroupContent>
</SidebarGroup>
