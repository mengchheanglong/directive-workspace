import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildOperationalArchitectureImprovementCandidatesReport,
  OPERATIONAL_ARCHITECTURE_IMPROVEMENT_CHECKER_ID,
  RUNTIME_CALLABLE_INPUT_BOUNDARY_CANDIDATE_ID,
} from "../architecture/lib/operational-architecture-improvement-candidates.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildOperationalArchitectureImprovementCandidatesReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, OPERATIONAL_ARCHITECTURE_IMPROVEMENT_CHECKER_ID);
  assert.equal(report.sourceEvidenceCheckerId, "runtime_callable_execution_evidence");
  assert.ok(report.totalCandidates >= 1, "expected at least one operational architecture candidate");

  const topCandidate = report.topCandidate;
  assert.ok(topCandidate, "expected a top candidate");
  assert.equal(topCandidate?.candidateId, RUNTIME_CALLABLE_INPUT_BOUNDARY_CANDIDATE_ID);
  assert.equal(topCandidate?.routeTarget, "architecture");
  assert.equal(topCandidate?.signalKind, "runtime_callable_execution_failure_pattern");
  assert.equal(topCandidate?.selfImprovementCategory, "evaluation_quality");
  assert.equal(topCandidate?.failureStatus, "validation_error");
  assert.ok((topCandidate?.failureCount ?? 0) >= 1);
  assert.ok(
    (topCandidate?.routingState === "architecture_started")
    || (topCandidate?.routingState === "architecture_materialized"),
    `expected opened Architecture case, got ${topCandidate?.routingState}`,
  );
  assert.ok(topCandidate?.currentStage?.startsWith("architecture.") ?? false);
  assert.ok(topCandidate?.currentHeadPath?.startsWith("architecture/") ?? false);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: OPERATIONAL_ARCHITECTURE_IMPROVEMENT_CHECKER_ID,
        totalCandidates: report.totalCandidates,
        topCandidateId: topCandidate?.candidateId ?? null,
        routingState: topCandidate?.routingState ?? null,
        currentStage: topCandidate?.currentStage ?? null,
      },
      null,
      2,
    )}\n`,
  );
}

main();
