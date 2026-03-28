import fs from "node:fs";
import path from "node:path";

import { isDirectiveCurrentStageEligibleForOpening } from "../../engine/approval-boundary.ts";
import {
  readDirectiveArchitectureBoundedCloseoutAssist,
  readDirectiveArchitectureResultEvidenceForResult,
  readDirectiveArchitectureResultEvidenceForStart,
  readDirectiveArchitectureBoundedResultArtifact,
  readDirectiveArchitectureBoundedStartArtifact,
  type DirectiveArchitectureBoundedCloseoutAssist,
  type DirectiveArchitectureResultEvidenceSlot,
  type DirectiveArchitectureBoundedResultArtifact,
  type DirectiveArchitectureBoundedStartArtifact,
} from "../../shared/lib/architecture-bounded-closeout.ts";
import {
  readDirectiveArchitectureAdoptionDetail,
  type DirectiveArchitectureAdoptionDetail,
} from "../../shared/lib/architecture-result-adoption.ts";
import {
  readDirectiveArchitectureImplementationTargetDetail,
  readDirectiveArchitectureImplementationTargetPathForAdoption,
  type DirectiveArchitectureImplementationTargetDetail,
} from "../../shared/lib/architecture-implementation-target.ts";
import {
  readDirectiveArchitectureImplementationResultDetail,
  readDirectiveArchitectureImplementationResultPathForTarget,
  type DirectiveArchitectureImplementationResultDetail,
} from "../../shared/lib/architecture-implementation-result.ts";
import {
  readDirectiveArchitectureRetentionDetail,
  type DirectiveArchitectureRetentionDetail,
} from "../../shared/lib/architecture-retention.ts";
import {
  readDirectiveArchitectureIntegrationRecordDetail,
  type DirectiveArchitectureIntegrationRecordDetail,
} from "../../shared/lib/architecture-integration-record.ts";
import {
  readDirectiveArchitectureConsumptionRecordDetail,
  type DirectiveArchitectureConsumptionRecordDetail,
} from "../../shared/lib/architecture-consumption-record.ts";
import {
  readDirectiveArchitecturePostConsumptionEvaluationDetail,
  type DirectiveArchitecturePostConsumptionEvaluationDetail,
} from "../../shared/lib/architecture-post-consumption-evaluation.ts";
import {
  readDirectiveArchitectureHandoffArtifact,
  type DirectiveArchitectureHandoffArtifact,
} from "../../shared/lib/architecture-handoff-start.ts";
import {
  readDirectiveDiscoveryRoutingArtifact,
  type DirectiveDiscoveryRoutingArtifact,
} from "../../shared/lib/discovery-route-opener.ts";
import {
  readDirectiveRuntimeFollowUpArtifact,
  type DirectiveRuntimeFollowUpArtifact,
} from "../../shared/lib/runtime-follow-up-opener.ts";
import {
  readDirectiveRuntimeRecordArtifact,
  type DirectiveRuntimeRecordArtifact,
} from "../../shared/lib/runtime-record-proof-opener.ts";
import {
  readDirectiveRuntimeProofArtifact,
  type DirectiveRuntimeProofArtifact,
} from "../../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import {
  readDirectiveRuntimeRuntimeCapabilityBoundaryArtifact,
  type DirectiveRuntimeRuntimeCapabilityBoundaryArtifact,
} from "../../shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts";
import {
  readDirectiveEngineRunDetail,
  readDirectiveEngineRunsOverview,
  type DirectiveEngineRunDetail,
  type DirectiveEngineRunsOverview,
} from "../../shared/lib/engine-run-artifacts.ts";
import { resolveDirectiveWorkspaceState } from "../../shared/lib/dw-state.ts";
import { createStandaloneFilesystemHost } from "../standalone-host/runtime.ts";

type StoredFrontendQueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  received_at: string;
  status: string;
  routing_target: string | null;
  capability_gap_id: string | null;
  intake_record_path: string | null;
  fast_path_record_path: string | null;
  routing_record_path: string | null;
  result_record_path: string | null;
  notes: string | null;
};

export type FrontendCurrentHead = {
  artifact_path: string;
  artifact_kind: string;
  artifact_stage: string;
  artifact_lane: string;
  view_path: string;
};

export type FrontendQueueEntry = StoredFrontendQueueEntry & {
  integrity_state: "ok" | "broken" | null;
  status_effective: string;
  status_warning: string | null;
  current_case_stage: string | null;
  current_case_next_legal_step: string | null;
  current_head: FrontendCurrentHead | null;
  runtime_summary: {
    proposed_host: string | null;
    promotion_readiness_blockers: string[];
  } | null;
};

export type FrontendQueueOverview = {
  ok: boolean;
  rootPath: string;
  queuePath: string;
  updatedAt: string | null;
  totalEntries: number;
  entries: FrontendQueueEntry[];
};

export type FrontendHandoffStub = {
  kind:
    | "architecture_handoff"
    | "architecture_handoff_invalid"
    | "runtime_follow_up"
    | "runtime_follow_up_legacy"
    | "runtime_handoff_legacy";
  lane: "architecture" | "runtime";
  relativePath: string;
  candidateId: string;
  title: string;
  status: string;
  startRelativePath: string | null;
  warning: string | null;
};

export type DirectiveFrontendSnapshot = {
  engineRuns: DirectiveEngineRunsOverview;
  queue: FrontendQueueOverview;
  runtimeSummary: {
    activeCases: Array<{
      candidate_id: string;
      candidate_name: string;
      current_case_stage: string | null;
      current_case_next_legal_step: string | null;
      current_head: FrontendCurrentHead | null;
      runtime_summary: {
        proposed_host: string | null;
        promotion_readiness_blockers: string[];
      } | null;
    }>;
    recentAnchors: Array<{
      label: string;
      artifactPath: string;
      currentStage: string;
      nextLegalStep: string;
      candidateId: string | null;
      candidateName: string | null;
    }>;
  };
  architectureSummary: {
    activeCases: Array<{
      candidate_id: string;
      candidate_name: string;
      current_case_stage: string | null;
      current_case_next_legal_step: string | null;
      current_head: FrontendCurrentHead | null;
    }>;
    recentAnchors: Array<{
      label: string;
      artifactPath: string;
      currentStage: string;
      nextLegalStep: string;
      candidateId: string | null;
      candidateName: string | null;
    }>;
  };
  architectureHandoffs: DirectiveArchitectureHandoffArtifact[];
  handoffStubs: FrontendHandoffStub[];
  handoffWarnings: string[];
};

