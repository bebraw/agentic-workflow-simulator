import { escapeHtml } from "./shared";

type RouteSummary = {
  path: string;
  purpose: string;
};

type AgentRecord = {
  id: string;
  name: string;
  responsibility: string;
  inputs: string;
  outputs: string;
};

type TimeStepRecord = {
  id: string;
  agentId: string;
  work: string;
  handoff: string;
};

type WorkflowRecord = {
  id: string;
  name: string;
  outcome: string;
  agentIds: string[];
  timeSteps: TimeStepRecord[];
};

type WorkspaceState = {
  agents: AgentRecord[];
  workflows: WorkflowRecord[];
};

const appTitle = "Agent Workflow Studio";
const appDescription =
  "A browser-based learning tool where students define simple AI agents, connect them into workflows, and inspect the result without writing code first.";
const storageKey = "agent-workflow-studio/v1";

const starterState: WorkspaceState = {
  agents: [
    {
      id: "agent-planner",
      name: "Planner",
      responsibility: "Turns a broad goal into a short sequence of doable tasks.",
      inputs: "A student goal, project brief, or question.",
      outputs: "A checklist or ordered plan that other agents can follow.",
    },
    {
      id: "agent-researcher",
      name: "Researcher",
      responsibility: "Collects background facts, examples, and references for the task.",
      inputs: "A focused question and a target topic.",
      outputs: "Notes, sources, and open questions worth checking next.",
    },
    {
      id: "agent-reviewer",
      name: "Reviewer",
      responsibility: "Checks the draft result and points out what should improve.",
      inputs: "A draft answer, outline, or artifact.",
      outputs: "A short critique with concrete fixes.",
    },
  ],
  workflows: [
    {
      id: "workflow-study-guide",
      name: "Build a study guide",
      outcome: "Create a clear first draft for a course revision guide.",
      agentIds: ["agent-planner", "agent-researcher", "agent-reviewer"],
      timeSteps: [
        {
          id: "time-step-plan",
          agentId: "agent-planner",
          work: "Break the assignment into 3-5 milestones and define what each milestone should produce.",
          handoff: "Pass the milestone plan and open questions to Researcher.",
        },
        {
          id: "time-step-research",
          agentId: "agent-researcher",
          work: "Gather course concepts, examples, and references that match each milestone.",
          handoff: "Pass the evidence and notes to Reviewer.",
        },
        {
          id: "time-step-review",
          agentId: "agent-reviewer",
          work: "Check whether the guide is clear enough for another student to use.",
          handoff: "Deliver the revised draft as the workflow outcome.",
        },
      ],
    },
  ],
};

