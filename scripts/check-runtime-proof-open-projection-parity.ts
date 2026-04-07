import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimeProofOpenProjectionSet,
  writeDirectiveRuntimeProofOpenProjectionSet,
} from "../runtime/lib/runtime-proof-open-projections.ts";
import { openDirectiveRuntimeRecordProof } from "../runtime/lib/runtime-record-proof-opener.ts";
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
const RUNTIME_PROOF_CASES = [
  {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    followUpPath: "runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  },
  {
    candidateId: "dw-mission-openmoss-runtime-orchestration-2026-03-26",
    followUpPath: "runtime/00-follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md",
  },
] as const;

function main() {
  const queueDocument = readJson<{ entries: DiscoveryIntakeQueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );

  withTempDirectiveRoot({ prefix: "directive-runtime-proof-open-projection-parity-" }, (directiveRoot) => {
    const tempQueue = {
      status: "primary",
      updatedAt: "2026-03-29",
      entries: [] as QueueEntry[],
    };

    for (const proofCase of RUNTIME_PROOF_CASES) {
      const queueEntry = queueDocument.entries.find((item) => item.candidate_id === proofCase.candidateId) ?? null;
      assert.ok(queueEntry, `Missing Runtime proof case in queue: ${proofCase.candidateId}`);
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
        proofCase.followUpPath,
        proofCase.runtimeRecordPath,
      ])) {
        copyRelativeFile(relativePath, DIRECTIVE_ROOT, directiveRoot, "Missing source file for parity copy");
      }

      tempQueue.entries.push({
        ...queueEntry,
        status: "routed",
        completed_at: null,
        result_record_path: proofCase.followUpPath,
      });
    }

    writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), tempQueue);

    const checked = [];

    for (const proofCase of RUNTIME_PROOF_CASES) {
      const liveProofMarkdown = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, proofCase.runtimeProofPath),
        "utf8",
      );
      const liveFocus = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: proofCase.runtimeProofPath,
      }).focus;
      assert.ok(liveFocus?.ok, `Live Runtime proof state did not resolve for ${proofCase.candidateId}`);

      const openedBy = extractOpenedBy(
        liveProofMarkdown,
        "Unable to parse Runtime proof actor from proof artifact",
      );
      const result = openDirectiveRuntimeRecordProof({
        directiveRoot,
        runtimeRecordPath: proofCase.runtimeRecordPath,
        approved: true,
        approvedBy: openedBy,
      });

      assert.equal(result.created, true, `Runtime proof open should create the proof artifact for ${proofCase.candidateId}`);

      const generatedRuntimeProof = fs.readFileSync(
        path.join(directiveRoot, proofCase.runtimeProofPath),
        "utf8",
      );
      assert.equal(
        generatedRuntimeProof,
        liveProofMarkdown,
        `Generated Runtime proof drifted for ${proofCase.candidateId}`,
      );

      const projectionSet = materializeDirectiveRuntimeProofOpenProjectionSet({
        directiveRoot,
        caseId: proofCase.candidateId,
      });
      assert.equal(projectionSet.ok, true, `Runtime proof projection materialization failed for ${proofCase.candidateId}`);
      assert.equal(projectionSet.markdown.runtimeProof, liveProofMarkdown);
      assert.equal(projectionSet.paths.runtimeProofPath, proofCase.runtimeProofPath);
      assert.equal(projectionSet.compatibility.runtimeRecordPath, proofCase.runtimeRecordPath);
      assert.equal(projectionSet.compatibility.followUpPath, proofCase.followUpPath);

      fs.unlinkSync(path.join(directiveRoot, proofCase.runtimeProofPath));
      const regenerated = writeDirectiveRuntimeProofOpenProjectionSet({
        directiveRoot,
        caseId: proofCase.candidateId,
      });
      assert.equal(regenerated.ok, true, `Runtime proof projection rewrite failed for ${proofCase.candidateId}`);
      assert.equal(
        fs.readFileSync(path.join(directiveRoot, proofCase.runtimeProofPath), "utf8"),
        liveProofMarkdown,
      );

      assert.throws(
        () =>
          openDirectiveRuntimeRecordProof({
            directiveRoot,
            runtimeRecordPath: proofCase.runtimeRecordPath,
            approved: true,
            approvedBy: openedBy,
          }),
        /live current stage/i,
        `Runtime proof open should reject repeated approval after the proof exists for ${proofCase.candidateId}`,
      );

      for (const relativePath of uniqueRelativePaths([
        liveFocus.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
        liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
        liveFocus.linkedArtifacts.runtimePromotionRecordPath,
        liveFocus.linkedArtifacts.runtimeCallableStubPath,
      ])) {
        copyRelativeFile(relativePath, DIRECTIVE_ROOT, directiveRoot, "Missing source file for parity copy");
      }

      const tempFocus = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: proofCase.runtimeProofPath,
      }).focus;
      assert.ok(tempFocus?.ok, `Generated Runtime proof state did not resolve for ${proofCase.candidateId}`);
      assert.equal(tempFocus.currentHead.artifactPath, liveFocus.currentHead.artifactPath);
      assert.equal(tempFocus.currentStage, liveFocus.currentStage);
      assert.equal(tempFocus.nextLegalStep, liveFocus.nextLegalStep);

      checked.push({
        candidateId: proofCase.candidateId,
        currentStage: tempFocus.currentStage,
        nextLegalStep: tempFocus.nextLegalStep,
        currentHead: tempFocus.currentHead.artifactPath,
      });
    }

    process.stdout.write(`${JSON.stringify({ ok: true, checked }, null, 2)}\n`);
  });
}

main();
