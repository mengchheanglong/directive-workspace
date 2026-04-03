import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveRuntimePromotionAssistanceReport } from "../shared/lib/runtime-promotion-assistance.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function findRecommendation(candidateId: string) {
  const report = buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const recommendation = report.recommendations.find((entry) => entry.candidateId === candidateId);
  assert.ok(recommendation, `Missing promotion assistance recommendation for ${candidateId}`);
  return {
    report,
    recommendation,
  };
}

function main() {
  const report = buildDirectiveRuntimePromotionAssistanceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, "runtime-promotion-assistance");
  assert.equal(report.mode, "recommendation_first_read_only");
  assert.deepEqual(report.guardrails, {
    mutatesQueueOrStateTruth: false,
    autoAdvancesWorkflow: false,
    bypassesApproval: false,
    impliesHostIntegration: false,
    impliesRuntimeExecution: false,
    impliesPromotionAutomation: false,
  });
  assert.equal(report.manualRuntimePromotionCycles.totalManualPromotionRecords >= 2, true);
  assert.equal(report.manualRuntimePromotionCycles.validatedLocallyCount >= 2, true);

  assert.equal(report.topRecommendation, null);

  const realMiniSweRoute = findRecommendation(
    "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  ).recommendation;
  assert.equal(realMiniSweRoute.assistanceState, "already_promoted_manual_cycle");
  assert.equal(realMiniSweRoute.recommendedActionKind, "none");
  assert.equal(
    realMiniSweRoute.currentStage,
    "runtime.promotion_record.opened",
  );
  assert.equal(
    realMiniSweRoute.proposedHost,
    "Directive Workspace web host (frontend/ + hosts/web-host/)",
  );
  assert.deepEqual(realMiniSweRoute.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    realMiniSweRoute.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  const puppeteerPressure = findRecommendation(
    "dw-pressure-puppeteer-bounded-tool-2026-03-25",
  ).recommendation;
  assert.equal(puppeteerPressure.assistanceState, "already_promoted_manual_cycle");
  assert.equal(puppeteerPressure.recommendedActionKind, "none");
  assert.equal(
    puppeteerPressure.currentStage,
    "runtime.promotion_record.opened",
  );
  assert.equal(
    puppeteerPressure.proposedHost,
    "Directive Workspace web host (frontend/ + hosts/web-host/)",
  );
  assert.deepEqual(puppeteerPressure.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    puppeteerPressure.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  const scientifyPressure = findRecommendation(
    "dw-pressure-scientify-2026-03-25",
  ).recommendation;
  assert.equal(scientifyPressure.assistanceState, "already_promoted_manual_cycle");
  assert.equal(scientifyPressure.recommendedActionKind, "none");
  assert.equal(
    scientifyPressure.currentStage,
    "runtime.promotion_record.opened",
  );
  assert.equal(
    scientifyPressure.proposedHost,
    "Directive Workspace web host (frontend/ + hosts/web-host/)",
  );
  assert.deepEqual(scientifyPressure.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    scientifyPressure.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  const scientify = findRecommendation(
    "dw-source-scientify-research-workflow-plugin-2026-03-27",
  ).recommendation;
  assert.equal(scientify.assistanceState, "already_promoted_manual_cycle");
  assert.equal(scientify.recommendedActionKind, "none");
  assert.equal(
    scientify.currentStage,
    "runtime.promotion_record.opened",
  );

  const openmoss = findRecommendation(
    "dw-mission-openmoss-runtime-orchestration-2026-03-26",
  ).recommendation;
  assert.equal(openmoss.assistanceState, "already_promoted_manual_cycle");
  assert.equal(openmoss.recommendedActionKind, "none");
  assert.equal(
    openmoss.currentStage,
    "runtime.promotion_record.opened",
  );

  const temporal = findRecommendation(
    "dw-source-temporal-durable-execution-2026-04-01",
  ).recommendation;
  assert.equal(temporal.assistanceState, "already_promoted_manual_cycle");
  assert.equal(temporal.recommendedActionKind, "none");
  assert.equal(temporal.currentStage, "runtime.promotion_record.opened");
  assert.equal(
    temporal.proposedHost,
    "Directive Workspace web host (frontend/ + hosts/web-host/)",
  );
  assert.deepEqual(temporal.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    temporal.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  const openmossPressure = findRecommendation(
    "dw-pressure-openmoss-architecture-loop-2026-03-26",
  ).recommendation;
  assert.equal(openmossPressure.assistanceState, "already_promoted_manual_cycle");
  assert.equal(openmossPressure.recommendedActionKind, "none");
  assert.equal(
    openmossPressure.proposedHost,
    "Directive Workspace web host (frontend/ + hosts/web-host/)",
  );
  assert.deepEqual(openmossPressure.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    openmossPressure.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  const miniSwePressure = findRecommendation(
    "dw-pressure-mini-swe-agent-2026-03-25",
  ).recommendation;
  assert.equal(miniSwePressure.assistanceState, "blocked_other");
  assert.equal(miniSwePressure.recommendedActionKind, "none");
  assert.equal(
    miniSwePressure.proposedHost,
    "Directive Workspace web host (frontend/ + hosts/web-host/)",
  );
  assert.deepEqual(miniSwePressure.missingPrerequisites, []);
  assert.equal(
    miniSwePressure.supportingArtifacts.parkDecisionArtifact,
    "control/logs/2026-04/2026-04-02-pressure-mini-swe-dw-web-host-manual-promotion-park-decision.md",
  );

  const miniSweLivePressure = findRecommendation(
    "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
  ).recommendation;
  assert.equal(miniSweLivePressure.assistanceState, "already_promoted_manual_cycle");
  assert.equal(miniSweLivePressure.recommendedActionKind, "none");
  assert.equal(miniSweLivePressure.currentStage, "runtime.promotion_record.opened");
  assert.equal(
    miniSweLivePressure.proposedHost,
    "Directive Workspace standalone host (hosts/standalone-host/)",
  );
  assert.deepEqual(miniSweLivePressure.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    miniSweLivePressure.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  const scientifyLivePressure = findRecommendation(
    "dw-live-scientify-engine-pressure-2026-03-24",
  ).recommendation;
  assert.equal(scientifyLivePressure.assistanceState, "already_promoted_manual_cycle");
  assert.equal(scientifyLivePressure.recommendedActionKind, "none");
  assert.equal(
    scientifyLivePressure.currentStage,
    "runtime.promotion_record.opened",
  );
  assert.deepEqual(scientifyLivePressure.missingPrerequisites, ["promotionRecordState.unopened"]);
  assert.equal(
    scientifyLivePressure.supportingArtifacts.existingPromotionRecordPaths.length,
    1,
  );

  assert.equal(report.summary.alreadyPromotedManualCycleCount, 9);
  assert.equal(report.summary.readyForManualPromotionSeamDecisionCount, 0);
  assert.equal(report.summary.readyButExternalHostCandidateCount, 0);
  assert.equal(report.summary.blockedPendingHostSelectionCount, 0);
  assert.equal(report.summary.blockedMissingCallableBoundaryCount, 0);
  assert.equal(report.summary.blockedOtherCount, 1);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          checker: "runtime_promotion_assistance",
          mode: report.mode,
          topRecommendation: report.topRecommendation,
          summary: report.summary,
          manualRuntimePromotionCycles: report.manualRuntimePromotionCycles,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
