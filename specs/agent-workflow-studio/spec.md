# Feature: Agent Workflow Studio

## Blueprint

### Context

This feature gives university students a low-friction way to learn how agents and multi-agent workflows work before they need to write code.

The primary users are smart beginners with little or no programming experience. The interface should therefore make agent roles, workflow time slots, and handoffs explicit in plain language.

### Architecture

- **Entry points:** `GET /` renders the studio UI from [`src/views/home.ts`](../../src/views/home.ts). `GET /api/health` remains available for smoke tests and tooling.
- **Data models:** The browser stores a workspace in `localStorage` under the key `agent-workflow-studio/v1`. The workspace contains `agents[]` and `workflows[]`. Each workflow stores `agentIds[]` plus ordered `timeSteps[]`. Each time step names a numeric `time` slot, the acting `agentId`, the work happening at that moment, and the handoff that moves the workflow forward. Multiple time steps can share the same `time` value to represent parallel execution.
- **Visualization model:** The studio keeps the card-based playback view and also exposes an experimental DAG spike that maps each time slot to a graph column, each agent action to a node, and each handoff to an animated edge toward the next slot.
- **Dependencies:** The page depends on the generated Tailwind stylesheet served from `/styles.css` and on inline client-side JavaScript embedded in the home page. The DAG spike uses inline SVG and browser animation primitives rather than a graph library. No backend persistence is required for the studio.

### Anti-Patterns

- Do not require a server round-trip for creating or editing agent/workflow definitions while the feature stays in its introductory teaching phase.
- Do not hide the relationship between agents and workflows behind implicit naming rules. The association must stay visible in the UI and in the stored state.
- Do not collapse time into vague prose. The workflow should keep explicit ordered time slots so students can reason about what happens at T1, T2, and beyond.
- Do not fake parallelism with copy alone. If two agents work at the same moment, the stored data and visualization should show them sharing a time slot.
- Do not turn the experience into a code-first editor. Students should be able to learn the concepts through plain-language fields and visible state.
- Do not introduce a heavy graph dependency for the spike. The experiment should stay lightweight enough to prune or replace once the team decides whether the DAG view is worth keeping.
- Do not store secrets, tokens, or any sensitive data in the browser workspace.

## Contract

### Definition of Done

- [ ] Students can create, edit, and delete agent definitions in the browser.
- [ ] Students can create, edit, and delete workflows that reference at least one defined agent.
- [ ] Students can create ordered time-slot actions that assign work and handoffs to specific agents.
- [ ] The UI visualizes how work passes from one agent to the next across time slots.
- [ ] The app includes an experimental DAG visualization that reuses the same workflow data and can animate the current handoff path.
- [ ] The app ships with example workflows that show both sequential and parallel execution patterns.
- [ ] The workspace survives page reloads through `localStorage`.
- [ ] The UI exposes the current workspace state so students can inspect what the app saved.
- [ ] Spec updated in the same change set.
- [ ] Automated tests cover the critical render and persistence behavior.

### Regression Guardrails

- The home page must remain usable without any backend writes or external account setup.
- Workflow definitions must keep agent associations explicit in the stored state.
- Time-slot order and handoff text must remain explicit in the stored state and visible in the UI.
- Parallel actions must remain grouped by shared time slot in the visualization.
- The DAG spike must stay derived from the same stored workflow data as the editor and playback view.
- The health endpoint contract must remain stable for local verification and smoke tests.

### Verification

- **Automated tests:** [`src/views/home.test.ts`](../../src/views/home.test.ts), [`src/worker.test.ts`](../../src/worker.test.ts), and [`src/worker.e2e.ts`](../../src/worker.e2e.ts)
- **Coverage target:** Critical page rendering, route handling, and a browser flow that proves `localStorage` persistence plus sequential and parallel playback across reloads
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

**Scenario: Workspace state survives reload**

- Given: The student has already saved agents or workflows
- When: The page reloads
- Then: The saved workspace is restored from `localStorage` and rendered again
