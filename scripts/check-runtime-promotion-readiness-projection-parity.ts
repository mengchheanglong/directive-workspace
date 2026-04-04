import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimePromotionReadinessProjectionSet,
  writeDirectiveRuntimePromotionReadinessProjectionSet,
} from "../shared/lib/runtime-promotion-readiness-projections.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import { openDirectiveRuntimePromotionReadiness } from "../shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts";
import type { DiscoveryIntakeQueueEntry } from "../shared/lib/discovery-intake-queue-writer.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import {
  extractOpenedBy,
  readJson,
  uniqueRelativePaths,
  writeJson,
} from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPECTED_PRE_PROMOTION_NEXT_STEP =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
const PROMOTION_CASES = [
  {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
    promotionReadinessPath: "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
  },
  {
    candidateId: "dw-pressure-openmoss-architecture-loop-2026-03-26",
    followUpPath: "runtime/follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-capability-boundary.md",
    promotionReadinessPath: "runtime/05-promotion-readiness/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-promotion-readiness.md",
  },
  {
    candidateId: "dw-source-temporal-durable-execution-2026-04-01",
    followUpPath: "runtime/follow-up/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-capability-boundary.md",
    promotionReadinessPath: "runtime/05-promotion-readiness/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-promotion-readiness.md",
  },
  {
    candidateId: "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
    followUpPath: "runtime/follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md",
    promotionReadinessPath: "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md",
  },
  {
    candidateId: "dw-live-scientify-engine-pressure-2026-03-24",
    followUpPath: "runtime/follow-up/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-capability-boundary.md",
    promotionReadinessPath: "runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md",
  },
] as const;