export type DirectiveFrontendHandoffDetail =
  | {
      ok: true;
      kind: "architecture_handoff";
      relativePath: string;
      content: string;
      artifact: DirectiveArchitectureHandoffArtifact;
    }
  | {
      ok: true;
      kind: "runtime_follow_up";
      relativePath: string;
      content: string;
      title: string;
      candidateId: string;
      candidateName: string;
      status: string;
      runtimeValueToOperationalize: string;
      proposedHost: string;
      proposedIntegrationMode: string;
      reviewCadence: string;
      linkedRoutingPath: string | null;
      runtimeRecordRelativePath: string;
      runtimeRecordExists: boolean;
      approvalAllowed: boolean;
      artifact: DirectiveRuntimeFollowUpArtifact;
    }
  | {
      ok: true;
      kind: "runtime_follow_up_legacy";
      relativePath: string;
      content: string;
      title: string;
      candidateId: string;
      candidateName: string;
      currentDecisionState: string | null;
      runtimeValueToOperationalize: string;
      proposedHost: string;
      proposedIntegrationMode: string | null;
      reentryContractPath: string | null;
      currentStatus: string | null;
      reviewCadence: string | null;
      requiredProof: string[];
      requiredGates: string[];
      rollbackNote: string | null;
    }
  | {
      ok: true;
      kind: "runtime_handoff_legacy";
      relativePath: string;
      content: string;
      title: string;
      candidateId: string;
      candidateName: string;
      handoffType: string | null;
      runtimeValueToOperationalize: string;
      proposedHost: string;
      proposedRuntimeSurface: string;
      originatingArchitectureRecordPath: string | null;
      mixedValuePartitionRef: string | null;
      runtimeFollowUpPath: string | null;
      runtimeRecordPath: string | null;
      runtimeProofPath: string | null;
      promotionRecordPath: string | null;
      registryEntryPath: string | null;
      qualityGateResult: string | null;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendDiscoveryRoutingDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      sourceType: string;
      decisionState: string;
      adoptionTarget: string;
      routeDestination: string;
      whyThisRoute: string;
      whyNotAlternatives: string;
      requiredNextArtifact: string;
      linkedIntakeRecord: string;
      linkedTriageRecord: string | null;
      reviewCadence: string | null;
      engineRunId: string | null;
      engineRunRecordPath: string | null;
      engineRunReportPath: string | null;
      usefulnessLevel: string | null;
      usefulnessRationale: string | null;
      matchedGapId: string | null;
      downstreamStubRelativePath: string | null;
      approvalAllowed: boolean;
      content: string;
      artifact: DirectiveDiscoveryRoutingArtifact;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureStartDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      objective: string;
      startApproval: string;
      resultSummary: string;
      handoffStubPath: string;
      resultRelativePath: string | null;
      decisionRelativePath: string | null;
      closeoutAssist: DirectiveArchitectureBoundedCloseoutAssist;
      resultEvidence: DirectiveArchitectureResultEvidenceSlot;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendRuntimeRecordDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      runtimeObjective: string;
      proposedHost: string;
      proposedRuntimeSurface: string;
      requiredProofSummary: string;
      currentStatus: string;
      linkedFollowUpRecord: string;
      linkedRoutingPath: string | null;
      runtimeProofRelativePath: string;
      proofExists: boolean;
      approvalAllowed: boolean;
      content: string;
      artifact: DirectiveRuntimeRecordArtifact;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendRuntimeProofDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      runtimeObjective: string;
      proposedHost: string;
      proposedRuntimeSurface: string;
      currentStatus: string;
      linkedRuntimeRecordPath: string;
      linkedFollowUpPath: string;
      linkedRoutingPath: string | null;
      runtimeCapabilityBoundaryRelativePath: string;
      runtimeCapabilityBoundaryExists: boolean;
      approvalAllowed: boolean;
      content: string;
      artifact: DirectiveRuntimeProofArtifact;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      runtimeObjective: string;
      proposedHost: string;
      proposedRuntimeSurface: string;
      currentProofStatus: string;
      linkedRuntimeProofPath: string;
      linkedRuntimeRecordPath: string;
      linkedFollowUpPath: string;
      linkedRoutingPath: string | null;
      promotionReadinessRelativePath: string;
      promotionReadinessExists: boolean;
      approvalAllowed: boolean;
      content: string;
      artifact: DirectiveRuntimeRuntimeCapabilityBoundaryArtifact;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendRuntimePromotionReadinessDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      runtimeObjective: string;
      proposedHost: string;
      proposedRuntimeSurface: string;
      executionState: string;
      currentStatus: string;
      promotionReadinessDecision: string;
      hostFacingPromotionDecision: string;
      frontendCapabilityDecision: string;
      openedRuntimeImplementationSlicePath: string | null;
      prePromotionImplementationSlicePath: string | null;
      promotionInputPackagePath: string | null;
      profileCheckerDecisionPath: string | null;
      compileContractPath: string | null;
      promotionGoNoGoDecisionPath: string | null;
      linkedCapabilityBoundaryPath: string;
      linkedRuntimeProofPath: string;
      linkedRuntimeRecordPath: string;
      linkedFollowUpPath: string;
      linkedRoutingPath: string | null;
      artifactStage: string;
      artifactNextLegalStep: string;
      currentStage: string;
      nextLegalStep: string;
      promotionReadinessBlockers: string[];
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureResultDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      objective: string;
      closeoutApproval: string;
      resultSummary: string;
      nextDecision: string;
      verdict: string;
      rationale: string;
      startRelativePath: string;
      handoffStubPath: string;
      decisionRelativePath: string;
      continuationStartRelativePath: string | null;
      adoptionRelativePath: string | null;
      resultEvidence: DirectiveArchitectureResultEvidenceSlot;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureAdoptionDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      finalStatus: string;
      sourceResultRelativePath: string;
      decisionRelativePath: string;
      implementationTargetRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureImplementationTargetDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      artifactType: string;
      finalStatus: string;
      objective: string;
      expectedOutcome: string;
      selectedBoundedSlice: string[];
      mechanicalSuccessCriteria: string[];
      explicitLimitations: string[];
      sourceAdoptionVerdict: string;
      sourceReadinessPassed: boolean;
      sourceFailedReadinessChecks: string[];
      sourceRuntimeHandoffRequired: boolean;
      sourceRuntimeHandoffRationale: string;
      sourceArtifactPath: string;
      sourcePrimaryEvidencePath: string;
      sourceSelfImprovementCategory: string;
      sourceSelfImprovementVerificationMethod: string;
      sourceSelfImprovementVerificationResult: string;
      adoptionRelativePath: string;
      decisionRelativePath: string;
      sourceResultRelativePath: string;
      implementationResultRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureImplementationResultDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      objective: string;
      selectedBoundedSlice: string[];
      mechanicalSuccessCriteria: string[];
      explicitLimitations: string[];
      sourceAdoptionVerdict: string;
      sourceReadinessPassed: boolean;
      sourceFailedReadinessChecks: string[];
      sourceRuntimeHandoffRequired: boolean;
      sourceRuntimeHandoffRationale: string;
      sourceArtifactPath: string;
      sourcePrimaryEvidencePath: string;
      sourceSelfImprovementCategory: string;
      sourceSelfImprovementVerificationMethod: string;
      sourceSelfImprovementVerificationResult: string;
      outcome: "success" | "failure";
      resultSummary: string;
      validationResult: string;
      rollbackNote: string;
      targetRelativePath: string;
      adoptionRelativePath: string;
      sourceResultRelativePath: string;
      retainedRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureRetentionDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      objective: string;
      stabilityLevel: string;
      reuseScope: string;
      confirmationDecision: string;
      rollbackBoundary: string;
      resultRelativePath: string;
      targetRelativePath: string;
      adoptionRelativePath: string;
      sourceResultRelativePath: string;
      integrationRecordRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureIntegrationRecordDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      objective: string;
      integrationTargetSurface: string;
      readinessSummary: string;
      expectedEffect: string;
      validationBoundary: string;
      integrationDecision: string;
      rollbackBoundary: string;
      retainedRelativePath: string;
      resultRelativePath: string;
      targetRelativePath: string;
      adoptionRelativePath: string;
      sourceResultRelativePath: string;
      consumptionRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureConsumptionRecordDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      objective: string;
      appliedSurface: string;
      applicationSummary: string;
      observedEffect: string;
      validationResult: string;
      outcome: "success" | "failure";
      rollbackNote: string;
      integrationRelativePath: string;
      retainedRelativePath: string;
      resultRelativePath: string;
      targetRelativePath: string;
      adoptionRelativePath: string;
      sourceResultRelativePath: string;
      evaluationRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitecturePostConsumptionEvaluationDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      candidateId: string;
      candidateName: string;
      usefulnessLevel: string;
      objective: string;
      decision: "keep" | "reopen";
      rationale: string;
      observedStability: string;
      retainedUsefulnessAssessment: string;
      nextBoundedAction: string;
      rollbackNote: string;
      reopenedStartRelativePath: string | null;
      consumptionRelativePath: string;
      integrationRelativePath: string;
      retainedRelativePath: string;
      resultRelativePath: string;
      targetRelativePath: string;
      adoptionRelativePath: string;
      sourceResultRelativePath: string;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}

function buildDirectiveFrontendArtifactViewPath(input: {
  relativePath: string;
  artifactKind: string;
}) {
  const encoded = encodeURIComponent(input.relativePath);
  switch (input.artifactKind) {
    case "discovery_routing_record":
      return `/discovery-routing-records/view?path=${encoded}`;
    case "architecture_handoff":
      return `/handoffs/view?path=${encoded}`;
    case "architecture_bounded_start":
      return `/architecture-starts/view?path=${encoded}`;
    case "architecture_bounded_result":
      return `/architecture-results/view?path=${encoded}`;
    case "architecture_adoption":
      return `/architecture-adoptions/view?path=${encoded}`;
    case "architecture_implementation_target":
      return `/architecture-implementation-targets/view?path=${encoded}`;
    case "architecture_implementation_result":
      return `/architecture-implementation-results/view?path=${encoded}`;
    case "architecture_retained":
      return `/architecture-retained/view?path=${encoded}`;
    case "architecture_integration_record":
      return `/architecture-integration-records/view?path=${encoded}`;
    case "architecture_consumption_record":
      return `/architecture-consumption-records/view?path=${encoded}`;
    case "architecture_post_consumption_evaluation":
      return `/architecture-post-consumption-evaluations/view?path=${encoded}`;
    case "runtime_follow_up":
      return `/handoffs/view?path=${encoded}`;
    case "runtime_record_follow_up_review":
    case "runtime_record_callable_integration":
      return `/runtime-records/view?path=${encoded}`;
    case "runtime_proof_follow_up_review":
    case "runtime_proof_callable_integration":
      return `/runtime-proofs/view?path=${encoded}`;
    case "runtime_runtime_capability_boundary":
      return `/runtime-runtime-capability-boundaries/view?path=${encoded}`;
    case "runtime_promotion_readiness":
      return `/runtime-promotion-readiness/view?path=${encoded}`;
    default:
      return `/artifacts?path=${encoded}`;
  }
}

function readRuntimeApprovalAllowedFromCurrentHead(input: {
  directiveRoot: string;
  relativePath: string;
  allowedCurrentStages: string[];
}) {
  return isDirectiveCurrentStageEligibleForOpening({
    directiveRoot: input.directiveRoot,
    artifactPath: input.relativePath,
    allowedCurrentStages: input.allowedCurrentStages,
  });
}

function deriveFrontendQueueStatus(input: {
  entry: StoredFrontendQueueEntry;
  resolutionPath: string | null;
  integrityState: "ok" | "broken" | null;
  currentStage: string | null;
  currentHeadPath: string | null;
}) {
  if (input.entry.status === "completed" && input.integrityState === "broken") {
    const resolutionReference = input.entry.result_record_path ?? input.resolutionPath ?? "the recorded completion artifact";
    return {
      status_effective: "completed_inconsistent",
      status_warning:
        `Queue still marks this case completed, but canonical truth cannot resolve "${resolutionReference}" cleanly. `
        + "Do not treat this queue status as a truthful completion signal.",
    };
  }

  if (input.entry.status === "routed" && input.integrityState === "broken") {
    const resolutionReference =
      input.entry.routing_record_path
      ?? input.entry.result_record_path
      ?? input.resolutionPath
      ?? "the recorded routed artifact";
    return {
      status_effective: "routed_inconsistent",
      status_warning:
        `Queue still marks this case routed, but canonical truth cannot resolve "${resolutionReference}" cleanly. `
        + "Do not treat this queue status as a clean active-routing signal.",
    };
  }

  if (
    input.entry.status === "routed"
    && input.entry.result_record_path
    && input.currentHeadPath
    && input.currentHeadPath !== input.entry.result_record_path
  ) {
    return {
      status_effective: "routed_progressed",
      status_warning:
        `Queue still marks this case routed, but the live case head has already progressed to `
        + `${input.currentStage ?? "a later stage"} at "${input.currentHeadPath}". `
        + "Do not treat the original downstream stub as the live continuation point.",
    };
  }

  return {
    status_effective: input.entry.status,
    status_warning: null,
  };
}

