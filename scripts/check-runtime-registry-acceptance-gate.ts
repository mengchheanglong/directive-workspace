import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import {
  RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
  evaluateRuntimeRegistryAcceptanceGate,
} from "../runtime/lib/runtime-registry-acceptance-gate.ts";
import {
  renderRuntimeRegistryEntry,
  type RuntimeRegistryEntryRequest,
} from "../runtime/lib/runtime-registry-entry-writer.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "runtime_registry_acceptance_gate";
const SCIENTIFY_CANDIDATE_ID =
  "dw-source-scientify-research-workflow-plugin-2026-03-27";
const SCIENTIFY_REGISTRY_ENTRY_PATH =
  "runtime/08-registry/2026-04-07-dw-source-scientify-research-workflow-plugin-2026-03-27-registry-entry.md";
const SCIENTIFY_PROMOTION_RECORD_PATH =
  "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md";
const SCIENTIFY_PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json";
const SCIENTIFY_HOST_ADAPTER_REPORT_PATH =
  "runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json";
const SCIENTIFY_EXECUTION_EVIDENCE_PATH =
  "runtime/callable-executions/2026-04-02T14-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json";
const RESEARCH_VAULT_DESCRIPTOR_REPORT_PATH =
  "runtime/standalone-host/host-executions/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-host-callable-execution-report.json";

function buildScientifyRegistryRequest(
  overrides: Partial<RuntimeRegistryEntryRequest> = {},
): RuntimeRegistryEntryRequest {
  return {
    candidate_id: SCIENTIFY_CANDIDATE_ID,
    candidate_name: "Scientify Literature-Access Tool Bundle",
    registry_date: "2026-04-07",
    linked_promotion_record: SCIENTIFY_PROMOTION_RECORD_PATH,
    host: "Directive Workspace standalone host (hosts/standalone-host/)",
    runtime_surface: "standalone_host_runtime_scientify_invoke",
    runtime_status: "registry.accepted_manual_runtime_callable_execution",
    proof_path: SCIENTIFY_HOST_ADAPTER_REPORT_PATH,
    last_validated_by:
      "npm run check:runtime-registry-acceptance-gate && npm run check:standalone-scientify-host-consumption",
    last_validation_date: "2026-04-07",
    active_risks: [
      "Registry acceptance is manual and bounded to the standalone-host Scientify literature-access callable.",
      "Imported-source execution, promotion automation, and generic host integration remain out of scope.",
    ],
    rollback_path:
      "Delete this registry entry and keep the Scientify promotion record at manual promotion state; no Runtime callable source files need to be removed.",
    notes: [
      "Accepted through runtime_registry_acceptance_gate.v1 after promotion record, promotion specification, host adapter report, and callable execution evidence were verified.",
      "This is one manually accepted Runtime-owned callable capability, not blanket registry acceptance for descriptor-only or future Runtime imports.",
    ],
    acceptance_gate: {
      gate_version: RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
      acceptance_state: "accepted",
      accepted_by: "Directive Workspace operator",
      accepted_at: "2026-04-07T12:30:00.000Z",
      host_callable_adapter_report_path: SCIENTIFY_HOST_ADAPTER_REPORT_PATH,
      callable_execution_evidence_path: SCIENTIFY_EXECUTION_EVIDENCE_PATH,
      descriptor_only_registry_status_allowed: false,
      notes: [
        "Scientify is accepted because it has runtime_callable_execution host-adapter proof and a successful Runtime callable execution record.",
      ],
    },
    output_relative_path: SCIENTIFY_REGISTRY_ENTRY_PATH,
    ...overrides,
  };
}

function assertAcceptedScientifyGate() {
  const request = buildScientifyRegistryRequest();
  const report = evaluateRuntimeRegistryAcceptanceGate({
    directiveRoot: DIRECTIVE_ROOT,
    request,
  });

  assert.equal(report.ok, true);
  assert.equal(report.gateVersion, RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION);
  assert.equal(report.acceptanceState, "accepted");
  assert.equal(report.candidateId, SCIENTIFY_CANDIDATE_ID);
  assert.equal(report.capabilityKind, "runtime_callable_execution");
  assert.equal(report.hostCallableAdapterReportPath, SCIENTIFY_HOST_ADAPTER_REPORT_PATH);
  assert.equal(report.callableExecutionEvidencePath, SCIENTIFY_EXECUTION_EVIDENCE_PATH);
  assert.equal(report.linkedPromotionRecordPath, SCIENTIFY_PROMOTION_RECORD_PATH);
  assert.equal(report.promotionSpecificationPath, SCIENTIFY_PROMOTION_SPECIFICATION_PATH);
  assert.equal(report.proofPath, SCIENTIFY_HOST_ADAPTER_REPORT_PATH);
  assert.equal(report.flags.callableThroughHost, true);
  assert.equal(report.flags.descriptorCallableOnly, false);
  assert.equal(report.flags.runtimeCallableExecution, true);
  assert.equal(report.flags.sourceRuntimeExecutionClaimed, false);
  assert.equal(report.flags.hostIntegrationClaimed, true);
  assert.equal(report.flags.registryAcceptanceClaimedBeforeGate, false);
  assert.equal(report.flags.promotionAutomation, false);
  assert.equal(report.flags.runtimeInternalsBypassed, false);
  assert.deepEqual(report.violations, []);

  const rendered = renderRuntimeRegistryEntry(request);
  assert.match(rendered, /Registry Acceptance Gate/u);
  assert.match(rendered, /runtime_registry_acceptance_gate\.v1/u);
  assert.match(rendered, /standalone_host_runtime_scientify_invoke/u);
  assert.match(rendered, /registry\.accepted_manual_runtime_callable_execution/u);
}

