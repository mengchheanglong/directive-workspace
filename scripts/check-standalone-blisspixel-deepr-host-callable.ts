import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_blisspixel_deepr_host_callable";
const CANDIDATE_ID =
  "research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-promotion-record.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-promotion-specification.json";
const REQUIRED_CHAIN_WITHOUT_SPEC = [
  "discovery/03-routing-log/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402--routing-record.md",
  "runtime/00-follow-up/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t-runtime-follow-up-record.md",
  "runtime/02-records/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-runtime-record.md",
  "runtime/03-proof/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-proof.md",
  "runtime/04-capability-boundaries/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-runtime-capability-boundary.md",
  "runtime/05-promotion-readiness/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-promotion-readiness.md",
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
    const descriptor = await host.readBlisspixelDeeprDescriptor();
    assert.equal(descriptor.candidateId, CANDIDATE_ID);
    assert.equal(descriptor.currentStage, "runtime.promotion_record.opened");
    assert.equal(
      descriptor.proposedHost,
      "Directive Workspace standalone host (hosts/standalone-host/)",
    );
    assert.equal(
      descriptor.linkedArtifacts.runtimePromotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      descriptor.linkedArtifacts.runtimePromotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(descriptor.adapter.runtimeExecutionAvailable, false);
    assert.equal(descriptor.adapter.hostIntegrationClaimed, false);

    const result = await host.invokeBlisspixelDeeprDescriptorCallable({
      action: "summarize_descriptor",
      includeOpenDecisions: true,
      executedAt: "2026-04-07T10:15:00.000Z",
    });

    assert.equal(result.candidateId, CANDIDATE_ID);
    assert.equal(result.currentStage, "runtime.promotion_record.opened");
    assert.equal(
      result.callable.callableId,
      "standalone_host.blisspixel_deepr_descriptor_summary.v1",
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
    assert.equal(result.execution.status, "ok");
    assert.equal(result.execution.executedAt, "2026-04-07T10:15:00.000Z");
    assert.ok(result.execution.output.openDecisions.length > 0);
    assert.match(
      result.execution.output.stopLine,
      /imported-source runtime execution.*remain unopened/u,
    );
  } finally {
    host.close();
  }
}

async function assertMissingPromotionSpecificationFailsClosed() {
  await withTempDirectiveRoot(
    { prefix: "dw-standalone-blisspixel-deepr-callable-boundary-" },
    async (directiveRoot) => {
      for (const relativePath of REQUIRED_CHAIN_WITHOUT_SPEC) {
        copyArtifact(relativePath, directiveRoot);
      }

      const host = createStandaloneFilesystemHost({ directiveRoot });
      try {
        await assert.rejects(
          () => host.invokeBlisspixelDeeprDescriptorCallable({
            action: "summarize_descriptor",
          }),
          /ENOENT|promotion_specification/u,
        );
      } finally {
        host.close();
      }
    },
  );
}

async function main() {
  await assertPositiveCallablePath();
  await assertMissingPromotionSpecificationFailsClosed();

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        candidateId: CANDIDATE_ID,
        callableId: "standalone_host.blisspixel_deepr_descriptor_summary.v1",
        boundary: "missing_promotion_specification_blocks_callable",
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
