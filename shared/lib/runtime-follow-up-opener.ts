import fs from "node:fs";
import path from "node:path";

import {
  normalizeDirectiveApprovalActor,
  requireDirectiveCurrentStageForOpening,
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveEligibleStatus,
  requireDirectiveExplicitApproval,
  requireDirectiveString,
  resolveDirectiveWorkspaceRelativePath,
} from "../../engine/approval-boundary.ts";
import { appendDirectiveCaseMirrorEvents, readDirectiveCaseMirrorEvents } from "./case-event-log.ts";
import {
  mirrorDirectiveRuntimeFollowUpOpen,
  readDirectiveMirroredDiscoveryCaseRecord,
  writeDirectiveMirroredDiscoveryCaseRecord,
} from "./case-store.ts";
import { resolveDirectiveWorkspaceState } from "./dw-state.ts";
import {
  writeDirectiveRuntimeFollowUpOpenProjectionSet,
  type DirectiveMirroredRuntimeFollowUpOpenProjectionInput,
} from "./runtime-follow-up-projections.ts";

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}

function optionalString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === "n/a" || normalized.toLowerCase() === "pending") {
    return null;
  }
  return normalized;
}

function readUtf8(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function extractOptionalBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    return null;
  }
  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
}

function readDirectiveRuntimeRoutingBackfillCompat(input: {
  directiveRoot: string;
  routingPath: string;
}) {
  const routingRelativePath = resolveDirectiveWorkspaceRelativePath(
    input.directiveRoot,
    input.routingPath,
    "routingPath",
  );
  const routingAbsolutePath = path.resolve(input.directiveRoot, routingRelativePath).replace(/\\/g, "/");
  const content = readUtf8(routingAbsolutePath);

  return {
    sourceType: extractBulletValue(content, "Source type"),
    decisionState: extractBulletValue(content, "Decision state"),
    linkedIntakeRecord: extractBulletValue(content, "Linked intake record"),
    linkedTriageRecord: extractOptionalBulletValue(content, "Linked triage record"),
    routingRelativePath,
    engineRunRecordPath: null,
    engineRunReportPath: null,
  };
}

function extractMarkdownTitle(markdown: string) {
  return requireDirectiveString(
    markdown
      .split(/\r?\n/)
      .find((entry) => entry.startsWith("# "))
      ?.replace(/^# /, ""),
    "follow-up title",
  );
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    throw new Error(`invalid_input: missing "${label}" in Runtime follow-up record`);
  }
  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
}

function extractBulletList(markdown: string, label: string) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex((entry) => entry.trim() === `- ${label}:`);
  if (startIndex === -1) {
    throw new Error(`invalid_input: missing "${label}" list in Runtime follow-up record`);
  }

  const values: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("  - ")) {
      break;
    }
    const normalized = line.replace(/^  - /, "").trim().replace(/^`|`$/g, "");
    if (normalized) {
      values.push(normalized);
    }
  }
  return values;
}

function extractLinkedSinglePath(markdown: string, label: string) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex((entry) => entry.trim() === `${label}:`);
  if (startIndex === -1) {
    return null;
  }

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      continue;
    }
    if (!line.startsWith("- ")) {
      break;
    }
    return optionalString(line.replace(/^- /, "").trim().replace(/^`|`$/g, ""));
  }

  return null;
}

export type DirectiveRuntimeFollowUpArtifact = {
  title: string;
  candidateId: string;
  candidateName: string;
  followUpDate: string;
  currentDecisionState: string;
  originTrack: string;
  runtimeValueToOperationalize: string;
  proposedHost: string;
  proposedIntegrationMode: string;
  allowedExportSurfaces: string[];
  excludedBaggage: string[];
  requiredProof: string[];
  requiredGates: string[];
  risks: string[];
  rollback: string;
  noOpPath: string;
  reviewCadence: string;
  currentStatus: string;
  linkedHandoffPath: string | null;
  followUpRelativePath: string;
  followUpAbsolutePath: string;
  runtimeRecordRelativePath: string;
  runtimeRecordAbsolutePath: string;
  runtimeProofRelativePath: string;
  approvalAllowed: boolean;
  runtimeRecordExists: boolean;
  content: string;
};

