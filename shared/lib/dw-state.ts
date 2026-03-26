import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveArchitectureHandoffArtifact,
  type DirectiveArchitectureHandoffArtifact,
} from "./architecture-handoff-start.ts";
import {
  readDirectiveArchitectureBoundedResultArtifact,
  readDirectiveArchitectureBoundedStartArtifact,
  type DirectiveArchitectureBoundedResultArtifact,
  type DirectiveArchitectureBoundedStartArtifact,
} from "./architecture-bounded-closeout.ts";
import {
  readDirectiveArchitectureAdoptionDetail,
  type DirectiveArchitectureAdoptionDetail,
} from "./architecture-result-adoption.ts";
import {
  readDirectiveArchitectureImplementationTargetDetail,
  type DirectiveArchitectureImplementationTargetDetail,
} from "./architecture-implementation-target.ts";
import {
  readDirectiveArchitectureImplementationResultDetail,
  type DirectiveArchitectureImplementationResultDetail,
} from "./architecture-implementation-result.ts";
import {
  readDirectiveArchitectureRetentionDetail,
  type DirectiveArchitectureRetentionDetail,
} from "./architecture-retention.ts";
import {
  readDirectiveArchitectureIntegrationRecordDetail,
  type DirectiveArchitectureIntegrationRecordDetail,
} from "./architecture-integration-record.ts";
import {
  readDirectiveArchitectureConsumptionRecordDetail,
  type DirectiveArchitectureConsumptionRecordDetail,
} from "./architecture-consumption-record.ts";
import {
  readDirectiveArchitecturePostConsumptionEvaluationDetail,
  type DirectiveArchitecturePostConsumptionEvaluationDetail,
} from "./architecture-post-consumption-evaluation.ts";
import {
  readDirectiveDiscoveryRoutingArtifact,
} from "./discovery-route-opener.ts";
import {
  readDirectiveEngineRunsOverview,
  type StoredDirectiveEngineRunRecord,
} from "./engine-run-artifacts.ts";
import {
  readDirectiveRuntimeFollowUpArtifact,
  type DirectiveRuntimeFollowUpArtifact,
} from "./runtime-follow-up-opener.ts";
import {
  applyDirectiveWorkspaceIntegrityGate,
  buildDirectiveWorkspaceProductTruth,
} from "../../engine/workspace-truth.ts";
import {
  fileExistsInDirectiveWorkspace,
  readLinkedArtifactIfPresent,
  recordExpectedArtifactIfMissing,
  recordInconsistentLink,
  recordMissingExpectedArtifact,
  recordMissingLinkedArtifactIfAbsent,
} from "../../engine/artifact-link-validation.ts";

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  received_at: string;
  status: string;
  routing_target: string | null;
  mission_alignment?: string | null;
  capability_gap_id?: string | null;
  intake_record_path?: string | null;
  fast_path_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
  notes?: string | null;
};

export type DirectiveWorkspaceFocusLane =
  | "discovery"
  | "engine"
  | "architecture"
  | "runtime"
  | "unknown";

export type DirectiveWorkspaceArtifactKind =
  | "discovery_routing_record"
  | "engine_run"
  | "architecture_handoff"
  | "architecture_bounded_start"
  | "architecture_bounded_result"
  | "architecture_adoption"
  | "architecture_implementation_target"
  | "architecture_implementation_result"
  | "architecture_retained"
  | "architecture_integration_record"
  | "architecture_consumption_record"
  | "architecture_post_consumption_evaluation"
  | "runtime_follow_up"
  | "runtime_record_follow_up_review"
  | "runtime_record_callable_integration"
  | "runtime_proof_follow_up_review"
  | "runtime_proof_callable_integration"
  | "runtime_runtime_capability_boundary"
  | "runtime_promotion_readiness"
  | "runtime_callable_integration"
  | "unknown";

export type DirectiveWorkspaceLinkedArtifacts = {
  discoveryIntakePath: string | null;
  discoveryTriagePath: string | null;
  discoveryRoutingPath: string | null;
  engineRunRecordPath: string | null;
  engineRunReportPath: string | null;
  architectureHandoffPath: string | null;
  architectureBoundedStartPath: string | null;
  architectureBoundedResultPath: string | null;
  architectureContinuationStartPath: string | null;
  architectureAdoptionPath: string | null;
  architectureImplementationTargetPath: string | null;
  architectureImplementationResultPath: string | null;
  architectureRetainedPath: string | null;
  architectureIntegrationRecordPath: string | null;
  architectureConsumptionRecordPath: string | null;
  architectureEvaluationPath: string | null;
  architectureReopenedStartPath: string | null;
  runtimeFollowUpPath: string | null;
  runtimeRecordPath: string | null;
  runtimeProofPath: string | null;
  runtimeRuntimeCapabilityBoundaryPath: string | null;
  runtimePromotionReadinessPath: string | null;
  runtimeCallableStubPath: string | null;
};

export type DirectiveWorkspaceCurrentHead = {
  artifactPath: string;
  artifactKind: DirectiveWorkspaceArtifactKind;
  lane: DirectiveWorkspaceFocusLane;
  artifactStage: string;
};

export type DirectiveWorkspaceResolvedFocus = {
  ok: true;
  directiveRoot: string;
  artifactPath: string;
  artifactKind: DirectiveWorkspaceArtifactKind;
  lane: DirectiveWorkspaceFocusLane;
  candidateId: string | null;
  candidateName: string | null;
  integrityState: "ok" | "broken";
  artifactStage: string;
  artifactNextLegalStep: string;
  currentStage: string;
  nextLegalStep: string;
  routeTarget: string | null;
  statusGate: string | null;
  missingExpectedArtifacts: string[];
  inconsistentLinks: string[];
  intentionallyUnbuiltDownstreamStages: string[];
  currentHead: DirectiveWorkspaceCurrentHead;
  linkedArtifacts: DirectiveWorkspaceLinkedArtifacts;
  discovery: {
    queueStatus: string | null;
    routingDecision: string | null;
    usefulnessLevel: string | null;
    usefulnessRationale: string | null;
    requiredNextArtifact: string | null;
  };
  engine: {
    runId: string | null;
    selectedLane: string | null;
    decisionState: string | null;
    proofKind: string | null;
    nextAction: string | null;
  };
  runtime?: {
    proposedHost: string | null;
    executionState: string | null;
    promotionReadinessBlockers: string[];
  };
};

export type DirectiveWorkspaceAnchorSummary = {
  label: string;
  artifactPath: string;
  lane: DirectiveWorkspaceFocusLane;
  currentStage: string;
  nextLegalStep: string;
  candidateId: string | null;
  candidateName: string | null;
};

export type DirectiveWorkspaceStateReport = {
  ok: true;
  snapshotAt: string;
  directiveRoot: string;
  product: {
    hierarchy: string[];
    workflow: string[];
    fieldInterpretation: {
      artifactStage: string;
      currentStage: string;
      currentHead: string;
      artifactNextLegalStep: string;
      nextLegalStep: string;
      routeTarget: string;
    };
    proven: string[];
    partiallyBuilt: string[];
    intentionallyMinimal: string[];
    notBuilt: string[];
    forbiddenScopeExpansion: string[];
    legalNextSeams: {
      discovery: string[];
      runtime: string[];
      architecture: string[];
      sharedEngineWholeProduct: string[];
    };
  };
  engine: {
    totalRuns: number;
    latestRunRecordPath: string | null;
    latestRunReportPath: string | null;
    counts: ReturnType<typeof readDirectiveEngineRunsOverview>["counts"];
  };
  anchors: DirectiveWorkspaceAnchorSummary[];
  focus: DirectiveWorkspaceResolvedFocus | null;
};

type GenericRuntimeRecordArtifact =
  | {
      kind: "follow_up_review";
      candidateId: string;
      candidateName: string;
      currentStatus: string;
      runtimeRecordRelativePath: string;
      linkedFollowUpRecord: string;
      linkedRoutingPath: string | null;
      runtimeProofRelativePath: string | null;
      runtimeRuntimeCapabilityBoundaryPath: string | null;
      callableStubPath: null;
      sourceIntegrationRecordPath: null;
    }
  | {
      kind: "callable_integration_record";
      candidateId: string;
      candidateName: string;
      currentStatus: string;
      runtimeRecordRelativePath: string;
      linkedFollowUpRecord: null;
      linkedRoutingPath: null;
      runtimeProofRelativePath: string | null;
      runtimeRuntimeCapabilityBoundaryPath: string | null;
      callableStubPath: string | null;
      sourceIntegrationRecordPath: string | null;
    };

type GenericRuntimeProofArtifact =
  | {
      kind: "follow_up_review";
      candidateId: string;
      candidateName: string;
      runtimeProofRelativePath: string;
      linkedRuntimeRecordPath: string;
      linkedFollowUpPath: string;
      linkedRoutingPath: string | null;
      promotionStatus: null;
      runtimeRuntimeCapabilityBoundaryPath: null;
      callableStubPath: null;
    }
  | {
      kind: "callable_integration";
      candidateId: string;
      candidateName: string;
      runtimeProofRelativePath: string;
      linkedRuntimeRecordPath: string;
      linkedFollowUpPath: null;
      linkedRoutingPath: null;
      promotionStatus: string | null;
      runtimeRuntimeCapabilityBoundaryPath: string | null;
      callableStubPath: string | null;
    };

type GenericRuntimeRuntimeCapabilityBoundaryArtifact = {
  candidateId: string;
  title: string;
  runtimeRuntimeCapabilityBoundaryPath: string;
  linkedRuntimeProofPath: string | null;
  linkedRuntimeRecordPath: string | null;
  linkedCallableStubPath: string | null;
  currentProofStatus: string | null;
};

type GenericRuntimePromotionReadinessArtifact = {
  candidateId: string;
  candidateName: string;
  promotionReadinessPath: string;
  linkedCapabilityBoundaryPath: string;
  linkedRuntimeProofPath: string | null;
  linkedRuntimeRecordPath: string | null;
  linkedCallableStubPath: string | null;
  proposedHost: string | null;
  executionState: string | null;
  currentStatus: string | null;
};

function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}

function getDefaultDirectiveWorkspaceRoot() {
  return normalizePath(fileURLToPath(new URL("../../", import.meta.url)));
}

function requiredString(value: string | null | undefined, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`invalid_input: ${fieldName} is required`);
  }
  return value.trim();
}

function optionalString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === "n/a" || normalized.toLowerCase() === "pending") {
    return null;
  }
  return normalized.replace(/^`|`$/g, "");
}

function resolveDirectiveRelativePath(directiveRoot: string, inputPath: string, fieldName: string) {
  const normalizedInput = requiredString(inputPath, fieldName).replace(/\\/g, "/");
  const root = path.resolve(directiveRoot);
  const absolutePath = path.isAbsolute(normalizedInput)
    ? path.resolve(normalizedInput)
    : path.resolve(root, normalizedInput);
  const normalizedRootPrefix = `${root}${path.sep}`;

  if (absolutePath !== root && !absolutePath.startsWith(normalizedRootPrefix)) {
    throw new Error(`invalid_input: ${fieldName} must stay within directive-workspace`);
  }

  return path.relative(root, absolutePath).replace(/\\/g, "/");
}

