import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildRuntimeCallableExecutionEvidenceReport } from "../shared/lib/runtime-callable-execution-evidence.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "runtime_callable_execution_evidence";

const SCIENTIFY_RECORD_PATH =
  "runtime/callable-executions/2026-04-02T14-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json";
const NORMALIZER_SUCCESS_RECORD_PATH =
  "runtime/callable-executions/2026-04-02T14-31-00-000Z-dw-transform-code-normalizer-normalize-code.json";
const NORMALIZER_FAILURE_RECORD_PATH =
  "runtime/callable-executions/2026-04-02T14-32-00-000Z-dw-transform-code-normalizer-normalize-code.json";

function main() {
  const report = buildRuntimeCallableExecutionEvidenceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  assert.equal(report.ok, true);
  assert.equal(report.checkerId, CHECKER_ID);
  assert.equal(report.evidenceRoot, "runtime/callable-executions");
  assert.equal(report.totalExecutionRecords, 3);
  assert.equal(report.capabilityCount, 2);
  assert.equal(report.successCount, 2);
  assert.equal(report.nonSuccessCount, 1);

  const successStatus = report.statusCounts.find((status) => status.status === "success");
  const validationErrorStatus = report.statusCounts.find(
    (status) => status.status === "validation_error",
  );
  assert.equal(successStatus?.count ?? 0, 2);
  assert.equal(validationErrorStatus?.count ?? 0, 1);

  const scientify = report.capabilities.find(
    (capability) =>
      capability.capabilityId === "dw-source-scientify-research-workflow-plugin-2026-03-27",
  );
  const normalizer = report.capabilities.find(
    (capability) => capability.capabilityId === "dw-transform-code-normalizer",
  );
  assert.ok(scientify, "expected Scientify callable evidence");
  assert.ok(normalizer, "expected code-normalizer callable evidence");

  assert.equal(scientify?.executionCount, 1);
  assert.equal(scientify?.successCount, 1);
  assert.equal(scientify?.nonSuccessCount, 0);
  assert.deepEqual(scientify?.tools, ["openalex-search"]);

  assert.equal(normalizer?.executionCount, 2);
  assert.equal(normalizer?.successCount, 1);
  assert.equal(normalizer?.nonSuccessCount, 1);
  assert.deepEqual(normalizer?.tools, ["normalize-code"]);

  assert.equal(report.failurePatterns.length, 1);
  assert.equal(report.failurePatterns[0]?.capabilityId, "dw-transform-code-normalizer");
  assert.equal(report.failurePatterns[0]?.status, "validation_error");
  assert.equal(
    report.failurePatterns[0]?.recordPath,
    NORMALIZER_FAILURE_RECORD_PATH,
  );
  assert.match(
    report.failurePatterns[0]?.resultPreview ?? "",
    /non-empty 'code'/i,
  );

  const recordPaths = report.records.map((record) => record.recordPath);
  assert.deepEqual(recordPaths, [
    SCIENTIFY_RECORD_PATH,
    NORMALIZER_SUCCESS_RECORD_PATH,
    NORMALIZER_FAILURE_RECORD_PATH,
  ]);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        totalExecutionRecords: report.totalExecutionRecords,
        capabilityCount: report.capabilityCount,
        statusCounts: report.statusCounts,
        evidenceRoot: report.evidenceRoot,
        latestExecutionAt: report.latestExecutionAt,
      },
      null,
      2,
    )}\n`,
  );
}

main();
