# Feature: Agent Workflow Studio

## Blueprint

### Context

This feature gives university students a low-friction way to learn how agents and multi-agent workflows work before they need to write code.

The primary users are smart beginners with little or no programming experience. The interface should therefore make agent roles, workflow steps, and handoffs explicit in plain language.

### Architecture

- **Entry points:** `GET /` renders the studio UI from [`src/views/home.ts`](../../src/views/home.ts). `GET /api/health` remains available for smoke tests and tooling.
- **Data models:** The browser stores a workspace in `localStorage` under the key `agent-workflow-studio/v1`. The workspace contains `agents[]` and `workflows[]`. Each workflow stores `agentIds[]` so the association between agents and workflows is explicit.
- **Dependencies:** The page depends on the generated Tailwind stylesheet served from `/styles.css` and on inline client-side JavaScript embedded in the home page. No backend persistence is required for the studio.

### Anti-Patterns

- Do not require a server round-trip for creating or editing agent/workflow definitions while the feature stays in its introductory teaching phase.
- Do not hide the relationship between agents and workflows behind implicit naming rules. The association must stay visible in the UI and in the stored state.
- Do not turn the experience into a code-first editor. Students should be able to learn the concepts through plain-language fields and visible state.
- Do not store secrets, tokens, or any sensitive data in the browser workspace.

## Contract

### Definition of Done

- [ ] Students can create, edit, and delete agent definitions in the browser.
- [ ] Students can create, edit, and delete workflows that reference at least one defined agent.
- [ ] The workspace survives page reloads through `localStorage`.
- [ ] The UI exposes the current workspace state so students can inspect what the app saved.
- [ ] Spec updated in the same change set.
- [ ] Automated tests cover the critical render and persistence behavior.

### Regression Guardrails

- The home page must remain usable without any backend writes or external account setup.
- Workflow definitions must keep agent associations explicit in the stored state.
- The health endpoint contract must remain stable for local verification and smoke tests.

### Verification

- **Automated tests:** [`src/views/home.test.ts`](../../src/views/home.test.ts), [`src/worker.test.ts`](../../src/worker.test.ts), and [`src/worker.e2e.ts`](../../src/worker.e2e.ts)
- **Coverage target:** Critical page rendering, route handling, and a browser flow that proves `localStorage` persistence across reloads

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
- When: The student fills in the workflow form, selects participating agents, and saves
- Then: The workflow appears with explicit agent associations and step-by-step handoffs

**Scenario: Workspace state survives reload**

- Given: The student has already saved agents or workflows
- When: The page reloads
- Then: The saved workspace is restored from `localStorage` and rendered again