function readUtf8(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function extractTitle(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .find((line) => line.startsWith("# "))
    ?.replace(/^# /, "")
    .trim()
    || "";
}

function deriveRuntimeCandidateNameFromTitle(title: string) {
  return title
    .replace(/^Runtime V0 Record:\s*/u, "")
    .replace(/^Runtime V0 Proof Artifact:\s*/u, "")
    .replace(/^Runtime V0 Runtime Capability Boundary:\s*/u, "")
    .replace(/\s+\(\d{4}-\d{2}-\d{2}\)\s*$/u, "")
    .trim();
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    return null;
  }
  return optionalString(line.trim().replace(prefix, "").trim());
}

function zeroLinkedArtifacts(): DirectiveWorkspaceLinkedArtifacts {
  return {
    discoveryIntakePath: null,
    discoveryTriagePath: null,
    discoveryRoutingPath: null,
    engineRunRecordPath: null,
    engineRunReportPath: null,
    architectureHandoffPath: null,
    architectureBoundedStartPath: null,
    architectureBoundedResultPath: null,
    architectureContinuationStartPath: null,
    architectureAdoptionPath: null,
    architectureImplementationTargetPath: null,
    architectureImplementationResultPath: null,
    architectureRetainedPath: null,
    architectureIntegrationRecordPath: null,
    architectureConsumptionRecordPath: null,
    architectureEvaluationPath: null,
    architectureReopenedStartPath: null,
    runtimeFollowUpPath: null,
    runtimeRecordPath: null,
    runtimeProofPath: null,
    runtimeRuntimeCapabilityBoundaryPath: null,
    runtimePromotionReadinessPath: null,
    runtimeCallableStubPath: null,
  };
}

function matchStagePrefix(currentStage: string, prefix: string, fallback: string) {
  return currentStage.startsWith(prefix) ? currentStage : fallback;
}

function deriveDirectiveWorkspaceCurrentHead(
  focus: Omit<DirectiveWorkspaceResolvedFocus, "integrityState" | "currentHead">,
): DirectiveWorkspaceCurrentHead {
  const linked = focus.linkedArtifacts;
  const currentStage = focus.currentStage;
  const candidates: DirectiveWorkspaceCurrentHead[] = [];

  if (linked.architectureReopenedStartPath) {
    candidates.push({
      artifactPath: linked.architectureReopenedStartPath,
      artifactKind: "architecture_bounded_start",
      lane: "architecture",
      artifactStage: "architecture.bounded_start.opened",
    });
  }
  if (linked.architectureEvaluationPath) {
    candidates.push({
      artifactPath: linked.architectureEvaluationPath,
      artifactKind: "architecture_post_consumption_evaluation",
      lane: "architecture",
      artifactStage: matchStagePrefix(
        currentStage,
        "architecture.post_consumption_evaluation.",
        "architecture.post_consumption_evaluation.unknown",
      ),
    });
  }
  if (linked.architectureConsumptionRecordPath) {
    candidates.push({
      artifactPath: linked.architectureConsumptionRecordPath,
      artifactKind: "architecture_consumption_record",
      lane: "architecture",
      artifactStage: matchStagePrefix(
        currentStage,
        "architecture.consumption.",
        "architecture.consumption.unknown",
      ),
    });
  }
  if (linked.architectureIntegrationRecordPath) {
    candidates.push({
      artifactPath: linked.architectureIntegrationRecordPath,
      artifactKind: "architecture_integration_record",
      lane: "architecture",
      artifactStage: "architecture.integration_record.ready",
    });
  }
  if (linked.architectureRetainedPath) {
    candidates.push({
      artifactPath: linked.architectureRetainedPath,
      artifactKind: "architecture_retained",
      lane: "architecture",
      artifactStage: "architecture.retained.confirmed",
    });
  }
  if (linked.architectureImplementationResultPath) {
    candidates.push({
      artifactPath: linked.architectureImplementationResultPath,
      artifactKind: "architecture_implementation_result",
      lane: "architecture",
      artifactStage: matchStagePrefix(
        currentStage,
        "architecture.implementation_result.",
        "architecture.implementation_result.unknown",
      ),
    });
  }
  if (linked.architectureImplementationTargetPath) {
    candidates.push({
      artifactPath: linked.architectureImplementationTargetPath,
      artifactKind: "architecture_implementation_target",
      lane: "architecture",
      artifactStage: "architecture.implementation_target.opened",
    });
  }
  if (linked.architectureAdoptionPath) {
    candidates.push({
      artifactPath: linked.architectureAdoptionPath,
      artifactKind: "architecture_adoption",
      lane: "architecture",
      artifactStage: matchStagePrefix(
        currentStage,
        "architecture.adoption.",
        "architecture.adoption.unknown",
      ),
    });
  }
  if (linked.architectureContinuationStartPath) {
    candidates.push({
      artifactPath: linked.architectureContinuationStartPath,
      artifactKind: "architecture_bounded_start",
      lane: "architecture",
      artifactStage: "architecture.bounded_start.opened",
    });
  }
  if (linked.architectureBoundedResultPath) {
    candidates.push({
      artifactPath: linked.architectureBoundedResultPath,
      artifactKind: "architecture_bounded_result",
      lane: "architecture",
      artifactStage: matchStagePrefix(
        currentStage,
        "architecture.bounded_result.",
        "architecture.bounded_result.unknown",
      ),
    });
  }
  if (linked.architectureBoundedStartPath) {
    candidates.push({
      artifactPath: linked.architectureBoundedStartPath,
      artifactKind: "architecture_bounded_start",
      lane: "architecture",
      artifactStage: "architecture.bounded_start.opened",
    });
  }
  if (linked.architectureHandoffPath) {
    candidates.push({
      artifactPath: linked.architectureHandoffPath,
      artifactKind: "architecture_handoff",
      lane: "architecture",
      artifactStage: "architecture.handoff.pending_review",
    });
  }

  if (linked.runtimePromotionReadinessPath) {
    candidates.push({
      artifactPath: linked.runtimePromotionReadinessPath,
      artifactKind: "runtime_promotion_readiness",
      lane: "runtime",
      artifactStage: "runtime.promotion_readiness.opened",
    });
  }
  if (linked.runtimeRuntimeCapabilityBoundaryPath) {
    candidates.push({
      artifactPath: linked.runtimeRuntimeCapabilityBoundaryPath,
      artifactKind: "runtime_runtime_capability_boundary",
      lane: "runtime",
      artifactStage: "runtime.runtime_capability_boundary.opened",
    });
  }
  if (linked.runtimeProofPath) {
    candidates.push({
      artifactPath: linked.runtimeProofPath,
      artifactKind: focus.artifactKind === "runtime_proof_callable_integration"
        ? "runtime_proof_callable_integration"
        : "runtime_proof_follow_up_review",
      lane: "runtime",
      artifactStage: matchStagePrefix(currentStage, "runtime.proof.", "runtime.proof.opened"),
    });
  }
  if (linked.runtimeRecordPath) {
    candidates.push({
      artifactPath: linked.runtimeRecordPath,
      artifactKind: focus.artifactKind === "runtime_record_callable_integration"
        ? "runtime_record_callable_integration"
        : "runtime_record_follow_up_review",
      lane: "runtime",
      artifactStage: matchStagePrefix(currentStage, "runtime.record.", "runtime.record.pending_proof_boundary"),
    });
  }
  if (linked.runtimeFollowUpPath) {
    candidates.push({
      artifactPath: linked.runtimeFollowUpPath,
      artifactKind: "runtime_follow_up",
      lane: "runtime",
      artifactStage: "runtime.follow_up.pending_review",
    });
  }
  if (linked.runtimeCallableStubPath) {
    candidates.push({
      artifactPath: linked.runtimeCallableStubPath,
      artifactKind: "runtime_callable_integration",
      lane: "runtime",
      artifactStage: "runtime.callable_stub.not_implemented",
    });
  }

  if (linked.discoveryRoutingPath) {
    candidates.push({
      artifactPath: linked.discoveryRoutingPath,
      artifactKind: "discovery_routing_record",
      lane: "discovery",
      artifactStage: focus.routeTarget
        ? `discovery.route.${focus.routeTarget}`
        : "discovery.route.unknown",
    });
  }
  if (linked.engineRunRecordPath) {
    candidates.push({
      artifactPath: linked.engineRunRecordPath,
      artifactKind: "engine_run",
      lane: "engine",
      artifactStage: focus.engine.selectedLane
        ? `engine.route.${focus.engine.selectedLane}`
        : "engine.route.unknown",
    });
  }

  return candidates[0] ?? {
    artifactPath: focus.artifactPath,
    artifactKind: focus.artifactKind,
    lane: focus.lane,
    artifactStage: focus.artifactStage,
  };
}

function finalizeResolvedFocus(
  focus: Omit<DirectiveWorkspaceResolvedFocus, "integrityState" | "currentHead">,
): DirectiveWorkspaceResolvedFocus {
  return applyDirectiveWorkspaceIntegrityGate({
    ...focus,
    currentHead: deriveDirectiveWorkspaceCurrentHead(focus),
  });
}

function mergeNonNullLinkedArtifacts(
  target: DirectiveWorkspaceLinkedArtifacts,
  source: DirectiveWorkspaceLinkedArtifacts | null | undefined,
) {
  if (!source) {
    return;
  }

  for (const [key, value] of Object.entries(source)) {
    if (value) {
      target[key as keyof DirectiveWorkspaceLinkedArtifacts] = value;
    }
  }
}

function listFiles(input: {
  directiveRoot: string;
  relativeDir: string;
  suffix: string;
}) {
  const root = path.join(input.directiveRoot, input.relativeDir);
  if (!fs.existsSync(root)) {
    return [] as string[];
  }

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(input.suffix))
    .map((entry) => normalizeRelativePath(path.join(input.relativeDir, entry.name)))
    .sort((left, right) => right.localeCompare(left));
}

function loadQueueEntries(directiveRoot: string) {
  const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
  if (!fs.existsSync(queuePath)) {
    return [] as QueueEntry[];
  }
  const payload = JSON.parse(readUtf8(queuePath)) as { entries?: QueueEntry[] };
  return Array.isArray(payload.entries) ? payload.entries : [];
}

function findQueueEntryByCandidateId(directiveRoot: string, candidateId: string | null | undefined) {
  if (!candidateId) {
    return null;
  }
  return loadQueueEntries(directiveRoot).find((entry) => entry.candidate_id === candidateId) ?? null;
}

