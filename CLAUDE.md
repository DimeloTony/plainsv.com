## Project

PlainSv is a registry of components, utilities, and plugins for Svelte development, built with native Svelte and web technologies and as few external packages as possible. Components are accessible and customizable, use Svelte 5 runes for state management, and are styled with Svelte's scoped `<style>` tags and the shadcn CSS design system.

Every component should be as customizable as shadcn-svelte without Tailwind CSS: users change its look with `variant`, `size`, `rounded`, and `class`, swap its parts with snippets such as a custom `trigger`, and control its state with bindable props and callbacks. The site is built with SvelteKit 3, and items ship as JSON files built by the `remote0` CLI from `registry.json`.

## Structure

- Place each component in its own folder under `src/lib/components/ui/<name>`
- Use `_.svelte` as the main component
- Put each part in its own kebab-case file next to `_.svelte`, such as `item.svelte`
- Export the component, its parts, and their types from `index.ts`
- Keep shared component state in `ctx.svelte.ts`
- Write docs pages as `.svx` files with a `demo.svelte` next to them

## Before Changes

- Read the files you will change and their related components first
- Copy an existing component as the pattern for a new one
- Match existing spacing, naming, ordering, and code flow
- Leave unrelated code unformatted and unchanged

## Protected Files

- Leave `src/app.d.ts` untouched unless asked
- Ask before changing any file in `src/styles`
- Leave every file in `src/lib/server/plugins` untouched unless asked
- Leave `static/r` untouched, since `pn run registry` rebuilds it
- Leave `src/env.ts` untouched, since `devPlugin` generates it from `.env`
- Leave `.env` and `.env.production` untouched unless asked

## Global Types

- Use every global type from `src/app.d.ts` without importing it
- Use `Snippet<T>` for snippet props, never `import type { Snippet } from "svelte"`
- Use `Component` and `ComponentProps<T>` for component types, never imports from `svelte`
- Use `CompAttrs<"tag">` for an element's attributes without events or `children`
- Use `CompEvents<"tag">` for an element's `on*` event handlers
- Extend `CompProps<"tag">` when props spread onto an HTML element
- Extend `CompPropsWithChild<"tag">` when the component also requires `children`
- Use `CompPropsWithChildSimple<Extra>` when required `children` wrap no single element
- Use `UiSize` for `size`: `xs`, `sm`, `md`, or `lg`
- Use `UiRounded` for `rounded`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, or `pill`
- Use `App.Locals` for `locals.isDarkMode` and `locals.userData` in server code
- Use the typed `process.env`, which includes the private and public env variables and `NODE_ENV`

## Dependencies

- Use native elements and APIs, such as `<dialog>`, the Popover API, and `{@attach}`, instead of UI packages
- Never add Tailwind CSS, Bits UI, Floating UI, or other component libraries
- Use `@lucide/svelte` for icons and `@tabler/icons-svelte` for brand icons
- Ask before adding any other npm package to a component

## Customization

