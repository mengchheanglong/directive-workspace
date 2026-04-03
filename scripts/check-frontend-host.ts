import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer, { type Page } from "puppeteer";

import { withDirectiveFrontendCheckServer } from "./frontend-check-helpers.ts";
import {
  readDirectiveFrontendSnapshot,
  readDirectiveWorkbenchHandoffDetail,
  readDirectiveWorkbenchSnapshot,
} from "../hosts/web-host/data.ts";
import { evaluateDirectiveArchitectureConsumption } from "../shared/lib/architecture-post-consumption-evaluation.ts";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIRECTIVE_ROOT = path.resolve(SCRIPT_DIR, "..");

function writeUtf8(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function writeJson(filePath: string, value: unknown) {
  writeUtf8(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sampleRunRecord(input: {
  runId?: string;
  candidateId?: string;
  candidateName?: string;
  sourceRef?: string;
  nextAction?: string;
} = {}) {
  return {
    runId: input.runId ?? "sample-engine-run",
    receivedAt: "2026-03-24T00:00:00.000Z",
    source: {
      sourceType: "github-repo",
      sourceRef: input.sourceRef ?? "https://example.com/source",
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
      candidateId: input.candidateId ?? "sample-engine-run-candidate",
      candidateName: input.candidateName ?? "Sample engine run candidate",
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
      extractedValue: ["Stage-aware structural pattern: planning -> analysis -> generation with explicit handoff boundaries."],
      excludedBaggage: ["host-local assumptions"],
    },
    adaptationPlan: {
      directiveOwnedForm:
        "Directive-owned Engine logic that preserves explicit planning -> analysis -> generation boundaries instead of collapsing them into one generic Architecture mechanism.",
      adaptedValue: [
        "Keep planning -> analysis -> generation as separate Engine-owned reasoning stages.",
      ],
    },
    improvementPlan: {
      improvementGoals: [
        "improve stage-aware engine analysis for structural sources",
      ],
      intendedDelta:
        "Turn multi-stage structural sources into explicit Engine-owned stage plans (planning -> analysis -> generation) so Architecture can preserve stage boundaries instead of flattening them into one generic adaptation step.",
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
      nextAction: input.nextAction ?? "Open a bounded Architecture experiment.",
    },
    proofPlan: {
      proofKind: "architecture_validation",
      objective: "Validate a bounded Engine adaptation.",
      requiredEvidence: ["adapted mechanism described"],
      requiredGates: ["decision_review"],
      rollbackPrompt: "Keep the candidate at handoff-only status until the route is approved safely.",
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

async function waitForPathname(page: Page, expectedPathname: string, timeout = 30000) {
  try {
    await page.waitForFunction(
      (expected) => window.location.pathname === expected,
      { timeout },
      expectedPathname,
    );
  } catch (error) {
    const snapshot = await page.evaluate(() => {
      const app = document.querySelector("directive-frontend-app");
      return {
        href: window.location.href,
        pathname: window.location.pathname,
        text: app?.shadowRoot?.textContent || document.body.textContent || "",
      };
    });
    throw new Error(
      `wait_for_pathname_failed:${expectedPathname}\n${String((error as Error).message || error)}\ncurrent_href=${snapshot.href}\ncurrent_pathname=${snapshot.pathname}\nrendered_excerpt=${snapshot.text.slice(0, 2000)}`,
    );
  }
}

async function submitThroughShadowForm(page: Page, input: {
  candidateName: string;
  candidateId: string;
  sourceType?: string;
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

    const sourceTypeField = root.querySelector<HTMLSelectElement>('select[name="source_type"]');
    if (!sourceTypeField) throw new Error("missing_field:source_type");
    sourceTypeField.value = payload.sourceType || "internal-signal";
    sourceTypeField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    sourceTypeField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

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

async function clickShadowLinkByText(page: Page, label: string) {
  await page.evaluate((expected) => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");
    const links = Array.from(root.querySelectorAll("a"));
    let link: HTMLAnchorElement | null = null;
    for (const entry of links) {
      const text = entry.textContent || "";
      if (text.trim().includes(expected)) {
        link = entry as HTMLAnchorElement;
        break;
      }
    }
    if (!link) throw new Error(`missing_link:${expected}`);
    link.click();
  }, label);
}

async function submitArchitectureCloseout(page: Page, input: {
  resultSummary: string;
  primaryEvidencePath?: string;
}) {
  await page.evaluate((payload) => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");

    const resultSummaryField = root.querySelector<HTMLTextAreaElement>('textarea[name="result_summary"]');
    if (!resultSummaryField) throw new Error("missing_field:result_summary");
    resultSummaryField.value = payload.resultSummary;
    resultSummaryField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    resultSummaryField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const primaryEvidencePathField = root.querySelector<HTMLInputElement>('input[name="primary_evidence_path"]');
    if (!primaryEvidencePathField) throw new Error("missing_field:primary_evidence_path");
    primaryEvidencePathField.value = payload.primaryEvidencePath || "";
    primaryEvidencePathField.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    primaryEvidencePathField.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    const submitButton = Array.from(root.querySelectorAll("button")).find((button) =>
      (button.textContent || "").includes("Record bounded closeout"));
    if (!submitButton) throw new Error("missing_button:Record bounded closeout");
    (submitButton as HTMLButtonElement).click();
  }, input);
}

async function submitImplementationResult(page: Page, input: {
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
      (button.textContent || "").includes("Complete Implementation"));
    if (!submitButton) throw new Error("missing_button:Complete Implementation");
    (submitButton as HTMLButtonElement).click();
  }, input);
}

async function submitRetentionConfirmation(page: Page) {
  await page.evaluate(() => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");

    const submitButton = Array.from(root.querySelectorAll("button")).find((button) =>
      (button.textContent || "").includes("Confirm Retention"));
    if (!submitButton) throw new Error("missing_button:Confirm Retention");
    (submitButton as HTMLButtonElement).click();
  });
}

async function submitIntegrationRecord(page: Page) {
  await page.evaluate(() => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");

    const submitButton = Array.from(root.querySelectorAll("button")).find((button) =>
      (button.textContent || "").includes("Create Integration Record"));
    if (!submitButton) throw new Error("missing_button:Create Integration Record");
    (submitButton as HTMLButtonElement).click();
  });
}

async function submitConsumptionRecord(page: Page) {
  await page.evaluate(() => {
    const root = document.querySelector("directive-frontend-app")?.shadowRoot;
    if (!root) throw new Error("missing_frontend_shadow_root");

    const submitButton = Array.from(root.querySelectorAll("button")).find((button) =>
      (button.textContent || "").includes("Record Consumption"));
    if (!submitButton) throw new Error("missing_button:Record Consumption");
    (submitButton as HTMLButtonElement).click();
  });
}

async function assertShadowTextDoesNotContain(page: Page, text: string) {
  const rendered = await page.evaluate(() => {
    const app = document.querySelector("directive-frontend-app");
    return app?.shadowRoot?.textContent || document.body.textContent || "";
  });
  assert.equal(rendered.includes(text), false, `unexpected_text_present:${text}`);
}

function assertLegacyRuntimeHandoffRepoDetails() {
  const scientify = readDirectiveWorkbenchHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: "runtime/handoff/2026-03-23-scientify-literature-monitoring-architecture-to-runtime-handoff.md",
  });
  assert.equal(scientify.ok, true, "Legacy Scientify Runtime handoff should be readable through the workbench handoff detail surface");
  if (!scientify.ok || scientify.kind !== "runtime_handoff_legacy") {
    throw new Error("legacy_scientify_runtime_handoff_unreadable");
  }
  assert.equal(scientify.candidateId, "scientify-literature-monitoring");
  assert.equal(
    scientify.runtimeFollowUpPath,
    "runtime/follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md",
  );
  assert.equal(
    scientify.originatingArchitectureRecordPath,
    "architecture/03-adopted/2026-03-23-scientify-mixed-value-partition-adopted.md",
  );

  const autoresearch = readDirectiveWorkbenchHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: "runtime/handoff/2026-03-22-autoresearch-architecture-to-runtime-handoff.md",
  });
  assert.equal(autoresearch.ok, true, "Legacy autoresearch Runtime handoff should be readable through the workbench handoff detail surface");
  if (!autoresearch.ok || autoresearch.kind !== "runtime_handoff_legacy") {
    throw new Error("legacy_autoresearch_runtime_handoff_unreadable");
  }
  assert.equal(autoresearch.candidateId, "autoresearch");
  assert.equal(
    autoresearch.originatingArchitectureRecordPath,
    "architecture/03-adopted/2026-03-19-autoresearch-slice-1-adopted-planned-next.md",
  );
  assert.equal(
    autoresearch.runtimeRecordPath,
    "runtime/records/2026-03-19-autoresearch-runtime-record.md",
  );
}

