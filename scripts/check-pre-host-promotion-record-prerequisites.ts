import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { evaluatePreHostRuntimePromotionRecordPrerequisites } from "../runtime/lib/runtime-promotion-record-writer.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCIENTIFY_PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md";
const OPENMOSS_PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-readiness.md";

function main() {
  const scientify = evaluatePreHostRuntimePromotionRecordPrerequisites({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath: SCIENTIFY_PROMOTION_READINESS_PATH,
  });
  const openmoss = evaluatePreHostRuntimePromotionRecordPrerequisites({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath: OPENMOSS_PROMOTION_READINESS_PATH,
  });

  assert.equal(
    scientify.candidateId,
    "dw-source-scientify-research-workflow-plugin-2026-03-27",
  );
  assert.equal(
    scientify.readyForPreHostPromotionRecordPreparation,
    false,
    "expected Scientify to have moved past pre-host preparation once the manual promotion record exists",
  );
  assert.deepEqual(
    scientify.missingPrerequisites,
    ["promotionRecordState.unopened"],
    "expected only the unopened gate to close after the manual promotion record is opened",
  );
  assert.equal(scientify.executionGuards.hostSelected, true);
  assert.equal(scientify.executionGuards.nonExecuting, true);
  assert.equal(scientify.executionGuards.notPromoted, true);
  assert.equal(scientify.executionGuards.notHostIntegrated, true);
  assert.equal(scientify.compileContractArtifact.present, true);
  assert.equal(scientify.promotionSpecificationArtifact.present, true);
  assert.equal(scientify.linkedArtifacts.capabilityBoundary.present, true);
  assert.equal(scientify.linkedArtifacts.runtimeProof.present, true);
  assert.equal(scientify.linkedArtifacts.runtimeRecord.present, true);
  assert.equal(scientify.linkedArtifacts.followUp.present, true);
  assert.equal(scientify.linkedArtifacts.routing.present, true);
  assert.equal(scientify.linkedArtifacts.callableStub.present, true);
  assert.equal(scientify.linkedArtifacts.callableStub.required, true);
  assert.equal(scientify.promotionRecordState.unopened, false);
  assert.deepEqual(scientify.promotionRecordState.existingPaths, [
    "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md",
  ]);

  assert.equal(
    openmoss.candidateId,
    "dw-mission-openmoss-runtime-orchestration-2026-03-26",
  );
  assert.equal(
    openmoss.readyForPreHostPromotionRecordPreparation,
    false,
    "expected OpenMOSS to have moved past pre-host preparation once the bounded manual promotion record exists",
  );
  assert.deepEqual(
    openmoss.missingPrerequisites,
    ["promotionRecordState.unopened"],
    "expected OpenMOSS to fail only the unopened gate after the manual promotion record is opened",
  );
  assert.equal(openmoss.executionGuards.hostSelected, true);
  assert.equal(openmoss.executionGuards.nonExecuting, true);
  assert.equal(openmoss.executionGuards.notPromoted, true);
  assert.equal(openmoss.executionGuards.notHostIntegrated, true);
  assert.equal(openmoss.compileContractArtifact.present, true);
  assert.equal(openmoss.promotionSpecificationArtifact.present, true);
  assert.equal(openmoss.linkedArtifacts.capabilityBoundary.present, true);
  assert.equal(openmoss.linkedArtifacts.runtimeProof.present, true);
  assert.equal(openmoss.linkedArtifacts.runtimeRecord.present, true);
  assert.equal(openmoss.linkedArtifacts.followUp.present, true);
  assert.equal(openmoss.linkedArtifacts.routing.present, true);
  assert.equal(openmoss.linkedArtifacts.callableStub.present, false);
  assert.equal(openmoss.linkedArtifacts.callableStub.required, false);
  assert.equal(openmoss.promotionRecordState.unopened, false);
  assert.deepEqual(openmoss.promotionRecordState.existingPaths, [
    "runtime/07-promotion-records/2026-04-01-dw-mission-openmoss-runtime-orchestration-2026-03-26-promotion-record.md",
  ]);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          checker: "pre-host-promotion-record-prerequisites",
          scientify: {
            candidateId: scientify.candidateId,
            readyForPreparation:
              scientify.readyForPreHostPromotionRecordPreparation,
            proposedHost: scientify.proposedHost,
            executionGuards: scientify.executionGuards,
            linkedArtifacts: scientify.linkedArtifacts,
            compileContractArtifact: scientify.compileContractArtifact,
            promotionSpecificationArtifact:
              scientify.promotionSpecificationArtifact,
            promotionRecordState: scientify.promotionRecordState,
          },
          openmoss: {
            candidateId: openmoss.candidateId,
            readyForPreparation:
              openmoss.readyForPreHostPromotionRecordPreparation,
            proposedHost: openmoss.proposedHost,
            executionGuards: openmoss.executionGuards,
            linkedArtifacts: openmoss.linkedArtifacts,
            compileContractArtifact: openmoss.compileContractArtifact,
            promotionSpecificationArtifact:
              openmoss.promotionSpecificationArtifact,
            promotionRecordState: openmoss.promotionRecordState,
          },
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
