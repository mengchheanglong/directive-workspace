import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import {
  DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
  readDirectiveRuntimePromotionSpecification,
} from "../shared/lib/runtime-promotion-specification.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_live_mini_swe_agent_host_adapter";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-specification.json";
const CALLABLE_STUB_PATH =
  "runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-record.md";

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const descriptor = await host.readLiveMiniSweAgentDescriptor();
    const readinessFocus = resolveDirectiveWorkspaceState({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: PROMOTION_READINESS_PATH,
    }).focus;
    const promotionSpecification = readDirectiveRuntimePromotionSpecification({
      directiveRoot: DIRECTIVE_ROOT,
      promotionSpecificationPath: PROMOTION_SPECIFICATION_PATH,
    });

    assert.ok(readinessFocus?.ok, "live mini-swe promotion-readiness focus should resolve");
    assert.equal(descriptor.currentStage, "runtime.promotion_record.opened");
    assert.equal(
      descriptor.nextLegalStep,
      "No automatic Runtime step is open; registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.",
    );
    assert.deepEqual(descriptor.promotionReadinessBlockers, []);
    assert.equal(
      descriptor.linkedArtifacts.runtimePromotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      descriptor.linkedArtifacts.runtimePromotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(descriptor.linkedArtifacts.runtimeCallableStubPath, CALLABLE_STUB_PATH);
    assert.equal(
      descriptor.adapter.adapterId,
      "dw-live-mini-swe-agent-engine-pressure-2026-03-24:standalone_host:promotion_spec_adapter",
    );
    assert.equal(descriptor.adapter.loadMode, "read_promotion_specification_only");
    assert.equal(
      descriptor.adapter.compileContractArtifact,
      DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
    );
    assert.equal(
      descriptor.adapter.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(descriptor.adapter.callableStubPath, CALLABLE_STUB_PATH);
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
      promotionSpecification.openDecisions,
    );
    assert.equal(
      descriptor.adapter.hostConsumableDescription,
      promotionSpecification.hostConsumableDescription,
    );
    assert.equal(
      readinessFocus?.linkedArtifacts.runtimePromotionSpecificationPath,
      descriptor.adapter.promotionSpecificationPath,
    );

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          candidateId: descriptor.candidateId,
          adapterId: descriptor.adapter.adapterId,
          currentStage: descriptor.currentStage,
          promotionSpecificationPath: descriptor.adapter.promotionSpecificationPath,
          compileContractArtifact: descriptor.adapter.compileContractArtifact,
          callableStubPath: descriptor.adapter.callableStubPath,
          openDecisions: descriptor.adapter.openDecisions,
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
