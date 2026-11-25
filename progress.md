# Progress

Plan: "Sushibar Task Planner: Development Plan" (Claude Docs). Look: "Sushibar UI design" canvas.

## Done
- Skills installed, CLAUDE.md / memory.md / progress.md / .gitignore set up
- Phase 0 (setup and look): Vite + React 19 + TS + Tailwind v4 + Vitest, static bar mock (belt, plates, stack, order form) at phone and desktop widths. `pnpm test`, `build`, `lint` pass.

- Phase 1 (tasks that survive a reload): Dexie schema, Zustand store, add/edit/delete (two-click delete) with title, note, due date, sushi type. Unit tests + Playwright close-and-reopen test pass.

- Phase 2 (the conveyor): looping belt (CSS transform only), (pause removed later: it never stops), drag-to-reorder (dnd-kit, saved), sort by due date, due tags, overdue red rim, tap plate highlights its row. Tests: unit + 3 Playwright.

- Phase 3 (eat and stack): Eat button, 300 ms pop + 600 ms arc flight onto the stack (Motion), stack piles (10 per pile, saved tilt), Today's plates list, 5 s Undo toast for eat and delete, midnight rollover into History. Unit tests + 5 Playwright tests.

- Phase 4 (safe and installable): persistent-storage request (banner if refused), JSON export/import with validation and Merge/Replace, 7-day backup reminder, PWA (manifest, icons, offline via service worker), self-hosted fonts, reduced-motion pass, keyboard (arrows, Enter, E, Z, Space-to-reorder) and screen-reader labels. Unit tests (15) + 14 Playwright tests incl. offline and an axe scan.

- UI fidelity pass (branch `ui-fidelity`, uncommitted): rebuilt the look from the latest "Sushibar UI design" canvas (version 1795581723-8e7c). Wide screens (1280px+) get the full izakaya scene (noren, sign, lanterns, chef with speech bubble, menu strips, shelf, wood counter with tea and chopsticks); phones and tablets get the navy header with scallops, oval plates, picked-plate card and a pinned order bar. Sushi pieces use the repo's `public/sushi/*.svg`. New default sushi type rotates per new plate; added Ikura.

- To-do features pass (branch `ui-fidelity`, uncommitted): user-editable categories (name, colour, sushi art; stored as one ordered `meta` row; deleting moves plates to the first category), optional due time (HH:mm, shown on plates, picked card and list; sorts and overdue use it), note editor in a pop-up (`<dialog>`) from the form and the picked card. Backup schema is now version 2 (adds categories, dueTime; version 1 files still import). Belt never pauses; page is one screen tall (no page scroll on wide screens). 18 unit + 15 Playwright tests pass.

- Counter pass: per-task due time removed; a small digital timer (minutes ±5, start/pause/reset, beep, shown in the tab title, saved in localStorage) sits on the counter. The izakaya wall scales with screen height (`--k` in `index.css`) so the counter gets the room; full-width beam; bamboo placemat under the order cards; table setting (tea, tokkuri, sake cups, soy dish, chopsticks) drawn as one SVG in `Scene.tsx`. The picked plate is set down on the counter (`TablePlate`, big plate with its sushi and label; an empty place setting when nothing is picked).

- Depth pass: all plate placement marks removed (belt slots, empty stack ring, empty place setting); the counter has a thick front edge over a plain wooden panel (`CounterBase`; stools and a seated figure were tried and removed); soft layered shadows replace hard offsets; belt slowed to one plate per 5 s and a plate can be picked from its row in the task list (steady target).

- History and Backup moved onto the table as two small objects (ledger, lacquer box) that open as pop-ups (`TableItems`); the right panel is now only the task list and disappears when there are none. Short screens: wall scale `--k` and table-plate scale `--pk` shrink so the counter fits; below ~800px tall the counter can still scroll inside itself.

- Everything is on the table: no side panel; the pile of eaten plates (`PlateStack`) stands beside the invoice and eaten plates land on it. The belt slat pattern lives on the moving track so an empty belt visibly runs. The task list and stack tab are one paper invoice (`Invoice`): open orders as line items with a dish icon each, and the foot is the total ("N plates eaten today" + Receipt pop-up listing today's plates; the tab's small plate is where an eaten plate lands) sit in the counter's right column. The old plate pile and the "Your stack · tab" card are gone.

- Wall: the yellow storage bar is now a permanent hazard-style CAUTION sign pinned on the right wall (`WallSign` in `Notices.tsx`, with an Export backup button, no dismiss); phones and tablets keep a small dismissible strip. A night-view shoji window hangs on the left wall; the noren, info board, left lantern and bottle shelf moved right/under it to make room.

- Polish + CSS 3D pass: one light and shadow scale (`--shadow-*`), layered table (plate in front of the table setting), wall vignette and chef shadow, chef blinks, a 済 seal stamps the invoice when you eat. 3D (all CSS, no library): belt slats on a plane in perspective (loop stays seamless; the far end matches the belt colour so it spans edge to edge), plates with visible thickness, counter planks in perspective (`.table-plane`), wall layers that drift with the pointer (`Depth`, `.depth-1..4`), the picked plate tilts toward the pointer with the sushi standing 18px off it, and the plate stack is real plates that settle when one lands. Mobile baseline added (tap highlight, touch-action, 16px inputs on touch, viewport-fit=cover, overscroll containment in pop-ups).

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
