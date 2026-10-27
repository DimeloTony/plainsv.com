import type { ButtonProps } from "#lib/components/ui/button/index.js";
import type { PopoverTriggerAttrs } from "#lib/components/ui/popover/index.js";

export { default as Combobox } from "./_.svelte";
export { default as ComboboxTrigger } from "./trigger.svelte";
export { default as ComboboxValue } from "./value.svelte";
export { default as ComboboxContent } from "./content.svelte";
export { default as ComboboxItem } from "./item.svelte";
export { CommandInput as ComboboxInput, CommandList as ComboboxList, CommandEmpty as ComboboxEmpty, CommandGroup as ComboboxGroup, CommandSeparator as ComboboxSeparator } from "#lib/components/ui/command/index.js";
export type { CommandInputProps as ComboboxInputProps, CommandListProps as ComboboxListProps, CommandEmptyProps as ComboboxEmptyProps, CommandGroupProps as ComboboxGroupProps, CommandSeparatorProps as ComboboxSeparatorProps } from "#lib/components/ui/command/index.js";

/** Combobox settings shared with every part */
interface ComboboxOptions {
	/** Value of the selected item; supports `bind:value` */
	value?: string;
	/** Starting value when `value` is not set */
	defaultValue?: string;
	/** Called with the new value when an item is selected */
	onValueChange?: (value: string) => void;
	/** Whether the popover is shown; supports `bind:open` */
	open?: boolean;
	/** Called when the popover opens or closes */
	onOpenChange?: (open: boolean) => void;
	/** Dims the trigger and blocks opening */
	disabled?: boolean;
	/** Form field name; the value submits through a hidden input */
	name?: string;
	/** Trigger height, input height, and item size on the shared scale; defaults to `md` */
	size?: UiSize;
	/** Corner radius of the trigger, popover, and items; follows `size` when omitted. `pill` makes the panels pills too, which can clip their items, so use `3xl` or `4xl` for round panels */
	rounded?: UiRounded;
}

/** Combobox props; renders no element of its own */
export type Props = CompPropsWithChildSimple<ComboboxOptions>;

/** Props a custom trigger spreads onto the element that opens the popover */
export interface TriggerAttrs extends PopoverTriggerAttrs {
	/** Whether the combobox is disabled */
	disabled: boolean;
}

/** Outline button that opens the popover and holds the `ComboboxValue`; renders a button with a chevron unless `trigger` is given */
export interface TriggerProps extends Omit<CompProps<"button">, "children"> {
	/** Content of the default trigger button, such as a `ComboboxValue` */
	children?: Snippet;
	/** Custom trigger; spread `props` onto the element that opens the popover */
	trigger?: Snippet<[{ props: TriggerAttrs }]>;
	/** Style of the default trigger button; defaults to `outline` */
	variant?: ButtonProps["variant"];
	/** Size of the default trigger button; overrides the combobox's `size` */
	size?: UiSize;
	/** Corner radius of the default trigger button; overrides the combobox's `rounded` */
	rounded?: UiRounded;
	/** Classes merged onto the default trigger */
	class?: CompProps<"button">["class"];
}

/** Text of the selected item, or the placeholder when nothing is selected */
export interface ValueProps extends CompProps<"span"> {
	/** Text shown when no item is selected */
	placeholder?: string;
	/** Text for the selected value; needed for a starting value before the list has opened once */
	label?: string;
	/** Classes merged onto the value */
	class?: CompProps<"span">["class"];
}

/** Popover with a search input and list, as wide as the trigger */
export interface ContentProps extends CompPropsWithChild<"div"> {
	/** Item size of this popover; overrides the combobox's `size` */
	size?: UiSize;
	/** Corner radius of this popover, with items one step smaller; overrides the combobox's `rounded`. `pill` makes it a pill too, which can clip its items, so use `3xl` or `4xl` to stay round */
	rounded?: UiRounded;
	/** Classes merged onto the popover */
	class?: CompPropsWithChild<"div">["class"];
}

/** Selectable option with a check mark while selected */
export interface ItemProps extends CompPropsWithChild<"div"> {
	/** Value set on the combobox when this item is chosen */
	value: string;
	/** Text shown in `ComboboxValue`; defaults to the item's text */
	label?: string;
	/** Extra words that also match the item, such as synonyms */
	keywords?: string[];
	/** Blocks selecting the item; the arrow keys skip it */
	disabled?: boolean;
	/** Corner radius of this item with this exact value; overrides the list's item radius */
	rounded?: UiRounded;
	/** Classes merged onto the item */
	class?: CompPropsWithChild<"div">["class"];
}

export type ComboboxProps = Props;
export type ComboboxTriggerProps = TriggerProps;
export type ComboboxTriggerAttrs = TriggerAttrs;
export type ComboboxValueProps = ValueProps;
export type ComboboxContentProps = ContentProps;
export type ComboboxItemProps = ItemProps;
