import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  isDiscoveryGapWorklistItemEligibleForSelection,
  readTopEligibleDiscoveryGapFromCanonicalWorklist,
} from "../shared/lib/discovery-gap-worklist-selector.ts";
import type { DiscoveryGapWorklist } from "../shared/lib/discovery-gap-worklist-generator.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GAP_WORKLIST_PATH = path.join(DIRECTIVE_ROOT, "discovery", "gap-worklist.json");
const INTAKE_QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

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
  const worklistBefore = fs.readFileSync(GAP_WORKLIST_PATH, "utf8");
  const queueBefore = fs.readFileSync(INTAKE_QUEUE_PATH, "utf8");
  const discoveryFilesBefore = listRelativeFiles(path.join(DIRECTIVE_ROOT, "discovery"));
  const architectureFilesBefore = listRelativeFiles(path.join(DIRECTIVE_ROOT, "architecture"));
  const runtimeFilesBefore = listRelativeFiles(path.join(DIRECTIVE_ROOT, "runtime"));
  const worklist = readJson<DiscoveryGapWorklist>(GAP_WORKLIST_PATH);
  const expectedTopEligible = worklist.items.find((item) =>
    isDiscoveryGapWorklistItemEligibleForSelection(item)
  );

  const selection = readTopEligibleDiscoveryGapFromCanonicalWorklist({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(selection.worklistRelativePath, "discovery/gap-worklist.json");
  assert.equal(selection.worklistUpdatedAt, worklist.updatedAt);
  assert.ok(
    selection.selectionRule.includes("top-ranked gap"),
    "selector should preserve the canonical worklist selection rule",
  );
  assert.equal(selection.totalOpenItems, worklist.items.length);
  if (expectedTopEligible) {
    assert.ok(selection.eligibleOpenItems >= 1, "expected at least one eligible open gap");
    assert.deepEqual(selection.selectedGap, {
      gap_id: expectedTopEligible.gap_id,
      worklist_rank: expectedTopEligible.worklist_rank,
      priority_score: expectedTopEligible.priority_score,
      next_slice_track: expectedTopEligible.next_slice_track,
      next_action: expectedTopEligible.next_action,
      gap_status: expectedTopEligible.gap_status,
    });
  } else {
    assert.equal(selection.eligibleOpenItems, 0);
    assert.equal(selection.selectedGap, null);
  }

  assert.equal(
    fs.readFileSync(GAP_WORKLIST_PATH, "utf8"),
    worklistBefore,
    "selector must not mutate the canonical worklist artifact",
  );
  assert.equal(
    fs.readFileSync(INTAKE_QUEUE_PATH, "utf8"),
    queueBefore,
    "selector must not mutate discovery intake queue state",
  );
  assert.deepEqual(
    listRelativeFiles(path.join(DIRECTIVE_ROOT, "discovery")),
    discoveryFilesBefore,
    "selector must not create or remove discovery artifacts",
  );
  assert.deepEqual(
    listRelativeFiles(path.join(DIRECTIVE_ROOT, "architecture")),
    architectureFilesBefore,
    "selector must not create or remove architecture artifacts",
  );
  assert.deepEqual(
    listRelativeFiles(path.join(DIRECTIVE_ROOT, "runtime")),
    runtimeFilesBefore,
    "selector must not create or remove runtime artifacts",
  );

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      selector: "readTopEligibleDiscoveryGapFromCanonicalWorklist",
      worklistPath: selection.worklistRelativePath,
      selectedGap: selection.selectedGap,
      readOnly: true,
      noAutoOpenedArtifacts: true,
    },
  }, null, 2)}\n`);
}

main();
