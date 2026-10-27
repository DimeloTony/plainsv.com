export { default as Card } from "./_.svelte";
export { default as CardHeader } from "./header.svelte";
export { default as CardTitle } from "./title.svelte";
export { default as CardDescription } from "./description.svelte";
export { default as CardAction } from "./action.svelte";
export { default as CardContent } from "./content.svelte";
export { default as CardFooter } from "./footer.svelte";

/** Props shared by the container and link forms */
interface CardBaseProps {
	/** Padding, gap, and radius on the shared scale; defaults to `lg` */
	size?: UiSize;
	/** Corner radius; follows `size` when omitted. `pill` is a true pill that can clip the content, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Dims the card; a disabled link also drops its href and leaves the tab order */
	disabled?: boolean;
}

/** Card root; renders an `<a>` when `href` is set */
export type Props = CardBaseProps & ((CompPropsWithChild<"div"> & { href?: undefined }) | (CompPropsWithChild<"a"> & { href: string }));

/** Card header that holds the title, description, and action */
export interface HeaderProps extends CompPropsWithChild<"header"> {
	/** Classes merged onto the header */
	class?: CompPropsWithChild<"header">["class"];
}

/** Card heading text */
export interface TitleProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the title */
	class?: CompPropsWithChild<"div">["class"];
}

/** Muted supporting text under the title */
export interface DescriptionProps extends CompPropsWithChild<"p"> {
	/** Classes merged onto the description */
	class?: CompPropsWithChild<"p">["class"];
}

/** Trailing header content, such as an icon, badge, or button */
export interface ActionProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the action */
	class?: CompPropsWithChild<"div">["class"];
}

/** Card body content */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** Card footer for actions or meta text */
export interface FooterProps extends CompPropsWithChild<"footer"> {
	/** Classes merged onto the footer */
	class?: CompPropsWithChild<"footer">["class"];
}

export type CardProps = Props;
export type CardHeaderProps = HeaderProps;
export type CardTitleProps = TitleProps;
export type CardDescriptionProps = DescriptionProps;
export type CardActionProps = ActionProps;
export type CardContentProps = ContentProps;
export type CardFooterProps = FooterProps;
