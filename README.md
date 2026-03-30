# agentic-workflow-simulator

The app is designed for university students with little or no programming experience, so the interface focuses on plain-language agent definitions, explicit workflow time steps, visible handoffs between agents, and inspectable saved state.

Local development in this repo targets macOS. Other platforms may need script and tooling adjustments before the baseline workflow works as documented.

## Documentation

- Development setup and local CI: `docs/development.md`
- Architecture decisions: `docs/adrs/README.md`
- Feature and architecture specs: `specs/README.md`
- Agent behavior and project rules: `AGENTS.md`

## Runtime

- Install dependencies with `npm install`.
- The exact project Node.js version is pinned in `package.json`, and CI reads that value directly.
- npm now comes from that pinned Node release instead of a separate repo version file.
- Copy `.dev.vars.example` to `.dev.vars` before running projects that need local secrets.
- Use repo-pinned CLI tools through `npx`, including `npx wrangler` for Cloudflare-based experiments.
- Start the stub Worker with `npm run dev`, then open `http://127.0.0.1:8787`.
- Rebuild the generated Tailwind stylesheet manually with `npm run build:css` when needed.

## Verification

- Run the fast local gate with `npm run quality:gate:fast` during normal iteration.
- Run the baseline repo gate with `npm run quality:gate`.
- Run the containerized local workflow with `npm run ci:local:quiet`.
- If local Agent CI warns about `No such remote 'origin'`, set `GITHUB_REPO=owner/repo` in `.env.agent-ci`.
- Retry a paused local CI run with `npm run ci:local:retry -- --name <runner-name>`.
- Install the pinned Playwright browser with `npm run playwright:install`.
- Run unit tests from colocated `src/**/*.test.ts` files with `npm test`.
- Run browser tests from colocated `src/**/*.e2e.ts` files with `npm run e2e`.

## Starter App

- `GET /` serves the Agent Workflow Studio, a browser-based learning surface for defining agents, ordered workflow time steps, and visible handoffs.
- The studio persists its workspace locally in the browser under the `localStorage` key `agent-workflow-studio/v1`.
- `GET /styles.css` serves the generated Tailwind stylesheet.
- `GET /api/health` serves a JSON health response for smoke tests and tooling.

## Source Layout

- `src/worker.ts` is the Worker entry point and top-level router.
- `src/api/` holds API response modules such as the health endpoint.
- `src/views/` holds HTML rendering modules for the starter UI.
- Tests live next to the code they exercise under `src/`.
