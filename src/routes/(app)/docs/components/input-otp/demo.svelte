<script lang="ts">
	import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, REGEXP_ONLY_DIGITS_AND_CHARS, type InputOTPProps } from "#lib/components/ui/input-otp/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { DotIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];
	let code = $state("");
	let completedCode = $state("");

	/** Live preview for one section of the input OTP docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "pattern" | "separator" | "controlled" | "sizes" | "rounded" | "states";
	}
</script>

<!-- Six slots split into two groups of three, reused by most sections. -->
{#snippet splitCode(props: Omit<InputOTPProps, "children" | "maxlength">)}
	<InputOTP maxlength={6} {...props}>
		<InputOTPGroup>
			<InputOTPSlot index={0} />
			<InputOTPSlot index={1} />
			<InputOTPSlot index={2} />
		</InputOTPGroup>
		<InputOTPSeparator />
		<InputOTPGroup>
			<InputOTPSlot index={3} />
			<InputOTPSlot index={4} />
			<InputOTPSlot index={5} />
		</InputOTPGroup>
	</InputOTP>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Default split code used at the top of the page. -->
		{@render splitCode({})}
	{:else if section === "pattern"}
		<!-- Letters and digits, in one group. -->
		<InputOTP maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
			<InputOTPGroup>
				{#each { length: 6 }, index (index)}
					<InputOTPSlot {index} />
				{/each}
			</InputOTPGroup>
		</InputOTP>
	{:else if section === "separator"}
		<!-- Three groups of two with a custom dot separator. -->
		<InputOTP maxlength={6}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
			</InputOTPGroup>
			<InputOTPSeparator><DotIcon /></InputOTPSeparator>
			<InputOTPGroup>
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
			</InputOTPGroup>
			<InputOTPSeparator><DotIcon /></InputOTPSeparator>
			<InputOTPGroup>
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	{:else if section === "controlled"}
		<!-- Bound value with a label, a completion callback, and a reset button. -->
		<div class="demoField">
			<Label for="demoOtp">Verification code</Label>
			<InputOTP id="demoOtp" maxlength={6} bind:value={code} onComplete={(value) => (completedCode = value)}>
				<InputOTPGroup>
					{#each { length: 6 }, index (index)}
						<InputOTPSlot {index} />
					{/each}
				</InputOTPGroup>
			</InputOTP>
		</div>
		<p class="demoText">Value: {code || "empty"}. Completed: {completedCode || "not yet"}.</p>
		<Button variant="outline" size="sm" onclick={() => (code = "")}>Clear</Button>
	{:else if section === "sizes"}
		<!-- One code per size; the radius follows the size. -->
		{#each sizes as size (size)}
			{@render splitCode({ size })}
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value overriding the size radius. -->
		{#each roundedValues as rounded (rounded)}
			{@render splitCode({ rounded })}
		{/each}
	{:else if section === "states"}
		<!-- Disabled and invalid states. -->
		{@render splitCode({ disabled: true, value: "123" })}
		{@render splitCode({ "aria-invalid": "true", value: "123456" })}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}

	.demoField {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.demoText {
		margin: 0;
		color: var(--muted-foreground);
		font-size: var(--text-sm);
	}
</style>
