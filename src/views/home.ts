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
  time: number;
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

type TimeGroup = {
  time: number;
  steps: TimeStepRecord[];
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
      id: "agent-source-checker",
      name: "Source Checker",
      responsibility: "Verifies that evidence is trustworthy and properly cited.",
      inputs: "Claims, links, and candidate references.",
      outputs: "A checked set of sources with warnings about weak evidence.",
    },
    {
      id: "agent-writer",
      name: "Writer",
      responsibility: "Turns plans and evidence into readable draft content.",
      inputs: "A structure, notes, and supporting material.",
      outputs: "A draft explanation, report, or script.",
    },
    {
      id: "agent-reviewer",
      name: "Reviewer",
      responsibility: "Checks the draft result and points out what should improve.",
      inputs: "A draft answer, outline, or artifact.",
      outputs: "A short critique with concrete fixes.",
    },
    {
      id: "agent-quiz-maker",
      name: "Quiz Maker",
      responsibility: "Creates practice questions that test the main concepts.",
      inputs: "A topic list or study notes.",
      outputs: "Questions, answer keys, and self-check prompts.",
    },
    {
      id: "agent-slide-designer",
      name: "Slide Designer",
      responsibility: "Transforms the story into a presentation structure.",
      inputs: "A message, draft script, and audience goal.",
      outputs: "Slide titles, layout ideas, and visual cues.",
    },
  ],
  workflows: [
    {
      id: "workflow-seminar-briefing",
      name: "Prepare a seminar briefing",
      outcome: "A short seminar briefing with verified sources and clear talking points.",
      agentIds: ["agent-planner", "agent-researcher", "agent-source-checker", "agent-writer", "agent-reviewer"],
      timeSteps: [
        {
          id: "seminar-plan",
          time: 1,
          agentId: "agent-planner",
          work: "Break the seminar topic into sections, decisions, and evidence needs.",
          handoff: "Pass the structure to Researcher and Source Checker.",
        },
        {
          id: "seminar-research",
          time: 2,
          agentId: "agent-researcher",
          work: "Gather concepts, examples, and candidate references for each section.",
          handoff: "Pass the collected notes to Writer.",
        },
        {
          id: "seminar-source-check",
          time: 2,
          agentId: "agent-source-checker",
          work: "Verify the strongest references and flag any weak or missing citations.",
          handoff: "Pass the verified source list to Writer.",
        },
        {
          id: "seminar-write",
          time: 3,
          agentId: "agent-writer",
          work: "Assemble the final briefing draft using the research notes and checked sources.",
          handoff: "Pass the briefing draft to Reviewer.",
        },
        {
          id: "seminar-review",
          time: 4,
          agentId: "agent-reviewer",
          work: "Check the briefing for clarity, evidence quality, and missing transitions.",
          handoff: "Deliver the revised seminar briefing as the workflow outcome.",
        },
      ],
    },
    {
      id: "workflow-revision-pack",
      name: "Build an exam revision pack",
      outcome: "A compact revision pack with notes and practice questions.",
      agentIds: ["agent-planner", "agent-researcher", "agent-quiz-maker", "agent-reviewer"],
      timeSteps: [
        {
          id: "revision-plan",
          time: 1,
          agentId: "agent-planner",
          work: "Turn the exam scope into a list of topics and learning goals.",
          handoff: "Pass the topic list to Researcher and Quiz Maker.",
        },
        {
          id: "revision-research",
          time: 2,
          agentId: "agent-researcher",
          work: "Write short notes that explain the key ideas for each topic.",
          handoff: "Pass the study notes to Reviewer.",
        },
        {
          id: "revision-quiz",
          time: 2,
          agentId: "agent-quiz-maker",
          work: "Create practice questions that match the same topic list.",
          handoff: "Pass the question set to Reviewer.",
        },
        {
          id: "revision-review",
          time: 3,
          agentId: "agent-reviewer",
          work: "Check that the notes and quiz cover the same ideas and use clear wording.",
          handoff: "Deliver the finished revision pack as the workflow outcome.",
        },
      ],
    },
    {
      id: "workflow-project-presentation",
      name: "Turn a project into a presentation",
      outcome: "A presentation outline with a supporting narrative and slide structure.",
      agentIds: ["agent-planner", "agent-writer", "agent-slide-designer", "agent-reviewer"],
      timeSteps: [
        {
          id: "presentation-plan",
          time: 1,
          agentId: "agent-planner",
          work: "Define the project story, audience goal, and the sections the presentation needs.",
          handoff: "Pass the section plan to Writer and Slide Designer.",
        },
        {
          id: "presentation-write",
          time: 2,
          agentId: "agent-writer",
          work: "Draft the spoken explanation for each section of the presentation.",
          handoff: "Pass the speaking notes to Reviewer.",
        },
        {
          id: "presentation-design",
          time: 2,
          agentId: "agent-slide-designer",
          work: "Sketch the slide sequence, titles, and the visual support each point needs.",
          handoff: "Pass the slide structure to Reviewer.",
        },
        {
          id: "presentation-review",
          time: 3,
          agentId: "agent-reviewer",
          work: "Check that the spoken story and slide structure support each other.",
          handoff: "Deliver the presentation outline as the workflow outcome.",
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
          <a class="rounded-full bg-app-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-app-accent-strong underline decoration-app-accent/30 underline-offset-4" href="${escapeHtml(route.path)}">${escapeHtml(route.path)}</a>
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
    <main class="mx-auto flex w-[min(94rem,calc(100vw-1rem))] flex-col gap-6 px-0 py-4 sm:w-[min(94rem,calc(100vw-2rem))] sm:py-6">
      <section class="overflow-hidden rounded-[1.5rem] border border-app-line/80 bg-app-surface shadow-panel">
        <div class="grid gap-8 px-5 py-8 sm:px-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)] xl:px-10 xl:py-10">
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
                <p class="font-semibold text-app-text">2. Add time slots</p>
                <p class="mt-2">Use the same time slot for agents that work in parallel and different slots for handoffs over time.</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-app-canvas/80 p-4">
                <p class="font-semibold text-app-text">3. Compare examples</p>
                <p class="mt-2">Study the bundled workflows to see the difference between sequential and parallel execution.</p>
              </div>
            </div>
          </div>
          <aside class="grid gap-4 self-start xl:pt-2">
            <section class="rounded-[1rem] border border-app-line/70 bg-app-ink p-5 text-app-ink-contrast">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Workspace memory</p>
              <p class="mt-3 text-3xl font-semibold tracking-[-0.04em]" id="workspace-status">Saved in this browser</p>
              <p class="mt-3 text-sm leading-6 text-app-ink-soft">This version stores the learning workspace locally so students can experiment without accounts, servers, or setup friction.</p>
            </section>
            <section class="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Agents</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="agent-count">${starterState.agents.length}</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Workflows</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="workflow-count">${starterState.workflows.length}</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Agent actions</p>
                <p class="mt-2 text-3xl font-semibold tracking-[-0.04em]" id="time-step-count">${countTimeSteps(starterState.workflows)}</p>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
        <div class="grid gap-5 xl:grid-cols-[minmax(16rem,0.34fr)_minmax(0,1fr)] xl:items-start">
          <div class="grid gap-4">
            <div class="rounded-[1.25rem] border border-app-line/75 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Workflow playback</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Watch the handoff</h2>
              <p class="mt-3 text-sm leading-7 text-app-text-soft">Move through a workflow time slot by time slot, or let the graph animation run, to see who is active now, which agents branch in parallel, and where the data packet moves next.</p>
            </div>
            <div class="grid gap-4 rounded-[1.25rem] border border-app-line/75 bg-app-canvas/70 p-4">
              <label class="grid gap-2 text-sm font-semibold text-app-text" for="playback-workflow">
                Workflow to inspect
                <select class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="playback-workflow">
                  ${renderPlaybackWorkflowOptions(starterState.workflows)}
                </select>
              </label>
              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="playback-prev" type="button">Previous slot</button>
                <button class="rounded-full border border-app-line/70 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="playback-next" type="button">Next slot</button>
                <button class="rounded-full bg-app-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-accent-strong sm:col-span-2 xl:col-span-1" id="playback-auto" type="button">Play animation</button>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-white px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">Active slot</p>
                <p class="mt-2 text-lg font-semibold tracking-[-0.03em] text-app-text" id="playback-step-counter">${starterWorkflow ? formatTimeCounter(starterWorkflow, 0) : "No time slots"}</p>
              </div>
              <div class="rounded-[1rem] border border-app-line/70 bg-app-ink p-4 text-sm leading-7 text-app-ink-contrast">
                Click any graph node to jump to its slot. The graph and the card playback stay synchronized on the same workflow state.
              </div>
            </div>
          </div>
          <div class="grid gap-4">
            <div id="workflow-graph-stage">${starterWorkflow ? renderWorkflowGraph(starterWorkflow, starterState.agents, 0) : renderEmptyWorkflowGraph()}</div>
            <div id="playback-stage">${starterWorkflow ? renderPlaybackStage(starterWorkflow, starterState.agents, 0) : renderEmptyPlaybackStage()}</div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_minmax(20rem,0.78fr)]">
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
              <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">Pick the agents involved, then define each action with a time slot. Agents that share the same time slot are shown as running in parallel.</p>
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
                <legend class="px-2 text-sm font-semibold text-app-text">Agent actions</legend>
                <p class="mb-4 text-sm leading-6 text-app-text-soft">Give each action a time slot, the acting agent, the work performed there, and the handoff that follows. Reusing a time slot shows parallel work.</p>
                <div class="grid gap-4 xl:grid-cols-[minmax(0,0.45fr)_minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-time">
                    Time slot
                    <input class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-time" min="1" name="workflow-time-step-time" step="1" type="number" value="1">
                  </label>
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-agent">
                    Acting agent
                    <select class="rounded-2xl border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-agent" name="workflow-time-step-agent"></select>
                  </label>
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-work">
                    Work at this time slot
                    <textarea class="min-h-24 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-work" maxlength="220" name="workflow-time-step-work" placeholder="Researcher gathers examples for the first section"></textarea>
                  </label>
                  <label class="grid gap-2 text-sm font-semibold text-app-text" for="workflow-time-step-handoff">
                    What gets handed forward
                    <textarea class="min-h-24 rounded-[1.25rem] border border-app-line/80 bg-white px-4 py-3 text-base font-normal text-app-text outline-none transition focus:border-app-accent/60 focus:ring-2 focus:ring-app-accent/15" id="workflow-time-step-handoff" maxlength="220" name="workflow-time-step-handoff" placeholder="Pass annotated notes to Reviewer"></textarea>
                  </label>
                </div>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                  <button class="rounded-full bg-app-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-accent-strong" id="time-step-submit" type="button">Add agent action</button>
                  <button class="hidden rounded-full border border-app-line/70 bg-white px-5 py-3 text-sm font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" id="time-step-cancel" type="button">Cancel edit</button>
                  <p class="text-sm font-semibold text-app-rust" id="time-step-error" role="status"></p>
                </div>
                <div class="mt-4 grid gap-3" id="time-step-list">
                  <div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">No actions yet. Add T1 to show who starts the workflow.</div>
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

        <aside class="grid gap-6 xl:sticky xl:top-6 xl:self-start">
          <section class="rounded-[1.5rem] border border-app-line/80 bg-app-surface p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-accent">Learning guide</p>
            <h2 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">What students should notice</h2>
            <div class="mt-5 grid gap-4">
              <article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Parallel work still needs coordination</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">Two agents can work at the same time, but they still need a shared time slot and clear handoffs.</p>
              </article>
              <article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Time slots are not the same as agent count</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">A workflow might have five agent actions but only three time slots if some of those actions run in parallel.</p>
              </article>
              <article class="rounded-[1rem] border border-app-line/70 bg-white p-4">
                <h3 class="text-lg font-semibold tracking-[-0.03em]">Handoffs reveal dependencies</h3>
                <p class="mt-2 text-sm leading-7 text-app-text-soft">If a handoff is vague, the next slot will stall even when agents work in parallel.</p>
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
            <textarea class="mt-4 h-72 w-full rounded-[1rem] border border-app-line/80 bg-white px-4 py-4 font-mono text-sm leading-6 text-app-text outline-none xl:h-[28rem]" id="workspace-json" readonly>${escapeHtml(
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
          This interface needs JavaScript enabled to save agents, time slots, and workflows in localStorage.
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
        `<li class="rounded-full border border-app-line/70 bg-app-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-app-accent-strong">${escapeHtml(name)}</li>`,
    )
    .join("");

  const groups = groupTimeSteps(workflow.timeSteps);
  const timeGroups = groups.map((group, index) => renderTimeGroupPreview(group, groups[index + 1], workflow, agents)).join("");

  return `<article class="rounded-[1rem] border border-app-line/75 bg-white p-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">Workflow</p>
        <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">${escapeHtml(workflow.name)}</h3>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">${escapeHtml(workflow.outcome)}</p>
      </div>
      <ul class="flex flex-wrap gap-2">${relatedAgents}</ul>
    </div>
    <ol class="mt-5 grid gap-3">${timeGroups}</ol>
  </article>`;
}

function renderTimeGroupPreview(
  group: TimeGroup,
  nextGroup: TimeGroup | undefined,
  workflow: WorkflowRecord,
  agents: AgentRecord[],
): string {
  const actionCards = group.steps.map((step) => renderParallelActionCard(step, nextGroup, workflow, agents)).join("");
  return `<li class="rounded-[1rem] border border-app-line/70 bg-white p-4">
    <div class="flex gap-4">
      <div class="flex min-w-12 flex-col items-center">
        <span class="flex size-10 items-center justify-center rounded-full bg-app-rust text-sm font-semibold text-white">T${group.time}</span>
        ${nextGroup ? '<span class="mt-2 h-full min-h-8 w-px bg-app-accent/25"></span>' : ""}
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">${group.steps.length > 1 ? `${group.steps.length} agents work in parallel` : "Single active agent"}</p>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">${nextGroup ? `Next slot: T${nextGroup.time}` : "Final slot"}</p>
        </div>
        <div class="mt-3 grid gap-3 md:grid-cols-2">${actionCards}</div>
      </div>
    </div>
  </li>`;
}

function renderParallelActionCard(
  step: TimeStepRecord,
  nextGroup: TimeGroup | undefined,
  workflow: WorkflowRecord,
  agents: AgentRecord[],
): string {
  return `<article class="rounded-[0.9rem] border border-app-line/70 bg-app-sand/45 p-4">
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">${escapeHtml(resolveAgentName(agents, step.agentId))}</p>
    <p class="mt-2 text-sm leading-7 text-app-text">${escapeHtml(step.work)}</p>
    <div class="mt-3 rounded-[0.9rem] border border-app-line/70 bg-white px-4 py-3 text-sm leading-6 text-app-text-soft">
      <p><span class="font-semibold text-app-text">Handoff:</span> ${escapeHtml(step.handoff)}</p>
      <p class="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">${nextGroup ? `Feeds into T${nextGroup.time}` : `Outcome: ${escapeHtml(workflow.outcome)}`}</p>
    </div>
  </article>`;
}

export function renderPlaybackWorkflowOptions(workflows: WorkflowRecord[]): string {
  return workflows
    .map(
      (workflow, index) =>
        `<option value="${escapeHtml(workflow.id)}"${index === 0 ? " selected" : ""}>${escapeHtml(workflow.name)}</option>`,
    )
    .join("");
}

export function renderPlaybackStage(workflow: WorkflowRecord, agents: AgentRecord[], groupIndex: number): string {
  const groups = groupTimeSteps(workflow.timeSteps);
  const group = groups[groupIndex];
  if (!group) {
    return renderEmptyPlaybackStage();
  }

  const nextGroup = groups[groupIndex + 1];
  const activeCards = group.steps
    .map(
      (step) => `<article class="rounded-[0.9rem] border border-app-line/70 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">${escapeHtml(resolveAgentName(agents, step.agentId))}</p>
        <p class="mt-2 text-sm leading-7 text-app-text-soft">${escapeHtml(step.work)}</p>
      </article>`,
    )
    .join("");
  const handoffCards = group.steps
    .map(
      (step) => `<article class="rounded-[0.9rem] border border-app-line/70 bg-white px-4 py-3 text-sm leading-6 text-app-text-soft">
        <p class="font-semibold text-app-text">${escapeHtml(resolveAgentName(agents, step.agentId))}</p>
        <p class="mt-2">${escapeHtml(step.handoff)}</p>
      </article>`,
    )
    .join("");

  return `<div class="grid gap-4">
    <article class="rounded-[1rem] border border-app-line/75 bg-white p-5">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">Active at T${group.time}</p>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">${group.steps.length > 1 ? `${group.steps.length} agents are working in parallel at this time.` : "One agent is active in this slot."}</p>
      </div>
      <div class="mt-4 grid gap-3 md:grid-cols-2">${activeCards}</div>
    </article>
    <article class="rounded-[1rem] border border-app-line/75 bg-app-ink p-5 text-app-ink-contrast">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Handoff packets</p>
      <div class="mt-4 grid gap-3">${handoffCards}</div>
      <p class="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">${nextGroup ? `Next slot: T${nextGroup.time}` : "Workflow outcome"}</p>
      <p class="mt-2 text-lg font-semibold tracking-[-0.02em]">${nextGroup ? `${nextGroup.steps.length} agent${nextGroup.steps.length === 1 ? "" : "s"} continue at T${nextGroup.time}` : escapeHtml(workflow.outcome)}</p>
    </article>
  </div>`;
}

export function renderEmptyPlaybackStage(): string {
  return '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Create a workflow with at least one time slot to see the handoff playback.</div>';
}

export function renderWorkflowGraph(workflow: WorkflowRecord, agents: AgentRecord[], groupIndex: number): string {
  const groups = groupTimeSteps(workflow.timeSteps);
  const activeGroup = groups[groupIndex];
  if (!activeGroup) {
    return renderEmptyWorkflowGraph();
  }

  const layout = createWorkflowGraphLayout(groups);
  const nextGroup = groups[groupIndex + 1];
  const columnGuides = layout.columns
    .map(
      (column) => `<g>
        <rect fill="rgb(47 111 237 / 0.05)" height="${layout.height - 16}" rx="28" width="${layout.nodeWidth + 28}" x="${column.x - 14}" y="8"></rect>
        <text fill="#52607a" font-size="12" font-weight="700" letter-spacing="0.18em" text-anchor="middle" x="${column.x + layout.nodeWidth / 2}" y="30">T${column.time}</text>
      </g>`,
    )
    .join("");

  const edges = groups
    .slice(0, -1)
    .flatMap((group, currentIndex) => {
      const sourceNodes = layout.nodesByGroup[currentIndex] ?? [];
      const targetNodes = layout.nodesByGroup[currentIndex + 1] ?? [];
      return sourceNodes.flatMap((sourceNode) =>
        targetNodes.map((targetNode) => {
          const path = buildGraphEdgePath(sourceNode, targetNode, layout.nodeWidth);
          const isActive = currentIndex === groupIndex;
          const stroke = isActive ? "#2f6fed" : "rgb(22 32 51 / 0.14)";
          return `<g>
            <path d="${path}" fill="none" stroke="${stroke}" stroke-dasharray="${isActive ? "8 10" : "0"}" stroke-linecap="round" stroke-width="${isActive ? 3 : 2}">
              ${isActive ? '<animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.9s" repeatCount="indefinite"></animate>' : ""}
              <title>${escapeHtml(sourceNode.step.handoff)}</title>
            </path>
            ${
              isActive
                ? `<circle cx="0" cy="0" fill="#7fb2ff" r="5">
                    <animateMotion dur="1.9s" path="${path}" repeatCount="indefinite"></animateMotion>
                  </circle>`
                : ""
            }
          </g>`;
        }),
      );
    })
    .join("");

  const nodes = layout.nodes
    .map((node) => {
      const stateClass =
        node.groupIndex === groupIndex
          ? "border-app-accent/40 bg-app-sand shadow-panel ring-2 ring-app-accent/20"
          : node.groupIndex < groupIndex
            ? "border-app-line/70 bg-white/90"
            : "border-app-line/70 bg-white/75";
      const stateLabel = node.groupIndex === groupIndex ? "Active packet" : node.groupIndex < groupIndex ? "Earlier slot" : "Upcoming slot";
      return `<button aria-label="Focus T${node.time}: ${escapeHtml(resolveAgentName(agents, node.step.agentId))}" aria-pressed="${node.groupIndex === groupIndex}" class="absolute flex flex-col overflow-hidden rounded-[1rem] border p-4 text-left transition hover:-translate-y-0.5 hover:border-app-accent/35 ${stateClass}" data-graph-group-index="${node.groupIndex}" style="height:${layout.nodeHeight}px;left:${node.x}px;top:${node.y}px;width:${layout.nodeWidth}px" title="${escapeHtml(node.step.work)}" type="button">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-rust">T${node.time} · ${stateLabel}</p>
        <p class="mt-2 text-sm leading-5 font-semibold text-app-text">${escapeHtml(resolveAgentName(agents, node.step.agentId))}</p>
        <p class="mt-2 overflow-hidden text-[13px] leading-5 text-app-text-soft" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;">${escapeHtml(node.step.work)}</p>
      </button>`;
    })
    .join("");

  return `<div class="grid gap-4">
    <div class="rounded-[1.25rem] border border-app-line/80 bg-white/80 p-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm font-semibold text-app-text">Graph view for ${escapeHtml(workflow.name)}</p>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">${activeGroup.steps.length > 1 ? `${activeGroup.steps.length} active branches at T${activeGroup.time}` : `Single active branch at T${activeGroup.time}`}</p>
      </div>
      <div class="mt-4 overflow-x-auto pb-2">
        <div class="relative" style="height:${layout.height}px;width:${layout.width}px">
          <svg aria-hidden="true" class="absolute inset-0 h-full w-full" viewBox="0 0 ${layout.width} ${layout.height}">
            ${columnGuides}
            ${edges}
          </svg>
          ${nodes}
        </div>
      </div>
    </div>
    <div class="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <article class="rounded-[1rem] border border-app-line/75 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Active data packet</p>
        <p class="mt-2 text-lg font-semibold tracking-[-0.03em] text-app-text">${nextGroup ? `Packets leave T${activeGroup.time} and head to T${nextGroup.time}` : `T${activeGroup.time} delivers the final result`}</p>
        <p class="mt-2 text-sm leading-7 text-app-text-soft">${activeGroup.steps.map((step) => escapeHtml(step.handoff)).join(" ")}</p>
      </article>
      <article class="rounded-[1rem] border border-app-line/75 bg-app-ink p-4 text-app-ink-contrast">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Why this spike matters</p>
        <p class="mt-2 text-sm leading-7">${nextGroup ? `The DAG makes dependencies visible: every active branch at T${activeGroup.time} feeds the next slot at T${nextGroup.time}.` : escapeHtml(workflow.outcome)}</p>
      </article>
    </div>
  </div>`;
}

export function renderEmptyWorkflowGraph(): string {
  return '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Create a workflow with at least one time slot to see the experimental DAG graph.</div>';
}

export function resolveAgentName(agents: AgentRecord[], agentId: string): string {
  return agents.find((agent) => agent.id === agentId)?.name ?? "Missing agent";
}

export function countTimeSteps(workflows: WorkflowRecord[]): number {
  return workflows.reduce((sum, workflow) => sum + workflow.timeSteps.length, 0);
}

export function countTimeSlots(workflow: WorkflowRecord): number {
  return groupTimeSteps(workflow.timeSteps).length;
}

function formatTimeCounter(workflow: WorkflowRecord, groupIndex: number): string {
  const groups = groupTimeSteps(workflow.timeSteps);
  const group = groups[groupIndex];
  return group ? `T${group.time} of ${groups.length}` : "No time slots";
}

function groupTimeSteps(timeSteps: TimeStepRecord[]): TimeGroup[] {
  const groups = new Map<number, TimeStepRecord[]>();

  for (const timeStep of sortTimeSteps(timeSteps)) {
    const current = groups.get(timeStep.time) ?? [];
    current.push(timeStep);
    groups.set(timeStep.time, current);
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => left - right)
    .map(([time, steps]) => ({ time, steps }));
}

function sortTimeSteps(timeSteps: TimeStepRecord[]): TimeStepRecord[] {
  return [...timeSteps].sort((left, right) => left.time - right.time);
}

function createWorkflowGraphLayout(groups: TimeGroup[]) {
  const nodeWidth = 190;
  const nodeHeight = 148;
  const columnGap = 234;
  const rowGap = 28;
  const paddingX = 28;
  const paddingY = 32;
  const maxRows = Math.max(...groups.map((group) => group.steps.length), 1);
  const contentHeight = maxRows * nodeHeight + Math.max(maxRows - 1, 0) * rowGap;
  const width = Math.max(paddingX * 2 + nodeWidth + Math.max(groups.length - 1, 0) * columnGap, 640);
  const height = paddingY * 2 + contentHeight;
  const columns = groups.map((group, groupIndex) => ({
    time: group.time,
    x: paddingX + groupIndex * columnGap,
  }));
  const nodesByGroup = groups.map((group, groupIndex) => {
    const totalHeight = group.steps.length * nodeHeight + Math.max(group.steps.length - 1, 0) * rowGap;
    const startY = paddingY + (contentHeight - totalHeight) / 2;
    return group.steps.map((step, stepIndex) => ({
      step,
      time: group.time,
      groupIndex,
      x: paddingX + groupIndex * columnGap,
      y: startY + stepIndex * (nodeHeight + rowGap),
    }));
  });

  return {
    width,
    height,
    nodeWidth,
    nodeHeight,
    columns,
    nodesByGroup,
    nodes: nodesByGroup.flat(),
  };
}

function buildGraphEdgePath(sourceNode: { x: number; y: number }, targetNode: { x: number; y: number }, nodeWidth: number): string {
  const startX = sourceNode.x + nodeWidth;
  const startY = sourceNode.y + 66;
  const endX = targetNode.x;
  const endY = targetNode.y + 66;
  const controlOffset = Math.max((endX - startX) * 0.45, 44);
  return `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
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
  const playback = { workflowId: "", groupIndex: 0, isAutoPlaying: false, timerId: 0 };

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
    workflowTimeStepTime: document.getElementById("workflow-time-step-time"),
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
    playbackAuto: document.getElementById("playback-auto"),
    playbackStepCounter: document.getElementById("playback-step-counter"),
    playbackStage: document.getElementById("playback-stage"),
    workflowGraphStage: document.getElementById("workflow-graph-stage"),
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
    const shouldClear = window.confirm("Clear all saved agents, time slots, and workflows from this browser?");
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
      refs.timeStepError.textContent = "Each action must use an agent selected for this workflow.";
      return;
    }

    if (draftTimeSteps.length === 0) {
      refs.timeStepError.textContent = "Add at least one agent action so the workflow has a visible sequence.";
      return;
    }

    const record = {
      id: refs.workflowEditingId.value || createId("workflow"),
      name: refs.workflowName.value.trim(),
      outcome: refs.workflowOutcome.value.trim(),
      agentIds,
      timeSteps: sortTimeSteps(cloneTimeSteps(draftTimeSteps)),
    };

    if (!record.name || !record.outcome) {
      return;
    }

    upsertRecord(state.workflows, record);
    playback.workflowId = record.id;
    playback.groupIndex = 0;
    resetWorkflowForm();
    persist();
    render();
  });

  refs.workflowAgentOptions?.addEventListener("change", () => {
    syncTimeStepControls();
  });

  refs.timeStepSubmit?.addEventListener("click", () => {
    if (!(refs.workflowTimeStepTime instanceof HTMLInputElement) || !(refs.workflowTimeStepAgent instanceof HTMLSelectElement) || !(refs.workflowTimeStepWork instanceof HTMLTextAreaElement) || !(refs.workflowTimeStepHandoff instanceof HTMLTextAreaElement)) {
      return;
    }

    const selectedAgentIds = getSelectedAgentIds();
    const time = Number.parseInt(refs.workflowTimeStepTime.value, 10);
    const record = {
      id: editingTimeStepId || createId("time-step"),
      time,
      agentId: refs.workflowTimeStepAgent.value,
      work: refs.workflowTimeStepWork.value.trim(),
      handoff: refs.workflowTimeStepHandoff.value.trim(),
    };

    refs.timeStepError.textContent = "";

    if (!Number.isInteger(record.time) || record.time < 1) {
      refs.timeStepError.textContent = "Use a whole-number time slot such as 1, 2, or 3.";
      return;
    }

    if (!record.agentId || !selectedAgentIds.includes(record.agentId)) {
      refs.timeStepError.textContent = "Choose an agent that is already part of the workflow.";
      return;
    }

    if (!record.work || !record.handoff) {
      refs.timeStepError.textContent = "Describe both the work for this action and the handoff.";
      return;
    }

    upsertRecord(draftTimeSteps, record);
    draftTimeSteps = sortTimeSteps(draftTimeSteps);
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
    playback.groupIndex = 0;
    renderPlayback();
  });

  refs.playbackPrev?.addEventListener("click", () => {
    playback.groupIndex = Math.max(playback.groupIndex - 1, 0);
    renderPlayback();
  });

  refs.playbackNext?.addEventListener("click", () => {
    const workflow = state.workflows.find((record) => record.id === playback.workflowId) || state.workflows[0];
    const groups = workflow ? groupTimeSteps(workflow.timeSteps) : [];
    const lastIndex = Math.max(groups.length - 1, 0);
    playback.groupIndex = Math.min(playback.groupIndex + 1, lastIndex);
    renderPlayback();
  });

  refs.playbackAuto?.addEventListener("click", () => {
    if (playback.isAutoPlaying) {
      stopPlaybackAnimation();
      renderPlayback();
      return;
    }

    startPlaybackAnimation();
    renderPlayback();
  });

  refs.workflowGraphStage?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const trigger = target.closest("[data-graph-group-index]");
    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    const nextIndex = Number.parseInt(trigger.dataset.graphGroupIndex || "", 10);
    if (!Number.isInteger(nextIndex) || nextIndex < 0) {
      return;
    }

    playback.groupIndex = nextIndex;
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

  function startPlaybackAnimation() {
    const workflow = state.workflows.find((record) => record.id === playback.workflowId) || state.workflows[0];
    const groups = workflow ? groupTimeSteps(workflow.timeSteps) : [];
    if (groups.length <= 1) {
      playback.isAutoPlaying = false;
      playback.timerId = 0;
      return;
    }

    stopPlaybackAnimation();
    playback.isAutoPlaying = true;
    playback.timerId = window.setInterval(() => {
      const currentWorkflow = state.workflows.find((record) => record.id === playback.workflowId) || state.workflows[0];
      const currentGroups = currentWorkflow ? groupTimeSteps(currentWorkflow.timeSteps) : [];
      if (currentGroups.length <= 1) {
        stopPlaybackAnimation();
        renderPlayback();
        return;
      }

      const lastIndex = currentGroups.length - 1;
      playback.groupIndex = playback.groupIndex >= lastIndex ? 0 : playback.groupIndex + 1;
      renderPlayback();
    }, 1800);
  }

  function stopPlaybackAnimation() {
    if (playback.timerId) {
      window.clearInterval(playback.timerId);
      playback.timerId = 0;
    }

    playback.isAutoPlaying = false;
  }

  function replaceState(nextState) {
    stopPlaybackAnimation();
    const cloned = cloneState(nextState);
    state.agents = cloned.agents;
    state.workflows = cloned.workflows;
    draftTimeSteps = [];
    editingTimeStepId = "";
    playback.workflowId = "";
    playback.groupIndex = 0;
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
      refs.timeStepList.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">No actions yet. Add T1 to show who starts the workflow.</div>';
      return;
    }

    refs.timeStepList.innerHTML = sortTimeSteps(draftTimeSteps)
      .map((timeStep) => {
        const agentName = resolveAgentName(timeStep.agentId);
        const invalid = selectedAgentIds.size > 0 && !selectedAgentIds.has(timeStep.agentId);
        const parallel = draftTimeSteps.some((candidate) => candidate.id !== timeStep.id && candidate.time === timeStep.time);
        return '<article class="rounded-[1rem] border border-app-line/70 bg-white p-4"><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">T' + timeStep.time + (parallel ? ' parallel' : "") + '</p><h3 class="mt-2 text-lg font-semibold tracking-[-0.03em] text-app-text">' + escapeHtml(agentName) + '</h3></div><div class="flex flex-wrap gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-time-step-id="' + escapeHtml(timeStep.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-time-step-id="' + escapeHtml(timeStep.id) + '" type="button">Delete</button></div></div><p class="mt-3 text-sm leading-7 text-app-text-soft">' + escapeHtml(timeStep.work) + '</p><div class="mt-3 rounded-[0.9rem] border border-app-line/70 bg-app-sand/45 px-4 py-3 text-sm leading-6 text-app-text-soft"><p><span class="font-semibold text-app-text">Handoff:</span> ' + escapeHtml(timeStep.handoff) + '</p>' + (parallel ? '<p class="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Shares this time slot with another agent.</p>' : "") + (invalid ? '<p class="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">This agent is no longer selected for the workflow.</p>' : "") + '</div></article>';
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
        const groups = groupTimeSteps(workflow.timeSteps);
        const timeGroups = groups
          .map((group, index) => {
            const nextGroup = groups[index + 1];
            const cards = group.steps
              .map((timeStep) => '<article class="rounded-[0.9rem] border border-app-line/70 bg-app-sand/45 p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + escapeHtml(resolveAgentName(timeStep.agentId)) + '</p><p class="mt-2 text-sm leading-7 text-app-text">' + escapeHtml(timeStep.work) + '</p><div class="mt-3 rounded-[0.9rem] border border-app-line/70 bg-white px-4 py-3 text-sm leading-6 text-app-text-soft"><p><span class="font-semibold text-app-text">Handoff:</span> ' + escapeHtml(timeStep.handoff) + '</p><p class="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">' + (nextGroup ? 'Feeds into T' + nextGroup.time : 'Outcome: ' + escapeHtml(workflow.outcome)) + '</p></div></article>')
              .join("");
            return '<li class="rounded-[1rem] border border-app-line/70 bg-white p-4"><div class="flex gap-4"><div class="flex min-w-12 flex-col items-center"><span class="flex size-10 items-center justify-center rounded-full bg-app-rust text-sm font-semibold text-white">T' + group.time + '</span>' + (nextGroup ? '<span class="mt-2 h-full min-h-8 w-px bg-app-accent/25"></span>' : '') + '</div><div class="flex-1"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + (group.steps.length > 1 ? group.steps.length + ' agents work in parallel' : 'Single active agent') + '</p><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">' + (nextGroup ? 'Next slot: T' + nextGroup.time : 'Final slot') + '</p></div><div class="mt-3 grid gap-3 md:grid-cols-2">' + cards + '</div></div></div></li>';
          })
          .join("");

        return '<article class="rounded-[1rem] border border-app-line/75 bg-white p-5"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-app-rust">Workflow</p><h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-app-text">' + escapeHtml(workflow.name) + '</h3><p class="mt-3 max-w-2xl text-sm leading-7 text-app-text-soft">' + escapeHtml(workflow.outcome) + '</p></div><div class="flex flex-wrap justify-end gap-2"><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-accent/40 hover:text-app-accent-strong" data-action="edit" data-workflow-id="' + escapeHtml(workflow.id) + '" type="button">Edit</button><button class="rounded-full border border-app-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-app-text transition hover:border-app-rust/45 hover:text-app-rust" data-action="delete" data-workflow-id="' + escapeHtml(workflow.id) + '" type="button">Delete</button></div></div><ul class="mt-4 flex flex-wrap gap-2">' + agentPills + '</ul><ol class="mt-5 grid gap-3">' + timeGroups + '</ol></article>';
      })
      .join("");
  }

  function renderPlayback() {
    if (
      !(refs.playbackWorkflow instanceof HTMLSelectElement) ||
      !(refs.playbackStage instanceof HTMLElement) ||
      !(refs.workflowGraphStage instanceof HTMLElement) ||
      !(refs.playbackStepCounter instanceof HTMLElement) ||
      !(refs.playbackPrev instanceof HTMLButtonElement) ||
      !(refs.playbackNext instanceof HTMLButtonElement) ||
      !(refs.playbackAuto instanceof HTMLButtonElement)
    ) {
      return;
    }

    if (state.workflows.length === 0) {
      stopPlaybackAnimation();
      refs.playbackWorkflow.disabled = true;
      refs.playbackWorkflow.innerHTML = '<option value="">No workflows yet</option>';
      refs.playbackStepCounter.textContent = "No time slots";
      refs.playbackPrev.disabled = true;
      refs.playbackNext.disabled = true;
      refs.playbackAuto.disabled = true;
      refs.playbackAuto.textContent = "Play animation";
      refs.playbackStage.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Create a workflow with at least one time slot to see the handoff playback.</div>';
      refs.workflowGraphStage.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Create a workflow with at least one time slot to see the experimental DAG graph.</div>';
      return;
    }

    refs.playbackWorkflow.disabled = false;
    refs.playbackWorkflow.innerHTML = state.workflows
      .map((workflow) => '<option value="' + escapeHtml(workflow.id) + '">' + escapeHtml(workflow.name) + "</option>")
      .join("");

    const activeWorkflow = state.workflows.find((workflow) => workflow.id === playback.workflowId) || state.workflows[0];
    const groups = groupTimeSteps(activeWorkflow.timeSteps);
    playback.workflowId = activeWorkflow.id;
    refs.playbackWorkflow.value = activeWorkflow.id;
    playback.groupIndex = Math.min(playback.groupIndex, Math.max(groups.length - 1, 0));

    const group = groups[playback.groupIndex];
    if (!group) {
      stopPlaybackAnimation();
      refs.playbackStepCounter.textContent = "No time slots";
      refs.playbackPrev.disabled = true;
      refs.playbackNext.disabled = true;
      refs.playbackAuto.disabled = true;
      refs.playbackAuto.textContent = "Play animation";
      refs.playbackStage.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Add an action to the selected workflow to see its handoff.</div>';
      refs.workflowGraphStage.innerHTML = '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Add an action to the selected workflow to see the experimental DAG graph.</div>';
      return;
    }

    if (groups.length <= 1) {
      stopPlaybackAnimation();
    }

    const nextGroup = groups[playback.groupIndex + 1];
    const activeCards = group.steps
      .map((timeStep) => '<article class="rounded-[0.9rem] border border-app-line/70 bg-white p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + escapeHtml(resolveAgentName(timeStep.agentId)) + '</p><p class="mt-2 text-sm leading-7 text-app-text-soft">' + escapeHtml(timeStep.work) + '</p></article>')
      .join("");
    const handoffCards = group.steps
      .map((timeStep) => '<article class="rounded-[0.9rem] border border-app-line/70 bg-white px-4 py-3 text-sm leading-6 text-app-text-soft"><p class="font-semibold text-app-text">' + escapeHtml(resolveAgentName(timeStep.agentId)) + '</p><p class="mt-2">' + escapeHtml(timeStep.handoff) + '</p></article>')
      .join("");

    refs.playbackStepCounter.textContent = 'T' + group.time + ' of ' + groups.length;
    refs.playbackPrev.disabled = playback.groupIndex === 0;
    refs.playbackNext.disabled = playback.groupIndex === groups.length - 1;
    refs.playbackAuto.disabled = groups.length <= 1;
    refs.playbackAuto.textContent = playback.isAutoPlaying ? "Pause animation" : "Play animation";
    refs.playbackStage.innerHTML = '<div class="grid gap-4"><article class="rounded-[1rem] border border-app-line/75 bg-white p-5"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-rust">Active at T' + group.time + '</p><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + (group.steps.length > 1 ? group.steps.length + ' agents are working in parallel at this time.' : 'One agent is active in this slot.') + '</p></div><div class="mt-4 grid gap-3 md:grid-cols-2">' + activeCards + '</div></article><article class="rounded-[1rem] border border-app-line/75 bg-app-ink p-5 text-app-ink-contrast"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Handoff packets</p><div class="mt-4 grid gap-3">' + handoffCards + '</div><p class="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + (nextGroup ? 'Next slot: T' + nextGroup.time : 'Workflow outcome') + '</p><p class="mt-2 text-lg font-semibold tracking-[-0.02em]">' + (nextGroup ? nextGroup.steps.length + ' agent' + (nextGroup.steps.length === 1 ? '' : 's') + ' continue at T' + nextGroup.time : escapeHtml(activeWorkflow.outcome)) + '</p></article></div>';
    refs.workflowGraphStage.innerHTML = renderWorkflowGraphStage(activeWorkflow, playback.groupIndex);
  }

  function renderWorkflowGraphStage(workflow, groupIndex) {
    const groups = groupTimeSteps(workflow.timeSteps);
    const activeGroup = groups[groupIndex];
    if (!activeGroup) {
      return '<div class="rounded-[1rem] border border-dashed border-app-line/80 bg-white p-5 text-sm leading-7 text-app-text-soft">Add an action to the selected workflow to see the experimental DAG graph.</div>';
    }

    const layout = createWorkflowGraphLayout(groups);
    const nextGroup = groups[groupIndex + 1];
    const columnGuides = layout.columns
      .map((column) => '<g><rect fill="rgb(47 111 237 / 0.05)" height="' + (layout.height - 16) + '" rx="28" width="' + (layout.nodeWidth + 28) + '" x="' + (column.x - 14) + '" y="8"></rect><text fill="#52607a" font-size="12" font-weight="700" letter-spacing="0.18em" text-anchor="middle" x="' + (column.x + layout.nodeWidth / 2) + '" y="30">T' + column.time + '</text></g>')
      .join("");
    const edges = groups
      .slice(0, -1)
      .flatMap((group, currentIndex) => {
        const sourceNodes = layout.nodesByGroup[currentIndex] || [];
        const targetNodes = layout.nodesByGroup[currentIndex + 1] || [];
        return sourceNodes.flatMap((sourceNode) =>
          targetNodes.map((targetNode) => {
            const path = buildGraphEdgePath(sourceNode, targetNode, layout.nodeWidth);
            const isActive = currentIndex === groupIndex;
            const stroke = isActive ? "#2f6fed" : "rgb(22 32 51 / 0.14)";
            return '<g><path d="' + path + '" fill="none" stroke="' + stroke + '" stroke-dasharray="' + (isActive ? "8 10" : "0") + '" stroke-linecap="round" stroke-width="' + (isActive ? 3 : 2) + '">' + (isActive ? '<animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.9s" repeatCount="indefinite"></animate>' : "") + '<title>' + escapeHtml(sourceNode.step.handoff) + '</title></path>' + (isActive ? '<circle cx="0" cy="0" fill="#7fb2ff" r="5"><animateMotion dur="1.9s" path="' + path + '" repeatCount="indefinite"></animateMotion></circle>' : "") + "</g>";
          }),
        );
      })
      .join("");
    const nodes = layout.nodes
      .map((node) => {
        const stateClass = node.groupIndex === groupIndex ? "border-app-accent/40 bg-app-sand shadow-panel ring-2 ring-app-accent/20" : node.groupIndex < groupIndex ? "border-app-line/70 bg-white/90" : "border-app-line/70 bg-white/75";
        const stateLabel = node.groupIndex === groupIndex ? "Active packet" : node.groupIndex < groupIndex ? "Earlier slot" : "Upcoming slot";
        return '<button aria-label="Focus T' + node.time + ": " + escapeHtml(resolveAgentName(node.step.agentId)) + '" aria-pressed="' + (node.groupIndex === groupIndex) + '" class="absolute flex flex-col overflow-hidden rounded-[1rem] border p-4 text-left transition hover:-translate-y-0.5 hover:border-app-accent/35 ' + stateClass + '" data-graph-group-index="' + node.groupIndex + '" style="height:' + layout.nodeHeight + "px;left:" + node.x + "px;top:" + node.y + "px;width:" + layout.nodeWidth + 'px" title="' + escapeHtml(node.step.work) + '" type="button"><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-rust">T' + node.time + " · " + stateLabel + '</p><p class="mt-2 text-sm leading-5 font-semibold text-app-text">' + escapeHtml(resolveAgentName(node.step.agentId)) + '</p><p class="mt-2 overflow-hidden text-[13px] leading-5 text-app-text-soft" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;">' + escapeHtml(node.step.work) + "</p></button>";
      })
      .join("");

    return '<div class="grid gap-4"><div class="rounded-[1.25rem] border border-app-line/80 bg-white/80 p-4"><div class="flex flex-wrap items-center justify-between gap-3"><p class="text-sm font-semibold text-app-text">Graph view for ' + escapeHtml(workflow.name) + '</p><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">' + (activeGroup.steps.length > 1 ? activeGroup.steps.length + " active branches at T" + activeGroup.time : "Single active branch at T" + activeGroup.time) + '</p></div><div class="mt-4 overflow-x-auto pb-2"><div class="relative" style="height:' + layout.height + "px;width:" + layout.width + 'px"><svg aria-hidden="true" class="absolute inset-0 h-full w-full" viewBox="0 0 ' + layout.width + " " + layout.height + '">' + columnGuides + edges + "</svg>" + nodes + '</div></div></div><div class="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"><article class="rounded-[1rem] border border-app-line/75 bg-white p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Active data packet</p><p class="mt-2 text-lg font-semibold tracking-[-0.03em] text-app-text">' + (nextGroup ? "Packets leave T" + activeGroup.time + " and head to T" + nextGroup.time : "T" + activeGroup.time + " delivers the final result") + '</p><p class="mt-2 text-sm leading-7 text-app-text-soft">' + activeGroup.steps.map((step) => escapeHtml(step.handoff)).join(" ") + '</p></article><article class="rounded-[1rem] border border-app-line/75 bg-app-ink p-4 text-app-ink-contrast"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-app-accent">Why this spike matters</p><p class="mt-2 text-sm leading-7">' + (nextGroup ? "The DAG makes dependencies visible: every active branch at T" + activeGroup.time + " feeds the next slot at T" + nextGroup.time + "." : escapeHtml(workflow.outcome)) + "</p></article></div></div>";
  }

  function createWorkflowGraphLayout(groups) {
    const nodeWidth = 190;
    const nodeHeight = 148;
    const columnGap = 234;
    const rowGap = 28;
    const paddingX = 28;
    const paddingY = 32;
    const maxRows = Math.max(...groups.map((group) => group.steps.length), 1);
    const contentHeight = maxRows * nodeHeight + Math.max(maxRows - 1, 0) * rowGap;
    const width = Math.max(paddingX * 2 + nodeWidth + Math.max(groups.length - 1, 0) * columnGap, 640);
    const height = paddingY * 2 + contentHeight;
    const columns = groups.map((group, groupIndex) => ({ time: group.time, x: paddingX + groupIndex * columnGap }));
    const nodesByGroup = groups.map((group, groupIndex) => {
      const totalHeight = group.steps.length * nodeHeight + Math.max(group.steps.length - 1, 0) * rowGap;
      const startY = paddingY + (contentHeight - totalHeight) / 2;
      return group.steps.map((step, stepIndex) => ({
        step,
        time: group.time,
        groupIndex,
        x: paddingX + groupIndex * columnGap,
        y: startY + stepIndex * (nodeHeight + rowGap),
      }));
    });

    return {
      width,
      height,
      nodeWidth,
      nodeHeight,
      columns,
      nodesByGroup,
      nodes: nodesByGroup.flat(),
    };
  }

  function buildGraphEdgePath(sourceNode, targetNode, nodeWidth) {
    const startX = sourceNode.x + nodeWidth;
    const startY = sourceNode.y + 66;
    const endX = targetNode.x;
    const endY = targetNode.y + 66;
    const controlOffset = Math.max((endX - startX) * 0.45, 44);
    return "M " + startX + " " + startY + " C " + (startX + controlOffset) + " " + startY + ", " + (endX - controlOffset) + " " + endY + ", " + endX + " " + endY;
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
    draftTimeSteps = sortTimeSteps(cloneTimeSteps(workflow.timeSteps));
    playback.workflowId = workflow.id;
    playback.groupIndex = 0;
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
    refs.workflowTimeStepTime.value = String(timeStep.time);
    refs.workflowTimeStepWork.value = timeStep.work;
    refs.workflowTimeStepHandoff.value = timeStep.handoff;
    renderTimeStepAgentOptions(new Set(getSelectedAgentIds()));
    refs.workflowTimeStepAgent.value = timeStep.agentId;
    refs.timeStepSubmit.textContent = "Update agent action";
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
    if (refs.workflowTimeStepTime instanceof HTMLInputElement) {
      refs.workflowTimeStepTime.value = String(nextTimeSlot(draftTimeSteps));
    }
    refs.timeStepSubmit.textContent = "Add agent action";
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
                timeSteps: sortTimeSteps(timeSteps),
              };
            })
            .filter((workflow) => workflow.name && workflow.outcome && workflow.agentIds.length > 0 && workflow.timeSteps.length > 0)
        : [],
    };
  }

  function normalizeTimeSteps(workflow) {
    if (Array.isArray(workflow?.timeSteps)) {
      return workflow.timeSteps
        .map((timeStep, index) => ({
          id: normalizeText(timeStep.id) || createId("time-step"),
          time: Number.isInteger(timeStep.time) && timeStep.time > 0 ? timeStep.time : index + 1,
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
            time: index + 1,
            agentId,
            work: normalizeText(step),
            handoff: index < steps.length - 1 ? "Pass the work to the next time slot." : "Deliver the completed workflow outcome.",
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

  function sortTimeSteps(timeSteps) {
    return [...timeSteps].sort((left, right) => left.time - right.time);
  }

  function groupTimeSteps(timeSteps) {
    const groups = new Map();
    for (const timeStep of sortTimeSteps(timeSteps)) {
      const current = groups.get(timeStep.time) || [];
      current.push(timeStep);
      groups.set(timeStep.time, current);
    }

    return Array.from(groups.entries())
      .sort(([left], [right]) => left - right)
      .map(([time, steps]) => ({ time, steps }));
  }

  function nextTimeSlot(timeSteps) {
    if (timeSteps.length === 0) {
      return 1;
    }

    return Math.max(...timeSteps.map((timeStep) => timeStep.time)) + 1;
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
