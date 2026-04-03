export const DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0 = {
  capabilityId: "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
  callableId:
    "2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration",
  title: "mini-swe-agent Runtime Capability Pressure Callable Integration",
  source: {
    runtimeRecordPath:
      "runtime/02-records/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-record.md",
    runtimeProofPath:
      "runtime/03-proof/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-proof.md",
    runtimeRuntimeCapabilityBoundaryPath:
      "runtime/04-capability-boundaries/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-capability-boundary.md",
    promotionReadinessPath:
      "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md",
    followUpPath:
      "runtime/follow-up/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-runtime-follow-up-record.md",
    routingPath:
      "discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md",
  },
  objective:
    "Describe the approved mini-swe-agent Runtime capability pressure as one Runtime-owned callable stub without opening execution, promotion, host integration, or automation.",
  integrationTargetSurface:
    "Directive Workspace Runtime-owned mini-swe coding-agent capability contract within the current non-executing Runtime boundary.",
  expectedEffect:
    "Directive Workspace can point at one explicit callable boundary for the retained mini-swe Runtime candidate instead of leaving callable shape implicit inside the pressure record.",
  validationBoundary:
    "Validate against the existing Runtime follow-up, record, proof, capability boundary, promotion-readiness artifact, and linked Discovery routing record only; do not imply host execution or activation.",
  rollbackBoundary:
    "If the callable stub overstates current Runtime readiness, remove this file and its linked callable-stub references and fall back to the existing promotion-readiness stop.",
  callableBoundary: {
    inputShape: [
      "task: string",
      "repoRoot?: string",
      "constraints?: string[]",
      "expectedOutputs?: string[]",
    ],
    outputShape: [
      "status: 'not_implemented'",
      "candidateId: string",
      "callableId: string",
      "objective: string",
      "integrationTargetSurface: string",
      "expectedEffect: string",
      "validationBoundary: string",
      "rollbackBoundary: string",
      "linkage: artifact references",
    ],
    description:
      "Describe a bounded local/shareable callable wrapper for the retained mini-swe coding-agent pressure candidate while keeping the surface explicit, non-executing, and non-promoted until a later explicit Runtime decision reopens the next seam.",
    safetyRules: [
      "no execution",
      "no host integration side effects",
      "no registry writes",
      "no promotion automation",
    ],
  },
} as const;

export type DirectiveRuntimeLiveMiniSweAgentCallableInput = {
  candidateId?: string;
  objectiveOverride?: string;
  requestedTargetSurface?: string;
  validationBoundaryOverride?: string;
};

export type DirectiveRuntimeLiveMiniSweAgentCallableResult = {
  status: "not_implemented";
  callableId: string;
  candidateId: string;
  objective: string;
  integrationTargetSurface: string;
  expectedEffect: string;
  validationBoundary: string;
  rollbackBoundary: string;
  linkage: {
    runtimeRecordPath: string;
    runtimeProofPath: string;
    runtimeRuntimeCapabilityBoundaryPath: string;
    promotionReadinessPath: string;
    followUpPath: string;
    routingPath: string;
  };
  callableBoundary: {
    inputShape: string[];
    outputShape: string[];
    description: string;
    safetyRules: string[];
  };
};

export function runDirectiveRuntimeV0LiveMiniSweAgentCallableIntegration(
  input: DirectiveRuntimeLiveMiniSweAgentCallableInput = {},
): DirectiveRuntimeLiveMiniSweAgentCallableResult {
  return {
    status: "not_implemented",
    callableId: DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.callableId,
    candidateId:
      input.candidateId
      || DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.capabilityId,
    objective:
      input.objectiveOverride
      || DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.objective,
    integrationTargetSurface:
      input.requestedTargetSurface
      || DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.integrationTargetSurface,
    expectedEffect:
      DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.expectedEffect,
    validationBoundary:
      input.validationBoundaryOverride
      || DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.validationBoundary,
    rollbackBoundary:
      DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.rollbackBoundary,
    linkage: {
      ...DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.source,
    },
    callableBoundary: {
      ...DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.callableBoundary,
      inputShape: [...DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.callableBoundary.inputShape],
      outputShape: [...DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.callableBoundary.outputShape],
      safetyRules: [...DW_LIVE_MINI_SWE_AGENT_ENGINE_PRESSURE_CALLABLE_V0.callableBoundary.safetyRules],
    },
  };
}