- Add `variant` when the component has or needs more than one look
- Name variants with shadcn names when possible: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`
- Add `size?: UiSize` to every component whose padding, gap, text, or dimensions can scale
- Add `rounded?: UiRounded` to every component that has a box to round
- Leave out `size` when the user sizes the element, such as `Skeleton`
- Leave out `rounded` when nothing can be rounded, such as `Label` and `Spinner`
- Pass `class` through and merge it onto the root element
- Spread the remaining props onto the root element
- Add a `trigger` snippet that receives `{ props }` to every part that opens something
- Render a default `Button` trigger when no `trigger` snippet is given
- Forward `variant`, `size`, `rounded`, and `class` to the default trigger button
- Accept snippets for swappable parts, such as `icon`, `indicator`, and `trailing`
- Make open, value, and checked state `$bindable`, such as `bind:open`
- Pair each bindable prop with a callback, such as `onOpenChange`, `onValueChange`, and `onCheckedChange`
- Add `orientation`, `side`, `align`, and `disabled` when the component supports them
- Render a link instead of a button when `href` is given

## Part Overrides

- Let every part accept its own `variant`, `size`, and `rounded` that override the root when possible, such as `<NavigationMenuLink size="sm" rounded="lg">`
- Let parts override other inherited props, such as `align` and `disabled`, when possible
- Read the inherited variant in a part with `variant ?? ctx.variant`
- Pass the root size and radius to parts through prefixed variables, such as `--navigation-menu-inner-radius`
- Render a part's own `data-size` and `data-rounded` only when the part sets them
- Set exact values in the part's size and rounded rules so they win over the inherited variables
- Scope an override to that part only, never to its siblings
- Mention the override in each override prop's JSDoc, such as "overrides the menu's `size`"
- Follow `src/lib/components/ui/navigation-menu` as the reference pattern

## Sizes and Radius

- Render props as `data-variant`, `data-size`, and `data-rounded` on the root element
- Make the radius follow `size` through `--radius-<size>` when `rounded` is omitted
- Pick the default `size` from the matching shadcn component, such as `lg` for `Card` and `md` for `Button`
- Set a default `rounded` when the default size radius differs from shadcn, such as `pill` for `Avatar`
- Add one rounded rule per value, `xs` through `4xl` in scale order, then `pill`
- Make `pill` a true pill with `--radius-pill` on every component, even boxes that it clips
- Make `pill` half the one-line height for parts that wrap but should be a pill on one line, such as `MessageContent` and `Tooltip`
- Keep nested parts as pills inside a `pill` container
- Round nested parts, such as menu items, one radius step below their container
- Document any special radius rule in the `rounded` JSDoc

## Props and Types

- Define the `Props` interface in `index.ts` and export it as `<Name>Props`
- Import it in `_.svelte` with `import type { Props } from "./index.js";`
- Declare props with `$props()`, never `export let`
- Skip `/** @property */` comments above `$props()`
- Let TypeScript infer variable and return types
- Type function parameters explicitly
- Add a one-line JSDoc to every interface and field
- Avoid `any` and type assertions that hide errors

## State

- Use `$state` for local state, `$derived` for computed values, and `$effect` only for side effects
- Use `$bindable` only when a prop is meant for two-way binding
- Move shared state into a class-based `ctx.svelte.ts` with `setContext` and `getContext`
- Order `ctx.svelte.ts` as imports, `CONTEXT_ID`, the `UseCompCtx` class, then `CompCtxProps`, `setCompCtx`, and `useCompCtx`
- Initialize context fields with `if (this[key] !== undefined) this[key] = data;`
- Never use `Object.assign`, `Object.hasOwn`, or `hasOwnProperty` in the context constructor
- Give every context field a defined default, since the constructor skips fields set to `undefined`
- Name context classes by scope, such as `UseCompCtx`, `UseAppCtx`, and `UsePageCtx`
- Create the context once in `_.svelte` and read it in parts with `useCompCtx()`
- Read and write through `ctx.field`, never destructure the context
- Sync a bindable prop with its context field using two `$effect.pre` calls, prop to context first

## Styling

- Style with Svelte `<style>` blocks placed after the markup
- Use theme tokens only: colors such as `var(--muted)` and `var(--ring)`, `--radius-*`, `--control-height-*`, `--spacing-*`, `--text-*`, and `--line-height-*`, never hard-coded colors
- Use the `--spacing-*`, `--text-*`, `--line-height-*`, and `--radius-*` steps in components, never the bare `--spacing`, `--text`, or `--radius` bases
- Mix tints with `color-mix(in oklab, var(--ring) 50%, transparent)` instead of `opacity` or new tokens, always `in oklab`
- Rely on the `.dark` tokens in `src/styles/theme.css` instead of dark-mode rules in components
- Style buttons fully in the component, since `src/styles/app.css` resets them with `all: unset`
- Give `--font-sans` and `--font-mono` a fallback, such as `var(--font-mono, ui-monospace, monospace)`
- Name CSS classes in camelCase, such as `mainNav`, never kebab-case or BEM
- Order style sections as base, Variants, States, Sizes, Rounded, so focus and invalid styles win over variants and Rounded overrides the size radius
- Set size and radius values directly in each size and rounded rule
- Define a component variable only to pass a value to a part in another file or to feed rules the size and rounded rules cannot target, such as `--sheet-radius`
- Prefix component variables with the component name, such as `--accordion-text`
- Avoid generic or token-like variable names, such as `--header-height` or `--popover-padding`
- Resolve every component variable to a token, a `calc()` of tokens, or a `rem` value with a px comment
- Set runtime variables with `style:--name`, such as `--tooltip-arrow-offset`
- Use `calc()` only when a value depends on tokens, such as `calc(var(--spacing-xs) / 2)`
- Prefer `display: flex` over `grid` and `gap` over margins
- Use `rem` for sizes and `px` only for borders, hairlines, and shadow offsets

## Style Files

- Rely on the resets, `--font-sans`, `--font-mono`, `.maxWidth`, `.maxWidthSm`, and the global scrollbar in `src/styles/app.css`
- Add `scroll-fade-y`, `scroll-fade-x`, or a single edge such as `scroll-fade-b` statically to scroll containers
- Never toggle `scroll-fade` classes with JavaScript, since the fades only show while the element scrolls
- Tune fades with `--scroll-fade-size` and `--scroll-fade-reveal`
- Remove fades with `scroll-fade-none`
- Use `.shimmer` from `src/styles/utils.css` for loading text, with `shimmer-once` or `shimmer-none` as modifiers
- Use `ScrollArea` when a themed, draggable scrollbar is needed
- Wrap rendered Markdown in `.typeset` with a preset such as `.typeset-docs` or `.typeset-chat`
- Add the `not-typeset` class to every component root so typeset styles skip it

## Markup

- Use semantic elements over extra `div` wrappers
- Add ARIA roles, labels, and states to every interactive part
- Support keyboard navigation and visible focus on every interactive part
- Use event attributes such as `onclick`, never `on:click`
- Divide major markup sections with short HTML comments

## Scripts

- Write scripts as `<script lang="ts">`
- Order scripts as imports, variables, derived values, functions, then local types
- Import with the `#lib` alias and the `.js` extension, never `$lib`
- Import files in the same folder with `./`
- Name variables and functions in camelCase
- Import Lucide icons on one line with the `Icon` suffix, such as `import { HomeIcon } from "@lucide/svelte";`
- Import Tabler brand icons on one line with the `IconBrand` prefix, such as `import { IconBrandX } from "@tabler/icons-svelte";`
- Pass `{ query: "?raw", import: "default" }` to `import.meta.glob` when only the file paths are needed, since its default lazy imports keep page and component CSS out of the page head and flash unstyled content in production builds
- Add a one-line JSDoc to every function
- Comment branches as `// If [condition]: [result].`
- Comment validation checks, early returns, errors, and major steps inside functions with short `//` comments
- Explain intent and constraints in comments instead of restating the code
- Update comments when behavior changes

