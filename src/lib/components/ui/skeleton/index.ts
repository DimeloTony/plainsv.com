export { default as Skeleton } from "./_.svelte";

/** Pulsing placeholder shown while content loads; size it with `style` or a class */
export interface Props extends CompProps<"div"> {
	/** Corner radius; `md` when omitted */
	rounded?: UiRounded;
	/** Classes merged onto the skeleton */
	class?: CompProps<"div">["class"];
}

export type SkeletonProps = Props;
