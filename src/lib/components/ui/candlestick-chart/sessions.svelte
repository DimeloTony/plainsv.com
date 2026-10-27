<svelte:options namespace="svg" />

<script lang="ts">
	import { useCompCtx } from "./ctx.svelte.js";
	const ctx = useCompCtx();
	// Space in pixels between a band's edge and its label.
	const LABEL_OFFSET = 4;
	// Runs of neighboring candles in the same highlight or session; a highlight wins over a session.
	const bands = $derived.by(() => {
		const runs: { key: string; first: number; last: number; label: string; color: string; kind: "session" | "highlight" }[] = [];
		for (const index of ctx.visibleIndexes) {
			const highlight = ctx.highlights[ctx.candleHighlights[index]];
			const session = ctx.sessions[ctx.candleSessions[index]];
			const key = highlight ? `highlight-${ctx.candleHighlights[index]}` : session ? `session-${ctx.candleSessions[index]}` : "";
			const previous = runs.at(-1);
			// If the candle is in regular hours: it ends any band.
			if (!key) continue;
			// If the candle continues the band before it: extend that band.
			if (previous && previous.key === key && previous.last === index - 1) previous.last = index;
			else if (highlight) runs.push({ key, first: index, last: index, label: highlight.label ?? "", color: highlight.color ?? "var(--chart-4)", kind: "highlight" });
			else if (session) runs.push({ key, first: index, last: index, label: session.label, color: session.color ?? "var(--muted-foreground)", kind: "session" });
		}
		return runs.map((run) => {
			const x = ctx.x(run.first) - ctx.spacing / 2;
			const width = (run.last - run.first + 1) * ctx.spacing;
			// Only label a band wide enough to hold its label.
			return { ...run, x, width, showLabel: !!run.label && width > ctx.measureText([run.label]) + LABEL_OFFSET * 2 };
		});
	});
</script>

<!-- Shading behind the candles for sessions, such as pre-market, and highlights, such as earnings. -->
<g class="candlestickChartSessions">
	{#each bands as band (`${band.key}-${band.first}`)}
		<g style:--candlestick-chart-series-color={band.color} data-kind={band.kind}>
			<rect class="candlestickChartSession" x={band.x} y={ctx.marginTop} width={band.width} height={ctx.panesHeight} />
			{#if band.showLabel}
				<text class="candlestickChartSessionLabel" x={band.x + LABEL_OFFSET} y={ctx.marginTop + LABEL_OFFSET} dominant-baseline="hanging">{band.label}</text>
			{/if}
		</g>
	{/each}
</g>

<style>
	/* Soft wash, so the shading stays behind the candles */
	.candlestickChartSession {
		fill: color-mix(in oklab, var(--candlestick-chart-series-color) 8%, transparent);
	}

	/* Highlights read a step stronger than sessions */
	[data-kind="highlight"] .candlestickChartSession {
		fill: color-mix(in oklab, var(--candlestick-chart-series-color) 14%, transparent);
	}

	/* Band name; text stays in text colors */
	.candlestickChartSessionLabel {
		fill: var(--muted-foreground);
		font-size: inherit;
	}
</style>
