<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import type { Props } from "./index.js";
	const { variant = "default", size = "md", speed = 1, class: className, ...props }: Props = $props();
	// Shader time units per second at `speed` 1, which keeps the drift slow.
	const BASE_SPEED = 0.22;
	// Caps the canvas resolution, since denser pixels cost more than they show.
	const MAX_PIXEL_RATIO = 2;
	// Attributes that change the orb colors: theme classes on `html` or `body`, and the orb's own class, style, and variant.
	const COLOR_ATTRIBUTES = ["class", "style", "data-theme", "data-variant"];

	const VERTEX_SHADER = `
		attribute vec2 a_position;

		void main() {
			gl_Position = vec4(a_position, 0.0, 1.0);
		}
	`;

	const FRAGMENT_SHADER = `
		#ifdef GL_FRAGMENT_PRECISION_HIGH
		precision highp float;
		#else
		precision mediump float;
		#endif

		uniform vec2 u_resolution;
		uniform float u_time;
		uniform vec3 u_color;
		uniform vec3 u_highlight;

		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);

			return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
		}

		float fbm(vec2 p) {
			float v = 0.0;
			float a = 0.6;

			for (int i = 0; i < 3; i++) {
				v += a * noise(p);
				p *= 2.0;
				a *= 0.5;
			}

			return v;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / u_resolution.xy;
			float t = u_time;

			// Slow looping drift that moves the fluid around.
			vec2 drift = vec2(sin(t) + 0.6 * sin(t * 1.7 + 1.3), cos(t * 0.8) + 0.6 * cos(t * 1.3 + 2.1));
			vec2 p = vec2(uv.x * 1.8, uv.y) + drift * 0.7;
			vec2 q = vec2(fbm(p + drift), fbm(p + vec2(3.2, 1.5) - drift));
			float f = fbm(p + 1.2 * q);

			// Highlight at the top, color at the bottom, with the fluid only near the top.
			float g = clamp(1.0 - uv.y, 0.0, 1.0);
			float anchor = smoothstep(0.0, 0.3, uv.y);
			float shade = clamp(g + (f - 0.5) * 0.8 * anchor, 0.0, 1.0);

			vec3 light = mix(u_highlight, u_color, 0.5);
			vec3 col = mix(u_highlight, light, smoothstep(0.28, 0.52, shade));
			col = mix(col, u_color, smoothstep(0.58, 0.88, shade));

			// Circle mask with a soft edge; the output is premultiplied by its alpha.
			float edge = smoothstep(0.5, 0.49, distance(uv, vec2(0.5)));

			gl_FragColor = vec4(col * edge, edge);
		}
	`;

	/** Renders the fluid on the canvas with WebGL until the canvas is removed. */
	const renderOrb: Attachment<HTMLCanvasElement> = (canvas) => {
		const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
		const program = gl ? createProgram(gl) : null;
		// If WebGL or the shaders are unavailable: keep the CSS gradient behind the canvas.
		if (!gl || !program) return;
		gl.useProgram(program);

		// Two triangles that cover the canvas.
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
		const positionLocation = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		const timeLocation = gl.getUniformLocation(program, "u_time");
		const colorLocation = gl.getUniformLocation(program, "u_color");
		const highlightLocation = gl.getUniformLocation(program, "u_highlight");
		// One-pixel canvas that converts any CSS color, such as an `oklch()` token, to RGB.
		const pixel = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let time = 0;
		let lastFrame = 0;
		let frame = 0;
		let isVisible = false;
		let colorKey = "";

		/** Draws one frame at the current time. */
		const draw = () => {
			gl.uniform1f(timeLocation, time);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		};

		/** Advances the time by the elapsed frame time, scaled by `speed`, and draws. */
		const tick = (now: number) => {
			time += ((now - lastFrame) / 1000) * BASE_SPEED * speed;
			lastFrame = now;
			draw();
			frame = requestAnimationFrame(tick);
		};

		/** Starts or stops the animation to match visibility and the motion preference. */
		const syncLoop = () => {
			cancelAnimationFrame(frame);
			// If the orb is off screen or the user prefers reduced motion: hold the last frame.
			if (!isVisible || reducedMotion.matches) return;
			lastFrame = performance.now();
			frame = requestAnimationFrame(tick);
		};

		/** Matches the canvas resolution to its displayed size, then redraws. */
		const resize = () => {
			const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
			canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
			canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
			draw();
		};

		/** Reads the orb colors from CSS, so theme and variant changes reach the shader, then redraws. */
		const syncColors = () => {
			const style = getComputedStyle(canvas);
			const color = style.color;
			const highlight = style.getPropertyValue("--fluid-orb-highlight").trim() || style.getPropertyValue("--background").trim();
			// If the colors are unchanged or cannot be converted: skip the redraw.
			if (!pixel || `${color}|${highlight}` === colorKey) return;
			colorKey = `${color}|${highlight}`;
			const [r, g, b] = toRgb(pixel, color);
			const [hr, hg, hb] = toRgb(pixel, highlight);
			gl.uniform3f(colorLocation, r, g, b);
			gl.uniform3f(highlightLocation, hr, hg, hb);
			draw();
		};

		syncColors();
		resize();
		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		// Pauses the animation while the orb is scrolled out of view.
		const visibilityObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting;
			syncLoop();
		});
		visibilityObserver.observe(canvas);
		const colorObserver = new MutationObserver(syncColors);
		for (const target of [document.documentElement, document.body, canvas.parentElement]) {
			if (target) colorObserver.observe(target, { attributes: true, attributeFilter: COLOR_ATTRIBUTES });
		}
		reducedMotion.addEventListener("change", syncLoop);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			colorObserver.disconnect();
			reducedMotion.removeEventListener("change", syncLoop);
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			// Frees the context right away, since browsers cap how many WebGL contexts a page can hold.
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		};
	};

	/** Compiles and links the orb shaders, or returns null when either fails. */
	function createProgram(gl: WebGLRenderingContext) {
		const program = gl.createProgram();
		const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
		const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
		// If a shader failed to compile: give up, so the CSS fallback stays.
		if (!program || !vertexShader || !fragmentShader) return null;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		// The linked program keeps what it needs, so the shaders are flagged for deletion with it.
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		// If linking failed: log why and drop the program.
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}
		return program;
	}

	/** Compiles one shader, or logs the error and returns null. */
	function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		// If the shader failed to compile: log why and drop it.
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	/** Converts a CSS color to RGB channels from 0 to 1 by painting it onto one pixel. */
	function toRgb(context: CanvasRenderingContext2D, color: string) {
		context.clearRect(0, 0, 1, 1);
		// Resets the fill first, since an invalid color leaves the previous fill in place.
		context.fillStyle = "#000";
		context.fillStyle = color;
		context.fillRect(0, 0, 1, 1);
		const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
		return [r / 255, g / 255, b / 255];
	}
