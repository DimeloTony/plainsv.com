export { default as AspectRatio } from "./_.svelte";

/** Box that keeps a width to height ratio as it resizes */
export interface Props extends CompPropsWithChild<"div"> {
	/** Width divided by height, such as `16 / 9`; defaults to `1` */
	ratio?: number;
	/** Corner radius; square when omitted. Clips the content to the corners. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the box */
	class?: CompPropsWithChild<"div">["class"];
}

export type AspectRatioProps = Props;
