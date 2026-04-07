import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDirectiveRuntimePromotionAutomationDryRunReport,
} from "../engine/coordination/runtime-promotion-automation.ts";
import {
  runDirectiveAutonomousLaneLoopSupervised,
} from "../engine/coordination/autonomous-lane-loop.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import {
  copyRelativeFiles,
  writeJson,
} from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "runtime_promotion_automation_policy_gates";
const SCIENTIFY_PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md";
const RESEARCH_VAULT_PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-record.md";
const JACKSWL_PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-04-07-research-engine-repo-jackswl-deep-researcher-20260407t041754z-20260407t051723.-promotion-readiness.md";

const DISABLED_POLICY = {
  autoHostAdapterDescriptor: false,
  autoHostCallableExecution: false,
  autoWriteRegistryEntry: false,
};
const WRITE_ENABLED_POLICY = {
  autoHostAdapterDescriptor: false,
  autoHostCallableExecution: false,
  autoWriteRegistryEntry: true,
};

function writeAutonomousPolicy(directiveRoot: string, runtimePolicy = WRITE_ENABLED_POLICY) {
  writeJson(path.join(directiveRoot, "control", "state", "autonomous-lane-loop-policy.json"), {
    enabled: true,
    approvedBy: "runtime-promotion-automation-policy-gate-checker",
    maxActionsPerRun: 4,
    discovery: {
      autoOpenRoute: true,
      requireNoHumanReview: true,
      minimumConfidence: "high",
    },
    architecture: {
      autoStartFromHandoff: true,
      autoCloseBoundedStart: true,
      autoAdoptBoundedResult: true,
      autoCreateImplementationTargetForPlannedNext: true,
      autoCompleteMaterializationChain: true,
    },
    runtime: {
      autoAdvanceToPromotionReadiness: true,
      autoGeneratePromotionSpecification: true,
      autoCreatePromotionRecord: true,
      requireNoHumanReview: true,
      ...runtimePolicy,
    },
  });
}

function copyScientifyPromotionChainWithoutRegistry(targetRoot: string) {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: SCIENTIFY_PROMOTION_RECORD_PATH,
    includeAnchors: false,
  }).focus;

  assert.ok(focus, "scientify promotion focus should resolve");
  copyRelativeFiles(
    [
      focus.linkedArtifacts.discoveryRoutingPath,
      focus.linkedArtifacts.engineRunRecordPath,
      focus.linkedArtifacts.engineRunReportPath,
      focus.linkedArtifacts.runtimeFollowUpPath,
      focus.linkedArtifacts.runtimeRecordPath,
      focus.linkedArtifacts.runtimeProofPath,
      focus.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
      focus.linkedArtifacts.runtimePromotionReadinessPath,
      focus.linkedArtifacts.runtimePromotionRecordPath,
      focus.linkedArtifacts.runtimePromotionSpecificationPath,
      focus.linkedArtifacts.runtimeCallableStubPath,
      focus.linkedArtifacts.runtimeHostConsumptionReportPath,
      "runtime/callable-executions/2026-04-02T14-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json",
      "shared/contracts/runtime-to-host.md",
      "shared/contracts/host-callable-adapter.md",
      "shared/schemas/host-callable-adapter.v1.schema.json",
    ],
    DIRECTIVE_ROOT,
    targetRoot,
  );
}

function assertDisabledPolicyReportsEvidenceButNoWrite(directiveRoot: string) {
  const report = buildDirectiveRuntimePromotionAutomationDryRunReport({
    directiveRoot,
    promotionRecordPath: SCIENTIFY_PROMOTION_RECORD_PATH,
    policy: DISABLED_POLICY,
    approvedBy: "checker",
    acceptedAt: "2026-04-07T13:00:00.000Z",
  });

  assert.equal(report.evidenceEligible, true);
  assert.equal(report.candidateClass, "directive_owned_callable");
  assert.equal(report.automationEligible, false);
  assert.equal(report.wouldWriteRegistryEntry, false);
  assert.equal(report.registryRequest, null);
  assert.ok(
    report.stopReason.includes("disabled by policy"),
    "disabled dry-run should explain the policy stop",
  );
}

function assertPendingHostSelectionBlocksAutomation() {
  const report = buildDirectiveRuntimePromotionAutomationDryRunReport({
    directiveRoot: DIRECTIVE_ROOT,
    promotionRecordPath: JACKSWL_PROMOTION_READINESS_PATH,
    policy: WRITE_ENABLED_POLICY,
    approvedBy: "checker",
    acceptedAt: "2026-04-07T13:00:00.000Z",
  });

  assert.equal(report.evidenceEligible, false);
  assert.equal(report.candidateClass, "unsupported");
  assert.equal(report.automationEligible, false);
  assert.ok(
    report.gates.some((gate) =>
      gate.id === "runtime.promotion_record.opened"
      && gate.status === "blocked"
      && gate.reason.includes("runtime.promotion_readiness.opened")
    ),
  );
}

