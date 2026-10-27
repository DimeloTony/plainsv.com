<!-- Svelte port of orbling by Timotej Kochjar, https://github.com/kochjar/orbling, MIT License, Copyright (c) 2026 Timotej Kochjar. -->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import { actAt, type Mood } from "./moods.js";
	import type { Props } from "./index.js";
	const { mood = "idle", variant = "default", size = "md", label, class: className, ...props }: Props = $props();
	// Share of the remaining distance the eyes move toward the pointer each frame.
	const GAZE_EASE = 0.3;
	const gradientId = $props.id();
	let step = $state(0);
	// Mood that `step` counts for, so a new mood starts its acts from the beginning.
	let stepMood = $state<Mood>();
	let eyes = $state<HTMLElement>();
	let orbBody = $state<HTMLElement>();

	const currentStep = $derived(stepMood === mood ? step : 0);
	const act = $derived(actAt(mood, currentStep));

	/** Moves to the next act each time the act's timer loops. */
	function advance() {
		step = currentStep + 1;
		stepMood = mood;
	}

	/** Turns the eyes and body toward the pointer while the orb is watching. */
	const followPointer: Attachment<HTMLElement> = (root) => {
		const eyesEl = eyes;
		const bodyEl = orbBody;
		// If the orb is not watching, its parts are not mounted, or the user prefers reduced motion: leave it still.
		if (act !== "watch" || !eyesEl || !bodyEl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const aim = { x: 0, y: 0 };
		const look = { x: 0, y: 0 };
		let center = { x: 0, y: 0, reach: 0 };
		let frame = 0;

		/** Stores the orb center and how far the pointer must move for a full turn. */
		const measure = () => {
			const box = root.getBoundingClientRect();
			center = { x: box.left + box.width / 2, y: box.top + box.height / 2, reach: Math.max(box.width * 4, 240) };
		};

		/** Eases the look toward the aim and draws it, until both meet. */
		const draw = () => {
			look.x += (aim.x - look.x) * GAZE_EASE;
			look.y += (aim.y - look.y) * GAZE_EASE;
			eyesEl.style.setProperty("--orbling-ry", `${look.x * 28}deg`);
			eyesEl.style.setProperty("--orbling-rx", `${look.y * -24}deg`);
			bodyEl.style.rotate = `${look.x * 6}deg`;
			bodyEl.style.translate = `${look.x * 0.02}em ${look.y * 0.015}em`;
			const isMoving = Math.abs(aim.x - look.x) + Math.abs(aim.y - look.y) > 0.002;
			frame = isMoving ? requestAnimationFrame(draw) : 0;
		};

		/** Aims at the pointer, clamped to one full turn each way. */
		const aimAt = (event: PointerEvent) => {
			aim.x = clamp((event.clientX - center.x) / center.reach);
			aim.y = clamp((event.clientY - center.y) / center.reach);
			if (!frame) frame = requestAnimationFrame(draw);
		};

		measure();
		window.addEventListener("pointermove", aimAt, { passive: true });
		window.addEventListener("scroll", measure, { passive: true });
		window.addEventListener("resize", measure);

		return () => {
			window.removeEventListener("pointermove", aimAt);
			window.removeEventListener("scroll", measure);
			window.removeEventListener("resize", measure);
			cancelAnimationFrame(frame);
			eyesEl.style.removeProperty("--orbling-ry");
			eyesEl.style.removeProperty("--orbling-rx");
			bodyEl.style.removeProperty("rotate");
			bodyEl.style.removeProperty("translate");
		};
	};

	/** Limits a value to the range -1 to 1. */
	function clamp(value: number) {
		return Math.max(-1, Math.min(1, value));
	}
</script>

<!-- Orb root; its font size sets the diameter, so every part scales in `em`. -->
<span {@attach followPointer} class={["orbling not-typeset", className]} data-act={act} data-variant={variant} data-size={size} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...props}>
	<!-- Hidden timer; each loop of its animation advances the mood to its next act. -->
	{#key act}
		<span class="clock" onanimationiteration={advance}></span>
	{/key}

	<!-- Effects around the orb: typing dots, sleep z's, a question mark, and an exclamation mark. -->
	<span class="effects">
		<span class="dot" data-side="l"></span>
		<span class="dot" data-side="r"></span>
		{#each [0, 1, 2] as index (index)}
			<span class="sleepZ" style:--orbling-z-step={index}>z</span>
		{/each}
		<svg class="question" viewBox="0 0 100 140">
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop class="questionStopTop" offset="0" />
					<stop class="questionStopBottom" offset="1" />
				</linearGradient>
			</defs>
			<path class="questionHook" pathLength="1" stroke="url(#{gradientId})" d="M24 40 C24 18 40 6 58 6 C78 6 92 20 92 38 C92 56 78 64 68 72 C61 78 58 84 58 96" />
			<circle class="questionDot" cx="58" cy="122" r="10" />
		</svg>
		<svg class="bang" viewBox="0 0 40 100">
			<path d="M20 4 C27 4 31 9 30 16 L26 62 C25.5 67 23 69 20 69 C17 69 14.5 67 14 62 L10 16 C9 9 13 4 20 4 Z" />
			<circle cx="20" cy="87" r="9" />
		</svg>
	</span>

	<!-- Orb body: the ball with its glow, gloss, and eyes, plus the shade and tint some acts fade in. -->
	<span class="orbBody" bind:this={orbBody}>
		<span class="orbMask">
			<span class="ball">
				<span class="heat"></span>
				<span class="gloss"></span>
				<span class="eyes" bind:this={eyes}>
					<i></i>
					<i></i>
				</span>
			</span>
			<span class="shade"></span>
		</span>
		<span class="tint"></span>
	</span>
</span>

<style>
	/* Eye turn angles, registered so keyframes can animate them */
	@property --orbling-ry {
		syntax: "<angle>";
		inherits: false;
		initial-value: 0deg;
	}

	@property --orbling-rx {
		syntax: "<angle>";
		inherits: false;
		initial-value: 0deg;
	}

	/* Base orb; every palette color derives from `--orbling-color`, with the lightness of the original blue palette */
	.orbling {
		--orbling-color: var(--chart-1);
		--orbling-ball: oklch(from var(--orbling-color) 0.901 calc(c * 0.31) calc(h - 18));
		--orbling-ground-light: oklch(from var(--orbling-color) 0.936 calc(c * 0.2) calc(h - 20));
		--orbling-ground-dark: oklch(from var(--orbling-color) 0.78 calc(c * 0.57) calc(h + 3));
		--orbling-eye: oklch(from var(--orbling-color) 0.399 calc(c * 0.89) calc(h + 7));
		--orbling-accent: oklch(from var(--orbling-color) 0.734 calc(c * 0.77) calc(h + 7));
		--orbling-accent-deep: oklch(from var(--orbling-color) 0.598 calc(c * 1.32) calc(h + 7));
		--orbling-heat: oklch(from var(--orbling-color) 0.705 calc(c * 0.74) calc(h + 9));
		--orbling-heat-pale: oklch(from var(--orbling-color) 0.829 calc(c * 0.5) calc(h + 5));
		--orbling-underside: oklch(from var(--orbling-color) 0.669 calc(c * 0.53) calc(h + 1) / 0.35);
		--orbling-shade-light: oklch(from var(--orbling-color) 0.773 calc(c * 0.52) calc(h + 9));
		--orbling-shade-dark: oklch(from var(--orbling-color) 0.7 calc(c * 0.66) calc(h + 9));
		--orbling-ease: cubic-bezier(0.45, 0, 0.25, 1);
		--orbling-in: cubic-bezier(0.16, 1, 0.3, 1);
		--orbling-out: cubic-bezier(0.7, 0, 0.84, 0);
		--orbling-whip: cubic-bezier(0.6, 0, 0.2, 1);
		--orbling-rise: cubic-bezier(0.2, 0.6, 0.35, 1);
		--orbling-fall: cubic-bezier(0.6, 0, 0.8, 0.4);
		/* Mask shapes; mask colors only set coverage, so black means fully shown */
		--orbling-disc: radial-gradient(circle closest-side, black calc(100% - 1px), transparent 100%);
		--orbling-gear: url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Cpath%20d%3D%27M39.23%2015.65%20L41.41%202.27%20L58.59%202.27%20L60.77%2015.65%20A36%2036%200%200%201%2074.37%2023.50%20L87.04%2018.70%20L95.63%2033.57%20L85.13%2042.15%20A36%2036%200%200%201%2085.13%2057.85%20L95.63%2066.43%20L87.04%2081.30%20L74.37%2076.50%20A36%2036%200%200%201%2060.77%2084.35%20L58.59%2097.73%20L41.41%2097.73%20L39.23%2084.35%20A36%2036%200%200%201%2025.63%2076.50%20L12.96%2081.30%20L4.37%2066.43%20L14.87%2057.85%20A36%2036%200%200%201%2014.87%2042.15%20L4.37%2033.57%20L12.96%2018.70%20L25.63%2023.50%20A36%2036%200%200%201%2039.23%2015.65%20Z%27%20fill%3D%27black%27%20stroke%3D%27black%27%20stroke-width%3D%273%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E");
		--orbling-duration: 4s;
		display: inline-block;
		position: relative;
		flex-shrink: 0;
		vertical-align: middle;
		width: 1em;
		height: 1em;
		line-height: 1;
	}

	/* Hidden timer that loops once per act */
	.clock {
		position: absolute;
		animation: orblingClock var(--orbling-duration) linear infinite;
		width: 0;
		height: 0;
	}

	.orbBody {
		position: absolute;
		z-index: 1;
		inset: 0;
	}

	/* Larger than the ball so the gear mask has room around it */
	.orbMask {
		position: absolute;
		mask-position: center;
		mask-repeat: no-repeat;
		inset: -12.5%;
	}

	.ball {
		position: absolute;
		animation: orblingBreathe 5s ease-in-out infinite;
		container-type: size;
		inset: 10%;
		box-shadow: 0 0 0.045em 0.0075em color-mix(in oklab, var(--orbling-accent) 60%, transparent);
		border-radius: var(--radius-pill);
		background: radial-gradient(circle at 34% 28%, var(--orbling-ground-light), var(--orbling-ball) 45%, var(--orbling-ground-dark) 100%);
		isolation: isolate;
		overflow: hidden;
	}

	.gloss,
	.heat,
	.eyes {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	/* Highlight and rim light; white is derived from the orb color so it stays a token */
	.gloss {
		box-shadow:
			inset 0 -8cqw 16cqw var(--orbling-underside),
			inset 0 2cqw 4cqw oklch(from var(--orbling-color) 1 0 h / 0.45),
			inset 0 0 0 1px oklch(from var(--orbling-color) 1 0 h / 0.25);
		border-radius: inherit;
		background: radial-gradient(circle at 32% 22%, oklch(from var(--orbling-color) 1 0 h / 0.75), oklch(from var(--orbling-color) 1 0 h / 0.12) 30%, transparent 46%);
	}

	/* Drifting inner glow, the CSS version of the original WebGL heat shader */
	.heat {
		border-radius: inherit;
		overflow: hidden;
	}

	.heat::before,
	.heat::after {
		position: absolute;
		opacity: 0;
		filter: blur(9cqw);
		animation: orblingHeatA 7.5s ease-in-out infinite;
		inset: 10%;
		border-radius: var(--radius-pill);
		background: radial-gradient(circle, var(--orbling-heat) 0%, var(--orbling-accent) 35%, transparent 70%);
		content: "";
	}

	.heat::after {
		animation: orblingHeatB 9.7s ease-in-out infinite;
		inset: 20%;
		background: radial-gradient(circle, var(--orbling-accent) 0%, var(--orbling-heat-pale) 40%, transparent 72%);
	}

	/* Eyes turn in 3D around the ball center with `--orbling-ry` and `--orbling-rx` */
	.eyes {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 14cqw;
		transform: perspective(260cqw) translateZ(-50cqw) rotateY(var(--orbling-ry)) rotateX(var(--orbling-rx)) translateZ(50cqw);
		backface-visibility: hidden;
		padding-bottom: 4cqw;
	}

	.eyes i {
		position: relative;
		animation: orblingBlink 6.3s ease-in-out infinite;
		border-radius: var(--radius-pill);
		background-color: var(--orbling-eye);
		width: 10cqw;
		height: 19cqw;
	}

	.shade {
		position: absolute;
		opacity: 0;
		z-index: 3;
		mix-blend-mode: multiply;
		inset: 10%;
		border-radius: var(--radius-pill);
		background: radial-gradient(circle, var(--orbling-shade-light), var(--orbling-shade-dark));
		pointer-events: none;
	}

	.tint {
		position: absolute;
		opacity: 0;
		z-index: 2;
		inset: 0;
		border-radius: var(--radius-pill);
		background: linear-gradient(180deg, var(--orbling-accent), var(--orbling-accent-deep));
	}

	.effects {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.effects > * {
		position: absolute;
		opacity: 0;
		overflow: visible;
	}

	.dot {
		z-index: 2;
		margin: auto;
		inset: 0;
		border-radius: var(--radius-pill);
		background: linear-gradient(180deg, var(--orbling-accent), var(--orbling-accent-deep));
		width: 22%;
		height: 22%;
	}

	/* Each z is a bit larger and further right than the last */
	.sleepZ {
		--orbling-z-scale: 0.42;
		--orbling-z-grow: calc(0.8 + var(--orbling-z-step) * 0.22);
		top: calc(-0.02em / var(--orbling-z-scale));
		left: calc((0.68em + var(--orbling-z-step) * 0.06em) / var(--orbling-z-scale));
		z-index: 2;
		color: var(--orbling-accent-deep);
		font:
			800 calc(var(--orbling-z-scale) * 1em) / 1 ui-rounded,
			"SF Pro Rounded",
			var(--font-sans, system-ui, sans-serif);
	}

	.question {
		z-index: 2;
	}

	.questionStopTop {
		stop-color: var(--orbling-accent);
	}

	.questionStopBottom {
		stop-color: var(--orbling-accent-deep);
	}

	.questionHook {
		fill: none;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 16;
	}

	.questionDot {
		transform-box: fill-box;
		transform-origin: center;
		opacity: 0;
		fill: var(--orbling-accent-deep);
	}

	.bang {
		top: -0.36em;
		left: 0.86em;
		transform-origin: 50% 100%;
		z-index: 2;
		fill: var(--orbling-accent-deep);
		width: 0.17em;
		height: 0.42em;
	}

	/* =============== Variants =============== */

	/* `default` uses `--chart-1` from the base rule */
	.orbling[data-variant="secondary"] {
		--orbling-color: var(--muted-foreground);
	}

	.orbling[data-variant="destructive"] {
		--orbling-color: var(--destructive);
	}

	/* =============== States =============== */

	/* One act per mood step; `--orbling-duration` is the length of one loop */
	.orbling[data-act="idle"] {
		--orbling-duration: 11s;
	}
	.orbling[data-act="spin"] {
		--orbling-duration: 1.5s;
	}
	.orbling[data-act="dots"],
	.orbling[data-act="gear"] {
		--orbling-duration: 3.8s;
	}
	.orbling[data-act="ponder"] {
		--orbling-duration: 4.6s;
	}
	.orbling[data-act="read"],
	.orbling[data-act="wonder"],
	.orbling[data-act="down"],
	.orbling[data-act="stamp"] {
		--orbling-duration: 4.2s;
	}
	.orbling[data-act="surprise"] {
		--orbling-duration: 2.6s;
	}
	.orbling[data-act="sleep"] {
		--orbling-duration: 5.6s;
	}
	.orbling[data-act="shake"] {
		--orbling-duration: 2.4s;
	}

	/* Idle: looks around */
	.orbling[data-act="idle"] .eyes {
		animation: orblingLookAround var(--orbling-duration) cubic-bezier(0.45, 0, 0.2, 1) infinite;
	}

	/* Spin: turns the eyes all the way round, the intro of thinking */
	.orbling[data-act="spin"] .eyes {
		animation: orblingSpinEyes var(--orbling-duration) var(--orbling-whip) infinite both;
	}

	.orbling[data-act="spin"] .orbBody {
		animation: orblingSpinBody var(--orbling-duration) var(--orbling-whip) infinite both;
	}

	/* Dots: shrinks into three bouncing dots, for typing */
	.orbling[data-act="dots"] .eyes {
		animation: orblingDotsEyes var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="dots"] .orbBody {
		animation: orblingDotsBody var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="dots"] .tint {
		animation: orblingDotsTint var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="dots"] .dot[data-side="l"] {
		animation: orblingDotLeft var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="dots"] .dot[data-side="r"] {
		animation: orblingDotRight var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	/* Gear: morphs into a turning gear, for working */
	.orbling[data-act="gear"] .orbMask {
		mask-image: var(--orbling-disc), var(--orbling-gear), var(--orbling-disc);
		mask-composite: exclude, add, add;
		animation:
			orblingGearMorph var(--orbling-duration) var(--orbling-ease) infinite both,
			orblingGearTurn var(--orbling-duration) linear infinite both;
	}

	.orbling[data-act="gear"] .ball {
		animation:
			orblingBreathe 5s ease-in-out infinite,
			orblingGearUnturn var(--orbling-duration) linear infinite both;
	}

	.orbling[data-act="gear"] .shade {
		animation: orblingGearShade var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="gear"] .eyes {
		animation: orblingEyesOut var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	/* Ponder: tilts and squints, for thinking */
	.orbling[data-act="ponder"] .orbBody {
		transform-origin: 50% 90%;
		animation: orblingPonderTilt var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="ponder"] .eyes {
		animation: orblingPonderLook var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="ponder"] .eyes i {
		animation: orblingPonderSquint var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	/* Read: scans lines left to right */
	.orbling[data-act="read"] .eyes {
		animation: orblingRead var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	/* Wonder: tilts and draws a question mark, the first half of asking */
	.orbling[data-act="wonder"] .orbBody {
		transform-origin: 50% 85%;
		animation: orblingTilt var(--orbling-duration) cubic-bezier(0.45, 0, 0.2, 1) infinite both;
	}

	.orbling[data-act="wonder"] .eyes {
		animation: orblingUpRight var(--orbling-duration) cubic-bezier(0.45, 0, 0.2, 1) infinite both;
	}

	.orbling[data-act="wonder"] .question {
		top: -0.6em;
		left: 0.84em;
		rotate: 10deg;
		opacity: 1;
		width: 0.52em;
		height: 0.72em;
	}

	.orbling[data-act="wonder"] .questionHook {
		animation: orblingDraw var(--orbling-duration) infinite both;
	}

	.orbling[data-act="wonder"] .questionDot {
		animation: orblingQuestionDot var(--orbling-duration) infinite both;
	}

	/* Down: looks down, for waiting */
	.orbling[data-act="down"] .orbBody {
		animation: orblingDip var(--orbling-duration) infinite both;
	}

	.orbling[data-act="down"] .eyes {
		animation: orblingLookDown var(--orbling-duration) infinite both;
	}

	/* Stamp: a question mark drops on its head, the second half of asking */
	.orbling[data-act="stamp"] .orbBody {
		transform-origin: 50% 100%;
		animation: orblingSquash var(--orbling-duration) infinite both;
	}

	.orbling[data-act="stamp"] .eyes {
		animation: orblingUp var(--orbling-duration) cubic-bezier(0.45, 0, 0.2, 1) infinite both;
	}

	.orbling[data-act="stamp"] .question {
		top: -0.8em;
		left: 0.22em;
		transform-origin: 50% 100%;
		animation: orblingDrop var(--orbling-duration) infinite both;
		width: 0.62em;
		height: 0.87em;
	}

	.orbling[data-act="stamp"] .questionHook {
		stroke-dashoffset: 0;
	}

	.orbling[data-act="stamp"] .questionDot {
		opacity: 1;
	}

	/* Surprise: jumps with wide eyes and an exclamation mark */
	.orbling[data-act="surprise"] .orbBody {
		transform-origin: 50% 100%;
		animation: orblingJump var(--orbling-duration) infinite both;
	}

	.orbling[data-act="surprise"] .eyes {
		animation: orblingSurpriseLook var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="surprise"] .eyes i {
		animation: orblingWide var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="surprise"] .bang {
		animation: orblingBang var(--orbling-duration) infinite both;
	}

	/* Sleep: dozes off with rising z's */
	.orbling[data-act="sleep"] .orbBody {
		transform-origin: 50% 100%;
		animation: orblingDoze var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="sleep"] .eyes {
		animation: orblingSleepLook var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="sleep"] .eyes i {
		animation: orblingLids var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="sleep"] .sleepZ {
		animation: orblingSleepZ var(--orbling-duration) var(--orbling-ease) infinite both;
		animation-delay: calc(var(--orbling-z-step) * 0.6s);
	}

	/* Shake: shakes its head and squints, for errors */
	.orbling[data-act="shake"] .orbBody {
		animation: orblingNo var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="shake"] .eyes {
		animation: orblingNoLook var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	.orbling[data-act="shake"] .eyes i {
		animation: orblingSquint var(--orbling-duration) var(--orbling-ease) infinite both;
	}

	/* Watch: follows the pointer from script */
	.orbling[data-act="watch"] .orbBody {
		transform-origin: 50% 90%;
	}

	/* Holds every part still when the user prefers reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.orbling *,
		.orbling *::before,
		.orbling *::after {
			animation: none !important;
		}
	}

	/* =============== Sizes =============== */

	/* Large */
	.orbling[data-size="lg"] {
		font-size: 7.5rem; /* 120px */
	}

	/* Medium — default */
	.orbling[data-size="md"] {
		font-size: 4.5rem; /* 72px */
	}

	/* Small */
	.orbling[data-size="sm"] {
		font-size: 2rem; /* 32px */
	}

	/* Extra small */
	.orbling[data-size="xs"] {
		font-size: 1rem; /* 16px */
	}

	/* =============== Keyframes =============== */

	@keyframes orblingClock {
		to {
			opacity: 1;
		}
	}

	@keyframes orblingBreathe {
		0%,
		100% {
			scale: 1;
		}
		50% {
			scale: 1.035;
		}
	}

	@keyframes orblingBlink {
		0%,
		44%,
		48%,
		90%,
		93%,
		96%,
		100% {
			scale: 1 1;
		}
		46%,
		91.5%,
		94.5% {
			scale: 1 0.1;
		}
	}

	@keyframes orblingHeatA {
		0%,
		100% {
			translate: -30% 25%;
			opacity: 0.4;
		}
		20% {
			opacity: 0.95;
		}
		50% {
			translate: 20% -20%;
			opacity: 0.8;
		}
		75% {
			opacity: 0.45;
		}
	}

	@keyframes orblingHeatB {
		0%,
		100% {
			translate: 35% 30%;
			opacity: 0.35;
		}
		30% {
			opacity: 0.85;
		}
		60% {
			translate: -25% -15%;
			opacity: 0.7;
		}
		85% {
			opacity: 0.4;
		}
	}

	@keyframes orblingEyesOut {
		0%,
		6% {
			opacity: 1;
		}
		18%,
		82% {
			opacity: 0;
		}
		94%,
		100% {
			opacity: 1;
		}
	}

	@keyframes orblingLookAround {
		0%,
		16% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		20%,
		34% {
			--orbling-ry: -20deg;
			--orbling-rx: 5deg;
		}
		38%,
		50% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		54%,
		66% {
			--orbling-ry: 18deg;
			--orbling-rx: -3deg;
		}
		70%,
		80% {
			--orbling-ry: 5deg;
			--orbling-rx: 14deg;
		}
		84%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
	}

	@keyframes orblingSpinEyes {
		0% {
			--orbling-ry: 0deg;
			animation-timing-function: cubic-bezier(0.25, 0.6, 0.35, 1);
		}
		18% {
			--orbling-ry: -24deg;
			animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1);
		}
		56% {
			--orbling-ry: 376deg;
			animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
		}
		70% {
			--orbling-ry: 356deg;
			animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
		}
		82% {
			--orbling-ry: 361.5deg;
			animation-timing-function: cubic-bezier(0.25, 0.6, 0.35, 1);
		}
		100% {
			--orbling-ry: 360deg;
		}
	}

	@keyframes orblingSpinBody {
		0% {
			scale: 1 1;
			animation-timing-function: cubic-bezier(0.25, 0.6, 0.35, 1);
		}
		18% {
			scale: 1.06 0.94;
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		37% {
			scale: 0.94 1.06;
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		56% {
			scale: 1.03 0.97;
			animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
		}
		70% {
			scale: 0.99 1.01;
		}
		82%,
		100% {
			scale: 1 1;
		}
	}

	@keyframes orblingDotsEyes {
		0%,
		6% {
			opacity: 1;
		}
		14%,
		86% {
			opacity: 0;
		}
		95%,
		100% {
			opacity: 1;
		}
	}

	@keyframes orblingDotsTint {
		0%,
		8% {
			opacity: 0;
		}
		18%,
		82% {
			opacity: 1;
		}
		92%,
		100% {
			opacity: 0;
		}
	}

	@keyframes orblingDotsBody {
		0%,
		4% {
			translate: 0 0;
			scale: 1;
		}
		18% {
			scale: 0.22;
		}
		33% {
			translate: 0 0;
			animation-timing-function: var(--orbling-rise);
		}
		39% {
			translate: 0 -10%;
			animation-timing-function: var(--orbling-fall);
		}
		45% {
			translate: 0 0;
		}
		57% {
			translate: 0 0;
			animation-timing-function: var(--orbling-rise);
		}
		63% {
			translate: 0 -10%;
			animation-timing-function: var(--orbling-fall);
		}
		69% {
			translate: 0 0;
		}
		82% {
			scale: 0.22;
		}
		96%,
		100% {
			translate: 0 0;
			scale: 1;
		}
	}

	@keyframes orblingDotLeft {
		0%,
		10% {
			translate: 0 0;
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		24% {
			translate: -164% 0;
		}
		27% {
			translate: -164% 0;
			animation-timing-function: var(--orbling-rise);
		}
		33% {
			translate: -164% -45%;
			animation-timing-function: var(--orbling-fall);
		}
		39% {
			translate: -164% 0;
		}
		51% {
			translate: -164% 0;
			animation-timing-function: var(--orbling-rise);
		}
		57% {
			translate: -164% -45%;
			animation-timing-function: var(--orbling-fall);
		}
		63% {
			translate: -164% 0;
		}
		76% {
			translate: -164% 0;
			opacity: 1;
		}
		86% {
			translate: 0 0;
			opacity: 1;
		}
		88%,
		100% {
			translate: 0 0;
			opacity: 0;
		}
	}

	@keyframes orblingDotRight {
		0%,
		10% {
			translate: 0 0;
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		24% {
			translate: 164% 0;
		}
		39% {
			translate: 164% 0;
			animation-timing-function: var(--orbling-rise);
		}
		45% {
			translate: 164% -45%;
			animation-timing-function: var(--orbling-fall);
		}
		51% {
			translate: 164% 0;
		}
		63% {
			translate: 164% 0;
			animation-timing-function: var(--orbling-rise);
		}
		69% {
			translate: 164% -45%;
			animation-timing-function: var(--orbling-fall);
		}
		75% {
			translate: 164% 0;
		}
		76% {
			translate: 164% 0;
			opacity: 1;
		}
		86% {
			translate: 0 0;
			opacity: 1;
		}
		88%,
		100% {
			translate: 0 0;
			opacity: 0;
		}
	}

	@keyframes orblingGearMorph {
		0%,
		6% {
			mask-size:
				0% 0%,
				64% 64%,
				100% 100%;
		}
		26%,
		74% {
			mask-size:
				28.8% 28.8%,
				80% 80%,
				57.6% 57.6%;
		}
		94%,
		100% {
			mask-size:
				0% 0%,
				64% 64%,
				100% 100%;
		}
	}

	@keyframes orblingGearTurn {
		0%,
		6% {
			rotate: 0deg;
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		94%,
		100% {
			rotate: 360deg;
		}
	}

	@keyframes orblingGearUnturn {
		0%,
		6% {
			rotate: 0deg;
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		94%,
		100% {
			rotate: -360deg;
		}
	}

	@keyframes orblingGearShade {
		0%,
		6% {
			opacity: 0;
		}
		26%,
		74% {
			opacity: 0.6;
		}
		94%,
		100% {
			opacity: 0;
		}
	}

	@keyframes orblingPonderTilt {
		0%,
		8% {
			translate: 0 0;
			rotate: 0deg;
		}
		22%,
		40% {
			translate: 0 0;
			rotate: 6deg;
		}
		54%,
		70% {
			translate: 0 0;
			rotate: -5deg;
		}
		76% {
			translate: 0 0.035em;
			rotate: -2deg;
		}
		82% {
			translate: 0 0;
			rotate: -1deg;
		}
		94%,
		100% {
			translate: 0 0;
			rotate: 0deg;
		}
	}

	@keyframes orblingPonderLook {
		0%,
		8% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		22%,
		40% {
			--orbling-ry: -18deg;
			--orbling-rx: 18deg;
		}
		54%,
		70% {
			--orbling-ry: 16deg;
			--orbling-rx: 15deg;
		}
		76% {
			--orbling-ry: 4deg;
			--orbling-rx: -4deg;
		}
		82% {
			--orbling-ry: 2deg;
			--orbling-rx: 2deg;
		}
		94%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
	}

	@keyframes orblingPonderSquint {
		0%,
		10% {
			scale: 1 1;
		}
		22%,
		70% {
			scale: 1.06 0.78;
		}
		76%,
		100% {
			scale: 1 1;
		}
	}

	@keyframes orblingRead {
		0% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		12% {
			--orbling-ry: -10deg;
			--orbling-rx: 4deg;
			animation-timing-function: linear;
		}
		42% {
			--orbling-ry: 10deg;
			--orbling-rx: 4deg;
		}
		54% {
			--orbling-ry: -10deg;
			--orbling-rx: -1deg;
			animation-timing-function: linear;
		}
		84% {
			--orbling-ry: 10deg;
			--orbling-rx: -1deg;
		}
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
	}

	@keyframes orblingTilt {
		0%,
		10%,
		88%,
		100% {
			rotate: 0deg;
		}
		22%,
		76% {
			rotate: -10deg;
		}
	}

	@keyframes orblingUpRight {
		0%,
		10%,
		88%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		22%,
		76% {
			--orbling-ry: 20deg;
			--orbling-rx: 16deg;
		}
	}

	@keyframes orblingDraw {
		0%,
		14% {
			opacity: 1;
			animation-timing-function: var(--orbling-in);
			stroke-dashoffset: 1;
		}
		32%,
		76% {
			opacity: 1;
			animation-timing-function: var(--orbling-out);
			stroke-dashoffset: 0;
		}
		88% {
			opacity: 0;
			stroke-dashoffset: 0;
		}
		100% {
			opacity: 0;
			stroke-dashoffset: 1;
		}
	}

	@keyframes orblingQuestionDot {
		0%,
		30% {
			scale: 1.6;
			opacity: 0;
			animation-timing-function: var(--orbling-in);
		}
		38%,
		76% {
			scale: 1;
			opacity: 1;
			animation-timing-function: var(--orbling-out);
		}
		88%,
		100% {
			scale: 0.85;
			opacity: 0;
		}
	}

	@keyframes orblingDip {
		0%,
		8% {
			translate: 0 0;
			animation-timing-function: var(--orbling-in);
		}
		22%,
		72% {
			translate: 0 0.04em;
			animation-timing-function: var(--orbling-ease);
		}
		88%,
		100% {
			translate: 0 0;
		}
	}

	@keyframes orblingLookDown {
		0%,
		8% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
			animation-timing-function: var(--orbling-in);
		}
		22% {
			--orbling-ry: -8deg;
			--orbling-rx: -22deg;
			animation-timing-function: var(--orbling-ease);
		}
		52%,
		72% {
			--orbling-ry: 8deg;
			--orbling-rx: -22deg;
			animation-timing-function: var(--orbling-ease);
		}
		88%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
	}

	@keyframes orblingUp {
		0%,
		10%,
		88%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		22%,
		76% {
			--orbling-ry: 0deg;
			--orbling-rx: 20deg;
		}
	}

	@keyframes orblingDrop {
		0%,
		12% {
			translate: 0 -1.1em;
			rotate: 0deg;
			opacity: 0;
			animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
		}
		24% {
			translate: 0 0;
			rotate: 0deg;
			opacity: 1;
			animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
		}
		28% {
			translate: 0 0.13em;
			rotate: 2deg;
			opacity: 1;
			animation-timing-function: var(--orbling-ease);
		}
		40%,
		76% {
			translate: 0 0;
			rotate: 8deg;
			opacity: 1;
			animation-timing-function: var(--orbling-out);
		}
		88%,
		100% {
			translate: 0 -0.2em;
			rotate: 8deg;
			opacity: 0;
		}
	}

	@keyframes orblingSquash {
		0%,
		24% {
			scale: 1 1;
			animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
		}
		28% {
			scale: 1.09 0.86;
			animation-timing-function: var(--orbling-ease);
		}
		40%,
		100% {
			scale: 1 1;
		}
	}

	@keyframes orblingJump {
		0%,
		8% {
			translate: 0 0;
			scale: 1 1;
			animation-timing-function: var(--orbling-ease);
		}
		14% {
			translate: 0 0;
			scale: 1.08 0.9;
			animation-timing-function: var(--orbling-rise);
		}
		26% {
			translate: 0 -0.16em;
			scale: 0.93 1.08;
			animation-timing-function: var(--orbling-fall);
		}
		38% {
			translate: 0 0;
			scale: 1.06 0.94;
			animation-timing-function: var(--orbling-ease);
		}
		46%,
		100% {
			translate: 0 0;
			scale: 1 1;
		}
	}

	@keyframes orblingSurpriseLook {
		0%,
		12%,
		84%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		24%,
		72% {
			--orbling-ry: 0deg;
			--orbling-rx: 8deg;
		}
	}

	@keyframes orblingWide {
		0%,
		12% {
			scale: 1 1;
		}
		20%,
		72% {
			scale: 1.3 1.3;
		}
		84%,
		100% {
			scale: 1 1;
		}
	}

	@keyframes orblingBang {
		0%,
		20% {
			scale: 0.4;
			opacity: 0;
			animation-timing-function: var(--orbling-in);
		}
		30%,
		72% {
			rotate: 0deg;
			scale: 1;
			opacity: 1;
			animation-timing-function: var(--orbling-out);
		}
		84%,
		100% {
			rotate: 8deg;
			scale: 0.8;
			opacity: 0;
		}
	}

	@keyframes orblingDoze {
		0%,
		8% {
			translate: 0 0;
			rotate: 0deg;
			scale: 1;
		}
		26% {
			translate: 0 0.03em;
			rotate: 7deg;
			scale: 1;
		}
		44% {
			translate: 0 0.03em;
			rotate: 7deg;
			scale: 1.025;
		}
		62% {
			translate: 0 0.03em;
			rotate: 7deg;
			scale: 1;
		}
		80% {
			translate: 0 0.03em;
			rotate: 7deg;
			scale: 1.025;
		}
		92%,
		100% {
			translate: 0 0;
			rotate: 0deg;
			scale: 1;
		}
	}

	@keyframes orblingSleepLook {
		0%,
		8%,
		90%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		26%,
		82% {
			--orbling-ry: 0deg;
			--orbling-rx: -5deg;
		}
	}

	@keyframes orblingLids {
		0%,
		8% {
			translate: 0 0;
			width: 10cqw;
			height: 19cqw;
		}
		26%,
		82% {
			translate: 0 2.5cqw;
			width: 16cqw;
			height: 8.5cqw;
		}
		94%,
		100% {
			translate: 0 0;
			width: 10cqw;
			height: 19cqw;
		}
	}

	@keyframes orblingSleepZ {
		0%,
		22% {
			translate: 0 0;
			scale: calc(var(--orbling-z-grow) * 0.6);
			opacity: 0;
		}
		32% {
			opacity: 1;
		}
		64%,
		100% {
			translate: calc(0.34em / var(--orbling-z-scale)) calc(-0.62em / var(--orbling-z-scale));
			scale: var(--orbling-z-grow);
			opacity: 0;
		}
	}

	@keyframes orblingNo {
		0%,
		8% {
			translate: 0 0;
			scale: 1 1;
		}
		16% {
			translate: -0.035em 0;
			scale: 1.02 0.97;
		}
		26% {
			translate: 0.035em 0;
		}
		36% {
			translate: -0.025em 0;
		}
		46% {
			translate: 0.015em 0;
		}
		56% {
			translate: 0 0;
			scale: 1.02 0.97;
		}
		84% {
			translate: 0 0.015em;
			scale: 1.02 0.97;
		}
		94%,
		100% {
			translate: 0 0;
			scale: 1 1;
		}
	}

	@keyframes orblingNoLook {
		0%,
		8% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
		16% {
			--orbling-ry: -22deg;
			--orbling-rx: 0deg;
		}
		26% {
			--orbling-ry: 22deg;
			--orbling-rx: 0deg;
		}
		36% {
			--orbling-ry: -16deg;
			--orbling-rx: 0deg;
		}
		46% {
			--orbling-ry: 10deg;
			--orbling-rx: 0deg;
		}
		56%,
		84% {
			--orbling-ry: 0deg;
			--orbling-rx: -10deg;
		}
		94%,
		100% {
			--orbling-ry: 0deg;
			--orbling-rx: 0deg;
		}
	}

	@keyframes orblingSquint {
		0%,
		8% {
			scale: 1 1;
		}
		16%,
		84% {
			scale: 1.1 0.55;
		}
		94%,
		100% {
			scale: 1 1;
		}
	}
</style>
