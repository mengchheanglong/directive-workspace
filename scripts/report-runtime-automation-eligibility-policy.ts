import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  classifyRuntimeAutomationEligibility,
  RUNTIME_AUTOMATION_ELIGIBILITY_POLICY_VERSION,
} from "../runtime/lib/runtime-automation-eligibility-policy.ts";
import type {
  RuntimeHostCallableAdapterDescriptor,
} from "../runtime/lib/runtime-host-callable-adapter-contract.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const REPORTS = [
  {
    label: "directive_owned_callable_scientify",
    path:
      "runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json",
  },
  {
    label: "descriptor_only_research_vault",
    path:
      "runtime/standalone-host/host-consumption/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-host-consumption-report.json",
  },
  {
    label: "descriptor_only_blisspixel_deepr",
    path:
      "runtime/standalone-host/host-consumption/2026-04-07-research-engine-repo-blisspixel-deepr-20260407t052643z-20260407t072402.-host-consumption-report.json",
  },
  {
    label: "source_derived_callable_research_vault_source_pack",
    path:
      "runtime/standalone-host/host-executions/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-source-pack-execution-report.json",
  },
] as const;

function readDescriptor(relativePath: string) {
  const report = JSON.parse(
    fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8"),
  ) as {
    hostCallableAdapter?: RuntimeHostCallableAdapterDescriptor;
  };
  return report.hostCallableAdapter ?? null;
}

function main() {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        reportId: "runtime_automation_eligibility_policy",
        policyVersion: RUNTIME_AUTOMATION_ELIGIBILITY_POLICY_VERSION,
        candidates: REPORTS.map((entry) => ({
          label: entry.label,
          reportPath: entry.path,
          eligibility: classifyRuntimeAutomationEligibility({
            descriptor: readDescriptor(entry.path),
          }),
        })),
        stopLine:
          "Eligibility classification is report-only; it does not create host adapters, execute callables, write registry entries, or automate promotion by itself.",
      },
      null,
      2,
    )}\n`,
  );
}

main();
