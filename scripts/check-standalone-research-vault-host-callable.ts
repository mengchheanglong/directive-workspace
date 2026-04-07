import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_research_vault_host_callable";
const CANDIDATE_ID =
  "research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-record.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-specification.json";
const HOST_SELECTION_RESOLUTION_PATH =
  "runtime/05-promotion-readiness/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-host-selection-resolution.md";
const REQUIRED_CHAIN = [
  "discovery/03-routing-log/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702--routing-record.md",
  "runtime/00-follow-up/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643-runtime-follow-up-record.md",
  "runtime/02-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-runtime-record.md",
  "runtime/03-proof/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-proof.md",
  "runtime/04-capability-boundaries/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-runtime-capability-boundary.md",
  "runtime/05-promotion-readiness/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-readiness.md",
  PROMOTION_SPECIFICATION_PATH,
  PROMOTION_RECORD_PATH,
];

function copyArtifact(relativePath: string, directiveRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  const targetPath = path.join(directiveRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

async function assertPositiveCallablePath() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const result = await host.invokeResearchVaultDescriptorCallable({
      action: "summarize_descriptor",
      includeOpenDecisions: true,
      executedAt: "2026-04-07T09:45:00.000Z",
    });

    assert.equal(result.candidateId, CANDIDATE_ID);
    assert.equal(result.currentStage, "runtime.promotion_record.opened");
    assert.equal(
      result.callable.callableId,
      "standalone_host.research_vault_descriptor_summary.v1",
    );
    assert.equal(result.callable.descriptorCallableExecuted, true);
    assert.equal(result.callable.sourceRuntimeExecutionClaimed, false);
    assert.equal(result.callable.hostIntegrationClaimed, false);
    assert.equal(result.callable.registryAcceptanceClaimed, false);
    assert.equal(result.callable.promotionAutomation, false);
    assert.equal(
      result.hostCallableAdapter.contractVersion,
      "host_callable_adapter.v1",
    );
    assert.equal(
      result.hostCallableAdapter.contractPath,
      "shared/contracts/host-callable-adapter.md",
    );
    assert.equal(result.hostCallableAdapter.capabilityKind, "descriptor_callable");
    assert.equal(result.hostCallableAdapter.acceptance.callableThroughHost, true);
    assert.equal(result.hostCallableAdapter.acceptance.descriptorCallableOnly, true);
    assert.equal(result.hostCallableAdapter.acceptance.runtimeCallableExecution, false);
    assert.equal(
      result.hostCallableAdapter.acceptance.sourceRuntimeExecutionClaimed,
      false,
    );
    assert.equal(result.hostCallableAdapter.acceptance.hostIntegrationClaimed, false);
    assert.equal(
      result.hostCallableAdapter.acceptance.registryAcceptanceClaimed,
      false,
    );
    assert.equal(result.hostCallableAdapter.acceptance.promotionAutomation, false);
    assert.equal(
      result.hostCallableAdapter.evidencePaths.promotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      result.hostCallableAdapter.evidencePaths.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(
      result.hostCallableAdapter.evidencePaths.hostSelectionResolutionPath,
      HOST_SELECTION_RESOLUTION_PATH,
    );
    assert.equal(result.execution.status, "ok");
    assert.equal(result.execution.executedAt, "2026-04-07T09:45:00.000Z");
    assert.equal(
      result.execution.output.evidencePaths.promotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      result.execution.output.evidencePaths.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(
      result.execution.output.evidencePaths.hostSelectionResolutionPath,
      HOST_SELECTION_RESOLUTION_PATH,
    );
    assert.ok(result.execution.output.openDecisions.length > 0);
    assert.match(
      result.execution.output.stopLine,
      /imported-source runtime execution.*remain unopened/u,
    );
  } finally {
    host.close();
  }
}

async function assertMissingHostSelectionResolutionFailsClosed() {
  await withTempDirectiveRoot(
    { prefix: "dw-standalone-research-vault-callable-boundary-" },
    async (directiveRoot) => {
      for (const relativePath of REQUIRED_CHAIN) {
        copyArtifact(relativePath, directiveRoot);
      }

      const host = createStandaloneFilesystemHost({ directiveRoot });
      try {
        await assert.rejects(
          () =>
            host.invokeResearchVaultDescriptorCallable({
              action: "summarize_descriptor",
            }),
          /research_vault_host_descriptor_requires_host_selection_resolution/u,
        );
      } finally {
        host.close();
      }
    },
  );
}

async function main() {
  await assertPositiveCallablePath();
  await assertMissingHostSelectionResolutionFailsClosed();

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        candidateId: CANDIDATE_ID,
        callableId: "standalone_host.research_vault_descriptor_summary.v1",
        boundary: "missing_host_selection_resolution_blocks_callable",
      },
      null,
      2,
    )}\n`,
  );
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
