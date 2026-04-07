import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveRuntimeLoopControlReport } from "../runtime/lib/runtime-loop-control.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
const STATUS_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-status.json");
const SLICES_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-slices.json");
const LEDGER_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "coordination-ledger.json");

function main() {
  const queueBefore = fs.readFileSync(QUEUE_PATH, "utf8");
  const statusBefore = fs.readFileSync(STATUS_PATH, "utf8");
  const slicesBefore = fs.readFileSync(SLICES_PATH, "utf8");
  const ledgerBefore = fs.existsSync(LEDGER_PATH) ? fs.readFileSync(LEDGER_PATH, "utf8") : null;

  const report = buildDirectiveRuntimeLoopControlReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, "runtime_loop_control");
  assert.equal(report.mode, "bounded_manual_followthrough_loop");
  assert.deepEqual(report.guardrails, {
    mutatesQueueOrStateTruth: false,
    autoAdvancesWorkflow: false,
    bypassesApproval: false,
    impliesLifecycleOrchestration: false,
    impliesHostIntegration: false,
    impliesRuntimeExecution: false,
    impliesPromotionAutomation: false,
  });

  assert.deepEqual(report.setupReadiness, {
    hasCompletionSelector: true,
    hasRuntimePromotionAssistance: true,
    hasReadOnlyLifecycleCoordination: true,
    hasBoundedPersistentLedger: true,
  });

  assert.equal(report.completionFrontier.selectionState, "complete");
  assert.equal(
    report.completionFrontier.currentTarget.id,
    "phase_complete",
  );
  assert.equal(report.completionFrontier.blockedByClosedSeamCount, 0);

  assert.deepEqual(report.runtimeQueue.topRecommendation, {
    candidateId: "research-engine-repo-jackswl-deep-researcher-20260407t041754z-20260407t051723.",
    assistanceState: "blocked_pending_host_selection",
    recommendedActionKind: "clarify_repo_native_host_target",
  });
  assert.equal(report.runtimeQueue.summary.totalPromotionReadinessCases, 15);
  assert.equal(report.runtimeQueue.summary.alreadyPromotedManualCycleCount, 12);
  assert.equal(report.runtimeQueue.summary.blockedPendingHostSelectionCount, 2);
  assert.equal(report.runtimeQueue.summary.blockedMissingCallableBoundaryCount, 0);
  assert.equal(report.runtimeQueue.summary.blockedOtherCount, 1);

  assert.equal(report.coordinationContext.topPressureBucket, "other_live_case");
  assert.equal(report.coordinationContext.totalLiveCases, 47);
  assert.equal(report.coordinationContext.parkedCount, 46);
  assert.equal(report.coordinationContext.stopCount, 1);

  assert.equal(report.persistenceSignals.ledgerPath, "control/state/coordination-ledger.json");
  assert.equal(report.persistenceSignals.totalPreviousChecks >= 1, true);
  assert.equal(report.persistenceSignals.staleCaseCount > 0, true);

  assert.equal(report.loopSelection.loopPossible, true);
  assert.equal(report.loopSelection.selectedDomain, "runtime");
  assert.equal(report.loopSelection.authoritySurface, "runtime_promotion_assistance");
  assert.equal(report.loopSelection.selectedCompletionSlice, null);
  assert.ok(
    report.loopSelection.selectedReason.includes("top recommendation-first Runtime case"),
    "Expected the loop selector to explain that the completed completion ladder now defers to the Runtime top recommendation frontier",
  );
  assert.deepEqual(report.loopSelection.selectedCase, {
    candidateId: "research-engine-repo-jackswl-deep-researcher-20260407t041754z-20260407t051723.",
    candidateName: "jackswl/deep-researcher",
    currentStage: "runtime.promotion_readiness.opened",
    currentHeadPath:
      "runtime/05-promotion-readiness/2026-04-07-research-engine-repo-jackswl-deep-researcher-20260407t041754z-20260407t051723.-promotion-readiness.md",
    recommendedActionKind: "clarify_repo_native_host_target",
    recommendedActionSummary:
      "This case cannot reach a manual promotion decision yet because host selection is still pending. Clarify one bounded repo-native host target first.",
  });

  assert.equal(
    fs.readFileSync(QUEUE_PATH, "utf8"),
    queueBefore,
    "runtime loop control must not mutate queue truth",
  );
  assert.equal(
    fs.readFileSync(STATUS_PATH, "utf8"),
    statusBefore,
    "runtime loop control must not mutate completion status",
  );
  assert.equal(
    fs.readFileSync(SLICES_PATH, "utf8"),
    slicesBefore,
    "runtime loop control must not mutate completion slice registry",
  );
  assert.equal(
    fs.existsSync(LEDGER_PATH) ? fs.readFileSync(LEDGER_PATH, "utf8") : null,
    ledgerBefore,
    "runtime loop control report must not mutate the bounded coordination ledger",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          checker: "runtime_loop_control",
          completionFrontier: report.completionFrontier,
          runtimeQueue: report.runtimeQueue,
          loopSelection: report.loopSelection,
          persistenceSignals: report.persistenceSignals,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