function assertLegacyRuntimeHandoffRepoStubs() {
  const snapshot = readDirectiveWorkbenchSnapshot({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const legacyHandoffs = snapshot.handoffStubs.filter((stub) => stub.kind === "runtime_handoff_legacy");
  assert.equal(
    legacyHandoffs.length,
    2,
    "The workbench handoff list should surface the two repo-backed historical Runtime handoffs as explicit read-only stubs.",
  );

  const scientify = legacyHandoffs.find((stub) =>
    stub.relativePath === "runtime/handoff/2026-03-23-scientify-literature-monitoring-architecture-to-runtime-handoff.md"
  );
  assert.ok(scientify, "Expected the historical Scientify Runtime handoff stub to be present in the workbench handoff list.");
  assert.equal(scientify?.status, "historical_handoff");
  assert.match(scientify?.warning || "", /Historical Runtime handoff/i);

  const autoresearch = legacyHandoffs.find((stub) =>
    stub.relativePath === "runtime/handoff/2026-03-22-autoresearch-architecture-to-runtime-handoff.md"
  );
  assert.ok(autoresearch, "Expected the historical autoresearch Runtime handoff stub to be present in the workbench handoff list.");
  assert.equal(autoresearch?.status, "historical_handoff");
  assert.match(autoresearch?.warning || "", /Historical Runtime handoff/i);
}

function assertLegacyRuntimeFollowUpRepoCompatibility() {
  const cliAnything = readDirectiveWorkbenchHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: "runtime/follow-up/2026-03-20-cli-anything-runtime-follow-up-record.md",
  });
  assert.equal(
    cliAnything.ok,
    true,
    "The legacy CLI-anything Runtime follow-up should be readable as a historical follow-up artifact instead of surfacing only as invalid state.",
  );
  if (!cliAnything.ok || cliAnything.kind !== "runtime_follow_up_legacy") {
    throw new Error("legacy_cli_anything_runtime_follow_up_unreadable");
  }
  assert.equal(cliAnything.candidateId, "al-parked-cli-anything");
  assert.equal(
    cliAnything.reentryContractPath,
    "runtime/follow-up/2026-03-20-cli-anything-reentry-contract.md",
  );
  assert.equal(
    cliAnything.currentStatus,
    "deferred with formal re-entry contract",
  );

  const snapshot = readDirectiveWorkbenchSnapshot({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const stub = snapshot.handoffStubs.find((entry) =>
    entry.relativePath === "runtime/follow-up/2026-03-20-cli-anything-runtime-follow-up-record.md"
  );
  assert.ok(stub, "The legacy CLI-anything Runtime follow-up should be present in the handoff list.");
  assert.equal(stub?.kind, "runtime_follow_up_legacy");
  assert.equal(stub?.status, "historical_follow_up");
  assert.match(stub?.warning || "", /Historical Runtime follow-up/i);
}

function assertLegacyRuntimeActiveFollowUpRepoCompatibility() {
  const scientify = readDirectiveWorkbenchHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: "runtime/follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md",
  });
  assert.equal(
    scientify.ok,
    true,
    "The active bounded legacy Scientify Runtime follow-up should be readable as a historical follow-up artifact instead of surfacing only as invalid state.",
  );
  if (!scientify.ok || scientify.kind !== "runtime_follow_up_legacy") {
    throw new Error("legacy_scientify_runtime_active_follow_up_unreadable");
  }
  assert.equal(scientify.candidateId, "scientify-literature-monitoring");
  assert.equal(scientify.currentStatus, "active bounded follow-up");
  assert.equal(scientify.reentryContractPath, null);
  assert.equal(scientify.proposedHost, "OpenClaw");

  const snapshot = readDirectiveWorkbenchSnapshot({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const stub = snapshot.handoffStubs.find((entry) =>
    entry.relativePath === "runtime/follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md"
  );
  assert.ok(stub, "The active bounded legacy Scientify Runtime follow-up should be present in the handoff list.");
  assert.equal(stub?.kind, "runtime_follow_up_legacy");
  assert.equal(stub?.status, "historical_follow_up");
  assert.match(stub?.warning || "", /Historical Runtime follow-up/i);
}

function assertLegacyNarrativeRuntimeFollowUpRepoCompatibility() {
  const cases = [
    {
      relativePath: "runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md",
      candidateId: "agent-orchestrator",
      candidateName: "Agent-Orchestrator",
      currentStatus: "active",
    },
    {
      relativePath: "runtime/follow-up/2026-03-20-promptfoo-runtime-followup.md",
      candidateId: "promptfoo",
      candidateName: "Promptfoo",
      currentStatus: "planned",
    },
    {
      relativePath: "runtime/follow-up/2026-03-20-puppeteer-browser-runtime-followup.md",
      candidateId: "puppeteer-browser",
      candidateName: "Puppeteer Browser",
      currentStatus: "completed (bounded browser smoke lane promoted 2026-03-21)",
    },
  ] as const;

  const snapshot = readDirectiveWorkbenchSnapshot({
    directiveRoot: DIRECTIVE_ROOT,
  });

  for (const runtimeCase of cases) {
    const detail = readDirectiveWorkbenchHandoffDetail({
      directiveRoot: DIRECTIVE_ROOT,
      relativePath: runtimeCase.relativePath,
    });
    assert.equal(
      detail.ok,
      true,
      `The legacy narrative Runtime follow-up should be readable through the workbench handoff detail surface: ${runtimeCase.relativePath}`,
    );
    if (!detail.ok || detail.kind !== "runtime_follow_up_legacy") {
      throw new Error(`legacy_narrative_runtime_follow_up_unreadable:${runtimeCase.relativePath}`);
    }
    assert.equal(detail.candidateId, runtimeCase.candidateId);
    assert.equal(detail.candidateName, runtimeCase.candidateName);
    assert.equal(detail.currentStatus, runtimeCase.currentStatus);
    assert.equal(detail.reentryContractPath, null);

    const stub = snapshot.handoffStubs.find((entry) => entry.relativePath === runtimeCase.relativePath);
    assert.ok(stub, `The legacy narrative Runtime follow-up should appear in the handoff list: ${runtimeCase.relativePath}`);
    assert.equal(stub?.kind, "runtime_follow_up_legacy");
    assert.equal(stub?.status, "historical_follow_up");
    assert.match(stub?.warning || "", /Historical Runtime follow-up/i);
  }
}

function assertCurrentArchitectureHandoffWarningsStayClean() {
  const snapshot = readDirectiveFrontendSnapshot({
    directiveRoot: DIRECTIVE_ROOT,
  });
  assert.deepEqual(
    snapshot.handoffWarnings,
    [],
    "Current repo-generated Architecture handoff stubs should parse cleanly without frontend handoff warnings.",
  );

  const guardedPaths = [
    "architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-engine-handoff.md",
    "architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-engine-handoff.md",
  ];

  for (const relativePath of guardedPaths) {
    const stub = snapshot.handoffStubs.find((entry) => entry.relativePath === relativePath);
    assert.ok(stub, `Expected the current Architecture handoff stub to appear in the frontend snapshot: ${relativePath}`);
    assert.equal(stub?.kind, "architecture_handoff");
    assert.equal(stub?.status, "pending_review");
    assert.equal(stub?.warning, null);
  }
}

async function main() {
  assertLegacyRuntimeHandoffRepoDetails();
  assertLegacyRuntimeHandoffRepoStubs();
  assertLegacyRuntimeFollowUpRepoCompatibility();
  assertLegacyRuntimeActiveFollowUpRepoCompatibility();
  assertLegacyNarrativeRuntimeFollowUpRepoCompatibility();
  assertCurrentArchitectureHandoffWarningsStayClean();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dw-frontend-host-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
  const gapsPath = path.join(directiveRoot, "discovery", "capability-gaps.json");
  const missionPath = path.join(directiveRoot, "knowledge", "active-mission.md");
  const approvalRoutingRelativePath =
    "discovery/routing-log/2026-03-24-route-approval-routing-record.md";
  const approvalIntakeRelativePath =
    "discovery/intake/2026-03-24-route-approval-intake.md";
  const approvalTriageRelativePath =
    "discovery/triage/2026-03-24-route-approval-triage.md";
  const approvalHandoffRelativePath =
    "architecture/02-experiments/2026-03-24-route-approval-engine-handoff.md";
  const handoffRelativePath =
    "architecture/02-experiments/2026-03-24-sample-engine-handoff.md";
  const runtimeFollowUpRelativePath =
    "runtime/follow-up/2026-03-24-sample-runtime-follow-up-record.md";
  const runtimeRecordRelativePath =
    "runtime/02-records/2026-03-24-sample-runtime-runtime-record.md";
  const runtimeProofRelativePath =
    "runtime/03-proof/2026-03-24-sample-runtime-proof.md";
  const runtimeCapabilityBoundaryRelativePath =
    "runtime/04-capability-boundaries/2026-03-24-sample-runtime-runtime-capability-boundary.md";
  const runtimePromotionReadinessRelativePath =
    "runtime/05-promotion-readiness/2026-03-24-sample-runtime-promotion-readiness.md";
  const runtimeRoutingRelativePath =
    "discovery/routing-log/2026-03-24-sample-runtime-routing.md";
  const handoffAbsolutePath = path.join(directiveRoot, handoffRelativePath);
  const approvalRunRecordPath = path.join(
    directiveRoot,
    "runtime",
    "standalone-host",
    "engine-runs",
    "2026-03-24T00-00-00-000Z-route-approval-candidate-route-ap.json",
  );
  const approvalRunReportPath = approvalRunRecordPath.replace(/\.json$/i, ".md");
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
        candidate_id: "route-approval-candidate",
        candidate_name: "Route approval candidate",
        source_type: "github-repo",
        source_reference: "https://example.com/route-approval",
        received_at: "2026-03-24",
        status: "routed",
        routing_target: "architecture",
        mission_alignment: "Improve the Directive Workspace engine.",
        capability_gap_id: "gap-directive-engine-materialization",
        assigned_worker: null,
        intake_record_path: approvalIntakeRelativePath,
        fast_path_record_path: null,
        routed_at: "2026-03-24",
        completed_at: null,
        routing_record_path: approvalRoutingRelativePath,
        result_record_path: null,
        notes: "Seeded for route approval check.",
      },
      {
        candidate_id: "sample-engine-run-candidate",
        candidate_name: "Sample engine run candidate",
        source_type: "github-repo",
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
  writeJson(gapsPath, {
    status: "active",
    updatedAt: "2026-03-24",
    gaps: [
      {
        gap_id: "gap-directive-engine-materialization",
        description:
          "Canonical Directive engine surface is only partially materialized as one reusable executable core with clear lane boundaries and host-adapter seams",
        priority: "high",
        related_mission_objective: "Directive engine materialization",
        current_state:
          "A first engine slice exists, but real source intake still falls back to host helpers, Markdown-first assets, and manual post-decision lane handoff",
        desired_state:
          "Engine owns substantially more intake, routing, adaptation/improvement, proof, decision, and handoff state while Discovery, Runtime, and Architecture operate as clear Engine lanes",
        detected_at: "2026-03-24",
        resolved_at: null,
      },
    ],
  });
  fs.mkdirSync(path.dirname(missionPath), { recursive: true });
  fs.copyFileSync(
    path.join(process.cwd(), "knowledge", "active-mission.md"),
    missionPath,
  );
  writeJson(
    approvalRunRecordPath,
    sampleRunRecord({
      runId: "route-approval-run",
      candidateId: "route-approval-candidate",
      candidateName: "Route approval candidate",
      sourceRef: "https://example.com/route-approval",
      nextAction: "Open one bounded Architecture handoff from the approved Discovery route.",
    }),
  );
  writeUtf8(
    approvalRunReportPath,
    [
      "# Directive Engine Run",
      "",
      "- Run ID: `route-approval-run`",
      "- Candidate Name: Route approval candidate",
      "",
      "## Usefulness Rationale",
      "",
      "Meta-usefulness from shared Engine judgment.",
      "",
    ].join("\n"),
  );
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
    path.join(directiveRoot, approvalIntakeRelativePath),
    [
      "# Discovery Intake Record: Route approval candidate",
      "",
      "Date: 2026-03-24",
      "",
      "- Candidate id: route-approval-candidate",
      "- Candidate name: Route approval candidate",
      "",
    ].join("\n"),
  );
  writeUtf8(
    path.join(directiveRoot, approvalTriageRelativePath),
    [
      "# Discovery Triage Record: Route approval candidate",
      "",
      "Date: 2026-03-24",
      "",
      "- Candidate id: route-approval-candidate",
      "- Candidate name: Route approval candidate",
      "",
    ].join("\n"),
  );
  writeUtf8(
    path.join(directiveRoot, approvalRoutingRelativePath),
    [
      "# Discovery Routing Record: Route approval candidate",
      "",
      "Date: 2026-03-24",
      "",
      "- Candidate id: route-approval-candidate",
      "- Candidate name: Route approval candidate",
      "- Routing date: 2026-03-24",
      "- Source type: github-repo",
      "- Decision state: adopt",
      "- Adoption target: engine-owned product logic",
      "- Route destination: architecture",
      "- Why this route: Recommended architecture because the extracted value primarily improves Directive Workspace engine behavior.",
      "- Why not the alternatives: Discovery intake is complete and Runtime is not the primary adoption target for this candidate.",
      "- Handoff contract used: n/a",
      "- Receiving track owner: architecture",
      `- Required next artifact: ${approvalHandoffRelativePath}`,
      "- Re-entry/Promotion trigger conditions: adaptation_complete, engine_boundary_preserved, decision_review",
      "- Review cadence: before any downstream execution or promotion",
      `- Linked intake record: ${approvalIntakeRelativePath}`,
      `- Linked triage record: ${approvalTriageRelativePath}`,
      "",
    ].join("\n"),
  );
  writeUtf8(
    path.join(directiveRoot, runtimeFollowUpRelativePath),
    [
      "# Sample Runtime Follow-up Record",
      "",
      "- Candidate id: `sample-runtime`",
      "- Candidate name: `Sample Runtime candidate`",
      "- Follow-up date: `2026-03-24`",
      "- Current decision state: `route_to_runtime_follow_up`",
      "- Origin track: `discovery-routing-approval`",
      "- Runtime value to operationalize: Create one bounded reusable callable capability record without opening runtime execution.",
      "- Proposed host: `pending_host_selection`",
      "- Proposed integration mode: reimplement",
      "- Source-pack allowlist profile: n/a",
      "- Allowed export surfaces:",
      "  - bounded runtime capability",
      "  - callable capability boundary",
      "- Excluded baggage:",
      "  - source-specific implementation baggage",
      "- Promotion contract path: pending",
      "- Re-entry contract path (if deferred): n/a",
      "- Re-entry preconditions (checklist):",
      "  - Human review confirms the bounded runtime objective.",
      "- Required proof:",
      "  - baseline artifact or metric",
      "  - behavior-preserving claim",
      "- Required gates:",
      "  - `behavior_preservation`",
      "  - `runtime_boundary_review`",
      "- Trial scope limit (if experimenting):",
      "  - Keep this as a follow-up stub only.",
      "- Risks:",
      "  - Human review still required.",
      "- Rollback: Revert to the bounded follow-up only state if the next Runtime record proves too broad.",
      "- No-op path: Leave the candidate at follow-up status only and do not open downstream runtime work.",
      "- Review cadence: before any downstream execution or promotion",
      "- Current status: `pending_review`",
      "",
      "Linked handoff:",
      "- `discovery/routing-log/2026-03-24-sample-runtime-routing.md`",
      "",
    ].join("\n"),
  );
  writeUtf8(
    path.join(directiveRoot, runtimeRoutingRelativePath),
    [
      "# Discovery Routing Record: Sample Runtime candidate",
      "",
      "Date: 2026-03-24",
      "",
      "- Candidate id: sample-runtime",
      "- Candidate name: Sample Runtime candidate",
      "- Routing date: 2026-03-24",
      "- Source type: github-repo",
      "- Decision state: route_to_runtime_follow_up",
      "- Adoption target: reusable runtime capability",
      "- Route destination: runtime",
      "- Why this route: The extracted value is best kept as a reusable bounded runtime capability path.",
      "- Why not the alternatives: Architecture is not the primary adoption target for this sample Runtime candidate.",
      "- Handoff contract used: n/a",
      "- Receiving track owner: runtime",
      `- Required next artifact: ${runtimeFollowUpRelativePath}`,
      "- Re-entry/Promotion trigger conditions: bounded_proof_review, runtime_boundary_review",
      "- Review cadence: before any downstream execution or promotion",
      "- Linked intake record: discovery/intake/2026-03-24-sample-runtime-intake.md",
      "",
    ].join("\n"),
  );
  writeUtf8(
    path.join(directiveRoot, "discovery", "intake", "2026-03-24-sample-runtime-intake.md"),
    [
      "# Discovery Intake Record: Sample Runtime candidate",
      "",
      "Date: 2026-03-24",
      "",
      "- Candidate id: sample-runtime",
      "- Candidate name: Sample Runtime candidate",
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
      "- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`",
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
    await withDirectiveFrontendCheckServer({
      directiveRoot,
      frontendBuildDirectiveRoot: DIRECTIVE_ROOT,
    }, async (handle) => {
      await page.goto(`${handle.origin}/`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Directive Workspace Frontend");
    await waitForBodyText(page, "Directive Workspace overview");
    await waitForBodyText(page, "Discovery lane");
    await waitForBodyText(page, "Architecture lane");
    await waitForBodyText(page, "Runtime lane");

    await page.goto(`${handle.origin}/discovery`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Discovery lane");
    await waitForBodyText(page, "Open source submission");

    await page.goto(`${handle.origin}/architecture`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Architecture lane");
    await waitForBodyText(page, "Recent Architecture anchors");

    await page.goto(`${handle.origin}/runtime`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Runtime lane summary");
    await waitForBodyText(page, "Recent Runtime anchors");

    await page.goto(`${handle.origin}/submit`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForBodyText(page, "Source submission");
    await submitThroughShadowForm(page, {
      candidateName: "Frontend Submit Check",
      candidateId: "frontend-submit-check",
      sourceType: "github-repo",
      sourceReference: "https://github.com/assafelovic/gpt-researcher",
      missionAlignment:
        "Directive engine materialization and Architecture routing pressure. Exercise the real Discovery front door with shared Engine usefulness and routing.",
    });
    await waitForBodyText(page, "Discovery result", 60000);
    await waitForBodyText(page, "Open Engine run detail", 60000);
    await waitForBodyText(page, "Open Discovery routing record", 60000);
    await waitForBodyText(page, "This source has now entered through Discovery first", 60000);
    const canonicalQueueEntry = await page.evaluate(async () => {
      const response = await fetch("/api/queue-entry?candidateId=frontend-submit-check");
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    });
    assert.equal(canonicalQueueEntry?.source_type, "github-repo");
    const normalizedSourceResult = await page.evaluate(async () => {
      const response = await fetch("/api/discovery/front-door", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          candidate_id: "frontend-submit-repository-alias-check",
          candidate_name: "Frontend Submit Repository Alias Check",
          source_type: "repository",
          source_reference: "https://github.com/example/repository-alias-check",
          mission_alignment: "Discovery intake alias normalization check.",
        }),
      });
      return {
        status: response.status,
        payload: await response.json(),
      };
    });
    assert.equal(normalizedSourceResult.status, 200);
    assert.equal(normalizedSourceResult.payload?.sourceType?.canonicalType, "github-repo");
    assert.equal(normalizedSourceResult.payload?.sourceType?.normalizedFrom, "repository");
    assert.equal(normalizedSourceResult.payload?.queueEntry?.source_type, "github-repo");
    await clickShadowLinkByText(page, "Open Discovery routing record");
    await page.waitForFunction(
      () => window.location.pathname === "/discovery-routing-records/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Discovery routing record");
    await waitForBodyText(page, "Route approval");
    await waitForBodyText(page, "This routing record does not currently open a downstream Architecture or Runtime stub.");
    await page.goto(
      `${handle.origin}/discovery-routing-records/view?path=${encodeURIComponent(approvalRoutingRelativePath)}`,
      { waitUntil: "networkidle0", timeout: 30000 },
    );
    await waitForBodyText(page, "Discovery routing record");
    await waitForBodyText(page, "Approve Architecture handoff");
    const openedStubPath = await page.evaluate(async (routingPath) => {
      const response = await fetch("/api/discovery/open-route", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          routingPath,
          approved: true,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const payload = await response.json();
      return payload.stubRelativePath as string;
    }, approvalRoutingRelativePath);
    await page.goto(
      `${handle.origin}/handoffs/view?path=${encodeURIComponent(openedStubPath)}`,
      { waitUntil: "networkidle0", timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture handoff detail");
    await waitForBodyText(page, "route-approval-candidate");
    await waitForBodyText(page, "Approve bounded start");

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
    await page.goto(
      `${handle.origin}/handoffs/view?path=${encodeURIComponent(runtimeFollowUpRelativePath)}`,
      { waitUntil: "networkidle0", timeout: 30000 },
    );
    await waitForBodyText(page, "Runtime follow-up stub");
    await waitForBodyText(page, "Approve Runtime record");
    await clickShadowButtonByText(page, "Approve Runtime record");
    await waitForPathname(page, "/runtime-records/view");
    await waitForBodyText(page, "Runtime v0 record");
    await waitForBodyText(page, "Approve Runtime proof artifact");
    assert.equal(
      fs.existsSync(path.join(directiveRoot, runtimeRecordRelativePath)),
      true,
    );
    await clickShadowButtonByText(page, "Approve Runtime proof artifact");
    await page.waitForFunction(
      () => window.location.pathname === "/runtime-proofs/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Runtime proof artifact");
    await waitForBodyText(page, "Runtime V0 Proof Artifact: Sample Runtime candidate (2026-03-24)");
    await waitForBodyText(page, "Approve runtime capability boundary");
    assert.equal(
      fs.existsSync(path.join(directiveRoot, runtimeProofRelativePath)),
      true,
    );
    await clickShadowButtonByText(page, "Approve runtime capability boundary");
    await page.waitForFunction(
      () => window.location.pathname === "/runtime-runtime-capability-boundaries/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Runtime runtime capability boundary");
    await waitForBodyText(page, "Runtime V0 Runtime Capability Boundary: Sample Runtime candidate (2026-03-24)");
    await waitForBodyText(page, "Approve promotion-readiness artifact");
    assert.equal(
      fs.existsSync(path.join(directiveRoot, runtimeCapabilityBoundaryRelativePath)),
      true,
    );
    await clickShadowButtonByText(page, "Approve promotion-readiness artifact");
    await page.waitForFunction(
      () => window.location.pathname === "/artifacts",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Artifact view");
    await waitForBodyText(page, "Runtime Promotion-Readiness Artifact: Sample Runtime candidate (2026-03-24)");
    assert.equal(
      fs.existsSync(path.join(directiveRoot, runtimePromotionReadinessRelativePath)),
      true,
    );

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
    await waitForBodyText(page, "Result evidence");
    await waitForBodyText(page, "No bounded result artifact exists yet");
    await waitForBodyText(page, "Closeout assist");
    await waitForBodyText(page, "planning -> analysis -> generation");
    await waitForBodyText(page, "Record the concrete Engine-owned delta from this bounded slice.");
    await submitArchitectureCloseout(page, {
      resultSummary:
        "Bounded Architecture slice clarified the next engine-owned adaptation target and should stay experimental until the product-owned implementation artifact is materialized.",
      primaryEvidencePath: handoffRelativePath,
    });
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-results/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture bounded result");
    await waitForBodyText(page, "Result evidence");
    await waitForBodyText(page, "A direct primary evidence path is explicitly recorded in the bounded closeout contract");
    await waitForBodyText(page, handoffRelativePath);
    await waitForBodyText(page, "stay_experimental");
    await clickShadowButtonByText(page, "Open next bounded start");
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-starts/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture bounded start");
    await waitForBodyText(page, "bounded result");
    await submitArchitectureCloseout(page, {
      resultSummary:
        "Continuation bounded Architecture slice retained the next engine-owned materialization target and should now be kept as a product-owned adopted planned-next artifact.",
    });
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-results/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture bounded result");
    await clickShadowButtonByText(page, "Adopt / Materialize");
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-adoptions/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture adoption artifact");
    await waitForBodyText(page, "adopt_planned_next");
    await clickShadowButtonByText(page, "Create Implementation Target");
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-implementation-targets/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture implementation target");
    await waitForBodyText(page, "Build target:");
    await submitImplementationResult(page, {
      resultSummary:
        "Bounded implementation slice completed the retained Architecture target and kept the materialization boundary explicit.",
    });
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-implementation-results/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture implementation result");
    await waitForBodyText(page, "success");
    await submitRetentionConfirmation(page);
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-retained/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Retained Architecture output");
    await waitForBodyText(page, "bounded-stable");
    await submitIntegrationRecord(page);
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-integration-records/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture integration record");
    await waitForBodyText(page, "integration-ready");
    await submitConsumptionRecord(page);
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-consumption-records/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Architecture consumption record");
    await waitForBodyText(page, "applied-integration record");
    const consumptionRelativePath = await page.evaluate(() => {
      const url = new URL(window.location.href);
      return url.searchParams.get("path") || "";
    });
    const keepEvaluation = evaluateDirectiveArchitectureConsumption({
      directiveRoot,
      consumptionPath: consumptionRelativePath,
      evaluatedBy: "directive-frontend-operator",
      decision: "keep",
    });
    await page.goto(
      `${handle.origin}/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(keepEvaluation.evaluationRelativePath)}`,
      { waitUntil: "networkidle0", timeout: 30000 },
    );
    await waitForBodyText(page, "Post-consumption evaluation");
    await waitForBodyText(page, "keep");
    await waitForBodyText(page, "No reopen action is exposed for keep decisions.");
    await assertShadowTextDoesNotContain(page, "Reopen Architecture Work");
    const reopenEvaluation = evaluateDirectiveArchitectureConsumption({
      directiveRoot,
      consumptionPath: consumptionRelativePath,
      evaluatedBy: "directive-frontend-operator",
      decision: "reopen",
      rationale:
        "Real bounded use exposed enough uncertainty that this applied Architecture output should reopen a bounded Architecture slice.",
      observedStability:
        "Observed behavior indicates the applied integration should not yet be treated as stable retained output.",
      retainedUsefulnessAssessment:
        "The retained Architecture output needs another bounded Architecture pass before it should remain valid retained output.",
      nextBoundedAction:
        "Reopen one bounded Architecture slice from the retained or integration artifact and re-evaluate the applied boundary.",
    });
    await page.goto(
      `${handle.origin}/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(reopenEvaluation.evaluationRelativePath)}`,
      { waitUntil: "networkidle0", timeout: 30000 },
    );
    await waitForBodyText(page, "reopen");
    await waitForBodyText(page, "Reopen Architecture Work");
    await clickShadowButtonByText(page, "Reopen Architecture Work");
    await page.waitForFunction(
      () => window.location.pathname === "/architecture-starts/view",
      { timeout: 30000 },
    );
    await waitForBodyText(page, "Reopened Bounded Architecture Start");
    await waitForBodyText(page, "Source evaluation ref");
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
    });
  } finally {
    await browser.close();
  }
}

void main();
