import { describe, expect, it } from "vitest";
import { exampleRoutes } from "../app-routes";
import { renderHomePage } from "./home";

describe("renderHomePage", () => {
  it("renders the localStorage-backed studio shell and stylesheet wiring", () => {
    const html = renderHomePage(exampleRoutes);

    expect(html).toContain("Agent Workflow Studio");
    expect(html).toContain("localStorage");
    expect(html).toContain("Planner");
    expect(html).toContain('rel="stylesheet" href="/styles.css"');
  });
});
