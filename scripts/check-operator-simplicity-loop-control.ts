import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveOperatorSimplicityLoopControlReport } from "../shared/lib/operator-simplicity-loop-control.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATUS_PATH = path.join(
  DIRECTIVE_ROOT,
  "control",
  "state",
  "operator-simplicity-migration-status.json",
);
const SLICES_PATH = path.join(
  DIRECTIVE_ROOT,
  "control",
  "state",
  "operator-simplicity-migration-slices.json",
);

function main() {
  const statusBefore = fs.readFileSync(STATUS_PATH, "utf8");
  const slicesBefore = fs.readFileSync(SLICES_PATH, "utf8");

  const report = buildDirectiveOperatorSimplicityLoopControlReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, "operator_simplicity_loop_control");
  assert.equal(report.mode, "bounded_operator_simplicity_followthrough_loop");
  assert.deepEqual(report.guardrails, {
    mutatesProductTruth: false,
    opensWorkflowSeams: false,
    renamesHighReferenceAnchorsCasually: false,
    massDeletesHistory: false,
    bundlesUnrelatedCleanup: false,
  });

  assert.deepEqual(report.setupReadiness, {
    hasMigrationAnchor: true,
    hasOperatorStart: true,
    hasControlReadme: true,
    hasControlStateReadme: true,
    hasStateReadme: true,
    hasRuntimeFollowUpReadme: true,
  });

  assert.equal(report.migrationStatus.anchorPath, "operator-simplicity-migration.md");
  assert.equal(
    report.migrationStatus.currentTargetId,
    "operator_simplicity_migration_complete",
  );
  assert.equal(
    report.migrationStatus.lastCompletedSliceId,
    "dead_surface_reference_audit",
  );

  assert.equal(report.counts.completed, 10);
  assert.equal(report.counts.pending, 0);
  assert.equal(report.counts.blocked, 0);
  assert.equal(report.counts.frontierPending, 0);

  assert.equal(
    report.migrationContext.groupedCheckerFamilies.includes("runtime-follow-up"),
    true,
  );
  assert.equal(report.migrationContext.rootRuntimeFollowUpCheckerCount, 0);

  assert.equal(report.selectionState, "complete");
  assert.equal(report.selectedSlice, null);
  assert.ok(
    report.reason.includes("All operator-simplicity migration slices in the registry are completed."),
  );
  assert.equal(report.blockedFrontier.length, 0);

  assert.equal(
    fs.readFileSync(STATUS_PATH, "utf8"),
    statusBefore,
    "operator simplicity loop control must not mutate migration status",
  );
  assert.equal(
    fs.readFileSync(SLICES_PATH, "utf8"),
    slicesBefore,
    "operator simplicity loop control must not mutate migration slices",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          checker: "operator_simplicity_loop_control",
          migrationStatus: report.migrationStatus,
          counts: report.counts,
          migrationContext: report.migrationContext,
          selectionState: report.selectionState,
          selectedSlice: report.selectedSlice,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