export type DirectiveRuntimeFollowUpOpenResult = {
  ok: true;
  created: boolean;
  directiveRoot: string;
  followUpRelativePath: string;
  runtimeRecordRelativePath: string;
  runtimeRecordAbsolutePath: string;
  candidateId: string;
  candidateName: string;
};

function buildRuntimeRecordRelativePath(input: {
  followUpDate: string;
  candidateId: string;
}) {
  return normalizeRelativePath(
    path.join(
      "runtime",
      "02-records",
      `${input.followUpDate}-${input.candidateId}-runtime-record.md`,
    ),
  );
}

function buildRuntimeProofRelativePath(input: {
  followUpDate: string;
  candidateId: string;
}) {
  return normalizeRelativePath(
    path.join(
      "runtime",
      "03-proof",
      `${input.followUpDate}-${input.candidateId}-proof.md`,
    ),
  );
}

type DirectiveDiscoveryIntakeQueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  status: string;
  routing_target: string | null;
  intake_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
  operating_mode?: string | null;
};

function buildRuntimeFollowUpOpenProjectionInput(input: {
  artifact: DirectiveRuntimeFollowUpArtifact;
  approvedBy: string;
  snapshotAt: string;
}): DirectiveMirroredRuntimeFollowUpOpenProjectionInput {
  return {
    snapshotAt: input.snapshotAt,
    approvedBy: input.approvedBy,
    followUpDate: input.artifact.followUpDate,
    candidateId: input.artifact.candidateId,
    candidateName: input.artifact.candidateName,
    followUpRelativePath: input.artifact.followUpRelativePath,
    runtimeRecordRelativePath: input.artifact.runtimeRecordRelativePath,
    runtimeProofRelativePath: input.artifact.runtimeProofRelativePath,
    currentDecisionState: input.artifact.currentDecisionState,
    originTrack: input.artifact.originTrack,
    runtimeValueToOperationalize: input.artifact.runtimeValueToOperationalize,
    proposedHost: input.artifact.proposedHost,
    proposedIntegrationMode: input.artifact.proposedIntegrationMode,
    allowedExportSurfaces: input.artifact.allowedExportSurfaces,
    excludedBaggage: input.artifact.excludedBaggage,
    requiredProof: input.artifact.requiredProof,
    requiredGates: input.artifact.requiredGates,
    risks: input.artifact.risks,
    rollback: input.artifact.rollback,
    noOpPath: input.artifact.noOpPath,
    reviewCadence: input.artifact.reviewCadence,
    linkedHandoffPath: input.artifact.linkedHandoffPath,
  };
}

