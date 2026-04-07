import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import {
  RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
} from "../runtime/lib/runtime-registry-acceptance-gate.ts";
import type { RuntimeRegistryEntryRequest } from "../runtime/lib/runtime-registry-entry-writer.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCIENTIFY_CANDIDATE_ID =
  "dw-source-scientify-research-workflow-plugin-2026-03-27";
const SCIENTIFY_REGISTRY_ENTRY_PATH =
  "runtime/08-registry/2026-04-07-dw-source-scientify-research-workflow-plugin-2026-03-27-registry-entry.md";
const SCIENTIFY_HOST_ADAPTER_REPORT_PATH =
  "runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json";
const SCIENTIFY_EXECUTION_EVIDENCE_PATH =
  "runtime/callable-executions/2026-04-02T14-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json";

function buildRegistryEntryRequest(): RuntimeRegistryEntryRequest {
  return {
    candidate_id: SCIENTIFY_CANDIDATE_ID,
    candidate_name: "Scientify Literature-Access Tool Bundle",
    registry_date: "2026-04-07",
    linked_promotion_record:
      "runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md",
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
  };
}

async function main() {
  const host = createStandaloneFilesystemHost({
    directiveRoot: DIRECTIVE_ROOT,
  });

  try {
    const result = await host.writeRuntimeRegistryEntry(buildRegistryEntryRequest());

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          candidateId: result.candidate_id,
          registryEntryPath: result.relativePath,
          gateVersion: RUNTIME_REGISTRY_ACCEPTANCE_GATE_VERSION,
          hostAdapterReportPath: SCIENTIFY_HOST_ADAPTER_REPORT_PATH,
          callableExecutionEvidencePath: SCIENTIFY_EXECUTION_EVIDENCE_PATH,
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
