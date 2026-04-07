import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDirectiveBoundedPersistentCoordinationReport,
  readDirectiveCoordinationLedger,
} from "../engine/coordination/bounded-persistent-coordination.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_PATH = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
const STATUS_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-status.json");
const SLICES_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "completion-slices.json");
const LEDGER_PATH = path.join(DIRECTIVE_ROOT, "control", "state", "coordination-ledger.json");

function main() {
  const queueBefore = fs.readFileSync(QUEUE_PATH, "utf8");
  const statusBefore = fs.readFileSync(STATUS_PATH, "utf8");
  const slicesBefore = fs.readFileSync(SLICES_PATH, "utf8");

  const ledger = readDirectiveCoordinationLedger({ directiveRoot: DIRECTIVE_ROOT });

  assert.equal(ledger.version, 1, "Ledger must be version 1");
  assert.ok(ledger.maxEntries > 0, "Ledger must have a positive max entries");
  assert.ok(ledger.entries.length > 0, "Ledger must have at least one entry (run the primitive first)");
  assert.ok(
    ledger.entries.length <= ledger.maxEntries,
    "Ledger entries must not exceed max entries",
  );

  for (const entry of ledger.entries) {
    assert.ok(entry.snapshotAt, "Each entry must have a snapshot timestamp");
    assert.ok(typeof entry.totalLiveCases === "number", "Each entry must have totalLiveCases");
    assert.ok(Array.isArray(entry.caseStates), "Each entry must have caseStates array");
    for (const cs of entry.caseStates) {
      assert.ok(cs.candidateId, "Each case state must have a candidateId");
      assert.ok(cs.bucketId, "Each case state must have a bucketId");
    }
  }

  const report = buildDirectiveBoundedPersistentCoordinationReport({
    directiveRoot: DIRECTIVE_ROOT,
    dryRun: true,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, "bounded_persistent_coordination");
  assert.equal(report.mode, "bounded_persistent_coordination");

  assert.deepEqual(report.guardrails, {
    mutatesQueueOrStateTruth: false,
    autoAdvancesWorkflow: false,
    bypassesApproval: false,
    impliesHostIntegration: false,
    impliesRuntimeExecution: false,
    impliesPromotionAutomation: false,
    onlyWritesOwnLedger: true,
  });

  assert.ok(report.persistenceSignals, "Report must include persistence signals");
  assert.ok(Array.isArray(report.persistenceSignals.staleCases), "Must have staleCases array");
  assert.ok(report.persistenceSignals.cadenceDrift, "Must have cadenceDrift signal");
  assert.ok(Array.isArray(report.persistenceSignals.newCases), "Must have newCases array");
  assert.ok(Array.isArray(report.persistenceSignals.resolvedCases), "Must have resolvedCases array");
  assert.ok(
    typeof report.persistenceSignals.totalPreviousChecks === "number",
    "Must track previous check count",
  );

  assert.ok(report.persistenceSignals.totalPreviousChecks >= 1,
    "Must have at least 1 previous check in the ledger to prove cross-session memory",
  );

  if (report.persistenceSignals.totalPreviousChecks >= 2) {
    assert.ok(
      report.persistenceSignals.staleCases.length > 0,
      "With 2+ previous checks, staleness detection should find cases unchanged across checks",
    );
  }

  assert.equal(report.upstreamReport.totalLiveCases, 47);
  assert.equal(report.ledgerPath, "control/state/coordination-ledger.json");
  assert.equal(report.persistenceSignals.totalPreviousChecks, 2);
  assert.equal(report.persistenceSignals.staleCases.length, 18);
  assert.equal(report.persistenceSignals.newCases.length, 15);
  assert.equal(report.persistenceSignals.resolvedCases.length, 0);

  assert.ok(fs.existsSync(LEDGER_PATH), "Ledger file must exist on disk");

  assert.equal(
    fs.readFileSync(QUEUE_PATH, "utf8"),
    queueBefore,
    "Persistent coordination must not mutate queue truth",
  );
  assert.equal(
    fs.readFileSync(STATUS_PATH, "utf8"),
    statusBefore,
    "Persistent coordination must not mutate completion status",
  );
  assert.equal(
    fs.readFileSync(SLICES_PATH, "utf8"),
    slicesBefore,
    "Persistent coordination must not mutate completion slice registry",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checked: {
          checker: "bounded_persistent_coordination",
          ledgerEntries: ledger.entries.length,
          persistenceSignals: {
            staleCaseCount: report.persistenceSignals.staleCases.length,
            cadenceDriftDetected: report.persistenceSignals.cadenceDrift.cadenceDriftDetected,
            newCaseCount: report.persistenceSignals.newCases.length,
            resolvedCaseCount: report.persistenceSignals.resolvedCases.length,
            totalPreviousChecks: report.persistenceSignals.totalPreviousChecks,
          },
          guardrailsVerified: true,
          immutabilityVerified: true,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
