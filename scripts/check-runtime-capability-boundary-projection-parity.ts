import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimeCapabilityBoundaryProjectionSet,
  writeDirectiveRuntimeCapabilityBoundaryProjectionSet,
} from "../shared/lib/runtime-capability-boundary-projections.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

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
const RUNTIME_CAPABILITY_CASES = [
  {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  },
  {
    candidateId: "dw-mission-openmoss-runtime-orchestration-2026-03-26",
    followUpPath: "runtime/follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md",
    runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-capability-boundary.md",
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

function withTempDirectiveRoot(run: (directiveRoot: string) => void) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-capability-boundary-projection-parity-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    run(directiveRoot);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
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

  withTempDirectiveRoot((directiveRoot) => {
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
        copyRelativeFile(relativePath, directiveRoot);
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
        liveFocus.linkedArtifacts.runtimeCallableStubPath,
      ])) {
        copyRelativeFile(relativePath, directiveRoot);
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
