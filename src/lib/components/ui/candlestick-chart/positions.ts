import type { Candle, TradePosition } from "./index.js";

// Share of the entry a draft risks by default, and how many times that risk its target aims for.
const DRAFT_RISK_SHARE = 0.005;
const DRAFT_REWARD_TO_RISK = 2;

/** Options for a draft position */
export interface DraftPositionOptions {
	/** Unique id of the new position */
	id: string;
	/** `long` profits when the price rises, and `short` when it falls */
	side: TradePosition["side"];
	/** Price distance from the entry to the stop; the target sits twice as far on the other side; defaults to 0.5% of the entry */
	risk?: number;
	/** Smallest price move, which the prices snap to; defaults to `0.01` */
	priceStep?: number;
	/** Name on the entry line, such as "Bot #2" */
	label?: string;
}

/** Rounds a price to whole price steps, without floating point leftovers such as 182.40000000000003. */
export function snapPrice(price: number, step: number) {
	const safeStep = step > 0 ? step : 0.01;
	const text = String(safeStep);
	const decimals = text.includes("e-") ? Number(text.split("e-")[1]) : (text.split(".")[1] ?? "").length;
	return Number((Math.round(price / safeStep) * safeStep).toFixed(decimals));
}

/** Starts a draft position at the latest close, with a stop one risk away and a target two risks away, ready to adjust and confirm on the chart; null without candles. */
export function getDraftPosition(data: Candle[], options: DraftPositionOptions): TradePosition | null {
	const latest = data.at(-1);
	// If there are no candles: there is no price to start from.
	if (!latest) return null;
	const step = options.priceStep ?? 0.01;
	const entry = snapPrice(latest.close, step);
	// Keep the risk at least one step, so the stop never lands on the entry.
	const risk = Math.max(step, options.risk ?? entry * DRAFT_RISK_SHARE);
	const direction = options.side === "long" ? 1 : -1;
	return {
		id: options.id,
		side: options.side,
		stage: "draft",
		time: latest.time,
		entry,
		target: snapPrice(entry + direction * risk * DRAFT_REWARD_TO_RISK, step),
		stop: Math.max(step, snapPrice(entry - direction * risk, step)),
		label: options.label,
	};
}
