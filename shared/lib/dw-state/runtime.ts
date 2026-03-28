import fs from "node:fs";
import path from "node:path";

import type { DirectiveWorkspaceArtifactKind } from "../dw-state.ts";
import {
  readDirectiveRuntimeFollowUpArtifact,
  type DirectiveRuntimeFollowUpArtifact,
} from "../runtime-follow-up-opener.ts";
import {
  deriveRuntimeCandidateNameFromTitle,
  extractBulletValue,
  extractColonValue,
  extractMarkdownSectionSummary,
  extractNestedBulletValue,
  extractTitle,
  isLegacyRuntimeFollowUpDeferred,
  normalizeRelativePath,
  optionalString,
  readGenericLegacyRuntimeFollowUpArtifact,
  readGenericLegacyRuntimeHandoffArtifact,
  readGenericLegacyRuntimeLiveFetchGateSnapshotArtifact,
  readGenericLegacyRuntimeLiveFetchProofArtifact,
  readGenericLegacyRuntimeLivePoolArtifact,
  readGenericLegacyRuntimePreconditionDecisionNoteArtifact,
  readGenericLegacyRuntimeProofChecklistArtifact,
  readGenericLegacyRuntimePromotionRecordArtifact,
  readGenericLegacyRuntimeRecordArtifact,
  readGenericLegacyRuntimeRegistryArtifact,
  readGenericLegacyRuntimeSamplePoolArtifact,
  readGenericLegacyRuntimeSliceExecutionArtifact,
  readGenericLegacyRuntimeSliceProofArtifact,
  readGenericLegacyRuntimeSystemBundleArtifact,
  readGenericLegacyRuntimeTransformationProofArtifact,
  readGenericLegacyRuntimeTransformationRecordArtifact,
  readGenericLegacyRuntimeValidationNoteArtifact,
  readUtf8,
  requiredString,
  resolveDirectiveRelativePath,
  stripInlineBackticks,
  zeroLinkedArtifacts,
} from "./shared.ts";
import {
  fileExistsInDirectiveWorkspace,
  readLinkedArtifactIfPresent,
  recordInconsistentLink,
  recordMissingExpectedArtifact,
  recordMissingLinkedArtifactIfAbsent,
} from "../../../engine/artifact-link-validation.ts";
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

type GenericLegacyRuntimeFollowUpArtifact = {
  candidateId: string;
  candidateName: string;
  followUpRelativePath: string;
  currentDecisionState: string | null;
  runtimeValueToOperationalize: string;
  proposedHost: string | null;
  proposedIntegrationMode: string | null;
  reentryContractPath: string | null;
  currentStatus: string;
  reviewCadence: string | null;
};

type GenericLegacyRuntimeHandoffArtifact = {
  candidateId: string;
  candidateName: string;
  handoffRelativePath: string;
  runtimeValueToOperationalize: string;
  proposedHost: string | null;
  proposedRuntimeSurface: string;
  originatingArchitectureRecordPath: string | null;
  runtimeFollowUpPath: string | null;
  runtimeRecordPath: string | null;
  runtimeProofPath: string | null;
  promotionRecordPath: string | null;
  registryEntryPath: string | null;
};

type GenericLegacyRuntimeRecordArtifact = {
  candidateId: string;
  candidateName: string;
  runtimeRecordRelativePath: string;
  originPath: string | null;
  linkedFollowUpPath: string | null;
  runtimeObjective: string;
  proposedHost: string | null;
  proposedRuntimeSurface: string | null;
  executionSlice: string | null;
  currentStatus: string;
  nextDecisionPoint: string | null;
};

type GenericLegacyRuntimeSliceProofArtifact = {
  candidateId: string;
  candidateName: string;
  runtimeSliceProofRelativePath: string;
  proofDate: string | null;
  linkedRuntimeRecordPath: string | null;
  linkedExecutionRecordPath: string | null;
  primaryHostChecker: string | null;
  promotionProfileFamily: string | null;
  result: string | null;
};

type GenericLegacyRuntimeSliceExecutionArtifact = {
  candidateId: string;
  candidateName: string;
  runtimeSliceExecutionRelativePath: string;
  executionDate: string | null;
  linkedRuntimeProofPath: string | null;
  status: string | null;
};

type GenericLegacyRuntimeProofChecklistArtifact = {
  candidateId: string;
  candidateName: string;
  proofChecklistRelativePath: string;
  generatedAt: string | null;
  linkedRuntimeRecordPath: string | null;
  linkedRuntimeProofPath: string | null;
  linkedSupplementalProofPath: string | null;
  gateSnapshotPath: string | null;
  status: string | null;
};

type GenericLegacyRuntimeLiveFetchProofArtifact = {
  candidateId: string;
  candidateName: string;
  liveFetchProofRelativePath: string;
  proofDate: string | null;
  linkedRuntimeRecordPath: string | null;
  linkedProofChecklistPath: string | null;
  gateSnapshotPath: string | null;
  result: string | null;
};

type GenericLegacyRuntimeLiveFetchGateSnapshotArtifact = {
  candidateId: string;
  candidateName: string;
  gateSnapshotRelativePath: string;
  generatedAt: string | null;
  workflowSurface: string | null;
  deliveryTarget: string | null;
  linkedLiveFetchProofPath: string | null;
};

type GenericLegacyRuntimeLivePoolArtifact = {
  candidateId: string;
  candidateName: string;
  livePoolRelativePath: string;
  artifactType: string | null;
  generatedAt: string | null;
  degraded: boolean;
  evidenceQualityResult: string | null;
  deliveryTarget: string | null;
  withheldDelivery: boolean | null;
  linkedGateSnapshotPath: string | null;
  linkedLiveFetchProofPath: string | null;
};

type GenericLegacyRuntimeSamplePoolArtifact = {
  candidateId: string;
  candidateName: string;
  samplePoolRelativePath: string;
  artifactType: string | null;
  generatedAt: string | null;
  degraded: boolean;
  evidenceQualityResult: string | null;
  deliveryTarget: string | null;
  withheldDelivery: boolean | null;
};

type GenericLegacyRuntimeSystemBundleArtifact = {
  candidateId: string;
  candidateName: string;
  systemBundleRelativePath: string;
  bundleDate: string | null;
  owner: string | null;
  status: string | null;
  decisionState: string | null;
  adoptionTarget: string | null;
  nextStep: string | null;
};

type GenericLegacyRuntimeValidationNoteArtifact = {
  candidateId: string;
  candidateName: string;
  validationNoteRelativePath: string;
  noteDate: string | null;
  mode: string | null;
  verdict: string | null;
  blocker: string | null;
};

type GenericLegacyRuntimePreconditionDecisionNoteArtifact = {
  candidateId: string;
  candidateName: string;
  noteRelativePath: string;
  noteKind: "precondition_proof" | "precondition_correction" | "host_adapter_decision";
  noteDate: string | null;
  status: string | null;
  linkedFollowUpPath: string | null;
};

