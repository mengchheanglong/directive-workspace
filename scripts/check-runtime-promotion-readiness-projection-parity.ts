import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimePromotionReadinessProjectionSet,
  writeDirectiveRuntimePromotionReadinessProjectionSet,
} from "../shared/lib/runtime-promotion-readiness-projections.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import { openDirectiveRuntimePromotionReadiness } from "../shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  status: string;
  routing_target: string | null;
  intake_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
  notes?: string | null;
  completed_at?: string | null;
  operating_mode?: string | null;
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyRelativeFile(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  assert.ok(fs.existsSync(sourcePath), `Missing source file for parity copy: ${relativePath}`);
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function extractOpenedBy(markdown: string) {
  const match = markdown.match(/- Opened by: `([^`]+)`/u);
  assert.ok(match?.[1], "Unable to parse Runtime opened-by actor");
  return match[1];
}

function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
}

function main() {
  const queueDocument = readJson<{ entries: QueueEntry[] }>(
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
        copyRelativeFile(relativePath, directiveRoot);
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
      assert.equal(
        generatedPromotionReadiness,
        livePromotionReadinessMarkdown,
        `Generated Runtime promotion-readiness drifted for ${promotionCase.candidateId}`,
      );

      const projectionSet = materializeDirectiveRuntimePromotionReadinessProjectionSet({
        directiveRoot,
        caseId: promotionCase.candidateId,
      });
      assert.equal(projectionSet.ok, true, `Runtime promotion-readiness projection materialization failed for ${promotionCase.candidateId}`);
      assert.equal(projectionSet.markdown.promotionReadiness, livePromotionReadinessMarkdown);
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
        livePromotionReadinessMarkdown,
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
      assert.equal(tempFocus.currentHead.artifactPath, liveFocus.currentHead.artifactPath);
      assert.equal(tempFocus.currentStage, liveFocus.currentStage);
      assert.equal(tempFocus.nextLegalStep, liveFocus.nextLegalStep);

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
