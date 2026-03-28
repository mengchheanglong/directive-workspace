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
  writeDirectiveArtifactIfMissing,
} from "../../engine/approval-boundary.ts";

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

function toSentenceCase(value: string) {
  return value.replace(/[_-]+/g, " ").trim();
}

function renderListOrPlaceholder(values: string[], placeholder = "  - n/a") {
  if (values.length === 0) {
    return placeholder;
  }
  return values.map((value) => `  - ${value}`).join("\n");
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

function renderRuntimeV0Record(input: {
  artifact: DirectiveRuntimeFollowUpArtifact;
  approvedBy: string;
}) {
  const capabilityShape = input.artifact.allowedExportSurfaces.length > 0
    ? input.artifact.allowedExportSurfaces
    : ["bounded runtime capability"];
  const boundedSurface = capabilityShape
    .map((value) => `\`${value}\``)
    .join(", ");
  const proofSummary = input.artifact.requiredProof.length > 0
    ? input.artifact.requiredProof.join("; ")
    : "n/a";

  return `# Runtime V0 Record: ${input.artifact.candidateName} (${input.artifact.followUpDate})

## follow-up review decision
- Candidate id: \`${input.artifact.candidateId}\`
- Candidate name: \`${input.artifact.candidateName}\`
- Source follow-up record: \`${input.artifact.followUpRelativePath}\`
- Review decision: \`approved_for_bounded_runtime_conversion_record\`
- Reviewed by: \`${input.approvedBy}\`
- Review date: \`${input.artifact.followUpDate}\`
- Current status: \`pending_proof_boundary\`

## bounded runtime usefulness
- Runtime value to operationalize: ${input.artifact.runtimeValueToOperationalize}
- Proposed host: \`${input.artifact.proposedHost}\`
- Proposed integration mode: ${toSentenceCase(input.artifact.proposedIntegrationMode)}
- Reusable capability target surface: ${boundedSurface}
- Origin track: \`${input.artifact.originTrack}\`
- Source decision state: \`${input.artifact.currentDecisionState}\`

## expected effect
- Convert this approved Runtime follow-up into one explicit Directive-owned runtime-capability record without opening execution, host integration, or automation.
- Keep the capability bounded to the follow-up objective and the approved reusable export surface only.

## proof required before any further Runtime move
- Required proof summary: ${proofSummary}
- Required proof:
${renderListOrPlaceholder(input.artifact.requiredProof)}
- Required gates:
${renderListOrPlaceholder(input.artifact.requiredGates.map((value) => `\`${value}\``))}

## validation boundary
- Validate against the approved Runtime follow-up record, linked Discovery routing record, and Engine evidence only.
- Do not imply runtime execution, host integration, orchestration, or background automation.
- Keep excluded baggage out of the converted capability boundary:
${renderListOrPlaceholder(input.artifact.excludedBaggage)}

## rollback boundary
- Rollback: ${input.artifact.rollback}
- No-op path: ${input.artifact.noOpPath}
- Review cadence: ${input.artifact.reviewCadence}

## known risks
${renderListOrPlaceholder(input.artifact.risks)}

## artifact linkage
- Runtime v0 record: \`${input.artifact.runtimeRecordRelativePath}\`
- Source Runtime follow-up record: \`${input.artifact.followUpRelativePath}\`
${input.artifact.linkedHandoffPath ? `- Linked Discovery routing record: \`${input.artifact.linkedHandoffPath}\`\n` : ""}- Next Runtime proof artifact if later approved: \`${input.artifact.runtimeProofRelativePath}\`

## boundary
- This record does not authorize execution.
- This record does not open host integration.
- This record only records that the follow-up has been explicitly reviewed and opened into one bounded non-executing Runtime artifact.
`;
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
  const created = writeDirectiveArtifactIfMissing({
    absolutePath: artifact.runtimeRecordAbsolutePath,
    content: renderRuntimeV0Record({
      artifact,
      approvedBy,
    }),
  });

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
