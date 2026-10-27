export { default as Tabs } from "./_.svelte";
export { default as TabsList } from "./list.svelte";
export { default as TabsTrigger } from "./trigger.svelte";
export { default as TabsContent } from "./content.svelte";

/** Tabs root that holds the active tab and shares the style with its parts */
export interface Props extends CompPropsWithChild<"div"> {
	/** Value of the active tab; supports `bind:value` */
	value?: string;
	/** Starting tab when `value` is not set */
	defaultValue?: string;
	/** Called with the new value when a tab opens */
	onValueChange?: (value: string) => void;
	/** Direction of the list; `vertical` places it beside the content */
	orientation?: "horizontal" | "vertical";
	/** `automatic` opens a tab when the arrow keys focus it; `manual` waits for Enter or Space */
	activationMode?: "automatic" | "manual";
	/** Visual style of the list and triggers */
	variant?: "default" | "outline" | "ghost" | "line";
	/** Trigger size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the list, with triggers one step smaller; defaults to `lg`, like shadcn */
	rounded?: UiRounded;
	/** Classes merged onto the tabs */
	class?: CompPropsWithChild<"div">["class"];
}

/** Row or column that holds the triggers */
export interface ListProps extends CompPropsWithChild<"div"> {
	/** Style of the list and its triggers; overrides the tabs' `variant` */
	variant?: Props["variant"];
	/** Height, padding, and text of the list and its triggers; overrides the tabs' `size` */
	size?: UiSize;
	/** Corner radius of the list, with triggers one step smaller; overrides the tabs' `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the list */
	class?: CompPropsWithChild<"div">["class"];
}

/** Props a custom trigger spreads onto the element that opens its tab */
export interface TriggerAttrs {
	/** Announces the element as a tab; the list's arrow keys move between tabs */
	role: "tab";
	/** Id that names the panel */
	id: string;
	/** Whether the tab is active */
	"aria-selected": boolean;
	/** Id of the panel */
	"aria-controls": string;
	/** `0` for the tab in the tab order, `-1` for the rest */
	tabindex: 0 | -1;
	/** `active` or `inactive`, for styling */
	"data-state": "active" | "inactive";
	/** Direction of the list, for styling */
	"data-orientation": "horizontal" | "vertical";
	/** Opens the tab */
	onclick: () => void;
}

/** Button that opens the tab with the same `value`; renders a button unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Value that links the trigger to its `TabsContent` */
	value: string;
	/** Label for the default trigger button */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the tab */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger; overrides the list's `variant` */
	variant?: Props["variant"];
	/** Height, padding, and text of the default trigger; overrides the list's `size` */
	size?: UiSize;
	/** Corner radius of the default trigger with this exact value; overrides the inherited radius */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger */
	class?: CompProps<"button">["class"];
}

/** Panel shown while its tab is active */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Value that links the panel to its `TabsTrigger` */
	value: string;
	/** Classes merged onto the panel */
	class?: CompPropsWithChild<"div">["class"];
}

export type TabsProps = Props;
export type TabsListProps = ListProps;
export type TabsTriggerProps = TriggerProps;
export type TabsTriggerAttrs = TriggerAttrs;
export type TabsContentProps = ContentProps;