type GenericLegacyRuntimeTransformationRecordArtifact = {
  candidateId: string;
  candidateName: string;
  transformationRecordRelativePath: string;
  recordDate: string | null;
  transformationType: string;
  discoveryIntakePath: string | null;
  baselineArtifactPath: string | null;
  resultArtifactPath: string | null;
  adoptionTarget: string | null;
  promotionRecordPath: string | null;
};

type GenericLegacyRuntimeTransformationProofArtifact = {
  candidateId: string;
  transformationProofRelativePath: string;
  generatedAt: string | null;
  transformationType: string | null;
  metric: string | null;
  linkedTransformationRecordPath: string | null;
};

type GenericLegacyRuntimeRegistryArtifact = {
  candidateId: string;
  candidateName: string;
  registryEntryRelativePath: string;
  linkedPromotionRecordPath: string | null;
  proofArtifactPath: string | null;
  proposedHost: string | null;
  runtimeSurface: string | null;
  runtimeStatus: string;
};

type GenericLegacyRuntimePromotionRecordArtifact = {
  candidateId: string;
  candidateName: string;
  promotionRecordRelativePath: string;
  linkedRuntimeRecordPath: string | null;
  sourceIntentArtifactPath: string | null;
  proofArtifactPath: string | null;
  targetHost: string | null;
  targetRuntimeSurface: string | null;
  proposedRuntimeStatus: string;
};

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

