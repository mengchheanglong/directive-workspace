import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  adaptOpenClawDiscoverySubmissionToDirectiveRequest,
} from "../../hosts/adapters/openclaw-discovery-submission-adapter.ts";
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

  const explicitPayload = {
    candidate_id: "openclaw-explicit-submission-adapter-check",
    candidate_name: "OpenClaw Explicit Submission Adapter Check",
    source_type: "internal-signal" as const,
    source_reference: "scripts/openclaw/check-openclaw-discovery-submission-adapter.ts",
    mission_alignment: "Discovery as operational front door",
    capability_gap_id: null,
    notes: "adapter-check",
  };
  const explicitAdapted = adaptOpenClawDiscoverySubmissionToDirectiveRequest(explicitPayload);

  assert.equal(explicitAdapted.boundedRecordShape, "queue_only");
  assert.equal(explicitAdapted.request.record_shape, "queue_only");
  assert.equal(determineDiscoverySubmissionShape(explicitAdapted.request), "queue_only");
  assert.deepEqual(toDiscoveryIntakeSubmission(explicitAdapted.request), {
    candidate_id: explicitPayload.candidate_id,
    candidate_name: explicitPayload.candidate_name,
    source_type: explicitPayload.source_type,
    source_reference: explicitPayload.source_reference,
    mission_alignment: explicitPayload.mission_alignment,
    capability_gap_id: null,
    notes: explicitPayload.notes,
  });
  assert.equal("fast_path" in explicitAdapted.request, false);
  assert.equal("case_record" in explicitAdapted.request, false);
  assert.equal("route_destination" in explicitAdapted.request, false);

  const defaultedAdapted = adaptOpenClawDiscoverySubmissionToDirectiveRequest({
    candidate_id: "openclaw-defaulted-submission-adapter-check",
    candidate_name: "OpenClaw Defaulted Submission Adapter Check",
    source_reference: "scripts/openclaw/check-openclaw-discovery-submission-adapter.ts",
    mission_alignment: "  ",
    notes: "  ",
  });
  assert.equal(defaultedAdapted.request.source_type, "internal-signal");
  assert.equal(defaultedAdapted.request.mission_alignment, null);
  assert.equal(defaultedAdapted.request.notes, null);
  assert.equal(defaultedAdapted.request.capability_gap_id, null);
  assert.equal(determineDiscoverySubmissionShape(defaultedAdapted.request), "queue_only");

  assert.throws(
    () => adaptOpenClawDiscoverySubmissionToDirectiveRequest({
      candidate_id: "",
      candidate_name: "Broken",
      source_reference: "scripts/openclaw/check-openclaw-discovery-submission-adapter.ts",
    }),
    /candidate_id is required/i,
  );
  assert.throws(
    () => adaptOpenClawDiscoverySubmissionToDirectiveRequest({
      candidate_id: "broken-source-type",
      candidate_name: "Broken Source Type",
      source_type: "invalid-source-type" as never,
      source_reference: "scripts/openclaw/check-openclaw-discovery-submission-adapter.ts",
    }),
    /source_type must be one of/i,
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
      adapter: "adaptOpenClawDiscoverySubmissionToDirectiveRequest",
      boundedRecordShape: explicitAdapted.boundedRecordShape,
      preservedDefaults: {
        source_type: defaultedAdapted.request.source_type,
        mission_alignment: defaultedAdapted.request.mission_alignment,
        capability_gap_id: defaultedAdapted.request.capability_gap_id,
        notes: defaultedAdapted.request.notes,
      },
      noMutation: true,
      discoveryAuthorityPreserved: true,
    },
  }, null, 2)}\n`);
}

main();
