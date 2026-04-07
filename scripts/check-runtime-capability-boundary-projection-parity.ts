import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimeCapabilityBoundaryProjectionSet,
  writeDirectiveRuntimeCapabilityBoundaryProjectionSet,
} from "../runtime/lib/runtime-capability-boundary-projections.ts";
import { openDirectiveRuntimeRecordProof } from "../runtime/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../runtime/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import type { DiscoveryIntakeQueueEntry } from "../discovery/lib/discovery-intake-queue-writer.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../discovery/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import {
  copyRelativeFile,
  extractOpenedBy,
  readJson,
  uniqueRelativePaths,
  writeJson,
} from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNTIME_CAPABILITY_CASES = [
  {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    followUpPath: "runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  },
  {
    candidateId: "dw-mission-openmoss-runtime-orchestration-2026-03-26",
    followUpPath: "runtime/00-follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-capability-boundary.md",
  },
  {
    candidateId: "dw-pressure-openmoss-architecture-loop-2026-03-26",
    followUpPath: "runtime/00-follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-capability-boundary.md",
  },
  {
    candidateId: "dw-source-temporal-durable-execution-2026-04-01",
    followUpPath: "runtime/00-follow-up/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-capability-boundary.md",
  },
  {
    candidateId: "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
    followUpPath: "runtime/00-follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md",
  },
  {
    candidateId: "dw-live-scientify-engine-pressure-2026-03-24",
    followUpPath: "runtime/00-follow-up/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-capability-boundary.md",
  },
] as const;

function main() {
  const queueDocument = readJson<{ entries: DiscoveryIntakeQueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );

  withTempDirectiveRoot({ prefix: "directive-runtime-capability-boundary-projection-parity-" }, (directiveRoot) => {
    const tempQueue = {
      status: "primary",
      updatedAt: "2026-03-29",
      entries: [] as QueueEntry[],
    };

    for (const capabilityCase of RUNTIME_CAPABILITY_CASES) {
      const queueEntry = queueDocument.entries.find((item) => item.candidate_id === capabilityCase.candidateId) ?? null;
      assert.ok(queueEntry, `Missing Runtime capability-boundary case in queue: ${capabilityCase.candidateId}`);
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
        capabilityCase.followUpPath,
        capabilityCase.runtimeRecordPath,
      ])) {
        copyRelativeFile(relativePath, DIRECTIVE_ROOT, directiveRoot, "Missing source file for parity copy");
      }

      tempQueue.entries.push({
        ...queueEntry,
        status: "routed",
        completed_at: null,
        result_record_path: capabilityCase.followUpPath,
      });
    }

    writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), tempQueue);

    const checked = [];

    for (const capabilityCase of RUNTIME_CAPABILITY_CASES) {
      const liveProofMarkdown = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, capabilityCase.runtimeProofPath),
        "utf8",
      );
      const liveCapabilityBoundaryMarkdown = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, capabilityCase.runtimeCapabilityBoundaryPath),
        "utf8",
      );
      const liveFocus = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: capabilityCase.runtimeCapabilityBoundaryPath,
      }).focus;
      assert.ok(liveFocus?.ok, `Live Runtime capability-boundary state did not resolve for ${capabilityCase.candidateId}`);

      const proofOpenedBy = extractOpenedBy(liveProofMarkdown);
      openDirectiveRuntimeRecordProof({
        directiveRoot,
        runtimeRecordPath: capabilityCase.runtimeRecordPath,
        approved: true,
        approvedBy: proofOpenedBy,
      });

      const boundaryOpenedBy = extractOpenedBy(liveCapabilityBoundaryMarkdown);
      const result = openDirectiveRuntimeProofRuntimeCapabilityBoundary({
        directiveRoot,
        runtimeProofPath: capabilityCase.runtimeProofPath,
        approved: true,
        approvedBy: boundaryOpenedBy,
      });

      assert.equal(
        result.created,
        true,
        `Runtime capability-boundary open should create the boundary artifact for ${capabilityCase.candidateId}`,
      );

      const generatedCapabilityBoundary = fs.readFileSync(
        path.join(directiveRoot, capabilityCase.runtimeCapabilityBoundaryPath),
        "utf8",
      );
      assert.equal(
        generatedCapabilityBoundary,
        liveCapabilityBoundaryMarkdown,
        `Generated Runtime capability boundary drifted for ${capabilityCase.candidateId}`,
      );

      const projectionSet = materializeDirectiveRuntimeCapabilityBoundaryProjectionSet({
        directiveRoot,
        caseId: capabilityCase.candidateId,
      });
      assert.equal(
        projectionSet.ok,
        true,
        `Runtime capability-boundary projection materialization failed for ${capabilityCase.candidateId}`,
      );
      assert.equal(projectionSet.markdown.runtimeCapabilityBoundary, liveCapabilityBoundaryMarkdown);
      assert.equal(projectionSet.paths.runtimeCapabilityBoundaryPath, capabilityCase.runtimeCapabilityBoundaryPath);
      assert.equal(projectionSet.compatibility.runtimeProofPath, capabilityCase.runtimeProofPath);
      assert.equal(projectionSet.compatibility.runtimeRecordPath, capabilityCase.runtimeRecordPath);
      assert.equal(projectionSet.compatibility.followUpPath, capabilityCase.followUpPath);

      fs.unlinkSync(path.join(directiveRoot, capabilityCase.runtimeCapabilityBoundaryPath));
      const regenerated = writeDirectiveRuntimeCapabilityBoundaryProjectionSet({
        directiveRoot,
        caseId: capabilityCase.candidateId,
      });
      assert.equal(
        regenerated.ok,
        true,
        `Runtime capability-boundary projection rewrite failed for ${capabilityCase.candidateId}`,
      );
      assert.equal(
        fs.readFileSync(path.join(directiveRoot, capabilityCase.runtimeCapabilityBoundaryPath), "utf8"),
        liveCapabilityBoundaryMarkdown,
      );

      assert.throws(
        () =>
          openDirectiveRuntimeProofRuntimeCapabilityBoundary({
            directiveRoot,
            runtimeProofPath: capabilityCase.runtimeProofPath,
            approved: true,
            approvedBy: boundaryOpenedBy,
          }),
        /live current stage/i,
        `Runtime capability-boundary opener should reject repeated approval after the boundary exists for ${capabilityCase.candidateId}`,
      );

      for (const relativePath of uniqueRelativePaths([
        liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
        liveFocus.linkedArtifacts.runtimePromotionRecordPath,
        liveFocus.linkedArtifacts.runtimeCallableStubPath,
      ])) {
        copyRelativeFile(relativePath, DIRECTIVE_ROOT, directiveRoot, "Missing source file for parity copy");
      }

      const tempFocus = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: capabilityCase.runtimeCapabilityBoundaryPath,
      }).focus;
      assert.ok(tempFocus?.ok, `Generated Runtime capability-boundary state did not resolve for ${capabilityCase.candidateId}`);
      assert.equal(tempFocus.currentHead.artifactPath, liveFocus.currentHead.artifactPath);
      assert.equal(tempFocus.currentStage, liveFocus.currentStage);
      assert.equal(tempFocus.nextLegalStep, liveFocus.nextLegalStep);

      checked.push({
        candidateId: capabilityCase.candidateId,
        currentStage: tempFocus.currentStage,
        nextLegalStep: tempFocus.nextLegalStep,
        currentHead: tempFocus.currentHead.artifactPath,
      });
    }

    process.stdout.write(`${JSON.stringify({ ok: true, checked }, null, 2)}\n`);
  });
}

main();
