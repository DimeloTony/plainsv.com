import type { PageRangeItem } from "./index.js";

/** Returns the page numbers to show around the current page, with `ellipsis` for the gaps; the first and last pages are always shown. */
export function getPageRange(currentPage: number, pageCount: number, siblingCount = 1): PageRangeItem[] {
	const range = (start: number, end: number) => Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);
	// First, last, current, two siblings per side, and two gaps.
	const slotCount = siblingCount * 2 + 5;
	// If every page fits: show them all.
	if (pageCount <= slotCount) return range(1, pageCount);
	const firstSibling = Math.max(currentPage - siblingCount, 1);
	const lastSibling = Math.min(currentPage + siblingCount, pageCount);
	const hasStartGap = firstSibling > 2;
	const hasEndGap = lastSibling < pageCount - 1;
	// Pages beside the first or last page when only one gap is shown.
	const edgeCount = siblingCount * 2 + 3;
	// If the current page is near the start: show the first pages, then a gap.
	if (!hasStartGap) return [...range(1, edgeCount), "ellipsis", pageCount];
	// If the current page is near the end: show a gap, then the last pages.
	if (!hasEndGap) return [1, "ellipsis", ...range(pageCount - edgeCount + 1, pageCount)];
	return [1, "ellipsis", ...range(firstSibling, lastSibling), "ellipsis", pageCount];
}
