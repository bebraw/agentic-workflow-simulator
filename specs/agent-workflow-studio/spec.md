# Feature: Agent Workflow Studio

## Blueprint

### Context

This feature gives university students a low-friction way to learn how agents and multi-agent workflows work before they need to write code.

The primary users are smart beginners with little or no programming experience. The interface should therefore make agent roles, workflow time slots, and handoffs explicit in plain language.

### Architecture

- **Entry points:** `GET /` renders the studio UI from [`src/views/home.ts`](../../src/views/home.ts). `GET /api/health` remains available for smoke tests and tooling.
- **Data models:** The browser stores a workspace in `localStorage` under the key `agent-workflow-studio/v1`. The workspace contains `agents[]` and `workflows[]`. Each workflow stores `agentIds[]` plus ordered `timeSteps[]`. Each time step names a numeric `time` slot, the acting `agentId`, the work happening at that moment, and the handoff that moves the workflow forward. Multiple time steps can share the same `time` value to represent parallel execution.
- **Interaction model:** The studio stays on a single route but is split into staged views: `Explore`, `Define Agents`, `Build Workflow`, and `Inspect Flow`. Each stage reveals one part of the learning path while reusing the same in-browser workspace state, and wider viewports should prefer side-by-side panels over tall stacked sections so the graph, forms, and saved examples fit the screen better.
- **Navigation model:** The current stage should be reflected in the `?stage=` query parameter so students can refresh or share a direct link to `Explore`, `Define Agents`, `Build Workflow`, or `Inspect Flow` without introducing separate routes.
- **Progressive disclosure:** Every stage should keep its primary controls and outputs visible by default. Secondary teaching copy should usually live in contextual help toggles, but the short comparison prompts in the `Explore` stage learning guide may stay visible in-card when that makes the worked examples easier to scan side by side.
- **Visualization model:** The studio keeps the card-based playback view and also exposes an experimental DAG spike that maps each time slot to a graph column, each agent action to a node, and each handoff to an animated edge toward the next slot. The inspect stage also includes a deterministic local simulation layer that pushes a mock packet through the same time-slot graph so students can compare incoming packets, per-agent transforms, and merged outgoing packets without calling a real model.
- **Dependencies:** The page depends on the generated Tailwind stylesheet served from `/styles.css` and on inline client-side JavaScript embedded in the home page. The DAG spike uses inline SVG and browser animation primitives rather than a graph library. No backend persistence is required for the studio.

### Anti-Patterns

- Do not require a server round-trip for creating or editing agent/workflow definitions while the feature stays in its introductory teaching phase.
- Do not hide the relationship between agents and workflows behind implicit naming rules. The association must stay visible in the UI and in the stored state.
- Do not collapse time into vague prose. The workflow should keep explicit ordered time slots so students can reason about what happens at T1, T2, and beyond.
- Do not fake parallelism with copy alone. If two agents work at the same moment, the stored data and visualization should show them sharing a time slot.
- Do not turn the experience into a code-first editor. Students should be able to learn the concepts through plain-language fields and visible state.
- Do not force beginners to parse every concept at once. The surface should progressively reveal the learning path instead of collapsing all stages into one crowded workspace.
- Do not introduce a heavy graph dependency for the spike. The experiment should stay lightweight enough to prune or replace once the team decides whether the DAG view is worth keeping.
- Do not present the simulation as a live model call. The mock execution must stay clearly labeled as deterministic teaching data.
- Do not store secrets, tokens, or any sensitive data in the browser workspace.

## Contract

### Definition of Done

- [ ] Students can create, edit, and delete agent definitions in the browser.
- [ ] Students can create, edit, and delete workflows that reference at least one defined agent.
- [ ] The studio separates exploration, definition, workflow building, and flow inspection into clearly labeled stages without leaving the single-page route.
- [ ] Students can create ordered time-slot actions that assign work and handoffs to specific agents.
- [ ] The UI visualizes how work passes from one agent to the next across time slots.
- [ ] The app includes an experimental DAG visualization that reuses the same workflow data and can animate the current handoff path.
- [ ] The inspect stage includes a deterministic mock execution view that shows a seed packet, per-agent transformed packets, and the merged outgoing packet for the current slot.
- [ ] The app ships with example workflows that show both sequential and parallel execution patterns.
- [ ] The workspace survives page reloads through `localStorage`.
- [ ] The UI exposes the current workspace state so students can inspect what the app saved.
- [ ] Spec updated in the same change set.
- [ ] Automated tests cover the critical render and persistence behavior.

### Regression Guardrails

