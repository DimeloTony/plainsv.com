export { default as Avatar } from "./_.svelte";
export { default as AvatarImage } from "./image.svelte";
export { default as AvatarFallback } from "./fallback.svelte";

/** Avatar root that holds the image and its fallback */
export interface Props extends CompPropsWithChild<"span"> {
	/** Visual style of the background and border */
	variant?: "default" | "secondary" | "outline";
	/** Size on the shared scale; defaults to `sm`, a 32 pixel avatar like shadcn */
	size?: UiSize;
	/** Corner radius; defaults to `pill`, a circle like shadcn */
	rounded?: UiRounded;
	/** Classes merged onto the avatar */
	class?: CompPropsWithChild<"span">["class"];
}

/** User image; stays hidden until it loads */
export interface ImageProps extends CompProps<"img"> {
	/** Classes merged onto the image */
	class?: CompProps<"img">["class"];
}

/** Content shown while the image loads or after it fails, such as initials or an icon */
export interface FallbackProps extends CompPropsWithChild<"span"> {
	/** Classes merged onto the fallback */
	class?: CompPropsWithChild<"span">["class"];
}

export type AvatarProps = Props;
export type AvatarImageProps = ImageProps;
export type AvatarFallbackProps = FallbackProps;
