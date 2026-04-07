import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOST_CONSUMPTION_REPORT_PATH =
  "runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md";

function main() {
  const report = JSON.parse(
    fs.readFileSync(path.join(DIRECTIVE_ROOT, HOST_CONSUMPTION_REPORT_PATH), "utf8"),
  ) as Record<string, unknown>;
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_RECORD_PATH,
  }).focus;

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        reportPath: HOST_CONSUMPTION_REPORT_PATH,
        candidateId: report.candidateId,
        consumableThroughHost: report.acceptance
          && typeof report.acceptance === "object"
          && (report.acceptance as Record<string, unknown>).consumableThroughHost === true,
        hostSurface: report.hostSurface,
        invokeSurface: report.invokeSurface,
        executionSurface: report.executionSurface,
        sampleInvocation: report.sampleInvocation,
        currentStage: focus?.currentStage ?? null,
        currentHead: focus?.currentHead ?? null,
      },
      null,
      2,
    )}\n`,
  );
}

main();