function findLatestEngineRunByCandidateId(directiveRoot: string, candidateId: string | null | undefined) {
  if (!candidateId) {
    return null;
  }

  const engineRunsRoot = path.join(directiveRoot, "runtime", "standalone-host", "engine-runs");
  if (!fs.existsSync(engineRunsRoot)) {
    return null;
  }

  const matches = fs
    .readdirSync(engineRunsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(engineRunsRoot, entry.name))
    .map((recordPath) => {
      try {
        const parsed = JSON.parse(readUtf8(recordPath)) as StoredDirectiveEngineRunRecord;
        if (parsed.candidate?.candidateId !== candidateId) {
          return null;
        }
        const reportPath = recordPath.replace(/\.json$/i, ".md");
        return {
          record: parsed,
          recordRelativePath: normalizeRelativePath(path.relative(directiveRoot, recordPath)),
          reportRelativePath: fs.existsSync(reportPath)
            ? normalizeRelativePath(path.relative(directiveRoot, reportPath))
            : null,
        };
      } catch {
        return null;
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => right.record.receivedAt.localeCompare(left.record.receivedAt));

  return matches[0] ?? null;
}

function readGenericRuntimeRecordArtifact(input: {
  directiveRoot: string;
  runtimeRecordPath: string;
}): GenericRuntimeRecordArtifact {
  const runtimeRecordRelativePath = resolveDirectiveRelativePath(
    input.directiveRoot,
    input.runtimeRecordPath,
    "runtimeRecordPath",
  );
  const absolutePath = path.join(input.directiveRoot, runtimeRecordRelativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: runtimeRecordPath not found: ${runtimeRecordRelativePath}`);
  }

  const content = readUtf8(absolutePath);
  const title = extractTitle(content);
  const candidateId = requiredString(extractBulletValue(content, "Candidate id"), "candidate id");
  const candidateName = extractBulletValue(content, "Candidate name")
    ?? requiredString(deriveRuntimeCandidateNameFromTitle(title), "candidate name");
  const currentStatus = requiredString(extractBulletValue(content, "Current status"), "current status");

  if (content.includes("## follow-up review decision")) {
    return {
      kind: "follow_up_review",
      candidateId,
      candidateName,
      currentStatus,
      runtimeRecordRelativePath,
      linkedFollowUpRecord: requiredString(
        extractBulletValue(content, "Source follow-up record"),
        "source follow-up record",
      ),
      linkedRoutingPath: extractBulletValue(content, "Linked Discovery routing record"),
      runtimeProofRelativePath: extractBulletValue(content, "Next Runtime proof artifact if later approved"),
      runtimeRuntimeCapabilityBoundaryPath: null,
      callableStubPath: null,
      sourceIntegrationRecordPath: null,
    };
  }

  return {
    kind: "callable_integration_record",
    candidateId,
    candidateName,
    currentStatus,
    runtimeRecordRelativePath,
    linkedFollowUpRecord: null,
    linkedRoutingPath: null,
    runtimeProofRelativePath: extractBulletValue(content, "Runtime proof artifact"),
    runtimeRuntimeCapabilityBoundaryPath: extractBulletValue(content, "Runtime runtime capability boundary"),
    callableStubPath: extractBulletValue(content, "Callable stub path"),
    sourceIntegrationRecordPath: extractBulletValue(content, "Source integration record"),
  };
}

function readGenericRuntimeProofArtifact(input: {
  directiveRoot: string;
  runtimeProofPath: string;
}): GenericRuntimeProofArtifact {
  const runtimeProofRelativePath = resolveDirectiveRelativePath(
    input.directiveRoot,
    input.runtimeProofPath,
    "runtimeProofPath",
  );
  const absolutePath = path.join(input.directiveRoot, runtimeProofRelativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: runtimeProofPath not found: ${runtimeProofRelativePath}`);
  }

  const content = readUtf8(absolutePath);
  const title = extractTitle(content);
  const candidateId = requiredString(extractBulletValue(content, "Candidate id"), "candidate id");
  const candidateName = extractBulletValue(content, "Candidate name")
    ?? requiredString(deriveRuntimeCandidateNameFromTitle(title), "candidate name");

  if (content.includes("## runtime record identity")) {
    return {
      kind: "follow_up_review",
      candidateId,
      candidateName,
      runtimeProofRelativePath,
      linkedRuntimeRecordPath: requiredString(
        extractBulletValue(content, "Runtime v0 record path"),
        "runtime v0 record path",
      ),
      linkedFollowUpPath: requiredString(
        extractBulletValue(content, "Source follow-up record path"),
        "source follow-up record path",
      ),
      linkedRoutingPath: extractBulletValue(content, "Linked Discovery routing record"),
      promotionStatus: null,
      runtimeRuntimeCapabilityBoundaryPath: null,
      callableStubPath: null,
    };
  }

  return {
    kind: "callable_integration",
    candidateId,
    candidateName,
    runtimeProofRelativePath,
    linkedRuntimeRecordPath: requiredString(extractBulletValue(content, "Runtime record path"), "runtime record path"),
    linkedFollowUpPath: null,
    linkedRoutingPath: null,
    promotionStatus: extractBulletValue(content, "Status"),
    runtimeRuntimeCapabilityBoundaryPath: extractBulletValue(content, "Runtime runtime capability boundary"),
    callableStubPath: extractBulletValue(content, "Callable stub path"),
  };
}

function readGenericRuntimeRuntimeCapabilityBoundaryArtifact(input: {
  directiveRoot: string;
  capabilityBoundaryPath: string;
}): GenericRuntimeRuntimeCapabilityBoundaryArtifact {
  const runtimeRuntimeCapabilityBoundaryPath = resolveDirectiveRelativePath(
    input.directiveRoot,
    input.capabilityBoundaryPath,
    "capabilityBoundaryPath",
  );
  const absolutePath = path.join(input.directiveRoot, runtimeRuntimeCapabilityBoundaryPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: capabilityBoundaryPath not found: ${runtimeRuntimeCapabilityBoundaryPath}`);
  }

  const content = readUtf8(absolutePath);
  const title = extractTitle(content);
  const candidateId = path.basename(runtimeRuntimeCapabilityBoundaryPath)
    .replace(/-runtime-capability-boundary\.md$/u, "");

  return {
    candidateId,
    title,
    runtimeRuntimeCapabilityBoundaryPath,
    linkedRuntimeProofPath: extractBulletValue(content, "Proof artifact"),
    linkedRuntimeRecordPath: extractBulletValue(content, "Runtime record"),
    linkedCallableStubPath: extractBulletValue(content, "Callable stub"),
    currentProofStatus: extractBulletValue(content, "Current Runtime proof status"),
  };
}

function readGenericRuntimePromotionReadinessArtifact(input: {
  directiveRoot: string;
  promotionReadinessPath: string;
}): GenericRuntimePromotionReadinessArtifact {
  const promotionReadinessPath = resolveDirectiveRelativePath(
    input.directiveRoot,
    input.promotionReadinessPath,
    "promotionReadinessPath",
  );
  const absolutePath = path.join(input.directiveRoot, promotionReadinessPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: promotionReadinessPath not found: ${promotionReadinessPath}`);
  }

  const content = readUtf8(absolutePath);
  return {
    candidateId: requiredString(extractBulletValue(content, "Candidate id"), "candidate id"),
    candidateName: requiredString(extractBulletValue(content, "Candidate name"), "candidate name"),
    promotionReadinessPath,
    linkedCapabilityBoundaryPath: requiredString(
      extractBulletValue(content, "Runtime capability boundary"),
      "runtime capability boundary",
    ),
    linkedRuntimeProofPath: extractBulletValue(content, "Runtime proof artifact"),
    linkedRuntimeRecordPath: extractBulletValue(content, "Runtime v0 record"),
    linkedCallableStubPath: extractBulletValue(content, "Linked callable stub"),
    proposedHost: extractBulletValue(content, "Proposed host"),
    executionState: extractBulletValue(content, "Execution state"),
    currentStatus: extractBulletValue(content, "Current status"),
  };
}

function buildRuntimePromotionReadinessBlockers(input: {
  promotionReadiness: GenericRuntimePromotionReadinessArtifact | null;
}) {
  if (!input.promotionReadiness) {
    return [];
  }

  const blockers: string[] = [];
  if (input.promotionReadiness.proposedHost === "pending_host_selection") {
    blockers.push("proposed_host_pending_selection");
  }
  if (input.promotionReadiness.executionState?.includes("not implemented")) {
    blockers.push("runtime_implementation_unopened");
  }
  if (input.promotionReadiness.executionState?.includes("not promoted")) {
    blockers.push("host_facing_promotion_unopened");
  }

  return blockers;
}

function inferRuntimeRuntimeCapabilityBoundaryPathFromProof(input: {
  directiveRoot: string;
  runtimeProofRelativePath: string | null | undefined;
}) {
  if (!input.runtimeProofRelativePath) {
    return null;
  }
  if (
    !input.runtimeProofRelativePath.startsWith("runtime/03-proof/")
    || !input.runtimeProofRelativePath.endsWith("-proof.md")
  ) {
    return null;
  }

  const candidatePath = normalizeRelativePath(
    input.runtimeProofRelativePath
      .replace(/^runtime\/03-proof\//u, "runtime/04-capability-boundaries/")
      .replace(/-proof\.md$/u, "-runtime-capability-boundary.md"),
  );

  return fileExistsInDirectiveWorkspace(input.directiveRoot, candidatePath) ? candidatePath : null;
}

function inferRuntimePromotionReadinessPathFromCapabilityBoundary(input: {
  directiveRoot: string;
  capabilityBoundaryPath: string | null | undefined;
}) {
  if (!input.capabilityBoundaryPath) {
    return null;
  }
  if (
    !input.capabilityBoundaryPath.startsWith("runtime/04-capability-boundaries/")
    || !input.capabilityBoundaryPath.endsWith("-runtime-capability-boundary.md")
  ) {
    return null;
  }

  const candidatePath = normalizeRelativePath(
    input.capabilityBoundaryPath
      .replace(/^runtime\/04-capability-boundaries\//u, "runtime/05-promotion-readiness/")
      .replace(/-runtime-capability-boundary\.md$/u, "-promotion-readiness.md"),
  );

  return fileExistsInDirectiveWorkspace(input.directiveRoot, candidatePath) ? candidatePath : null;
}

function readGenericCallableIntegrationArtifact(input: {
  directiveRoot: string;
  callablePath: string;
}) {
  const callableRelativePath = resolveDirectiveRelativePath(
    input.directiveRoot,
    input.callablePath,
    "callablePath",
  );
  const absolutePath = path.join(input.directiveRoot, callableRelativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: callablePath not found: ${callableRelativePath}`);
  }

  const content = readUtf8(absolutePath);
  const candidateId =
    /capabilityId:\s*"([^"]+)"/.exec(content)?.[1]
    ?? path.basename(callableRelativePath).replace(/-callable-integration\.ts$/u, "");

  return {
    candidateId,
    callableRelativePath,
    runtimeRecordRelativePath:
      /runtimeRecordPath:\s*"([^"]+)"/.exec(content)?.[1] ?? null,
    runtimeProofRelativePath:
      /runtimeProofPath:\s*"([^"]+)"/.exec(content)?.[1] ?? null,
    runtimeRuntimeCapabilityBoundaryPath:
      /runtimeRuntimeCapabilityBoundaryPath:\s*"([^"]+)"/.exec(content)?.[1] ?? null,
    integrationRecordPath:
      /integrationRecordPath:\s*"([^"]+)"/.exec(content)?.[1] ?? null,
  };
}

function findArchitectureAdoptionForResult(directiveRoot: string, resultPath: string) {
  if (typeof resultPath !== "string" || resultPath.trim().length === 0) {
    return null;
  }

  for (const adoptionPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/03-adopted",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitectureAdoptionDetail({
        directiveRoot,
        adoptionPath,
      });
      if (detail.sourceResultRelativePath === resultPath) {
        return {
          path: adoptionPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function readArchitectureUpstreamChainFromAdoption(input: {
  directiveRoot: string;
  adoptionDetail: DirectiveArchitectureAdoptionDetail;
}) {
  if (!input.adoptionDetail.sourceResultRelativePath) {
    return {
      result: null,
      start: null,
      handoff: null,
    };
  }

  const result = readDirectiveArchitectureBoundedResultArtifact({
    directiveRoot: input.directiveRoot,
    resultPath: input.adoptionDetail.sourceResultRelativePath,
  });
  const start = readDirectiveArchitectureBoundedStartArtifact({
    directiveRoot: input.directiveRoot,
    startPath: result.startRelativePath,
  });
  const handoff = readLinkedArtifactIfPresent({
    directiveRoot: input.directiveRoot,
    relativePath: result.handoffStubPath,
    read: (handoffPath) => readDirectiveArchitectureHandoffArtifact({
      directiveRoot: input.directiveRoot,
      handoffPath,
    }),
  });

  return {
    result,
    start,
    handoff,
  };
}

function findArchitectureImplementationTargetForAdoption(directiveRoot: string, adoptionPath: string) {
  for (const targetPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/04-implementation-targets",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitectureImplementationTargetDetail({
        directiveRoot,
        targetPath,
      });
      if (detail.adoptionRelativePath === adoptionPath) {
        return {
          path: targetPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findArchitectureImplementationResultForTarget(directiveRoot: string, targetPath: string) {
  for (const resultPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/05-implementation-results",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitectureImplementationResultDetail({
        directiveRoot,
        resultPath,
      });
      if (detail.targetRelativePath === targetPath) {
        return {
          path: resultPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findArchitectureRetentionForResult(directiveRoot: string, implementationResultPath: string) {
  for (const retainedPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/06-retained",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitectureRetentionDetail({
        directiveRoot,
        retainedPath,
      });
      if (detail.resultRelativePath === implementationResultPath) {
        return {
          path: retainedPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findArchitectureIntegrationForRetention(directiveRoot: string, retainedPath: string) {
  for (const integrationPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/07-integration-records",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitectureIntegrationRecordDetail({
        directiveRoot,
        integrationPath,
      });
      if (detail.retainedRelativePath === retainedPath) {
        return {
          path: integrationPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findArchitectureConsumptionForIntegration(directiveRoot: string, integrationPath: string) {
  for (const consumptionPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/08-consumption-records",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitectureConsumptionRecordDetail({
        directiveRoot,
        consumptionPath,
      });
      if (detail.integrationRelativePath === integrationPath) {
        return {
          path: consumptionPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findArchitectureEvaluationForConsumption(directiveRoot: string, consumptionPath: string) {
  for (const evaluationPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/09-post-consumption-evaluations",
    suffix: ".md",
  })) {
    try {
      const detail = readDirectiveArchitecturePostConsumptionEvaluationDetail({
        directiveRoot,
        evaluationPath,
      });
      if (detail.consumptionRelativePath === consumptionPath) {
        return {
          path: evaluationPath,
          detail,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findArchitectureReopenedStartForEvaluation(directiveRoot: string, evaluationPath: string) {
  for (const startPath of listFiles({
    directiveRoot,
    relativeDir: "architecture/01-bounded-starts",
    suffix: "-bounded-start.md",
  })) {
    try {
      const artifact = readDirectiveArchitectureBoundedStartArtifact({
        directiveRoot,
        startPath,
      });
      if (artifact.sourceAnalysisRef === evaluationPath) {
        return {
          path: startPath,
          artifact,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function buildArchitectureState(input: {
  directiveRoot: string;
  handoff?: DirectiveArchitectureHandoffArtifact | null;
  start?: DirectiveArchitectureBoundedStartArtifact | null;
  result?: DirectiveArchitectureBoundedResultArtifact | null;
  adoption?: { path: string; detail: DirectiveArchitectureAdoptionDetail } | null;
  implementationTarget?: { path: string; detail: DirectiveArchitectureImplementationTargetDetail } | null;
  implementationResult?: { path: string; detail: DirectiveArchitectureImplementationResultDetail } | null;
  retained?: { path: string; detail: DirectiveArchitectureRetentionDetail } | null;
  integration?: { path: string; detail: DirectiveArchitectureIntegrationRecordDetail } | null;
  consumption?: { path: string; detail: DirectiveArchitectureConsumptionRecordDetail } | null;
  evaluation?: { path: string; detail: DirectiveArchitecturePostConsumptionEvaluationDetail } | null;
  reopenedStart?: { path: string; artifact: DirectiveArchitectureBoundedStartArtifact } | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.architectureHandoffPath = input.handoff?.handoffRelativePath ?? null;
  linked.architectureBoundedStartPath = input.start?.startRelativePath ?? null;
  linked.architectureBoundedResultPath = input.result?.resultRelativePath ?? null;
  linked.architectureContinuationStartPath =
    input.result?.continuationStartExists ? input.result.continuationStartRelativePath : null;
  linked.architectureAdoptionPath = input.adoption?.path ?? null;
  linked.architectureImplementationTargetPath = input.implementationTarget?.path ?? null;
  linked.architectureImplementationResultPath = input.implementationResult?.path ?? null;
  linked.architectureRetainedPath = input.retained?.path ?? null;
  linked.architectureIntegrationRecordPath = input.integration?.path ?? null;
  linked.architectureConsumptionRecordPath = input.consumption?.path ?? null;
  linked.architectureEvaluationPath = input.evaluation?.path ?? null;
  linked.architectureReopenedStartPath = input.reopenedStart?.path ?? null;

  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.handoff?.discoveryRoutingRecordPath,
    label: "Discovery routing record",
  });
  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.start?.handoffStubPath,
    label: "Architecture handoff",
  });
  if (input.result && !input.result.decisionExists) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing Architecture closeout decision artifact: ${input.result.decisionRelativePath}`,
    );
  }
  if (input.evaluation?.detail.decision === "keep" && input.reopenedStart) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      "keep evaluation unexpectedly links to a reopened Architecture start",
    );
  }
  if (input.evaluation?.detail.decision === "reopen" && !input.reopenedStart) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      "architecture/01-bounded-starts/*-reopened-bounded-start.md",
    );
  }
  if (input.result?.verdict === "stay_experimental" && !input.result.continuationStartExists && !input.adoption) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      input.result.continuationStartRelativePath,
    );
  }
  if (input.result?.verdict === "adopt" && !input.adoption) {
    recordMissingExpectedArtifact({ missingExpectedArtifacts, inconsistentLinks }, "architecture/03-adopted/*.md");
  }
  if (input.adoption && !input.implementationTarget) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      "architecture/04-implementation-targets/*.md",
    );
  }
  if (input.implementationTarget && !input.implementationResult) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      "architecture/05-implementation-results/*.md",
    );
  }
  if (input.implementationResult && !input.retained) {
    recordMissingExpectedArtifact({ missingExpectedArtifacts, inconsistentLinks }, "architecture/06-retained/*.md");
  }
  if (input.retained && !input.integration) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      "architecture/07-integration-records/*.md",
    );
  }
  if (input.integration && !input.consumption) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      "architecture/08-consumption-records/*.md",
    );
  }
  if (input.consumption && !input.evaluation) {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      "architecture/09-post-consumption-evaluations/*.md",
    );
  }

  let currentStage = "architecture.handoff.pending_review";
  let nextLegalStep = "Explicitly approve the bounded Architecture start.";

  if (input.handoff && input.start && !input.result) {
    currentStage = "architecture.bounded_start.opened";
    nextLegalStep = "Explicitly record bounded closeout/result.";
  }
  if (input.result) {
    currentStage = `architecture.bounded_result.${input.result.verdict}`;
    nextLegalStep =
      input.result.verdict === "stay_experimental"
        ? "Explicitly continue the experimental Architecture slice or stop without auto-advancing."
        : "Explicitly adopt/materialize the bounded Architecture result.";
  }
  if (input.adoption) {
    currentStage = `architecture.adoption.${input.adoption.detail.finalStatus}`;
    nextLegalStep = "Explicitly create the implementation target.";
  }
  if (input.implementationTarget) {
    currentStage = "architecture.implementation_target.opened";
    nextLegalStep = "Explicitly record the implementation result.";
  }
  if (input.implementationResult) {
    currentStage = `architecture.implementation_result.${input.implementationResult.detail.outcome}`;
    nextLegalStep = "Explicitly confirm retention.";
  }
  if (input.retained) {
    currentStage = "architecture.retained.confirmed";
    nextLegalStep = "Explicitly create the integration record.";
  }
  if (input.integration) {
    currentStage = "architecture.integration_record.ready";
    nextLegalStep = "Explicitly record consumption.";
  }
  if (input.consumption) {
    currentStage = `architecture.consumption.${input.consumption.detail.outcome}`;
    nextLegalStep = "Explicitly evaluate the applied Architecture output after use.";
  }
  if (input.evaluation) {
    currentStage = `architecture.post_consumption_evaluation.${input.evaluation.detail.decision}`;
    nextLegalStep =
      input.evaluation.detail.decision === "reopen"
        ? input.reopenedStart
          ? "Explicitly continue or close the reopened bounded Architecture slice; no automatic move is open."
          : "Explicitly approve reopening one bounded Architecture slice."
        : "No automatic Architecture step is open; keep remains an explicit stop unless a new bounded pressure is introduced.";
  }

  return {
    currentStage,
    nextLegalStep,
    missingExpectedArtifacts,
    inconsistentLinks,
    linked,
    intentionallyUnbuiltDownstreamStages: [
      "automatic Architecture advancement",
      "Runtime execution from Architecture artifacts",
      "lifecycle orchestration",
    ],
  };
}

