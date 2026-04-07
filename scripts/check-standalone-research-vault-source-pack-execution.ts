import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_research_vault_source_pack_execution";
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

function matchedSectionsFromResult(result: unknown) {
  if (!result || typeof result !== "object") {
    return [];
  }

  const matchedSections = (result as { matchedSections?: unknown }).matchedSections;
  return Array.isArray(matchedSections)
    ? matchedSections as Array<{ id?: unknown; score?: unknown }>
    : [];
}

async function assertPositiveSourcePackExecutionPath() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const result = await host.invokeResearchVaultSourcePackTool({
      tool: "query-source-pack",
      input: {
        query: "discovery acquisition phase model",
        includeEvidence: true,
        maxItems: 2,
      },
      executionAt: "2026-04-07T11:15:00.000Z",
      persistArtifacts: false,
    });
    const matchedSections = matchedSectionsFromResult(result.execution.rawResult.result);

    assert.equal(result.candidateId, CANDIDATE_ID);
    assert.equal(result.currentStage, "runtime.promotion_record.opened");
    assert.equal(result.adapter.runtimeInternalsBypassed, false);
    assert.equal(result.adapter.hostIntegrated, true);
    assert.equal(result.adapter.sourceRuntimeExecutionClaimed, false);
    assert.equal(result.adapter.promotionAutomation, false);
    assert.equal(result.adapter.automaticWorkflowAdvancement, false);
    assert.equal(
      result.hostCallableAdapter.contractVersion,
      "host_callable_adapter.v1",
    );
    assert.equal(
      result.hostCallableAdapter.capabilityKind,
      "runtime_callable_execution",
    );
    assert.equal(result.hostCallableAdapter.acceptance.callableThroughHost, true);
    assert.equal(
      result.hostCallableAdapter.acceptance.descriptorCallableOnly,
      false,
    );
    assert.equal(
      result.hostCallableAdapter.acceptance.runtimeCallableExecution,
      true,
    );
    assert.equal(
      result.hostCallableAdapter.acceptance.sourceRuntimeExecutionClaimed,
      false,
    );
    assert.equal(
      result.hostCallableAdapter.acceptance.hostIntegrationClaimed,
      true,
    );
    assert.equal(
      result.hostCallableAdapter.acceptance.registryAcceptanceClaimed,
      false,
    );
    assert.equal(
      result.hostCallableAdapter.acceptance.promotionAutomation,
      false,
    );
    assert.equal(
      result.hostCallableAdapter.acceptance.runtimeInternalsBypassed,
      false,
    );
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
    assert.equal(result.execution.record.boundary.hostIntegrated, false);
    assert.equal(result.execution.record.boundary.promotionAutomation, false);
    assert.equal(result.execution.record.invocation.status, "success");
    assert.equal(result.execution.rawResult.status, "success");
    assert.equal(result.execution.rawResult.ok, true);
    assert.equal(result.execution.absolutePaths, null);
    assert.equal(matchedSections.length, 2);
    assert.equal(matchedSections[0]?.id, "phase_model");
    assert.match(
      result.hostCallableAdapter.stopLine,
      /external Research Vault app.*remain unopened/u,
    );
  } finally {
    host.close();
  }
}

async function assertValidationErrorStaysBounded() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const result = await host.invokeResearchVaultSourcePackTool({
      tool: "query-source-pack",
      input: {
        query: "",
      },
      executionAt: "2026-04-07T11:16:00.000Z",
      persistArtifacts: false,
    });

    assert.equal(result.execution.rawResult.ok, false);
    assert.equal(result.execution.rawResult.status, "validation_error");
    assert.equal(result.hostCallableAdapter.acceptance.sourceRuntimeExecutionClaimed, false);
    assert.equal(result.hostCallableAdapter.acceptance.registryAcceptanceClaimed, false);
  } finally {
    host.close();
  }
}

async function assertMissingHostSelectionResolutionFailsClosed() {
  await withTempDirectiveRoot(
    { prefix: "dw-standalone-research-vault-source-pack-boundary-" },
    async (directiveRoot) => {
      for (const relativePath of REQUIRED_CHAIN) {
        copyArtifact(relativePath, directiveRoot);
      }

      const host = createStandaloneFilesystemHost({ directiveRoot });
      try {
        await assert.rejects(
          () =>
            host.invokeResearchVaultSourcePackTool({
              tool: "query-source-pack",
              input: {
                query: "discovery acquisition phase model",
              },
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
  await assertPositiveSourcePackExecutionPath();
  await assertValidationErrorStaysBounded();
  await assertMissingHostSelectionResolutionFailsClosed();

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        candidateId: CANDIDATE_ID,
        callableSurface: "standalone_host_runtime_research_vault_source_pack_query",
        boundary: "derived_source_pack_execution_without_source_app_execution",
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
