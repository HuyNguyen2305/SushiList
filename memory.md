# Memory

Durable facts for future sessions. Keep entries short; delete what turns out wrong.

## Decisions
- The belt never pauses and the page never scrolls (wide screens): the user wants it always moving and everything in one view.
- Categories are user data (ordered list in `meta` key `categories`); the plate's field is still called `sushiTypeId` and holds a category id. Colour and sushi art come from the category, the dish name from the art.
- Due time is optional and only counts with a due date.

## Conventions
- (none yet)

## Gotchas
- `mix-blend-mode` on a child inside a `transform-style: preserve-3d` tree hides its siblings (the picked plate vanished): use a plain translucent layer instead.
- A keyframe that sets `transform` replaces an element's inline `transform` while it runs; animate the separate `translate` property when the element already has a tilt.
- jsdom has no `matchMedia`: guard it (`window.matchMedia?.(...)`) in any hook the App mounts.
- React bubbles events from a portal to the component tree parent: a <form> in a `Modal` (portal) submits the outer form unless it calls `e.stopPropagation()`.
- Playwright cannot click a plate (the belt moves, so it is never "stable"): focus it and press Enter, as the keyboard tests do.
- Vite's dev server can miss file edits made from scripts on Windows (stale module in the browser): `touch` the file or restart `pnpm dev`.
- Installed skills live in `.agents/` and `.claude/` and are git-ignored on purpose. Reinstall via `npx skills add` / `npx impeccable install` on a fresh clone.