export function renderHomePage(routes: RouteSummary[]): string {
  const routeList = routes
    .map(
      (route) =>
        `<li class="flex items-start gap-3 rounded-2xl border border-app-line/70 bg-white px-4 py-3">
          <a class="rounded-full bg-app-accent/12 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-app-accent-strong uppercase underline decoration-app-accent/30 underline-offset-4" href="${escapeHtml(route.path)}">${escapeHtml(route.path)}</a>
          <span class="text-sm leading-6 text-app-text-soft">${escapeHtml(route.purpose)}</span>
        </li>`,
    )
    .join("");

  const starterAgentCards = starterState.agents.map((agent) => renderAgentCard(agent)).join("");
  const starterWorkflowCards = starterState.workflows.map((workflow) => renderWorkflowPreview(workflow, starterState.agents)).join("");
  const starterWorkflow = starterState.workflows[0];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(appTitle)}</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body class="min-h-screen bg-app-canvas text-app-text antialiased">
    <main class="mx-auto flex w-[min(78rem,calc(100vw-1.5rem))] flex-col gap-6 px-0 py-6 sm:w-[min(78rem,calc(100vw-2.5rem))] sm:py-8">
      <section class="overflow-hidden rounded-[1.5rem] border border-app-line/80 bg-app-surface shadow-panel">
        <div class="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.9fr)] lg:px-10 lg:py-10">
          <div>
            <p class="inline-flex items-center rounded-full border border-app-line/70 bg-app-canvas/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Learning surface</p>
            <h1 class="mt-4 max-w-[10ch] text-5xl leading-none font-semibold tracking-[-0.06em] sm:text-7xl">${escapeHtml(appTitle)}</h1>
            <p class="mt-5 max-w-3xl text-lg leading-8 text-app-text-soft">${escapeHtml(appDescription)}</p>
            <div class="mt-6 grid gap-3 text-sm leading-6 text-app-text-soft sm:grid-cols-3">
              <div class="rounded-[1rem] border border-app-line/70 bg-app-canvas/80 p-4">
                <p class="font-semibold text-app-text">1. Define agents</p>
                <p class="mt-2">Give each agent one clear job, the input it needs, and the output it should produce.</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-app-canvas/80 p-4">
                <p class="font-semibold text-app-text">2. Add time steps</p>
                <p class="mt-2">State who acts at T1, T2, and beyond so the workflow becomes an ordered system.</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-app-canvas/80 p-4">
                <p class="font-semibold text-app-text">3. Watch the handoff</p>
                <p class="mt-2">Inspect how work moves from one agent to the next. Everything saves to localStorage.</p>
              </div>
            </div>
          </div>
          <aside class="grid gap-4 self-start">
            <section class="rounded-[1rem] border border-app-line/70 bg-app-ink p-5 text-app-ink-contrast">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Workspace memory</p>
              <p class="mt-3 text-3xl font-semibold tracking-[-0.04em]" id="workspace-status">Saved in this browser</p>
              <p class="mt-3 text-sm leading-6 text-app-ink-soft">This version stores the learning workspace locally so students can experiment without accounts, servers, or setup friction.</p>
            </section>
            <section class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Agents</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="agent-count">${starterState.agents.length}</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Workflows</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="workflow-count">${starterState.workflows.length}</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Time steps</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="time-step-count">${countTimeSteps(starterState.workflows)}</p>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.95fr)]">
        <div class="grid gap-6">
          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Agent builder</p>
                <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Define the helpers in your system</h2>
                <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">Keep each agent narrow. Students should be able to say what the agent receives, what it returns, and why the workflow needs it.</p>
              </div>
              <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="load-example" type="button">Load example workspace</button>
            </div>

            <form class="mt-6 grid gap-4" id="agent-form">
              <input id="agent-editing-id" type="hidden" value="">
              <div class="grid gap-4 md:grid-cols-2">
                <label class="grid gap-2 text-sm font-semibold text-app-text" for="agent-name">
                  Agent name
                  <input class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="agent-name" maxlength="60" name="agent-name" placeholder="Planner" required type="text">
                </label>
                <label class="grid gap-2 text-sm font-semibold text-app-text" for="agent-responsibility">
                  Main job
                  <input class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="agent-responsibility" maxlength="140" name="agent-responsibility" placeholder="Breaks the task into manageable steps" required type="text">
                </label>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <label class="grid gap-2 text-sm font-semibold text-app-text" for="agent-inputs">
                  Input
                  <textarea class="min-h-28 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="agent-inputs" maxlength="220" name="agent-inputs" placeholder="A goal, question, or draft to work from" required></textarea>
                </label>
                <label class="grid gap-2 text-sm font-semibold text-app-text" for="agent-outputs">
                  Output
                  <textarea class="min-h-28 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="agent-outputs" maxlength="220" name="agent-outputs" placeholder="A plan, answer, critique, or another clear handoff" required></textarea>
                </label>
              </div>
              <div class="flex flex-wrap gap-3">
                <button class="rounded-full bg-app-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-accent-strong" id="agent-submit" type="submit">Save agent</button>
                <button class="hidden rounded-full border border-app-line/70 bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="agent-cancel" type="button">Cancel edit</button>
              </div>
            </form>

            <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" id="agent-list">${starterAgentCards}</div>
          </section>

          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Workflow builder</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Connect agents into a reusable sequence</h2>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">Pick the agents involved, then define each time step so students can see who acts at that moment and what gets handed forward.</p>
            </div>

            <form class="mt-6 grid gap-4" id="workflow-form">
              <input id="workflow-editing-id" type="hidden" value="">
              <div class="grid gap-4 md:grid-cols-2">
                <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-name">
                  Workflow name
                  <input class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-name" maxlength="80" name="workflow-name" placeholder="Prepare a literature review" required type="text">
                </label>
                <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-outcome">
                  Desired outcome
                  <input class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-outcome" maxlength="160" name="workflow-outcome" placeholder="A first draft that is clear enough to revise" required type="text">
                </label>
              </div>

              <fieldset class="rounded-[1rem] border border-app-line/80 bg-app-canvas/70 p-4">
                <legend class="px-2 text-sm font-semibold text-app-text">Agents in this workflow</legend>
                <p class="mb-3 text-sm leading-6 text-app-text-soft">Choose the agents that participate in the workflow. This keeps the association explicit for students.</p>
                <div class="grid gap-3 sm:grid-cols-2" id="workflow-agent-options"></div>
                <p class="mt-3 text-sm font-semibold text-app-rust" id="workflow-agent-error" role="status"></p>
              </fieldset>

              <fieldset class="rounded-[1rem] border border-app-line/80 bg-app-canvas/70 p-4">
                <legend class="px-2 text-sm font-semibold text-app-text">Time steps</legend>
                <p class="mb-4 text-sm leading-6 text-app-text-soft">Each time step says who is active now, what work they do at that moment, and what they pass to the next agent.</p>
                <div class="grid gap-4 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-agent">
                    Acting agent
                    <select class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-agent" name="workflow-time-step-agent"></select>
                  </label>
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-work">
                    Work at this time step
                    <textarea class="min-h-24 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-work" maxlength="220" name="workflow-time-step-work" placeholder="Researcher gathers examples for the first section"></textarea>
                  </label>
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-handoff">
                    What gets handed forward
                    <textarea class="min-h-24 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-handoff" maxlength="220" name="workflow-time-step-handoff" placeholder="Pass annotated notes to Reviewer"></textarea>
                  </label>
                </div>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                  <button class="rounded-full bg-app-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-accent-strong" id="time-step-submit" type="button">Add time step</button>
                  <button class="hidden rounded-full border border-app-line/70 bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="time-step-cancel" type="button">Cancel time step edit</button>
                  <p class="text-sm font-semibold text-app-rust" id="time-step-error" role="status"></p>
                </div>
                <div class="mt-4 grid gap-3" id="time-step-list">
                  <div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">No time steps yet. Add T1 to show who starts the workflow.</div>
                </div>
              </fieldset>

              <div class="flex flex-wrap gap-3">
                <button class="rounded-full bg-app-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-accent-strong" id="workflow-submit" type="submit">Save workflow</button>
                <button class="hidden rounded-full border border-app-line/70 bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="workflow-cancel" type="button">Cancel edit</button>
                <button class="rounded-full border border-app-line/70 bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" id="clear-workspace" type="button">Clear workspace</button>
              </div>
            </form>

            <div class="mt-6 grid gap-4" id="workflow-list">${starterWorkflowCards}</div>
          </section>
        </div>

        <aside class="grid gap-6">
          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Time-step playback</p>
            <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Watch the handoff</h2>
            <p class="mt-3 text-sm leading-7 text-app-text-soft">Move through a workflow step by step to see who is active now, what work packet they create, and where that packet goes next.</p>
            <div class="mt-5 grid gap-4">
              <label class="grid gap-2 text-sm font-semibold text-app-text" for="playback-workflow">
                Workflow to inspect
                <select class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="playback-workflow">
                  ${renderPlaybackWorkflowOptions(starterState.workflows)}
                </select>
              </label>
              <div class="flex flex-wrap items-center gap-3">
                <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="playback-prev" type="button">Previous step</button>
                <p class="text-sm font-semibold uppercase tracking-[0.18em] text-app-rust" id="playback-step-counter">${starterWorkflow ? `T1 of ${starterWorkflow.timeSteps.length}` : "No time steps"}</p>
                <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="playback-next" type="button">Next step</button>
              </div>
              <div id="playback-stage">${starterWorkflow ? renderPlaybackStage(starterWorkflow, starterState.agents, 0) : renderEmptyPlaybackStage()}</div>
            </div>
          </section>

          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Learning guide</p>
            <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">What students should notice</h2>
            <div class="mt-5 grid gap-4">
              <article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Agents are roles, not magic</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">An agent becomes easier to reason about when its job is small and its handoff is explicit.</p>
              </article>
              <article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Time creates structure</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">T1, T2, and later steps show that workflows are not just lists of agents. They are ordered moments with specific handoffs.</p>
              </article>
              <article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Handoffs reveal bottlenecks</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">If a handoff is vague, the next agent will not know what to do. The visualization makes that weakness easy to spot.</p>
              </article>
            </div>
          </section>

          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Workspace state</p>
                <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Inspect the JSON</h2>
              </div>
              <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="copy-json" type="button">Copy JSON</button>
            </div>
            <p class="mt-3 text-sm leading-7 text-app-text-soft">The app keeps the entire studio in <code class="rounded bg-app-accent/10 px-2 py-1 text-xs font-semibold text-app-accent-strong">localStorage</code> under the key <code class="rounded bg-app-accent/10 px-2 py-1 text-xs font-semibold text-app-accent-strong">${escapeHtml(storageKey)}</code>.</p>
            <label class="sr-only" for="workspace-json">Workspace JSON</label>
            <textarea class="mt-4 min-h-80 w-full rounded-[1rem] border border-app-line/80 bg-white px-4 py-4 font-mono text-sm leading-6 text-app-text outline-none" id="workspace-json" readonly>${escapeHtml(
              JSON.stringify(starterState, null, 2),
            )}</textarea>
          </section>

          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Available routes</p>
            <ul class="mt-4 grid gap-3">${routeList}</ul>
          </section>
        </aside>
      </section>

      <noscript>
        <section class="rounded-[1rem] border border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft shadow-panel">
          This interface needs JavaScript enabled to save agents, time steps, and workflows in localStorage.
        </section>
      </noscript>
    </main>

    <script id="workspace-seed" type="application/json">${serializeJsonForScript(starterState)}</script>
    <script>${createClientScript()}</script>
  </body>