</script>

<!-- Orb box; the canvas paints over a CSS gradient that stays when WebGL is unavailable. -->
<div class={["fluidOrb not-typeset", className]} data-variant={variant} data-size={size} {...props}>
	<canvas {@attach renderOrb} aria-hidden="true"></canvas>
</div>

<style>
	/* Base orb; the highlight shows at the top and the text color at the bottom */
	.fluidOrb {
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background-image: linear-gradient(to bottom, var(--fluid-orb-highlight, var(--background)), currentColor);
		overflow: hidden;
	}

	/* Fills the orb; its pixel size follows the displayed size */
	.fluidOrb canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* =============== Variants =============== */

	/* `default` sets no color, so it follows the text color and `color` on the orb or a parent recolors it */
	.fluidOrb[data-variant="destructive"] {
		color: var(--destructive);
	}

	/* =============== Sizes =============== */

	/* Large */
	.fluidOrb[data-size="lg"] {
		width: 15rem; /* 240px */
		height: 15rem; /* 240px */
	}

	/* Medium — default */
	.fluidOrb[data-size="md"] {
		width: 10rem; /* 160px */
		height: 10rem; /* 160px */
	}

	/* Small */
	.fluidOrb[data-size="sm"] {
		width: 5rem; /* 80px */
		height: 5rem; /* 80px */
	}

	/* Extra small */
	.fluidOrb[data-size="xs"] {
		width: 2.5rem; /* 40px */
		height: 2.5rem; /* 40px */
	}
</style>
