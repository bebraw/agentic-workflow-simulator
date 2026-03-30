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

type WorkflowRecord = {
  id: string;
  name: string;
  outcome: string;
  steps: string[];
  agentIds: string[];
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
      steps: [
        "Planner breaks the assignment into 3-5 milestones.",
        "Researcher gathers course concepts, examples, and useful source material.",
        "Reviewer checks whether the guide is clear enough for another student to use.",
      ],
      agentIds: ["agent-planner", "agent-researcher", "agent-reviewer"],
    },
  ],
};

export function renderHomePage(routes: RouteSummary[]): string {
  const routeList = routes
    .map(
      (route) =>
        `<li class="flex items-start gap-3 rounded-2xl border border-app-line/70 bg-white/70 px-4 py-3 shadow-[0_18px_40px_-34px_rgba(31,38,33,0.45)]">
          <a class="rounded-full bg-app-accent/12 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-app-accent-strong uppercase underline decoration-app-accent/30 underline-offset-4" href="${escapeHtml(route.path)}">${escapeHtml(route.path)}</a>
          <span class="text-sm leading-6 text-app-text-soft">${escapeHtml(route.purpose)}</span>
        </li>`,
    )
    .join("");

  const starterAgentCards = starterState.agents
    .map(
      (agent) =>
        `<article class="rounded-[1.25rem] border border-app-line/70 bg-white/80 p-4 shadow-[0_16px_40px_-30px_rgba(31,38,33,0.4)]">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Agent</p>
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
        </article>`,
    )
    .join("");

  const starterWorkflowCards = starterState.workflows.map((workflow) => renderWorkflowPreview(workflow, starterState.agents)).join("");

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
      <section class="overflow-hidden rounded-[2rem] border border-app-line/80 bg-app-surface/95 shadow-panel backdrop-blur">
        <div class="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.9fr)] lg:px-10 lg:py-10">
          <div>
            <p class="inline-flex items-center rounded-full border border-app-line/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Learning surface</p>
            <h1 class="mt-4 max-w-[10ch] text-5xl leading-none font-semibold tracking-[-0.06em] sm:text-7xl">${escapeHtml(appTitle)}</h1>
            <p class="mt-5 max-w-3xl text-lg leading-8 text-app-text-soft">${escapeHtml(appDescription)}</p>
            <div class="mt-6 grid gap-3 text-sm leading-6 text-app-text-soft sm:grid-cols-3">
              <div class="rounded-[1.25rem] border border-app-line/70 bg-white/75 p-4">
                <p class="font-semibold text-app-text">1. Define agents</p>
                <p class="mt-2">Give each agent one clear job, the input it needs, and the output it should produce.</p>
              </div>
              <div class="rounded-[1.25rem] border border-app-line/70 bg-white/75 p-4">
                <p class="font-semibold text-app-text">2. Connect a workflow</p>
                <p class="mt-2">Choose which agents belong in a workflow and write the steps in everyday language.</p>
              </div>
              <div class="rounded-[1.25rem] border border-app-line/70 bg-white/75 p-4">
                <p class="font-semibold text-app-text">3. Inspect the result</p>
                <p class="mt-2">See the state update live and keep experimenting. Everything saves to localStorage.</p>
              </div>
            </div>
          </div>
          <aside class="grid gap-4 self-start">
            <section class="rounded-[1.5rem] border border-app-line/70 bg-app-ink/95 p-5 text-app-ink-contrast shadow-[0_26px_56px_-36px_rgba(11,35,28,0.72)]">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-highlight">Workspace memory</p>
              <p class="mt-3 text-3xl font-semibold tracking-[-0.04em]" id="workspace-status">Saved in this browser</p>
              <p class="mt-3 text-sm leading-6 text-app-ink-soft">This version stores the learning workspace locally so students can experiment without accounts, servers, or setup friction.</p>
            </section>
            <section class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div class="rounded-[1.25rem] border border-app-line/70 bg-white/78 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-app-accent">Agents</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="agent-count">${starterState.agents.length}</p>
              </div>
              <div class="rounded-[1.25rem] border border-app-line/70 bg-white/78 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-app-accent">Workflows</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="workflow-count">${starterState.workflows.length}</p>
              </div>
              <div class="rounded-[1.25rem] border border-app-line/70 bg-white/78 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-app-accent">Connections</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="connection-count">${starterState.workflows.reduce((sum, workflow) => sum + workflow.agentIds.length, 0)}</p>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.95fr)]">
        <div class="grid gap-6">
          <section class="rounded-[1.75rem] border border-app-line/80 bg-app-surface/95 p-5 shadow-panel sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Agent builder</p>
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

          <section class="rounded-[1.75rem] border border-app-line/80 bg-app-surface/95 p-5 shadow-panel sm:p-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Workflow builder</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Connect agents into a reusable sequence</h2>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">Pick at least one agent, describe the outcome, and write the steps in plain language. Each line should read like a handoff between people.</p>
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

              <fieldset class="rounded-[1.25rem] border border-app-line/80 bg-white/75 p-4">
                <legend class="px-2 text-sm font-semibold text-app-text">Agents in this workflow</legend>
                <p class="mb-3 text-sm leading-6 text-app-text-soft">Choose the agents that participate in the workflow. This keeps the association explicit for students.</p>
                <div class="grid gap-3 sm:grid-cols-2" id="workflow-agent-options"></div>
                <p class="mt-3 text-sm font-semibold text-app-rust" id="workflow-agent-error" role="status"></p>
              </fieldset>

              <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-steps">
                Steps, one per line
                <textarea class="min-h-36 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-steps" name="workflow-steps" placeholder="Planner turns the goal into milestones&#10;Researcher gathers examples and supporting facts&#10;Reviewer checks the final draft for gaps" required></textarea>
              </label>

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
          <section class="rounded-[1.75rem] border border-app-line/80 bg-app-surface/95 p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Learning guide</p>
            <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">What students should notice</h2>
            <div class="mt-5 grid gap-4">
              <article class="rounded-[1.25rem] border border-app-line/70 bg-white/78 p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Agents are roles, not magic</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">An agent becomes easier to reason about when its job is small and its handoff is explicit.</p>
              </article>
              <article class="rounded-[1.25rem] border border-app-line/70 bg-white/78 p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Workflows are agreements</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">A workflow should explain who acts first, what gets passed forward, and what “done” looks like.</p>
              </article>
              <article class="rounded-[1.25rem] border border-app-line/70 bg-white/78 p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Iteration matters</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">Students can edit, reload, clear, and replay their ideas because the workspace state stays local to the browser.</p>
              </article>
            </div>
          </section>

          <section class="rounded-[1.75rem] border border-app-line/80 bg-app-surface/95 p-5 shadow-panel sm:p-6">
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Workspace state</p>
                <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Inspect the JSON</h2>
              </div>
              <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="copy-json" type="button">Copy JSON</button>
            </div>
            <p class="mt-3 text-sm leading-7 text-app-text-soft">The app keeps the entire studio in <code class="rounded bg-app-accent/10 px-2 py-1 text-xs font-semibold text-app-accent-strong">localStorage</code> under the key <code class="rounded bg-app-accent/10 px-2 py-1 text-xs font-semibold text-app-accent-strong">${escapeHtml(storageKey)}</code>.</p>
            <label class="sr-only" for="workspace-json">Workspace JSON</label>
            <textarea class="mt-4 min-h-80 w-full rounded-[1.5rem] border border-app-line/80 bg-app-ink px-4 py-4 font-mono text-sm leading-6 text-app-ink-contrast outline-none" id="workspace-json" readonly>${escapeHtml(
              JSON.stringify(starterState, null, 2),
            )}</textarea>
          </section>

          <section class="rounded-[1.75rem] border border-app-line/80 bg-app-surface/95 p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Available routes</p>
            <ul class="mt-4 grid gap-3">${routeList}</ul>
          </section>
        </aside>
      </section>

      <noscript>
        <section class="rounded-[1.5rem] border border-app-line/80 bg-white/85 p-5 text-sm leading-7 text-app-text-soft shadow-panel">
          This interface needs JavaScript enabled to save agents and workflows in localStorage.
        </section>
      </noscript>
    </main>

    <script id="workspace-seed" type="application/json">${serializeJsonForScript(starterState)}</script>
    <script>${createClientScript()}</script>
  </body>
