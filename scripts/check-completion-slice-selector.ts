import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { selectNextDirectiveCompletionSlice } from "../engine/coordination/completion-slice-selector.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATUS_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-status.json");
const SLICES_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-slices.json");

function main() {
  const statusBefore = fs.readFileSync(STATUS_PATH, "utf8");
  const slicesBefore = fs.readFileSync(SLICES_PATH, "utf8");

  const selection = selectNextDirectiveCompletionSlice({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(selection.statusRelativePath, "control/state/completion-status.json");
  assert.equal(selection.slicesRelativePath, "control/state/completion-slices.json");
  assert.equal(
    selection.currentTarget.id,
    "phase_complete",
  );
  assert.deepEqual(selection.closedSeams, [
    "host_facing_promotion",
    "callable_implementation",
    "host_integration",
    "runtime_execution",
    "promotion_automation",
    "automatic_downstream_advancement",
  ]);
  assert.equal(
    selection.selectionState,
    "complete",
  );
  assert.equal(selection.selectedSlice, null);
  assert.ok(
    selection.reason.includes("completed"),
    "expected the completion selector to confirm all slices are completed",
  );
  assert.equal(selection.counts.pending, 0);
  assert.equal(selection.counts.frontier, 0);
  assert.equal(selection.counts.eligible, 0);
  assert.equal(selection.counts.blockedByClosedSeam, 0);
  assert.ok(
    selection.counts.completed >= 16,
    "expected at least 16 completed slices",
  );
  assert.equal(
    selection.lastCompletedSliceId,
    "bounded_persistent_orchestration",
  );
  assert.equal(
    selection.lastContextArtifactPath,
    "control/logs/2026-04/2026-04-02-bounded-persistent-orchestration.md",
  );

  assert.equal(
    fs.readFileSync(STATUS_PATH, "utf8"),
    statusBefore,
    "selector must not mutate completion status",
  );
  assert.equal(
    fs.readFileSync(SLICES_PATH, "utf8"),
    slicesBefore,
    "selector must not mutate completion slice registry",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          selector: "selectNextDirectiveCompletionSlice",
          selectedSlice: selection.selectedSlice,
          selectionState: selection.selectionState,
          frontierCount: selection.counts.frontier,
          eligibleCount: selection.counts.eligible,
          readOnly: true,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
