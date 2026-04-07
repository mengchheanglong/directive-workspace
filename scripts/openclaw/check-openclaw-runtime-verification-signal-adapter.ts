import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  adaptOpenClawRuntimeVerificationSignalToDirectiveRequest,
} from "../../hosts/adapters/openclaw-runtime-verification-signal-adapter.ts";
import {
  determineDiscoverySubmissionShape,
  toDiscoveryIntakeSubmission,
} from "../../discovery/lib/discovery-submission-router.ts";

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

  const detected = adaptOpenClawRuntimeVerificationSignalToDirectiveRequest({
    candidate_id: "dw-openclaw-runtime-verification-freshness-2026-03-29",
    signal_detected: true,
    regression_age_hours: 96,
    regression_stale: true,
    soak_age_hours: 12,
    soak_stale: false,
    reasons: ["runtime regression report stale at 96h"],
  });

  assert.equal(detected.signalDetected, true);
  assert.equal(detected.boundedRecordShape, "queue_only");
  assert.equal(detected.request.record_shape, "queue_only");
  assert.equal(determineDiscoverySubmissionShape(detected.request), "queue_only");
  assert.equal(detected.request.candidate_name, "OpenClaw Runtime Verification Freshness Signal");
  assert.equal(detected.request.source_type, "internal-signal");
  assert.equal(
    detected.request.source_reference,
    "reports/ops/openclaw-runtime-regression-latest.json + runtime/telegram-soak/daily-latest.json",
  );
  assert.equal(detected.request.capability_gap_id, null);
  assert.ok(detected.request.notes?.includes("runtime regression report stale at 96h"));
  assert.ok(detected.request.notes?.includes("regression_age_hours=96"));
  assert.ok(detected.request.notes?.includes("soak_age_hours=12"));
  assert.deepEqual(toDiscoveryIntakeSubmission(detected.request), {
    candidate_id: "dw-openclaw-runtime-verification-freshness-2026-03-29",
    candidate_name: "OpenClaw Runtime Verification Freshness Signal",
    source_type: "internal-signal",
    source_reference:
      "reports/ops/openclaw-runtime-regression-latest.json + runtime/telegram-soak/daily-latest.json",
    mission_alignment:
      "OpenClaw as persistent orchestration plus Discovery as front door - surface stale runtime verification before orchestration confidence drifts away from recent proof.",
    capability_gap_id: null,
    notes: detected.request.notes,
  });
  assert.equal("fast_path" in detected.request, false);
  assert.equal("case_record" in detected.request, false);
  assert.equal("route_destination" in detected.request, false);

  const absent = adaptOpenClawRuntimeVerificationSignalToDirectiveRequest({
    candidate_id: "dw-openclaw-runtime-verification-freshness-healthy-2026-03-29",
    signal_detected: false,
    regression_age_hours: 4,
    regression_stale: false,
    soak_age_hours: 5,
    soak_stale: false,
    reasons: [],
  });
  assert.equal(absent.signalDetected, false);
  assert.equal(absent.request, null);
  assert.equal(absent.boundedRecordShape, null);

  assert.throws(
    () => adaptOpenClawRuntimeVerificationSignalToDirectiveRequest({
      candidate_id: "",
      signal_detected: true,
      regression_age_hours: 96,
      regression_stale: true,
      soak_age_hours: 12,
      soak_stale: false,
      reasons: ["runtime regression report stale at 96h"],
    }),
    /candidate_id is required/i,
  );
  assert.throws(
    () => adaptOpenClawRuntimeVerificationSignalToDirectiveRequest({
      candidate_id: "dw-bad-runtime-verification-signal",
      signal_detected: false,
      regression_age_hours: 96,
      regression_stale: true,
      soak_age_hours: null,
      soak_stale: false,
      reasons: [],
    }),
    /signal_detected=false requires no stale flags and no reasons/i,
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
      adapter: "adaptOpenClawRuntimeVerificationSignalToDirectiveRequest",
      detectedShape: detected.boundedRecordShape,
      absentSignalProducesSubmission: absent.request !== null,
      noMutation: true,
      discoveryAuthorityPreserved: true,
    },
  }, null, 2)}\n`);
}

main();