function buildFrontendQueueEntry(input: {
  directiveRoot: string;
  entry: StoredFrontendQueueEntry;
}): FrontendQueueEntry {
  const resolutionPath = input.entry.routing_record_path ?? input.entry.result_record_path ?? null;
  if (!resolutionPath) {
    return {
      ...input.entry,
      integrity_state: null,
      status_effective: input.entry.status,
      status_warning: null,
      current_case_stage: null,
      current_case_next_legal_step: null,
      current_head: null,
      runtime_summary: null,
    };
  }

  try {
    const focus = resolveDirectiveWorkspaceState({
      directiveRoot: input.directiveRoot,
      artifactPath: resolutionPath,
      includeAnchors: false,
    }).focus;

    if (!focus) {
      const status = deriveFrontendQueueStatus({
        entry: input.entry,
        resolutionPath,
        integrityState: "broken",
        currentStage: null,
        currentHeadPath: null,
      });
      return {
        ...input.entry,
        integrity_state: "broken",
        ...status,
        current_case_stage: null,
        current_case_next_legal_step: "Current case head could not be resolved from the canonical resolver.",
        current_head: {
          artifact_path: resolutionPath,
          artifact_kind: "unknown",
          artifact_stage: "unknown",
          artifact_lane: input.entry.routing_target ?? "unknown",
          view_path: `/artifacts?path=${encodeURIComponent(resolutionPath)}`,
        },
        runtime_summary: null,
      };
    }

    const status = deriveFrontendQueueStatus({
      entry: input.entry,
      resolutionPath,
      integrityState: focus.integrityState,
      currentStage: focus.currentStage,
      currentHeadPath: focus.currentHead.artifactPath,
    });

    return {
      ...(() => {
        const runtimeSummary = focus.currentHead.lane === "runtime"
          ? resolveDirectiveWorkspaceState({
              directiveRoot: input.directiveRoot,
              artifactPath: focus.currentHead.artifactPath,
              includeAnchors: false,
            }).focus?.runtime
          : null;
        return {
          runtime_summary: runtimeSummary
            ? {
                proposed_host: runtimeSummary.proposedHost ?? null,
                promotion_readiness_blockers: [...(runtimeSummary.promotionReadinessBlockers ?? [])],
              }
            : null,
        };
      })(),
      ...input.entry,
      integrity_state: focus.integrityState,
      ...status,
      current_case_stage: focus.currentStage,
      current_case_next_legal_step: focus.nextLegalStep,
      current_head: {
        artifact_path: focus.currentHead.artifactPath,
        artifact_kind: focus.currentHead.artifactKind,
        artifact_stage: focus.currentHead.artifactStage,
        artifact_lane: focus.currentHead.lane,
        view_path: buildDirectiveFrontendArtifactViewPath({
          relativePath: focus.currentHead.artifactPath,
          artifactKind: focus.currentHead.artifactKind,
        }),
      },
    };
  } catch (error) {
    const status = deriveFrontendQueueStatus({
      entry: input.entry,
      resolutionPath,
      integrityState: "broken",
      currentStage: null,
      currentHeadPath: null,
    });
    return {
      ...input.entry,
      integrity_state: "broken",
      ...status,
      current_case_stage: null,
      current_case_next_legal_step:
        `Current case head could not be resolved from "${resolutionPath}": ${String((error as Error).message || error)}`,
      current_head: {
        artifact_path: resolutionPath,
        artifact_kind: "unknown",
        artifact_stage: "unknown",
        artifact_lane: input.entry.routing_target ?? "unknown",
        view_path: `/artifacts?path=${encodeURIComponent(resolutionPath)}`,
      },
      runtime_summary: null,
    };
  }
}

function extractMarkdownTitle(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .find((line) => line.startsWith("# "))
    ?.replace(/^# /, "")
    .trim()
    || "";
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const lines = markdown.split(/\r?\n/);
  const line = lines.find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    return "";
  }

  const inlineValue = line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
  if (inlineValue) {
    return inlineValue;
  }

  const index = lines.indexOf(line);
  for (let offset = index + 1; offset < lines.length; offset += 1) {
    const candidate = lines[offset];
    const trimmed = candidate.trim();
    if (!trimmed) {
      continue;
    }
    if (/^- /.test(trimmed) && !/^\s+- /.test(candidate)) {
      break;
    }
    if (/^- /.test(trimmed) || /^\s+- /.test(candidate)) {
      return trimmed.replace(/^- /, "").trim().replace(/^`|`$/g, "");
    }
    break;
  }

  return "";
}

