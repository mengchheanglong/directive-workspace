import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DIRECTIVE_RUNTIME_CALLABLE_EXECUTION_RECORD_VERSION,
  getDirectiveRuntimeCallableCapability,
  listDirectiveRuntimeCallableCapabilities,
  runDirectiveCallableCapabilityWithExecutionSurface,
  runDirectiveRuntimeCallableExecution,
  type DirectiveRuntimeCallableExecutionRecord,
} from "../runtime/core/callable-execution.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";
import type {
  DirectiveCallableCapability,
  DirectiveCallableExecutionInput,
  DirectiveCallableExecutionResult,
} from "../runtime/core/callable-contract.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "runtime_callable_execution_surface";

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function assertPersistedRecord(input: {
  directiveRoot: string;
  expectedStatus: DirectiveCallableExecutionResult["status"];
  record: DirectiveRuntimeCallableExecutionRecord;
}) {
  const absoluteRecordPath = path.join(input.directiveRoot, input.record.artifacts.recordPath);
  const absoluteReportPath = path.join(input.directiveRoot, input.record.artifacts.reportPath);

  assert.equal(fs.existsSync(absoluteRecordPath), true, `Missing execution record: ${absoluteRecordPath}`);
  assert.equal(fs.existsSync(absoluteReportPath), true, `Missing execution report: ${absoluteReportPath}`);

  const persistedRecord = readJson<DirectiveRuntimeCallableExecutionRecord>(absoluteRecordPath);
  assert.equal(
    persistedRecord.version,
    DIRECTIVE_RUNTIME_CALLABLE_EXECUTION_RECORD_VERSION,
    "Execution record version drifted",
  );
  assert.equal(persistedRecord.executionId, input.record.executionId);
  assert.equal(persistedRecord.invocation.status, input.expectedStatus);
  assert.equal(persistedRecord.boundary.executionSurface, "shared_runtime_callable_executor");
  assert.equal(persistedRecord.boundary.hostIntegrated, false);
  assert.equal(persistedRecord.boundary.promotionAutomation, false);
  assert.equal(persistedRecord.boundary.automaticWorkflowAdvancement, false);

  const reportContent = fs.readFileSync(absoluteReportPath, "utf8");
  assert.ok(reportContent.includes(`# Directive Runtime Callable Execution`));
  assert.ok(reportContent.includes(`- Execution ID: \`${input.record.executionId}\``));
  assert.ok(reportContent.includes(`- Capability ID: \`${input.record.capability.capabilityId}\``));
  assert.ok(reportContent.includes(`- Status: \`${input.expectedStatus}\``));
}

function buildSlowCapability(): DirectiveCallableCapability {
  return {
    descriptor: {
      capabilityId: "dw-test-slow-callable-capability",
      status: "callable",
      form: "runtime_owned_test_timeout_probe",
      title: "Slow Capability Timeout Probe",
      toolCount: 1,
      tools: ["sleep-tool"],
      defaultTimeoutMs: 25,
      maxTimeoutMs: 100,
    },
    async execute(input: DirectiveCallableExecutionInput) {
      await new Promise((resolve) => setTimeout(resolve, 75));
      return {
        ok: true,
        tool: input.tool,
        status: "success",
        result: { completed: true },
        metadata: {
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: 75,
          timeoutMs: input.timeoutMs ?? 25,
          capabilityId: "dw-test-slow-callable-capability",
        },
      };
    },
    disable() {},
    enable() {},
    isEnabled() {
      return true;
    },
    listTools() {
      return [{
        tool: "sleep-tool",
        functionName: "sleepTool",
        modulePath: "runtime/test/sleep-tool.ts",
        inputType: "Record<string, never>",
        resultType: "{ completed: boolean }",
      }];
    },
  };
}

