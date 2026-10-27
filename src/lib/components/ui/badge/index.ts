export { default as Badge } from "./_.svelte";

/** Props shared by the span and link forms */
interface BadgeBaseProps {
	/** Visual style of the badge */
	variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
	/** Padding, text, and icon size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
}

/** Small status label; renders an `<a>` when `href` is set */
export type Props = BadgeBaseProps & ((CompPropsWithChild<"span"> & { href?: undefined }) | (CompPropsWithChild<"a"> & { href: string }));

export type BadgeProps = Props;
