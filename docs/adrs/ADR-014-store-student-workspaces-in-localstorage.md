# ADR-014: Store Student Workspaces in localStorage

**Status:** Accepted

**Date:** 2026-03-30

## Context

The project is shifting from a generic starter surface toward a learning tool for university students who are new to programming.

For the first usable version, students need to be able to define agents and attach those agents to workflows without setting up accounts, databases, or server-side state.

The app should stay easy to run locally, easy to understand, and easy to prune or evolve later if the project introduces real backend persistence.

## Decision

We will store the student workspace entirely in browser `localStorage` for now.

The studio stores:

- agent definitions with a name, responsibility, input, and output
- workflow definitions with a name, outcome, ordered steps, and explicit `agentIds`
- the full workspace under the key `agent-workflow-studio/v1`

The Worker continues to serve the HTML shell, stylesheet, and health endpoint, but it does not persist student-authored workspace data.

## Trigger

This decision was triggered by the requirement that students should be able to define their agents and associated workflows immediately, and that using `localStorage` is sufficient for the current phase.

## Consequences

**Positive:**

- Students can experiment with agents and workflows immediately, without accounts or backend setup.
- The app stays lightweight and easy to inspect because the whole state model is visible in the browser.
- Local development remains simple because the Worker serves only the app shell and health endpoint.

**Negative:**

- Workspaces are tied to one browser on one device unless students copy the exported JSON elsewhere.
- There is no collaboration, sync, or durable multi-device storage yet.
- Browser storage can be cleared by the user, so the app is not suitable for long-term persistence.

**Neutral:**

- The UI still needs to model agent-workflow relationships explicitly even though the persistence layer is local.
- Moving to backend persistence later will require a migration path or a deliberate reset of the saved workspace format.

## Alternatives Considered

### Add server-side persistence now

This was rejected because it would add setup and conceptual overhead before students have learned the underlying ideas of agents and workflows.

### Keep the page as a static demo with no saved state

This was rejected because students need to create and revise their own definitions, not just read an example.

### Store workflows only and infer agents from free-text steps

This was rejected because the project needs students to understand that agents are explicit roles in a system, not names hidden inside prose.
