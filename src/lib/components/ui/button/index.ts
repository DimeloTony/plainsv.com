export { default as Button } from "./_.svelte";

/** Props shared by the button and link forms */
interface ButtonBaseProps {
	/** Corner radius; follows `size` when omitted */
	rounded?: UiRounded;
	/** Visual style of the button; `bare` drops the background, border, and padding, and its icon fills an `icon-*` size */
	variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link" | "bare";
	/** Size on the shared scale, or a square `icon-*` size for icon-only buttons */
	size?: UiSize | `icon-${UiSize}`;
}

/** Button props; renders an `<a>` when `href` is set */
export type Props = ButtonBaseProps & ((CompPropsWithChild<"button"> & { href?: undefined }) | (CompPropsWithChild<"a"> & { href: string; disabled?: boolean }));

export type ButtonProps = Props;
