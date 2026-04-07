import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDirectiveRuntimePromotionAutomationDryRunReport,
} from "../engine/coordination/runtime-promotion-automation.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_POLICY = {
  autoHostAdapterDescriptor: false,
  autoHostCallableExecution: false,
  autoWriteRegistryEntry: false,
};

const ARTIFACTS = [
  {
    label: "accepted_scientify_runtime_callable",
    path:
      "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md",
  },
  {
    label: "descriptor_only_research_vault",
    path:
      "runtime/07-promotion-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-record.md",
  },
  {
    label: "pending_host_selection_jackswl",
    path:
      "runtime/05-promotion-readiness/2026-04-07-research-engine-repo-jackswl-deep-researcher-20260407t041754z-20260407t051723.-promotion-readiness.md",
  },
] as const;

function main() {
  const policyPath = path.join(DIRECTIVE_ROOT, "control", "state", "autonomous-lane-loop-policy.json");
  const loaded = fs.existsSync(policyPath)
    ? JSON.parse(fs.readFileSync(policyPath, "utf8")) as {
      runtime?: Partial<typeof DEFAULT_POLICY>;
    }
    : {};
  const policy = {
    autoHostAdapterDescriptor:
      loaded.runtime?.autoHostAdapterDescriptor ?? DEFAULT_POLICY.autoHostAdapterDescriptor,
    autoHostCallableExecution:
      loaded.runtime?.autoHostCallableExecution ?? DEFAULT_POLICY.autoHostCallableExecution,
    autoWriteRegistryEntry:
      loaded.runtime?.autoWriteRegistryEntry ?? DEFAULT_POLICY.autoWriteRegistryEntry,
  };
  const reports = ARTIFACTS.map((artifact) => ({
    label: artifact.label,
    report: buildDirectiveRuntimePromotionAutomationDryRunReport({
      directiveRoot: DIRECTIVE_ROOT,
      promotionRecordPath: artifact.path,
      policy,
      approvedBy: "runtime-promotion-automation-policy-report",
      acceptedAt: "2026-04-07T13:00:00.000Z",
    }),
  }));

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        reportId: "runtime_promotion_automation_policy_gates",
        policy,
        reports,
        stopLine:
          "This is a dry-run eligibility report only; no registry entry, host adapter descriptor, host callable execution, or promotion automation is written.",
      },
      null,
      2,
    )}\n`,
  );
}

main();
