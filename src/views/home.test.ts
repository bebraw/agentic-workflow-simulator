import { describe, expect, it } from "vitest";
import { exampleRoutes } from "../app-routes";
import {
  countTimeSlots,
  countTimeSteps,
  renderEmptyPlaybackStage,
  renderHomePage,
  renderPlaybackStage,
  renderPlaybackWorkflowOptions,
  resolveAgentName,
} from "./home";

describe("renderHomePage", () => {
  it("renders the localStorage-backed studio shell, bundled examples, and stylesheet wiring", () => {
    const html = renderHomePage(exampleRoutes);

    expect(html).toContain("Agent Workflow Studio");
    expect(html).toContain("localStorage");
    expect(html).toContain("Prepare a seminar briefing");
    expect(html).toContain("Source Checker");
    expect(html).toContain("parallel");
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
  });

  it("renders playback helpers for empty, sequential, and parallel states", () => {
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
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("2 agents are working in parallel at this time.");
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("Researcher");
    expect(renderPlaybackStage(workflow, agents, 1)).toContain("Finished packet");
    expect(renderPlaybackWorkflowOptions([workflow, { ...workflow, id: "workflow-2", name: "Second workflow" }])).toContain(
      'option value="workflow-1" selected',
    );
    expect(resolveAgentName(agents, "missing-agent")).toBe("Missing agent");
    expect(countTimeSteps([workflow])).toBe(3);
    expect(countTimeSlots(workflow)).toBe(2);
  });
});