export function readDirectiveRuntimeFollowUpArtifact(input: {
  followUpPath: string;
  directiveRoot?: string;
}): DirectiveRuntimeFollowUpArtifact {
  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const followUpRelativePath = resolveDirectiveWorkspaceRelativePath(
    directiveRoot,
    input.followUpPath,
    "followUpPath",
  );

  if (
    !followUpRelativePath.startsWith("runtime/follow-up/")
    || !followUpRelativePath.endsWith("-runtime-follow-up-record.md")
  ) {
    throw new Error("invalid_input: followUpPath must point to runtime/follow-up/*-runtime-follow-up-record.md");
  }

  const followUpAbsolutePath = path.resolve(directiveRoot, followUpRelativePath).replace(/\\/g, "/");
  if (!fs.existsSync(followUpAbsolutePath)) {
    throw new Error(`invalid_input: followUpPath not found: ${followUpRelativePath}`);
  }

  const content = readUtf8(followUpAbsolutePath);
  const candidateId = extractBulletValue(content, "Candidate id");
  const followUpDate = extractBulletValue(content, "Follow-up date");
  const runtimeRecordRelativePath = buildRuntimeRecordRelativePath({
    followUpDate,
    candidateId,
  });
  const runtimeRecordAbsolutePath = path.resolve(directiveRoot, runtimeRecordRelativePath).replace(/\\/g, "/");

  const currentStatus = extractBulletValue(content, "Current status");

  const artifact: DirectiveRuntimeFollowUpArtifact = {
    title: extractMarkdownTitle(content),
    candidateId,
    candidateName: extractBulletValue(content, "Candidate name"),
    followUpDate,
    currentDecisionState: extractBulletValue(content, "Current decision state"),
    originTrack: extractBulletValue(content, "Origin track"),
    runtimeValueToOperationalize: extractBulletValue(content, "Runtime value to operationalize"),
    proposedHost: extractBulletValue(content, "Proposed host"),
    proposedIntegrationMode: extractBulletValue(content, "Proposed integration mode"),
    allowedExportSurfaces: extractBulletList(content, "Allowed export surfaces"),
    excludedBaggage: extractBulletList(content, "Excluded baggage"),
    requiredProof: extractBulletList(content, "Required proof"),
    requiredGates: extractBulletList(content, "Required gates"),
    risks: extractBulletList(content, "Risks"),
    rollback: extractBulletValue(content, "Rollback"),
    noOpPath: extractBulletValue(content, "No-op path"),
    reviewCadence: extractBulletValue(content, "Review cadence"),
    currentStatus,
    linkedHandoffPath: extractLinkedSinglePath(content, "Linked handoff"),
    followUpRelativePath,
    followUpAbsolutePath,
    runtimeRecordRelativePath,
    runtimeRecordAbsolutePath,
    runtimeProofRelativePath: buildRuntimeProofRelativePath({
      followUpDate,
      candidateId,
    }),
    approvalAllowed: currentStatus === "pending_review",
    runtimeRecordExists: fs.existsSync(runtimeRecordAbsolutePath),
    content,
  };

  return artifact;
}

