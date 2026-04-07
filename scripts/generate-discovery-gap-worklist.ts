import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  generateDiscoveryGapWorklist,
  type CapabilityGapRecord,
  type DiscoveryQueueEntry,
} from "../discovery/lib/discovery-gap-worklist-generator.ts";
import { readJson } from "./checker-test-helpers.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAPABILITY_GAPS_PATH = path.join(DIRECTIVE_ROOT, "discovery", "capability-gaps.json");
const INTAKE_QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
const ACTIVE_MISSION_PATH = path.join(DIRECTIVE_ROOT, "knowledge", "active-mission.md");
const GAP_WORKLIST_PATH = path.join(DIRECTIVE_ROOT, "discovery", "gap-worklist.json");

function main() {
  const capabilityGaps = readJson<{ gaps: CapabilityGapRecord[] }>(CAPABILITY_GAPS_PATH);
  const intakeQueue = readJson<{ entries: DiscoveryQueueEntry[] }>(INTAKE_QUEUE_PATH);
  const activeMissionMarkdown = fs.readFileSync(ACTIVE_MISSION_PATH, "utf8");
  const updatedAt = new Date().toISOString();

  const worklist = generateDiscoveryGapWorklist({
    updatedAt,
    gaps: capabilityGaps.gaps,
    intakeQueueEntries: intakeQueue.entries,
    activeMissionMarkdown,
  });

  fs.writeFileSync(GAP_WORKLIST_PATH, `${JSON.stringify(worklist, null, 2)}\n`, "utf8");

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        generatedAt: updatedAt,
        worklistPath: "discovery/gap-worklist.json",
        totalItems: worklist.items.length,
        topGapId: worklist.items[0]?.gap_id ?? null,
      },
      null,
      2,
    )}\n`,
  );
}

main();