function buildArchitectureArtifactStage(input: {
  artifactKind: DirectiveWorkspaceArtifactKind;
  result?: DirectiveArchitectureBoundedResultArtifact | null;
  adoption?: { path: string; detail: DirectiveArchitectureAdoptionDetail } | null;
  implementationResult?: { path: string; detail: DirectiveArchitectureImplementationResultDetail } | null;
  consumption?: { path: string; detail: DirectiveArchitectureConsumptionRecordDetail } | null;
  evaluation?: { path: string; detail: DirectiveArchitecturePostConsumptionEvaluationDetail } | null;
}) {
  switch (input.artifactKind) {
    case "architecture_handoff":
      return {
        artifactStage: "architecture.handoff.pending_review",
        artifactNextLegalStep: "Explicitly approve the bounded Architecture start.",
      };
    case "architecture_bounded_start":
      return {
        artifactStage: "architecture.bounded_start.opened",
        artifactNextLegalStep: "Explicitly record bounded closeout/result.",
      };
    case "architecture_bounded_result":
      return {
        artifactStage: `architecture.bounded_result.${input.result?.verdict ?? "unknown"}`,
        artifactNextLegalStep:
          input.result?.verdict === "stay_experimental"
            ? "Explicitly continue the experimental Architecture slice or stop without auto-advancing."
            : "Explicitly adopt/materialize the bounded Architecture result.",
      };
    case "architecture_adoption":
      return {
        artifactStage: `architecture.adoption.${input.adoption?.detail.finalStatus ?? "unknown"}`,
        artifactNextLegalStep: "Explicitly create the implementation target.",
      };
    case "architecture_implementation_target":
      return {
        artifactStage: "architecture.implementation_target.opened",
        artifactNextLegalStep: "Explicitly record the implementation result.",
      };
    case "architecture_implementation_result":
      return {
        artifactStage: `architecture.implementation_result.${input.implementationResult?.detail.outcome ?? "unknown"}`,
        artifactNextLegalStep: "Explicitly confirm retention.",
      };
    case "architecture_retained":
      return {
        artifactStage: "architecture.retained.confirmed",
        artifactNextLegalStep: "Explicitly create the integration record.",
      };
    case "architecture_integration_record":
      return {
        artifactStage: "architecture.integration_record.ready",
        artifactNextLegalStep: "Explicitly record consumption.",
      };
    case "architecture_consumption_record":
      return {
        artifactStage: `architecture.consumption.${input.consumption?.detail.outcome ?? "unknown"}`,
        artifactNextLegalStep: "Explicitly evaluate the applied Architecture output after use.",
      };
    case "architecture_post_consumption_evaluation":
      return {
        artifactStage: `architecture.post_consumption_evaluation.${input.evaluation?.detail.decision ?? "unknown"}`,
        artifactNextLegalStep:
          input.evaluation?.detail.decision === "reopen"
            ? "Explicitly approve reopening one bounded Architecture slice."
            : "No automatic Architecture step is open; keep remains an explicit stop unless a new bounded pressure is introduced.",
      };
    default:
      return {
        artifactStage: "architecture.unknown",
        artifactNextLegalStep: "Inspect the bounded Architecture artifact chain directly.",
      };
  }
}