function assertDescriptorOnlyCannotBecomeSourceExecution() {
  const report = buildDirectiveRuntimePromotionAutomationDryRunReport({
    directiveRoot: DIRECTIVE_ROOT,
    promotionRecordPath: RESEARCH_VAULT_PROMOTION_RECORD_PATH,
    policy: WRITE_ENABLED_POLICY,
    approvedBy: "checker",
    acceptedAt: "2026-04-07T13:00:00.000Z",
  });

  assert.equal(report.evidenceEligible, false);
  assert.equal(report.candidateClass, "descriptor_only");
  assert.equal(report.automationEligible, false);
  assert.ok(
    report.gates.some((gate) =>
      gate.id === "descriptor_only_not_source_execution"
      && gate.status === "blocked"
    ),
  );
}

function assertMissingExecutionEvidenceBlocksAutomation() {
  withTempDirectiveRoot(
    { prefix: "runtime-promotion-automation-missing-execution-" },
    (directiveRoot) => {
      copyScientifyPromotionChainWithoutRegistry(directiveRoot);
      fs.rmSync(
        path.join(
          directiveRoot,
          "runtime/callable-executions/2026-04-02T14-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json",
        ),
        { force: true },
      );

      const report = buildDirectiveRuntimePromotionAutomationDryRunReport({
        directiveRoot,
        promotionRecordPath: SCIENTIFY_PROMOTION_RECORD_PATH,
        policy: {
          autoHostAdapterDescriptor: false,
          autoHostCallableExecution: true,
          autoWriteRegistryEntry: true,
        },
        approvedBy: "checker",
        acceptedAt: "2026-04-07T13:00:00.000Z",
      });

      assert.equal(report.evidenceEligible, false);
      assert.equal(report.automationEligible, false);
      assert.ok(
        report.gates.some((gate) =>
          gate.id === "callable_execution_evidence"
          && gate.status === "blocked"
          && gate.reason.includes("missing")
        ),
      );
    },
  );
}

async function main() {
  await withTempDirectiveRoot(
    { prefix: "runtime-promotion-automation-policy-gates-" },
    async (directiveRoot) => {
      copyScientifyPromotionChainWithoutRegistry(directiveRoot);
      assertDisabledPolicyReportsEvidenceButNoWrite(directiveRoot);

      const dryRun = buildDirectiveRuntimePromotionAutomationDryRunReport({
        directiveRoot,
        promotionRecordPath: SCIENTIFY_PROMOTION_RECORD_PATH,
        policy: WRITE_ENABLED_POLICY,
        approvedBy: "checker",
        acceptedAt: "2026-04-07T13:00:00.000Z",
      });
      assert.equal(dryRun.evidenceEligible, true);
      assert.equal(dryRun.candidateClass, "directive_owned_callable");
      assert.equal(dryRun.automationEligible, true);
      assert.equal(dryRun.wouldWriteRegistryEntry, true);

      writeAutonomousPolicy(directiveRoot, WRITE_ENABLED_POLICY);
      const result = await runDirectiveAutonomousLaneLoopSupervised({
        directiveRoot,
        artifactPath: SCIENTIFY_PROMOTION_RECORD_PATH,
      });
      assert.deepEqual(
        result.actions.map((action) => action.actionKind),
        ["runtime_registry_entry_write"],
      );
      assert.equal(result.finalDisposition, "stopped");
      const registryPath = result.actions[0]?.targetPath;
      assert.ok(registryPath);
      assert.equal(fs.existsSync(path.join(directiveRoot, registryPath)), true);
      const registryFocus = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: registryPath,
        includeAnchors: false,
      }).focus;
      assert.equal(registryFocus?.currentStage, "runtime.registry.accepted");
    },
  );

  assertPendingHostSelectionBlocksAutomation();
  assertDescriptorOnlyCannotBecomeSourceExecution();
  assertMissingExecutionEvidenceBlocksAutomation();

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        covered: [
          "eligible_runtime_callable_execution_can_write_registry_only_when_policy_enabled",
          "disabled_default_policy_reports_no_write",
          "pending_host_selection_blocks_before_promotion_record",
          "missing_execution_evidence_blocks_registry_automation",
          "descriptor_only_cannot_be_treated_as_source_execution",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checkerId: CHECKER_ID,
        error: error instanceof Error ? error.stack ?? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