## Registry

- Add an item to `registry.json` for every new component
- Name items in kebab-case after the component folder, such as `dropdown-menu`
- Match each item `description` to its docs page frontmatter `description`
- List every file the item needs, including shared helpers such as `src/lib/components/ui/code-block/core.ts`
- Reference other items in `itemDependencies`, such as `"/r/button.json"`
- Update an item's `files` when you add, rename, or remove its source files
- Add npm packages an item imports to `dependencies` or `devDependencies`, except `svelte`, `@sveltejs/kit`, and `vite`
- Omit `target` so files install to their project path
- Set `target` only when several items install different files to one path, such as `auth-google-sqlite` installing `src/lib/server/auth/providers/google.ts` as `src/lib/server/auth/provider.ts`
- Ship the style files in the `init` item, never as items or `itemDependencies`
- Keep plugins and utilities out of component docs pages, and document them under `/docs/utilities/<name>`

## Docs

- Start every `.svx` page with `title` and `description` frontmatter
- Write docs with headings, paragraphs, inline code, and fenced code blocks only
- Import only `./demo.svelte` in a `.svx` page's `<script lang="ts">` block
- Serve every `.svx` docs page as Markdown through a `.md` route, such as `src/routes/(app)/docs/utilities/[utility].md`
- Label code blocks with a language and a file title, such as `svelte title="+page.svelte"`
- Write install and run commands in a `pm` fence in npm form, such as `npx remote0 add …`, so they render as `PackageCommand`
- Show `variant`, `size`, `rounded`, and custom `trigger` examples on every docs page that supports them
- Update the docs page whenever a component API changes

## Commands

- Run `pn exec prettier --write "<file>"` on every changed file
- Run `pn run check` and fix type errors after changes
- Run `pn run registry` after changing `registry.json` or any file it lists
- Run `pn run dev` to start the site on port `5173`
- Run `pn run deploy` to build and deploy with `src/lib/server/deploy/index.ts`, `pn run deploy setup` to recreate the certificate and nginx site, `pn run deploy rollback` to restore the previous release, and `pn run deploy remove` to delete the app from the server

## Updating CLAUDE.md

- Suggest `CLAUDE.md` and `PROJECT.CLAUDE.md` changes to the user and wait for a yes before editing either file
- Update `CLAUDE.md` when the user asks for something that breaks one of its rules
- Update `CLAUDE.md` when the project structure changes
- Keep `PROJECT.CLAUDE.md` aligned with `CLAUDE.md`, since it is the starter `CLAUDE.md` for projects that use PlainSv
