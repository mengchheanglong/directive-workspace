import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readJson } from "../shared/lib/file-io.ts";
import { openDirectiveDiscoveryRoute, readDirectiveDiscoveryRoutingArtifact } from "../discovery/lib/discovery-route-opener.ts";
import { writeDiscoveryRoutingReviewResolution } from "../discovery/lib/discovery-routing-review-resolution.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "discovery_reviewed_monitor_route_open";
const ROUTING_PATH =
  "discovery/03-routing-log/2026-04-06-research-engine-paperqa2-20260406t145339z-20260406t145353--routing-record.md";

function ensureParent(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyRelativeFile(relativePath: string, stagedRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  const targetPath = path.join(stagedRoot, relativePath);
  ensureParent(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
}

function main() {
  const routing = readDirectiveDiscoveryRoutingArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    routingPath: ROUTING_PATH,
  });

  const stagedRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dw-reviewed-monitor-open-"));
  for (const relativePath of [
    ROUTING_PATH,
    routing.linkedIntakeRecord,
    routing.linkedTriageRecord ?? "",
    routing.engineRunRecordPath ?? "",
    routing.engineRunReportPath ?? "",
    "discovery/intake-queue.json",
  ].filter(Boolean)) {
    copyRelativeFile(relativePath, stagedRoot);
  }

  assert.throws(
    () =>
      openDirectiveDiscoveryRoute({
        directiveRoot: stagedRoot,
        routingPath: ROUTING_PATH,
        approved: true,
        approvedBy: "check-reviewed-monitor-route-open",
      }),
    /cannot open downstream work/i,
    "A raw monitor route must not open before a routing review resolution exists.",
  );

  const resolution = writeDiscoveryRoutingReviewResolution({
    directiveRoot: stagedRoot,
    routingRecordPath: ROUTING_PATH,
    decision: "redirect_to_architecture",
    rationale:
      "Strong Discovery review signal and explicit Engine-improvement value justify Architecture continuation instead of remaining parked in monitor.",
    reviewedBy: "check-reviewed-monitor-route-open",
    resolvedConfidence: "high",
  });

  const opened = openDirectiveDiscoveryRoute({
    directiveRoot: stagedRoot,
    routingPath: ROUTING_PATH,
    approved: true,
    approvedBy: "check-reviewed-monitor-route-open",
  });

  assert.equal(opened.routeDestination, "architecture");
  assert.match(opened.stubRelativePath, /^architecture\/01-experiments\/.+-engine-handoff\.md$/);
  assert.equal(
    opened.stubRelativePath,
    "architecture/01-experiments/2026-04-06-research-engine-paperqa2-20260406t145339z-20260406t145353.-engine-handoff.md",
  );
  assert.ok(fs.existsSync(path.join(stagedRoot, opened.stubRelativePath)));

  const queue = readJson<{ entries: Array<Record<string, unknown>> }>(path.join(stagedRoot, "discovery", "intake-queue.json"));
  const updatedEntry = queue.entries.find((entry) => entry.candidate_id === routing.candidateId);
  assert.ok(updatedEntry, "The staged queue should still contain the reviewed candidate.");
  assert.equal(updatedEntry?.routing_target, "architecture");
  assert.equal(updatedEntry?.result_record_path, opened.stubRelativePath);
  assert.equal(resolution.resolution.resolvedRouteDestination, "architecture");

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        reviewedRoutingRecord: ROUTING_PATH,
        reviewResolutionPath: resolution.reviewResolutionRelativePath,
        openedStubPath: opened.stubRelativePath,
        covered: [
          "monitor_route_blocks_before_review_resolution",
          "reviewed_monitor_route_opens_architecture_handoff",
          "queue_sync_uses_effective_route_destination",
          "queue_sync_uses_effective_required_next_artifact",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

main();