async function main() {
  const descriptors = listDirectiveRuntimeCallableCapabilities();
  assert.ok(
    descriptors.some((descriptor) => descriptor.capabilityId === "dw-source-scientify-research-workflow-plugin-2026-03-27"),
    "Expected Scientify callable capability to be registered",
  );
  assert.ok(
    descriptors.some((descriptor) => descriptor.capabilityId === "dw-transform-code-normalizer"),
    "Expected code-normalizer callable capability to be registered",
  );

  const knownScientify = getDirectiveRuntimeCallableCapability(
    "dw-source-scientify-research-workflow-plugin-2026-03-27",
  );
  const knownNormalizer = getDirectiveRuntimeCallableCapability("dw-transform-code-normalizer");
  assert.ok(knownScientify, "Expected Scientify callable capability lookup to succeed");
  assert.ok(knownNormalizer, "Expected code-normalizer callable capability lookup to succeed");

  const originalFetch = globalThis.fetch;

  await withTempDirectiveRoot({ prefix: "directive-runtime-callable-execution-" }, async (directiveRoot) => {
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.startsWith("https://api.openalex.org/works?")) {
        return new Response(
          JSON.stringify({
            meta: { count: 1 },
            results: [
              {
                id: "https://openalex.org/W1234567890",
                doi: "https://doi.org/10.1000/test-doi",
                title: "Directive Runtime Execution Proof",
                publication_year: 2026,
                publication_date: "2026-04-02",
                type: "article",
                cited_by_count: 7,
                authorships: [{ author: { display_name: "Directive Workspace" } }],
                primary_location: {
                  source: { display_name: "OpenAlex Test Journal" },
                },
                abstract_inverted_index: {
                  Directive: [0],
                  runtime: [1],
                  execution: [2],
                  proof: [3],
                },
                open_access: {
                  is_oa: true,
                  oa_url: "https://example.com/directive-runtime-proof.pdf",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      throw new Error(`Unexpected fetch URL in Runtime callable execution checker: ${url}`);
    };

    const scientifyExecution = await runDirectiveRuntimeCallableExecution({
      directiveRoot,
      capabilityId: "dw-source-scientify-research-workflow-plugin-2026-03-27",
      tool: "openalex-search",
      input: {
        query: "directive runtime execution proof",
        max_results: 1,
      },
      timeoutMs: 5000,
      executionAt: "2026-04-02T13:30:00.000Z",
    });
    assert.equal(scientifyExecution.ok, true);
    assert.equal(scientifyExecution.rawResult.ok, true);
    assert.equal(scientifyExecution.rawResult.status, "success");
    const scientifyResult = scientifyExecution.rawResult.result as {
      ok: true;
      returned: number;
      works: Array<{ title: string }>;
    };
    assert.equal(scientifyResult.ok, true);
    assert.equal(scientifyResult.returned, 1);
    assert.equal(scientifyResult.works[0]?.title, "Directive Runtime Execution Proof");
    assert.equal(scientifyExecution.record.capability.capabilityId, "dw-source-scientify-research-workflow-plugin-2026-03-27");
    assert.equal(scientifyExecution.record.invocation.tool, "openalex-search");
    assert.equal(scientifyExecution.record.resultSummary.kind, "object");
    assertPersistedRecord({
      directiveRoot,
      expectedStatus: "success",
      record: scientifyExecution.record,
    });

    const normalizerExecution = await runDirectiveRuntimeCallableExecution({
      directiveRoot,
      capabilityId: "dw-transform-code-normalizer",
      tool: "normalize-code",
      input: {
        code: "export const value = 1;  \r\n\r\n\r\nexport const next = 2;  \n",
      },
      timeoutMs: 1000,
      executionAt: "2026-04-02T13:31:00.000Z",
    });
    assert.equal(normalizerExecution.ok, true);
    assert.equal(normalizerExecution.rawResult.ok, true);
    assert.equal(normalizerExecution.rawResult.status, "success");
    const normalizerResult = normalizerExecution.rawResult.result as {
      ok: true;
      normalizedCode: string;
      preservationProof: {
        behaviorPreserved: boolean;
        inputNonBlankLines: number;
        outputNonBlankLines: number;
      };
    };
    assert.equal(normalizerResult.ok, true);
    assert.equal(normalizerResult.preservationProof.behaviorPreserved, true);
    assert.equal(normalizerResult.preservationProof.inputNonBlankLines, 2);
    assert.equal(normalizerResult.preservationProof.outputNonBlankLines, 2);
    assert.ok(!normalizerResult.normalizedCode.includes("\r"));
    assertPersistedRecord({
      directiveRoot,
      expectedStatus: "success",
      record: normalizerExecution.record,
    });

    const timeoutExecution = await runDirectiveCallableCapabilityWithExecutionSurface({
      directiveRoot,
      capability: buildSlowCapability(),
      tool: "sleep-tool",
      input: {},
      timeoutMs: 25,
      executionAt: "2026-04-02T13:32:00.000Z",
    });
    assert.equal(timeoutExecution.ok, true);
    assert.equal(timeoutExecution.rawResult.ok, false);
    assert.equal(timeoutExecution.rawResult.status, "timeout");
    assert.ok(
      String(timeoutExecution.rawResult.result).includes("timed out"),
      "Expected shared timeout result to mention timeout",
    );
    assertPersistedRecord({
      directiveRoot,
      expectedStatus: "timeout",
      record: timeoutExecution.record,
    });

    const persistedFiles = fs
      .readdirSync(path.join(directiveRoot, "runtime", "callable-executions"), { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort();
    assert.deepEqual(
      persistedFiles,
      [
        "2026-04-02T13-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json",
        "2026-04-02T13-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.md",
        "2026-04-02T13-31-00-000Z-dw-transform-code-normalizer-normalize-code.json",
        "2026-04-02T13-31-00-000Z-dw-transform-code-normalizer-normalize-code.md",
        "2026-04-02T13-32-00-000Z-dw-test-slow-callable-capability-sleep-tool.json",
        "2026-04-02T13-32-00-000Z-dw-test-slow-callable-capability-sleep-tool.md",
      ],
    );
  });

  globalThis.fetch = originalFetch;

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        capabilityIds: descriptors.map((descriptor) => descriptor.capabilityId),
        executionSurface: "shared_runtime_callable_executor",
        proved: [
          "scientify_callable_execution",
          "code_normalizer_callable_execution",
          "execution_record_and_report_persistence",
          "shared_timeout_enforcement",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

void main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checkerId: CHECKER_ID,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
