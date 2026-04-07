import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH } from "../runtime/lib/runtime-promotion-specification.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_scientify_host_consumption";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json";
const CALLABLE_STUB_PATH =
  "runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts";
const HOST_CONSUMPTION_REPORT_PATH =
  "runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json";

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.startsWith("https://api.openalex.org/works?")) {
        return new Response(
          JSON.stringify({
            meta: { count: 1 },
            results: [
              {
                id: "https://openalex.org/W0000000001",
                doi: "https://doi.org/10.1000/host-consumption",
                title: "Standalone Host Scientify Consumption Proof",
                publication_year: 2026,
                publication_date: "2026-04-02",
                type: "article",
                cited_by_count: 3,
                authorships: [{ author: { display_name: "Directive Workspace" } }],
                primary_location: {
                  source: { display_name: "Host Adapter Test Journal" },
                },
                open_access: {
                  is_oa: true,
                  oa_url: "https://example.com/host-consumption-proof.pdf",
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

      throw new Error(`Unexpected fetch URL in standalone Scientify host consumption checker: ${url}`);
    };

    const result = await host.invokeScientifyLiteratureAccessTool({
      tool: "openalex-search",
      input: {
        query: "standalone host scientify consumption proof",
        max_results: 1,
      },
      timeoutMs: 5000,
      executionAt: "2026-04-02T14:00:00.000Z",
      persistArtifacts: false,
    });

    assert.equal(result.candidateId, "dw-source-scientify-research-workflow-plugin-2026-03-27");
    assert.equal(result.currentStage, "runtime.promotion_record.opened");
    assert.equal(
      result.proposedHost,
      "Directive Workspace standalone host (hosts/standalone-host/)",
    );
    assert.equal(
      result.linkedArtifacts.runtimePromotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      result.linkedArtifacts.runtimePromotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(result.linkedArtifacts.runtimeCallableStubPath, CALLABLE_STUB_PATH);
    assert.equal(
      result.adapter.compileContractArtifact,
      DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
    );
    assert.equal(
      result.adapter.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(result.adapter.callableStubPath, CALLABLE_STUB_PATH);
    assert.equal(result.adapter.invokeSurface, "standalone_host_runtime_scientify_invoke");
    assert.equal(result.adapter.runtimeExecutorSurface, "runtime/core/callable-execution.ts");
    assert.equal(result.adapter.runtimeInternalsBypassed, false);
    assert.equal(result.adapter.hostIntegrated, true);
    assert.equal(result.adapter.promotionAutomation, false);
    assert.equal(result.adapter.automaticWorkflowAdvancement, false);
    assert.equal(
      result.hostCallableAdapter.contractVersion,
      "host_callable_adapter.v1",
    );
    assert.equal(
      result.hostCallableAdapter.contractPath,
      "shared/contracts/host-callable-adapter.md",
    );
    assert.equal(
      result.hostCallableAdapter.capabilityKind,
      "runtime_callable_execution",
    );
    assert.equal(result.hostCallableAdapter.acceptance.callableThroughHost, true);
    assert.equal(result.hostCallableAdapter.acceptance.descriptorCallableOnly, false);
    assert.equal(result.hostCallableAdapter.acceptance.runtimeCallableExecution, true);
    assert.equal(
      result.hostCallableAdapter.acceptance.sourceRuntimeExecutionClaimed,
      false,
    );
    assert.equal(result.hostCallableAdapter.acceptance.hostIntegrationClaimed, true);
    assert.equal(
      result.hostCallableAdapter.acceptance.registryAcceptanceClaimed,
      false,
    );
    assert.equal(result.hostCallableAdapter.acceptance.promotionAutomation, false);
    assert.equal(
      result.hostCallableAdapter.evidencePaths.promotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      result.hostCallableAdapter.evidencePaths.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(
      result.hostCallableAdapter.evidencePaths.callableStubPath,
      CALLABLE_STUB_PATH,
    );

    assert.equal(result.execution.ok, true);
    assert.equal(result.execution.rawResult.ok, true);
    assert.equal(result.execution.rawResult.status, "success");
    assert.equal(result.execution.record.capability.capabilityId, result.candidateId);
    assert.equal(result.execution.record.invocation.tool, "openalex-search");
    assert.equal(
      result.execution.record.boundary.executionSurface,
      "shared_runtime_callable_executor",
    );
    assert.equal(result.execution.record.boundary.hostIntegrated, false);
    assert.equal(result.execution.absolutePaths, null);

    const raw = result.execution.rawResult.result as {
      ok: true;
      returned: number;
      works: Array<{ title: string }>;
    };
    assert.equal(raw.ok, true);
    assert.equal(raw.returned, 1);
    assert.equal(raw.works[0]?.title, "Standalone Host Scientify Consumption Proof");

    const report = JSON.parse(
      fs.readFileSync(path.join(DIRECTIVE_ROOT, HOST_CONSUMPTION_REPORT_PATH), "utf8"),
    ) as {
      reportVersion: string;
      candidateId: string;
      hostSurface: string;
      invokeSurface: string;
      promotionRecordPath: string;
      promotionSpecificationPath: string;
      callableStubPath: string;
      executionSurface: string;
      sampleInvocation: {
        tool: string;
        status: string;
        persistArtifacts: boolean;
        returned: number;
        topTitle: string;
      };
      acceptance: {
        consumableThroughHost: boolean;
        runtimeInternalsBypassed: boolean;
        hostIntegrated: boolean;
        promotionAutomation: boolean;
        automaticWorkflowAdvancement: boolean;
      };
      hostCallableAdapter: {
        contractVersion: string;
        capabilityKind: string;
        acceptance: {
          descriptorCallableOnly: boolean;
          runtimeCallableExecution: boolean;
          sourceRuntimeExecutionClaimed: boolean;
          hostIntegrationClaimed: boolean;
        };
        evidencePaths: {
          promotionRecordPath: string | null;
          promotionSpecificationPath: string | null;
          callableStubPath?: string | null;
        };
      };
      proof: {
        primaryChecker: string;
        supportingCheckers: string[];
      };
    };
    assert.equal(
      report.reportVersion,
      "standalone_scientify_host_consumption_report/v1",
    );
    assert.equal(report.candidateId, result.candidateId);
    assert.equal(report.hostSurface, result.hostSurface);
    assert.equal(report.invokeSurface, result.adapter.invokeSurface);
    assert.equal(report.promotionRecordPath, PROMOTION_RECORD_PATH);
    assert.equal(report.promotionSpecificationPath, PROMOTION_SPECIFICATION_PATH);
    assert.equal(report.callableStubPath, CALLABLE_STUB_PATH);
    assert.equal(report.executionSurface, result.execution.record.boundary.executionSurface);
    assert.equal(report.sampleInvocation.tool, result.execution.record.invocation.tool);
    assert.equal(report.sampleInvocation.status, result.execution.rawResult.status);
    assert.equal(report.sampleInvocation.persistArtifacts, false);
    assert.equal(report.sampleInvocation.returned, raw.returned);
    assert.equal(report.sampleInvocation.topTitle, raw.works[0]?.title);
    assert.equal(report.acceptance.consumableThroughHost, true);
    assert.equal(report.acceptance.runtimeInternalsBypassed, false);
    assert.equal(report.acceptance.hostIntegrated, true);
    assert.equal(report.acceptance.promotionAutomation, false);
    assert.equal(report.acceptance.automaticWorkflowAdvancement, false);
    assert.equal(report.hostCallableAdapter.contractVersion, "host_callable_adapter.v1");
    assert.equal(
      report.hostCallableAdapter.capabilityKind,
      "runtime_callable_execution",
    );
    assert.equal(
      report.hostCallableAdapter.acceptance.descriptorCallableOnly,
      false,
    );
    assert.equal(
      report.hostCallableAdapter.acceptance.runtimeCallableExecution,
      true,
    );
    assert.equal(
      report.hostCallableAdapter.acceptance.sourceRuntimeExecutionClaimed,
      false,
    );
    assert.equal(
      report.hostCallableAdapter.acceptance.hostIntegrationClaimed,
      true,
    );
    assert.equal(
      report.hostCallableAdapter.evidencePaths.promotionRecordPath,
      PROMOTION_RECORD_PATH,
    );
    assert.equal(
      report.hostCallableAdapter.evidencePaths.promotionSpecificationPath,
      PROMOTION_SPECIFICATION_PATH,
    );
    assert.equal(
      report.hostCallableAdapter.evidencePaths.callableStubPath,
      CALLABLE_STUB_PATH,
    );
    assert.equal(
      report.proof.primaryChecker,
      "npm run check:standalone-scientify-host-consumption",
    );

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          candidateId: result.candidateId,
          currentStage: result.currentStage,
          hostSurface: result.hostSurface,
          invokeSurface: result.adapter.invokeSurface,
          executionSurface: result.execution.record.boundary.executionSurface,
          reportPath: HOST_CONSUMPTION_REPORT_PATH,
          tool: result.execution.record.invocation.tool,
          status: result.execution.rawResult.status,
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    globalThis.fetch = originalFetch;
    host.close();
  }
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
