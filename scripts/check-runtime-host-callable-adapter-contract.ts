import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RUNTIME_HOST_CALLABLE_ADAPTER_CONTRACT_PATH,
  RUNTIME_HOST_CALLABLE_ADAPTER_CONTRACT_VERSION,
  RUNTIME_HOST_CALLABLE_ADAPTER_SCHEMA_PATH,
  buildDescriptorOnlyHostCallableAdapterDescriptor,
  buildRuntimeCallableExecutionHostAdapterDescriptor,
  buildRuntimeHostCallableAdapterDescriptor,
} from "../runtime/lib/runtime-host-callable-adapter-contract.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "runtime_host_callable_adapter_contract";

function readText(relativePath: string) {
  return fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8");
}

function main() {
  const contract = readText(RUNTIME_HOST_CALLABLE_ADAPTER_CONTRACT_PATH);
  assert.match(contract, /host_callable_adapter\.v1/u);
  assert.match(contract, /descriptor_callable/u);
  assert.match(contract, /runtime_callable_execution/u);
  assert.match(contract, /sourceRuntimeExecutionClaimed.*false/u);

  const schema = JSON.parse(readText(RUNTIME_HOST_CALLABLE_ADAPTER_SCHEMA_PATH)) as {
    $id?: string;
    properties?: Record<string, unknown>;
  };
  assert.equal(schema.$id, "directive-workspace/schemas/host-callable-adapter.v1");
  const capabilityKind = schema.properties?.capabilityKind as
    | { enum?: string[] }
    | undefined;
  assert.deepEqual(capabilityKind?.enum, [
    "descriptor_callable",
    "runtime_callable_execution",
  ]);
  const acceptance = schema.properties?.acceptance as
    | { $ref?: string }
    | undefined;
  assert.equal(acceptance?.$ref, "#/$defs/acceptance");
  const defs = (schema as { $defs?: Record<string, { properties?: Record<string, unknown> }> })
    .$defs;
  const acceptanceProperties = defs?.acceptance?.properties as
    | Record<string, { const?: boolean; type?: string }>
    | undefined;
  assert.equal(
    acceptanceProperties?.sourceRuntimeExecutionClaimed?.const,
    false,
  );
  assert.equal(acceptanceProperties?.registryAcceptanceClaimed?.const, false);
  assert.equal(acceptanceProperties?.promotionAutomation?.const, false);
  assert.equal(acceptanceProperties?.runtimeInternalsBypassed?.const, false);

  const descriptorOnly = buildDescriptorOnlyHostCallableAdapterDescriptor({
    adapterId: "research-vault:standalone_host:descriptor_adapter",
    candidateId: "research-vault",
    candidateName: "Research Vault",
    hostName: "Directive Workspace standalone host",
    hostSurface: "standalone descriptor callable",
    callableSurface: "standalone_host.research_vault_descriptor_summary.v1",
    evidencePaths: {
      promotionRecordPath: "runtime/07-promotion-records/example.md",
      promotionSpecificationPath: "runtime/06-promotion-specifications/example.json",
      hostSelectionResolutionPath: "runtime/05-promotion-readiness/example.md",
    },
    proof: {
      primaryChecker: "npm run check:standalone-research-vault-host-callable",
      supportingCheckers: ["npm run check:standalone-research-vault-host-adapter"],
    },
    stopLine: "Descriptor callable only; source execution remains out of scope.",
  });
  assert.equal(
    descriptorOnly.contractVersion,
    RUNTIME_HOST_CALLABLE_ADAPTER_CONTRACT_VERSION,
  );
  assert.equal(descriptorOnly.capabilityKind, "descriptor_callable");
  assert.equal(descriptorOnly.acceptance.descriptorCallableOnly, true);
  assert.equal(descriptorOnly.acceptance.runtimeCallableExecution, false);
  assert.equal(descriptorOnly.acceptance.sourceRuntimeExecutionClaimed, false);
  assert.equal(descriptorOnly.acceptance.hostIntegrationClaimed, false);

  const runtimeExecution = buildRuntimeCallableExecutionHostAdapterDescriptor({
    adapterId: "scientify:standalone_host:runtime_callable_invoke_adapter",
    candidateId: "scientify",
    candidateName: "Scientify",
    hostName: "Directive Workspace standalone host",
    hostSurface: "standalone runtime callable adapter",
    callableSurface: "standalone_host_runtime_scientify_invoke",
    evidencePaths: {
      promotionRecordPath: "runtime/07-promotion-records/scientify.md",
      promotionSpecificationPath: "runtime/06-promotion-specifications/scientify.json",
      callableStubPath:
        "runtime/01-callable-integrations/scientify-callable-integration.ts",
      executionEvidencePath: "runtime/callable-executions/scientify.json",
    },
    proof: {
      primaryChecker: "npm run check:standalone-scientify-host-consumption",
      supportingCheckers: ["npm run check:directive-scientify-runtime-promotion"],
    },
    stopLine: "Runtime-owned callable executes; source execution remains out of scope.",
  });
  assert.equal(runtimeExecution.capabilityKind, "runtime_callable_execution");
  assert.equal(runtimeExecution.acceptance.descriptorCallableOnly, false);
  assert.equal(runtimeExecution.acceptance.runtimeCallableExecution, true);
  assert.equal(runtimeExecution.acceptance.sourceRuntimeExecutionClaimed, false);
  assert.equal(runtimeExecution.acceptance.hostIntegrationClaimed, true);

  assert.throws(
    () =>
      buildRuntimeHostCallableAdapterDescriptor({
        ...descriptorOnly,
        acceptance: {
          ...descriptorOnly.acceptance,
          runtimeCallableExecution: true,
        },
      }),
    /ambiguous_capability_kind/u,
  );
  assert.throws(
    () =>
      buildRuntimeHostCallableAdapterDescriptor({
        ...runtimeExecution,
        acceptance: {
          ...runtimeExecution.acceptance,
          sourceRuntimeExecutionClaimed: true,
        },
      }),
    /source_execution_out_of_scope/u,
  );
  assert.throws(
    () =>
      buildRuntimeHostCallableAdapterDescriptor({
        ...runtimeExecution,
        acceptance: {
          ...runtimeExecution.acceptance,
          registryAcceptanceClaimed: true,
        },
      }),
    /registry_acceptance_out_of_scope/u,
  );
  assert.throws(
    () =>
      buildRuntimeHostCallableAdapterDescriptor({
        ...runtimeExecution,
        acceptance: {
          ...runtimeExecution.acceptance,
          promotionAutomation: true,
        },
      }),
    /promotion_automation_out_of_scope/u,
  );
  assert.throws(
    () =>
      buildRuntimeHostCallableAdapterDescriptor({
        ...runtimeExecution,
        acceptance: {
          ...runtimeExecution.acceptance,
          runtimeInternalsBypassed: true,
        },
      }),
    /runtime_bypass_out_of_scope/u,
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        contractVersion: RUNTIME_HOST_CALLABLE_ADAPTER_CONTRACT_VERSION,
        contractPath: RUNTIME_HOST_CALLABLE_ADAPTER_CONTRACT_PATH,
        schemaPath: RUNTIME_HOST_CALLABLE_ADAPTER_SCHEMA_PATH,
        provenCapabilityKinds: [
          descriptorOnly.capabilityKind,
          runtimeExecution.capabilityKind,
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
