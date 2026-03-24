import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer, { type Page } from "puppeteer";

import { startDirectiveFrontendServer } from "../hosts/web-host/server.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIRECTIVE_ROOT = path.resolve(SCRIPT_DIR, "..");

function writeUtf8(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function writeJson(filePath: string, value: unknown) {
  writeUtf8(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sampleRunRecord() {
  return {
    runId: "sample-engine-run",
    receivedAt: "2026-03-24T00:00:00.000Z",
    source: {
      sourceType: "repository",
      sourceRef: "https://example.com/source",
      title: "Sample source",
    },
    routingAssessment: {
      matchedGapId: "gap-directive-engine-materialization",
    },
    selectedLane: {
      laneId: "architecture",
      label: "Architecture",
      hostDependence: "host_optional",
      valuableWithoutHostRuntime: true,
    },
    candidate: {
      candidateId: "sample-engine-run-candidate",
      candidateName: "Sample engine run candidate",
      recommendedLaneId: "architecture",
      usefulnessLevel: "meta",
      confidence: "high",
      requiresHumanReview: true,
      rationale: ["Architecture improvement pressure detected."],
    },
    analysis: {
      missionFitSummary: "Fits the current engine-improvement mission.",
      primaryAdoptionQuestion: "Does this improve Directive Workspace itself?",
      usefulnessRationale: "Meta-usefulness from shared Engine judgment.",
      rationale: ["Mission pressure aligns with engine materialization."],
    },
    extractionPlan: {
      extractedValue: ["Planner-research-publish mechanism"],
    },
    decision: {
      decisionState: "accept_for_architecture",
      summary: "Accept for Architecture.",
      requiresHumanApproval: true,
      rationale: ["Architecture is the primary adoption target."],
    },
    integrationProposal: {
      targetLaneId: "architecture",
      integrationMode: "adapt",
      hostDependence: "host_optional",
      valuableWithoutHostRuntime: true,
      nextAction: "Open a bounded Architecture experiment.",
    },
    proofPlan: {
      proofKind: "architecture_validation",
      objective: "Validate a bounded Engine adaptation.",
    },
    reportPlan: {
      reportKind: "engine_run",
      summary: "Sample Engine run report summary.",
      usefulnessRationale: "Meta-usefulness from shared Engine judgment.",
    },
    events: [
      {
        type: "source_analyzed",
        at: "2026-03-24T00:00:00.000Z",
        summary: "Sample analysis complete.",
      },
    ],
  };
}

function buildFrontend() {
  execSync("npm run frontend:build", {
    cwd: DIRECTIVE_ROOT,
    stdio: "inherit",
  });
}

async function waitForBodyText(page: Page, text: string, timeout = 20000) {
  try {
    await page.waitForFunction(
      (expected) => {
        const app = document.querySelector("directive-frontend-app");
        const rendered = app?.shadowRoot?.textContent || document.body.textContent || "";
        return rendered.includes(expected);
      },
      { timeout },
      text,
    );
  } catch (error) {
    const rendered = await page.evaluate(() => {
      const app = document.querySelector("directive-frontend-app");
      return app?.shadowRoot?.textContent || document.body.textContent || "";
    });
    throw new Error(`wait_for_text_failed:${text}\n${String((error as Error).message || error)}\nrendered_excerpt=${rendered.slice(0, 2000)}`);
  }
}

async function assertNoRuntimeIssues(page: Page) {
  const issues = await page.evaluate(() => {
    const app = document.querySelector("directive-frontend-app");
    return {
      text: app?.shadowRoot?.textContent || document.body.textContent || "",
    };
  });
  assert.doesNotMatch(issues.text, /Frontend error/i);
  assert.doesNotMatch(issues.text, /Loading Reading live Directive Workspace state\./i);
}

async function submitThroughShadowForm(page: Page, input: {
  candidateName: string;
  candidateId: string;
  sourceReference: string;
  missionAlignment: string;
}) {
  await page.evaluate((payload) => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");

    const candidateNameField = root.querySelector<HTMLInputElement>('input[name="candidate_name"]');
    if (!candidateNameField) throw new Error("missing_field:candidate_name");
    candidateNameField.value = payload.candidateName;
    candidateNameField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    candidateNameField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const candidateIdField = root.querySelector<HTMLInputElement>('input[name="candidate_id"]');
    if (!candidateIdField) throw new Error("missing_field:candidate_id");
    candidateIdField.value = payload.candidateId;
    candidateIdField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    candidateIdField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const sourceReferenceField = root.querySelector<HTMLInputElement>('input[name="source_reference"]');
    if (!sourceReferenceField) throw new Error("missing_field:source_reference");
    sourceReferenceField.value = payload.sourceReference;
    sourceReferenceField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    sourceReferenceField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const missionAlignmentField = root.querySelector<HTMLTextAreaElement>('textarea[name="mission_alignment"]');
    if (!missionAlignmentField) throw new Error("missing_field:mission_alignment");
    missionAlignmentField.value = payload.missionAlignment;
    missionAlignmentField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    missionAlignmentField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const submitButton = root.querySelector<HTMLButtonElement>('button[type="submit"], button');
    if (!submitButton) throw new Error("missing_submit_button");
    submitButton.click();
  }, input);
}

async function clickShadowButtonByText(page: Page, label: string) {
  await page.evaluate((expected) => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");
    const buttons = Array.from(root.querySelectorAll("button"));
    let button: HTMLButtonElement | null = null;
    for (const entry of buttons) {
      const text = entry.textContent || "";
      if (text.trim().includes(expected)) {
        button = entry as HTMLButtonElement;
        break;
      }
    }
    if (!button) throw new Error(`missing_button:${expected}`);
    button.click();
  }, label);
}

async function submitArchitectureCloseout(page: Page, input: {
  resultSummary: string;
}) {
  await page.evaluate((payload) => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");

    const resultSummaryField = root.querySelector<HTMLTextAreaElement>('textarea[name="result_summary"]');
    if (!resultSummaryField) throw new Error("missing_field:result_summary");
    resultSummaryField.value = payload.resultSummary;
    resultSummaryField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    resultSummaryField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const submitButton = Array.from(root.querySelectorAll("button")).find((button) =>
      (button.textContent || "").includes("Record bounded closeout"));
    if (!submitButton) throw new Error("missing_button:Record bounded closeout");
    (submitButton as HTMLButtonElement).click();
  }, input);
}

