# Memory

A themed memory (card-matching) game built as a two-player, browser-based single-page app. Players choose a theme, a starting player and a board size, then take turns flipping cards to find matching pairs.

## Features

- **4 themes**, each with its own visual style and card artwork: Code Vibes, Gaming, DA Projects, Food.
- **3 board sizes**: 16, 24 or 36 cards.
- **2-player local play** with score tracking and turn indication.
- Animated game-over and result screens (winner/draw announcement, falling confetti).

## Tech stack

- [Vite](https://vitejs.dev/)
- TypeScript
- SCSS
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server prints a local URL to open in the browser.

## Scripts

| Command        | Description                                    |
| -------------- | ----------------------------------------------- |
| `pnpm dev`      | Start the Vite dev server with hot reload.       |
| `pnpm build`    | Type-check (`tsc -noEmit`) and build for production into `dist/`. |
| `pnpm preview`  | Preview the production build locally.            |

## Project structure

```
src/
  ts/
    pages/        # one file per route (home, settings, game, gameOver, result, 404, imprint)
    components/    # reusable pieces (footer, the game card field)
    data/          # static data (theme asset lists)
  router.ts        # minimal path -> page-function router
  styles/
    themes/         # one file per theme, exposed as CSS custom properties
    pages/          # per-page SCSS
    components/     # shared component SCSS
public/             # static assets (icons, images, fonts) and the SPA 404 fallback
```

## How theming works

Each theme sets a `data-theme` attribute (`code` | `games` | `projects` | `food`) on the relevant page container, which activates a matching `[data-theme="..."]` block in `src/styles/themes/`. Those blocks only define CSS custom properties (colors, fonts, card shape, ...) - the actual component styles consume the properties, so no component SCSS needs to branch per theme.

## Deployment

The app deploys via FTPS to a `/memory/` subpath on a regular web server (see `.github/workflows/deploy.yml`), not GitHub Pages. Since the SPA has no server-side routes, `public/.htaccess` tells the server to fall back to `public/404.html` for any unknown path, which redirects to `index.html` with the original path preserved so the client-side router can take over.
