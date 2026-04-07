import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import {
  renderStandaloneResearchVaultHostCallableExecutionReport,
  resolveStandaloneResearchVaultHostCallableExecutionReportPath,
} from "../hosts/standalone-host/runtime-lane.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_AT = "2026-04-07T09:45:00.000Z";

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const invocationResult = await host.invokeResearchVaultDescriptorCallable({
      action: "summarize_descriptor",
      includeOpenDecisions: true,
      executedAt: GENERATED_AT,
    });
    const reportPath = resolveStandaloneResearchVaultHostCallableExecutionReportPath({
      candidateId: invocationResult.candidateId,
      generatedAt: GENERATED_AT,
    });
    const absoluteReportPath = path.join(DIRECTIVE_ROOT, reportPath);
    const report = renderStandaloneResearchVaultHostCallableExecutionReport({
      generatedAt: GENERATED_AT,
      invocationResult,
      primaryChecker: "npm run check:standalone-research-vault-host-callable",
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
          callableThroughHost: report.acceptance.callableThroughHost,
          descriptorCallableOnly: report.acceptance.descriptorCallableOnly,
          sourceRuntimeExecutionClaimed:
            report.acceptance.sourceRuntimeExecutionClaimed,
          hostIntegrationClaimed: report.acceptance.hostIntegrationClaimed,
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