function optionalDisplayValue(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const normalized = trimmed.replace(/`/g, "");
  const lower = normalized.toLowerCase();
  if (lower === "n/a" || lower === "pending") {
    return null;
  }
  return normalized;
}

function extractLabeledValue(markdown: string, labels: string[]) {
  const lines = markdown.split(/\r?\n/);
  for (const label of labels) {
    const bulletValue = extractBulletValue(markdown, label);
    if (bulletValue) {
      return bulletValue;
    }

    const prefix = `${label}:`;
    const line = lines.find((entry) => entry.trim().startsWith(prefix));
    if (line) {
      return line.trim().replace(prefix, "").trim();
    }
  }
  return "";
}

function extractBulletList(markdown: string, label: string) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex((entry) => entry.trim() === `- ${label}:`);
  if (startIndex === -1) {
    return [] as string[];
  }

  const values: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("  - ")) {
      break;
    }

    const normalized = line.replace(/^  - /u, "").trim().replace(/^`|`$/gu, "");
    if (normalized) {
      values.push(normalized);
    }
  }
  return values;
}

function normalizeDirectiveWorkspaceArtifactReference(input: {
  directiveRoot: string;
  value: string | null | undefined;
}) {
  const rawValue = optionalDisplayValue(input.value);
  if (!rawValue) {
    return null;
  }

  const directiveRoot = normalizePath(input.directiveRoot);
  const normalizedValue = normalizeRelativePath(rawValue);
  const absolutePath = path.isAbsolute(normalizedValue)
    ? normalizePath(normalizedValue)
    : normalizePath(path.join(directiveRoot, normalizedValue));
  const rootPrefix = `${directiveRoot}/`;

  if (absolutePath === directiveRoot || absolutePath.startsWith(rootPrefix)) {
    return normalizeRelativePath(path.relative(directiveRoot, absolutePath));
  }

  return normalizedValue;
}

function normalizeLegacyRuntimeReentryContractReference(input: {
  directiveRoot: string;
  value: string | null | undefined;
}) {
  const rawValue = optionalDisplayValue(input.value);
  if (!rawValue || /^(n\/a|pending)\b/i.test(rawValue)) {
    return null;
  }
  return normalizeDirectiveWorkspaceArtifactReference({
    directiveRoot: input.directiveRoot,
    value: rawValue,
  });
}

function deriveLegacyRuntimeFollowUpCandidateName(title: string) {
  return title
    .replace(/^CLI-Anything Runtime Follow-up Record:\s*/u, "")
    .replace(/^Runtime Follow-up Record:\s*/u, "")
    .replace(/\s+Runtime Follow-up\s*$/u, "")
    .trim();
}

function isLegacyRuntimeFollowUpRelativePath(relativePath: string) {
  return relativePath.startsWith("runtime/follow-up/")
    && (
      relativePath.endsWith("-runtime-follow-up-record.md")
      || relativePath.endsWith("-runtime-followup.md")
    );
}

function deriveLegacyRuntimeFollowUpCandidateId(fileNameOrPath: string) {
  return fileNameOrPath
    .replace(/-(runtime-follow-up-record|runtime-followup)\.md$/u, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/u, "");
}

function extractMarkdownSectionSummary(markdown: string, heading: string) {
  const lines = markdown.split(/\r?\n/);
  const headingLine = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === headingLine);
  if (startIndex === -1) {
    return "";
  }

  const values: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      break;
    }
    if (!trimmed) {
      continue;
    }
    values.push(trimmed.replace(/^- /u, "").trim());
  }

  return values.join(" ").trim();
}

function deriveLegacyRuntimeHandoffCandidateName(title: string) {
  return title
    .replace(/^Architecture to Runtime Handoff:\s*/u, "")
    .trim();
}

export function readFrontendQueueOverview(input: {
  directiveRoot: string;
  maxEntries?: number;
}): FrontendQueueOverview {
  const host = createStandaloneFilesystemHost({
    directiveRoot: input.directiveRoot,
  });

  try {
    const queue = host.readQueue() as {
      updatedAt?: string | null;
      entries?: StoredFrontendQueueEntry[];
    } | null;
    const queuePath = normalizePath(
      path.join(input.directiveRoot, "discovery", "intake-queue.json"),
    );

    if (!queue || !Array.isArray(queue.entries)) {
      return {
        ok: false,
        rootPath: normalizePath(input.directiveRoot),
        queuePath,
        updatedAt: null,
        totalEntries: 0,
        entries: [],
      };
    }

    const entries = [...queue.entries]
      .sort((left, right) =>
        `${right.received_at}|${right.candidate_id}`.localeCompare(
          `${left.received_at}|${left.candidate_id}`,
        ))
      .slice(0, Math.max(1, input.maxEntries ?? 12));

    return {
      ok: true,
      rootPath: normalizePath(input.directiveRoot),
      queuePath,
      updatedAt: queue.updatedAt ?? null,
      totalEntries: queue.entries.length,
      entries: entries.map((entry) =>
        buildFrontendQueueEntry({
          directiveRoot: input.directiveRoot,
          entry,
        })),
    };
  } finally {
    host.close();
  }
}

function readRuntimeFollowUpStubs(input: {
  directiveRoot: string;
  maxEntries?: number;
}): FrontendHandoffStub[] {
  const followUpRoot = path.join(input.directiveRoot, "runtime", "follow-up");
  if (!fs.existsSync(followUpRoot)) {
    return [];
  }

  return fs
    .readdirSync(followUpRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isLegacyRuntimeFollowUpRelativePath(
      normalizeRelativePath(path.join("runtime", "follow-up", entry.name)),
    ))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, Math.max(1, input.maxEntries ?? 20))
    .map((entry) => {
      const relativePath = normalizeRelativePath(path.join("runtime", "follow-up", entry.name));
      try {
        const detail = readDirectiveFrontendHandoffDetail({
          directiveRoot: input.directiveRoot,
          relativePath,
        });

        if (detail.ok && detail.kind === "runtime_follow_up") {
          const focus = resolveDirectiveWorkspaceState({
            directiveRoot: input.directiveRoot,
            artifactPath: relativePath,
            includeAnchors: false,
          }).focus;
          const liveFollowUpPending =
            focus
            && focus.lane === "runtime"
            && focus.currentStage.startsWith("runtime.follow_up.")
            && focus.currentHead.artifactPath === relativePath;

          return {
            kind: "runtime_follow_up" as const,
            lane: "runtime" as const,
            relativePath,
            candidateId: detail.candidateId,
            title: detail.title || entry.name,
            status: liveFollowUpPending ? "pending_review" : "progressed_downstream",
            startRelativePath: null,
            warning: liveFollowUpPending
              ? null
              : focus
                ? `Live current head is ${focus.currentHead.artifactStage} at ${focus.currentHead.artifactPath}; do not treat this follow-up artifact as a pending review stub.`
                : "Canonical resolver could not confirm this Runtime follow-up as the live pending-review head.",
          };
        }

        if (detail.ok && detail.kind === "runtime_follow_up_legacy") {
          return {
            kind: "runtime_follow_up_legacy" as const,
            lane: "runtime" as const,
            relativePath,
            candidateId: detail.candidateId,
            title: detail.title,
            status: "historical_follow_up",
            startRelativePath: null,
            warning: "Historical Runtime follow-up; inspectable only and not part of the current non-executing Runtime v0 chain.",
          };
        }

        return {
          kind: "runtime_follow_up" as const,
          lane: "runtime" as const,
          relativePath,
          candidateId: deriveLegacyRuntimeFollowUpCandidateId(entry.name),
          title: entry.name,
          status: "invalid_artifact_state",
          startRelativePath: null,
          warning: detail.ok
            ? "Unsupported Runtime follow-up artifact shape."
            : detail.error,
        };
      } catch (error) {
        return {
          kind: "runtime_follow_up" as const,
          lane: "runtime" as const,
          relativePath,
          candidateId: deriveLegacyRuntimeFollowUpCandidateId(entry.name),
          title: entry.name,
          status: "invalid_artifact_state",
          startRelativePath: null,
          warning: String((error as Error).message || error),
        };
      }
    });
}

function readLegacyRuntimeHandoffStubs(input: {
  directiveRoot: string;
  maxEntries?: number;
}): FrontendHandoffStub[] {
  const handoffRoot = path.join(input.directiveRoot, "runtime", "handoff");
  if (!fs.existsSync(handoffRoot)) {
    return [];
  }

  return fs
    .readdirSync(handoffRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith("-architecture-to-runtime-handoff.md"))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, Math.max(1, input.maxEntries ?? 20))
    .flatMap((entry) => {
      const relativePath = normalizeRelativePath(path.join("runtime", "handoff", entry.name));
      const detail = readDirectiveFrontendHandoffDetail({
        directiveRoot: input.directiveRoot,
        relativePath,
      });
      if (!detail.ok || detail.kind !== "runtime_handoff_legacy") {
        return [];
      }

      return [{
        kind: "runtime_handoff_legacy" as const,
        lane: "runtime" as const,
        relativePath,
        candidateId: detail.candidateId,
        title: detail.title,
        status: "historical_handoff",
        startRelativePath: null,
        warning: "Historical Runtime handoff; inspectable only and not part of the current non-executing Runtime v0 chain.",
      }];
    });
}

function readArchitectureHandoffStubs(input: {
  directiveRoot: string;
  maxEntries?: number;
}) {
  const experimentsRoot = path.join(input.directiveRoot, "architecture", "02-experiments");
  const maxEntries = Math.max(1, input.maxEntries ?? 20);
  if (!fs.existsSync(experimentsRoot)) {
    return {
      artifacts: [] as DirectiveArchitectureHandoffArtifact[],
      stubs: [] as FrontendHandoffStub[],
      warnings: [] as string[],
    };
  }

  const warnings: string[] = [];
  const artifacts: DirectiveArchitectureHandoffArtifact[] = [];
  const stubs = fs
    .readdirSync(experimentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith("-engine-handoff.md"))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, maxEntries)
    .map((entry) => {
      const relativePath = normalizeRelativePath(path.join("architecture", "02-experiments", entry.name));

      try {
        const handoff = readDirectiveArchitectureHandoffArtifact({
          directiveRoot: input.directiveRoot,
          handoffPath: relativePath,
        });
        artifacts.push(handoff);
        return {
          kind: "architecture_handoff" as const,
          lane: "architecture" as const,
          relativePath: handoff.handoffRelativePath,
          candidateId: handoff.candidateId,
          title: handoff.title,
          status: handoff.status,
          startRelativePath: handoff.startExists ? handoff.startRelativePath : null,
          warning: null,
        };
      } catch (error) {
        const warning = String((error as Error).message || error);
        warnings.push(`${relativePath}: ${warning}`);
        return {
          kind: "architecture_handoff_invalid" as const,
          lane: "architecture" as const,
          relativePath,
          candidateId: entry.name.replace(/-engine-handoff\.md$/u, ""),
          title: entry.name,
          status: "invalid_artifact",
          startRelativePath: null,
          warning,
        };
      }
    });

  return {
    artifacts,
    stubs,
    warnings,
  };
}

export function readDirectiveFrontendSnapshot(input: {
  directiveRoot: string;
  maxRuns?: number;
  maxQueueEntries?: number;
  maxHandoffs?: number;
}): DirectiveFrontendSnapshot {
  const architecture = readArchitectureHandoffStubs({
    directiveRoot: input.directiveRoot,
    maxEntries: input.maxHandoffs ?? 20,
  });
  const handoffStubs: FrontendHandoffStub[] = [
    ...architecture.stubs,
    ...readRuntimeFollowUpStubs({
      directiveRoot: input.directiveRoot,
      maxEntries: input.maxHandoffs ?? 20,
    }),
    ...readLegacyRuntimeHandoffStubs({
      directiveRoot: input.directiveRoot,
      maxEntries: input.maxHandoffs ?? 20,
    }),
  ].sort((left, right) => right.relativePath.localeCompare(left.relativePath));
  const queue = readFrontendQueueOverview({
    directiveRoot: input.directiveRoot,
    maxEntries: input.maxQueueEntries ?? 12,
  });
  const runtimeAnchors = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    includeAnchors: true,
  }).anchors
    .filter((anchor) => anchor.lane === "runtime")
    .sort((left, right) => right.artifactPath.localeCompare(left.artifactPath))
    .filter((anchor, index, all) =>
      all.findIndex((candidate) => candidate.candidateId === anchor.candidateId) === index
    )
    .slice(0, 4);
  const architectureAnchors = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    includeAnchors: true,
  }).anchors
    .filter((anchor) => anchor.lane === "architecture")
    .sort((left, right) => right.artifactPath.localeCompare(left.artifactPath))
    .filter((anchor, index, all) =>
      all.findIndex((candidate) => candidate.candidateId === anchor.candidateId) === index
    )
    .slice(0, 4);
  const activeRuntimeCases = queue.entries
    .filter((entry) => entry.current_head?.artifact_lane === "runtime" || entry.routing_target === "runtime")
    .sort((left, right) => {
      const rank = (stage: string | null | undefined) => {
        if (!stage) return 0;
        if (stage.startsWith("runtime.promotion_readiness.")) return 5;
        if (stage.startsWith("runtime.runtime_capability_boundary.")) return 4;
        if (stage.startsWith("runtime.proof.")) return 3;
        if (stage.startsWith("runtime.record.")) return 2;
        if (stage.startsWith("runtime.follow_up.")) return 1;
        return 0;
      };
      return rank(right.current_case_stage) - rank(left.current_case_stage);
    })
    .slice(0, 4)
    .map((entry) => ({
      candidate_id: entry.candidate_id,
      candidate_name: entry.candidate_name,
      current_case_stage: entry.current_case_stage,
      current_case_next_legal_step: entry.current_case_next_legal_step,
      current_head: entry.current_head,
      runtime_summary: entry.runtime_summary,
    }));
  const activeArchitectureCases = queue.entries
    .filter((entry) => entry.current_head?.artifact_lane === "architecture" || entry.routing_target === "architecture")
    .slice(0, 4)
    .map((entry) => ({
      candidate_id: entry.candidate_id,
      candidate_name: entry.candidate_name,
      current_case_stage: entry.current_case_stage,
      current_case_next_legal_step: entry.current_case_next_legal_step,
      current_head: entry.current_head,
    }));

  return {
    engineRuns: readDirectiveEngineRunsOverview({
      directiveRoot: input.directiveRoot,
      maxRuns: input.maxRuns ?? 8,
    }),
    queue,
    runtimeSummary: {
      activeCases: activeRuntimeCases,
      recentAnchors: runtimeAnchors.map((anchor) => ({
        label: anchor.label,
        artifactPath: anchor.artifactPath,
        currentStage: anchor.currentStage,
        nextLegalStep: anchor.nextLegalStep,
        candidateId: anchor.candidateId,
        candidateName: anchor.candidateName,
      })),
    },
    architectureSummary: {
      activeCases: activeArchitectureCases,
      recentAnchors: architectureAnchors.map((anchor) => ({
        label: anchor.label,
        artifactPath: anchor.artifactPath,
        currentStage: anchor.currentStage,
        nextLegalStep: anchor.nextLegalStep,
        candidateId: anchor.candidateId,
        candidateName: anchor.candidateName,
      })),
    },
    architectureHandoffs: architecture.artifacts,
    handoffStubs,
    handoffWarnings: architecture.warnings,
  };
}

export function readDirectiveFrontendRunDetail(input: {
  directiveRoot: string;
  runId: string;
}): DirectiveEngineRunDetail {
  return readDirectiveEngineRunDetail({
    directiveRoot: input.directiveRoot,
    runId: input.runId,
  });
}

export function readDirectiveFrontendArtifactText(input: {
  directiveRoot: string;
  relativePath: string;
}) {
  const directiveRoot = normalizePath(input.directiveRoot);
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    throw new Error("invalid_input: relativePath is required");
  }
  if (path.isAbsolute(relativePath)) {
    throw new Error("invalid_input: relativePath must be relative to directive-workspace");
  }

  const absolutePath = normalizePath(path.join(directiveRoot, relativePath));
  const rootPrefix = `${normalizePath(directiveRoot)}/`;
  if (absolutePath !== directiveRoot && !absolutePath.startsWith(rootPrefix)) {
    throw new Error("invalid_input: relativePath must stay within directive-workspace");
  }
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: artifact not found: ${relativePath}`);
  }

  return {
    relativePath,
    absolutePath,
    content: fs.readFileSync(absolutePath, "utf8"),
  };
}

