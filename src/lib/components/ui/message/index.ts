import type { AvatarProps as AvatarRootProps } from "#lib/components/ui/avatar/index.js";
import type { ButtonProps } from "#lib/components/ui/button/index.js";

export { default as Message } from "./_.svelte";
export { default as MessageAvatar } from "./avatar.svelte";
export { default as MessageContent } from "./content.svelte";
export { default as MessageActions } from "./actions.svelte";
export { default as MessageAction } from "./action.svelte";
export { AvatarImage as MessageAvatarImage, AvatarFallback as MessageAvatarFallback } from "#lib/components/ui/avatar/index.js";
export type { AvatarImageProps as MessageAvatarImageProps, AvatarFallbackProps as MessageAvatarFallbackProps } from "#lib/components/ui/avatar/index.js";

/** Bubble styles shared by the message and its content */
type MessageVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";

/** Chat message with an avatar, content, and actions, aligned by who sent it */
export interface Props extends CompPropsWithChild<"article"> {
	/** Who sent the message; `user` messages sit on the right; defaults to `assistant` */
	from?: "user" | "assistant";
	/** Style of the content bubble; defaults to `secondary` for `user` and `ghost`, plain text, for `assistant` */
	variant?: MessageVariant;
	/** Text, padding, and gap on the shared scale, and the avatar and action size one step below; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the content bubble; defaults to `pill`, a pill on one line that keeps round corners on long messages without clipping */
	rounded?: UiRounded;
	/** Classes merged onto the message */
	class?: CompPropsWithChild<"article">["class"];
}

/** Avatar beside the content; takes every `Avatar` prop */
export type AvatarProps = AvatarRootProps;

/** Text of the message, shown in a bubble unless the variant is `ghost` */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Style of this bubble; overrides the message's `variant` */
	variant?: MessageVariant;
	/** Text and padding of this bubble; overrides the message's `size` */
	size?: UiSize;
	/** Corner radius of this bubble; overrides the message's `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the content */
	class?: CompPropsWithChild<"div">["class"];
}

/** Row of actions under the content, such as copy and regenerate */
export interface ActionsProps extends CompPropsWithChild<"div"> {
	/** Classes merged onto the actions */
	class?: CompPropsWithChild<"div">["class"];
}

/** Ghost button for one action; give icon-only actions an `aria-label`. `size` defaults to one step below the message */
export type ActionProps = Partial<Omit<Extract<ButtonProps, { href?: undefined }>, "href">>;

export type MessageProps = Props;
export type MessageAvatarProps = AvatarProps;
export type MessageContentProps = ContentProps;
export type MessageActionsProps = ActionsProps;
export type MessageActionProps = ActionProps;
