import { expect, test } from "@playwright/test";

test("renders the agent workflow studio", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Agent Workflow Studio" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Watch the handoff" })).toBeVisible();
  await expect(page.getByText("Everything saves to localStorage.")).toBeVisible();
  await expect(page.getByRole("link", { name: "/api/health" })).toBeVisible();
});

test("creates time-stepped workflows that survive reloads", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await page.getByLabel("Agent name").fill("Summarizer");
  await page.getByLabel("Main job").fill("Condenses long source material into short study notes.");
  await page.getByLabel("Input").first().fill("Lecture slides and reading notes.");
  await page.getByLabel("Output").fill("Bullet summaries and key takeaways.");
  await page.getByRole("button", { name: "Save agent" }).click();

  await expect(page.getByRole("heading", { level: 3, name: "Summarizer" })).toBeVisible();

  await page.getByLabel("Workflow name").fill("Revise for an exam");
  await page.getByLabel("Desired outcome").fill("A compact revision pack for the final week.");
  await page.getByRole("checkbox", { name: /Summarizer/ }).check();
  await page.getByRole("checkbox", { name: /Reviewer/ }).check();
  await page.getByLabel("Acting agent").selectOption({ label: "Summarizer" });
  await page.getByLabel("Work at this time step").fill("Turn lecture slides into a short set of study notes.");
  await page.getByLabel("What gets handed forward").fill("Pass the notes draft to Reviewer.");
  await page.getByRole("button", { name: "Add time step" }).click();
  await page.getByLabel("Acting agent").selectOption({ label: "Reviewer" });
  await page.getByLabel("Work at this time step").fill("Check whether the notes are complete and easy to scan.");
  await page.getByLabel("What gets handed forward").fill("Return the corrected study guide as the final outcome.");
  await page.getByRole("button", { name: "Add time step" }).click();
  await page.getByRole("button", { name: "Save workflow" }).click();

  await expect(page.getByRole("heading", { level: 3, name: "Revise for an exam" })).toBeVisible();
  await page.getByLabel("Workflow to inspect").selectOption({ label: "Revise for an exam" });
  await expect(page.getByText("T1 of 2")).toBeVisible();
  await expect(page.getByText("Pass the notes draft to Reviewer.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("T2 of 2")).toBeVisible();
  await expect(page.getByText("Return the corrected study guide as the final outcome.", { exact: true })).toBeVisible();
  await page.reload();

  await expect(page.getByRole("heading", { level: 3, name: "Summarizer" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Revise for an exam" })).toBeVisible();
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
