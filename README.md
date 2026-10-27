## Project

PlainSv is a registry of components, utilities, and plugins for Svelte development, built with native Svelte and web technologies and as few external packages as possible

## Links

- Visit the site and docs at `https://plainsv.com`
- Find the source code at `https://github.com/DimeloTony/plainsv.com`

## Usage

- Run `npx remote0 add https://plainsv.com/r/init.json` to create a starter SvelteKit app with the PlainSv theme
- Run `npx remote0 add https://plainsv.com/r/init-existing.json` to add the PlainSv styles to an existing SvelteKit project
- Run `npx remote0 add https://plainsv.com/r/button.json` to add a component, such as `Button`
- Read `https://plainsv.com/docs` for every init item and the full item list

## Features

- Build accessible, customizable components with Svelte 5 runes
- Style with scoped `<style>` tags and the shadcn CSS design system, without Tailwind CSS
- Customize each component with `variant`, `size`, `rounded`, and `class`
- Swap component parts with snippets such as a custom `trigger`
- Control state with bindable props and callbacks
- Install items from JSON files built by the `remote0` CLI from `registry.json`

## Requirements

- Install pnpm
- Install Node.js
- Copy `.env.example` to `.env`
- Leave the database and OAuth variables empty to run the site, since only the auth and database utilities read them

## Getting Started

- Run `pn install` to install dependencies
- Run `pn run dev` to start the site on port `5173`
- Run `pn run check` to type check the project
- Run `pn run build` to rebuild the registry and build the site
- Run `pn run preview` to preview the build on port `5173`

## Registry

- Add each item to `registry.json`
- Run `pn run registry` to rebuild `static/r`
- Install an item from the site by its JSON file under `/r`

## Structure

- Find components in `src/lib/components/ui/<name>`
- Find docs pages as `.svx` files with a `demo.svelte` next to them
- Find style files in `src/styles`
- Find built registry files in `static/r`

## Contributing

- Read `CONTRIBUTING.md` before opening a pull request

## License

- Read `LICENSE.md` for the license terms
