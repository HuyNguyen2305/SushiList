# SushiList

Stack: React 19 + TypeScript, Vite, pnpm, Tailwind v4 (tokens in `src/index.css` `@theme`), Vitest + Testing Library. Static site, no backend. Later phases add Zustand, Dexie, Motion, dnd-kit, vite-plugin-pwa. Source of truth for the look: the "Sushibar UI design" canvas; for scope: the "Sushibar Task Planner: Development Plan" doc.

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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