</html>`;
}

function renderAgentCard(agent: AgentRecord): string {
  return `<article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Agent</p>
    <h3 class="mt-2 text-xl font-semibold tracking-[-0.03em] text-app-text">${escapeHtml(agent.name)}</h3>
    <p class="mt-3 text-sm leading-6 text-app-text-soft">${escapeHtml(agent.responsibility)}</p>
    <dl class="mt-4 grid gap-3 text-sm leading-6 text-app-text-soft">
      <div>
        <dt class="font-semibold text-app-text">Input</dt>
        <dd>${escapeHtml(agent.inputs)}</dd>
      </div>
      <div>
        <dt class="font-semibold text-app-text">Output</dt>
        <dd>${escapeHtml(agent.outputs)}</dd>
      </div>
    </dl>
  </article>`;
}

function renderWorkflowPreview(workflow: WorkflowRecord, agents: AgentRecord[]): string {
  const relatedAgents = workflow.agentIds
    .map((agentId) => resolveAgentName(agents, agentId))
    .map(
      (name) =>
        `<li class="rounded-full border border-app-line/70 bg-app-accent/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-app-accent-strong">${escapeHtml(name)}</li>`,
    )
    .join("");

  const timeSteps = workflow.timeSteps.map((timeStep, index) => renderTimeStepPreview(timeStep, workflow, agents, index)).join("");

  return `<article class="rounded-[1rem] border border-app-line/75 bg-white p-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">Workflow</p>
        <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">${escapeHtml(workflow.name)}</h3>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">${escapeHtml(workflow.outcome)}</p>
      </div>
      <ul class="flex flex-wrap gap-2">${relatedAgents}</ul>
    </div>
    <ol class="mt-5 grid gap-3">${timeSteps}</ol>
  </article>`;
}

function renderTimeStepPreview(timeStep: TimeStepRecord, workflow: WorkflowRecord, agents: AgentRecord[], index: number): string {
  const currentAgent = resolveAgentName(agents, timeStep.agentId);
  const nextStep = workflow.timeSteps[index + 1];
  const nextAgent = nextStep ? resolveAgentName(agents, nextStep.agentId) : "Outcome";

  return `<li class="rounded-[1rem] border border-app-line/70 bg-white p-4">
    <div class="flex gap-4">
      <div class="flex min-w-12 flex-col items-center">
        <span class="flex size-10 items-center justify-center rounded-full bg-app-rust text-sm font-semibold text-white">T${index + 1}</span>
        ${index < workflow.timeSteps.length - 1 ? '<span class="mt-2 h-full min-h-8 w-px bg-app-accent/25"></span>' : ""}
      </div>
      <div class="flex-1">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-app-accent">${escapeHtml(currentAgent)}</p>
        <p class="mt-2 text-sm leading-7 text-app-text">${escapeHtml(timeStep.work)}</p>
        <div class="mt-3 rounded-[0.9rem] border border-app-line/70 bg-app-sand/45 px-4 py-3 text-sm leading-6 text-app-text-soft">
          <p><span class="font-semibold text-app-text">Handoff:</span> ${escapeHtml(timeStep.handoff)}</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">${nextStep ? `Next agent: ${escapeHtml(nextAgent)}` : `Outcome: ${escapeHtml(workflow.outcome)}`}</p>
        </div>
      </div>
    </div>
  </li>`;
}

export function renderPlaybackWorkflowOptions(workflows: WorkflowRecord[]): string {
  return workflows
    .map(
      (workflow, index) =>
        `<option value="${escapeHtml(workflow.id)}"${index === 0 ? " selected" : ""}>${escapeHtml(workflow.name)}</option>`,
    )
    .join("");
}

export function renderPlaybackStage(workflow: WorkflowRecord, agents: AgentRecord[], index: number): string {
  const timeStep = workflow.timeSteps[index];
  const nextStep = workflow.timeSteps[index + 1];
  const currentAgent = resolveAgentName(agents, timeStep.agentId);
  const nextLabel = nextStep ? resolveAgentName(agents, nextStep.agentId) : workflow.outcome;

  return `<div class="grid gap-4">
    <article class="rounded-[1rem] border border-app-line/75 bg-white p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-app-rust">Active at T${index + 1}</p>
      <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">${escapeHtml(currentAgent)}</h3>
      <p class="mt-3 text-sm leading-7 text-app-text-soft">${escapeHtml(timeStep.work)}</p>
    </article>
    <article class="rounded-[1rem] border border-app-line/75 bg-app-ink p-5 text-app-ink-contrast">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Handoff packet</p>
      <p class="mt-3 text-base leading-7">${escapeHtml(timeStep.handoff)}</p>
      <p class="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-app-highlight">${nextStep ? "Next agent" : "Workflow outcome"}</p>
      <p class="mt-2 text-lg font-semibold tracking-[-0.02em]">${escapeHtml(nextLabel)}</p>
    </article>
  </div>`;
}

export function renderEmptyPlaybackStage(): string {
  return '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Create a workflow with at least one time step to see the handoff playback.</div>';
}

export function resolveAgentName(agents: AgentRecord[], agentId: string): string {
  return agents.find((agent) => agent.id === agentId)?.name ?? "Missing agent";
}

export function countTimeSteps(workflows: WorkflowRecord[]): number {
  return workflows.reduce((sum, workflow) => sum + workflow.timeSteps.length, 0);
}

function createClientScript(): string {
  return `
