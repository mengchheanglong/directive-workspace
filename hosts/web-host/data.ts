import fs from "node:fs";
import path from "node:path";

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
  current_case_stage: string | null;
  current_case_next_legal_step: string | null;
  current_head: FrontendCurrentHead | null;
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
  kind: "architecture_handoff" | "architecture_handoff_invalid" | "runtime_follow_up";
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
    default:
      return `/artifacts?path=${encoded}`;
  }
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
      current_case_stage: null,
      current_case_next_legal_step: null,
      current_head: null,
    };
  }

  try {
    const focus = resolveDirectiveWorkspaceState({
      directiveRoot: input.directiveRoot,
      artifactPath: resolutionPath,
      includeAnchors: false,
    }).focus;

    if (!focus) {
      return {
        ...input.entry,
        integrity_state: "broken",
        current_case_stage: null,
        current_case_next_legal_step: "Current case head could not be resolved from the canonical resolver.",
        current_head: {
          artifact_path: resolutionPath,
          artifact_kind: "unknown",
          artifact_stage: "unknown",
          artifact_lane: input.entry.routing_target ?? "unknown",
          view_path: `/artifacts?path=${encodeURIComponent(resolutionPath)}`,
        },
      };
    }

    return {
      ...input.entry,
      integrity_state: focus.integrityState,
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
    return {
      ...input.entry,
      integrity_state: "broken",
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
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    return "";
  }

  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
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
    .filter((entry) => entry.isFile() && entry.name.endsWith("-runtime-follow-up-record.md"))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, Math.max(1, input.maxEntries ?? 20))
    .map((entry) => {
      const relativePath = normalizeRelativePath(path.join("runtime", "follow-up", entry.name));
      const content = fs.readFileSync(path.join(followUpRoot, entry.name), "utf8");
      const title = content
        .split(/\r?\n/)
        .find((line) => line.startsWith("# "))
        ?.replace(/^# /, "")
        .trim()
        || entry.name;
      const candidateId = entry.name.replace(/-runtime-follow-up-record\.md$/u, "");

      return {
        kind: "runtime_follow_up" as const,
        lane: "runtime" as const,
        relativePath,
        candidateId,
        title,
        status: "pending_review",
        startRelativePath: null,
        warning: null,
      };
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
  ].sort((left, right) => right.relativePath.localeCompare(left.relativePath));

  return {
    engineRuns: readDirectiveEngineRunsOverview({
      directiveRoot: input.directiveRoot,
      maxRuns: input.maxRuns ?? 8,
    }),
    queue: readFrontendQueueOverview({
      directiveRoot: input.directiveRoot,
      maxEntries: input.maxQueueEntries ?? 12,
    }),
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
      relativePath.startsWith("runtime/follow-up/")
      && relativePath.endsWith("-runtime-follow-up-record.md")
    ) {
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
        approvalAllowed: artifact.approvalAllowed,
        artifact,
      };
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
      approvalAllowed: artifact.approvalAllowed,
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
      approvalAllowed: artifact.approvalAllowed,
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
      approvalAllowed: artifact.approvalAllowed,
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