</html>`;
}

function renderWorkflowPreview(workflow: WorkflowRecord, agents: AgentRecord[]): string {
  const relatedAgents = workflow.agentIds
    .map((agentId) => agents.find((agent) => agent.id === agentId)?.name)
    .filter((name): name is string => Boolean(name))
    .map(
      (name) =>
        `<li class="rounded-full border border-app-line/70 bg-app-accent/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-app-accent-strong">${escapeHtml(name)}</li>`,
    )
    .join("");

  const steps = workflow.steps
    .map(
      (step) =>
        `<li class="rounded-[1rem] border border-app-line/70 bg-white/82 px-4 py-3 text-sm leading-6 text-app-text-soft">${escapeHtml(step)}</li>`,
    )
    .join("");

  return `<article class="rounded-[1.4rem] border border-app-line/75 bg-app-sand/50 p-5 shadow-[0_18px_40px_-34px_rgba(31,38,33,0.45)]">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-rust">Workflow</p>
        <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">${escapeHtml(workflow.name)}</h3>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">${escapeHtml(workflow.outcome)}</p>
      </div>
      <ul class="flex flex-wrap gap-2">${relatedAgents}</ul>
    </div>
    <ol class="mt-5 grid gap-3">${steps}</ol>
  </article>`;
}

function createClientScript(): string {
  return `
