# ADR-015: Simulate Agent Packets Locally

**Status:** Accepted

**Date:** 2026-03-31

## Context

The Agent Workflow Studio now teaches more than workflow structure. Students also need to see what an agent run could look like when work enters a slot, changes inside an agent, and gets handed to the next slot.

At this stage the app is still aimed at beginners, runs locally, and stores its workspace only in browser `localStorage`.

Adding live model calls would introduce accounts, secrets, cost, latency, and a false sense that the current workflow editor is already a production orchestration system.

We still need a concrete way to push mock data through the workflow so students can inspect cause and effect, especially across parallel branches.

## Decision

We will add a deterministic in-browser simulation layer for workflow packets instead of calling live models.

The inspect stage will:

- accept a visible seed packet from the student
- derive per-agent mock outputs from the existing workflow time slots and saved agent definitions
- merge parallel branch outputs into a single outgoing packet for the next slot
- keep the simulation clearly labeled as deterministic mock data

The simulation remains ephemeral UI state. It does not change the saved workspace schema in `localStorage`.

## Trigger

This decision was triggered by the need to make workflows feel operational for beginner students without adding real model integrations or backend execution infrastructure.

## Consequences

**Positive:**

- Students can see concrete packet flow instead of only reading step descriptions.
- The feature stays local, cheap, deterministic, and easy to verify in tests.
- The simulation reuses the existing workflow model, which keeps the teaching surface internally consistent.

**Negative:**

- The mock outputs are only teaching aids and can oversimplify what real agent behavior looks like.
- The simulation logic adds UI-side complexity that will need revisiting if the project later introduces real execution.
- Students might overgeneralize from the deterministic mock outputs if the UI does not keep the simulation framing explicit.

**Neutral:**

- The saved workflow schema stays unchanged because simulation state is derived at render time.
- A future real execution layer can coexist with or replace this simulation if the project needs it.

## Alternatives Considered

### Call live models from the browser

This was rejected because it would require credentials, network dependencies, cost management, and a stronger safety model than the current teaching tool needs.

### Add a backend mock-execution service

This was rejected because it would add infrastructure and operational concepts before students have learned the core ideas of agents, packets, and handoffs.

### Keep the studio as a design-only surface

This was rejected because students benefit from seeing packets transform through the workflow instead of only inferring execution from static handoff text.
