# Changelog

All notable changes to Font Awesome Gallery are documented here.

---

## [1.0.0] - 2026-06-14

This is the first major release of Font Awesome Gallery and the largest update since the extension was first published in 2021. The codebase has been fully rewritten with modern tooling, and a long list of community-requested features has been implemented.

### Font Awesome

- Added Font Awesome v7 free support
- Updated Font Awesome v6 data to v6.7.2 (was v6.1.2)
- Added a deprecation notice banner when Font Awesome v5 is selected, as FA v5 is no longer maintained

### Icon Browsing and Filtering

- Added a Favorites system: click the heart on any icon to save it; favorites persist across sessions
- Added a Recent Icons tracker: the last 20 icons you interacted with are stored automatically
- Added Favorites and Recents as filter options in the category selector
- Added a New Icons filter: shows icons that were added in recent Font Awesome releases, using the `added_in` field from FA metadata
- Added a "NEW" badge on icons added in recent FA versions, visible in both grid and list view
- Added icon size controls: A- and A+ buttons in the toolbar let you resize the gallery icons without affecting what gets copied
- Replaced the "Load more" pagination button with automatic infinite scroll using an IntersectionObserver

### Copy and Insert

- Added HTML tag copy format: `<i class="fa-solid fa-heart"></i>`
- Added React JSX copy format: `<FontAwesomeIcon icon={faHeart} />`
- Added Vue array copy format: `['fas', 'heart']`
- Added SVG inline copy format: full `<svg>` markup using the path data bundled in FA v6/v7 metadata, usable without any FA dependency
- Added a context menu on each icon (right-click or long-press) exposing all copy formats at once
- Added Insert at Cursor: sends the icon code directly to the active editor at the current cursor position, replacing any selection; configurable as the primary click action
- All copy and insert preferences now persist across sessions

### Navigation and UX

- Added keyboard navigation: use the arrow keys to move focus between icons and Enter to activate the primary action
- Improved the hover tooltip to show the icon name, class code, unicode value, and all available styles
- Added an "Open on fontawesome.com" link in the tooltip, opening the icon page in the browser via `vscode.env.openExternal`
- Added a "What's New" modal that appears the first time the extension is opened after an update, then never again
- All settings (FA version, grid type, label type, click behavior, copy format, icon size) now persist across VS Code sessions using `globalState`; previously they were lost on restart

### Build System and Architecture

- Replaced the Rollup and Webpack build pipeline with esbuild via a single `build.js` script
- Migrated Svelte components from Svelte 3 to Svelte 5 using the Runes API (`$state`, `$derived`, `$effect`, `$props`)
- Removed the `basscss` CSS dependency in favor of custom CSS
- Removed the `svelte-clipboard` dependency in favor of the native Clipboard API
- Updated `@types/vscode` to `^1.95.0`
- Updated TypeScript target to ES2020 in both tsconfigs
- Updated VS Code engine requirement to `^1.85.0`
- Added `esbuild-svelte` for Svelte compilation as part of the unified build pipeline

---

## [0.0.7] - 2022-03-24

- Added support for Font Awesome 6.1.0.
- Solved error with sidebar menu appearing on all sidebars.

## [0.0.6] - 2022-02-21

- Added support for Font Awesome 6.
- Added a new sidebar menu (three dots on top-right corner of the sidebar panel) to switch FA versions and other settings.
- Improved overall UI responsiveness when resizing the sidebar.
- Updated Font Awesome 5 icons list.
- Improved the search indexes for Font Awesome 5.

## [0.0.5] - 2021-07-20

- Added unicode code-point labels.
- Added a command palette settings menu.

## [0.0.4] - 2021-04-06

- Minor fixes.

## [0.0.3] - 2021-04-06

- Added List view mode.
- Improved responsiveness when updating sidebar size.
- Improved color contrast.

## [0.0.2] - 2021-03-23

- Updated README.md.

## [0.0.1] - 2021-03-22

- First release on the VS Code Marketplace.
