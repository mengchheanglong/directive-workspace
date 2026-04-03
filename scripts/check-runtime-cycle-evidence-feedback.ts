import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  generateDiscoveryGapWorklist,
  type CapabilityGapRecord,
  type DiscoveryGapWorklist,
  type DiscoveryQueueEntry,
} from "../shared/lib/discovery-gap-worklist-generator.ts";
import { readTopEligibleDiscoveryGapFromCanonicalWorklist } from "../shared/lib/discovery-gap-worklist-selector.ts";
import { aggregateRunEvidence } from "../shared/lib/run-evidence-aggregation.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "runtime_cycle_evidence_feedback";
const CAPABILITY_GAPS_PATH = path.join(DIRECTIVE_ROOT, "discovery", "capability-gaps.json");
const GAP_WORKLIST_PATH = path.join(DIRECTIVE_ROOT, "discovery", "gap-worklist.json");
const INTAKE_QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
const ACTIVE_MISSION_PATH = path.join(DIRECTIVE_ROOT, "knowledge", "active-mission.md");

const SCIENTIFY_CANDIDATE_ID =
  "dw-source-scientify-research-workflow-plugin-2026-03-27";
const SCIENTIFY_PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md";
const OPENMOSS_CANDIDATE_ID =
  "dw-mission-openmoss-runtime-orchestration-2026-03-26";
const OPENMOSS_PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-01-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-record.md";
const REPEATABILITY_GAP_ID = "gap-repeatable-runtime-promotions";

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function main() {
  const report = aggregateRunEvidence({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const capabilityGaps = readJson<{ gaps: CapabilityGapRecord[] }>(CAPABILITY_GAPS_PATH);
  const gapWorklist = readJson<DiscoveryGapWorklist>(GAP_WORKLIST_PATH);
  const intakeQueue = readJson<{ entries: DiscoveryQueueEntry[] }>(INTAKE_QUEUE_PATH);
  const activeMissionMarkdown = fs.readFileSync(ACTIVE_MISSION_PATH, "utf8");
  const selection = readTopEligibleDiscoveryGapFromCanonicalWorklist({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.ok(
    report.manualRuntimePromotionCycles.totalManualPromotionRecords >= 2,
    "expected at least two manual Runtime promotion cycles once repeatability is proved",
  );
  assert.ok(
    report.manualRuntimePromotionCycles.validatedLocallyCount >= 2,
    "expected both manual Runtime promotion cycles to remain locally validated",
  );

  const scientifyCycle = report.manualRuntimePromotionCycles.cycles.find(
    (cycle) => cycle.candidateId === SCIENTIFY_CANDIDATE_ID,
  );
  const openmossCycle = report.manualRuntimePromotionCycles.cycles.find(
    (cycle) => cycle.candidateId === OPENMOSS_CANDIDATE_ID,
  );
  assert.ok(scientifyCycle, "expected Scientify to be the first manual Runtime promotion cycle");
  assert.ok(openmossCycle, "expected OpenMOSS to prove Runtime promotion repeatability");
  assert.equal(scientifyCycle.promotionRecordPath, SCIENTIFY_PROMOTION_RECORD_PATH);
  assert.equal(scientifyCycle.qualityGateResult, "pass");
  assert.equal(scientifyCycle.validationState, "validated_locally");
  assert.ok(
    scientifyCycle.proposedRuntimeStatus?.includes("manual"),
    "expected Scientify cycle to remain manual",
  );
  assert.equal(openmossCycle.promotionRecordPath, OPENMOSS_PROMOTION_RECORD_PATH);
  assert.equal(openmossCycle.qualityGateResult, "pass");
  assert.equal(openmossCycle.validationState, "validated_locally");
  assert.ok(
    openmossCycle.proposedRuntimeStatus?.includes("manual"),
    "expected OpenMOSS cycle to remain manual",
  );

  const repeatabilityGap = capabilityGaps.gaps.find((gap) => gap.gap_id === REPEATABILITY_GAP_ID);
  assert.ok(repeatabilityGap, "expected Runtime repeatability gap to be registered");
  assert.equal(repeatabilityGap?.resolved_at ?? null, "2026-04-01");
  assert.ok(
    (repeatabilityGap?.candidate_ids ?? []).includes(SCIENTIFY_CANDIDATE_ID),
    "expected the repeatability gap history to remain anchored to the completed Scientify cycle",
  );
  assert.ok(
    (repeatabilityGap?.candidate_ids ?? []).includes(OPENMOSS_CANDIDATE_ID),
    "expected the resolved repeatability gap to include the OpenMOSS repeatability proof",
  );
  assert.ok(
    repeatabilityGap?.resolution_notes?.includes("OpenMOSS"),
    "expected resolution notes to explain the second manual promotion record",
  );

  const generatedWorklist = generateDiscoveryGapWorklist({
    updatedAt: gapWorklist.updatedAt,
    gaps: capabilityGaps.gaps,
    intakeQueueEntries: intakeQueue.entries,
    activeMissionMarkdown,
  });
  assert.deepEqual(
    gapWorklist,
    generatedWorklist,
    "gap-worklist.json should match the canonical generated worklist",
  );

  assert.ok(
    gapWorklist.items.every((item) => item.gap_id !== REPEATABILITY_GAP_ID),
    "expected the resolved repeatability gap to disappear from the open worklist",
  );
  assert.equal(
    selection.selectedGap?.gap_id ?? null,
    null,
    "expected no open Discovery-native gap to remain after repeatability is resolved",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        manualRuntimePromotionCycles: report.manualRuntimePromotionCycles,
        repeatabilityGap,
        selectedGap: selection.selectedGap,
      },
      null,
      2,
    )}\n`,
  );
}

main();