function assertDescriptorOnlyFailsClosed() {
  const request = buildScientifyRegistryRequest({
    candidate_id:
      "research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.",
    candidate_name: "Research Vault: Open Source Agentic AI Research Assistant",
    linked_promotion_record:
      "runtime/07-promotion-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-record.md",
    proof_path: RESEARCH_VAULT_DESCRIPTOR_REPORT_PATH,
    acceptance_gate: {
      gate_version: RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
      acceptance_state: "accepted",
      accepted_by: "Directive Workspace operator",
      accepted_at: "2026-04-07T12:31:00.000Z",
      host_callable_adapter_report_path: RESEARCH_VAULT_DESCRIPTOR_REPORT_PATH,
      descriptor_only_registry_status_allowed: false,
    },
    output_relative_path: null,
  });
  const report = evaluateRuntimeRegistryAcceptanceGate({
    directiveRoot: DIRECTIVE_ROOT,
    request,
  });

  assert.equal(report.ok, false);
  assert.equal(report.capabilityKind, "descriptor_callable");
  assert.ok(
    report.violations.includes("descriptor_only_registry_status:policy_not_allowed"),
  );
}

function assertMissingExecutionEvidenceFailsClosed() {
  const request = buildScientifyRegistryRequest({
    acceptance_gate: {
      gate_version: RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
      acceptance_state: "accepted",
      accepted_by: "Directive Workspace operator",
      accepted_at: "2026-04-07T12:32:00.000Z",
      host_callable_adapter_report_path: SCIENTIFY_HOST_ADAPTER_REPORT_PATH,
      callable_execution_evidence_path:
        "runtime/callable-executions/missing-scientify-openalex-search.json",
      descriptor_only_registry_status_allowed: false,
    },
    output_relative_path: null,
  });
  const report = evaluateRuntimeRegistryAcceptanceGate({
    directiveRoot: DIRECTIVE_ROOT,
    request,
  });

  assert.equal(report.ok, false);
  assert.ok(
    report.violations.some((violation) =>
      violation.startsWith(
        "acceptance_gate.callable_execution_evidence_path:not_found",
      )
    ),
  );
}

function assertRegistryEntryMaterialized() {
  const registryPath = path.join(DIRECTIVE_ROOT, SCIENTIFY_REGISTRY_ENTRY_PATH);
  assert.equal(fs.existsSync(registryPath), true);
  const content = fs.readFileSync(registryPath, "utf8");
  assert.match(content, /Registry Entry: Scientify Literature-Access Tool Bundle/u);
  assert.match(content, /Registry Acceptance Gate/u);
  assert.match(content, /registry\.accepted_manual_runtime_callable_execution/u);
  assert.match(content, /runtime_registry_acceptance_gate\.v1/u);
  assert.doesNotMatch(content, /descriptor-only registry status allowed: `true`/iu);
}

function assertRegistryStateSurfaceDistinguishesAcceptance() {
  const registryFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: SCIENTIFY_REGISTRY_ENTRY_PATH,
    includeAnchors: false,
  }).focus;
  assert.equal(registryFocus.artifactKind, "runtime_registry_accepted");
  assert.equal(registryFocus.artifactStage, "runtime.registry.accepted");
  assert.equal(registryFocus.currentStage, "runtime.registry.accepted");
  assert.equal(registryFocus.currentHead.artifactPath, SCIENTIFY_REGISTRY_ENTRY_PATH);
  assert.equal(
    registryFocus.linkedArtifacts.runtimePromotionRecordPath,
    SCIENTIFY_PROMOTION_RECORD_PATH,
  );

  const promotionRecordFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: SCIENTIFY_PROMOTION_RECORD_PATH,
    includeAnchors: false,
  }).focus;
  assert.equal(promotionRecordFocus.artifactKind, "runtime_promotion_record");
  assert.equal(promotionRecordFocus.artifactStage, "runtime.promotion_record.opened");
  assert.equal(promotionRecordFocus.currentStage, "runtime.promotion_record.opened");
  assert.equal(
    promotionRecordFocus.currentHead.artifactPath,
    SCIENTIFY_REGISTRY_ENTRY_PATH,
  );
  assert.equal(
    promotionRecordFocus.linkedArtifacts.runtimeRegistryEntryPath,
    SCIENTIFY_REGISTRY_ENTRY_PATH,
  );
}

function main() {
  assertAcceptedScientifyGate();
  assertDescriptorOnlyFailsClosed();
  assertMissingExecutionEvidenceFailsClosed();
  assertRegistryEntryMaterialized();
  assertRegistryStateSurfaceDistinguishesAcceptance();

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        acceptedCandidateId: SCIENTIFY_CANDIDATE_ID,
        registryEntryPath: SCIENTIFY_REGISTRY_ENTRY_PATH,
        gateVersion: RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
        boundaries: [
          "descriptor_only_candidates_fail_without_explicit_policy",
          "runtime_callable_execution_requires_execution_evidence",
          "manual_registry_acceptance_only",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

try {
  main();
} catch (error) {
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
}