function copyRelativeFile(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  assert.ok(fs.existsSync(sourcePath), `Missing source file for parity copy: ${relativePath}`);
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function assertPromotionReadinessBaseContract(input: {
  markdown: string;
  candidateId: string;
  promotionReadinessPath: string;
  runtimeCapabilityBoundaryPath: string;
  runtimeProofPath: string;
  runtimeRecordPath: string;
  followUpPath: string;
  approvedBy: string;
}) {
  const expectedNeedles = [
    "## runtime capability boundary identity",
    `- Candidate id: \`${input.candidateId}\``,
    `- Runtime capability boundary path: \`${input.runtimeCapabilityBoundaryPath}\``,
    `- Source Runtime proof artifact: \`${input.runtimeProofPath}\``,
    `- Source Runtime v0 record: \`${input.runtimeRecordPath}\``,
    `- Source Runtime follow-up record: \`${input.followUpPath}\``,
    "- Promotion-readiness decision: `approved_for_non_executing_promotion_readiness`",
    `- Opened by: \`${input.approvedBy}\``,
    "- Current status: `promotion_readiness_opened`",
    "## bounded runtime usefulness preserved",
    "## what is now explicit",
    "## validation boundary",
    "## rollback boundary",
    "## artifact linkage",
    `- Promotion-readiness artifact: \`${input.promotionReadinessPath}\``,
    `- Runtime capability boundary: \`${input.runtimeCapabilityBoundaryPath}\``,
    `- Runtime proof artifact: \`${input.runtimeProofPath}\``,
    `- Runtime v0 record: \`${input.runtimeRecordPath}\``,
    `- Source Runtime follow-up record: \`${input.followUpPath}\``,
  ];

  for (const needle of expectedNeedles) {
    assert.ok(
      input.markdown.includes(needle),
      `Promotion-readiness base contract missing expected content: ${needle}`,
    );
  }
}

function main() {
  const queueDocument = readJson<{ entries: DiscoveryIntakeQueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );

  withTempDirectiveRoot({ prefix: "directive-runtime-promotion-readiness-projection-parity-" }, (directiveRoot) => {
    const checked = [];

    for (const promotionCase of PROMOTION_CASES) {
      const queueEntry = queueDocument.entries.find(
        (item) => item.candidate_id === promotionCase.candidateId,
      ) ?? null;
      assert.ok(queueEntry, `Missing Runtime promotion-readiness case in queue: ${promotionCase.candidateId}`);
      const routing = readDirectiveDiscoveryRoutingArtifact({
        directiveRoot: DIRECTIVE_ROOT,
        routingPath: queueEntry.routing_record_path ?? "",
      });

      for (const relativePath of uniqueRelativePaths([
        queueEntry.intake_record_path,
        routing.linkedTriageRecord,
        queueEntry.routing_record_path,
        routing.engineRunRecordPath,
        routing.engineRunReportPath,
        promotionCase.followUpPath,
        promotionCase.runtimeRecordPath,
      ])) {
        copyRelativeFile(relativePath, DIRECTIVE_ROOT, directiveRoot, "Missing source file for parity copy");
      }

      writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), {
        status: "primary",
        updatedAt: "2026-03-29",
        entries: [
          {
            ...queueEntry,
            status: "routed",
            completed_at: null,
            result_record_path: promotionCase.followUpPath,
          },
        ],
      });

      const liveProofMarkdown = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, promotionCase.runtimeProofPath),
        "utf8",
      );
      const liveCapabilityBoundaryMarkdown = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, promotionCase.runtimeCapabilityBoundaryPath),
        "utf8",
      );
      const livePromotionReadinessMarkdown = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, promotionCase.promotionReadinessPath),
        "utf8",
      );
      const liveFocus = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: promotionCase.promotionReadinessPath,
      }).focus;
      assert.ok(liveFocus?.ok, `Live Runtime promotion-readiness state did not resolve for ${promotionCase.candidateId}`);

      openDirectiveRuntimeRecordProof({
        directiveRoot,
        runtimeRecordPath: promotionCase.runtimeRecordPath,
        approved: true,
        approvedBy: extractOpenedBy(liveProofMarkdown),
      });
      openDirectiveRuntimeProofRuntimeCapabilityBoundary({
        directiveRoot,
        runtimeProofPath: promotionCase.runtimeProofPath,
        approved: true,
        approvedBy: extractOpenedBy(liveCapabilityBoundaryMarkdown),
      });

      const result = openDirectiveRuntimePromotionReadiness({
        directiveRoot,
        capabilityBoundaryPath: promotionCase.runtimeCapabilityBoundaryPath,
        approved: true,
        approvedBy: extractOpenedBy(livePromotionReadinessMarkdown),
      });
      assert.equal(result.created, true, `Runtime promotion-readiness opener should create the promotion artifact for ${promotionCase.candidateId}`);

      const generatedPromotionReadiness = fs.readFileSync(
        path.join(directiveRoot, promotionCase.promotionReadinessPath),
        "utf8",
      );
      assertPromotionReadinessBaseContract({
        markdown: generatedPromotionReadiness,
        candidateId: promotionCase.candidateId,
        promotionReadinessPath: promotionCase.promotionReadinessPath,
        runtimeCapabilityBoundaryPath: promotionCase.runtimeCapabilityBoundaryPath,
        runtimeProofPath: promotionCase.runtimeProofPath,
        runtimeRecordPath: promotionCase.runtimeRecordPath,
        followUpPath: promotionCase.followUpPath,
        approvedBy: extractOpenedBy(livePromotionReadinessMarkdown),
      });

      const projectionSet = materializeDirectiveRuntimePromotionReadinessProjectionSet({
        directiveRoot,
        caseId: promotionCase.candidateId,
      });
      assert.equal(projectionSet.ok, true, `Runtime promotion-readiness projection materialization failed for ${promotionCase.candidateId}`);
      assert.equal(projectionSet.markdown.promotionReadiness, generatedPromotionReadiness);
      assert.equal(projectionSet.paths.promotionReadinessPath, promotionCase.promotionReadinessPath);
      assert.equal(projectionSet.compatibility.capabilityBoundaryPath, promotionCase.runtimeCapabilityBoundaryPath);
      assert.equal(projectionSet.compatibility.runtimeProofPath, promotionCase.runtimeProofPath);
      assert.equal(projectionSet.compatibility.runtimeRecordPath, promotionCase.runtimeRecordPath);
      assert.equal(projectionSet.compatibility.followUpPath, promotionCase.followUpPath);

      fs.unlinkSync(path.join(directiveRoot, promotionCase.promotionReadinessPath));
      const regenerated = writeDirectiveRuntimePromotionReadinessProjectionSet({
        directiveRoot,
        caseId: promotionCase.candidateId,
      });
      assert.equal(regenerated.ok, true, `Runtime promotion-readiness projection rewrite failed for ${promotionCase.candidateId}`);
      assert.equal(
        fs.readFileSync(path.join(directiveRoot, promotionCase.promotionReadinessPath), "utf8"),
        generatedPromotionReadiness,
      );

      assert.throws(
        () =>
          openDirectiveRuntimePromotionReadiness({
            directiveRoot,
            capabilityBoundaryPath: promotionCase.runtimeCapabilityBoundaryPath,
            approved: true,
            approvedBy: extractOpenedBy(livePromotionReadinessMarkdown),
          }),
        /live current stage/i,
        `Runtime promotion-readiness opener should reject repeated approval after advancement for ${promotionCase.candidateId}`,
      );

      const tempFocus = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: promotionCase.promotionReadinessPath,
      }).focus;
      assert.ok(tempFocus?.ok, `Generated Runtime promotion-readiness state did not resolve for ${promotionCase.candidateId}`);
      assert.equal(tempFocus.currentHead.artifactPath, promotionCase.promotionReadinessPath);
      assert.equal(tempFocus.currentStage, "runtime.promotion_readiness.opened");
      assert.equal(tempFocus.nextLegalStep, EXPECTED_PRE_PROMOTION_NEXT_STEP);
      assert.equal(tempFocus.runtime?.proposedHost, liveFocus.runtime?.proposedHost);

      checked.push({
        candidateId: promotionCase.candidateId,
        currentStage: tempFocus.currentStage,
        nextLegalStep: tempFocus.nextLegalStep,
        currentHead: tempFocus.currentHead.artifactPath,
      });
    }

    process.stdout.write(`${JSON.stringify({
      ok: true,
      checked,
    }, null, 2)}\n`);
  });
}

main();
