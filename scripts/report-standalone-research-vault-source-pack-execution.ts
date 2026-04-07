import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import {
  renderStandaloneResearchVaultSourcePackExecutionReport,
  resolveStandaloneResearchVaultSourcePackExecutionReportPath,
} from "../hosts/standalone-host/runtime-lane.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_AT = "2026-04-07T11:15:00.000Z";

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const invocationResult = await host.invokeResearchVaultSourcePackTool({
      tool: "query-source-pack",
      input: {
        query: "discovery acquisition phase model",
        includeEvidence: true,
        maxItems: 2,
      },
      executionAt: GENERATED_AT,
      persistArtifacts: true,
    });
    const reportPath = resolveStandaloneResearchVaultSourcePackExecutionReportPath({
      candidateId: invocationResult.candidateId,
      generatedAt: GENERATED_AT,
    });
    const absoluteReportPath = path.join(DIRECTIVE_ROOT, reportPath);
    const report = renderStandaloneResearchVaultSourcePackExecutionReport({
      generatedAt: GENERATED_AT,
      invocationResult,
      primaryChecker: "npm run check:standalone-research-vault-source-pack-execution",
    });

    fs.mkdirSync(path.dirname(absoluteReportPath), { recursive: true });
    fs.writeFileSync(absoluteReportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          reportPath,
          candidateId: invocationResult.candidateId,
          callableSurface: report.callableSurface,
          capabilityKind: report.hostCallableAdapter.capabilityKind,
          callableThroughHost: report.acceptance.callableThroughHost,
          runtimeCallableExecution: report.acceptance.runtimeCallableExecution,
          sourceRuntimeExecutionClaimed:
            report.acceptance.sourceRuntimeExecutionClaimed,
          hostIntegrationClaimed: report.acceptance.hostIntegrationClaimed,
          executionEvidencePath: report.executionEvidencePath,
          matchedSectionCount: report.sampleInvocation.matchedSectionCount,
          topSectionId: report.sampleInvocation.topSectionId,
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    host.close();
  }
}

void main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
