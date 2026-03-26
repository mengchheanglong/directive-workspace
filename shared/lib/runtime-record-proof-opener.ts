import fs from "node:fs";
import path from "node:path";

import {
  normalizeDirectiveApprovalActor,
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveEligibleStatus,
  requireDirectiveExplicitApproval,
  requireDirectiveString,
  resolveDirectiveWorkspaceRelativePath,
  writeDirectiveArtifactIfMissing,
} from "../../engine/approval-boundary.ts";
import {
  readDirectiveRuntimeFollowUpArtifact,
  type DirectiveRuntimeFollowUpArtifact,
} from "./runtime-follow-up-opener.ts";

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
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
    "runtime record title",
  );
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    throw new Error(`invalid_input: missing "${label}" in Runtime v0 record`);
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
    return [];
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

function buildRuntimeProofRelativePath(input: {
  runtimeRecordDate: string;
  candidateId: string;
}) {
  return normalizeRelativePath(
    path.join(
      "runtime",
      "03-proof",
      `${input.runtimeRecordDate}-${input.candidateId}-proof.md`,
    ),
  );
}

function renderListOrPlaceholder(values: string[], placeholder = "  - n/a") {
  if (values.length === 0) {
    return placeholder;
  }
  return values.map((value) => `  - ${value}`).join("\n");
}

export type DirectiveRuntimeRecordArtifact = {
  title: string;
  candidateId: string;
  candidateName: string;
  runtimeRecordDate: string;
  originPath: string;
  linkedFollowUpRecord: string;
  runtimeObjective: string;
  proposedHost: string;
  proposedRuntimeSurface: string;
  requiredProofSummary: string;
  requiredGates: string[];
  risks: string[];
  rollback: string;
  currentStatus: string;
  nextDecisionPoint: string;
  runtimeRecordRelativePath: string;
  runtimeRecordAbsolutePath: string;
  runtimeProofRelativePath: string;
  runtimeProofAbsolutePath: string;
  proofExists: boolean;
  approvalAllowed: boolean;
  content: string;
  followUpArtifact: DirectiveRuntimeFollowUpArtifact;
};

export type DirectiveRuntimeRecordProofOpenResult = {
  ok: true;
  created: boolean;
  directiveRoot: string;
  runtimeRecordRelativePath: string;
  runtimeProofRelativePath: string;
  runtimeProofAbsolutePath: string;
  candidateId: string;
  candidateName: string;
};

function renderRuntimeV0ProofArtifact(input: {
  artifact: DirectiveRuntimeRecordArtifact;
  approvedBy: string;
}) {
  const followUp = input.artifact.followUpArtifact;

  return `# Runtime V0 Proof Artifact: ${input.artifact.candidateName} (${input.artifact.runtimeRecordDate})

## runtime record identity
- Candidate id: \`${input.artifact.candidateId}\`
- Candidate name: \`${input.artifact.candidateName}\`
- Runtime v0 record path: \`${input.artifact.runtimeRecordRelativePath}\`
- Source follow-up record path: \`${input.artifact.linkedFollowUpRecord}\`
- Proof opening decision: \`approved_for_bounded_proof_artifact\`
- Opened by: \`${input.approvedBy}\`
- Opened on: \`${input.artifact.runtimeRecordDate}\`
- Current status: \`proof_scope_opened\`

## source inputs required
- Runtime v0 record: \`${input.artifact.runtimeRecordRelativePath}\`
- Source Runtime follow-up record: \`${input.artifact.linkedFollowUpRecord}\`
${followUp.linkedHandoffPath ? `- Linked Discovery routing record: \`${followUp.linkedHandoffPath}\`\n` : ""}- Runtime objective: ${input.artifact.runtimeObjective}
- Proposed host: \`${input.artifact.proposedHost}\`
- Proposed runtime surface: ${input.artifact.proposedRuntimeSurface}

## what must be proven before bounded runtime conversion
${renderListOrPlaceholder(followUp.requiredProof)}

## expected outputs
- One bounded Runtime proof artifact that keeps the runtime-usefulness conversion scope inspectable and non-executing.
- One explicit proof boundary that preserves the approved Runtime record objective, required gates, and rollback boundary.
- No runtime execution, no host integration, no callable implementation, and no promotion record creation from this step.

## validation method
- Artifact inspection only.
- Confirm the Runtime v0 record and source follow-up record describe the same bounded runtime objective and reversible boundary.
- Confirm the required proof items and gates remain explicit and do not require hidden runtime context.
- Reject proof readiness if host integration, execution, or orchestration would need to be inferred from outside the existing Runtime artifacts.

## minimal success criteria
- The runtime objective is explicit and remains bounded to reusable runtime usefulness conversion.
- Required proof items are explicit and reviewable.
- Required gates are explicit and bounded:
${renderListOrPlaceholder(input.artifact.requiredGates.map((value) => `\`${value}\``))}
- Rollback remains explicit and returns cleanly to the Runtime v0 record and follow-up record.
- Excluded baggage remains outside the proof boundary:
${renderListOrPlaceholder(followUp.excludedBaggage)}

