export { default as Kbd } from "./_.svelte";
export { default as KbdGroup } from "./group.svelte";

/** Keyboard key or shortcut; renders a `kbd` */
export interface Props extends CompPropsWithChild<"kbd"> {
	/** Height, padding, text, and icon size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius; one step smaller than `size` when omitted, like shadcn, so the key stays square-cornered */
	rounded?: UiRounded;
	/** Classes merged onto the key */
	class?: CompPropsWithChild<"kbd">["class"];
}

/** Row of keys that form one shortcut */
export interface GroupProps extends CompPropsWithChild<"kbd"> {
	/** Classes merged onto the group */
	class?: CompPropsWithChild<"kbd">["class"];
}

export type KbdProps = Props;
export type KbdGroupProps = GroupProps;