export function openDirectiveRuntimeFollowUp(input: {
  followUpPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
}): DirectiveRuntimeFollowUpOpenResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "open a Runtime follow-up",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveRuntimeFollowUpArtifact({
    directiveRoot,
    followUpPath: input.followUpPath,
  });

  requireDirectiveCurrentStageForOpening({
    directiveRoot,
    artifactPath: artifact.followUpRelativePath,
    subject: "Runtime follow-up",
    allowedCurrentStages: ["runtime.follow_up."],
  });
  requireDirectiveEligibleStatus({
    subject: "Runtime follow-up",
    currentStatus: artifact.currentStatus,
    allowedStatuses: ["pending_review"],
    action: "open downstream work",
  });

  const approvedBy = normalizeDirectiveApprovalActor(input.approvedBy);
  const snapshotAt = new Date().toISOString();
  const created = !artifact.runtimeRecordExists;

  const mirrored = readDirectiveMirroredDiscoveryCaseRecord({
    directiveRoot,
    caseId: artifact.candidateId,
  });
  if (!mirrored.record) {
    const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
    const queueDocument = fs.existsSync(queuePath)
      ? readJson<{ entries: DirectiveDiscoveryIntakeQueueEntry[] }>(queuePath)
      : null;
    const queueEntry =
      queueDocument?.entries.find((entry) => entry.candidate_id === artifact.candidateId)
      ?? null;
    const routingPath =
      queueEntry?.routing_record_path
      ?? artifact.linkedHandoffPath
      ?? null;
    if (!routingPath) {
      throw new Error(
        `invalid_state: unable to backfill mirrored Runtime case for ${artifact.candidateId} without a routing record`,
      );
    }
    const routing = readDirectiveRuntimeRoutingBackfillCompat({
      directiveRoot,
      routingPath,
    });
    writeDirectiveMirroredDiscoveryCaseRecord({
      directiveRoot,
      record: {
        schemaVersion: 1,
        mirrorKind: "discovery_front_door_submission",
        caseId: artifact.candidateId,
        candidateId: artifact.candidateId,
        candidateName: artifact.candidateName,
        sourceType: queueEntry?.source_type ?? routing.sourceType,
        sourceReference: queueEntry?.source_reference ?? artifact.followUpRelativePath,
        decisionState: artifact.currentDecisionState,
        routeTarget: "runtime",
        operatingMode: queueEntry?.operating_mode ?? null,
        queueStatus: queueEntry?.status ?? "routed",
        createdAt: `${artifact.followUpDate}T00:00:00.000Z`,
        updatedAt: snapshotAt,
        linkedArtifacts: {
          intakeRecordPath: queueEntry?.intake_record_path ?? routing.linkedIntakeRecord ?? null,
          triageRecordPath: routing.linkedTriageRecord,
          routingRecordPath: queueEntry?.routing_record_path ?? routing.routingRelativePath,
          engineRunRecordPath: routing.engineRunRecordPath,
          engineRunReportPath: routing.engineRunReportPath,
          runtimeFollowUpPath: artifact.followUpRelativePath,
          runtimeRecordPath: artifact.runtimeRecordRelativePath,
          runtimeProofPath: artifact.runtimeProofRelativePath,
          resultRecordPath: queueEntry?.result_record_path ?? artifact.followUpRelativePath,
        },
        projectionInputs: null,
      },
    });
  }

  mirrorDirectiveRuntimeFollowUpOpen({
    directiveRoot,
    caseId: artifact.candidateId,
    receivedAt: snapshotAt,
    queueStatus: mirrored.record?.queueStatus ?? "routed",
    linkedArtifacts: {
      runtimeFollowUpPath: artifact.followUpRelativePath,
      runtimeRecordPath: artifact.runtimeRecordRelativePath,
      runtimeProofPath: artifact.runtimeProofRelativePath,
      resultRecordPath: mirrored.record?.linkedArtifacts.resultRecordPath ?? artifact.followUpRelativePath,
    },
    projectionInput: buildRuntimeFollowUpOpenProjectionInput({
      artifact,
      approvedBy,
      snapshotAt,
    }),
  });

  const projectionSet = writeDirectiveRuntimeFollowUpOpenProjectionSet({
    directiveRoot,
    caseId: artifact.candidateId,
  });
  if (!projectionSet.ok) {
    throw new Error(
      `invalid_state: unable to generate Runtime follow-up projections for ${artifact.candidateId}: ${projectionSet.reason}`,
    );
  }

  const resolvedState = resolveDirectiveWorkspaceState({
    directiveRoot,
    artifactPath: artifact.runtimeRecordRelativePath,
  });
  if (resolvedState.focus?.ok) {
    const currentMirror = readDirectiveMirroredDiscoveryCaseRecord({
      directiveRoot,
      caseId: artifact.candidateId,
    });
    const eventLog = readDirectiveCaseMirrorEvents({
      directiveRoot,
      caseId: artifact.candidateId,
    });
    const nextSequence = eventLog.events.reduce(
      (highest, event) => Math.max(highest, event.sequence),
      0,
    ) + 1;
    appendDirectiveCaseMirrorEvents({
      directiveRoot,
      caseId: artifact.candidateId,
      events: [
        {
          schemaVersion: 1,
          eventId: `${artifact.candidateId}:state_materialized:runtime_follow_up_open:v1`,
          caseId: artifact.candidateId,
          candidateId: artifact.candidateId,
          candidateName: artifact.candidateName,
          sequence: nextSequence,
          eventType: "state_materialized",
          occurredAt: snapshotAt,
          queueStatus: resolvedState.focus.discovery.queueStatus,
          routeTarget: resolvedState.focus.routeTarget,
          operatingMode: resolvedState.focus.discovery.operatingMode,
          linkedArtifactPath: resolvedState.focus.currentHead.artifactPath,
          decisionState: currentMirror.record?.decisionState ?? artifact.currentDecisionState,
          currentHeadPath: resolvedState.focus.currentHead.artifactPath,
          currentStage: resolvedState.focus.currentStage,
          nextLegalStep: resolvedState.focus.nextLegalStep,
        },
      ],
    });
  }

  return {
    ok: true,
    created,
    directiveRoot,
    followUpRelativePath: artifact.followUpRelativePath,
    runtimeRecordRelativePath: artifact.runtimeRecordRelativePath,
    runtimeRecordAbsolutePath: artifact.runtimeRecordAbsolutePath,
    candidateId: artifact.candidateId,
    candidateName: artifact.candidateName,
  };
}
