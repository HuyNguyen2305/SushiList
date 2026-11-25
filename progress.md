# Progress

Plan: "Sushibar Task Planner: Development Plan" (Claude Docs). Look: "Sushibar UI design" canvas.

## Done
- Skills installed, CLAUDE.md / memory.md / progress.md / .gitignore set up
- Phase 0 (setup and look): Vite + React 19 + TS + Tailwind v4 + Vitest, static bar mock (belt, plates, stack, order form) at phone and desktop widths. `pnpm test`, `build`, `lint` pass.

- Phase 1 (tasks that survive a reload): Dexie schema, Zustand store, add/edit/delete (two-click delete) with title, note, due date, sushi type. Unit tests + Playwright close-and-reopen test pass.

- Phase 2 (the conveyor): looping belt (CSS transform only), pauses on hover/focus/touch/selection/drag plus a Pause button, drag-to-reorder (dnd-kit, saved), sort by due date, due tags, overdue red rim, tap plate highlights its row. Tests: unit + 3 Playwright.

## In progress
- Awaiting approval of Phase 2 (on branch `phase-2`, uncommitted)

## Next
- Phase 3: eat animation, stack piles, undo, day rollover, history
- Phase 4: persist request, JSON backup, PWA, reduced motion, a11y

## Open
- Hosting (Render / GitHub Pages / Cloudflare Pages) and git remote: not chosen, no deploy-on-push yet
- Phone belt: plan doc says vertical feed, canvas draws horizontal. Built horizontal.
- PRODUCT.md missing (`/impeccable init` not run)
- Belt second row for more than ~12 plates is not built (single looping row); drag works on the real copy only. Revisit if 20+ plates feels crowded.
- Keyboard: dnd-kit uses Space/Enter to start a drag on a plate, so selecting a plate by keyboard waits for the Phase 4 keyboard pass.
