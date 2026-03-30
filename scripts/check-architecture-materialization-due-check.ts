import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readDirectiveArchitectureMaterializationDueCheck } from "../shared/lib/architecture-materialization-due-check.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = readDirectiveArchitectureMaterializationDueCheck({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(
    report.summary.totalDueItems,
    0,
    "expected the live architecture materialization due surface to be clean",
  );
  assert.equal(report.summary.totalDueItems, report.dueItems.length);

  assert.ok(
    report.adoptionCompatibility.scannedAdoptionArtifacts > report.adoptionCompatibility.dueAdoptions,
    "expected the due-check to distinguish broader adoption corpus scanning from current due adopted items",
  );
  assert.ok(
    report.adoptionCompatibility.skippedLegacyIncompatibleAdoptions > 0,
    "expected at least one incompatible legacy adopted artifact to be classified explicitly",
  );
  assert.equal(
    report.adoptionCompatibility.skippedRuntimeHandoffArtifacts,
    1,
    "expected the historical Scientify Architecture-to-Runtime handoff to be classified as an out-of-scope handoff artifact",
  );
  assert.equal(
    report.adoptionCompatibility.skippedUnreadableAdoptions,
    0,
    "expected no current architecture/03-adopted records to be misclassified as unreadable after handoff reclassification",
  );
  assert.ok(
    report.warnings.every((warning) => !warning.startsWith("Skipped adoption artifact \"")),
    "legacy warning wall should be normalized into grouped warnings",
  );
  assert.ok(
    report.warnings.some((warning) => warning.includes("incompatible legacy adopted artifacts")),
    "expected grouped legacy compatibility warning",
  );
  assert.ok(
    report.warnings.every((warning) => !warning.includes("scientify-literature-monitoring-runtime-handoff.md")),
    "expected the historical Scientify runtime handoff to disappear from warning output once reclassified",
  );
  assert.equal(
    report.adoptionCompatibility.dueAdoptions,
    0,
    "expected no adopted Architecture slices to still need implementation targets",
  );
  assert.equal(
    report.adoptionCompatibility.decisionBackedDueAdoptions,
    0,
    "expected no decision-backed due adopted slices when the due surface is clean",
  );
  assert.equal(
    report.adoptionCompatibility.dueAdoptionsMissingDecisionArtifacts,
    0,
    "expected no missing-decision warning pressure once there are no due adopted slices",
  );
  assert.equal(
    report.adoptionCompatibility.dueAdoptionsWithUnreadableDecisionArtifacts,
    0,
    "expected no unreadable-decision warning pressure once there are no due adopted slices",
  );
  assert.equal(
    report.dueAdoptionDecisionSummary,
    null,
    "expected no due adopted decision summary when the due surface is clean",
  );

  process.stdout.write(`${JSON.stringify({
    ok: true,
    totalDueItems: report.summary.totalDueItems,
    adoptionCompatibility: report.adoptionCompatibility,
    warningCount: report.warnings.length,
    summarizedDueAdoptions:
      report.dueAdoptionDecisionSummary?.totalAdoptionsSummarized ?? 0,
  }, null, 2)}\n`);
}

main();
