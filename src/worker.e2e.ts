import { expect, test } from "@playwright/test";

test("renders the agent workflow studio", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Agent Workflow Studio" })).toBeVisible();
  await expect(page.getByText("Learning stages")).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { level: 2, name: "Study bundled workflows before building" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Prepare a seminar briefing" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inspect Flow" })).toBeVisible();
});

test("shows bundled workflow examples with parallel time slots", async ({ page }) => {
  await page.goto("/");
  const playbackStage = page.locator("#playback-stage");
  const graphStage = page.locator("#workflow-graph-stage");

  await page.getByRole("button", { name: "Inspect Flow" }).click();
  await page.getByLabel("Workflow to inspect").selectOption({ label: "Prepare a seminar briefing" });
  await expect(page.getByText("T1 of 4")).toBeVisible();
  await expect(graphStage.getByText("Graph view for Prepare a seminar briefing")).toBeVisible();
  await page.getByRole("button", { name: "Focus T2: Source Checker" }).click();
  await expect(page.getByText("T2 of 4")).toBeVisible();
  await expect(playbackStage.getByText("2 agents are working in parallel at this time.")).toBeVisible();
  await expect(graphStage.getByText("Packets leave T2 and head to T3")).toBeVisible();
  await expect(playbackStage.getByText("Gather concepts, examples, and candidate references for each section.")).toBeVisible();
  await expect(playbackStage.getByText("Verify the strongest references and flag any weak or missing citations.")).toBeVisible();
});

test("creates time-stepped workflows that survive reloads", async ({ page }) => {
  await page.goto("/");
  const playbackStage = page.locator("#playback-stage");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await page.getByRole("button", { name: "Define Agents" }).click();
  await page.getByLabel("Agent name").fill("Summarizer");
  await page.getByLabel("Main job").fill("Condenses long source material into short study notes.");
  await page.getByLabel("Input").first().fill("Lecture slides and reading notes.");
  await page.getByLabel("Output").fill("Bullet summaries and key takeaways.");
  await page.getByRole("button", { name: "Save agent" }).click();

  await expect(page.getByRole("heading", { level: 3, name: "Summarizer" })).toBeVisible();

  await page.getByRole("button", { name: "Build Workflow" }).click();
  await page.getByLabel("Workflow name").fill("Revise for an exam");
  await page.getByLabel("Desired outcome").fill("A compact revision pack for the final week.");
  await page.getByRole("checkbox", { name: /Summarizer/ }).check();
  await page.getByRole("checkbox", { name: /Reviewer/ }).check();
  await page.getByRole("spinbutton", { name: "Time slot" }).fill("1");
  await page.getByLabel("Acting agent").selectOption({ label: "Summarizer" });
  await page.getByRole("textbox", { name: "Work at this time slot" }).fill("Turn lecture slides into a short set of study notes.");
  await page.getByLabel("What gets handed forward").fill("Pass the notes draft to Reviewer.");
  await page.getByRole("button", { name: "Add agent action" }).click();
  await page.getByRole("spinbutton", { name: "Time slot" }).fill("2");
  await page.getByLabel("Acting agent").selectOption({ label: "Reviewer" });
  await page.getByRole("textbox", { name: "Work at this time slot" }).fill("Check whether the notes are complete and easy to scan.");
  await page.getByLabel("What gets handed forward").fill("Return the corrected study guide as the final outcome.");
  await page.getByRole("button", { name: "Add agent action" }).click();
  await page.getByRole("button", { name: "Save workflow" }).click();

  await expect(page.getByRole("button", { name: "Inspect Flow" })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Workflow to inspect").selectOption({ label: "Revise for an exam" });
  await expect(page.getByText("T1 of 2")).toBeVisible();
  await expect(playbackStage.getByText("Pass the notes draft to Reviewer.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next slot" }).click();
  await expect(page.getByText("T2 of 2")).toBeVisible();
  await expect(playbackStage.getByText("Return the corrected study guide as the final outcome.", { exact: true })).toBeVisible();
  await page.reload();

  await page.getByRole("button", { name: "Define Agents" }).click();
  await expect(page.getByRole("heading", { level: 3, name: "Summarizer" })).toBeVisible();
  await page.getByRole("button", { name: "Inspect Flow" }).click();
  await page.getByLabel("Workflow to inspect").selectOption({ label: "Revise for an exam" });
  await expect(page.getByText("T1 of 2")).toBeVisible();
  await expect(page.getByLabel("Workspace JSON")).toHaveValue(/timeSteps/);
  await expect(page.getByLabel("Workspace JSON")).toHaveValue(/Pass the notes draft to Reviewer/);
});

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    name: "vibe-template-worker",
    routes: ["/", "/api/health"],
  });
});

test("serves the generated stylesheet", async ({ request }) => {
  const response = await request.get("/styles.css");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/css");
  await expect(response.text()).resolves.toContain("--color-app-canvas:#f3f6fb");
});
