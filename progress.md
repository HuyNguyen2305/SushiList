# Progress

Plan: "Sushibar Task Planner: Development Plan" (Claude Docs). Look: "Sushibar UI design" canvas.

## Done
- Skills installed, CLAUDE.md / memory.md / progress.md / .gitignore set up
- Phase 0 (setup and look): Vite + React 19 + TS + Tailwind v4 + Vitest, static bar mock (belt, plates, stack, order form) at phone and desktop widths. `pnpm test`, `build`, `lint` pass.

- Phase 1 (tasks that survive a reload): Dexie schema, Zustand store, add/edit/delete (two-click delete) with title, note, due date, sushi type. Unit tests + Playwright close-and-reopen test pass.

- Phase 2 (the conveyor): looping belt (CSS transform only), pauses on hover/focus/touch/selection/drag plus a Pause button, drag-to-reorder (dnd-kit, saved), sort by due date, due tags, overdue red rim, tap plate highlights its row. Tests: unit + 3 Playwright.

- Phase 3 (eat and stack): Eat button, 300 ms pop + 600 ms arc flight onto the stack (Motion), stack piles (10 per pile, saved tilt), Today's plates list, 5 s Undo toast for eat and delete, midnight rollover into History. Unit tests + 5 Playwright tests.

- Phase 4 (safe and installable): persistent-storage request (banner if refused), JSON export/import with validation and Merge/Replace, 7-day backup reminder, PWA (manifest, icons, offline via service worker), self-hosted fonts, reduced-motion pass, keyboard (arrows, Enter, E, Z, Space-to-reorder) and screen-reader labels. Unit tests (15) + 14 Playwright tests incl. offline and an axe scan.

- UI fidelity pass (branch `ui-fidelity`, uncommitted): rebuilt the look from the latest "Sushibar UI design" canvas (version 1795581723-8e7c). Wide screens (1280px+) get the full izakaya scene (noren, sign, lanterns, chef with speech bubble, menu strips, shelf, wood counter with tea and chopsticks); phones and tablets get the navy header with scallops, oval plates, picked-plate card and a pinned order bar. Sushi pieces use the repo's `public/sushi/*.svg`. New default sushi type rotates per new plate; added Ikura.

## In progress
- Awaiting approval of Phase 4 (on branch `phase-4`, uncommitted). MVP feature-complete.

## Next
- Review the MVP, then pick from the plan's "later" list: sync/accounts, shared bars, streaks and stats, sounds and themes, recurring tasks, sub-tasks

## Open
- Hosting (Render / GitHub Pages / Cloudflare Pages) and git remote: not chosen, no deploy-on-push yet
- Phone belt: plan doc says vertical feed, canvas draws horizontal. Built horizontal.
- PRODUCT.md missing (`/impeccable init` not run)
- Belt second row for more than ~12 plates is not built (single looping row); drag works on the real copy only. Revisit if 20+ plates feels crowded.
- Keyboard: dnd-kit uses Space/Enter to start a drag on a plate, so selecting a plate by keyboard waits for the Phase 4 keyboard pass.
- Not built from the Phase 3 spec: swipe-up to eat, undo playing the eat in reverse, phone stack as a tap-to-expand corner pile. Day rollover is derived (stack = done plates whose dayKey is today), so there is no stored `lastOpenedDay`.
- PWA install uses the browser's own prompt (no custom Install button). Not tested on a real phone or in Safari. The persistent-storage request is browser-decided; headless Chromium refuses it, so the banner shows there.
