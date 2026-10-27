<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	import type { SlotProps } from "./index.js";
	const { index, size, rounded, class: className, ...props }: SlotProps = $props();
	const ctx = useCompCtx();
	const char = $derived(ctx.value[index] ?? "");
	const isActive = $derived(ctx.focused && ctx.activeIndex === index);
</script>

<!-- One character of the code; the active slot draws a blinking caret while it is empty. -->
<div class={["inputOtpSlot", className]} data-active={isActive} data-invalid={ctx.invalid} data-size={size ?? ctx.size} data-rounded={rounded ?? ctx.rounded} {...props}>
	{char}
	{#if isActive && !char}
		<span class="inputOtpCaret" aria-hidden="true"></span>
	{/if}
</div>

<style>
	/* Base slot; neighbors share a border, and clicks pass through to the native input */
	.inputOtpSlot {
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		transition-duration: 150ms;
		transition-property: border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		box-shadow: 0 1px 2px 0 color-mix(in oklab, var(--foreground) 5%, transparent);
		border-top: 1px solid var(--input);
		border-right: 1px solid var(--input);
		border-bottom: 1px solid var(--input);
		pointer-events: none;
		color: var(--foreground);
	}

	:global(.dark) .inputOtpSlot {
		background-color: color-mix(in oklab, var(--input) 30%, transparent);
	}

	/* Outer slots close the group's border and round its corners */
	.inputOtpSlot:first-child {
		border-left: 1px solid var(--input);
		border-top-left-radius: var(--input-otp-slot-radius);
		border-bottom-left-radius: var(--input-otp-slot-radius);
	}

	.inputOtpSlot:last-child {
		border-top-right-radius: var(--input-otp-slot-radius);
		border-bottom-right-radius: var(--input-otp-slot-radius);
	}

	/* Fake caret centered in the empty active slot */
	.inputOtpCaret {
		animation: inputOtpCaretBlink 1.25s ease-out infinite;
		background-color: var(--foreground);
		width: 1px;
		height: 1rem; /* 16px */
	}

	@keyframes inputOtpCaretBlink {
		0%,
		70%,
		100% {
			opacity: 1;
		}
		20%,
		50% {
			opacity: 0;
		}
	}

	/* =============== States =============== */

	/* Focus ring on the slot that receives the next character; raised above its neighbors */
	.inputOtpSlot[data-active="true"] {
		z-index: 1;
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
		border-color: var(--ring);
	}

	/* Invalid state from aria-invalid on the root */
	.inputOtpSlot[data-invalid="true"] {
		border-color: var(--destructive);
	}

	.inputOtpSlot[data-invalid="true"][data-active="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
	}

	:global(.dark) .inputOtpSlot[data-invalid="true"][data-active="true"] {
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
	}

	/* =============== Sizes =============== */

	/* Large */
	.inputOtpSlot[data-size="lg"] {
		--input-otp-slot-radius: var(--radius-lg);
		width: var(--control-height-lg);
		height: var(--control-height-lg);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Medium — default */
	.inputOtpSlot[data-size="md"] {
		--input-otp-slot-radius: var(--radius-md);
		width: var(--control-height-md);
		height: var(--control-height-md);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Small */
	.inputOtpSlot[data-size="sm"] {
		--input-otp-slot-radius: var(--radius-sm);
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		font-size: var(--text-sm);
		line-height: var(--line-height-sm);
	}

	/* Extra small */
	.inputOtpSlot[data-size="xs"] {
		--input-otp-slot-radius: var(--radius-xs);
		width: var(--control-height-xs);
		height: var(--control-height-xs);
		font-size: var(--text-xs);
		line-height: var(--line-height-xs);
	}

	.inputOtpSlot[data-size="xs"] .inputOtpCaret {
		height: 0.75rem; /* 12px */
	}

	/* =============== Rounded =============== */

	/* Overrides the size radius of the outer slots; must stay after the size rules */
	.inputOtpSlot[data-rounded="xs"] {
		--input-otp-slot-radius: var(--radius-xs);
	}

	.inputOtpSlot[data-rounded="sm"] {
		--input-otp-slot-radius: var(--radius-sm);
	}

	.inputOtpSlot[data-rounded="md"] {
		--input-otp-slot-radius: var(--radius-md);
	}

	.inputOtpSlot[data-rounded="lg"] {
		--input-otp-slot-radius: var(--radius-lg);
	}

	.inputOtpSlot[data-rounded="xl"] {
		--input-otp-slot-radius: var(--radius-xl);
	}

	.inputOtpSlot[data-rounded="2xl"] {
		--input-otp-slot-radius: var(--radius-2xl);
	}

	.inputOtpSlot[data-rounded="3xl"] {
		--input-otp-slot-radius: var(--radius-3xl);
	}

	.inputOtpSlot[data-rounded="4xl"] {
		--input-otp-slot-radius: var(--radius-4xl);
	}

	.inputOtpSlot[data-rounded="pill"] {
		--input-otp-slot-radius: var(--radius-pill);
	}
</style>