(() => {
  const storageKey = ${JSON.stringify(storageKey)};
  const emptyState = { agents: [], workflows: [] };
  const seedNode = document.getElementById("workspace-seed");
  const seedState = seedNode ? normalizeState(JSON.parse(seedNode.textContent || "{}")) : emptyState;
  const state = loadState();
  let draftTimeSteps = [];
  let editingTimeStepId = "";
  const playback = { workflowId: "", stepIndex: 0 };

  const refs = {
    agentCount: document.getElementById("agent-count"),
    workflowCount: document.getElementById("workflow-count"),
    timeStepCount: document.getElementById("time-step-count"),
    workspaceStatus: document.getElementById("workspace-status"),
    workspaceJson: document.getElementById("workspace-json"),
    agentList: document.getElementById("agent-list"),
    workflowList: document.getElementById("workflow-list"),
    workflowAgentOptions: document.getElementById("workflow-agent-options"),
    workflowAgentError: document.getElementById("workflow-agent-error"),
    loadExample: document.getElementById("load-example"),
    clearWorkspace: document.getElementById("clear-workspace"),
    copyJson: document.getElementById("copy-json"),
    agentForm: document.getElementById("agent-form"),
    workflowForm: document.getElementById("workflow-form"),
    agentEditingId: document.getElementById("agent-editing-id"),
    workflowEditingId: document.getElementById("workflow-editing-id"),
    agentName: document.getElementById("agent-name"),
    agentResponsibility: document.getElementById("agent-responsibility"),
    agentInputs: document.getElementById("agent-inputs"),
    agentOutputs: document.getElementById("agent-outputs"),
    workflowName: document.getElementById("workflow-name"),
    workflowOutcome: document.getElementById("workflow-outcome"),
    workflowTimeStepAgent: document.getElementById("workflow-time-step-agent"),
    workflowTimeStepWork: document.getElementById("workflow-time-step-work"),
    workflowTimeStepHandoff: document.getElementById("workflow-time-step-handoff"),
    timeStepSubmit: document.getElementById("time-step-submit"),
    timeStepCancel: document.getElementById("time-step-cancel"),
    timeStepError: document.getElementById("time-step-error"),
    timeStepList: document.getElementById("time-step-list"),
    playbackWorkflow: document.getElementById("playback-workflow"),
    playbackPrev: document.getElementById("playback-prev"),
    playbackNext: document.getElementById("playback-next"),
    playbackStepCounter: document.getElementById("playback-step-counter"),
    playbackStage: document.getElementById("playback-stage"),
    agentSubmit: document.getElementById("agent-submit"),
    workflowSubmit: document.getElementById("workflow-submit"),
    agentCancel: document.getElementById("agent-cancel"),
    workflowCancel: document.getElementById("workflow-cancel"),
  };

  refs.loadExample?.addEventListener("click", () => {
    replaceState(seedState);
    resetAgentForm();
    resetWorkflowForm();
    persist();
    render();
  });

  refs.clearWorkspace?.addEventListener("click", () => {
    const shouldClear = window.confirm("Clear all saved agents, time steps, and workflows from this browser?");
    if (!shouldClear) {
      return;
    }

    replaceState(emptyState);
    resetAgentForm();
    resetWorkflowForm();
    persist();
    render();
  });

  refs.copyJson?.addEventListener("click", async () => {
    if (!(refs.workspaceJson instanceof HTMLTextAreaElement)) {
      return;
    }

    const payload = refs.workspaceJson.value;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        refs.workspaceJson.select();
        document.execCommand("copy");
      }

      refs.copyJson.textContent = "Copied";
      window.setTimeout(() => {
        refs.copyJson.textContent = "Copy JSON";
      }, 1500);
    } catch {
      refs.copyJson.textContent = "Copy failed";
      window.setTimeout(() => {
        refs.copyJson.textContent = "Copy JSON";
      }, 1500);
    }
  });

  refs.agentForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(refs.agentEditingId instanceof HTMLInputElement) || !(refs.agentName instanceof HTMLInputElement) || !(refs.agentResponsibility instanceof HTMLInputElement) || !(refs.agentInputs instanceof HTMLTextAreaElement) || !(refs.agentOutputs instanceof HTMLTextAreaElement)) {
      return;
    }

    const record = {
      id: refs.agentEditingId.value || createId("agent"),
      name: refs.agentName.value.trim(),
      responsibility: refs.agentResponsibility.value.trim(),
      inputs: refs.agentInputs.value.trim(),
      outputs: refs.agentOutputs.value.trim(),
    };

    if (!record.name || !record.responsibility || !record.inputs || !record.outputs) {
      return;
    }

    upsertRecord(state.agents, record);
    resetAgentForm();
    persist();
    render();
  });

  refs.workflowForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(refs.workflowEditingId instanceof HTMLInputElement) || !(refs.workflowName instanceof HTMLInputElement) || !(refs.workflowOutcome instanceof HTMLInputElement)) {
      return;
    }

    const agentIds = getSelectedAgentIds();
    refs.workflowAgentError.textContent = agentIds.length > 0 ? "" : "Choose at least one agent for the workflow.";
    if (agentIds.length === 0) {
      return;
    }

    const hasInvalidTimeStep = draftTimeSteps.some((timeStep) => !agentIds.includes(timeStep.agentId));
    if (hasInvalidTimeStep) {
      refs.timeStepError.textContent = "Each time step must use an agent selected for this workflow.";
      return;
    }

    if (draftTimeSteps.length === 0) {
      refs.timeStepError.textContent = "Add at least one time step so the workflow has a visible sequence.";
      return;
    }

    const record = {
      id: refs.workflowEditingId.value || createId("workflow"),
      name: refs.workflowName.value.trim(),
      outcome: refs.workflowOutcome.value.trim(),
      agentIds,
      timeSteps: cloneTimeSteps(draftTimeSteps),
    };

    if (!record.name || !record.outcome) {
      return;
    }

    upsertRecord(state.workflows, record);
    playback.workflowId = record.id;
    playback.stepIndex = 0;
    resetWorkflowForm();
    persist();
    render();
  });

  refs.workflowAgentOptions?.addEventListener("change", () => {
    syncTimeStepControls();
  });

  refs.timeStepSubmit?.addEventListener("click", () => {
    if (!(refs.workflowTimeStepAgent instanceof HTMLSelectElement) || !(refs.workflowTimeStepWork instanceof HTMLTextAreaElement) || !(refs.workflowTimeStepHandoff instanceof HTMLTextAreaElement)) {
      return;
    }

    const selectedAgentIds = getSelectedAgentIds();
    const record = {
      id: editingTimeStepId || createId("time-step"),
      agentId: refs.workflowTimeStepAgent.value,
      work: refs.workflowTimeStepWork.value.trim(),
      handoff: refs.workflowTimeStepHandoff.value.trim(),
    };

    refs.timeStepError.textContent = "";

    if (!record.agentId || !selectedAgentIds.includes(record.agentId)) {
      refs.timeStepError.textContent = "Choose an agent that is already part of the workflow.";
      return;
    }

    if (!record.work || !record.handoff) {
      refs.timeStepError.textContent = "Describe both the work for this time step and the handoff.";
      return;
    }

    upsertRecord(draftTimeSteps, record);
    resetTimeStepForm();
    renderDraftTimeSteps(new Set(selectedAgentIds));
  });

  refs.timeStepCancel?.addEventListener("click", resetTimeStepForm);
  refs.agentCancel?.addEventListener("click", resetAgentForm);
  refs.workflowCancel?.addEventListener("click", resetWorkflowForm);

  refs.timeStepList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const action = target.dataset.action;
    const timeStepId = target.dataset.timeStepId;
    if (!action || !timeStepId) {
      return;
    }

    if (action === "edit") {
      const timeStep = draftTimeSteps.find((record) => record.id === timeStepId);
      if (!timeStep) {
        return;
      }

      populateTimeStepForm(timeStep);
      return;
    }

    if (action === "delete") {
      draftTimeSteps = draftTimeSteps.filter((record) => record.id !== timeStepId);
      resetTimeStepForm();
      renderDraftTimeSteps(new Set(getSelectedAgentIds()));
    }
  });

  refs.agentList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const action = target.dataset.action;
    const agentId = target.dataset.agentId;
    if (!action || !agentId) {
      return;
    }

    if (action === "edit") {
      const agent = state.agents.find((record) => record.id === agentId);
      if (!agent) {
        return;
      }

      populateAgentForm(agent);
      return;
    }

    if (action === "delete") {
      state.agents = state.agents.filter((record) => record.id !== agentId);
      state.workflows = state.workflows
        .map((workflow) => ({
          ...workflow,
          agentIds: workflow.agentIds.filter((id) => id !== agentId),
          timeSteps: workflow.timeSteps.filter((timeStep) => timeStep.agentId !== agentId),
        }))
        .filter((workflow) => workflow.agentIds.length > 0 && workflow.timeSteps.length > 0);
      draftTimeSteps = draftTimeSteps.filter((timeStep) => timeStep.agentId !== agentId);
      resetAgentForm();
      syncTimeStepControls();
      persist();
      render();
    }
  });

  refs.workflowList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const action = target.dataset.action;
    const workflowId = target.dataset.workflowId;
    if (!action || !workflowId) {
      return;
    }

    if (action === "edit") {
      const workflow = state.workflows.find((record) => record.id === workflowId);
      if (!workflow) {
        return;
      }

      populateWorkflowForm(workflow);
      return;
    }

    if (action === "delete") {
      state.workflows = state.workflows.filter((record) => record.id !== workflowId);
      resetWorkflowForm();
      persist();
      render();
    }
  });

  refs.playbackWorkflow?.addEventListener("change", () => {
    if (!(refs.playbackWorkflow instanceof HTMLSelectElement)) {
      return;
    }

    playback.workflowId = refs.playbackWorkflow.value;
    playback.stepIndex = 0;
    renderPlayback();
  });

  refs.playbackPrev?.addEventListener("click", () => {
    playback.stepIndex = Math.max(playback.stepIndex - 1, 0);
    renderPlayback();
  });

  refs.playbackNext?.addEventListener("click", () => {
    const workflow = state.workflows.find((record) => record.id === playback.workflowId) || state.workflows[0];
    const lastIndex = workflow ? workflow.timeSteps.length - 1 : 0;
    playback.stepIndex = Math.min(playback.stepIndex + 1, lastIndex);
    renderPlayback();
  });

  render();

  function loadState() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return cloneState(seedState);
      }

      return normalizeState(JSON.parse(raw));
    } catch {
      return cloneState(seedState);
    }
  }

  function persist() {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function replaceState(nextState) {
    const cloned = cloneState(nextState);
    state.agents = cloned.agents;
    state.workflows = cloned.workflows;
    draftTimeSteps = [];
    editingTimeStepId = "";
    playback.workflowId = "";
    playback.stepIndex = 0;
  }

  function render() {
    refs.agentCount.textContent = String(state.agents.length);
    refs.workflowCount.textContent = String(state.workflows.length);
    refs.timeStepCount.textContent = String(state.workflows.reduce((sum, workflow) => sum + workflow.timeSteps.length, 0));
    refs.workspaceStatus.textContent = state.agents.length || state.workflows.length ? "Saved in this browser" : "Workspace is empty";
    refs.workspaceJson.value = JSON.stringify(state, null, 2);
    refs.agentList.innerHTML = renderAgentCards();
    refs.workflowList.innerHTML = renderWorkflowCards();
    renderAgentOptions(new Set(getSelectedAgentIds()));
    syncTimeStepControls();
    renderPlayback();
  }

  function syncTimeStepControls() {
    const selectedAgentIds = new Set(getSelectedAgentIds());
    renderTimeStepAgentOptions(selectedAgentIds);
    renderDraftTimeSteps(selectedAgentIds);
  }

  function renderAgentOptions(selectedAgentIds) {
    if (!(refs.workflowAgentOptions instanceof HTMLElement)) {
      return;
    }

    if (state.agents.length === 0) {
      refs.workflowAgentOptions.innerHTML = '<p class="rounded-2xl border border-dashed border-app-line/80 bg-app-canvas/70 px-4 py-4 text-sm leading-6 text-app-text-soft">Create an agent first. Then it can be assigned to a workflow.</p>';
      return;
    }

    refs.workflowAgentOptions.innerHTML = state.agents
      .map((agent) => {
        const checked = selectedAgentIds.has(agent.id) ? "checked" : "";
        return '<label class="flex items-start gap-3 rounded-2xl border border-app-line/70 bg-app-canvas/60 px-4 py-3 text-sm leading-6 text-app-text"><input class="mt-1 size-4 rounded border-app-line text-app-accent focus:ring-app-accent/30" data-agent-option value="' + escapeHtml(agent.id) + '" type="checkbox" ' + checked + '><span><span class="block font-semibold">' + escapeHtml(agent.name) + '</span><span class="text-app-text-soft">' + escapeHtml(agent.responsibility) + '</span></span></label>';
      })
      .join("");
  }

  function renderTimeStepAgentOptions(selectedAgentIds) {
    if (!(refs.workflowTimeStepAgent instanceof HTMLSelectElement)) {
      return;
    }

    const availableAgents = state.agents.filter((agent) => selectedAgentIds.has(agent.id));
    if (availableAgents.length === 0) {
      refs.workflowTimeStepAgent.disabled = true;
      refs.workflowTimeStepAgent.innerHTML = '<option value="">Select a workflow agent first</option>';
      return;
    }

    const currentValue = refs.workflowTimeStepAgent.value;
    refs.workflowTimeStepAgent.disabled = false;
    refs.workflowTimeStepAgent.innerHTML = availableAgents
      .map((agent) => '<option value="' + escapeHtml(agent.id) + '">' + escapeHtml(agent.name) + "</option>")
      .join("");

    if (availableAgents.some((agent) => agent.id === currentValue)) {
      refs.workflowTimeStepAgent.value = currentValue;
      return;
    }

    refs.workflowTimeStepAgent.value = availableAgents[0].id;
  }

  function renderDraftTimeSteps(selectedAgentIds) {
    if (!(refs.timeStepList instanceof HTMLElement)) {
      return;
    }

    if (draftTimeSteps.length === 0) {
      refs.timeStepList.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">No time steps yet. Add T1 to show who starts the workflow.</div>';
      return;
    }

    refs.timeStepList.innerHTML = draftTimeSteps
      .map((timeStep, index) => {
        const agentName = resolveAgentName(timeStep.agentId);
        const invalid = selectedAgentIds.size > 0 && !selectedAgentIds.has(timeStep.agentId);
        return '<article class="rounded-[1rem] border border-app-line/70 bg-white p-4"><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">T' + (index + 1) + '</p><h3 class="mt-2 text-lg font-semibold tracking-[-0.03em] text-app-text">' + escapeHtml(agentName) + '</h3></div><div class="flex flex-wrap gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-time-step-id="' + escapeHtml(timeStep.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-time-step-id="' + escapeHtml(timeStep.id) + '" type="button">Delete</button></div></div><p class="mt-3 text-sm leading-7 text-app-text-soft">' + escapeHtml(timeStep.work) + '</p><div class="mt-3 rounded-[0.9rem] border border-app-line/70 bg-app-sand/45 px-4 py-3 text-sm leading-6 text-app-text-soft"><p><span class="font-semibold text-app-text">Handoff:</span> ' + escapeHtml(timeStep.handoff) + '</p>' + (invalid ? '<p class="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">This agent is no longer selected for the workflow.</p>' : "") + '</div></article>';
      })
      .join("");
  }

  function renderAgentCards() {
    if (state.agents.length === 0) {
      return '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">No agents yet. Start with one small role such as planner, researcher, or reviewer.</div>';
    }

    return state.agents
      .map((agent) => {
        return '<article class="rounded-[1rem] border border-app-line/70 bg-white p-4"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Agent</p><h3 class="mt-2 text-xl font-semibold tracking-[-0.03em] text-app-text">' + escapeHtml(agent.name) + '</h3></div><div class="flex flex-wrap justify-end gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-agent-id="' + escapeHtml(agent.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-agent-id="' + escapeHtml(agent.id) + '" type="button">Delete</button></div></div><p class="mt-3 text-sm leading-6 text-app-text-soft">' + escapeHtml(agent.responsibility) + '</p><dl class="mt-4 grid gap-3 text-sm leading-6 text-app-text-soft"><div><dt class="font-semibold text-app-text">Input</dt><dd>' + escapeHtml(agent.inputs) + '</dd></div><div><dt class="font-semibold text-app-text">Output</dt><dd>' + escapeHtml(agent.outputs) + '</dd></div></dl></article>';
      })
      .join("");
  }

  function renderWorkflowCards() {
    if (state.workflows.length === 0) {
      return '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">No workflows yet. After you add agents, describe the order in which they cooperate over time.</div>';
    }

    return state.workflows
      .map((workflow) => {
        const agentPills = workflow.agentIds
          .map((agentId) => resolveAgentName(agentId))
          .map((name) => '<li class="rounded-full border border-app-line/70 bg-app-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-app-accent-strong">' + escapeHtml(name) + '</li>')
          .join("");

        const timeSteps = workflow.timeSteps
          .map((timeStep, index) => {
            const nextStep = workflow.timeSteps[index + 1];
            return '<li class="rounded-[1rem] border border-app-line/70 bg-white p-4"><div class="flex gap-4"><div class="flex min-w-12 flex-col items-center"><span class="flex size-10 items-center justify-center rounded-full bg-app-rust text-sm font-semibold text-white">T' + (index + 1) + '</span>' + (index < workflow.timeSteps.length - 1 ? '<span class="mt-2 h-full min-h-8 w-px bg-app-accent/25"></span>' : "") + '</div><div class="flex-1"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + escapeHtml(resolveAgentName(timeStep.agentId)) + '</p><p class="mt-2 text-sm leading-7 text-app-text">' + escapeHtml(timeStep.work) + '</p><div class="mt-3 rounded-[0.9rem] border border-app-line/70 bg-app-sand/45 px-4 py-3 text-sm leading-6 text-app-text-soft"><p><span class="font-semibold text-app-text">Handoff:</span> ' + escapeHtml(timeStep.handoff) + '</p><p class="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">' + (nextStep ? 'Next agent: ' + escapeHtml(resolveAgentName(nextStep.agentId)) : 'Outcome: ' + escapeHtml(workflow.outcome)) + '</p></div></div></div></li>';
          })
          .join("");

        return '<article class="rounded-[1rem] border border-app-line/75 bg-white p-5"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">Workflow</p><h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">' + escapeHtml(workflow.name) + '</h3><p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">' + escapeHtml(workflow.outcome) + '</p></div><div class="flex flex-wrap justify-end gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-workflow-id="' + escapeHtml(workflow.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-workflow-id="' + escapeHtml(workflow.id) + '" type="button">Delete</button></div></div><ul class="mt-4 flex flex-wrap gap-2">' + agentPills + '</ul><ol class="mt-5 grid gap-3">' + timeSteps + '</ol></article>';
      })
      .join("");
  }

  function renderPlayback() {
    if (!(refs.playbackWorkflow instanceof HTMLSelectElement) || !(refs.playbackStage instanceof HTMLElement) || !(refs.playbackStepCounter instanceof HTMLElement) || !(refs.playbackPrev instanceof HTMLButtonElement) || !(refs.playbackNext instanceof HTMLButtonElement)) {
      return;
    }

    if (state.workflows.length === 0) {
      refs.playbackWorkflow.disabled = true;
      refs.playbackWorkflow.innerHTML = '<option value="">No workflows yet</option>';
      refs.playbackStepCounter.textContent = "No time steps";
      refs.playbackPrev.disabled = true;
      refs.playbackNext.disabled = true;
      refs.playbackStage.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Create a workflow with at least one time step to see the handoff playback.</div>';
      return;
    }

    refs.playbackWorkflow.disabled = false;
    refs.playbackWorkflow.innerHTML = state.workflows
      .map((workflow) => '<option value="' + escapeHtml(workflow.id) + '">' + escapeHtml(workflow.name) + "</option>")
      .join("");

    const activeWorkflow = state.workflows.find((workflow) => workflow.id === playback.workflowId) || state.workflows[0];
    playback.workflowId = activeWorkflow.id;
    refs.playbackWorkflow.value = activeWorkflow.id;

    const maxIndex = Math.max(activeWorkflow.timeSteps.length - 1, 0);
    playback.stepIndex = Math.min(playback.stepIndex, maxIndex);

    const timeStep = activeWorkflow.timeSteps[playback.stepIndex];
    if (!timeStep) {
      refs.playbackStepCounter.textContent = "No time steps";
      refs.playbackPrev.disabled = true;
      refs.playbackNext.disabled = true;
      refs.playbackStage.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Add a time step to the selected workflow to see its handoff.</div>';
      return;
    }

    const nextStep = activeWorkflow.timeSteps[playback.stepIndex + 1];
    refs.playbackStepCounter.textContent = "T" + (playback.stepIndex + 1) + " of " + activeWorkflow.timeSteps.length;
    refs.playbackPrev.disabled = playback.stepIndex === 0;
    refs.playbackNext.disabled = playback.stepIndex === maxIndex;
    refs.playbackStage.innerHTML = '<div class="grid gap-4"><article class="rounded-[1rem] border border-app-line/75 bg-white p-5"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">Active at T' + (playback.stepIndex + 1) + '</p><h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">' + escapeHtml(resolveAgentName(timeStep.agentId)) + '</h3><p class="mt-3 text-sm leading-7 text-app-text-soft">' + escapeHtml(timeStep.work) + '</p></article><article class="rounded-[1rem] border border-app-line/75 bg-app-ink p-5 text-app-ink-contrast"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Handoff packet</p><p class="mt-3 text-base leading-7">' + escapeHtml(timeStep.handoff) + '</p><p class="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">' + (nextStep ? 'Next agent' : 'Workflow outcome') + '</p><p class="mt-2 text-lg font-semibold tracking-[-0.02em]">' + escapeHtml(nextStep ? resolveAgentName(nextStep.agentId) : activeWorkflow.outcome) + '</p></article></div>';
  }

  function populateAgentForm(agent) {
    refs.agentEditingId.value = agent.id;
    refs.agentName.value = agent.name;
    refs.agentResponsibility.value = agent.responsibility;
    refs.agentInputs.value = agent.inputs;
    refs.agentOutputs.value = agent.outputs;
    refs.agentSubmit.textContent = "Update agent";
    refs.agentCancel.classList.remove("hidden");
    refs.agentName.focus();
  }

  function populateWorkflowForm(workflow) {
    refs.workflowEditingId.value = workflow.id;
    refs.workflowName.value = workflow.name;
    refs.workflowOutcome.value = workflow.outcome;
    draftTimeSteps = cloneTimeSteps(workflow.timeSteps);
    playback.workflowId = workflow.id;
    playback.stepIndex = 0;
    refs.workflowSubmit.textContent = "Update workflow";
    refs.workflowCancel.classList.remove("hidden");
    refs.workflowAgentError.textContent = "";
    refs.timeStepError.textContent = "";
    renderAgentOptions(new Set(workflow.agentIds));
    syncTimeStepControls();
    resetTimeStepForm();
    refs.workflowName.focus();
  }

  function populateTimeStepForm(timeStep) {
    editingTimeStepId = timeStep.id;
    refs.workflowTimeStepWork.value = timeStep.work;
    refs.workflowTimeStepHandoff.value = timeStep.handoff;
    renderTimeStepAgentOptions(new Set(getSelectedAgentIds()));
    refs.workflowTimeStepAgent.value = timeStep.agentId;
    refs.timeStepSubmit.textContent = "Update time step";
    refs.timeStepCancel.classList.remove("hidden");
    refs.timeStepError.textContent = "";
    refs.workflowTimeStepWork.focus();
  }

  function resetAgentForm() {
    refs.agentForm?.reset();
    refs.agentEditingId.value = "";
    refs.agentSubmit.textContent = "Save agent";
    refs.agentCancel.classList.add("hidden");
  }

  function resetWorkflowForm() {
    refs.workflowForm?.reset();
    refs.workflowEditingId.value = "";
    draftTimeSteps = [];
    refs.workflowSubmit.textContent = "Save workflow";
    refs.workflowCancel.classList.add("hidden");
    refs.workflowAgentError.textContent = "";
    refs.timeStepError.textContent = "";
    renderAgentOptions(new Set());
    resetTimeStepForm();
  }

  function resetTimeStepForm() {
    editingTimeStepId = "";
    if (refs.workflowTimeStepWork instanceof HTMLTextAreaElement) {
      refs.workflowTimeStepWork.value = "";
    }
    if (refs.workflowTimeStepHandoff instanceof HTMLTextAreaElement) {
      refs.workflowTimeStepHandoff.value = "";
    }
    refs.timeStepSubmit.textContent = "Add time step";
    refs.timeStepCancel.classList.add("hidden");
    refs.timeStepError.textContent = "";
    renderTimeStepAgentOptions(new Set(getSelectedAgentIds()));
  }

  function getSelectedAgentIds() {
    return Array.from(document.querySelectorAll("[data-agent-option]"))
      .filter((input) => input instanceof HTMLInputElement && input.checked)
      .map((input) => input.value);
  }

  function normalizeState(raw) {
    return {
      agents: Array.isArray(raw?.agents)
        ? raw.agents
            .map((agent) => ({
              id: normalizeText(agent.id) || createId("agent"),
              name: normalizeText(agent.name),
              responsibility: normalizeText(agent.responsibility),
              inputs: normalizeText(agent.inputs),
              outputs: normalizeText(agent.outputs),
            }))
            .filter((agent) => agent.name && agent.responsibility && agent.inputs && agent.outputs)
        : [],
      workflows: Array.isArray(raw?.workflows)
        ? raw.workflows
            .map((workflow) => {
              const timeSteps = normalizeTimeSteps(workflow);
              const agentIds = Array.from(
                new Set([
                  ...(Array.isArray(workflow.agentIds) ? workflow.agentIds.map(normalizeText).filter(Boolean) : []),
                  ...timeSteps.map((timeStep) => timeStep.agentId),
                ]),
              );

              return {
                id: normalizeText(workflow.id) || createId("workflow"),
                name: normalizeText(workflow.name),
                outcome: normalizeText(workflow.outcome),
                agentIds,
                timeSteps,
              };
            })
            .filter((workflow) => workflow.name && workflow.outcome && workflow.agentIds.length > 0 && workflow.timeSteps.length > 0)
        : [],
    };
  }

  function normalizeTimeSteps(workflow) {
    if (Array.isArray(workflow?.timeSteps)) {
      return workflow.timeSteps
        .map((timeStep) => ({
          id: normalizeText(timeStep.id) || createId("time-step"),
          agentId: normalizeText(timeStep.agentId),
          work: normalizeText(timeStep.work),
          handoff: normalizeText(timeStep.handoff),
        }))
        .filter((timeStep) => timeStep.agentId && timeStep.work && timeStep.handoff);
    }

    if (Array.isArray(workflow?.steps)) {
      const legacyAgentIds = Array.isArray(workflow.agentIds) ? workflow.agentIds.map(normalizeText).filter(Boolean) : [];
      return workflow.steps
        .map((step, index, steps) => {
          const agentId = legacyAgentIds[index] || legacyAgentIds[legacyAgentIds.length - 1] || "";
          return {
            id: createId("time-step"),
            agentId,
            work: normalizeText(step),
            handoff: index < steps.length - 1 ? "Pass the work to the next agent." : "Deliver the completed workflow outcome.",
          };
        })
        .filter((timeStep) => timeStep.agentId && timeStep.work && timeStep.handoff);
    }

    return [];
  }

  function cloneState(source) {
    return {
      agents: source.agents.map((agent) => ({ ...agent })),
      workflows: source.workflows.map((workflow) => ({
        ...workflow,
        agentIds: [...workflow.agentIds],
        timeSteps: cloneTimeSteps(workflow.timeSteps),
      })),
    };
  }

  function cloneTimeSteps(source) {
    return source.map((timeStep) => ({ ...timeStep }));
  }

  function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function createId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  function upsertRecord(collection, record) {
    const index = collection.findIndex((entry) => entry.id === record.id);
    if (index >= 0) {
      collection[index] = record;
      return;
    }

    collection.push(record);
  }

  function resolveAgentName(agentId) {
    return state.agents.find((agent) => agent.id === agentId)?.name || "Missing agent";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
`;
}

function serializeJsonForScript(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
