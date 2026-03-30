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
const CANONICAL_PROMOTION_CASE = {
  candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  promotionReadinessPath: "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
} as const;

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
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-promotion-readiness-projection-parity-"));
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
    const queueEntry = queueDocument.entries.find(
      (item) => item.candidate_id === CANONICAL_PROMOTION_CASE.candidateId,
    ) ?? null;
    assert.ok(queueEntry, `Missing Runtime promotion-readiness case in queue: ${CANONICAL_PROMOTION_CASE.candidateId}`);
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
      CANONICAL_PROMOTION_CASE.followUpPath,
      CANONICAL_PROMOTION_CASE.runtimeRecordPath,
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
          result_record_path: CANONICAL_PROMOTION_CASE.followUpPath,
        },
      ],
    });

    const liveProofMarkdown = fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CANONICAL_PROMOTION_CASE.runtimeProofPath),
      "utf8",
    );
    const liveCapabilityBoundaryMarkdown = fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CANONICAL_PROMOTION_CASE.runtimeCapabilityBoundaryPath),
      "utf8",
    );
    const livePromotionReadinessMarkdown = fs.readFileSync(
      path.join(DIRECTIVE_ROOT, CANONICAL_PROMOTION_CASE.promotionReadinessPath),
      "utf8",
    );
    const liveFocus = resolveDirectiveWorkspaceState({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: CANONICAL_PROMOTION_CASE.promotionReadinessPath,
    }).focus;
    assert.ok(liveFocus?.ok, "Live Runtime promotion-readiness state did not resolve for the canonical case");

    openDirectiveRuntimeRecordProof({
      directiveRoot,
      runtimeRecordPath: CANONICAL_PROMOTION_CASE.runtimeRecordPath,
      approved: true,
      approvedBy: extractOpenedBy(liveProofMarkdown),
    });
    openDirectiveRuntimeProofRuntimeCapabilityBoundary({
      directiveRoot,
      runtimeProofPath: CANONICAL_PROMOTION_CASE.runtimeProofPath,
      approved: true,
      approvedBy: extractOpenedBy(liveCapabilityBoundaryMarkdown),
    });

    const result = openDirectiveRuntimePromotionReadiness({
      directiveRoot,
      capabilityBoundaryPath: CANONICAL_PROMOTION_CASE.runtimeCapabilityBoundaryPath,
      approved: true,
      approvedBy: extractOpenedBy(livePromotionReadinessMarkdown),
    });
    assert.equal(result.created, true, "Runtime promotion-readiness opener should create the promotion artifact");

    const generatedPromotionReadiness = fs.readFileSync(
      path.join(directiveRoot, CANONICAL_PROMOTION_CASE.promotionReadinessPath),
      "utf8",
    );
    assert.equal(
      generatedPromotionReadiness,
      livePromotionReadinessMarkdown,
      "Generated Runtime promotion-readiness drifted for the canonical case",
    );

    const projectionSet = materializeDirectiveRuntimePromotionReadinessProjectionSet({
      directiveRoot,
      caseId: CANONICAL_PROMOTION_CASE.candidateId,
    });
    assert.equal(projectionSet.ok, true, "Runtime promotion-readiness projection materialization failed");
    assert.equal(projectionSet.markdown.promotionReadiness, livePromotionReadinessMarkdown);
    assert.equal(projectionSet.paths.promotionReadinessPath, CANONICAL_PROMOTION_CASE.promotionReadinessPath);
    assert.equal(projectionSet.compatibility.capabilityBoundaryPath, CANONICAL_PROMOTION_CASE.runtimeCapabilityBoundaryPath);
    assert.equal(projectionSet.compatibility.runtimeProofPath, CANONICAL_PROMOTION_CASE.runtimeProofPath);
    assert.equal(projectionSet.compatibility.runtimeRecordPath, CANONICAL_PROMOTION_CASE.runtimeRecordPath);
    assert.equal(projectionSet.compatibility.followUpPath, CANONICAL_PROMOTION_CASE.followUpPath);

    fs.unlinkSync(path.join(directiveRoot, CANONICAL_PROMOTION_CASE.promotionReadinessPath));
    const regenerated = writeDirectiveRuntimePromotionReadinessProjectionSet({
      directiveRoot,
      caseId: CANONICAL_PROMOTION_CASE.candidateId,
    });
    assert.equal(regenerated.ok, true, "Runtime promotion-readiness projection rewrite failed");
    assert.equal(
      fs.readFileSync(path.join(directiveRoot, CANONICAL_PROMOTION_CASE.promotionReadinessPath), "utf8"),
      livePromotionReadinessMarkdown,
    );

    assert.throws(
      () =>
        openDirectiveRuntimePromotionReadiness({
          directiveRoot,
          capabilityBoundaryPath: CANONICAL_PROMOTION_CASE.runtimeCapabilityBoundaryPath,
          approved: true,
          approvedBy: extractOpenedBy(livePromotionReadinessMarkdown),
        }),
      /live current stage/i,
      "Runtime promotion-readiness opener should reject repeated approval after advancement",
    );

    const tempFocus = resolveDirectiveWorkspaceState({
      directiveRoot,
      artifactPath: CANONICAL_PROMOTION_CASE.promotionReadinessPath,
    }).focus;
    assert.ok(tempFocus?.ok, "Generated Runtime promotion-readiness state did not resolve for the canonical case");
    assert.equal(tempFocus.currentHead.artifactPath, liveFocus.currentHead.artifactPath);
    assert.equal(tempFocus.currentStage, liveFocus.currentStage);
    assert.equal(tempFocus.nextLegalStep, liveFocus.nextLegalStep);

    process.stdout.write(`${JSON.stringify({
      ok: true,
      checked: {
        candidateId: CANONICAL_PROMOTION_CASE.candidateId,
        currentStage: tempFocus.currentStage,
        nextLegalStep: tempFocus.nextLegalStep,
        currentHead: tempFocus.currentHead.artifactPath,
      },
    }, null, 2)}\n`);
  });
}

main();