function resolveArchitectureFocusFromAnyPath(input: {
  directiveRoot: string;
  artifactPath: string;
}) {
  const relativePath = resolveDirectiveRelativePath(input.directiveRoot, input.artifactPath, "artifactPath");

  let handoff: DirectiveArchitectureHandoffArtifact | null = null;
  let start: DirectiveArchitectureBoundedStartArtifact | null = null;
  let result: DirectiveArchitectureBoundedResultArtifact | null = null;
  let adoption: { path: string; detail: DirectiveArchitectureAdoptionDetail } | null = null;
  let implementationTarget: { path: string; detail: DirectiveArchitectureImplementationTargetDetail } | null = null;
  let implementationResult: { path: string; detail: DirectiveArchitectureImplementationResultDetail } | null = null;
  let retained: { path: string; detail: DirectiveArchitectureRetentionDetail } | null = null;
  let integration: { path: string; detail: DirectiveArchitectureIntegrationRecordDetail } | null = null;
  let consumption: { path: string; detail: DirectiveArchitectureConsumptionRecordDetail } | null = null;
  let evaluation: { path: string; detail: DirectiveArchitecturePostConsumptionEvaluationDetail } | null = null;
  let reopenedStart: { path: string; artifact: DirectiveArchitectureBoundedStartArtifact } | null = null;
  let artifactKind: DirectiveWorkspaceArtifactKind = "unknown";

  if (relativePath.endsWith("-engine-handoff.md")) {
    handoff = readDirectiveArchitectureHandoffArtifact({
      directiveRoot: input.directiveRoot,
      handoffPath: relativePath,
    });
    artifactKind = "architecture_handoff";
    if (handoff.startExists) {
      start = readDirectiveArchitectureBoundedStartArtifact({
        directiveRoot: input.directiveRoot,
        startPath: handoff.startRelativePath as string,
      });
    }
  } else if (relativePath.endsWith("-bounded-start.md")) {
    start = readDirectiveArchitectureBoundedStartArtifact({
      directiveRoot: input.directiveRoot,
      startPath: relativePath,
    });
    artifactKind = "architecture_bounded_start";
    handoff = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: start.handoffStubPath,
      read: (handoffPath) => readDirectiveArchitectureHandoffArtifact({
        directiveRoot: input.directiveRoot,
        handoffPath,
      }),
    });
  } else if (relativePath.endsWith("-bounded-result.md")) {
    result = readDirectiveArchitectureBoundedResultArtifact({
      directiveRoot: input.directiveRoot,
      resultPath: relativePath,
    });
    artifactKind = "architecture_bounded_result";
    start = readDirectiveArchitectureBoundedStartArtifact({
      directiveRoot: input.directiveRoot,
      startPath: result.startRelativePath,
    });
    handoff = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: result.handoffStubPath,
      read: (handoffPath) => readDirectiveArchitectureHandoffArtifact({
        directiveRoot: input.directiveRoot,
        handoffPath,
      }),
    });
  } else if (relativePath.startsWith("architecture/03-adopted/")) {
    adoption = {
      path: relativePath,
      detail: readDirectiveArchitectureAdoptionDetail({
        directiveRoot: input.directiveRoot,
        adoptionPath: relativePath,
      }),
    };
    artifactKind = "architecture_adoption";
    ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
      directiveRoot: input.directiveRoot,
      adoptionDetail: adoption.detail,
    }));
  } else if (relativePath.startsWith("architecture/04-implementation-targets/")) {
    implementationTarget = {
      path: relativePath,
      detail: readDirectiveArchitectureImplementationTargetDetail({
        directiveRoot: input.directiveRoot,
        targetPath: relativePath,
      }),
    };
    artifactKind = "architecture_implementation_target";
    adoption = implementationTarget.detail.adoptionRelativePath
      ? {
          path: implementationTarget.detail.adoptionRelativePath,
          detail: readDirectiveArchitectureAdoptionDetail({
            directiveRoot: input.directiveRoot,
            adoptionPath: implementationTarget.detail.adoptionRelativePath,
          }),
        }
      : null;
    if (adoption) {
      ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
        directiveRoot: input.directiveRoot,
        adoptionDetail: adoption.detail,
      }));
    }
  } else if (relativePath.startsWith("architecture/05-implementation-results/")) {
    implementationResult = {
      path: relativePath,
      detail: readDirectiveArchitectureImplementationResultDetail({
        directiveRoot: input.directiveRoot,
        resultPath: relativePath,
      }),
    };
    artifactKind = "architecture_implementation_result";
    implementationTarget = findArchitectureImplementationTargetForAdoption(
      input.directiveRoot,
      implementationResult.detail.adoptionRelativePath,
    );
    adoption = implementationResult.detail.adoptionRelativePath
      ? {
          path: implementationResult.detail.adoptionRelativePath,
          detail: readDirectiveArchitectureAdoptionDetail({
            directiveRoot: input.directiveRoot,
            adoptionPath: implementationResult.detail.adoptionRelativePath,
          }),
        }
      : null;
    if (adoption) {
      ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
        directiveRoot: input.directiveRoot,
        adoptionDetail: adoption.detail,
      }));
    }
  } else if (relativePath.startsWith("architecture/06-retained/")) {
    retained = {
      path: relativePath,
      detail: readDirectiveArchitectureRetentionDetail({
        directiveRoot: input.directiveRoot,
        retainedPath: relativePath,
      }),
    };
    artifactKind = "architecture_retained";
    implementationResult = findArchitectureImplementationResultForTarget(
      input.directiveRoot,
      retained.detail.targetRelativePath,
    );
    implementationTarget = implementationResult
      ? findArchitectureImplementationTargetForAdoption(
          input.directiveRoot,
          implementationResult.detail.adoptionRelativePath,
        )
      : null;
    adoption = retained.detail.adoptionRelativePath
      ? {
          path: retained.detail.adoptionRelativePath,
          detail: readDirectiveArchitectureAdoptionDetail({
            directiveRoot: input.directiveRoot,
            adoptionPath: retained.detail.adoptionRelativePath,
          }),
        }
      : null;
    if (adoption) {
      ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
        directiveRoot: input.directiveRoot,
        adoptionDetail: adoption.detail,
      }));
    }
  } else if (relativePath.startsWith("architecture/07-integration-records/")) {
    integration = {
      path: relativePath,
      detail: readDirectiveArchitectureIntegrationRecordDetail({
        directiveRoot: input.directiveRoot,
        integrationPath: relativePath,
      }),
    };
    artifactKind = "architecture_integration_record";
    retained = findArchitectureRetentionForResult(
      input.directiveRoot,
      integration.detail.resultRelativePath,
    );
    adoption = integration.detail.adoptionRelativePath
      ? {
          path: integration.detail.adoptionRelativePath,
          detail: readDirectiveArchitectureAdoptionDetail({
            directiveRoot: input.directiveRoot,
            adoptionPath: integration.detail.adoptionRelativePath,
          }),
        }
      : null;
    if (adoption) {
      ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
        directiveRoot: input.directiveRoot,
        adoptionDetail: adoption.detail,
      }));
      implementationTarget = findArchitectureImplementationTargetForAdoption(
        input.directiveRoot,
        adoption.path,
      );
      implementationResult = implementationTarget
        ? findArchitectureImplementationResultForTarget(input.directiveRoot, implementationTarget.path)
        : null;
    }
  } else if (relativePath.startsWith("architecture/08-consumption-records/")) {
    consumption = {
      path: relativePath,
      detail: readDirectiveArchitectureConsumptionRecordDetail({
        directiveRoot: input.directiveRoot,
        consumptionPath: relativePath,
      }),
    };
    artifactKind = "architecture_consumption_record";
    integration = findArchitectureIntegrationForRetention(
      input.directiveRoot,
      consumption.detail.retainedRelativePath,
    );
    retained = consumption.detail.retainedRelativePath
      ? {
          path: consumption.detail.retainedRelativePath,
          detail: readDirectiveArchitectureRetentionDetail({
            directiveRoot: input.directiveRoot,
            retainedPath: consumption.detail.retainedRelativePath,
          }),
        }
      : null;
    adoption = consumption.detail.adoptionRelativePath
      ? {
          path: consumption.detail.adoptionRelativePath,
          detail: readDirectiveArchitectureAdoptionDetail({
            directiveRoot: input.directiveRoot,
            adoptionPath: consumption.detail.adoptionRelativePath,
          }),
        }
      : null;
    if (adoption) {
      ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
        directiveRoot: input.directiveRoot,
        adoptionDetail: adoption.detail,
      }));
      implementationTarget = findArchitectureImplementationTargetForAdoption(
        input.directiveRoot,
        adoption.path,
      );
      implementationResult = implementationTarget
        ? findArchitectureImplementationResultForTarget(input.directiveRoot, implementationTarget.path)
        : null;
    }
  } else if (relativePath.startsWith("architecture/09-post-consumption-evaluations/")) {
    evaluation = {
      path: relativePath,
      detail: readDirectiveArchitecturePostConsumptionEvaluationDetail({
        directiveRoot: input.directiveRoot,
        evaluationPath: relativePath,
      }),
    };
    artifactKind = "architecture_post_consumption_evaluation";
    consumption = evaluation.detail.consumptionRelativePath
      ? {
          path: evaluation.detail.consumptionRelativePath,
          detail: readDirectiveArchitectureConsumptionRecordDetail({
            directiveRoot: input.directiveRoot,
            consumptionPath: evaluation.detail.consumptionRelativePath,
          }),
        }
      : null;
    integration = evaluation.detail.integrationRelativePath
      ? {
          path: evaluation.detail.integrationRelativePath,
          detail: readDirectiveArchitectureIntegrationRecordDetail({
            directiveRoot: input.directiveRoot,
            integrationPath: evaluation.detail.integrationRelativePath,
          }),
        }
      : null;
    retained = evaluation.detail.retainedRelativePath
      ? {
          path: evaluation.detail.retainedRelativePath,
          detail: readDirectiveArchitectureRetentionDetail({
            directiveRoot: input.directiveRoot,
            retainedPath: evaluation.detail.retainedRelativePath,
          }),
        }
      : null;
    adoption = evaluation.detail.adoptionRelativePath
      ? {
          path: evaluation.detail.adoptionRelativePath,
          detail: readDirectiveArchitectureAdoptionDetail({
            directiveRoot: input.directiveRoot,
            adoptionPath: evaluation.detail.adoptionRelativePath,
          }),
        }
      : null;
    if (adoption) {
      ({ result, start, handoff } = readArchitectureUpstreamChainFromAdoption({
        directiveRoot: input.directiveRoot,
        adoptionDetail: adoption.detail,
      }));
      implementationTarget = findArchitectureImplementationTargetForAdoption(
        input.directiveRoot,
        adoption.path,
      );
      implementationResult = implementationTarget
        ? findArchitectureImplementationResultForTarget(input.directiveRoot, implementationTarget.path)
        : null;
    }
    reopenedStart = evaluation.detail.decision === "reopen"
      ? findArchitectureReopenedStartForEvaluation(input.directiveRoot, relativePath)
      : null;
  } else {
    throw new Error(`unsupported Architecture artifact path: ${relativePath}`);
  }

  if (start && start.resultExists && !result) {
    result = readDirectiveArchitectureBoundedResultArtifact({
      directiveRoot: input.directiveRoot,
      resultPath: start.resultRelativePath,
    });
  }
  if (result && !adoption) {
    adoption = findArchitectureAdoptionForResult(input.directiveRoot, result.resultRelativePath);
  }
  if (adoption && !implementationTarget) {
    implementationTarget = findArchitectureImplementationTargetForAdoption(input.directiveRoot, adoption.path);
  }
  if (implementationTarget && !implementationResult) {
    implementationResult = findArchitectureImplementationResultForTarget(
      input.directiveRoot,
      implementationTarget.path,
    );
  }
  if (implementationResult && !retained) {
    retained = findArchitectureRetentionForResult(input.directiveRoot, implementationResult.path);
  }
  if (retained && !integration) {
    integration = findArchitectureIntegrationForRetention(input.directiveRoot, retained.path);
  }
  if (integration && !consumption) {
    consumption = findArchitectureConsumptionForIntegration(input.directiveRoot, integration.path);
  }
  if (consumption && !evaluation) {
    evaluation = findArchitectureEvaluationForConsumption(input.directiveRoot, consumption.path);
  }
  if (evaluation?.detail.decision === "reopen" && !reopenedStart) {
    reopenedStart = findArchitectureReopenedStartForEvaluation(input.directiveRoot, evaluation.path);
  }

  const candidateId =
    evaluation?.detail.candidateId
    ?? consumption?.detail.candidateId
    ?? integration?.detail.candidateId
    ?? retained?.detail.candidateId
    ?? implementationResult?.detail.candidateId
    ?? implementationTarget?.detail.candidateId
    ?? adoption?.detail.candidateId
    ?? result?.candidateId
    ?? start?.candidateId
    ?? handoff?.candidateId
    ?? null;
  const candidateName =
    evaluation?.detail.candidateName
    ?? consumption?.detail.candidateName
    ?? integration?.detail.candidateName
    ?? retained?.detail.candidateName
    ?? implementationResult?.detail.candidateName
    ?? implementationTarget?.detail.candidateName
    ?? adoption?.detail.candidateName
    ?? result?.candidateName
    ?? start?.candidateName
    ?? handoff?.title
    ?? null;

  return {
    artifactKind,
    candidateId,
    candidateName,
    result,
    adoption,
    implementationResult,
    consumption,
    evaluation,
    ...buildArchitectureState({
      directiveRoot: input.directiveRoot,
      handoff,
      start,
      result,
      adoption,
      implementationTarget,
      implementationResult,
      retained,
      integration,
      consumption,
      evaluation,
      reopenedStart,
    }),
  };
}

