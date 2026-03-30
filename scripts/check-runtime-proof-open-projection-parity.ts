import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveRuntimeProofOpenProjectionSet,
  writeDirectiveRuntimeProofOpenProjectionSet,
} from "../shared/lib/runtime-proof-open-projections.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
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
const RUNTIME_PROOF_CASES = [
  {
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  },
  {
    candidateId: "dw-mission-openmoss-runtime-orchestration-2026-03-26",
    followUpPath: "runtime/follow-up/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-follow-up-record.md",
    runtimeRecordPath: "runtime/02-records/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-runtime-record.md",
    runtimeProofPath: "runtime/03-proof/2026-03-26-dw-mission-openmoss-runtime-orchestration-2026-03-26-proof.md",
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
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-proof-open-projection-parity-"));
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
  assert.ok(match?.[1], "Unable to parse Runtime proof actor from proof artifact");
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
        copyRelativeFile(relativePath, directiveRoot);
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

      const openedBy = extractOpenedBy(liveProofMarkdown);
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
        liveFocus.linkedArtifacts.runtimeCallableStubPath,
      ])) {
        copyRelativeFile(relativePath, directiveRoot);
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