- The home page must remain usable without any backend writes or external account setup.
- Stage navigation must not create a second source of truth for workspace state.
- Stage navigation must stay synchronized with the `?stage=` query parameter without turning the four learning stages into separate pages.
- Wider layouts must keep primary learning controls and their corresponding content visible in the same horizontal workspace rather than pushing key panels far below the fold. In the inspect stage, the graph, playback, and simulation should share that width instead of collapsing into a narrow stacked sidebar.
- The current-stage summary and stage navigation should live together at the bottom of the header shell, and that summary block should keep a stable height across stage changes and common viewport sizes so the header does not jump when a longer stage title or description becomes active.
- The header summary cards for `Agents`, `Workflows`, and `Agent actions` should share the same wider card row as the onboarding cues when that reduces hero height without squeezing the text.
- Workspace-wide actions such as loading the example data or clearing saved state should live with the workspace status area rather than competing visually with stage navigation.
- Destructive delete actions for saved agents, workflows, and draft time-slot actions should require confirmation before data is removed from the browser workspace.
- Secondary help text should stay available in every stage, but it should not crowd the primary task surface when the student is already working through examples, defining agents, building a workflow, or inspecting flow. In the `Explore` stage, the short "What students should notice" prompts may remain visible without an extra click when the layout has room for them.
- The inspect stage should stay focused on student-facing workflow outputs rather than generic app route inventory.
- Workflow definitions must keep agent associations explicit in the stored state.
- Time-slot order and handoff text must remain explicit in the stored state and visible in the UI.
- The action editor in `Build Workflow` must guide students to select workflow agents before enabling action details, instead of showing a compressed or overlapping empty state.
- The action editor in `Build Workflow` should prefer a taller two-row arrangement over a compressed single-row layout when that keeps labels, selectors, and textareas readable.
- Parallel actions must remain grouped by shared time slot in the visualization.
- The DAG spike must stay derived from the same stored workflow data as the editor and playback view.
- The mock execution layer must remain local, deterministic, and derived from the saved workflow definition rather than adding hidden backend or model dependencies.
- The health endpoint contract must remain stable for local verification and smoke tests.

### Verification

- **Automated tests:** [`src/views/home.test.ts`](../../src/views/home.test.ts), [`src/worker.test.ts`](../../src/worker.test.ts), and [`src/worker.e2e.ts`](../../src/worker.e2e.ts)
- **Coverage target:** Critical page rendering, route handling, and browser flows that prove `localStorage` persistence, grouped parallel playback, and the experimental DAG interaction

### Scenarios

**Scenario: First visit shows an example workspace**

- Given: A student opens the app with no existing saved state
- When: The home page loads
- Then: The student sees example agents, an example workflow, and guidance for defining their own setup

**Scenario: Student defines a new agent**

- Given: The studio is open in the browser
- When: The student fills in the agent form and saves it
- Then: The new agent appears in the workspace and is written to `localStorage`

**Scenario: Student moves through staged views**

- Given: The studio is open in the browser
- When: The student changes from `Explore` to `Define Agents`, `Build Workflow`, or `Inspect Flow`
- Then: The app shows only the controls relevant to that stage while keeping the same saved workspace state underneath

**Scenario: Student reloads or shares a stage-specific link**

- Given: The current URL includes `?stage=build-workflow` or another valid stage id
- When: The page loads or reloads
- Then: The matching stage opens immediately and the app keeps that stage id synchronized in the query parameter as the student switches views

**Scenario: Student creates a workflow associated with agents**

- Given: The studio has at least one saved agent
- When: The student fills in the workflow form, selects participating agents, adds ordered time-slot actions, and saves
- Then: The workflow appears with explicit agent associations and step-by-step handoffs

**Scenario: Student inspects a workflow over time**

- Given: The studio has a saved workflow with multiple time slots
- When: The student uses the playback controls
- Then: The UI shows which agent is active at the selected time step, what work is happening, and where the handoff goes next

**Scenario: Student studies a parallel workflow example**

- Given: The app loads its bundled example workspace
- When: The student opens an example workflow with shared time slots
- Then: The UI shows multiple agents acting at the same time and makes the parallel handoffs explicit

**Scenario: Student explores the experimental graph spike**

- Given: The studio has a workflow with at least two time slots
- When: The student opens the DAG spike and clicks a node or plays the animation
- Then: The active time slot stays synchronized with playback and the graph shows animated packet flow toward the next dependency

**Scenario: Student pushes a mock packet through the workflow**

- Given: The studio has a workflow with at least one time slot
- When: The student enters a seed packet in the inspect stage
- Then: The app shows the incoming packet for the active slot, the mocked per-agent transforms, and the packet that leaves for the next slot or final outcome

**Scenario: Workspace state survives reload**

- Given: The student has already saved agents or workflows
- When: The page reloads
- Then: The saved workspace is restored from `localStorage` and rendered again
