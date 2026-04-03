import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest,
} from "../../shared/lib/openclaw-maintenance-watchdog-signal-adapter.ts";
import {
  determineDiscoverySubmissionShape,
  toDiscoveryIntakeSubmission,
} from "../../shared/lib/discovery-submission-router.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");

function listRelativeFiles(rootPath: string) {
  const results: string[] = [];
  const queue = [rootPath];

  while (queue.length > 0) {
    const current = queue.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (entry.isFile()) {
        results.push(path.relative(DIRECTIVE_ROOT, fullPath).replace(/\\/g, "/"));
      }
    }
  }

  results.sort((left, right) => left.localeCompare(right));
  return results;
}

function main() {
  const queueBefore = fs.readFileSync(QUEUE_PATH, "utf8");
  const discoveryFilesBefore = listRelativeFiles(path.join(DIRECTIVE_ROOT, "discovery"));
  const architectureFilesBefore = listRelativeFiles(path.join(DIRECTIVE_ROOT, "architecture"));
  const runtimeFilesBefore = listRelativeFiles(path.join(DIRECTIVE_ROOT, "runtime"));

  const detected = adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest({
    candidate_id: "dw-openclaw-maintenance-watchdog-signal-2026-03-30",
    candidate_name: "OpenClaw Maintenance Watchdog Signal",
    source_type: "internal-signal",
    source_reference:
      "runtime/openclaw-maintenance-loop-state.json + runtime/telegram-watchdog-state.json + runtime/telegram-watchdog-history.jsonl",
    mission_alignment:
      "OpenClaw as persistent orchestration plus Discovery as front door - surface degraded maintenance/watchdog state before orchestration drift becomes silent operator debt.",
    capability_gap_id: null,
    notes:
      "maintenance loop update stale at 91m; watchdog reports unhealthy probe; watchdog history reports critical failures=2",
  });

  assert.equal(detected.boundedRecordShape, "queue_only");
  assert.equal(detected.request.record_shape, "queue_only");
  assert.equal(determineDiscoverySubmissionShape(detected.request), "queue_only");
  assert.equal(detected.request.candidate_id, "dw-openclaw-maintenance-watchdog-signal-2026-03-30");
  assert.equal(detected.request.candidate_name, "OpenClaw Maintenance Watchdog Signal");
  assert.equal(detected.request.source_type, "internal-signal");
  assert.equal(
    detected.request.source_reference,
    "runtime/openclaw-maintenance-loop-state.json + runtime/telegram-watchdog-state.json + runtime/telegram-watchdog-history.jsonl",
  );
  assert.equal(detected.request.capability_gap_id, null);
  assert.ok(detected.request.notes?.includes("maintenance loop update stale"));
  assert.ok(detected.request.notes?.includes("critical failures=2"));
  assert.deepEqual(toDiscoveryIntakeSubmission(detected.request), {
    candidate_id: "dw-openclaw-maintenance-watchdog-signal-2026-03-30",
    candidate_name: "OpenClaw Maintenance Watchdog Signal",
    source_type: "internal-signal",
    source_reference:
      "runtime/openclaw-maintenance-loop-state.json + runtime/telegram-watchdog-state.json + runtime/telegram-watchdog-history.jsonl",
    mission_alignment:
      "OpenClaw as persistent orchestration plus Discovery as front door - surface degraded maintenance/watchdog state before orchestration drift becomes silent operator debt.",
    capability_gap_id: null,
    notes:
      "maintenance loop update stale at 91m; watchdog reports unhealthy probe; watchdog history reports critical failures=2",
  });
  assert.equal("fast_path" in detected.request, false);
  assert.equal("case_record" in detected.request, false);
  assert.equal("route_destination" in detected.request, false);

  assert.throws(
    () =>
      adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest({
        candidate_id: "dw-bad-maintenance-watchdog-signal",
        candidate_name: "Bad Name" as "OpenClaw Maintenance Watchdog Signal",
        source_type: "internal-signal",
        source_reference: "runtime/openclaw-maintenance-loop-state.json",
        mission_alignment: "bad",
        capability_gap_id: null,
        notes: "bad",
      }),
    /candidate_name must be OpenClaw Maintenance Watchdog Signal/i,
  );
  assert.throws(
    () =>
      adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest({
        candidate_id: "dw-bad-maintenance-watchdog-signal",
        candidate_name: "OpenClaw Maintenance Watchdog Signal",
        source_type: "github-repo" as "internal-signal",
        source_reference: "runtime/openclaw-maintenance-loop-state.json",
        mission_alignment: "bad",
        capability_gap_id: null,
        notes: "bad",
      }),
    /source_type must be internal-signal/i,
  );

  assert.equal(
    fs.readFileSync(QUEUE_PATH, "utf8"),
    queueBefore,
    "adapter must not mutate discovery intake queue state",
  );
  assert.deepEqual(
    listRelativeFiles(path.join(DIRECTIVE_ROOT, "discovery")),
    discoveryFilesBefore,
    "adapter must not create or remove discovery artifacts",
  );
  assert.deepEqual(
    listRelativeFiles(path.join(DIRECTIVE_ROOT, "architecture")),
    architectureFilesBefore,
    "adapter must not create or remove architecture artifacts",
  );
  assert.deepEqual(
    listRelativeFiles(path.join(DIRECTIVE_ROOT, "runtime")),
    runtimeFilesBefore,
    "adapter must not create or remove runtime artifacts",
  );

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      adapter: "adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest",
      detectedShape: detected.boundedRecordShape,
      noMutation: true,
      discoveryAuthorityPreserved: true,
    },
  }, null, 2)}\n`);
}

main();