export function buildRuntimePromotionReadinessBlockers(input: {
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

function buildLegacyRuntimeFollowUpState(input: {
  directiveRoot: string;
  legacyFollowUp: GenericLegacyRuntimeFollowUpArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];
  const legacyDeferred = isLegacyRuntimeFollowUpDeferred({
    currentDecisionState: input.legacyFollowUp.currentDecisionState,
    currentStatus: input.legacyFollowUp.currentStatus,
  });

  if (legacyDeferred) {
    if (input.legacyFollowUp.reentryContractPath) {
      recordMissingLinkedArtifactIfAbsent({
        directiveRoot: input.directiveRoot,
        state: { missingExpectedArtifacts, inconsistentLinks },
        relativePath: input.legacyFollowUp.reentryContractPath,
        label: "Runtime re-entry contract",
      });
    } else {
      recordInconsistentLink(
        { missingExpectedArtifacts, inconsistentLinks },
        "missing linked Runtime re-entry contract: re-entry contract path (if deferred) was not recorded",
      );
    }
  }

  return {
    currentStage: legacyDeferred
      ? "runtime.follow_up.legacy_deferred"
      : "runtime.follow_up.legacy_recorded",
    nextLegalStep: legacyDeferred
      ? "No automatic Runtime step is open; this historical deferred Runtime follow-up remains parked unless a new bounded Runtime v0 re-entry is explicitly opened."
      : "No automatic Runtime step is open; this historical Runtime follow-up remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeHandoffState(input: {
  directiveRoot: string;
  legacyHandoff: GenericLegacyRuntimeHandoffArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  for (const [label, relativePath] of [
    ["Originating Architecture record", input.legacyHandoff.originatingArchitectureRecordPath],
    ["Runtime follow-up", input.legacyHandoff.runtimeFollowUpPath],
    ["Runtime record", input.legacyHandoff.runtimeRecordPath],
    ["Runtime proof artifact", input.legacyHandoff.runtimeProofPath],
    ["Runtime promotion record", input.legacyHandoff.promotionRecordPath],
    ["Runtime registry entry", input.legacyHandoff.registryEntryPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  return {
    currentStage: "runtime.handoff.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical architecture-to-runtime handoff remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeRegistryState(input: {
  directiveRoot: string;
  legacyRuntimeRegistry: GenericLegacyRuntimeRegistryArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  for (const [label, relativePath] of [
    ["Runtime promotion record", input.legacyRuntimeRegistry.linkedPromotionRecordPath],
    ["Runtime proof artifact", input.legacyRuntimeRegistry.proofArtifactPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  return {
    currentStage: "runtime.registry.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime registry entry remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimePromotionRecordState(input: {
  directiveRoot: string;
  legacyRuntimePromotionRecord: GenericLegacyRuntimePromotionRecordArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  for (const [label, relativePath] of [
    ["Runtime record", input.legacyRuntimePromotionRecord.linkedRuntimeRecordPath],
    ["Source intent artifact", input.legacyRuntimePromotionRecord.sourceIntentArtifactPath],
    ["Runtime proof artifact", input.legacyRuntimePromotionRecord.proofArtifactPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  return {
    currentStage: "runtime.promotion_record.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime promotion record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeRecordState(input: {
  directiveRoot: string;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  for (const [label, relativePath] of [
    ["Runtime origin path", input.legacyRuntimeRecord.originPath],
    ["Runtime follow-up", input.legacyRuntimeRecord.linkedFollowUpPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  return {
    currentStage: "runtime.record.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeSliceProofState(input: {
  directiveRoot: string;
  legacyRuntimeSliceProof: GenericLegacyRuntimeSliceProofArtifact;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeRecordPath = input.legacyRuntimeSliceProof.linkedRuntimeRecordPath;

  for (const [label, relativePath] of [
    ["Runtime record", input.legacyRuntimeSliceProof.linkedRuntimeRecordPath],
    ["Runtime execution record", input.legacyRuntimeSliceProof.linkedExecutionRecordPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  if (
    input.legacyRuntimeRecord
    && input.legacyRuntimeRecord.candidateId !== input.legacyRuntimeSliceProof.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime slice proof candidate "${input.legacyRuntimeSliceProof.candidateId}" does not match runtime record "${input.legacyRuntimeRecord.candidateId}"`,
    );
  }

  return {
    currentStage: "runtime.slice_proof.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime slice proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeSliceExecutionState(input: {
  directiveRoot: string;
  legacyRuntimeSliceExecution: GenericLegacyRuntimeSliceExecutionArtifact;
  legacyRuntimeSliceProof: GenericLegacyRuntimeSliceProofArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeProofPath = input.legacyRuntimeSliceExecution.linkedRuntimeProofPath;

  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.legacyRuntimeSliceExecution.linkedRuntimeProofPath,
    label: "Runtime slice proof",
  });

  if (
    input.legacyRuntimeSliceProof
    && input.legacyRuntimeSliceProof.candidateId !== input.legacyRuntimeSliceExecution.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime slice execution candidate "${input.legacyRuntimeSliceExecution.candidateId}" does not match runtime slice proof "${input.legacyRuntimeSliceProof.candidateId}"`,
    );
  }

  return {
    currentStage: "runtime.slice_execution.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime slice execution remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeProofChecklistState(input: {
  directiveRoot: string;
  legacyRuntimeProofChecklist: GenericLegacyRuntimeProofChecklistArtifact;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null;
  legacyRuntimeSliceProof: GenericLegacyRuntimeSliceProofArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeRecordPath = input.legacyRuntimeProofChecklist.linkedRuntimeRecordPath;
  linked.runtimeProofPath = input.legacyRuntimeProofChecklist.linkedRuntimeProofPath;

  for (const [label, relativePath] of [
    ["Runtime record", input.legacyRuntimeProofChecklist.linkedRuntimeRecordPath],
    ["Primary Runtime proof", input.legacyRuntimeProofChecklist.linkedRuntimeProofPath],
    ["Supplemental Runtime proof", input.legacyRuntimeProofChecklist.linkedSupplementalProofPath],
    ["Gate snapshot", input.legacyRuntimeProofChecklist.gateSnapshotPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  if (
    input.legacyRuntimeRecord
    && input.legacyRuntimeRecord.candidateId !== input.legacyRuntimeProofChecklist.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime proof checklist candidate "${input.legacyRuntimeProofChecklist.candidateId}" does not match runtime record "${input.legacyRuntimeRecord.candidateId}"`,
    );
  }
  if (
    input.legacyRuntimeSliceProof
    && input.legacyRuntimeSliceProof.candidateId !== input.legacyRuntimeProofChecklist.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime proof checklist candidate "${input.legacyRuntimeProofChecklist.candidateId}" does not match runtime slice proof "${input.legacyRuntimeSliceProof.candidateId}"`,
    );
  }

  return {
    currentStage: "runtime.proof_checklist.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime proof checklist remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeLiveFetchProofState(input: {
  directiveRoot: string;
  legacyRuntimeLiveFetchProof: GenericLegacyRuntimeLiveFetchProofArtifact;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null;
  legacyRuntimeProofChecklist: GenericLegacyRuntimeProofChecklistArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeRecordPath = input.legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath;
  linked.runtimeProofPath = input.legacyRuntimeLiveFetchProof.linkedProofChecklistPath;

  for (const [label, relativePath] of [
    ["Runtime record", input.legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath],
    ["Proof checklist", input.legacyRuntimeLiveFetchProof.linkedProofChecklistPath],
    ["Gate snapshot", input.legacyRuntimeLiveFetchProof.gateSnapshotPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  if (
    input.legacyRuntimeRecord
    && input.legacyRuntimeRecord.candidateId !== input.legacyRuntimeLiveFetchProof.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live-fetch proof candidate "${input.legacyRuntimeLiveFetchProof.candidateId}" does not match runtime record "${input.legacyRuntimeRecord.candidateId}"`,
    );
  }
  if (
    input.legacyRuntimeProofChecklist
    && input.legacyRuntimeProofChecklist.candidateId !== input.legacyRuntimeLiveFetchProof.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live-fetch proof candidate "${input.legacyRuntimeLiveFetchProof.candidateId}" does not match runtime proof checklist "${input.legacyRuntimeProofChecklist.candidateId}"`,
    );
  }

  return {
    currentStage: "runtime.live_fetch_proof.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime live-fetch proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeLiveFetchGateSnapshotState(input: {
  directiveRoot: string;
  legacyRuntimeLiveFetchGateSnapshot: GenericLegacyRuntimeLiveFetchGateSnapshotArtifact;
  legacyRuntimeLiveFetchProof: GenericLegacyRuntimeLiveFetchProofArtifact | null;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeProofPath = input.legacyRuntimeLiveFetchGateSnapshot.linkedLiveFetchProofPath;
  linked.runtimeRecordPath = input.legacyRuntimeLiveFetchProof?.linkedRuntimeRecordPath ?? null;

  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.legacyRuntimeLiveFetchGateSnapshot.linkedLiveFetchProofPath,
    label: "Live-fetch proof",
  });

  if (
    input.legacyRuntimeLiveFetchProof
    && input.legacyRuntimeLiveFetchProof.candidateId !== input.legacyRuntimeLiveFetchGateSnapshot.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live-fetch gate snapshot candidate "${input.legacyRuntimeLiveFetchGateSnapshot.candidateId}" does not match live-fetch proof "${input.legacyRuntimeLiveFetchProof.candidateId}"`,
    );
  }
  if (
    input.legacyRuntimeLiveFetchProof?.gateSnapshotPath
    && input.legacyRuntimeLiveFetchProof.gateSnapshotPath
      !== input.legacyRuntimeLiveFetchGateSnapshot.gateSnapshotRelativePath
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live-fetch gate snapshot "${input.legacyRuntimeLiveFetchGateSnapshot.gateSnapshotRelativePath}" does not match live-fetch proof snapshot "${input.legacyRuntimeLiveFetchProof.gateSnapshotPath}"`,
    );
  }
  if (
    input.legacyRuntimeRecord
    && input.legacyRuntimeRecord.candidateId !== input.legacyRuntimeLiveFetchGateSnapshot.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live-fetch gate snapshot candidate "${input.legacyRuntimeLiveFetchGateSnapshot.candidateId}" does not match runtime record "${input.legacyRuntimeRecord.candidateId}"`,
    );
  }

  return {
    currentStage: "runtime.live_fetch_gate_snapshot.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime live-fetch gate snapshot remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeLivePoolArtifactState(input: {
  directiveRoot: string;
  legacyRuntimeLivePoolArtifact: GenericLegacyRuntimeLivePoolArtifact;
  legacyRuntimeLiveFetchGateSnapshot: GenericLegacyRuntimeLiveFetchGateSnapshotArtifact | null;
  legacyRuntimeLiveFetchProof: GenericLegacyRuntimeLiveFetchProofArtifact | null;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeProofPath = input.legacyRuntimeLivePoolArtifact.linkedLiveFetchProofPath;
  linked.runtimeRecordPath = input.legacyRuntimeLiveFetchProof?.linkedRuntimeRecordPath ?? null;

  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.legacyRuntimeLivePoolArtifact.linkedGateSnapshotPath,
    label: "Live-fetch gate snapshot",
  });
  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.legacyRuntimeLivePoolArtifact.linkedLiveFetchProofPath,
    label: "Live-fetch proof",
  });

  if (
    input.legacyRuntimeLiveFetchGateSnapshot
    && input.legacyRuntimeLiveFetchGateSnapshot.candidateId !== input.legacyRuntimeLivePoolArtifact.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live pool artifact candidate "${input.legacyRuntimeLivePoolArtifact.candidateId}" does not match gate snapshot "${input.legacyRuntimeLiveFetchGateSnapshot.candidateId}"`,
    );
  }
  if (
    input.legacyRuntimeLiveFetchProof
    && input.legacyRuntimeLiveFetchProof.candidateId !== input.legacyRuntimeLivePoolArtifact.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live pool artifact candidate "${input.legacyRuntimeLivePoolArtifact.candidateId}" does not match live-fetch proof "${input.legacyRuntimeLiveFetchProof.candidateId}"`,
    );
  }
  if (
    input.legacyRuntimeRecord
    && input.legacyRuntimeRecord.candidateId !== input.legacyRuntimeLivePoolArtifact.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `runtime live pool artifact candidate "${input.legacyRuntimeLivePoolArtifact.candidateId}" does not match runtime record "${input.legacyRuntimeRecord.candidateId}"`,
    );
  }

  return {
    currentStage: input.legacyRuntimeLivePoolArtifact.degraded
      ? "runtime.live_degraded_pool.legacy_recorded"
      : "runtime.live_qualified_pool.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime live pool artifact remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeSamplePoolArtifactState(input: {
  legacyRuntimeSamplePoolArtifact: GenericLegacyRuntimeSamplePoolArtifact;
}) {
  return {
    currentStage: input.legacyRuntimeSamplePoolArtifact.degraded
      ? "runtime.sample_degraded_pool.legacy_recorded"
      : "runtime.sample_qualified_pool.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime sample pool artifact remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    missingExpectedArtifacts: [] as string[],
    inconsistentLinks: [] as string[],
    linked: zeroLinkedArtifacts(),
    intentionallyUnbuiltDownstreamStages: [
      "runtime execution",
      "host integration",
      "callable implementation",
      "host-facing promotion",
      "promotion automation",
    ],
  };
}

function buildLegacyRuntimeSystemBundleState() {
  return {
    currentStage: "runtime.system_bundle.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime system-bundle note remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    missingExpectedArtifacts: [] as string[],
    inconsistentLinks: [] as string[],
    linked: zeroLinkedArtifacts(),
    intentionallyUnbuiltDownstreamStages: [
      "runtime execution",
      "host integration",
      "callable implementation",
      "host-facing promotion",
      "promotion automation",
    ],
  };
}

function buildLegacyRuntimeValidationNoteState() {
  return {
    currentStage: "runtime.validation_note.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime validation note remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    missingExpectedArtifacts: [] as string[],
    inconsistentLinks: [] as string[],
    linked: zeroLinkedArtifacts(),
    intentionallyUnbuiltDownstreamStages: [
      "runtime execution",
      "host integration",
      "callable implementation",
      "host-facing promotion",
      "promotion automation",
    ],
  };
}

function buildLegacyRuntimePreconditionDecisionNoteState(input: {
  directiveRoot: string;
  legacyRuntimePreconditionDecisionNote: GenericLegacyRuntimePreconditionDecisionNoteArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  linked.runtimeFollowUpPath = input.legacyRuntimePreconditionDecisionNote.linkedFollowUpPath;
  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: linked.runtimeFollowUpPath,
    label: "Runtime follow-up record",
  });

  const currentStage =
    input.legacyRuntimePreconditionDecisionNote.noteKind === "precondition_proof"
      ? "runtime.precondition_proof.legacy_recorded"
      : input.legacyRuntimePreconditionDecisionNote.noteKind === "precondition_correction"
        ? "runtime.precondition_correction.legacy_recorded"
        : "runtime.host_adapter_decision.legacy_recorded";
  const nextLegalStep =
    input.legacyRuntimePreconditionDecisionNote.noteKind === "precondition_proof"
      ? "No automatic Runtime step is open; this historical Runtime CLI precondition proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened."
      : input.legacyRuntimePreconditionDecisionNote.noteKind === "precondition_correction"
        ? "No automatic Runtime step is open; this historical Runtime precondition correction remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened."
        : "No automatic Runtime step is open; this historical Runtime host-adapter decision remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.";

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

function buildLegacyRuntimeTransformationRecordState(input: {
  directiveRoot: string;
  legacyRuntimeTransformationRecord: GenericLegacyRuntimeTransformationRecordArtifact;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  for (const [label, relativePath] of [
    ["Discovery intake record", input.legacyRuntimeTransformationRecord.discoveryIntakePath],
    ["Transformation baseline artifact", input.legacyRuntimeTransformationRecord.baselineArtifactPath],
    ["Transformation result artifact", input.legacyRuntimeTransformationRecord.resultArtifactPath],
    ["Runtime promotion record", input.legacyRuntimeTransformationRecord.promotionRecordPath],
  ] as const) {
    recordMissingLinkedArtifactIfAbsent({
      directiveRoot: input.directiveRoot,
      state: { missingExpectedArtifacts, inconsistentLinks },
      relativePath,
      label,
    });
  }

  return {
    currentStage: "runtime.transformation_record.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime transformation record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

function buildLegacyRuntimeTransformationProofState(input: {
  directiveRoot: string;
  legacyRuntimeTransformationProof: GenericLegacyRuntimeTransformationProofArtifact;
  legacyRuntimeTransformationRecord: GenericLegacyRuntimeTransformationRecordArtifact | null;
}) {
  const linked = zeroLinkedArtifacts();
  const missingExpectedArtifacts: string[] = [];
  const inconsistentLinks: string[] = [];

  recordMissingLinkedArtifactIfAbsent({
    directiveRoot: input.directiveRoot,
    state: { missingExpectedArtifacts, inconsistentLinks },
    relativePath: input.legacyRuntimeTransformationProof.linkedTransformationRecordPath,
    label: "Transformation record",
  });

  if (
    input.legacyRuntimeTransformationRecord
    && input.legacyRuntimeTransformationRecord.candidateId !== input.legacyRuntimeTransformationProof.candidateId
  ) {
    recordInconsistentLink(
      { missingExpectedArtifacts, inconsistentLinks },
      `transformation proof candidate "${input.legacyRuntimeTransformationProof.candidateId}" does not match transformation record "${input.legacyRuntimeTransformationRecord.candidateId}"`,
    );
  }

  return {
    currentStage: "runtime.transformation_proof.legacy_recorded",
    nextLegalStep:
      "No automatic Runtime step is open; this historical Runtime transformation proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

export function buildRuntimeArtifactStage(input: {
  artifactKind: DirectiveWorkspaceArtifactKind;
  legacyFollowUp: GenericLegacyRuntimeFollowUpArtifact | null;
  legacyHandoff: GenericLegacyRuntimeHandoffArtifact | null;
  legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null;
  legacyRuntimeSliceProof: GenericLegacyRuntimeSliceProofArtifact | null;
  legacyRuntimeSliceExecution: GenericLegacyRuntimeSliceExecutionArtifact | null;
  legacyRuntimeProofChecklist: GenericLegacyRuntimeProofChecklistArtifact | null;
  legacyRuntimeLiveFetchProof: GenericLegacyRuntimeLiveFetchProofArtifact | null;
  legacyRuntimeLiveFetchGateSnapshot: GenericLegacyRuntimeLiveFetchGateSnapshotArtifact | null;
  legacyRuntimeLivePoolArtifact: GenericLegacyRuntimeLivePoolArtifact | null;
  legacyRuntimeSamplePoolArtifact: GenericLegacyRuntimeSamplePoolArtifact | null;
  legacyRuntimeSystemBundleArtifact: GenericLegacyRuntimeSystemBundleArtifact | null;
  legacyRuntimeValidationNoteArtifact: GenericLegacyRuntimeValidationNoteArtifact | null;
  legacyRuntimePreconditionDecisionNoteArtifact: GenericLegacyRuntimePreconditionDecisionNoteArtifact | null;
  legacyRuntimeTransformationRecord: GenericLegacyRuntimeTransformationRecordArtifact | null;
  legacyRuntimeTransformationProof: GenericLegacyRuntimeTransformationProofArtifact | null;
  legacyRuntimeRegistry: GenericLegacyRuntimeRegistryArtifact | null;
  legacyRuntimePromotionRecord: GenericLegacyRuntimePromotionRecordArtifact | null;
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
    case "runtime_follow_up_legacy":
      return {
        artifactStage:
          /defer/i.test(input.legacyFollowUp?.currentDecisionState ?? "")
          || /deferred/i.test(input.legacyFollowUp?.currentStatus ?? "")
            ? "runtime.follow_up.legacy_deferred"
            : "runtime.follow_up.legacy_recorded",
        artifactNextLegalStep:
          /defer/i.test(input.legacyFollowUp?.currentDecisionState ?? "")
          || /deferred/i.test(input.legacyFollowUp?.currentStatus ?? "")
            ? "No automatic Runtime step is open; this historical deferred Runtime follow-up remains parked unless a new bounded Runtime v0 re-entry is explicitly opened."
            : "No automatic Runtime step is open; this historical Runtime follow-up remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_handoff_legacy":
      return {
        artifactStage: "runtime.handoff.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical architecture-to-runtime handoff remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_record_legacy":
      return {
        artifactStage: "runtime.record.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_slice_proof_legacy":
      return {
        artifactStage: "runtime.slice_proof.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime slice proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_slice_execution_legacy":
      return {
        artifactStage: "runtime.slice_execution.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime slice execution remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_proof_checklist_legacy":
      return {
        artifactStage: "runtime.proof_checklist.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime proof checklist remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_live_fetch_proof_legacy":
      return {
        artifactStage: "runtime.live_fetch_proof.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime live-fetch proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_live_fetch_gate_snapshot_legacy":
      return {
        artifactStage: "runtime.live_fetch_gate_snapshot.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime live-fetch gate snapshot remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_live_pool_artifact_legacy":
      return {
        artifactStage: input.legacyRuntimeLivePoolArtifact?.degraded
          ? "runtime.live_degraded_pool.legacy_recorded"
          : "runtime.live_qualified_pool.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime live pool artifact remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_sample_pool_artifact_legacy":
      return {
        artifactStage: input.legacyRuntimeSamplePoolArtifact?.degraded
          ? "runtime.sample_degraded_pool.legacy_recorded"
          : "runtime.sample_qualified_pool.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime sample pool artifact remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_system_bundle_note_legacy":
      return {
        artifactStage: "runtime.system_bundle.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime system-bundle note remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_validation_note_legacy":
      return {
        artifactStage: "runtime.validation_note.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime validation note remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_precondition_decision_note_legacy":
      return {
        artifactStage: input.legacyRuntimePreconditionDecisionNoteArtifact?.noteKind === "precondition_correction"
          ? "runtime.precondition_correction.legacy_recorded"
          : input.legacyRuntimePreconditionDecisionNoteArtifact?.noteKind === "host_adapter_decision"
            ? "runtime.host_adapter_decision.legacy_recorded"
            : "runtime.precondition_proof.legacy_recorded",
        artifactNextLegalStep: input.legacyRuntimePreconditionDecisionNoteArtifact?.noteKind === "precondition_correction"
          ? "No automatic Runtime step is open; this historical Runtime precondition correction remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened."
          : input.legacyRuntimePreconditionDecisionNoteArtifact?.noteKind === "host_adapter_decision"
            ? "No automatic Runtime step is open; this historical Runtime host-adapter decision remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened."
            : "No automatic Runtime step is open; this historical Runtime CLI precondition proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_transformation_record_legacy":
      return {
        artifactStage: "runtime.transformation_record.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime transformation record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_transformation_proof_legacy":
      return {
        artifactStage: "runtime.transformation_proof.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime transformation proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_registry_legacy":
      return {
        artifactStage: "runtime.registry.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime registry entry remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
      };
    case "runtime_promotion_record_legacy":
      return {
        artifactStage: "runtime.promotion_record.legacy_recorded",
        artifactNextLegalStep:
          "No automatic Runtime step is open; this historical Runtime promotion record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
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

export function resolveRuntimeFocusFromAnyPath(input: {
  directiveRoot: string;
  artifactPath: string;
}) {
  const relativePath = resolveDirectiveRelativePath(input.directiveRoot, input.artifactPath, "artifactPath");

  let followUp: DirectiveRuntimeFollowUpArtifact | null = null;
  let legacyFollowUp: GenericLegacyRuntimeFollowUpArtifact | null = null;
  let legacyHandoff: GenericLegacyRuntimeHandoffArtifact | null = null;
  let legacyRuntimeRecord: GenericLegacyRuntimeRecordArtifact | null = null;
  let legacyRuntimeSliceProof: GenericLegacyRuntimeSliceProofArtifact | null = null;
  let legacyRuntimeSliceExecution: GenericLegacyRuntimeSliceExecutionArtifact | null = null;
  let legacyRuntimeProofChecklist: GenericLegacyRuntimeProofChecklistArtifact | null = null;
  let legacyRuntimeLiveFetchProof: GenericLegacyRuntimeLiveFetchProofArtifact | null = null;
  let legacyRuntimeLiveFetchGateSnapshot: GenericLegacyRuntimeLiveFetchGateSnapshotArtifact | null = null;
  let legacyRuntimeLivePoolArtifact: GenericLegacyRuntimeLivePoolArtifact | null = null;
  let legacyRuntimeSamplePoolArtifact: GenericLegacyRuntimeSamplePoolArtifact | null = null;
  let legacyRuntimeSystemBundleArtifact: GenericLegacyRuntimeSystemBundleArtifact | null = null;
  let legacyRuntimeValidationNoteArtifact: GenericLegacyRuntimeValidationNoteArtifact | null = null;
  let legacyRuntimePreconditionDecisionNoteArtifact: GenericLegacyRuntimePreconditionDecisionNoteArtifact | null = null;
  let legacyRuntimeTransformationRecord: GenericLegacyRuntimeTransformationRecordArtifact | null = null;
  let legacyRuntimeTransformationProof: GenericLegacyRuntimeTransformationProofArtifact | null = null;
  let legacyRuntimeRegistry: GenericLegacyRuntimeRegistryArtifact | null = null;
  let legacyRuntimePromotionRecord: GenericLegacyRuntimePromotionRecordArtifact | null = null;
  let runtimeRecord: GenericRuntimeRecordArtifact | null = null;
  let runtimeProof: GenericRuntimeProofArtifact | null = null;
  let capabilityBoundary: GenericRuntimeRuntimeCapabilityBoundaryArtifact | null = null;
  let promotionReadiness: GenericRuntimePromotionReadinessArtifact | null = null;
  let callableIntegration: ReturnType<typeof readGenericCallableIntegrationArtifact> | null = null;
  let artifactKind: DirectiveWorkspaceArtifactKind = "unknown";

  if (relativePath.startsWith("runtime/handoff/")) {
    legacyHandoff = readGenericLegacyRuntimeHandoffArtifact({
      directiveRoot: input.directiveRoot,
      handoffPath: relativePath,
    });
    artifactKind = "runtime_handoff_legacy";
  } else if (relativePath.startsWith("runtime/follow-up/")) {
    try {
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
    } catch {
      legacyFollowUp = readGenericLegacyRuntimeFollowUpArtifact({
        directiveRoot: input.directiveRoot,
        followUpPath: relativePath,
      });
      artifactKind = "runtime_follow_up_legacy";
    }
  } else if (relativePath.startsWith("runtime/records/") && relativePath.endsWith("-runtime-slice-01-proof.md")) {
    legacyRuntimeSliceProof = readGenericLegacyRuntimeSliceProofArtifact({
      directiveRoot: input.directiveRoot,
      runtimeSliceProofPath: relativePath,
    });
    artifactKind = "runtime_slice_proof_legacy";
    if (
      legacyRuntimeSliceProof.linkedRuntimeRecordPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeSliceProof.linkedRuntimeRecordPath)
    ) {
      legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath: legacyRuntimeSliceProof.linkedRuntimeRecordPath,
      });
    }
  } else if (
    relativePath.startsWith("runtime/records/")
    && (
      relativePath.endsWith("-runtime-slice-01-execution.md")
      || relativePath.endsWith("-fallback-rehearsal.md")
    )
  ) {
    legacyRuntimeSliceExecution = readGenericLegacyRuntimeSliceExecutionArtifact({
      directiveRoot: input.directiveRoot,
      runtimeSliceExecutionPath: relativePath,
    });
    artifactKind = "runtime_slice_execution_legacy";
    if (
      legacyRuntimeSliceExecution.linkedRuntimeProofPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeSliceExecution.linkedRuntimeProofPath)
    ) {
      legacyRuntimeSliceProof = readGenericLegacyRuntimeSliceProofArtifact({
        directiveRoot: input.directiveRoot,
        runtimeSliceProofPath: legacyRuntimeSliceExecution.linkedRuntimeProofPath,
      });
      if (
        legacyRuntimeSliceProof.linkedRuntimeRecordPath
        && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeSliceProof.linkedRuntimeRecordPath)
      ) {
        legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
          directiveRoot: input.directiveRoot,
          runtimeRecordPath: legacyRuntimeSliceProof.linkedRuntimeRecordPath,
        });
      }
    }
  } else if (relativePath.startsWith("runtime/records/") && relativePath.endsWith("-proof-checklist.md")) {
    legacyRuntimeProofChecklist = readGenericLegacyRuntimeProofChecklistArtifact({
      directiveRoot: input.directiveRoot,
      proofChecklistPath: relativePath,
    });
    artifactKind = "runtime_proof_checklist_legacy";
    if (
      legacyRuntimeProofChecklist.linkedRuntimeRecordPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeProofChecklist.linkedRuntimeRecordPath)
    ) {
      legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath: legacyRuntimeProofChecklist.linkedRuntimeRecordPath,
      });
    }
    if (
      legacyRuntimeProofChecklist.linkedRuntimeProofPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeProofChecklist.linkedRuntimeProofPath)
    ) {
      legacyRuntimeSliceProof = readGenericLegacyRuntimeSliceProofArtifact({
        directiveRoot: input.directiveRoot,
        runtimeSliceProofPath: legacyRuntimeProofChecklist.linkedRuntimeProofPath,
      });
    }
  } else if (relativePath.startsWith("runtime/records/") && relativePath.endsWith("-live-fetch-proof.md")) {
    legacyRuntimeLiveFetchProof = readGenericLegacyRuntimeLiveFetchProofArtifact({
      directiveRoot: input.directiveRoot,
      liveFetchProofPath: relativePath,
    });
    artifactKind = "runtime_live_fetch_proof_legacy";
    if (
      legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath)
    ) {
      legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
        directiveRoot: input.directiveRoot,
        runtimeRecordPath: legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath,
      });
    }
    if (
      legacyRuntimeLiveFetchProof.linkedProofChecklistPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchProof.linkedProofChecklistPath)
    ) {
      legacyRuntimeProofChecklist = readGenericLegacyRuntimeProofChecklistArtifact({
        directiveRoot: input.directiveRoot,
        proofChecklistPath: legacyRuntimeLiveFetchProof.linkedProofChecklistPath,
      });
    }
  } else if (relativePath.startsWith("runtime/records/") && relativePath.endsWith("-live-fetch-gate-snapshot.json")) {
    legacyRuntimeLiveFetchGateSnapshot = readGenericLegacyRuntimeLiveFetchGateSnapshotArtifact({
      directiveRoot: input.directiveRoot,
      gateSnapshotPath: relativePath,
    });
    artifactKind = "runtime_live_fetch_gate_snapshot_legacy";
    if (
      legacyRuntimeLiveFetchGateSnapshot.linkedLiveFetchProofPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchGateSnapshot.linkedLiveFetchProofPath)
    ) {
      legacyRuntimeLiveFetchProof = readGenericLegacyRuntimeLiveFetchProofArtifact({
        directiveRoot: input.directiveRoot,
        liveFetchProofPath: legacyRuntimeLiveFetchGateSnapshot.linkedLiveFetchProofPath,
      });
      if (
        legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath
        && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath)
      ) {
        legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
          directiveRoot: input.directiveRoot,
          runtimeRecordPath: legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath,
        });
      }
      if (
        legacyRuntimeLiveFetchProof.linkedProofChecklistPath
        && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchProof.linkedProofChecklistPath)
      ) {
        legacyRuntimeProofChecklist = readGenericLegacyRuntimeProofChecklistArtifact({
          directiveRoot: input.directiveRoot,
          proofChecklistPath: legacyRuntimeLiveFetchProof.linkedProofChecklistPath,
        });
      }
    }
  } else if (
    relativePath.startsWith("runtime/records/")
    && (relativePath.endsWith("-live-qualified-pool.json") || relativePath.endsWith("-live-degraded-pool.json"))
  ) {
    legacyRuntimeLivePoolArtifact = readGenericLegacyRuntimeLivePoolArtifact({
      directiveRoot: input.directiveRoot,
      livePoolPath: relativePath,
    });
    artifactKind = "runtime_live_pool_artifact_legacy";
    if (
      legacyRuntimeLivePoolArtifact.linkedGateSnapshotPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLivePoolArtifact.linkedGateSnapshotPath)
    ) {
      legacyRuntimeLiveFetchGateSnapshot = readGenericLegacyRuntimeLiveFetchGateSnapshotArtifact({
        directiveRoot: input.directiveRoot,
        gateSnapshotPath: legacyRuntimeLivePoolArtifact.linkedGateSnapshotPath,
      });
    }
    if (
      legacyRuntimeLivePoolArtifact.linkedLiveFetchProofPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLivePoolArtifact.linkedLiveFetchProofPath)
    ) {
      legacyRuntimeLiveFetchProof = readGenericLegacyRuntimeLiveFetchProofArtifact({
        directiveRoot: input.directiveRoot,
        liveFetchProofPath: legacyRuntimeLivePoolArtifact.linkedLiveFetchProofPath,
      });
      if (
        legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath
        && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath)
      ) {
        legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
          directiveRoot: input.directiveRoot,
          runtimeRecordPath: legacyRuntimeLiveFetchProof.linkedRuntimeRecordPath,
        });
      }
      if (
        legacyRuntimeLiveFetchProof.linkedProofChecklistPath
        && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeLiveFetchProof.linkedProofChecklistPath)
      ) {
        legacyRuntimeProofChecklist = readGenericLegacyRuntimeProofChecklistArtifact({
          directiveRoot: input.directiveRoot,
          proofChecklistPath: legacyRuntimeLiveFetchProof.linkedProofChecklistPath,
        });
      }
    }
  } else if (
    relativePath.startsWith("runtime/records/")
    && (
      relativePath.endsWith("-qualified-pool-sample.json")
      || relativePath.endsWith("-degraded-quality-sample.json")
    )
  ) {
    legacyRuntimeSamplePoolArtifact = readGenericLegacyRuntimeSamplePoolArtifact({
      directiveRoot: input.directiveRoot,
      samplePoolPath: relativePath,
    });
    artifactKind = "runtime_sample_pool_artifact_legacy";
  } else if (
    relativePath.startsWith("runtime/records/")
    && /-runtime-system-bundle-\d{2}-.*\.md$/u.test(relativePath)
  ) {
    legacyRuntimeSystemBundleArtifact = readGenericLegacyRuntimeSystemBundleArtifact({
      directiveRoot: input.directiveRoot,
      systemBundlePath: relativePath,
    });
    artifactKind = "runtime_system_bundle_note_legacy";
  } else if (
    relativePath.startsWith("runtime/records/")
    && /-agentics-docs-maintenance-validation(?:-rerun)?\.md$/u.test(relativePath)
  ) {
    legacyRuntimeValidationNoteArtifact = readGenericLegacyRuntimeValidationNoteArtifact({
      directiveRoot: input.directiveRoot,
      validationNotePath: relativePath,
    });
    artifactKind = "runtime_validation_note_legacy";
  } else if (
    relativePath.startsWith("runtime/records/")
    && /-(cli-precondition-proof|precondition-correction|host-adapter-decision)\.md$/u.test(relativePath)
  ) {
    legacyRuntimePreconditionDecisionNoteArtifact = readGenericLegacyRuntimePreconditionDecisionNoteArtifact({
      directiveRoot: input.directiveRoot,
      notePath: relativePath,
    });
    artifactKind = "runtime_precondition_decision_note_legacy";
  } else if (
    relativePath.startsWith("runtime/records/")
    && (
      relativePath.endsWith("-runtime-record.md")
      || /-reentry-preconditions-slice-\d+\.md$/u.test(relativePath)
    )
  ) {
    legacyRuntimeRecord = readGenericLegacyRuntimeRecordArtifact({
      directiveRoot: input.directiveRoot,
      runtimeRecordPath: relativePath,
    });
    artifactKind = "runtime_record_legacy";
  } else if (relativePath.startsWith("runtime/records/") && relativePath.endsWith("-transformation-record.md")) {
    legacyRuntimeTransformationRecord = readGenericLegacyRuntimeTransformationRecordArtifact({
      directiveRoot: input.directiveRoot,
      transformationRecordPath: relativePath,
    });
    artifactKind = "runtime_transformation_record_legacy";
    if (
      legacyRuntimeTransformationRecord.promotionRecordPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeTransformationRecord.promotionRecordPath)
    ) {
      legacyRuntimePromotionRecord = readGenericLegacyRuntimePromotionRecordArtifact({
        directiveRoot: input.directiveRoot,
        promotionRecordPath: legacyRuntimeTransformationRecord.promotionRecordPath,
      });
    }
  } else if (relativePath.startsWith("runtime/records/") && relativePath.endsWith("-transformation-proof.json")) {
    legacyRuntimeTransformationProof = readGenericLegacyRuntimeTransformationProofArtifact({
      directiveRoot: input.directiveRoot,
      transformationProofPath: relativePath,
    });
    artifactKind = "runtime_transformation_proof_legacy";
    if (
      legacyRuntimeTransformationProof.linkedTransformationRecordPath
      && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeTransformationProof.linkedTransformationRecordPath)
    ) {
      legacyRuntimeTransformationRecord = readGenericLegacyRuntimeTransformationRecordArtifact({
        directiveRoot: input.directiveRoot,
        transformationRecordPath: legacyRuntimeTransformationProof.linkedTransformationRecordPath,
      });
      if (
        legacyRuntimeTransformationRecord.promotionRecordPath
        && fileExistsInDirectiveWorkspace(input.directiveRoot, legacyRuntimeTransformationRecord.promotionRecordPath)
      ) {
        legacyRuntimePromotionRecord = readGenericLegacyRuntimePromotionRecordArtifact({
          directiveRoot: input.directiveRoot,
          promotionRecordPath: legacyRuntimeTransformationRecord.promotionRecordPath,
        });
      }
    }
  } else if (relativePath.startsWith("runtime/registry/") && relativePath.endsWith("-registry-entry.md")) {
    legacyRuntimeRegistry = readGenericLegacyRuntimeRegistryArtifact({
      directiveRoot: input.directiveRoot,
      registryEntryPath: relativePath,
    });
    artifactKind = "runtime_registry_legacy";
  } else if (relativePath.startsWith("runtime/promotion-records/") && relativePath.endsWith("-promotion-record.md")) {
    legacyRuntimePromotionRecord = readGenericLegacyRuntimePromotionRecordArtifact({
      directiveRoot: input.directiveRoot,
      promotionRecordPath: relativePath,
    });
    artifactKind = "runtime_promotion_record_legacy";
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
    ?? legacyFollowUp?.candidateId
    ?? legacyHandoff?.candidateId
    ?? legacyRuntimeSystemBundleArtifact?.candidateId
    ?? legacyRuntimeValidationNoteArtifact?.candidateId
    ?? legacyRuntimePreconditionDecisionNoteArtifact?.candidateId
    ?? legacyRuntimeSamplePoolArtifact?.candidateId
    ?? legacyRuntimeLivePoolArtifact?.candidateId
    ?? legacyRuntimeLiveFetchGateSnapshot?.candidateId
    ?? legacyRuntimeLiveFetchProof?.candidateId
    ?? legacyRuntimeProofChecklist?.candidateId
    ?? legacyRuntimeSliceExecution?.candidateId
    ?? legacyRuntimeSliceProof?.candidateId
    ?? legacyRuntimeRecord?.candidateId
    ?? legacyRuntimeTransformationRecord?.candidateId
    ?? legacyRuntimeTransformationProof?.candidateId
    ?? legacyRuntimeRegistry?.candidateId
    ?? legacyRuntimePromotionRecord?.candidateId
    ?? callableIntegration?.candidateId
    ?? null;
  const candidateName =
    promotionReadiness?.candidateName
    ?? runtimeProof?.candidateName
    ?? runtimeRecord?.candidateName
    ?? followUp?.candidateName
    ?? legacyFollowUp?.candidateName
    ?? legacyHandoff?.candidateName
    ?? legacyRuntimeSystemBundleArtifact?.candidateName
    ?? legacyRuntimeValidationNoteArtifact?.candidateName
    ?? legacyRuntimePreconditionDecisionNoteArtifact?.candidateName
    ?? legacyRuntimeSamplePoolArtifact?.candidateName
    ?? legacyRuntimeLivePoolArtifact?.candidateName
    ?? legacyRuntimeLiveFetchGateSnapshot?.candidateName
    ?? legacyRuntimeLiveFetchProof?.candidateName
    ?? legacyRuntimeProofChecklist?.candidateName
    ?? legacyRuntimeSliceExecution?.candidateName
    ?? legacyRuntimeSliceProof?.candidateName
    ?? legacyRuntimeRecord?.candidateName
    ?? legacyRuntimeTransformationRecord?.candidateName
    ?? legacyRuntimeTransformationProof?.candidateId
    ?? legacyRuntimeRegistry?.candidateName
    ?? legacyRuntimePromotionRecord?.candidateName
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
    legacyFollowUp,
    legacyHandoff,
    legacyRuntimeSystemBundleArtifact,
    legacyRuntimeValidationNoteArtifact,
    legacyRuntimePreconditionDecisionNoteArtifact,
    legacyRuntimeSamplePoolArtifact,
    legacyRuntimeLivePoolArtifact,
    legacyRuntimeLiveFetchGateSnapshot,
    legacyRuntimeLiveFetchProof,
    legacyRuntimeProofChecklist,
    legacyRuntimeSliceProof,
    legacyRuntimeSliceExecution,
    legacyProposedHost:
      legacyFollowUp?.proposedHost
      ?? legacyHandoff?.proposedHost
      ?? legacyRuntimeRecord?.proposedHost
      ?? legacyRuntimePromotionRecord?.targetHost
      ?? legacyRuntimeRegistry?.proposedHost
      ?? null,
    legacyRuntimeRecord,
    legacyRuntimeTransformationRecord,
    legacyRuntimeTransformationProof,
    legacyRuntimeRegistry,
    legacyRuntimePromotionRecord,
    runtimeRecord,
    runtimeProof,
    capabilityBoundary,
    promotionReadiness,
    callableIntegration,
    ...(legacyFollowUp
      ? buildLegacyRuntimeFollowUpState({
          directiveRoot: input.directiveRoot,
          legacyFollowUp,
        })
      : legacyRuntimeSystemBundleArtifact
        ? buildLegacyRuntimeSystemBundleState()
      : legacyRuntimeValidationNoteArtifact
        ? buildLegacyRuntimeValidationNoteState()
      : legacyRuntimePreconditionDecisionNoteArtifact
        ? buildLegacyRuntimePreconditionDecisionNoteState({
            directiveRoot: input.directiveRoot,
            legacyRuntimePreconditionDecisionNote: legacyRuntimePreconditionDecisionNoteArtifact,
          })
      : legacyRuntimeSamplePoolArtifact
        ? buildLegacyRuntimeSamplePoolArtifactState({
            legacyRuntimeSamplePoolArtifact,
          })
      : legacyRuntimeLivePoolArtifact
        ? buildLegacyRuntimeLivePoolArtifactState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeLivePoolArtifact,
            legacyRuntimeLiveFetchGateSnapshot,
            legacyRuntimeLiveFetchProof,
            legacyRuntimeRecord,
          })
      : legacyRuntimeLiveFetchGateSnapshot
        ? buildLegacyRuntimeLiveFetchGateSnapshotState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeLiveFetchGateSnapshot,
            legacyRuntimeLiveFetchProof,
            legacyRuntimeRecord,
          })
      : legacyHandoff
        ? buildLegacyRuntimeHandoffState({
            directiveRoot: input.directiveRoot,
            legacyHandoff,
          })
      : legacyRuntimeLiveFetchProof
        ? buildLegacyRuntimeLiveFetchProofState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeLiveFetchProof,
            legacyRuntimeRecord,
            legacyRuntimeProofChecklist,
          })
      : legacyRuntimeProofChecklist
        ? buildLegacyRuntimeProofChecklistState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeProofChecklist,
            legacyRuntimeRecord,
            legacyRuntimeSliceProof,
          })
      : legacyRuntimeSliceExecution
        ? buildLegacyRuntimeSliceExecutionState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeSliceExecution,
            legacyRuntimeSliceProof,
          })
      : legacyRuntimeSliceProof
        ? buildLegacyRuntimeSliceProofState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeSliceProof,
            legacyRuntimeRecord,
          })
      : legacyRuntimeRecord
        ? buildLegacyRuntimeRecordState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeRecord,
          })
      : legacyRuntimeTransformationProof
        ? buildLegacyRuntimeTransformationProofState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeTransformationProof,
            legacyRuntimeTransformationRecord,
          })
      : legacyRuntimeTransformationRecord
        ? buildLegacyRuntimeTransformationRecordState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeTransformationRecord,
          })
      : legacyRuntimeRegistry
        ? buildLegacyRuntimeRegistryState({
            directiveRoot: input.directiveRoot,
            legacyRuntimeRegistry,
          })
      : legacyRuntimePromotionRecord
        ? buildLegacyRuntimePromotionRecordState({
            directiveRoot: input.directiveRoot,
            legacyRuntimePromotionRecord,
          })
      : buildRuntimeState({
          directiveRoot: input.directiveRoot,
          followUp,
          runtimeRecord,
          runtimeProof,
          capabilityBoundary,
          promotionReadiness,
          callableIntegration,
        })),
  };
}


