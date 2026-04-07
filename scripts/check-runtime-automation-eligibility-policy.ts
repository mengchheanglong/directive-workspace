import assert from "node:assert/strict";
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
const CHECKER_ID = "runtime_automation_eligibility_policy";

const SCIENTIFY_HOST_REPORT =
  "runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json";
const RESEARCH_VAULT_DESCRIPTOR_REPORT =
  "runtime/standalone-host/host-consumption/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-host-consumption-report.json";
const RESEARCH_VAULT_SOURCE_PACK_REPORT =
  "runtime/standalone-host/host-executions/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-source-pack-execution-report.json";

function readHostCallableAdapter(relativePath: string) {
  const report = JSON.parse(
    fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8"),
  ) as {
    hostCallableAdapter?: RuntimeHostCallableAdapterDescriptor;
  };
  assert.ok(report.hostCallableAdapter, `${relativePath} should expose hostCallableAdapter`);
  return report.hostCallableAdapter;
}

function assertDirectiveOwnedCallable() {
  const decision = classifyRuntimeAutomationEligibility({
    descriptor: readHostCallableAdapter(SCIENTIFY_HOST_REPORT),
  });
  assert.equal(decision.policyVersion, RUNTIME_AUTOMATION_ELIGIBILITY_POLICY_VERSION);
  assert.equal(decision.candidateClass, "directive_owned_callable");
  assert.equal(decision.hostCallableExecutionAllowed, true);
  assert.equal(decision.registryAcceptanceAllowed, true);
  assert.equal(decision.externalAppExecutionAllowed, false);
}

function assertDescriptorOnly() {
  const decision = classifyRuntimeAutomationEligibility({
    descriptor: readHostCallableAdapter(RESEARCH_VAULT_DESCRIPTOR_REPORT),
  });
  assert.equal(decision.candidateClass, "descriptor_only");
  assert.equal(decision.hostCallableExecutionAllowed, true);
  assert.equal(decision.registryAcceptanceAllowed, false);
  assert.equal(decision.automationAllowed, false);
  assert.equal(decision.externalAppExecutionAllowed, false);
}

function assertSourceDerivedCallable() {
  const decision = classifyRuntimeAutomationEligibility({
    descriptor: readHostCallableAdapter(RESEARCH_VAULT_SOURCE_PACK_REPORT),
  });
  assert.equal(decision.candidateClass, "source_derived_callable");
  assert.equal(decision.hostCallableExecutionAllowed, true);
  assert.equal(decision.registryAcceptanceAllowed, true);
  assert.equal(decision.automationAllowed, true);
  assert.equal(decision.externalAppExecutionAllowed, false);
  assert.ok(decision.stopLine.includes("arbitrary external app execution remains blocked"));
}

function assertExternalAppExecutionBlocks() {
  const base = readHostCallableAdapter(SCIENTIFY_HOST_REPORT);
  const descriptor = {
    ...base,
    acceptance: {
      ...base.acceptance,
      sourceRuntimeExecutionClaimed: true,
    },
  };
  const decision = classifyRuntimeAutomationEligibility({
    descriptor,
  });
  assert.equal(decision.candidateClass, "external_app_execution");
  assert.equal(decision.registryAcceptanceAllowed, false);
  assert.equal(decision.automationAllowed, false);
  assert.equal(decision.externalAppExecutionAllowed, false);
}

function assertUnsupportedBlocks() {
  const decision = classifyRuntimeAutomationEligibility({
    descriptor: null,
  });
  assert.equal(decision.candidateClass, "unsupported");
  assert.equal(decision.hostIntegrationAllowed, false);
  assert.equal(decision.hostCallableExecutionAllowed, false);
  assert.equal(decision.registryAcceptanceAllowed, false);
  assert.equal(decision.automationAllowed, false);
  assert.equal(decision.externalAppExecutionAllowed, false);
}

function main() {
  assertDirectiveOwnedCallable();
  assertDescriptorOnly();
  assertSourceDerivedCallable();
  assertExternalAppExecutionBlocks();
  assertUnsupportedBlocks();

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        policyVersion: RUNTIME_AUTOMATION_ELIGIBILITY_POLICY_VERSION,
        covered: [
          "directive_owned_callable_allows_registry_only_with_later_evidence_gates",
          "descriptor_only_blocks_registry_and_automation_claims",
          "source_derived_callable_preserves_external_app_non_claim",
          "external_app_execution_blocks_default_automation",
          "unsupported_candidate_blocks_all_runtime_automation_claims",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

main();