export function readDirectiveFrontendQueueEntry(input: {
  directiveRoot: string;
  candidateId: string;
}) {
  const candidateId = String(input.candidateId || "").trim();
  if (!candidateId) {
    return null;
  }

  return readFrontendQueueOverview({
    directiveRoot: input.directiveRoot,
    maxEntries: 500,
  }).entries.find((entry) => entry.candidate_id === candidateId)
    || null;
}

export function readDirectiveFrontendDiscoveryRoutingDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendDiscoveryRoutingDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("discovery/routing-log/")
    || !relativePath.endsWith("-routing-record.md")
  ) {
    return {
      ok: false,
      error: "invalid_discovery_routing_record_path",
      relativePath,
    };
  }

  try {
    const artifactText = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });
    const artifact = readDirectiveDiscoveryRoutingArtifact({
      directiveRoot: input.directiveRoot,
      routingPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.routingAbsolutePath,
      title: artifact.title,
      candidateId: artifact.candidateId,
      candidateName: artifact.candidateName,
      sourceType: artifact.sourceType,
      decisionState: artifact.decisionState,
      adoptionTarget: artifact.adoptionTarget,
      routeDestination: artifact.routeDestination,
      whyThisRoute: artifact.whyThisRoute,
      whyNotAlternatives: artifact.whyNotAlternatives,
      requiredNextArtifact: artifact.requiredNextArtifact,
      linkedIntakeRecord: artifact.linkedIntakeRecord,
      linkedTriageRecord: artifact.linkedTriageRecord,
      reviewCadence: artifact.reviewCadence,
      engineRunId: artifact.engineRunId,
      engineRunRecordPath: artifact.engineRunRecordPath,
      engineRunReportPath: artifact.engineRunReportPath,
      usefulnessLevel: artifact.usefulnessLevel,
      usefulnessRationale: artifact.usefulnessRationale,
      matchedGapId: artifact.matchedGapId,
      downstreamStubRelativePath: artifact.downstreamStubRelativePath,
      approvalAllowed: artifact.approvalAllowed,
      content: artifactText.content,
      artifact,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendHandoffDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendHandoffDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  try {
    const artifactText = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });

    if (
      relativePath.startsWith("architecture/02-experiments/")
      && relativePath.endsWith("-engine-handoff.md")
    ) {
      return {
        ok: true,
        kind: "architecture_handoff",
        relativePath,
        content: artifactText.content,
        artifact: readDirectiveArchitectureHandoffArtifact({
          directiveRoot: input.directiveRoot,
          handoffPath: relativePath,
        }),
      };
    }

    if (
      relativePath.startsWith("runtime/handoff/")
      && relativePath.endsWith("-architecture-to-runtime-handoff.md")
    ) {
      const title = extractMarkdownTitle(artifactText.content);
      return {
        ok: true,
        kind: "runtime_handoff_legacy",
        relativePath,
        content: artifactText.content,
        title,
        candidateId: extractBulletValue(artifactText.content, "Candidate id"),
        candidateName:
          optionalDisplayValue(extractBulletValue(artifactText.content, "Candidate name"))
          ?? deriveLegacyRuntimeHandoffCandidateName(title),
        handoffType: optionalDisplayValue(extractLabeledValue(artifactText.content, ["Handoff type"])),
        runtimeValueToOperationalize: extractLabeledValue(artifactText.content, [
          "Runtime value to operationalize in Runtime",
          "Runtime value to operationalize",
        ]),
        proposedHost: optionalDisplayValue(extractLabeledValue(artifactText.content, ["Proposed host"])) ?? "",
        proposedRuntimeSurface: extractLabeledValue(artifactText.content, ["Proposed runtime surface"]),
        originatingArchitectureRecordPath: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Originating Architecture record"]),
        }),
        mixedValuePartitionRef: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Mixed-value partition ref"]),
        }),
        runtimeFollowUpPath: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Runtime follow-up"]),
        }),
        runtimeRecordPath: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Runtime record"]),
        }),
        runtimeProofPath: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Proof artifact"]),
        }),
        promotionRecordPath: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, [
            "Promotion record (if promoted)",
            "Promotion record",
          ]),
        }),
        registryEntryPath: normalizeDirectiveWorkspaceArtifactReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Registry entry"]),
        }),
        qualityGateResult: optionalDisplayValue(extractLabeledValue(artifactText.content, ["Quality gate result"])),
      };
    }

    if (isLegacyRuntimeFollowUpRelativePath(relativePath)) {
      try {
        const artifact = readDirectiveRuntimeFollowUpArtifact({
          directiveRoot: input.directiveRoot,
          followUpPath: relativePath,
        });
        return {
          ok: true,
          kind: "runtime_follow_up",
          relativePath,
          content: artifactText.content,
          title: artifact.title || path.basename(relativePath),
          candidateId: artifact.candidateId,
          candidateName: artifact.candidateName,
          status: artifact.currentStatus || "unknown",
          runtimeValueToOperationalize: artifact.runtimeValueToOperationalize,
          proposedHost: artifact.proposedHost,
          proposedIntegrationMode: artifact.proposedIntegrationMode,
          reviewCadence: artifact.reviewCadence,
          linkedRoutingPath: artifact.linkedHandoffPath,
          runtimeRecordRelativePath: artifact.runtimeRecordRelativePath,
          runtimeRecordExists: artifact.runtimeRecordExists,
          approvalAllowed:
            artifact.approvalAllowed
            && readRuntimeApprovalAllowedFromCurrentHead({
              directiveRoot: input.directiveRoot,
              relativePath,
              allowedCurrentStages: ["runtime.follow_up."],
            }),
          artifact,
        };
      } catch (runtimeFollowUpError) {
        const candidateId =
          optionalDisplayValue(extractBulletValue(artifactText.content, "Candidate id"))
          ?? deriveLegacyRuntimeFollowUpCandidateId(path.basename(relativePath));
        const candidateName =
          optionalDisplayValue(extractBulletValue(artifactText.content, "Candidate name"))
          ?? deriveLegacyRuntimeFollowUpCandidateName(
            extractMarkdownTitle(artifactText.content) || path.basename(relativePath),
          )
          ?? candidateId;
        const runtimeValueToOperationalize =
          extractLabeledValue(artifactText.content, ["Runtime value to operationalize"])
          || extractMarkdownSectionSummary(artifactText.content, "Runtime Value To Evaluate");
        const currentDecisionState = optionalDisplayValue(extractLabeledValue(artifactText.content, [
          "Current decision state",
        ]));
        const currentStatus = optionalDisplayValue(extractLabeledValue(artifactText.content, [
          "Current status",
          "Status",
        ]));
        const reentryContractPath = normalizeLegacyRuntimeReentryContractReference({
          directiveRoot: input.directiveRoot,
          value: extractLabeledValue(artifactText.content, ["Re-entry contract path (if deferred)"]),
        });
        const legacyDeferred =
          /defer/i.test(currentDecisionState ?? "") || /deferred/i.test(currentStatus ?? "");

        if (!runtimeValueToOperationalize || !currentStatus || (legacyDeferred && !reentryContractPath)) {
          throw runtimeFollowUpError;
        }

        return {
          ok: true,
          kind: "runtime_follow_up_legacy",
          relativePath,
          content: artifactText.content,
          title: extractMarkdownTitle(artifactText.content) || path.basename(relativePath),
          candidateId,
          candidateName,
          currentDecisionState,
          runtimeValueToOperationalize,
          proposedHost:
            optionalDisplayValue(extractLabeledValue(artifactText.content, ["Proposed host"]))
            ?? "",
          proposedIntegrationMode: optionalDisplayValue(extractLabeledValue(artifactText.content, [
            "Proposed integration mode",
          ])),
          reentryContractPath,
          currentStatus,
          reviewCadence: optionalDisplayValue(extractLabeledValue(artifactText.content, [
            "Review cadence",
          ])),
          requiredProof: extractBulletList(artifactText.content, "Required proof"),
          requiredGates: extractBulletList(artifactText.content, "Required gates"),
          rollbackNote: optionalDisplayValue(extractLabeledValue(artifactText.content, ["Rollback"])),
        };
      }
    }

    return {
      ok: false,
      error: "unsupported_handoff_kind",
      relativePath,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureStartDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureStartDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    (!relativePath.startsWith("architecture/02-experiments/")
      && !relativePath.startsWith("architecture/01-bounded-starts/"))
    || !relativePath.endsWith("-bounded-start.md")
  ) {
    return {
      ok: false,
      error: "invalid_start_artifact_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });
    const parsed = readDirectiveArchitectureBoundedStartArtifact({
      directiveRoot: input.directiveRoot,
      startPath: relativePath,
    });
    const closeoutAssist = readDirectiveArchitectureBoundedCloseoutAssist({
      directiveRoot: input.directiveRoot,
      startPath: relativePath,
    });
    const resultEvidence = readDirectiveArchitectureResultEvidenceForStart({
      directiveRoot: input.directiveRoot,
      startPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.absolutePath,
      title: extractMarkdownTitle(artifact.content),
      candidateId: extractBulletValue(artifact.content, "Candidate id"),
      candidateName: extractBulletValue(artifact.content, "Candidate name"),
      objective: extractBulletValue(artifact.content, "Objective"),
      startApproval: extractBulletValue(artifact.content, "Start approval"),
      resultSummary: extractBulletValue(artifact.content, "Result summary"),
      handoffStubPath: extractBulletValue(artifact.content, "Handoff stub"),
      resultRelativePath: parsed.resultExists ? parsed.resultRelativePath : null,
      decisionRelativePath: parsed.decisionExists ? parsed.decisionRelativePath : null,
      closeoutAssist,
      resultEvidence,
      content: artifact.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendRuntimeRecordDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendRuntimeRecordDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("runtime/02-records/")
    || !relativePath.endsWith("-runtime-record.md")
  ) {
    return {
      ok: false,
      error: "invalid_runtime_record_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveRuntimeRecordArtifact({
      directiveRoot: input.directiveRoot,
      runtimeRecordPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.runtimeRecordAbsolutePath,
      title: artifact.title,
      candidateId: artifact.candidateId,
      candidateName: artifact.candidateName,
      runtimeObjective: artifact.runtimeObjective,
      proposedHost: artifact.proposedHost,
      proposedRuntimeSurface: artifact.proposedRuntimeSurface,
      requiredProofSummary: artifact.requiredProofSummary,
      currentStatus: artifact.currentStatus,
      linkedFollowUpRecord: artifact.linkedFollowUpRecord,
      linkedRoutingPath: artifact.followUpArtifact.linkedHandoffPath,
      runtimeProofRelativePath: artifact.runtimeProofRelativePath,
      proofExists: artifact.proofExists,
      approvalAllowed:
        artifact.approvalAllowed
        && readRuntimeApprovalAllowedFromCurrentHead({
          directiveRoot: input.directiveRoot,
          relativePath,
          allowedCurrentStages: ["runtime.record."],
        }),
      content: artifact.content,
      artifact,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendRuntimeProofDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendRuntimeProofDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("runtime/03-proof/")
    || !relativePath.endsWith("-proof.md")
  ) {
    return {
      ok: false,
      error: "invalid_runtime_proof_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveRuntimeProofArtifact({
      directiveRoot: input.directiveRoot,
      runtimeProofPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.runtimeProofAbsolutePath,
      title: artifact.title,
      candidateId: artifact.candidateId,
      candidateName: artifact.candidateName,
      runtimeObjective: artifact.runtimeObjective,
      proposedHost: artifact.proposedHost,
      proposedRuntimeSurface: artifact.proposedRuntimeSurface,
      currentStatus: artifact.currentStatus,
      linkedRuntimeRecordPath: artifact.linkedRuntimeRecordPath,
      linkedFollowUpPath: artifact.linkedFollowUpPath,
      linkedRoutingPath: artifact.linkedRoutingPath,
      runtimeCapabilityBoundaryRelativePath: artifact.runtimeCapabilityBoundaryRelativePath,
      runtimeCapabilityBoundaryExists: artifact.runtimeCapabilityBoundaryExists,
      approvalAllowed:
        artifact.approvalAllowed
        && readRuntimeApprovalAllowedFromCurrentHead({
          directiveRoot: input.directiveRoot,
          relativePath,
          allowedCurrentStages: ["runtime.proof."],
        }),
      content: artifact.content,
      artifact,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("runtime/04-capability-boundaries/")
    || !relativePath.endsWith("-runtime-capability-boundary.md")
  ) {
    return {
      ok: false,
      error: "invalid_runtime_runtime_capability_boundary_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveRuntimeRuntimeCapabilityBoundaryArtifact({
      directiveRoot: input.directiveRoot,
      capabilityBoundaryPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.capabilityBoundaryAbsolutePath,
      title: artifact.title,
      candidateId: artifact.candidateId,
      candidateName: artifact.candidateName,
      runtimeObjective: artifact.runtimeObjective,
      proposedHost: artifact.proposedHost,
      proposedRuntimeSurface: artifact.proposedRuntimeSurface,
      currentProofStatus: artifact.currentProofStatus,
      linkedRuntimeProofPath: artifact.linkedRuntimeProofPath,
      linkedRuntimeRecordPath: artifact.linkedRuntimeRecordPath,
      linkedFollowUpPath: artifact.linkedFollowUpPath,
      linkedRoutingPath: artifact.linkedRoutingPath,
      promotionReadinessRelativePath: artifact.promotionReadinessRelativePath,
      promotionReadinessExists: artifact.promotionReadinessExists,
      approvalAllowed:
        artifact.approvalAllowed
        && readRuntimeApprovalAllowedFromCurrentHead({
          directiveRoot: input.directiveRoot,
          relativePath,
          allowedCurrentStages: ["runtime.runtime_capability_boundary.opened"],
        }),
      content: artifact.content,
      artifact,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendRuntimePromotionReadinessDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendRuntimePromotionReadinessDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("runtime/05-promotion-readiness/")
    || !relativePath.endsWith("-promotion-readiness.md")
  ) {
    return {
      ok: false,
      error: "invalid_runtime_promotion_readiness_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });
    const focus = resolveDirectiveWorkspaceState({
      directiveRoot: input.directiveRoot,
      artifactPath: relativePath,
      includeAnchors: false,
    }).focus;

    if (!focus || focus.lane !== "runtime") {
      throw new Error("runtime_promotion_readiness_focus_not_resolved");
    }

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.absolutePath,
      title: extractMarkdownTitle(artifact.content),
      candidateId: extractBulletValue(artifact.content, "Candidate id"),
      candidateName: extractBulletValue(artifact.content, "Candidate name"),
      runtimeObjective: extractBulletValue(artifact.content, "Runtime objective"),
      proposedHost: extractBulletValue(artifact.content, "Proposed host"),
      proposedRuntimeSurface: extractBulletValue(artifact.content, "Proposed runtime surface"),
      executionState: extractBulletValue(artifact.content, "Execution state"),
      currentStatus: extractBulletValue(artifact.content, "Current status"),
      promotionReadinessDecision: extractBulletValue(artifact.content, "Promotion-readiness decision"),
      hostFacingPromotionDecision: extractBulletValue(artifact.content, "Reviewed decision"),
      frontendCapabilityDecision: extractBulletValue(artifact.content, "Frontend capability decision"),
      openedRuntimeImplementationSlicePath: extractBulletValue(artifact.content, "Explicit opened runtime-implementation slice")
        || extractBulletValue(artifact.content, "Opened runtime-implementation slice"),
      prePromotionImplementationSlicePath: extractBulletValue(artifact.content, "Explicit pre-promotion implementation slice"),
      promotionInputPackagePath: extractBulletValue(artifact.content, "Explicit promotion-input package for that slice"),
      profileCheckerDecisionPath: extractBulletValue(artifact.content, "Explicit profile/checker decision for that slice"),
      compileContractPath: extractBulletValue(artifact.content, "Explicit compile-contract artifact for that slice"),
      promotionGoNoGoDecisionPath: extractBulletValue(artifact.content, "Explicit go / no-go decision after the pre-promotion bundle")
        || extractBulletValue(artifact.content, "Explicit promotion go / no-go decision after opening that slice"),
      linkedCapabilityBoundaryPath: extractBulletValue(artifact.content, "Runtime capability boundary path")
        || extractBulletValue(artifact.content, "Runtime capability boundary"),
      linkedRuntimeProofPath: extractBulletValue(artifact.content, "Source Runtime proof artifact")
        || extractBulletValue(artifact.content, "Runtime proof artifact"),
      linkedRuntimeRecordPath: extractBulletValue(artifact.content, "Source Runtime v0 record")
        || extractBulletValue(artifact.content, "Runtime v0 record"),
      linkedFollowUpPath: extractBulletValue(artifact.content, "Source Runtime follow-up record"),
      linkedRoutingPath: extractBulletValue(artifact.content, "Linked Discovery routing record") || null,
      artifactStage: focus.artifactStage,
      artifactNextLegalStep: focus.artifactNextLegalStep,
      currentStage: focus.currentStage,
      nextLegalStep: focus.nextLegalStep,
      promotionReadinessBlockers: [...(focus.runtime?.promotionReadinessBlockers ?? [])],
      content: artifact.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureResultDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureResultDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    (!relativePath.startsWith("architecture/02-experiments/")
      && !relativePath.startsWith("architecture/01-bounded-starts/"))
    || !relativePath.endsWith("-bounded-result.md")
  ) {
    return {
      ok: false,
      error: "invalid_result_artifact_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });
    const parsed = readDirectiveArchitectureBoundedResultArtifact({
      directiveRoot: input.directiveRoot,
      resultPath: relativePath,
    });
    const resultEvidence = readDirectiveArchitectureResultEvidenceForResult({
      directiveRoot: input.directiveRoot,
      resultPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.absolutePath,
      title: parsed.title,
      candidateId: parsed.candidateId,
      candidateName: parsed.candidateName,
      objective: parsed.objective,
      closeoutApproval: parsed.closeoutApproval,
      resultSummary: parsed.resultSummary,
      nextDecision: parsed.nextDecision,
      verdict: parsed.verdict,
      rationale: parsed.rationale,
      startRelativePath: parsed.startRelativePath,
      handoffStubPath: parsed.handoffStubPath,
      decisionRelativePath: parsed.decisionRelativePath,
      continuationStartRelativePath: parsed.continuationStartExists
        ? parsed.continuationStartRelativePath
        : null,
      adoptionRelativePath: readDirectiveArchitectureAdoptionPathForResult({
        directiveRoot: input.directiveRoot,
        resultRelativePath: relativePath,
      }),
      resultEvidence,
      content: artifact.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

function readDirectiveArchitectureAdoptionPathForResult(input: {
  directiveRoot: string;
  resultRelativePath: string;
}) {
  const adoptedRoot = path.join(input.directiveRoot, "architecture", "03-adopted");
  if (!fs.existsSync(adoptedRoot)) {
    return null;
  }

  const fileName = path.basename(input.resultRelativePath);
  const adoptedCandidates = [
    fileName.replace(/-bounded-result\.md$/u, "-adopted-planned-next.md"),
    fileName.replace(/-bounded-result\.md$/u, "-adopted.md"),
  ];

  for (const candidate of adoptedCandidates) {
    const absolute = path.join(adoptedRoot, candidate);
    if (fs.existsSync(absolute)) {
      return normalizeRelativePath(path.join("architecture", "03-adopted", candidate));
    }
  }
  return null;
}

function readDirectiveArchitectureRetentionPathForResult(input: {
  directiveRoot: string;
  resultRelativePath: string;
}) {
  const retainedRoot = path.join(input.directiveRoot, "architecture", "06-retained");
  if (!fs.existsSync(retainedRoot)) {
    return null;
  }

  const fileName = path.basename(input.resultRelativePath);
  if (!fileName.endsWith("-implementation-result.md")) {
    return null;
  }

  const candidate = fileName.replace(/-implementation-result\.md$/u, "-retained.md");
  const absolute = path.join(retainedRoot, candidate);
  if (!fs.existsSync(absolute)) {
    return null;
  }

  return normalizeRelativePath(path.join("architecture", "06-retained", candidate));
}

function readDirectiveArchitectureIntegrationRecordPathForRetention(input: {
  directiveRoot: string;
  retainedRelativePath: string;
}) {
  const integrationRoot = path.join(input.directiveRoot, "architecture", "07-integration-records");
  if (!fs.existsSync(integrationRoot)) {
    return null;
  }

  const fileName = path.basename(input.retainedRelativePath);
  if (!fileName.endsWith("-retained.md")) {
    return null;
  }

  const candidate = fileName.replace(/-retained\.md$/u, "-integration-record.md");
  const absolute = path.join(integrationRoot, candidate);
  if (!fs.existsSync(absolute)) {
    return null;
  }

  return normalizeRelativePath(path.join("architecture", "07-integration-records", candidate));
}

function readDirectiveArchitectureConsumptionPathForIntegration(input: {
  directiveRoot: string;
  integrationRelativePath: string;
}) {
  const consumptionRoot = path.join(input.directiveRoot, "architecture", "08-consumption-records");
  if (!fs.existsSync(consumptionRoot)) {
    return null;
  }

  const fileName = path.basename(input.integrationRelativePath);
  if (!fileName.endsWith("-integration-record.md")) {
    return null;
  }

  const candidate = fileName.replace(/-integration-record\.md$/u, "-consumption.md");
  const absolute = path.join(consumptionRoot, candidate);
  if (!fs.existsSync(absolute)) {
    return null;
  }

  return normalizeRelativePath(path.join("architecture", "08-consumption-records", candidate));
}

function readDirectiveArchitecturePostConsumptionEvaluationPathForConsumption(input: {
  directiveRoot: string;
  consumptionRelativePath: string;
}) {
  const evaluationRoot = path.join(input.directiveRoot, "architecture", "09-post-consumption-evaluations");
  if (!fs.existsSync(evaluationRoot)) {
    return null;
  }

  const fileName = path.basename(input.consumptionRelativePath);
  if (!fileName.endsWith("-consumption.md")) {
    return null;
  }

  const candidate = fileName.replace(/-consumption\.md$/u, "-evaluation.md");
  const absolute = path.join(evaluationRoot, candidate);
  if (!fs.existsSync(absolute)) {
    return null;
  }

  return normalizeRelativePath(path.join("architecture", "09-post-consumption-evaluations", candidate));
}

function readDirectiveArchitectureReopenedStartPathForEvaluation(input: {
  directiveRoot: string;
  evaluationRelativePath: string;
}) {
  const startsRoot = path.join(input.directiveRoot, "architecture", "01-bounded-starts");
  if (!fs.existsSync(startsRoot)) {
    return null;
  }

  const fileName = path.basename(input.evaluationRelativePath);
  if (!fileName.endsWith("-evaluation.md")) {
    return null;
  }

  const candidate = fileName.replace(/-evaluation\.md$/u, "-reopened-bounded-start.md");
  const absolute = path.join(startsRoot, candidate);
  if (!fs.existsSync(absolute)) {
    return null;
  }

  return normalizeRelativePath(path.join("architecture", "01-bounded-starts", candidate));
}

export function readDirectiveFrontendArchitectureAdoptionDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureAdoptionDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/03-adopted/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_adoption_artifact_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitectureAdoptionDetail({
      directiveRoot: input.directiveRoot,
      adoptionPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.adoptedAbsolutePath,
      title: detail.title,
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      finalStatus: detail.finalStatus,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      decisionRelativePath: detail.decisionRelativePath,
      implementationTargetRelativePath: readDirectiveArchitectureImplementationTargetPathForAdoption({
        directiveRoot: input.directiveRoot,
        adoptionRelativePath: relativePath,
      }),
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureImplementationTargetDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureImplementationTargetDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/04-implementation-targets/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_implementation_target_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitectureImplementationTargetDetail({
      directiveRoot: input.directiveRoot,
      targetPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.targetAbsolutePath,
      title: detail.content.split(/\r?\n/).find((line) => line.startsWith("# "))?.replace(/^# /, "").trim()
        || path.basename(relativePath),
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      artifactType: detail.artifactType,
      finalStatus: detail.finalStatus,
      objective: detail.objective,
      expectedOutcome: detail.expectedOutcome,
      selectedBoundedSlice: detail.selectedBoundedSlice,
      mechanicalSuccessCriteria: detail.mechanicalSuccessCriteria,
      explicitLimitations: detail.explicitLimitations,
      sourceAdoptionVerdict: detail.sourceAdoptionVerdict,
      sourceReadinessPassed: detail.sourceReadinessPassed,
      sourceFailedReadinessChecks: detail.sourceFailedReadinessChecks,
      sourceRuntimeHandoffRequired: detail.sourceRuntimeHandoffRequired,
      sourceRuntimeHandoffRationale: detail.sourceRuntimeHandoffRationale,
      sourceArtifactPath: detail.sourceArtifactPath,
      sourcePrimaryEvidencePath: detail.sourcePrimaryEvidencePath,
      sourceSelfImprovementCategory: detail.sourceSelfImprovementCategory,
      sourceSelfImprovementVerificationMethod: detail.sourceSelfImprovementVerificationMethod,
      sourceSelfImprovementVerificationResult: detail.sourceSelfImprovementVerificationResult,
      adoptionRelativePath: detail.adoptionRelativePath,
      decisionRelativePath: detail.decisionRelativePath,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      implementationResultRelativePath: readDirectiveArchitectureImplementationResultPathForTarget({
        directiveRoot: input.directiveRoot,
        targetRelativePath: relativePath,
      }),
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureImplementationResultDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureImplementationResultDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/05-implementation-results/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_implementation_result_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitectureImplementationResultDetail({
      directiveRoot: input.directiveRoot,
      resultPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.resultAbsolutePath,
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      objective: detail.objective,
      selectedBoundedSlice: detail.selectedBoundedSlice,
      mechanicalSuccessCriteria: detail.mechanicalSuccessCriteria,
      explicitLimitations: detail.explicitLimitations,
      sourceAdoptionVerdict: detail.sourceAdoptionVerdict,
      sourceReadinessPassed: detail.sourceReadinessPassed,
      sourceFailedReadinessChecks: detail.sourceFailedReadinessChecks,
      sourceRuntimeHandoffRequired: detail.sourceRuntimeHandoffRequired,
      sourceRuntimeHandoffRationale: detail.sourceRuntimeHandoffRationale,
      sourceArtifactPath: detail.sourceArtifactPath,
      sourcePrimaryEvidencePath: detail.sourcePrimaryEvidencePath,
      sourceSelfImprovementCategory: detail.sourceSelfImprovementCategory,
      sourceSelfImprovementVerificationMethod: detail.sourceSelfImprovementVerificationMethod,
      sourceSelfImprovementVerificationResult: detail.sourceSelfImprovementVerificationResult,
      outcome: detail.outcome,
      resultSummary: detail.resultSummary,
      validationResult: detail.validationResult,
      rollbackNote: detail.rollbackNote,
      targetRelativePath: detail.targetRelativePath,
      adoptionRelativePath: detail.adoptionRelativePath,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      retainedRelativePath: readDirectiveArchitectureRetentionPathForResult({
        directiveRoot: input.directiveRoot,
        resultRelativePath: relativePath,
      }),
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureRetentionDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureRetentionDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/06-retained/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_retained_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitectureRetentionDetail({
      directiveRoot: input.directiveRoot,
      retainedPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.retainedAbsolutePath,
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      objective: detail.objective,
      stabilityLevel: detail.stabilityLevel,
      reuseScope: detail.reuseScope,
      confirmationDecision: detail.confirmationDecision,
      rollbackBoundary: detail.rollbackBoundary,
      resultRelativePath: detail.resultRelativePath,
      targetRelativePath: detail.targetRelativePath,
      adoptionRelativePath: detail.adoptionRelativePath,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      integrationRecordRelativePath: readDirectiveArchitectureIntegrationRecordPathForRetention({
        directiveRoot: input.directiveRoot,
        retainedRelativePath: relativePath,
      }),
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureIntegrationRecordDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureIntegrationRecordDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/07-integration-records/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_integration_record_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitectureIntegrationRecordDetail({
      directiveRoot: input.directiveRoot,
      integrationPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.integrationAbsolutePath,
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      objective: detail.objective,
      integrationTargetSurface: detail.integrationTargetSurface,
      readinessSummary: detail.readinessSummary,
      expectedEffect: detail.expectedEffect,
      validationBoundary: detail.validationBoundary,
      integrationDecision: detail.integrationDecision,
      rollbackBoundary: detail.rollbackBoundary,
      retainedRelativePath: detail.retainedRelativePath,
      resultRelativePath: detail.resultRelativePath,
      targetRelativePath: detail.targetRelativePath,
      adoptionRelativePath: detail.adoptionRelativePath,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      consumptionRelativePath: readDirectiveArchitectureConsumptionPathForIntegration({
        directiveRoot: input.directiveRoot,
        integrationRelativePath: relativePath,
      }),
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureConsumptionRecordDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureConsumptionRecordDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/08-consumption-records/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_consumption_record_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitectureConsumptionRecordDetail({
      directiveRoot: input.directiveRoot,
      consumptionPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.consumptionAbsolutePath,
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      objective: detail.objective,
      appliedSurface: detail.appliedSurface,
      applicationSummary: detail.applicationSummary,
      observedEffect: detail.observedEffect,
      validationResult: detail.validationResult,
      outcome: detail.outcome,
      rollbackNote: detail.rollbackNote,
      integrationRelativePath: detail.integrationRelativePath,
      retainedRelativePath: detail.retainedRelativePath,
      resultRelativePath: detail.resultRelativePath,
      targetRelativePath: detail.targetRelativePath,
      adoptionRelativePath: detail.adoptionRelativePath,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      evaluationRelativePath: readDirectiveArchitecturePostConsumptionEvaluationPathForConsumption({
        directiveRoot: input.directiveRoot,
        consumptionRelativePath: relativePath,
      }),
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitecturePostConsumptionEvaluationDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitecturePostConsumptionEvaluationDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/09-post-consumption-evaluations/")
    || !relativePath.endsWith(".md")
  ) {
    return {
      ok: false,
      error: "invalid_post_consumption_evaluation_path",
      relativePath,
    };
  }

  try {
    const detail = readDirectiveArchitecturePostConsumptionEvaluationDetail({
      directiveRoot: input.directiveRoot,
      evaluationPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: detail.evaluationAbsolutePath,
      candidateId: detail.candidateId,
      candidateName: detail.candidateName,
      usefulnessLevel: detail.usefulnessLevel,
      objective: detail.objective,
      decision: detail.decision,
      rationale: detail.rationale,
      observedStability: detail.observedStability,
      retainedUsefulnessAssessment: detail.retainedUsefulnessAssessment,
      nextBoundedAction: detail.nextBoundedAction,
      rollbackNote: detail.rollbackNote,
      reopenedStartRelativePath: readDirectiveArchitectureReopenedStartPathForEvaluation({
        directiveRoot: input.directiveRoot,
        evaluationRelativePath: relativePath,
      }),
      consumptionRelativePath: detail.consumptionRelativePath,
      integrationRelativePath: detail.integrationRelativePath,
      retainedRelativePath: detail.retainedRelativePath,
      resultRelativePath: detail.resultRelativePath,
      targetRelativePath: detail.targetRelativePath,
      adoptionRelativePath: detail.adoptionRelativePath,
      sourceResultRelativePath: detail.sourceResultRelativePath,
      content: detail.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export type WorkbenchQueueEntry = FrontendQueueEntry;
export type WorkbenchQueueOverview = FrontendQueueOverview;
export type WorkbenchHandoffStub = FrontendHandoffStub;
export type DirectiveWorkbenchSnapshot = DirectiveFrontendSnapshot;
export type DirectiveWorkbenchDiscoveryRoutingDetail =
  DirectiveFrontendDiscoveryRoutingDetail;
export type DirectiveWorkbenchHandoffDetail = DirectiveFrontendHandoffDetail;
export type DirectiveWorkbenchRuntimeRecordDetail = DirectiveFrontendRuntimeRecordDetail;
export type DirectiveWorkbenchRuntimeProofDetail = DirectiveFrontendRuntimeProofDetail;
export type DirectiveWorkbenchRuntimeRuntimeCapabilityBoundaryDetail =
  DirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail;
export type DirectiveWorkbenchRuntimePromotionReadinessDetail =
  DirectiveFrontendRuntimePromotionReadinessDetail;
export type DirectiveWorkbenchArchitectureStartDetail = DirectiveFrontendArchitectureStartDetail;
export type DirectiveWorkbenchArchitectureResultDetail = DirectiveFrontendArchitectureResultDetail;
export type DirectiveWorkbenchArchitectureAdoptionDetail = DirectiveFrontendArchitectureAdoptionDetail;
export type DirectiveWorkbenchArchitectureImplementationTargetDetail =
  DirectiveFrontendArchitectureImplementationTargetDetail;
export type DirectiveWorkbenchArchitectureImplementationResultDetail =
  DirectiveFrontendArchitectureImplementationResultDetail;
export type DirectiveWorkbenchArchitectureRetentionDetail =
  DirectiveFrontendArchitectureRetentionDetail;
export type DirectiveWorkbenchArchitectureIntegrationRecordDetail =
  DirectiveFrontendArchitectureIntegrationRecordDetail;
export type DirectiveWorkbenchArchitectureConsumptionRecordDetail =
  DirectiveFrontendArchitectureConsumptionRecordDetail;
export type DirectiveWorkbenchArchitecturePostConsumptionEvaluationDetail =
  DirectiveFrontendArchitecturePostConsumptionEvaluationDetail;

export const readWorkbenchQueueOverview = readFrontendQueueOverview;
export const readDirectiveWorkbenchSnapshot = readDirectiveFrontendSnapshot;
export const readDirectiveWorkbenchRunDetail = readDirectiveFrontendRunDetail;
export const readDirectiveWorkbenchArtifactText = readDirectiveFrontendArtifactText;
export const readDirectiveWorkbenchQueueEntry = readDirectiveFrontendQueueEntry;
export const readDirectiveWorkbenchDiscoveryRoutingDetail =
  readDirectiveFrontendDiscoveryRoutingDetail;
export const readDirectiveWorkbenchHandoffDetail = readDirectiveFrontendHandoffDetail;
export const readDirectiveWorkbenchRuntimeRecordDetail = readDirectiveFrontendRuntimeRecordDetail;
export const readDirectiveWorkbenchRuntimeProofDetail = readDirectiveFrontendRuntimeProofDetail;
export const readDirectiveWorkbenchRuntimeRuntimeCapabilityBoundaryDetail =
  readDirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail;
export const readDirectiveWorkbenchRuntimePromotionReadinessDetail =
  readDirectiveFrontendRuntimePromotionReadinessDetail;
export const readDirectiveWorkbenchArchitectureStartDetail =
  readDirectiveFrontendArchitectureStartDetail;
export const readDirectiveWorkbenchArchitectureResultDetail =
  readDirectiveFrontendArchitectureResultDetail;
export const readDirectiveWorkbenchArchitectureAdoptionDetail =
  readDirectiveFrontendArchitectureAdoptionDetail;
export const readDirectiveWorkbenchArchitectureImplementationTargetDetail =
  readDirectiveFrontendArchitectureImplementationTargetDetail;
export const readDirectiveWorkbenchArchitectureImplementationResultDetail =
  readDirectiveFrontendArchitectureImplementationResultDetail;
export const readDirectiveWorkbenchArchitectureRetentionDetail =
  readDirectiveFrontendArchitectureRetentionDetail;
export const readDirectiveWorkbenchArchitectureIntegrationRecordDetail =
  readDirectiveFrontendArchitectureIntegrationRecordDetail;
export const readDirectiveWorkbenchArchitectureConsumptionRecordDetail =
  readDirectiveFrontendArchitectureConsumptionRecordDetail;
export const readDirectiveWorkbenchArchitecturePostConsumptionEvaluationDetail =
  readDirectiveFrontendArchitecturePostConsumptionEvaluationDetail;