## proof opening boundary
- Source record status: \`${input.artifact.currentStatus}\`
- Next decision point from Runtime v0 record: ${input.artifact.nextDecisionPoint}
- This artifact opens bounded proof review only. It does not authorize execution, host integration, or promotion.

## rollback boundary
- Rollback: ${input.artifact.rollback}
- No-op path: ${followUp.noOpPath}
- Review cadence: ${followUp.reviewCadence}

## artifact linkage
- Runtime proof artifact: \`${input.artifact.runtimeProofRelativePath}\`
- Runtime v0 record: \`${input.artifact.runtimeRecordRelativePath}\`
- Source Runtime follow-up record: \`${input.artifact.linkedFollowUpRecord}\`
${followUp.linkedHandoffPath ? `- Linked Discovery routing record: \`${followUp.linkedHandoffPath}\`\n` : ""}`;
}

export function readDirectiveRuntimeRecordArtifact(input: {
  runtimeRecordPath: string;
  directiveRoot?: string;
}): DirectiveRuntimeRecordArtifact {
  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const runtimeRecordRelativePath = resolveDirectiveWorkspaceRelativePath(
    directiveRoot,
    input.runtimeRecordPath,
    "runtimeRecordPath",
  );

  if (
    !runtimeRecordRelativePath.startsWith("runtime/02-records/")
    || !runtimeRecordRelativePath.endsWith("-runtime-record.md")
  ) {
    throw new Error("invalid_input: runtimeRecordPath must point to runtime/02-records/*-runtime-record.md");
  }

  const runtimeRecordAbsolutePath = path.resolve(directiveRoot, runtimeRecordRelativePath).replace(/\\/g, "/");
  if (!fs.existsSync(runtimeRecordAbsolutePath)) {
    throw new Error(`invalid_input: runtimeRecordPath not found: ${runtimeRecordRelativePath}`);
  }

  const content = readUtf8(runtimeRecordAbsolutePath);
  const candidateId = extractBulletValue(content, "Candidate id");
  const runtimeRecordDate = extractBulletValue(content, "Review date");
  const linkedFollowUpRecord = extractBulletValue(content, "Source follow-up record");
  const followUpArtifact = readDirectiveRuntimeFollowUpArtifact({
    directiveRoot,
    followUpPath: linkedFollowUpRecord,
  });
  const runtimeProofRelativePath = buildRuntimeProofRelativePath({
    runtimeRecordDate,
    candidateId,
  });
  const runtimeProofAbsolutePath = path.resolve(directiveRoot, runtimeProofRelativePath).replace(/\\/g, "/");
  const currentStatus = extractBulletValue(content, "Current status");

  return {
    title: extractMarkdownTitle(content),
    candidateId,
    candidateName: extractBulletValue(content, "Candidate name"),
    runtimeRecordDate,
    originPath: extractBulletValue(content, "Source follow-up record"),
    linkedFollowUpRecord,
    runtimeObjective: extractBulletValue(content, "Runtime value to operationalize"),
    proposedHost: extractBulletValue(content, "Proposed host"),
    proposedRuntimeSurface: extractBulletValue(content, "Proposed integration mode"),
    requiredProofSummary: extractBulletValue(content, "Required proof summary"),
    requiredGates: extractBulletList(content, "Required gates"),
    risks: followUpArtifact.risks,
    rollback: extractBulletValue(content, "Rollback"),
    currentStatus,
    nextDecisionPoint: "Approve one bounded Runtime proof artifact or leave the record pending.",
    runtimeRecordRelativePath,
    runtimeRecordAbsolutePath,
    runtimeProofRelativePath,
    runtimeProofAbsolutePath,
    proofExists: fs.existsSync(runtimeProofAbsolutePath),
    approvalAllowed: currentStatus === "pending_proof_boundary",
    content,
    followUpArtifact,
  };
}

export function openDirectiveRuntimeRecordProof(input: {
  runtimeRecordPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
}): DirectiveRuntimeRecordProofOpenResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "open a Runtime proof artifact",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveRuntimeRecordArtifact({
    directiveRoot,
    runtimeRecordPath: input.runtimeRecordPath,
  });

  requireDirectiveEligibleStatus({
    subject: "Runtime v0 record",
    currentStatus: artifact.currentStatus,
    allowedStatuses: ["pending_proof_boundary"],
    action: "open proof",
  });

  const approvedBy = normalizeDirectiveApprovalActor(input.approvedBy);
  const created = writeDirectiveArtifactIfMissing({
    absolutePath: artifact.runtimeProofAbsolutePath,
    content: renderRuntimeV0ProofArtifact({
      artifact,
      approvedBy,
    }),
  });

  return {
    ok: true,
    created,
    directiveRoot,
    runtimeRecordRelativePath: artifact.runtimeRecordRelativePath,
    runtimeProofRelativePath: artifact.runtimeProofRelativePath,
    runtimeProofAbsolutePath: artifact.runtimeProofAbsolutePath,
    candidateId: artifact.candidateId,
    candidateName: artifact.candidateName,
  };
}