async function main() {
  buildFrontend();

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dw-frontend-host-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
  const handoffRelativePath =
    "architecture/02-experiments/2026-03-24-sample-engine-handoff.md";
  const handoffAbsolutePath = path.join(directiveRoot, handoffRelativePath);
  const runRecordPath = path.join(
    directiveRoot,
    "runtime",
    "standalone-host",
    "engine-runs",
    "2026-03-24T00-00-00-000Z-sample-engine-run-candidate-sample-e.json",
  );
  const runReportPath = runRecordPath.replace(/\.json$/i, ".md");

  writeJson(queuePath, {
    status: "primary",
    updatedAt: "2026-03-24",
    policy: {
      schemaRef: "shared/schemas/discovery-intake-queue-entry.schema.json",
    },
    entries: [
      {
        candidate_id: "sample-engine-run-candidate",
        candidate_name: "Sample engine run candidate",
        source_type: "repository",
        source_reference: "https://example.com/source",
        received_at: "2026-03-24",
        status: "routed",
        routing_target: "architecture",
        mission_alignment: "Improve the Directive Workspace engine.",
        capability_gap_id: "gap-directive-engine-materialization",
        assigned_worker: null,
        intake_record_path: null,
        fast_path_record_path: "discovery/intake/2026-03-24-sample-fast-path.md",
        routed_at: "2026-03-24",
        completed_at: null,
        routing_record_path: "discovery/routing-log/2026-03-24-sample-routing.md",
        result_record_path: handoffRelativePath,
        notes: "Seeded for frontend check.",
      },
    ],
  });
  writeJson(runRecordPath, sampleRunRecord());
  writeUtf8(
    runReportPath,
    [
      "# Directive Engine Run",
      "",
      "- Run ID: `sample-engine-run`",
      "- Candidate Name: Sample engine run candidate",
      "",
      "## Usefulness Rationale",
      "",
      "Meta-usefulness from shared Engine judgment.",
      "",
    ].join("\n"),
  );
  writeUtf8(
    handoffAbsolutePath,
    [
      "# Sample Engine Handoff Engine-Routed Architecture Experiment",
      "",
      "Date: 2026-03-24",
      "Track: Architecture",
      "Type: engine-routed handoff",
      "Status: pending_review",
      "",
      "## Source",
      "",
      "- Candidate id: `sample-engine-run-candidate`",
      "- Source reference: `https://example.com/source`",
      "- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-sample-engine-run-candidate-sample-e.json`",
      "- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-sample-engine-run-candidate-sample-e.md`",
      "- Discovery routing record: `discovery/routing-log/2026-03-24-sample-routing.md`",
      "- Usefulness level: `meta`",
      "- Usefulness rationale: Meta-usefulness from shared Engine judgment.",
      "",
      "## Objective",
      "",
      "Open one bounded Architecture experiment.",
      "",
      "## Bounded scope",
      "",
      "- Keep this to one experiment.",
      "- Preserve human review.",
      "",
      "## Inputs",
      "",
      "- extracted mechanism one",
      "",
      "## Validation gate(s)",
      "",
      "- `decision_review`",
      "",
      "## Lifecycle classification",
      "",
      "- Origin: `source-driven`",
      "- Usefulness level: `meta`",
      "- Forge threshold check: Would this mechanism still be valuable without a runtime surface? `yes`",
      "",
      "## Rollback",
      "",
      "Leave the candidate at experiment status only.",
      "",
      "## Next decision",
      "",
      "- `needs-more-evidence`",
      "",
    ].join("\n"),
  );

  const handle = await startDirectiveFrontendServer({
    directiveRoot,
    host: "127.0.0.1",
    port: 0,
  });

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();

  const runtimeIssues: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      runtimeIssues.push(`[console] ${msg.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    runtimeIssues.push(`[pageerror] ${error.stack || error.message}`);
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    const errorText = failure?.errorText || "request failed";
    if (errorText.includes("ERR_ABORTED")) return;
    runtimeIssues.push(`[requestfailed] ${request.method()} ${request.url()} :: ${errorText}`);
  });

  try {
    await page.goto(`${handle.origin}/`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Directive Workspace Frontend");
    await waitForBodyText(page, "Standalone frontend scope");

    await page.goto(`${handle.origin}/submit`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Source submission");
    await submitThroughShadowForm(page, {
      candidateName: "Frontend Submit Check",
      candidateId: "frontend-submit-check",
      sourceReference: "https://example.com/frontend-submit",
      missionAlignment: "Exercise the thin frontend Discovery front door.",
    });
    await waitForBodyText(page, "Submission result", 60000);
    await waitForBodyText(page, "Open Engine run detail", 60000);
    await waitForBodyText(page, "did not materialize a downstream handoff stub", 60000);

    await page.goto(`${handle.origin}/engine-runs`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "sample-engine-run");

    await page.goto(`${handle.origin}/engine-runs/sample-engine-run`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Sample engine run candidate");
    await waitForBodyText(page, "Meta-usefulness from shared Engine judgment.");

    await page.goto(`${handle.origin}/queue`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Discovery queue");
    await waitForBodyText(page, "Sample engine run candidate");

    await page.goto(
      `${handle.origin}/handoffs/view?path=${encodeURIComponent(handoffRelativePath)}`,
      { waitUntil: "networkidle0", timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture handoff detail");
    await waitForBodyText(page, "Open one bounded Architecture experiment.");
    await clickShadowButtonByText(page, "Approve bounded start");
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-starts/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture bounded start");
    await waitForBodyText(page, "Open one bounded Architecture experiment.");
    await submitArchitectureCloseout(page, {
      resultSummary:
        "Bounded Architecture slice clarified the next engine-owned adaptation target and should stay experimental until the product-owned implementation artifact is materialized.",
    });
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-results/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture bounded result");
    await waitForBodyText(page, "stay_experimental");
    await assertNoRuntimeIssues(page);

    assert.equal(runtimeIssues.length, 0, runtimeIssues.join("\n"));

    const queueAfter = JSON.parse(fs.readFileSync(queuePath, "utf8")) as {
      entries: Array<{ candidate_id: string }>;
    };
    assert.equal(
      queueAfter.entries.some((entry) => entry.candidate_id === "frontend-submit-check"),
      true,
    );

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          metrics: {
            origin: handle.origin,
            seededRunId: "sample-engine-run",
            submittedCandidateId: "frontend-submit-check",
          },
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    await browser.close();
    await handle.close();
  }
}

void main();
