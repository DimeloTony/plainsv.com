## Project

ProjectName uses PlainSv. PlainSv is a registry of components, utilities, and plugins for Svelte development, built with native Svelte and web technologies and as few external packages as possible. Components are accessible and customizable, use Svelte 5 runes for state management, and are styled with Svelte's scoped `<style>` tags and the shadcn CSS design system.

The app is a SvelteKit 3 project set up with the PlainSv `init` item, which installs the theme, global types, app context, root layout, server functions, and Vite plugins. Components are copied into the project with the `remote0` CLI from `https://plainsv.com/r/<item>.json`, so their source lives in `src/lib/components/ui` and can be changed like any other code.

## Folders

- Put installed PlainSv components in `src/lib/components/ui/<name>`, one folder per item
- Put app components used across pages in `src/lib/components/shared`, and export them from its `index.ts`
- Put app-wide contexts in `src/lib/context`, one `<name>.svelte.ts` file per context, such as `app.svelte.ts`
- Put static content, config, and shared types in `src/lib/data`, such as `appData` in `app.ts`
- Put server-only code in `src/lib/server`, since SvelteKit blocks client imports from it
- Put server functions in `src/lib/functions`, with schemas in `schemas.ts` and handlers in `handlers`
- Keep the PlainSv Vite plugins in `src/lib/server/plugins`
- Keep the tokens, resets, utilities, and typeset styles in `src/styles`
- Put app pages in `src/routes/(app)`
- Put Markdown pages in `src/routes/(typeset)`, which wraps them in `.typeset .typeset-docs .maxWidth`
- Put API endpoints in `src/routes/api`
- Put images, icons, and other static files in `static`

## Key Files

- Find global types and `App.Locals` in `src/app.d.ts`
- Find the dark mode cookie check in `src/hooks.server.ts`, which adds the `dark` class to `<body>`
- Find the app name, title, and description in `appData` in `src/lib/data/app.ts`
- Find the app context in `src/lib/context/app.svelte.ts`
- Find `PageMeta` and `Logo` in `src/lib/components/shared`
- Find the root layout in `src/routes/+layout.svelte`, which imports `app.css`, sets the app context, and renders the `Toaster`
- Find the layout data in `src/routes/+layout.server.ts`, which loads `isDarkMode`, `isMobile`, and `userData`
- Find the home page in `src/routes/(app)/+page.svelte`
- Find the server functions endpoint in `src/routes/api/functions/+server.ts`
- Find the web app manifest in `static/manifest.json`, and keep its name and description in sync with `appData`
- Find the favicon, app icons, and Open Graph image in `static/images`
- Find `devPlugin`, `svxPlugin`, and the forced runes mode in `vite.config.ts`

## Protected Files

- Leave `src/app.d.ts` untouched unless asked
- Ask before changing any file in `src/styles`
- Leave every file in `src/lib/server/plugins` untouched unless asked
- Leave `src/env.ts` untouched, since `devPlugin` generates it from `.env`
- Leave `src/lib/components/ui` untouched unless asked, since reinstalling an item overwrites it
- Ask before reinstalling an item whose files have local changes

## Before Changes

- Read the files you will change and their related components first
- Copy an existing component as the pattern for a new one
- Match existing spacing, naming, ordering, and code flow
- Leave unrelated code unformatted and unchanged

## Global Types

- Use every global type from `src/app.d.ts` without importing it
- Use `Snippet<T>`, `Component`, and `ComponentProps<T>` instead of imports from `svelte`
- Use `CompAttrs<"tag">` for an element's attributes without events or `children`
- Use `CompEvents<"tag">` for an element's `on*` event handlers
- Extend `CompProps<"tag">` when props spread onto an HTML element
- Extend `CompPropsWithChild<"tag">` when the component also requires `children`
- Use `CompPropsWithChildSimple<Extra>` when required `children` wrap no single element
- Use `UiSize` for `size`: `xs`, `sm`, `md`, or `lg`
- Use `UiRounded` for `rounded`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, or `pill`
- Use `App.Locals` for `locals.isDarkMode` and `locals.userData` in server code
- Use the typed `process.env`, which includes the private and public env variables and `NODE_ENV`

## Components

- Check `https://plainsv.com/docs/components` for a PlainSv component before building new UI
- Read `https://plainsv.com/docs/components/<name>.md` for a component's props and parts before using it
- Install a component with `npx remote0 add https://plainsv.com/r/<name>.json`
- Import components from their folder, such as `import { Button } from "#lib/components/ui/button/index.js";`
- Set the look with `variant`, `size`, and `rounded` instead of custom CSS
- Override the parent's `variant`, `size`, or `rounded` on a part when needed, such as `<NavigationMenuLink size="sm">`
- Pass one-off overrides with the `style` attribute, such as `<Button style="margin-top: 1rem">`
- Pass a camelCase `class` only when many components share the override
- Pass a `trigger` snippet and spread its `props` onto your own trigger element
- Use `bind:open` and `bind:value`, or callbacks such as `onOpenChange` and `onValueChange`, to control state
- Never add Tailwind CSS, Bits UI, Floating UI, or other component libraries

## App Context

- Read the app context with `const app = useAppCtx();` from `#lib/context/app.svelte.js`
- Read `app.isDarkMode`, `app.isMobile`, `app.userData`, and `app.currentPathname` from the context
- Toggle the theme with `app.toggleDarkMode()`, which saves the `theme` cookie
- Show toasts with `toast.success()` or `toast.error()` from `#lib/components/ui/toaster/index.js`

## Pages