function buildRuntimeState(input: {
  directiveRoot: string;
  followUp: DirectiveRuntimeFollowUpArtifact | null;
  runtimeRecord: GenericRuntimeRecordArtifact | null;
  runtimeProof: GenericRuntimeProofArtifact | null;
  capabilityBoundary: GenericRuntimeRuntimeCapabilityBoundaryArtifact | null;
  promotionReadiness: GenericRuntimePromotionReadinessArtifact | null;
  callableIntegration: ReturnType<typeof readGenericCallableIntegrationArtifact> | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeFollowUpPath = input.followUp?.followUpRelativePath ?? input.runtimeRecord?.linkedFollowUpRecord ?? null;
  linked.runtimeRecordPath = input.runtimeRecord?.runtimeRecordRelativePath ?? input.runtimeProof?.linkedRuntimeRecordPath ?? null;
  linked.runtimeProofPath = input.runtimeProof?.runtimeProofRelativePath ?? input.runtimeRecord?.runtimeProofRelativePath ?? null;
  linked.runtimeRuntimeCapabilityBoundaryPath =
    input.capabilityBoundary?.runtimeRuntimeCapabilityBoundaryPath
    ?? input.runtimeProof?.runtimeRuntimeCapabilityBoundaryPath
    ?? input.runtimeRecord?.runtimeRuntimeCapabilityBoundaryPath
    ?? input.callableIntegration?.runtimeRuntimeCapabilityBoundaryPath
    ?? null;
  linked.runtimePromotionReadinessPath =
    input.promotionReadiness?.promotionReadinessPath
    ?? inferRuntimePromotionReadinessPathFromCapabilityBoundary({
      directiveRoot: input.directiveRoot,
      capabilityBoundaryPath:
        input.capabilityBoundary?.runtimeRuntimeCapabilityBoundaryPath
        ?? input.runtimeProof?.runtimeRuntimeCapabilityBoundaryPath
        ?? input.runtimeRecord?.runtimeRuntimeCapabilityBoundaryPath
        ?? input.callableIntegration?.runtimeRuntimeCapabilityBoundaryPath
        ?? null,
    })
    ?? null;
  linked.runtimeCallableStubPath =
    input.callableIntegration?.callableRelativePath
    ?? input.runtimeRecord?.callableStubPath
    ?? input.runtimeProof?.callableStubPath
    ?? input.capabilityBoundary?.linkedCallableStubPath
    ?? input.promotionReadiness?.linkedCallableStubPath
    ?? null;
  linked.discoveryRoutingPath =
    input.followUp?.linkedHandoffPath
    ?? input.runtimeRecord?.linkedRoutingPath
    ?? input.runtimeProof?.linkedRoutingPath
    ?? null;
  linked.architectureIntegrationRecordPath =
    input.callableIntegration?.integrationRecordPath
    ?? input.runtimeRecord?.sourceIntegrationRecordPath
    ?? null;

  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: linked.discoveryRoutingPath,
    label: "Discovery routing record",
  });
  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.followUp?.linkedHandoffPath,
    label: "Discovery routing record",
  });
  if (input.followUp && !input.runtimeRecord && input.followUp.currentStatus === "pending_review") {
    recordMissingExpectedArtifact(
      { missingExpectedArtifacts, inconsistentLinks },
      input.followUp.runtimeRecordRelativePath,
    );
  }
  if (input.runtimeRecord?.kind === "follow_up_review" && !input.runtimeProof && input.runtimeRecord.currentStatus === "pending_proof_boundary") {
    if (input.runtimeRecord.runtimeProofRelativePath) {
      recordMissingExpectedArtifact(
        { missingExpectedArtifacts, inconsistentLinks },
        input.runtimeRecord.runtimeProofRelativePath,
      );
    }
  }
  if (
    input.runtimeProof?.kind === "callable_integration"
    && input.runtimeProof.promotionStatus === "ready_for_bounded_runtime_conversion"
    && !input.capabilityBoundary
  ) {
    recordMissingExpectedArtifact({ missingExpectedArtifacts, inconsistentLinks }, "runtime/04-capability-boundaries/*.md");
  }
  if (input.runtimeRecord?.kind === "follow_up_review" && !input.followUp) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      "Runtime follow-up review record is missing its linked follow-up artifact",
    );
  }
  if (
    input.runtimeRecord?.kind === "callable_integration_record"
    && input.runtimeRecord.callableStubPath
    && !fileExistsInDirectiveWorkspace(input.directiveRoot, input.runtimeRecord.callableStubPath)
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked callable stub: ${input.runtimeRecord.callableStubPath}`,
    );
  }
  if (
    input.runtimeRecord?.kind === "callable_integration_record"
    && input.runtimeRecord.sourceIntegrationRecordPath
    && !fileExistsInDirectiveWorkspace(input.directiveRoot, input.runtimeRecord.sourceIntegrationRecordPath)
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Architecture integration record: ${input.runtimeRecord.sourceIntegrationRecordPath}`,
    );
  }
  if (input.runtimeProof?.kind === "follow_up_review" && !input.runtimeRecord) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      "Runtime proof artifact is missing its linked Runtime v0 record",
    );
  }
  if (input.runtimeProof?.kind === "callable_integration" && !input.runtimeRecord) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      "Runtime proof artifact is missing its linked Runtime v0 record",
    );
  }
  if (input.capabilityBoundary?.linkedRuntimeProofPath && !input.runtimeProof) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Runtime proof artifact: ${input.capabilityBoundary.linkedRuntimeProofPath}`,
    );
  }
  if (input.capabilityBoundary?.linkedRuntimeRecordPath && !input.runtimeRecord) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Runtime record: ${input.capabilityBoundary.linkedRuntimeRecordPath}`,
    );
  }
  if (input.promotionReadiness?.linkedCapabilityBoundaryPath && !input.capabilityBoundary) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Runtime runtime capability boundary: ${input.promotionReadiness.linkedCapabilityBoundaryPath}`,
    );
  }
  if (input.promotionReadiness?.linkedRuntimeProofPath && !input.runtimeProof) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Runtime proof artifact: ${input.promotionReadiness.linkedRuntimeProofPath}`,
    );
  }
  if (input.promotionReadiness?.linkedRuntimeRecordPath && !input.runtimeRecord) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Runtime record: ${input.promotionReadiness.linkedRuntimeRecordPath}`,
    );
  }
  if (
    input.promotionReadiness?.linkedCallableStubPath
    && !fileExistsInDirectiveWorkspace(input.directiveRoot, input.promotionReadiness.linkedCallableStubPath)
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked callable stub: ${input.promotionReadiness.linkedCallableStubPath}`,
    );
  }
  if (input.callableIntegration?.runtimeRecordRelativePath && !input.runtimeRecord) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked Runtime record: ${input.callableIntegration.runtimeRecordRelativePath}`,
    );
  }
  if (
    input.capabilityBoundary?.linkedCallableStubPath
    && !fileExistsInDirectiveWorkspace(input.directiveRoot, input.capabilityBoundary.linkedCallableStubPath)
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `missing linked callable stub: ${input.capabilityBoundary.linkedCallableStubPath}`,
    );
  }

  let currentStage = "runtime.follow_up.pending_review";
  let nextLegalStep = "Explicitly review the Runtime follow-up and approve one bounded Runtime record if justified.";

  if (input.runtimeRecord) {
    currentStage =
      input.runtimeRecord.kind === "follow_up_review"
        ? "runtime.record.pending_proof_boundary"
        : "runtime.record.callable_boundary_defined";
    nextLegalStep =
      input.runtimeRecord.kind === "follow_up_review"
        ? "Explicitly review the Runtime v0 record and approve one bounded Runtime proof artifact if justified."
        : "No automatic Runtime step is open; callable implementation, promotion, and host work remain intentionally unopened.";
  }
  if (input.runtimeProof) {
    currentStage =
      input.runtimeProof.kind === "follow_up_review"
        ? "runtime.proof.opened"
        : `runtime.proof.${input.runtimeProof.promotionStatus ?? "opened"}`;
    nextLegalStep =
      input.runtimeProof.kind === "follow_up_review"
        ? "Explicitly review and, if justified, open one bounded runtime capability boundary; execution and host integration remain closed."
        : "Explicitly review the bounded runtime capability boundary only if later Runtime conversion work is intentionally reopened.";
  }
  if (input.capabilityBoundary) {
    const promotionReadinessEligible = !input.callableIntegration && !input.capabilityBoundary.linkedCallableStubPath;
    currentStage = "runtime.runtime_capability_boundary.opened";
    nextLegalStep =
      promotionReadinessEligible
        ? "Explicitly review the bounded runtime capability boundary and, if justified, open one non-executing promotion-readiness artifact; host-facing promotion and runtime execution remain closed."
        : "No automatic Runtime step is open; callable implementation, host integration, and runtime execution remain intentionally unopened.";
  }
  if (input.promotionReadiness) {
    currentStage = "runtime.promotion_readiness.opened";
    nextLegalStep =
      "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
  }

  return {
    currentStage,
    nextLegalStep,
    missingExpectedArtifacts,
    inconsistentLinks,
    linked,
    intentionallyUnbuiltDownstreamStages: [
      "runtime execution",
      "host integration",
      "callable implementation",
      "host-facing promotion",
      "promotion automation",
    ],
  };
}

function buildRuntimeArtifactStage(input: {
  artifactKind: DirectiveWorkspaceArtifactKind;
  runtimeRecord: GenericRuntimeRecordArtifact | null;
  runtimeProof: GenericRuntimeProofArtifact | null;
  capabilityBoundary: GenericRuntimeRuntimeCapabilityBoundaryArtifact | null;
  callableIntegration: ReturnType<typeof readGenericCallableIntegrationArtifact> | null;
}) {
  switch (input.artifactKind) {
    case "runtime_follow_up":
      return {
        artifactStage: "runtime.follow_up.pending_review",
        artifactNextLegalStep: "Explicitly review the Runtime follow-up and approve one bounded Runtime record if justified.",
      };
    case "runtime_record_follow_up_review":
      return {
        artifactStage: "runtime.record.pending_proof_boundary",
        artifactNextLegalStep: "Explicitly review the Runtime v0 record and approve one bounded Runtime proof artifact if justified.",
      };
    case "runtime_record_callable_integration":
      return {
        artifactStage: "runtime.record.callable_boundary_defined",
        artifactNextLegalStep: "No automatic Runtime step is open; callable implementation, promotion, and host work remain intentionally unopened.",
      };
    case "runtime_proof_follow_up_review":
      return {
        artifactStage: "runtime.proof.opened",
        artifactNextLegalStep: "Explicitly review and, if justified, open one bounded runtime capability boundary; execution and host integration remain closed.",
      };
    case "runtime_proof_callable_integration":
      return {
        artifactStage: `runtime.proof.${input.runtimeProof?.promotionStatus ?? "opened"}`,
        artifactNextLegalStep: "Explicitly review the bounded runtime capability boundary only if later Runtime conversion work is intentionally reopened.",
      };
    case "runtime_runtime_capability_boundary":
      return {
        artifactStage: "runtime.runtime_capability_boundary.opened",
        artifactNextLegalStep:
          (!input.callableIntegration && !input.capabilityBoundary?.linkedCallableStubPath)
            ? "Explicitly review the bounded runtime capability boundary and, if justified, open one non-executing promotion-readiness artifact; host-facing promotion and runtime execution remain closed."
            : "No automatic Runtime step is open; callable implementation, host integration, and runtime execution remain intentionally unopened.",
      };
    case "runtime_promotion_readiness":
      return {
        artifactStage: "runtime.promotion_readiness.opened",
        artifactNextLegalStep: "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.",
      };
    case "runtime_callable_integration":
      return {
        artifactStage: "runtime.callable_stub.not_implemented",
        artifactNextLegalStep: "No automatic Runtime step is open; bounded runtime conversion remains explicit and non-executing.",
      };
    default:
      return {
        artifactStage: "runtime.unknown",
        artifactNextLegalStep: "Inspect the Runtime artifact chain directly.",
      };
  }
}

function resolveRuntimeFocusFromAnyPath(input: {
  directiveRoot: string;
  artifactPath: string;
}) {
  const relativePath = resolveDirectiveRelativePath(input.directiveRoot, input.artifactPath, "artifactPath");

  let followUp: DirectiveRuntimeFollowUpArtifact | null = null;
  let runtimeRecord: GenericRuntimeRecordArtifact | null = null;
  let runtimeProof: GenericRuntimeProofArtifact | null = null;
  let capabilityBoundary: GenericRuntimeRuntimeCapabilityBoundaryArtifact | null = null;
  let promotionReadiness: GenericRuntimePromotionReadinessArtifact | null = null;
  let callableIntegration: ReturnType<typeof readGenericCallableIntegrationArtifact> | null = null;
  let artifactKind: DirectiveWorkspaceArtifactKind = "unknown";

  if (relativePath.startsWith("runtime/follow-up/")) {
    followUp = readDirectiveRuntimeFollowUpArtifact({
      directiveRoot: input.directiveRoot,
      followUpPath: relativePath,
    });
    artifactKind = "runtime_follow_up";
    if (followUp.runtimeRecordExists) {
      runtimeRecord = readGenericRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath: followUp.runtimeRecordRelativePath,
      });
    }
  } else if (relativePath.startsWith("runtime/02-records/")) {
    runtimeRecord = readGenericRuntimeRecordArtifact({
      directiveRoot: input.directiveRoot,
      runtimeRecordPath: relativePath,
    });
    artifactKind =
      runtimeRecord.kind === "follow_up_review"
        ? "runtime_record_follow_up_review"
        : "runtime_record_callable_integration";
    followUp = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: runtimeRecord.linkedFollowUpRecord,
      read: (followUpPath) => readDirectiveRuntimeFollowUpArtifact({
        directiveRoot: input.directiveRoot,
        followUpPath,
      }),
    });
  } else if (relativePath.startsWith("runtime/03-proof/")) {
    runtimeProof = readGenericRuntimeProofArtifact({
      directiveRoot: input.directiveRoot,
      runtimeProofPath: relativePath,
    });
    artifactKind =
      runtimeProof.kind === "follow_up_review"
        ? "runtime_proof_follow_up_review"
        : "runtime_proof_callable_integration";
    runtimeRecord = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: runtimeProof.linkedRuntimeRecordPath,
      read: (runtimeRecordPath) => readGenericRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath,
      }),
    });
    followUp = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: runtimeProof.linkedFollowUpPath,
      read: (followUpPath) => readDirectiveRuntimeFollowUpArtifact({
        directiveRoot: input.directiveRoot,
        followUpPath,
      }),
    });
  } else if (relativePath.startsWith("runtime/04-capability-boundaries/")) {
    capabilityBoundary = readGenericRuntimeRuntimeCapabilityBoundaryArtifact({
      directiveRoot: input.directiveRoot,
      capabilityBoundaryPath: relativePath,
    });
    artifactKind = "runtime_runtime_capability_boundary";
    runtimeProof = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: capabilityBoundary.linkedRuntimeProofPath,
      read: (runtimeProofPath) => readGenericRuntimeProofArtifact({
        directiveRoot: input.directiveRoot,
        runtimeProofPath,
      }),
    });
    runtimeRecord = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: capabilityBoundary.linkedRuntimeRecordPath,
      read: (runtimeRecordPath) => readGenericRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath,
      }),
    });
    if (capabilityBoundary.linkedCallableStubPath && fileExistsInDirectiveWorkspace(input.directiveRoot, capabilityBoundary.linkedCallableStubPath)) {
      callableIntegration = readGenericCallableIntegrationArtifact({
        directiveRoot: input.directiveRoot,
        callablePath: capabilityBoundary.linkedCallableStubPath,
      });
    }
  } else if (relativePath.startsWith("runtime/05-promotion-readiness/")) {
    promotionReadiness = readGenericRuntimePromotionReadinessArtifact({
      directiveRoot: input.directiveRoot,
      promotionReadinessPath: relativePath,
    });
    artifactKind = "runtime_promotion_readiness";
    capabilityBoundary = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: promotionReadiness.linkedCapabilityBoundaryPath,
      read: (capabilityBoundaryPath) => readGenericRuntimeRuntimeCapabilityBoundaryArtifact({
        directiveRoot: input.directiveRoot,
        capabilityBoundaryPath,
      }),
    });
    runtimeProof = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: promotionReadiness.linkedRuntimeProofPath,
      read: (runtimeProofPath) => readGenericRuntimeProofArtifact({
        directiveRoot: input.directiveRoot,
        runtimeProofPath,
      }),
    });
    runtimeRecord = readLinkedArtifactIfPresent({
      directiveRoot: input.directiveRoot,
      relativePath: promotionReadiness.linkedRuntimeRecordPath,
      read: (runtimeRecordPath) => readGenericRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath,
      }),
    });
    if (
      promotionReadiness.linkedCallableStubPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, promotionReadiness.linkedCallableStubPath)
    ) {
      callableIntegration = readGenericCallableIntegrationArtifact({
        directiveRoot: input.directiveRoot,
        callablePath: promotionReadiness.linkedCallableStubPath,
      });
    }
  } else if (relativePath.startsWith("runtime/01-callable-integrations/")) {
    callableIntegration = readGenericCallableIntegrationArtifact({
      directiveRoot: input.directiveRoot,
      callablePath: relativePath,
    });
    artifactKind = "runtime_callable_integration";
    if (callableIntegration.runtimeRecordRelativePath && fileExistsInDirectiveWorkspace(input.directiveRoot, callableIntegration.runtimeRecordRelativePath)) {
      runtimeRecord = readGenericRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath: callableIntegration.runtimeRecordRelativePath,
      });
    }
    if (callableIntegration.runtimeProofRelativePath && fileExistsInDirectiveWorkspace(input.directiveRoot, callableIntegration.runtimeProofRelativePath)) {
      runtimeProof = readGenericRuntimeProofArtifact({
        directiveRoot: input.directiveRoot,
        runtimeProofPath: callableIntegration.runtimeProofRelativePath,
      });
    }
    if (
      callableIntegration.runtimeRuntimeCapabilityBoundaryPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, callableIntegration.runtimeRuntimeCapabilityBoundaryPath)
    ) {
      capabilityBoundary = readGenericRuntimeRuntimeCapabilityBoundaryArtifact({
        directiveRoot: input.directiveRoot,
        capabilityBoundaryPath: callableIntegration.runtimeRuntimeCapabilityBoundaryPath,
      });
    }
  } else {
    throw new Error(`unsupported Runtime artifact path: ${relativePath}`);
  }

  if (runtimeRecord?.linkedFollowUpRecord && !followUp && fileExistsInDirectiveWorkspace(input.directiveRoot, runtimeRecord.linkedFollowUpRecord)) {
    followUp = readDirectiveRuntimeFollowUpArtifact({
      directiveRoot: input.directiveRoot,
      followUpPath: runtimeRecord.linkedFollowUpRecord,
    });
  }
  if (runtimeRecord?.runtimeProofRelativePath && !runtimeProof && fileExistsInDirectiveWorkspace(input.directiveRoot, runtimeRecord.runtimeProofRelativePath)) {
    runtimeProof = readGenericRuntimeProofArtifact({
      directiveRoot: input.directiveRoot,
      runtimeProofPath: runtimeRecord.runtimeProofRelativePath,
    });
  }
  if (
    runtimeProof?.runtimeRuntimeCapabilityBoundaryPath
    && !capabilityBoundary
    && fileExistsInDirectiveWorkspace(input.directiveRoot, runtimeProof.runtimeRuntimeCapabilityBoundaryPath)
  ) {
    capabilityBoundary = readGenericRuntimeRuntimeCapabilityBoundaryArtifact({
      directiveRoot: input.directiveRoot,
      capabilityBoundaryPath: runtimeProof.runtimeRuntimeCapabilityBoundaryPath,
    });
  }
  if (!capabilityBoundary) {
    const inferredCapabilityBoundaryPath = inferRuntimeRuntimeCapabilityBoundaryPathFromProof({
      directiveRoot: input.directiveRoot,
      runtimeProofRelativePath: runtimeProof?.runtimeProofRelativePath ?? runtimeRecord?.runtimeProofRelativePath ?? null,
    });
    if (inferredCapabilityBoundaryPath) {
      capabilityBoundary = readGenericRuntimeRuntimeCapabilityBoundaryArtifact({
        directiveRoot: input.directiveRoot,
        capabilityBoundaryPath: inferredCapabilityBoundaryPath,
      });
    }
  }
  if (!promotionReadiness) {
    const inferredPromotionReadinessPath = inferRuntimePromotionReadinessPathFromCapabilityBoundary({
      directiveRoot: input.directiveRoot,
      capabilityBoundaryPath: capabilityBoundary?.runtimeRuntimeCapabilityBoundaryPath ?? null,
    });
    if (inferredPromotionReadinessPath) {
      promotionReadiness = readGenericRuntimePromotionReadinessArtifact({
        directiveRoot: input.directiveRoot,
        promotionReadinessPath: inferredPromotionReadinessPath,
      });
    }
  }

  const candidateId =
    promotionReadiness?.candidateId
    ?? capabilityBoundary?.candidateId
    ?? runtimeProof?.candidateId
    ?? runtimeRecord?.candidateId
    ?? followUp?.candidateId
    ?? callableIntegration?.candidateId
    ?? null;
  const candidateName =
    promotionReadiness?.candidateName
    ?? runtimeProof?.candidateName
    ?? runtimeRecord?.candidateName
    ?? followUp?.candidateName
    ?? (capabilityBoundary?.title
      ? capabilityBoundary.title
        .replace(/^Runtime V0 Runtime Capability Boundary:\s*/u, "")
        .replace(/\s+\(\d{4}-\d{2}-\d{2}\)\s*$/u, "")
        .trim()
      : null)
    ?? null;

  return {
    artifactKind,
    candidateId,
    candidateName,
    runtimeRecord,
    runtimeProof,
    capabilityBoundary,
    promotionReadiness,
    callableIntegration,
    ...buildRuntimeState({
      directiveRoot: input.directiveRoot,
      followUp,
      runtimeRecord,
      runtimeProof,
      capabilityBoundary,
      promotionReadiness,
      callableIntegration,
    }),
  };
}

function buildOverviewAnchors(directiveRoot: string): DirectiveWorkspaceAnchorSummary[] {
  const candidates: string[] = [];

  const latestArchitectureRoute = listFiles({
    directiveRoot,
    relativeDir: "discovery/routing-log",
    suffix: "-routing-record.md",
  }).find((relativePath) => {
    try {
      const artifact = readDirectiveDiscoveryRoutingArtifact({
        directiveRoot,
        routingPath: relativePath,
      });
      return artifact.routeDestination === "architecture" && artifact.routingDate >= "2026-03-25";
    } catch {
      return false;
    }
  });
  if (latestArchitectureRoute) candidates.push(latestArchitectureRoute);

  const latestRuntimeRoute = listFiles({
    directiveRoot,
    relativeDir: "discovery/routing-log",
    suffix: "-routing-record.md",
  }).find((relativePath) => {
    try {
      const artifact = readDirectiveDiscoveryRoutingArtifact({
        directiveRoot,
        routingPath: relativePath,
      });
      return artifact.routeDestination === "runtime" && artifact.routingDate >= "2026-03-25";
    } catch {
      return false;
    }
  });
  if (latestRuntimeRoute) candidates.push(latestRuntimeRoute);

  const latestArchitectureEvaluation = listFiles({
    directiveRoot,
    relativeDir: "architecture/09-post-consumption-evaluations",
    suffix: "-evaluation.md",
  })[0];
  if (latestArchitectureEvaluation) candidates.push(latestArchitectureEvaluation);

  const latestRuntimeProof = listFiles({
    directiveRoot,
    relativeDir: "runtime/03-proof",
    suffix: "-proof.md",
  })[0];
  if (latestRuntimeProof) candidates.push(latestRuntimeProof);

  const latestRuntimeCapabilityBoundary = listFiles({
    directiveRoot,
    relativeDir: "runtime/04-capability-boundaries",
    suffix: "-runtime-capability-boundary.md",
  })[0];
  if (latestRuntimeCapabilityBoundary) candidates.push(latestRuntimeCapabilityBoundary);

  const latestRuntimePromotionReadiness = listFiles({
    directiveRoot,
    relativeDir: "runtime/05-promotion-readiness",
    suffix: "-promotion-readiness.md",
  })[0];
  if (latestRuntimePromotionReadiness) candidates.push(latestRuntimePromotionReadiness);

  return candidates
    .map((artifactPath) => {
      try {
        const focus = resolveDirectiveWorkspaceState({
          directiveRoot,
          artifactPath,
          includeAnchors: false,
        }).focus;
        if (!focus) {
          return null;
        }
        const label =
          focus.lane === "discovery"
            ? `Discovery anchor: ${focus.candidateName ?? focus.artifactPath}`
            : focus.lane === "architecture"
              ? `Architecture anchor: ${focus.candidateName ?? focus.artifactPath}`
              : focus.lane === "runtime"
                ? `Runtime anchor: ${focus.candidateName ?? focus.artifactPath}`
                : `Product anchor: ${focus.artifactPath}`;
        return {
          label,
          artifactPath: focus.artifactPath,
          lane: focus.lane,
          currentStage: focus.currentStage,
          nextLegalStep: focus.nextLegalStep,
          candidateId: focus.candidateId,
          candidateName: focus.candidateName,
        } satisfies DirectiveWorkspaceAnchorSummary;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is DirectiveWorkspaceAnchorSummary => Boolean(entry));
}

function resolveDiscoveryFocus(input: {
  directiveRoot: string;
  artifactPath: string;
}) {
  const relativePath = resolveDirectiveRelativePath(input.directiveRoot, input.artifactPath, "artifactPath");
  const routing = readDirectiveDiscoveryRoutingArtifact({
    directiveRoot: input.directiveRoot,
    routingPath: relativePath,
  });
  const queueEntry = findQueueEntryByCandidateId(input.directiveRoot, routing.candidateId);
  const engineRun = findLatestEngineRunByCandidateId(input.directiveRoot, routing.candidateId);
  const linkedArtifacts = zeroLinkedArtifacts();
  linkedArtifacts.discoveryIntakePath = routing.linkedIntakeRecord;
  linkedArtifacts.discoveryTriagePath = routing.linkedTriageRecord;
  linkedArtifacts.discoveryRoutingPath = routing.routingRelativePath;
  linkedArtifacts.engineRunRecordPath = routing.engineRunRecordPath;
  linkedArtifacts.engineRunReportPath = routing.engineRunReportPath;

  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];
  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: routing.linkedIntakeRecord,
    label: "Discovery intake record",
  });
  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: routing.linkedTriageRecord,
    label: "Discovery triage record",
  });
  recordExpectedArtifactIfMissing({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: routing.requiredNextArtifact,
  });
  if (queueEntry?.routing_target && queueEntry.routing_target !== routing.routeDestination) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `queue routing target "${queueEntry.routing_target}" does not match Discovery route "${routing.routeDestination}"`,
    );
  }
  if (
    engineRun?.record.selectedLane?.laneId
    && engineRun.record.selectedLane.laneId !== routing.routeDestination
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `Engine selected lane "${engineRun.record.selectedLane.laneId}" does not match Discovery route "${routing.routeDestination}"`,
    );
  }

  let downstream: DirectiveWorkspaceResolvedFocus | null = null;
  if (routing.downstreamStubRelativePath) {
    try {
      downstream = resolveDirectiveWorkspaceState({
        directiveRoot: input.directiveRoot,
        artifactPath: routing.downstreamStubRelativePath,
        includeAnchors: false,
      }).focus;
    } catch (error) {
      downstream = null;
      const message = error instanceof Error ? error.message : "unknown downstream resolution failure";
      recordInconsistentLink(
        { missingExpectedArtifacts, inconsistentLinks },
        `unable to resolve downstream artifact "${routing.downstreamStubRelativePath}": ${message}`,
      );
    }
  }
  if (downstream && downstream.lane !== routing.routeDestination) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `downstream artifact lane "${downstream.lane}" does not match Discovery route "${routing.routeDestination}"`,
    );
  }

  const currentStage = downstream?.currentStage ?? `discovery.route.${routing.routeDestination}`;
  const nextLegalStep = downstream?.nextLegalStep
    ?? (routing.routeDestination === "architecture"
      ? "Explicitly approve the bounded Architecture handoff/start boundary."
      : routing.routeDestination === "runtime"
        ? "Explicitly approve the bounded Runtime follow-up boundary."
        : "Keep the source in Discovery until the adoption target becomes clearer.");

  mergeNonNullLinkedArtifacts(linkedArtifacts, downstream?.linkedArtifacts);

  return finalizeResolvedFocus({
    ok: true,
    directiveRoot: input.directiveRoot,
    artifactPath: relativePath,
    artifactKind: "discovery_routing_record" as const,
    lane: "discovery" as const,
    candidateId: routing.candidateId,
    candidateName: routing.candidateName,
    artifactStage: `discovery.route.${routing.routeDestination}`,
    artifactNextLegalStep:
      routing.routeDestination === "architecture"
        ? "Explicitly approve the bounded Architecture handoff/start boundary."
        : routing.routeDestination === "runtime"
          ? "Explicitly approve the bounded Runtime follow-up boundary."
          : "Keep the source in Discovery until the adoption target becomes clearer.",
    currentStage,
    nextLegalStep,
    routeTarget: routing.routeDestination,
    statusGate: routing.decisionState,
    missingExpectedArtifacts,
    inconsistentLinks,
    intentionallyUnbuiltDownstreamStages: [
      "automatic downstream advancement",
      "runtime execution",
      "lifecycle orchestration",
    ],
    linkedArtifacts,
    discovery: {
      queueStatus: queueEntry?.status ?? null,
      routingDecision: routing.decisionState,
      usefulnessLevel: routing.usefulnessLevel,
      usefulnessRationale: routing.usefulnessRationale,
      requiredNextArtifact: routing.requiredNextArtifact,
    },
    engine: {
      runId: engineRun?.record.runId ?? routing.engineRunId,
      selectedLane: engineRun?.record.selectedLane?.laneId ?? routing.routeDestination,
      decisionState: engineRun?.record.decision?.decisionState ?? routing.decisionState,
      proofKind: engineRun?.record.proofPlan?.proofKind ?? null,
      nextAction: engineRun?.record.integrationProposal?.nextAction ?? null,
    },
  } satisfies Omit<DirectiveWorkspaceResolvedFocus, "integrityState">);
}

function resolveEngineFocus(input: {
  directiveRoot: string;
  artifactPath: string;
}) {
  const relativePath = resolveDirectiveRelativePath(input.directiveRoot, input.artifactPath, "artifactPath");
  const absolutePath = path.join(input.directiveRoot, relativePath);
  const record = JSON.parse(readUtf8(absolutePath)) as StoredDirectiveEngineRunRecord;
  const queueEntry = findQueueEntryByCandidateId(input.directiveRoot, record.candidate.candidateId);

  const linkedArtifacts = zeroLinkedArtifacts();
  linkedArtifacts.engineRunRecordPath = relativePath;
  linkedArtifacts.engineRunReportPath = fileExistsInDirectiveWorkspace(input.directiveRoot, relativePath.replace(/\.json$/i, ".md"))
    ? relativePath.replace(/\.json$/i, ".md")
    : null;
  linkedArtifacts.discoveryIntakePath = queueEntry?.intake_record_path ?? null;
  linkedArtifacts.discoveryRoutingPath = queueEntry?.routing_record_path ?? null;

  return finalizeResolvedFocus({
    ok: true,
    directiveRoot: input.directiveRoot,
    artifactPath: relativePath,
    artifactKind: "engine_run" as const,
    lane: "engine" as const,
    candidateId: record.candidate.candidateId,
    candidateName: record.candidate.candidateName,
    artifactStage: `engine.route.${record.selectedLane.laneId}`,
    artifactNextLegalStep: "Inspect the Discovery routing record and only then explicitly approve the next bounded downstream stub.",
    currentStage: `engine.route.${record.selectedLane.laneId}`,
    nextLegalStep: "Inspect the Discovery routing record and only then explicitly approve the next bounded downstream stub.",
    routeTarget: record.selectedLane.laneId,
    statusGate: record.decision.decisionState,
    missingExpectedArtifacts: [],
    inconsistentLinks: [],
    intentionallyUnbuiltDownstreamStages: [
      "automatic downstream advancement",
      "runtime execution",
    ],
    linkedArtifacts,
    discovery: {
      queueStatus: queueEntry?.status ?? null,
      routingDecision: queueEntry?.routing_target ?? null,
      usefulnessLevel: record.candidate.usefulnessLevel,
      usefulnessRationale: record.analysis.usefulnessRationale,
      requiredNextArtifact: queueEntry?.result_record_path ?? null,
    },
    engine: {
      runId: record.runId,
      selectedLane: record.selectedLane.laneId,
      decisionState: record.decision.decisionState,
      proofKind: record.proofPlan.proofKind,
      nextAction: record.integrationProposal.nextAction,
    },
  } satisfies Omit<DirectiveWorkspaceResolvedFocus, "integrityState">);
}

export function resolveDirectiveWorkspaceState(input: {
  directiveRoot?: string;
  artifactPath?: string | null;
  includeAnchors?: boolean;
} = {}): DirectiveWorkspaceStateReport {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const snapshotAt = new Date().toISOString();
  const engineOverview = readDirectiveEngineRunsOverview({
    directiveRoot,
    maxRuns: 8,
  });
  const productTruth = buildDirectiveWorkspaceProductTruth();

  let focus: DirectiveWorkspaceResolvedFocus | null = null;
  if (input.artifactPath) {
    const artifactPath = resolveDirectiveRelativePath(directiveRoot, input.artifactPath, "artifactPath");
    if (artifactPath.startsWith("discovery/routing-log/")) {
      focus = resolveDiscoveryFocus({
        directiveRoot,
        artifactPath,
      });
    } else if (artifactPath.startsWith("runtime/standalone-host/engine-runs/") && artifactPath.endsWith(".json")) {
      focus = resolveEngineFocus({
        directiveRoot,
        artifactPath,
      });
    } else if (artifactPath.startsWith("architecture/")) {
      const architecture = resolveArchitectureFocusFromAnyPath({
        directiveRoot,
        artifactPath,
      });
      const architectureArtifactStage = buildArchitectureArtifactStage({
        artifactKind: architecture.artifactKind,
        result: architecture.result ?? null,
        adoption: architecture.adoption ?? null,
        implementationResult: architecture.implementationResult ?? null,
        consumption: architecture.consumption ?? null,
        evaluation: architecture.evaluation ?? null,
      });
      const queueEntry = findQueueEntryByCandidateId(directiveRoot, architecture.candidateId);
      const engineRun = findLatestEngineRunByCandidateId(directiveRoot, architecture.candidateId);
      const linkedArtifacts = architecture.linked;
      linkedArtifacts.discoveryIntakePath = queueEntry?.intake_record_path ?? null;
      linkedArtifacts.discoveryRoutingPath = queueEntry?.routing_record_path ?? linkedArtifacts.discoveryRoutingPath;
      linkedArtifacts.engineRunRecordPath = engineRun?.recordRelativePath ?? null;
      linkedArtifacts.engineRunReportPath = engineRun?.reportRelativePath ?? null;

      focus = finalizeResolvedFocus({
        ok: true,
        directiveRoot,
        artifactPath,
        artifactKind: architecture.artifactKind,
        lane: "architecture",
        candidateId: architecture.candidateId,
        candidateName: architecture.candidateName,
        artifactStage: architectureArtifactStage.artifactStage,
        artifactNextLegalStep: architectureArtifactStage.artifactNextLegalStep,
        currentStage: architecture.currentStage,
        nextLegalStep: architecture.nextLegalStep,
        routeTarget: queueEntry?.routing_target ?? null,
        statusGate: architecture.currentStage,
        missingExpectedArtifacts: architecture.missingExpectedArtifacts,
        inconsistentLinks: architecture.inconsistentLinks,
        intentionallyUnbuiltDownstreamStages: architecture.intentionallyUnbuiltDownstreamStages,
        linkedArtifacts,
        discovery: {
          queueStatus: queueEntry?.status ?? null,
          routingDecision: queueEntry?.routing_target ?? null,
          usefulnessLevel: engineRun?.record.candidate.usefulnessLevel ?? null,
          usefulnessRationale: engineRun?.record.analysis.usefulnessRationale ?? null,
          requiredNextArtifact: queueEntry?.result_record_path ?? null,
        },
        engine: {
          runId: engineRun?.record.runId ?? null,
          selectedLane: engineRun?.record.selectedLane?.laneId ?? null,
          decisionState: engineRun?.record.decision?.decisionState ?? null,
          proofKind: engineRun?.record.proofPlan?.proofKind ?? null,
          nextAction: engineRun?.record.integrationProposal?.nextAction ?? null,
        },
      });
    } else if (artifactPath.startsWith("runtime/")) {
      const runtime = resolveRuntimeFocusFromAnyPath({
        directiveRoot,
        artifactPath,
      });
      const runtimeArtifactStage = buildRuntimeArtifactStage({
        artifactKind: runtime.artifactKind,
        runtimeRecord: runtime.runtimeRecord ?? null,
        runtimeProof: runtime.runtimeProof ?? null,
        capabilityBoundary: runtime.capabilityBoundary ?? null,
        callableIntegration: runtime.callableIntegration ?? null,
      });
      const queueEntry = findQueueEntryByCandidateId(directiveRoot, runtime.candidateId);
      const engineRun = findLatestEngineRunByCandidateId(directiveRoot, runtime.candidateId);
      const linkedArtifacts = runtime.linked;
      linkedArtifacts.discoveryIntakePath = queueEntry?.intake_record_path ?? null;
      linkedArtifacts.discoveryRoutingPath = queueEntry?.routing_record_path ?? linkedArtifacts.discoveryRoutingPath;
      linkedArtifacts.engineRunRecordPath = engineRun?.recordRelativePath ?? null;
      linkedArtifacts.engineRunReportPath = engineRun?.reportRelativePath ?? null;

      focus = finalizeResolvedFocus({
        ok: true,
        directiveRoot,
        artifactPath,
        artifactKind: runtime.artifactKind,
        lane: "runtime",
        candidateId: runtime.candidateId,
        candidateName: runtime.candidateName,
        artifactStage: runtimeArtifactStage.artifactStage,
        artifactNextLegalStep: runtimeArtifactStage.artifactNextLegalStep,
        currentStage: runtime.currentStage,
        nextLegalStep: runtime.nextLegalStep,
        routeTarget: queueEntry?.routing_target ?? (runtime.linked.discoveryRoutingPath ? "runtime" : null),
        statusGate: runtime.currentStage,
        missingExpectedArtifacts: runtime.missingExpectedArtifacts,
        inconsistentLinks: runtime.inconsistentLinks,
        intentionallyUnbuiltDownstreamStages: runtime.intentionallyUnbuiltDownstreamStages,
        linkedArtifacts,
        discovery: {
          queueStatus: queueEntry?.status ?? null,
          routingDecision: queueEntry?.routing_target ?? null,
          usefulnessLevel: engineRun?.record.candidate.usefulnessLevel ?? null,
          usefulnessRationale: engineRun?.record.analysis.usefulnessRationale ?? null,
          requiredNextArtifact: queueEntry?.result_record_path ?? null,
        },
        engine: {
          runId: engineRun?.record.runId ?? null,
          selectedLane: engineRun?.record.selectedLane?.laneId ?? null,
          decisionState: engineRun?.record.decision?.decisionState ?? null,
          proofKind: engineRun?.record.proofPlan?.proofKind ?? null,
          nextAction: engineRun?.record.integrationProposal?.nextAction ?? null,
        },
        runtime: {
          proposedHost: runtime.promotionReadiness?.proposedHost ?? null,
          executionState: runtime.promotionReadiness?.executionState ?? null,
          promotionReadinessBlockers: buildRuntimePromotionReadinessBlockers({
            promotionReadiness: runtime.promotionReadiness ?? null,
          }),
        },
      });
    } else {
      throw new Error(`unsupported artifact path: ${artifactPath}`);
    }
  }

  return {
    ok: true,
    snapshotAt,
    directiveRoot,
    product: {
      hierarchy: productTruth.hierarchy,
      workflow: productTruth.workflow,
      fieldInterpretation: productTruth.fieldInterpretation,
      proven: productTruth.proven,
      partiallyBuilt: productTruth.partiallyBuilt,
      intentionallyMinimal: productTruth.intentionallyMinimal,
      notBuilt: productTruth.notBuilt,
      forbiddenScopeExpansion: productTruth.forbiddenScopeExpansion,
      legalNextSeams: productTruth.legalNextSeams,
    },
    engine: {
      totalRuns: engineOverview.totalRuns,
      latestRunRecordPath: engineOverview.latest.recordPath,
      latestRunReportPath: engineOverview.latest.reportPath,
      counts: engineOverview.counts,
    },
    anchors: input.includeAnchors === false ? [] : buildOverviewAnchors(directiveRoot),
    focus,
  };
}
