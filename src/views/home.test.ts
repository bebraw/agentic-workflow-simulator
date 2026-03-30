import { describe, expect, it } from "vitest";
import { exampleRoutes } from "../app-routes";
import {
  countTimeSteps,
  renderEmptyPlaybackStage,
  renderHomePage,
  renderPlaybackStage,
  renderPlaybackWorkflowOptions,
  resolveAgentName,
} from "./home";

describe("renderHomePage", () => {
  it("renders the localStorage-backed studio shell, time steps, and stylesheet wiring", () => {
    const html = renderHomePage(exampleRoutes);

    expect(html).toContain("Agent Workflow Studio");
    expect(html).toContain("localStorage");
    expect(html).toContain("Planner");
    expect(html).toContain("Time-step playback");
    expect(html).toContain("T1");
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
  });

  it("renders playback helpers for empty, selected, and completed states", () => {
    const agents = [
      {
        id: "agent-1",
        name: "Planner",
        responsibility: "Plans",
        inputs: "Goal",
        outputs: "Plan",
      },
    ];
    const workflow = {
      id: "workflow-1",
      name: "Single pass",
      outcome: "Finished packet",
      agentIds: ["agent-1"],
      timeSteps: [
        {
          id: "time-step-1",
          agentId: "agent-1",
          work: "Draft the outline.",
          handoff: "Send the completed outline forward.",
        },
      ],
    };

    expect(renderEmptyPlaybackStage()).toContain("Create a workflow with at least one time step");
    expect(renderPlaybackStage(workflow, agents, 0)).toContain("Workflow outcome");
    expect(renderPlaybackStage(workflow, agents, 0)).toContain("Finished packet");
    expect(renderPlaybackWorkflowOptions([workflow, { ...workflow, id: "workflow-2", name: "Second workflow" }])).toContain(
      'option value="workflow-1" selected',
    );
    expect(resolveAgentName(agents, "missing-agent")).toBe("Missing agent");
    expect(countTimeSteps([workflow])).toBe(1);
  });
});
