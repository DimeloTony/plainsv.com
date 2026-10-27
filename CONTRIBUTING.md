## Project

Thank you for helping build PlainSv, a registry of components, utilities, and plugins for Svelte development

## Setup

- Run `pn install` to install dependencies
- Copy `.env.example` to `.env`, leaving the database and OAuth variables empty unless you work on the auth and database utilities
- Run `pn run dev` to start the site on port `5173`

## Before You Start

- Open an issue at `https://github.com/DimeloTony/plainsv.com/issues` to discuss large changes first
- Read the files you will change and their related components
- Copy an existing component as the pattern for a new one
- Follow `src/lib/components/ui/navigation-menu` for part overrides

## Components

- Place each component in `src/lib/components/ui/<name>`
- Use `_.svelte` as the main component
- Put each part in its own kebab-case file next to `_.svelte`
- Export the component, its parts, and their types from `index.ts`
- Keep shared state in `ctx.svelte.ts`
- Use Svelte 5 runes for state
- Add `variant`, `size`, and `rounded` props when the component supports them
- Pass `class` and the remaining props through to the root element
- Add a `trigger` snippet to every part that opens something

## Styling

- Style with Svelte `<style>` blocks placed after the markup
- Use theme tokens only, never hard-coded colors
- Name CSS classes in camelCase
- Avoid Tailwind CSS in any component

## Dependencies

- Use native elements and APIs instead of UI packages
- Avoid Bits UI, Floating UI, and other component libraries
- Use `@lucide/svelte` for icons and `@tabler/icons-svelte` for brand icons
- Ask before adding any other npm package

## Docs

- Write each docs page as a `.svx` file with `title` and `description` frontmatter
- Add a `demo.svelte` next to each docs page
- Show `variant`, `size`, `rounded`, and custom `trigger` examples when supported
- Update the docs page whenever a component API changes
- Document utilities under `/docs/utilities/<name>`

## Registry

- Add an item to `registry.json` for every new component
- Name items in kebab-case after the component folder
- List every file the item needs
- Reference other items in `itemDependencies`
- Run `pn run registry` after changing `registry.json` or any file it lists
- Leave `static/r` untouched, since `pn run registry` rebuilds it

## Bug Fixes

- Show the behavior before your fix in the pull request
- Show the behavior after your fix in the pull request
- Use a screenshot or recording for visual bugs
- Use the command output or error message for other bugs
- List the steps that reproduce the bug

## Before You Submit

- Run `pn exec prettier --write "<file>"` on every changed file
- Run `pn run check` and fix type errors
- Leave unrelated code unformatted and unchanged
- Describe what changed and why in the pull request

## AI Assistance

- Feel free to use AI tools such as Claude Code to write contributions
- Point AI tools at `CLAUDE.md` so they follow the project rules
- Review every line an AI tool writes before you submit it
- Run the same checks on AI-written code as on your own
- Take responsibility for the pull request, whoever wrote the code
- Avoid submitting AI output you cannot explain

## License

- Agree that your contributions fall under the license in `LICENSE.md`
