export type DirectiveCheckBatch = {
  id: string;
  concurrency: number;
  commands: string[];
};

export const DIRECTIVE_CHECK_BATCHES: Record<string, DirectiveCheckBatch[]> = {
  main: [
    {
      id: "frontend",
      concurrency: 1,
      commands: [
        "check:frontend-host",
      ],
    },
    {
      id: "foundation",
      concurrency: 4,
      commands: [
        "check:directive-workspace-composition",
        "check:checker-definition-pilot",
        "check:control-authority",
        "check:case-planner-parity",
        "check:architecture-materialization-due-check",
        "check:directive-engine-stage-chaining",
        "check:directive-engine-run-canonical-surface",
        "check:autonomous-lane-loop",
        "check:historical-stale-path-operational-boundary",
        "check:host-integration-kit-front-door-starter",
        "check:host-integration-kit-example-surfaces",
        "check:discovery-mission-routing",
        "check:operator-decision-inbox",
        "check:canonical-read-surface-coverage",
        "check:lane-boundary-imports",
        "check:host-adapter-boundary",
      ],
    },
    {
      id: "runtime-and-ops",
      concurrency: 4,
      commands: [
        "check:runtime-promotion-specification",
        "check:pre-host-promotion-record-prerequisites",
        "check:standalone-scientify-host-adapter",
        "check:standalone-scientify-host-consumption",
        "check:standalone-live-mini-swe-agent-host-adapter",
        "check:standalone-research-vault-host-adapter",
        "check:standalone-research-vault-host-adapter-boundary",
        "check:standalone-research-vault-host-callable",
        "check:standalone-research-vault-source-pack-execution",
        "check:standalone-blisspixel-deepr-host-callable",
        "check:runtime-host-callable-adapter-contract",
        "check:runtime-automation-eligibility-policy",
        "check:runtime-registry-acceptance-gate",
        "check:runtime-promotion-automation-policy-gates",
        "check:directive-live-mini-swe-agent-runtime-callable",
        "check:directive-live-mini-swe-agent-standalone-host-runtime-implementation-slice",
        "check:directive-live-mini-swe-agent-runtime-promotion",
        "check:directive-scientify-runtime-promotion",
        "check:directive-openmoss-runtime-promotion",
        "check:research-engine-discovery-import",
        "check:directive-scientify-runtime-callable",
        "check:directive-code-normalizer-runtime-callable",
        "check:runtime-callable-execution-surface",
        "check:runtime-callable-execution-evidence",
        "check:runtime-cycle-evidence-feedback",
        "check:operational-architecture-improvement-candidates",
        "check:runtime-promotion-assistance",
        "check:dw-web-host-checker-matrix",
        "check:read-only-lifecycle-coordination",
        "check:bounded-persistent-coordination",
        "check:runtime-loop-control",
        "check:operator-simplicity-loop-control",
        "check:completion-slice-selector",
      ],
    },
  ],
  foundation: [
    {
      id: "frontend",
      concurrency: 1,
      commands: [
        "check:frontend-host",
      ],
    },
    {
      id: "foundation",
      concurrency: 4,
      commands: [
        "check:directive-workspace-composition",
        "check:checker-definition-pilot",
        "check:control-authority",
        "check:case-planner-parity",
        "check:architecture-materialization-due-check",
        "check:directive-engine-stage-chaining",
        "check:directive-engine-run-canonical-surface",
        "check:autonomous-lane-loop",
        "check:historical-stale-path-operational-boundary",
        "check:host-integration-kit-front-door-starter",
        "check:host-integration-kit-example-surfaces",
        "check:discovery-mission-routing",
        "check:operator-decision-inbox",
        "check:canonical-read-surface-coverage",
        "check:lane-boundary-imports",
        "check:host-adapter-boundary",
      ],
    },
  ],
  runtime: [
    {
      id: "runtime-and-ops",
      concurrency: 4,
      commands: [
        "check:runtime-promotion-specification",
        "check:pre-host-promotion-record-prerequisites",
        "check:standalone-scientify-host-adapter",
        "check:standalone-scientify-host-consumption",
        "check:standalone-live-mini-swe-agent-host-adapter",
        "check:standalone-research-vault-host-adapter",
        "check:standalone-research-vault-host-adapter-boundary",
        "check:standalone-research-vault-host-callable",
        "check:standalone-research-vault-source-pack-execution",
        "check:standalone-blisspixel-deepr-host-callable",
        "check:runtime-host-callable-adapter-contract",
        "check:runtime-automation-eligibility-policy",
        "check:runtime-registry-acceptance-gate",
        "check:runtime-promotion-automation-policy-gates",
        "check:directive-live-mini-swe-agent-runtime-callable",
        "check:directive-live-mini-swe-agent-standalone-host-runtime-implementation-slice",
        "check:directive-live-mini-swe-agent-runtime-promotion",
        "check:directive-scientify-runtime-promotion",
        "check:directive-openmoss-runtime-promotion",
        "check:research-engine-discovery-import",
        "check:directive-scientify-runtime-callable",
        "check:directive-code-normalizer-runtime-callable",
        "check:runtime-callable-execution-surface",
        "check:runtime-callable-execution-evidence",
        "check:runtime-cycle-evidence-feedback",
        "check:operational-architecture-improvement-candidates",
        "check:runtime-promotion-assistance",
        "check:dw-web-host-checker-matrix",
        "check:read-only-lifecycle-coordination",
        "check:bounded-persistent-coordination",
        "check:runtime-loop-control",
        "check:operator-simplicity-loop-control",
        "check:completion-slice-selector",
      ],
    },
  ],
};

export function readDirectiveCheckBatches(batchSetId: string) {
  const batches = DIRECTIVE_CHECK_BATCHES[batchSetId];
  if (!batches) {
    const available = Object.keys(DIRECTIVE_CHECK_BATCHES).sort().join(", ");
    throw new Error(`invalid_input: unknown check batch set "${batchSetId}". Available: ${available}`);
  }
  return batches;
}
