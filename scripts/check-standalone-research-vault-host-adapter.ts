import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import {
  DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
  readDirectiveRuntimePromotionSpecification,
} from "../runtime/lib/runtime-promotion-specification.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_research_vault_host_adapter";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-record.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-specification.json";
const HOST_SELECTION_RESOLUTION_PATH =
  "runtime/05-promotion-readiness/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-host-selection-resolution.md";

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const descriptor = await host.readResearchVaultDescriptor();
    const promotionRecordFocus = resolveDirectiveWorkspaceState({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: PROMOTION_RECORD_PATH,
    }).focus;
    const promotionSpecification = readDirectiveRuntimePromotionSpecification({
      directiveRoot: DIRECTIVE_ROOT,
      promotionSpecificationPath: PROMOTION_SPECIFICATION_PATH,
    });

    assert.ok(promotionRecordFocus?.ok, "research vault promotion-record focus should resolve");
    assert.equal(descriptor.currentStage, "runtime.promotion_record.opened");
    assert.equal(
      descriptor.nextLegalStep,
      "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.",
    );
    assert.equal(descriptor.originalProposedHost, "pending_host_selection");
    assert.equal(
      descriptor.resolvedHost,
      "Directive Workspace standalone host (hosts/standalone-host/)",
    );
    assert.equal(descriptor.resolutionDecision, "select_standalone");
    assert.equal(
      descriptor.linkedArtifacts.runtimePromotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      descriptor.linkedArtifacts.runtimePromotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(
      descriptor.linkedArtifacts.runtimeHostSelectionResolutionPath,
      HOST_SELECTION_RESOLUTION_PATH,
    );
    assert.equal(
      descriptor.adapter.adapterId,
      "research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.:standalone_host:research_vault_descriptor_adapter",
    );
    assert.equal(
      descriptor.adapter.loadMode,
      "read_promotion_record_and_specification_only",
    );
    assert.equal(
      descriptor.adapter.compileContractArtifact,
      DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
    );
    assert.equal(descriptor.adapter.promotionRecordPath, PROMOTION_RECORD_PATH);
    assert.equal(
      descriptor.adapter.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(
      descriptor.adapter.hostSelectionResolutionPath,
      HOST_SELECTION_RESOLUTION_PATH,
    );
    assert.equal(
      descriptor.adapter.integrationMode,
      promotionSpecification.integrationMode,
    );
    assert.equal(
      descriptor.adapter.targetRuntimeSurface,
      promotionSpecification.targetRuntimeSurface,
    );
    assert.deepEqual(
      descriptor.adapter.requiredGates,
      promotionSpecification.requiredGates,
    );
    assert.deepEqual(
      descriptor.adapter.openDecisions,
      promotionSpecification.openDecisions.filter(
        (entry) => !entry.startsWith("Host selection: "),
      ),
    );
    assert.equal(
      descriptor.adapter.hostConsumableDescription,
      `If promoted, Directive Workspace standalone host (hosts/standalone-host/) would receive a ${promotionSpecification.integrationMode} integration of "${descriptor.candidateName}" (${promotionSpecification.targetRuntimeSurface}). The host would need to provide a runtime surface for the integration mode "${promotionSpecification.integrationMode}" with the required gates: ${promotionSpecification.requiredGates.join(", ")}.`,
    );
    assert.equal(descriptor.adapter.runtimeExecutionAvailable, false);
    assert.equal(descriptor.adapter.hostIntegrationClaimed, false);
    assert.equal(
      promotionRecordFocus?.linkedArtifacts.runtimeHostSelectionResolutionPath,
      HOST_SELECTION_RESOLUTION_PATH,
    );

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          candidateId: descriptor.candidateId,
          adapterId: descriptor.adapter.adapterId,
          currentStage: descriptor.currentStage,
          promotionRecordPath: descriptor.adapter.promotionRecordPath,
          promotionSpecificationPath: descriptor.adapter.promotionSpecificationPath,
          hostSelectionResolutionPath: descriptor.adapter.hostSelectionResolutionPath,
          resolvedHost: descriptor.resolvedHost,
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    host.close();
  }
}

void main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checkerId: CHECKER_ID,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