- Add `<PageMeta title="..." description="..." />` from `#lib/components/shared/index.js` to every `.svelte` page
- Start every `.svx` page with `title` and `description` frontmatter, which `svxPlugin` turns into `PageMeta`
- Keep `.svx` pages inside `src/routes`, since `svxPlugin` only compiles them there
- Label fenced code blocks with a language and a file title, such as `svelte title="+page.svelte"`, so they render as `CodeBlock`
- Write install and run commands in a `pm` fence in npm form, such as `npx remote0 add …`, so they render as `PackageCommand`
- Start a line with an imported component tag, such as `<Button>`, to render it in a `.svx` page
- Add the `not-typeset` class to custom blocks inside typeset pages
- Wrap page content in `.maxWidth` or `.maxWidthSm` to center it at `--max-width`

## Server Functions

- Define each function in `functionsSchemas` in `src/lib/functions/schemas.ts` with Zod `in` and `out` schemas
- Set `isPublic: false` on functions that need a signed-in `locals.userData`
- Export a handler with the same name, typed as `FuncHandler<"name">`, from a file in `src/lib/functions/handlers`
- Return `{ error: false, data }` on success and `{ error: true, data: "message" }` on failure
- Call functions from the client with `useFunc("name", input)` from `#lib/functions/index.js`
- Check `response.error` before reading `response.data`
- Pass `FormData` as the input to upload files
- Return a `text/event-stream` `Response` to stream, and read `response.data` as an async generator
- Import `schemas.ts` in client code for types only, so Zod stays on the server

## Environment

- Set `DOMAIN_URL` in `.env` for development and `.env.production` for production
- Add new variables to `.env`
- Prefix variables with `PUBLIC_` when the client needs them
- Read variables from `$app/env/private` or `$app/env/public`
- Keep secrets out of `.env.production` commits

## Styling

- Style with Svelte `<style>` blocks placed after the markup
- Use theme tokens such as `var(--muted)`, `var(--border)`, `--spacing-*`, `--radius-*`, and `--text-*`, never hard-coded colors
- Use the `--spacing-*`, `--text-*`, `--line-height-*`, and `--radius-*` steps in components, never the bare `--spacing`, `--text`, or `--radius` bases
- Mix tints with `color-mix(in oklab, var(--foreground) 6%, transparent)` instead of `opacity`, always `in oklab`
- Style buttons fully in the component, since `src/styles/app.css` resets them with `all: unset`
- Rely on the `.dark` tokens for dark mode instead of dark-mode rules
- Give `--font-sans` and `--font-mono` a fallback, such as `var(--font-sans, ui-sans-serif, system-ui, sans-serif)`
- Name CSS classes in camelCase, such as `mainNav`, never kebab-case or BEM
- Order style sections as base, Variants, States, Sizes, Rounded, so states win over variants and Rounded overrides the size radius
- Prefix component CSS variables with the component name, such as `--accordion-text`
- Prefer `display: flex` over `grid` and `gap` over margins
- Use `rem` for sizes and `px` only for borders, hairlines, and shadow offsets
- Add `scroll-fade-y` or `scroll-fade-x` statically to scroll containers, never toggled with JavaScript
- Use the `shimmer` class for loading text
- Use `ScrollArea` when a themed, draggable scrollbar is needed

## Markup

- Use semantic elements over extra `div` wrappers
- Add ARIA roles, labels, and states to every interactive part
- Support keyboard navigation and visible focus on every interactive part
- Use event attributes such as `onclick`, never `on:click`
- Divide major markup sections with short HTML comments

## State

- Use `$state` for local state, and declare it with `let` when it is reassigned
- Use `$derived` for computed values and `$effect` only for side effects
- Use `$bindable` only for two-way binding, and use callback props otherwise
- Move shared state into a class-based `ctx.svelte.ts` with `setContext` and `getContext`
- Order `ctx.svelte.ts` as imports, `CONTEXT_ID`, the `UseCompCtx` class, then `CompCtxProps`, `setCompCtx`, and `useCompCtx`
- Initialize context fields with `if (this[key] !== undefined) this[key] = data;`
- Never use `Object.assign`, `Object.hasOwn`, or `hasOwnProperty` in the context constructor
- Give every context field a defined default, since the constructor skips fields set to `undefined`
- Read and write through `ctx.field`, never destructure the context
- Sync a bindable prop with its context field using two `$effect.pre` calls, prop to context first

## Scripts

- Write scripts as `<script lang="ts">` with Svelte 5 runes
- Order scripts as imports, variables, derived values, functions, then local types
- Declare props with `$props()`, never `export let`
- Type `$props()` with a `Props` interface at the bottom of the script
- Add a one-line JSDoc to every interface and field
- Let TypeScript infer variable and return types
- Type function parameters explicitly
- Avoid `any` and type assertions that hide errors
- Import with the `#lib` alias and the `.js` extension, never `$lib`
- Import files in the same folder with `./`
- Add `"#lib": "./src/lib/index.js"` and `"#lib/*": "./src/lib/*"` to `imports` in `package.json` if missing
- Import Lucide icons on one line with the `Icon` suffix, such as `import { HomeIcon } from "@lucide/svelte";`
- Import Tabler brand icons on one line with the `IconBrand` prefix, such as `import { IconBrandX } from "@tabler/icons-svelte";`
- Pass `{ query: "?raw", import: "default" }` to `import.meta.glob` when only the file paths are needed, since its default lazy imports keep page and component CSS out of the page head and flash unstyled content in production builds
- Name variables and functions in camelCase
- Add a one-line JSDoc to every function
- Comment branches as `// If [condition]: [result].`
- Comment validation checks, early returns, errors, and major steps inside functions with short `//` comments
- Explain intent and constraints in comments instead of restating the code
- Update comments when behavior changes
