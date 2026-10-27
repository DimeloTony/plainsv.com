<script lang="ts">
	import { Field, FieldSet, FieldLegend, FieldGroup, FieldContent, FieldLabel, FieldTitle, FieldDescription, FieldSeparator, FieldError } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Textarea } from "#lib/components/ui/textarea/index.js";
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import { Switch } from "#lib/components/ui/switch/index.js";
	import { RadioGroup, RadioGroupItem } from "#lib/components/ui/radio-group/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	const { section = "preview" }: Props = $props();

	/** Live preview for one section of the field docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "horizontal" | "choice" | "error" | "disabled" | "separator";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- Payment form with two fieldsets. -->
		<form class="demoForm" onsubmit={(e) => e.preventDefault()}>
			<FieldGroup>
				<FieldSet>
					<FieldLegend>Payment method</FieldLegend>
					<FieldDescription>All transactions are secure and encrypted.</FieldDescription>
					<FieldGroup>
						<Field>
							<FieldLabel for="demo-card-name">Name on card</FieldLabel>
							<Input id="demo-card-name" placeholder="Evil Rabbit" />
						</Field>
						<Field>
							<FieldLabel for="demo-card-number">Card number</FieldLabel>
							<Input id="demo-card-number" placeholder="1234 5678 9012 3456" aria-describedby="demo-card-number-description" />
							<FieldDescription id="demo-card-number-description">Enter your 16-digit card number.</FieldDescription>
						</Field>
					</FieldGroup>
				</FieldSet>
				<FieldSet>
					<FieldLegend>Comments</FieldLegend>
					<Field>
						<Textarea placeholder="Add any additional comments" aria-label="Comments" />
					</Field>
				</FieldSet>
				<Field orientation="horizontal">
					<Button type="submit">Submit</Button>
					<Button variant="outline" type="button">Cancel</Button>
				</Field>
			</FieldGroup>
		</form>
	{:else if section === "horizontal"}
		<!-- Checkbox and switch beside their labels. -->
		<FieldGroup>
			<Field orientation="horizontal">
				<Checkbox id="demo-terms" defaultChecked />
				<FieldLabel for="demo-terms">Accept terms and conditions</FieldLabel>
			</Field>
			<Field orientation="horizontal">
				<FieldContent>
					<FieldLabel for="demo-marketing">Marketing emails</FieldLabel>
					<FieldDescription>Receive emails about new products and features.</FieldDescription>
				</FieldContent>
				<Switch id="demo-marketing" />
			</Field>
		</FieldGroup>
	{:else if section === "choice"}
		<!-- Labels that wrap a field become selectable cards. -->
		<FieldSet>
			<FieldLegend variant="label">Compute environment</FieldLegend>
			<RadioGroup defaultValue="kubernetes">
				<FieldLabel for="demo-kubernetes">
					<Field orientation="horizontal">
						<FieldContent>
							<FieldTitle>Kubernetes</FieldTitle>
							<FieldDescription>Run GPU workloads on a cluster.</FieldDescription>
						</FieldContent>
						<RadioGroupItem value="kubernetes" id="demo-kubernetes" />
					</Field>
				</FieldLabel>
				<FieldLabel for="demo-vm">
					<Field orientation="horizontal">
						<FieldContent>
							<FieldTitle>Virtual machine</FieldTitle>
							<FieldDescription>Access a VM-backed cluster.</FieldDescription>
						</FieldContent>
						<RadioGroupItem value="vm" id="demo-vm" />
					</Field>
				</FieldLabel>
			</RadioGroup>
		</FieldSet>
	{:else if section === "error"}
		<!-- Invalid field with its message. -->
		<Field invalid>
			<FieldLabel for="demo-username">Username</FieldLabel>
			<Input id="demo-username" value="a" aria-invalid="true" aria-describedby="demo-username-error" />
			<FieldError id="demo-username-error" errors={[{ message: "Username must be at least 3 characters." }, { message: "Username can only contain letters and numbers." }]} />
		</Field>
	{:else if section === "disabled"}
		<!-- Dimmed field beside a disabled input. -->
		<Field disabled>
			<FieldLabel for="demo-team">Team name</FieldLabel>
			<Input id="demo-team" value="Acme" disabled aria-describedby="demo-team-description" />
			<FieldDescription id="demo-team-description">Only owners can rename the team.</FieldDescription>
		</Field>
	{:else if section === "separator"}
		<!-- Separator with text between two options. -->
		<FieldGroup>
			<Button variant="outline">Continue with GitHub</Button>
			<FieldSeparator>Or continue with</FieldSeparator>
			<Field>
				<FieldLabel for="demo-email">Email</FieldLabel>
				<Input id="demo-email" type="email" placeholder="m@example.com" />
			</Field>
		</FieldGroup>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
		max-width: 28rem;
	}
</style>
