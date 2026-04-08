import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveReadOnlyLifecycleCoordinationReport } from "../engine/coordination/read-only-lifecycle-coordination.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
const STATUS_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-status.json");
const SLICES_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-slices.json");

function findCase(
  report: ReturnType<typeof buildDirectiveReadOnlyLifecycleCoordinationReport>,
  candidateId: string,
) {
  const entry = report.liveCases.find((item) => item.candidateId === candidateId);
  assert.ok(entry, `Missing lifecycle coordination entry for ${candidateId}`);
  return entry;
}

function main() {
  const queueBefore = fs.readFileSync(QUEUE_PATH, "utf8");
  const statusBefore = fs.readFileSync(STATUS_PATH, "utf8");
  const slicesBefore = fs.readFileSync(SLICES_PATH, "utf8");

  const report = buildDirectiveReadOnlyLifecycleCoordinationReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, "read_only_lifecycle_coordination");
  assert.equal(report.mode, "read_only_lifecycle_coordination");
  assert.deepEqual(report.guardrails, {
    mutatesQueueOrStateTruth: false,
    autoAdvancesWorkflow: false,
    bypassesApproval: false,
    impliesLifecycleOrchestration: false,
    impliesHostIntegration: false,
    impliesRuntimeExecution: false,
    impliesPromotionAutomation: false,
  });
  assert.equal(report.upstreamSignals.manualRuntimePromotionCycles.totalManualPromotionRecords >= 9, true);
  assert.equal(report.upstreamSignals.manualRuntimePromotionCycles.validatedLocallyCount >= 9, true);
  assert.equal(report.upstreamSignals.runtimePromotionAssistanceTopRecommendation, null);

  assert.equal(report.summary.totalLiveCases, 47);
  assert.equal(report.summary.recommendTaskCount, 0);
  assert.equal(report.summary.parkedCount, 46);
  assert.equal(report.summary.stopCount, 1);
  assert.equal(report.summary.currentLaneCounts.runtime, 16);
  assert.equal(report.summary.currentLaneCounts.architecture, 29);
  assert.equal(report.summary.currentLaneCounts.discovery, 2);
  assert.equal(report.summary.bucketCounts.runtime_promotion_readiness_parked, 7);
  assert.equal(report.summary.bucketCounts.architecture_retention_confirmation_due, 0);
  assert.equal(report.summary.bucketCounts.architecture_experimental_parked, 15);
  assert.equal(report.summary.bucketCounts.architecture_keep_stop_carried_in_queue, 1);
  assert.equal(report.summary.bucketCounts.other_live_case, 13);
  assert.equal(report.summary.bucketCounts.runtime_manual_promotion_stop, 9);

  assert.ok(report.topCoordinationPressure, "Expected one top coordination pressure");
  assert.equal(report.topCoordinationPressure.bucketId, "architecture_experimental_parked");
  assert.equal(report.topCoordinationPressure.coordinationOutcome, "parked");
  assert.equal(report.topCoordinationPressure.caseCount, 15);
  assert.ok(
    report.topCoordinationPressure.recommendedFocus.includes("Keep experimental Architecture cases grouped"),
    "Expected the top pressure to reflect the parked Architecture experimental cluster",
  );

  const scientify = findCase(report, "dw-source-scientify-research-workflow-plugin-2026-03-27");
  assert.equal(scientify.currentStage, "runtime.promotion_record.opened");
  assert.equal(scientify.bucketId, "runtime_manual_promotion_stop");
  assert.equal(scientify.coordinationOutcome, "parked");

  const openmoss = findCase(report, "dw-mission-openmoss-runtime-orchestration-2026-03-26");
  assert.equal(openmoss.currentStage, "runtime.promotion_record.opened");
  assert.equal(openmoss.bucketId, "runtime_manual_promotion_stop");

  const scientifyLivePressure = findCase(report, "dw-live-scientify-engine-pressure-2026-03-24");
  assert.equal(scientifyLivePressure.currentStage, "runtime.promotion_record.opened");
  assert.equal(scientifyLivePressure.bucketId, "runtime_manual_promotion_stop");
  assert.equal(scientifyLivePressure.coordinationOutcome, "parked");

  const openmossPressure = findCase(report, "dw-pressure-openmoss-architecture-loop-2026-03-26");
  assert.equal(openmossPressure.currentStage, "runtime.promotion_record.opened");
  assert.equal(openmossPressure.bucketId, "runtime_manual_promotion_stop");
  assert.equal(openmossPressure.coordinationOutcome, "parked");

  const puppeteerPressure = findCase(report, "dw-pressure-puppeteer-bounded-tool-2026-03-25");
  assert.equal(puppeteerPressure.currentStage, "runtime.promotion_record.opened");
  assert.equal(puppeteerPressure.bucketId, "runtime_manual_promotion_stop");
  assert.equal(puppeteerPressure.coordinationOutcome, "parked");

  const scientifyPressure = findCase(report, "dw-pressure-scientify-2026-03-25");
  assert.equal(scientifyPressure.currentStage, "runtime.promotion_record.opened");
  assert.equal(scientifyPressure.bucketId, "runtime_manual_promotion_stop");
  assert.equal(scientifyPressure.coordinationOutcome, "parked");

  const realMiniSweRoute = findCase(report, "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25");
  assert.equal(realMiniSweRoute.currentStage, "runtime.promotion_record.opened");
  assert.equal(realMiniSweRoute.bucketId, "runtime_manual_promotion_stop");
  assert.equal(realMiniSweRoute.coordinationOutcome, "parked");

  const temporal = findCase(report, "dw-source-temporal-durable-execution-2026-04-01");
  assert.equal(temporal.currentStage, "runtime.promotion_record.opened");
  assert.equal(temporal.bucketId, "runtime_manual_promotion_stop");
  assert.equal(temporal.coordinationOutcome, "parked");

  const pressureMiniSwe = findCase(report, "dw-pressure-mini-swe-agent-2026-03-25");
  assert.equal(pressureMiniSwe.currentStage, "runtime.promotion_readiness.opened");
  assert.equal(pressureMiniSwe.bucketId, "runtime_promotion_readiness_parked");
  assert.equal(pressureMiniSwe.coordinationOutcome, "parked");
  assert.equal(pressureMiniSwe.actionKind, "keep_runtime_promotion_readiness_visible");

  const researchVaultPromoted = findCase(
    report,
    "research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.",
  );
  assert.equal(researchVaultPromoted.currentStage, "runtime.promotion_readiness.opened");
  assert.equal(researchVaultPromoted.bucketId, "runtime_promotion_readiness_parked");
  assert.equal(researchVaultPromoted.coordinationOutcome, "parked");

  const deepResearcherPending = findCase(
    report,
    "research-engine-repo-jackswl-deep-researcher-20260407t041754z-20260407t051723.",
  );
  assert.equal(deepResearcherPending.currentStage, "runtime.promotion_readiness.opened");
  assert.equal(deepResearcherPending.bucketId, "runtime_promotion_readiness_parked");
  assert.equal(deepResearcherPending.coordinationOutcome, "parked");

  const reportingBoundary = findCase(report, "dw-pressure-agentics-reporting-boundary-2026-03-26");
  assert.equal(reportingBoundary.currentStage, "architecture.implementation_target.opened");
  assert.equal(reportingBoundary.bucketId, "other_live_case");
  assert.equal(reportingBoundary.coordinationOutcome, "parked");
  assert.equal(reportingBoundary.actionKind, "inspect_live_case_boundary");

  const corePrinciples = findCase(report, "dw-mission-core-principles-operating-discipline-2026-03-26");
  assert.equal(corePrinciples.currentStage, "architecture.implementation_target.opened");
  assert.equal(corePrinciples.bucketId, "other_live_case");
  assert.equal(corePrinciples.coordinationOutcome, "parked");

  const paperqa2 = findCase(report, "research-engine-paperqa2-20260406t145339z-20260406t145353.");
  assert.equal(paperqa2.currentStage, "architecture.bounded_result.stay_experimental");
  assert.equal(paperqa2.currentLane, "architecture");
  assert.equal(paperqa2.bucketId, "architecture_experimental_parked");
  assert.equal(paperqa2.coordinationOutcome, "parked");
  assert.equal(paperqa2.actionKind, "keep_experimental_case_visible");

  const monitor = findCase(report, "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26");
  assert.equal(monitor.bucketId, "discovery_monitor_hold");
  assert.equal(monitor.coordinationOutcome, "parked");

  const openDeepResearchAutoloop = findCase(report, "dw-test-open-deep-research-autoloop-2026-04-06");
  assert.equal(openDeepResearchAutoloop.currentStage, "architecture.post_consumption_evaluation.keep");
  assert.equal(openDeepResearchAutoloop.bucketId, "architecture_keep_stop_carried_in_queue");
  assert.equal(openDeepResearchAutoloop.coordinationOutcome, "stop");
  assert.equal(openDeepResearchAutoloop.actionKind, "keep_keep_stop_visible_without_reopening");

  assert.equal(
    fs.readFileSync(QUEUE_PATH, "utf8"),
    queueBefore,
    "lifecycle coordination report must not mutate queue truth",
  );
  assert.equal(
    fs.readFileSync(STATUS_PATH, "utf8"),
    statusBefore,
    "lifecycle coordination report must not mutate completion status",
  );
  assert.equal(
    fs.readFileSync(SLICES_PATH, "utf8"),
    slicesBefore,
    "lifecycle coordination report must not mutate completion slice registry",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          checker: "read_only_lifecycle_coordination",
          summary: report.summary,
          topCoordinationPressure: report.topCoordinationPressure,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
