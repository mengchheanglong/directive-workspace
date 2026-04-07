import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readStandaloneLiveMiniSweAgentDescriptor } from "../hosts/standalone-host/runtime-lane.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import { readDirectiveRuntimePromotionSpecification } from "../runtime/lib/runtime-promotion-specification.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_live_mini_swe_agent_runtime_promotion";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-record.md";
const REGISTRY_ENTRY_PATH =
  "runtime/08-registry/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-registry-entry.md";
const EXPECTED_NEXT_LEGAL_STEP =
  "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.";

function readBullet(content: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^-\\s+${escaped}\\s*:\\s*(.+)$`, "im"));
  return match?.[1]?.replace(/^`|`$/g, "").trim() ?? null;
}

function main() {
  const promotionRecordAbsolutePath = path.join(DIRECTIVE_ROOT, PROMOTION_RECORD_PATH);
  assert.ok(fs.existsSync(promotionRecordAbsolutePath), "live mini-swe promotion record should exist");

  const promotionRecordContent = fs.readFileSync(promotionRecordAbsolutePath, "utf8");
  const readinessFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
  }).focus;
  const promotionRecordFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_RECORD_PATH,
  }).focus;
  const descriptor = readStandaloneLiveMiniSweAgentDescriptor({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const promotionSpecification = readDirectiveRuntimePromotionSpecification({
    directiveRoot: DIRECTIVE_ROOT,
    promotionSpecificationPath: PROMOTION_SPECIFICATION_PATH,
  });

  assert.ok(readinessFocus?.ok, "live mini-swe promotion-readiness focus should resolve");
  assert.ok(promotionRecordFocus?.ok, "live mini-swe promotion-record focus should resolve");
  assert.equal(readinessFocus.currentStage, "runtime.promotion_record.opened");
  assert.equal(readinessFocus.currentHead.artifactPath, PROMOTION_RECORD_PATH);
  assert.equal(readinessFocus.linkedArtifacts.runtimePromotionRecordPath, PROMOTION_RECORD_PATH);
  assert.equal(promotionRecordFocus.artifactKind, "runtime_promotion_record");
  assert.equal(promotionRecordFocus.artifactStage, "runtime.promotion_record.opened");
  assert.equal(promotionRecordFocus.currentStage, "runtime.promotion_record.opened");
  assert.equal(promotionRecordFocus.nextLegalStep, EXPECTED_NEXT_LEGAL_STEP);
  assert.deepEqual(promotionRecordFocus.runtime?.promotionReadinessBlockers ?? [], []);
  assert.equal(descriptor.currentStage, "runtime.promotion_record.opened");
  assert.equal(descriptor.linkedArtifacts.runtimePromotionRecordPath, PROMOTION_RECORD_PATH);
  assert.equal(
    promotionSpecification.linkedArtifacts.promotionRecordPath,
    PROMOTION_RECORD_PATH,
  );

  assert.equal(
    readBullet(promotionRecordContent, "Candidate id"),
    "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Linked Runtime record"),
    "runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Target host"),
    "Directive Workspace standalone host (hosts/standalone-host/)",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Quality gate profile"),
    "live_mini_swe_agent_standalone_host_manual_promotion_guard/v1",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Promotion profile family"),
    "bounded_live_mini_swe_agent_standalone_host_manual_promotion",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Proof shape"),
    "live_mini_swe_agent_standalone_host_manual_promotion_snapshot/v1",
  );
  assert.equal(
    readBullet(promotionRecordContent, "Primary host checker"),
    "npm run check:directive-live-mini-swe-agent-runtime-promotion",
  );
  assert.equal(readBullet(promotionRecordContent, "Quality gate result"), "pass");
  assert.equal(readBullet(promotionRecordContent, "Validation state"), "validated_locally");
  assert.ok(
    !fs.existsSync(path.join(DIRECTIVE_ROOT, REGISTRY_ENTRY_PATH)),
    "live mini-swe registry acceptance should remain unopened after the manual promotion-record slice",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        candidateId: readinessFocus.candidateId,
        currentStage: readinessFocus.currentStage,
        currentHead: readinessFocus.currentHead,
        promotionRecordPath: PROMOTION_RECORD_PATH,
        promotionSpecificationPath: PROMOTION_SPECIFICATION_PATH,
        registryEntryPresent: false,
      },
      null,
      2,
    )}\n`,
  );
}

main();