(() => {
  const storageKey = ${JSON.stringify(storageKey)};
  const emptyState = { agents: [], workflows: [] };
  const seedNode = document.getElementById("workspace-seed");
  const seedState = seedNode ? normalizeState(JSON.parse(seedNode.textContent || "{}")) : emptyState;
  const state = loadState();

  const refs = {
    agentCount: document.getElementById("agent-count"),
    workflowCount: document.getElementById("workflow-count"),
    connectionCount: document.getElementById("connection-count"),
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
    workflowSteps: document.getElementById("workflow-steps"),
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
    const shouldClear = window.confirm("Clear all saved agents and workflows from this browser?");
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

    if (!(refs.workflowEditingId instanceof HTMLInputElement) || !(refs.workflowName instanceof HTMLInputElement) || !(refs.workflowOutcome instanceof HTMLInputElement) || !(refs.workflowSteps instanceof HTMLTextAreaElement)) {
      return;
    }

    const agentIds = getSelectedAgentIds();
    refs.workflowAgentError.textContent = agentIds.length > 0 ? "" : "Choose at least one agent for the workflow.";
    if (agentIds.length === 0) {
      return;
    }

    const steps = refs.workflowSteps.value
      .split(/\\n+/)
      .map((step) => step.trim())
      .filter(Boolean);

    const record = {
      id: refs.workflowEditingId.value || createId("workflow"),
      name: refs.workflowName.value.trim(),
      outcome: refs.workflowOutcome.value.trim(),
      steps,
      agentIds,
    };

    if (!record.name || !record.outcome || record.steps.length === 0) {
      return;
    }

    upsertRecord(state.workflows, record);
    resetWorkflowForm();
    persist();
    render();
  });

  refs.agentCancel?.addEventListener("click", resetAgentForm);
  refs.workflowCancel?.addEventListener("click", resetWorkflowForm);

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
        }))
        .filter((workflow) => workflow.agentIds.length > 0);
      resetAgentForm();
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
    state.agents = cloneState(nextState).agents;
    state.workflows = cloneState(nextState).workflows;
  }

  function render() {
    const selectedAgentIds = new Set(getSelectedAgentIds());
    renderAgentOptions(selectedAgentIds);

    refs.agentCount.textContent = String(state.agents.length);
    refs.workflowCount.textContent = String(state.workflows.length);
    refs.connectionCount.textContent = String(state.workflows.reduce((sum, workflow) => sum + workflow.agentIds.length, 0));
    refs.workspaceStatus.textContent = state.agents.length || state.workflows.length ? "Saved in this browser" : "Workspace is empty";
    refs.workspaceJson.value = JSON.stringify(state, null, 2);
    refs.agentList.innerHTML = renderAgentCards();
    refs.workflowList.innerHTML = renderWorkflowCards();
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

  function renderAgentCards() {
    if (state.agents.length === 0) {
      return '<div class="rounded-[1.25rem] border border-dashed border-app-line/80 bg-app-canvas/70 p-5 text-sm leading-7 text-app-text-soft">No agents yet. Start with one small role such as planner, researcher, or reviewer.</div>';
    }

    return state.agents
      .map((agent) => {
        return '<article class="rounded-[1.25rem] border border-app-line/70 bg-white/82 p-4 shadow-[0_16px_40px_-30px_rgba(31,38,33,0.35)]"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-accent">Agent</p><h3 class="mt-2 text-xl font-semibold tracking-[-0.03em] text-app-text">' + escapeHtml(agent.name) + '</h3></div><div class="flex flex-wrap justify-end gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-agent-id="' + escapeHtml(agent.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-agent-id="' + escapeHtml(agent.id) + '" type="button">Delete</button></div></div><p class="mt-3 text-sm leading-6 text-app-text-soft">' + escapeHtml(agent.responsibility) + '</p><dl class="mt-4 grid gap-3 text-sm leading-6 text-app-text-soft"><div><dt class="font-semibold text-app-text">Input</dt><dd>' + escapeHtml(agent.inputs) + '</dd></div><div><dt class="font-semibold text-app-text">Output</dt><dd>' + escapeHtml(agent.outputs) + '</dd></div></dl></article>';
      })
      .join("");
  }

  function renderWorkflowCards() {
    if (state.workflows.length === 0) {
      return '<div class="rounded-[1.25rem] border border-dashed border-app-line/80 bg-app-canvas/70 p-5 text-sm leading-7 text-app-text-soft">No workflows yet. After you add agents, describe the order in which they cooperate.</div>';
    }

    return state.workflows
      .map((workflow) => {
        const agentPills = workflow.agentIds
          .map((agentId) => state.agents.find((agent) => agent.id === agentId)?.name || "Missing agent")
          .map((name) => '<li class="rounded-full border border-app-line/70 bg-app-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-app-accent-strong">' + escapeHtml(name) + '</li>')
          .join("");

        const steps = workflow.steps
          .map((step) => '<li class="rounded-[1rem] border border-app-line/70 bg-white/82 px-4 py-3 text-sm leading-6 text-app-text-soft">' + escapeHtml(step) + '</li>')
          .join("");

        return '<article class="rounded-[1.4rem] border border-app-line/75 bg-app-sand/50 p-5 shadow-[0_18px_40px_-34px_rgba(31,38,33,0.4)]"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-app-rust">Workflow</p><h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">' + escapeHtml(workflow.name) + '</h3><p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">' + escapeHtml(workflow.outcome) + '</p></div><div class="flex flex-wrap justify-end gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-workflow-id="' + escapeHtml(workflow.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-workflow-id="' + escapeHtml(workflow.id) + '" type="button">Delete</button></div></div><ul class="mt-4 flex flex-wrap gap-2">' + agentPills + '</ul><ol class="mt-5 grid gap-3">' + steps + '</ol></article>';
      })
      .join("");
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
    refs.workflowSteps.value = workflow.steps.join("\\n");
    refs.workflowSubmit.textContent = "Update workflow";
    refs.workflowCancel.classList.remove("hidden");
    refs.workflowAgentError.textContent = "";
    renderAgentOptions(new Set(workflow.agentIds));
    refs.workflowName.focus();
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
    refs.workflowSubmit.textContent = "Save workflow";
    refs.workflowCancel.classList.add("hidden");
    refs.workflowAgentError.textContent = "";
    renderAgentOptions(new Set());
  }

  function getSelectedAgentIds() {
    return Array.from(document.querySelectorAll("[data-agent-option]"))
      .filter((input) => input instanceof HTMLInputElement && input.checked)
      .map((input) => input.value);
  }

  function normalizeState(raw) {
    return {
      agents: Array.isArray(raw?.agents)
        ? raw.agents.map((agent) => ({
            id: normalizeText(agent.id) || createId("agent"),
            name: normalizeText(agent.name),
            responsibility: normalizeText(agent.responsibility),
            inputs: normalizeText(agent.inputs),
            outputs: normalizeText(agent.outputs),
          })).filter((agent) => agent.name && agent.responsibility && agent.inputs && agent.outputs)
        : [],
      workflows: Array.isArray(raw?.workflows)
        ? raw.workflows.map((workflow) => ({
            id: normalizeText(workflow.id) || createId("workflow"),
            name: normalizeText(workflow.name),
            outcome: normalizeText(workflow.outcome),
            steps: Array.isArray(workflow.steps) ? workflow.steps.map(normalizeText).filter(Boolean) : [],
            agentIds: Array.isArray(workflow.agentIds) ? workflow.agentIds.map(normalizeText).filter(Boolean) : [],
          })).filter((workflow) => workflow.name && workflow.outcome && workflow.steps.length > 0)
        : [],
    };
  }

  function cloneState(source) {
    return {
      agents: source.agents.map((agent) => ({ ...agent })),
      workflows: source.workflows.map((workflow) => ({ ...workflow, steps: [...workflow.steps], agentIds: [...workflow.agentIds] })),
    };
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

    collection.unshift(record);
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
