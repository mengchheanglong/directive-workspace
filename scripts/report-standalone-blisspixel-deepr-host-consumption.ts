import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import {
  renderStandaloneBlisspixelDeeprHostConsumptionReport,
  resolveStandaloneBlisspixelDeeprHostConsumptionReportPath,
} from "../hosts/standalone-host/runtime-lane.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_AT = "2026-04-07T10:10:00.000Z";
const PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-promotion-record.md";

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const descriptor = await host.readBlisspixelDeeprDescriptor();
    const reportPath = resolveStandaloneBlisspixelDeeprHostConsumptionReportPath({
      candidateId: descriptor.candidateId,
      generatedAt: GENERATED_AT,
    });
    const absoluteReportPath = path.join(DIRECTIVE_ROOT, reportPath);
    const report = renderStandaloneBlisspixelDeeprHostConsumptionReport({
      generatedAt: GENERATED_AT,
      descriptor,
      primaryChecker: "npm run check:standalone-blisspixel-deepr-host-callable",
    });

    fs.mkdirSync(path.dirname(absoluteReportPath), { recursive: true });
    fs.writeFileSync(absoluteReportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

    const focus = resolveDirectiveWorkspaceState({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: PROMOTION_RECORD_PATH,
    }).focus;

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          reportPath,
          candidateId: descriptor.candidateId,
          consumableThroughHost: report.acceptance.consumableThroughHost,
          descriptorOnly: report.acceptance.descriptorOnly,
          capabilityKind: report.hostCallableAdapter.capabilityKind,
          hostSurface: report.hostSurface,
          descriptorSurface: report.descriptorSurface,
          currentStage: focus?.currentStage ?? null,
          currentHead: focus?.currentHead ?? null,
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
