import { describe, expect, it } from "vitest";
import {
  countTimeSlots,
  countTimeSteps,
  renderEmptyPlaybackStage,
  renderEmptySimulationStage,
  renderEmptyWorkflowGraph,
  renderWorkflowGraph,
  renderHomePage,
  renderPlaybackStage,
  renderPlaybackWorkflowOptions,
  renderSimulationStage,
  resolveAgentName,
} from "./home";

describe("renderHomePage", () => {
  it("renders the localStorage-backed studio shell, bundled examples, and stylesheet wiring", () => {
    const html = renderHomePage();

    expect(html).toContain("Agent Workflow Studio");
    expect(html).toContain("localStorage");
    expect(html).toContain("Learning stages");
    expect(html).toContain("Explore");
    expect(html).toContain("Inspect Flow");
    expect(html).toContain("Prepare a seminar briefing");
    expect(html).toContain("Source Checker");
    expect(html).toContain("parallel");
    expect(html).toContain("Open help about bundled workflow examples");
    expect(html).toContain("Open help about learning guide");
    expect(html).toContain("Two agents can work at the same time, but they still need a shared time slot");
    expect(html).toContain("Count the T1, T2, T3 columns separately from the number of cards.");
    expect(html).toContain("Students should be able to say exactly what packet moves forward and who needs it next.");
    expect(html).not.toContain("Open help about parallel coordination");
    expect(html).not.toContain("Open help about time slots");
    expect(html).not.toContain("Open help about workflow handoffs");
    expect(html).toContain("Open help about agent builder");
    expect(html).toContain("Open help about workflow actions");
    expect(html).toContain("Choose at least one workflow agent above before adding actions.");
    expect(html).toContain("Seed packet");
    expect(html).toContain("Open help about workflow playback");
    expect(html).toContain("Open help about seed packet");
    expect(html).toContain('data-stage-panel="inspect-flow" hidden');
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
  });

  it("renders the requested learning stage from the stage query parameter", () => {
    const html = renderHomePage("build-workflow");

    expect(html).toContain("Connect the agents over time");
    expect(html).toContain('data-stage-panel="build-workflow"');
    expect(html).not.toContain('data-stage-panel="build-workflow" hidden');
    expect(html).toContain('aria-label="Build Workflow" aria-pressed="true"');
    expect(html).toContain('data-stage-panel="explore" hidden');
  });

  it("renders playback and graph helpers for empty, sequential, and parallel states", () => {
    const agents = [
      {
        id: "agent-1",
        name: "Planner",
        responsibility: "Plans",
        inputs: "Goal",
        outputs: "Plan",
      },
      {
        id: "agent-2",
        name: "Researcher",
        responsibility: "Researches",
        inputs: "Plan",
        outputs: "Notes",
      },
    ];
    const workflow = {
      id: "workflow-1",
      name: "Parallel pass",
      outcome: "Finished packet",
      agentIds: ["agent-1", "agent-2"],
      timeSteps: [
        {
          id: "time-step-1",
          time: 1,
          agentId: "agent-1",
          work: "Draft the outline.",
          handoff: "Send the outline to two agents.",
        },
        {
          id: "time-step-2",
          time: 2,
          agentId: "agent-1",
          work: "Refine the structure.",
          handoff: "Pass the structure to review.",
        },
        {
          id: "time-step-3",
          time: 2,
          agentId: "agent-2",
          work: "Collect supporting notes.",
          handoff: "Pass the notes to review.",
        },
      ],
    };

    expect(renderEmptyPlaybackStage()).toContain("Create a workflow with at least one time slot");
    expect(renderEmptySimulationStage()).toContain("deterministic mock packets");
    expect(renderEmptyWorkflowGraph()).toContain("experimental DAG graph");
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("2 agents are working in parallel at this time.");
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("Researcher");
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("Finished packet");
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("Open help about handoff packets");
    expect(renderSimulationStage(workflow, agents, 0, "Student request: build a pack.")).toContain("Mock execution at T1");
    expect(renderSimulationStage(workflow, agents, 0, "Student request: build a pack.")).toContain("Packet arriving at T1");
    expect(renderSimulationStage(workflow, agents, 0, "Student request: build a pack.")).toContain("Open help about mock execution");
    expect(renderSimulationStage(workflow, agents, 1, "Student request: build a pack.")).toContain("Final packet:");
    expect(renderWorkflowGraph(workflow, agents, 1)).toContain("Graph view for Parallel pass");
    expect(renderWorkflowGraph(workflow, agents, 1)).toContain("Open help about workflow graph");
    expect(renderWorkflowGraph(workflow, agents, 1)).toContain("T2 delivers the final result");
    expect(renderWorkflowGraph(workflow, agents, 1)).toContain('data-graph-group-index="1"');
    expect(renderWorkflowGraph(workflow, agents, 1)).toContain('title="Collect supporting notes."');
    expect(renderWorkflowGraph(workflow, agents, 1)).toContain("-webkit-line-clamp:4");
    expect(renderWorkflowGraph(workflow, agents, 0)).toContain('<circle cx="0" cy="0" fill="#7fb2ff" r="5">');
    expect(renderPlaybackWorkflowOptions([workflow, { ...workflow, id: "workflow-2", name: "Second workflow" }])).toContain(
      'option value="workflow-1" selected',
    );
    expect(resolveAgentName(agents, "missing-agent")).toBe("Missing agent");
    expect(countTimeSteps([workflow])).toBe(3);
    expect(countTimeSlots(workflow)).toBe(2);
  });
});
