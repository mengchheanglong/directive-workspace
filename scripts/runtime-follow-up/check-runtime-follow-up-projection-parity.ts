import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimeFollowUpOpenProjectionSet,
  writeDirectiveRuntimeFollowUpOpenProjectionSet,
} from "../../shared/lib/runtime-follow-up-projections.ts";
import { openDirectiveRuntimeFollowUp } from "../../shared/lib/runtime-follow-up-opener.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../../shared/lib/dw-state.ts";
import { withTempDirectiveRoot } from "../temp-directive-root.ts";

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

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const RUNTIME_PROOF_CASES = [
  {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  },
  {
    candidateId: "dw-mission-openmoss-runtime-orchestration-2026-03-26",
    followUpPath: "runtime/follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md",
  },
  {
    candidateId: "dw-pressure-openmoss-architecture-loop-2026-03-26",
    followUpPath: "runtime/follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-record.md",
  },
  {
    candidateId: "dw-source-temporal-durable-execution-2026-04-01",
    followUpPath: "runtime/follow-up/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-04-01-dw-source-temporal-durable-execution-2026-04-01-runtime-record.md",
  },
  {
    candidateId: "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
    followUpPath: "runtime/follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md",
  },
  {
    candidateId: "dw-live-scientify-engine-pressure-2026-03-24",
    followUpPath: "runtime/follow-up/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-runtime-record.md",
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

function copyRelativeFileIfExists(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  if (!fs.existsSync(sourcePath)) {
    return;
  }
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function extractApprovedBy(markdown: string) {
  const match = markdown.match(/- Reviewed by: `([^`]+)`/u);
  assert.ok(match?.[1], "Unable to parse Runtime review actor from runtime record");
  return match[1];
}

function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
}

function main() {
  const queueDocument = readJson<{ entries: QueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );

  withTempDirectiveRoot({ prefix: "directive-runtime-follow-up-projection-parity-" }, (directiveRoot) => {
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
      const liveFocus = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: proofCase.runtimeRecordPath,
      }).focus;
      assert.ok(liveFocus?.ok, `Live Runtime state did not resolve for ${proofCase.candidateId}`);

      for (const relativePath of uniqueRelativePaths([
        queueEntry.intake_record_path,
        routing.linkedTriageRecord,
        queueEntry.routing_record_path,
        routing.engineRunRecordPath,
        routing.engineRunReportPath,
        proofCase.followUpPath,
        liveFocus.linkedArtifacts.runtimeProofPath,
        liveFocus.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
        liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
        liveFocus.linkedArtifacts.runtimePromotionRecordPath,
        liveFocus.linkedArtifacts.runtimePromotionSpecificationPath,
        liveFocus.linkedArtifacts.runtimeCallableStubPath,
      ])) {
        copyRelativeFileIfExists(relativePath, directiveRoot);
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
      const liveRuntimeRecord = fs.readFileSync(
        path.join(DIRECTIVE_ROOT, proofCase.runtimeRecordPath),
        "utf8",
      );
      const liveFocus = resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: proofCase.runtimeRecordPath,
      }).focus;
      assert.ok(liveFocus?.ok, `Live Runtime state did not resolve for ${proofCase.candidateId}`);

      const approvedBy = extractApprovedBy(liveRuntimeRecord);
      const result = openDirectiveRuntimeFollowUp({
        directiveRoot,
        followUpPath: proofCase.followUpPath,
        approved: true,
        approvedBy,
      });

      assert.equal(result.created, true, `Runtime follow-up should create the runtime record for ${proofCase.candidateId}`);

      const generatedRuntimeRecord = fs.readFileSync(
        path.join(directiveRoot, proofCase.runtimeRecordPath),
        "utf8",
      );
      assert.equal(
        generatedRuntimeRecord,
        liveRuntimeRecord,
        `Generated Runtime record drifted for ${proofCase.candidateId}`,
      );

      const projectionSet = materializeDirectiveRuntimeFollowUpOpenProjectionSet({
        directiveRoot,
        caseId: proofCase.candidateId,
      });
      assert.equal(projectionSet.ok, true, `Runtime projection materialization failed for ${proofCase.candidateId}`);
      assert.equal(projectionSet.markdown.runtimeRecord, liveRuntimeRecord);
      assert.equal(projectionSet.paths.runtimeRecordPath, proofCase.runtimeRecordPath);
      assert.equal(projectionSet.paths.followUpPath, proofCase.followUpPath);

      fs.unlinkSync(path.join(directiveRoot, proofCase.runtimeRecordPath));
      const regenerated = writeDirectiveRuntimeFollowUpOpenProjectionSet({
        directiveRoot,
        caseId: proofCase.candidateId,
      });
      assert.equal(regenerated.ok, true, `Runtime projection rewrite failed for ${proofCase.candidateId}`);
      assert.equal(
        fs.readFileSync(path.join(directiveRoot, proofCase.runtimeRecordPath), "utf8"),
        liveRuntimeRecord,
      );

      assert.throws(
        () =>
          openDirectiveRuntimeFollowUp({
            directiveRoot,
            followUpPath: proofCase.followUpPath,
            approved: true,
            approvedBy,
          }),
        /live current stage/i,
        `Runtime follow-up should reject repeated approval after the record exists for ${proofCase.candidateId}`,
      );

      const tempFocus = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: proofCase.runtimeRecordPath,
      }).focus;
      assert.ok(tempFocus?.ok, `Generated Runtime state did not resolve for ${proofCase.candidateId}`);
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
