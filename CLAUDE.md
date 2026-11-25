# SushiList

Stack: TBD. Update this line when the stack is chosen.

## Session routine
1. Read `memory.md` (decisions, conventions, gotchas) and `progress.md` (done / in progress / next).
2. Do the work.
3. Before finishing, update `progress.md`. Add anything durable to `memory.md`.

## Skills: use them, don't skip them
Invoke the matching skill with the Skill tool BEFORE writing the code it covers.

| When you are... | Use |
|---|---|
| Designing, redesigning, critiquing, polishing any UI | `impeccable` (run `/impeccable init` once for design context) |
| Building or restyling a page, landing page, marketing site | `design-taste-frontend`, then `ui-ux-pro-max` |
| Choosing palette, fonts, styles, UX rules, design tokens | `ui-ux-pro-max`, `design-system`, `ui-styling` |
| Writing React / Next.js | `vercel-react-best-practices`, `vercel-composition-patterns` |
| Reviewing UI or accessibility | `web-design-guidelines` |
| Adding or changing motion | `animate`, `choreograph`, `animation-performance` |
| Drag, swipe, sheets | `gestures` |
| Reviewing motion, or finding what to animate or remove | `review-animations`, `find-animation-opportunities`, `remove-animations` |
| Polishing component interactions | `emil-design-eng`, `apple-design` |
| Mobile web feel | `mobile-native` |
| Toasts | `ask-sonner` |
| Stress-testing a component with worst-case data | `break-ui` |
| Picking a UI library | `pick-ui-library` |
| Fake product UI, demo illustrations | `stageshow` |
| Page view transitions | `vercel-react-view-transitions` |
| Deploying | `deploy-to-vercel` (use `vercel-cli-with-tokens` for token auth) |
| Questions about codebase structure | `graphify` (build the graph once real code exists) |
| Any coding task | `ponytail`: smallest complete change |

If two skills disagree, `impeccable` wins on design and `ponytail` wins on code size.

## Rules
- Never commit `.claude/`, `.agents/`, `.codex/`, `skills-lock.json` (all git-ignored).
- Keep `memory.md` and `progress.md` current. They are tracked.
