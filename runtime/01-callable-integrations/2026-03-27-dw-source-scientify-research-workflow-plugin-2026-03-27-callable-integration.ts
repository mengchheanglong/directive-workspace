export const DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0 = {
  capabilityId: "dw-source-scientify-research-workflow-plugin-2026-03-27",
  callableId:
    "2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration",
  title: "Scientify Literature-Access Tool Bundle Callable Integration",
  source: {
    runtimeRecordPath:
      "runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md",
    runtimeProofPath:
      "runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md",
    runtimeRuntimeCapabilityBoundaryPath:
      "runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md",
    followUpPath:
      "runtime/00-follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md",
    routingPath:
      "discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md",
  },
  objective:
    "Provide the approved Scientify literature-access bundle as one Runtime-owned callable capability that executes through the bounded executor surface.",
  integrationTargetSurface:
    "Directive Workspace Runtime-owned literature-access bundle callable executor within the bounded Runtime execution surface.",
  expectedEffect:
    "Directive Workspace can invoke the 4-tool literature-access surface through a bounded callable executor with input validation, timeout enforcement, and structured execution results.",
  validationBoundary:
    "Validate against the existing Runtime follow-up, record, proof, capability boundary, promotion-readiness artifact, and the approved literature-access executor; host integration remains a separate later decision.",
  rollbackBoundary:
    "If the callable executor overstates current Runtime readiness, remove the executor module and revert this file's objective/status to the non-executing stub form, falling back to the existing promotion-readiness stop.",
  tools: [
    {
      tool: "arxiv-search",
      functionName: "arxivSearch",
      modulePath: "runtime/capabilities/literature-access/arxiv-search.ts",
      inputType: "ArxivSearchInput",
      resultType: "Promise<ArxivSearchResult>",
    },
    {
      tool: "arxiv-download",
      functionName: "arxivDownload",
      modulePath: "runtime/capabilities/literature-access/arxiv-download.ts",
      inputType: "ArxivDownloadInput",
      resultType: "Promise<ArxivDownloadResult>",
    },
    {
      tool: "openalex-search",
      functionName: "openalexSearch",
      modulePath: "runtime/capabilities/literature-access/openalex-search.ts",
      inputType: "OpenAlexSearchInput",
      resultType: "Promise<OpenAlexSearchResult>",
    },
    {
      tool: "unpaywall-download",
      functionName: "unpaywallDownload",
      modulePath: "runtime/capabilities/literature-access/unpaywall-download.ts",
      inputType: "UnpaywallDownloadInput",
      resultType: "Promise<UnpaywallDownloadResult>",
    },
  ],
} as const;

export type DirectiveRuntimeScientifyCallableIntegrationInput = {
  candidateId?: string;
  objectiveOverride?: string;
  requestedTargetSurface?: string;
  validationBoundaryOverride?: string;
};

export type DirectiveRuntimeScientifyCallableIntegrationResult = {
  status: "callable";
  callableId: string;
  candidateId: string;
  objective: string;
  integrationTargetSurface: string;
  expectedEffect: string;
  validationBoundary: string;
  rollbackBoundary: string;
  executorModulePath: string;
  linkage: {
    runtimeRecordPath: string;
    runtimeProofPath: string;
    runtimeRuntimeCapabilityBoundaryPath: string;
    promotionReadinessPath: string;
    followUpPath: string;
    routingPath: string;
  };
  tools: Array<{
    tool: string;
    functionName: string;
    modulePath: string;
    inputType: string;
    resultType: string;
  }>;
  intendedBehavior: {
    inputShape: string[];
    outputShape: string[];
    description: string;
  };
};

export function runDirectiveRuntimeV0ScientifyLiteratureAccessBundleIntegration(
  input: DirectiveRuntimeScientifyCallableIntegrationInput = {},
): DirectiveRuntimeScientifyCallableIntegrationResult {
  return {
    status: "callable",
    callableId: DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.callableId,
    candidateId:
      input.candidateId
      || DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.capabilityId,
    objective:
      input.objectiveOverride
      || DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.objective,
    integrationTargetSurface:
      input.requestedTargetSurface
      || DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.integrationTargetSurface,
    expectedEffect:
      DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.expectedEffect,
    validationBoundary:
      input.validationBoundaryOverride
      || DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.validationBoundary,
    rollbackBoundary:
      DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.rollbackBoundary,
    executorModulePath:
      "runtime/capabilities/literature-access/executor.ts",
    linkage: {
      ...DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.source,
    },
    tools: [...DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.tools],
    intendedBehavior: {
      inputShape: [
        "tool: ScientifyLiteratureAccessToolName",
        "input: Record<string, unknown>",
        "timeoutMs?: number",
      ],
      outputShape: [
        "ok: boolean",
        "tool: ScientifyLiteratureAccessToolName",
        "status: 'success' | 'error' | 'timeout' | 'disabled' | 'validation_error'",
        "result: unknown",
        "metadata: { startedAt, completedAt, durationMs, timeoutMs, capabilityId }",
      ],
      description:
        "Execute a Scientify literature-access tool through the bounded callable executor with input validation, timeout enforcement, and structured execution results. Host integration remains a separate later decision.",
    },
  };
}
