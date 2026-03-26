import fs from "node:fs";
import path from "node:path";

import {
  normalizeDirectiveApprovalActor,
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveEligibleStatus,
  requireDirectiveExplicitApproval,
  requireDirectiveIntegrityForOpening,
  requireDirectiveString,
  resolveDirectiveWorkspaceRelativePath,
  writeDirectiveArtifactIfMissing,
} from "../../engine/approval-boundary.ts";
import {
  readDirectiveRuntimeRecordArtifact,
  type DirectiveRuntimeRecordArtifact,
} from "./runtime-record-proof-opener.ts";

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
    "runtime proof title",
  );
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    throw new Error(`invalid_input: missing "${label}" in Runtime proof artifact`);
  }
  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
}

function buildRuntimeCapabilityBoundaryRelativePath(input: {
  proofDate: string;
  candidateId: string;
}) {
  return normalizeRelativePath(
    path.join(
      "runtime",
      "04-capability-boundaries",
      `${input.proofDate}-${input.candidateId}-runtime-capability-boundary.md`,
    ),
  );
}

function renderListOrPlaceholder(values: string[], placeholder = "  - n/a") {
  if (values.length === 0) {
    return placeholder;
  }
  return values.map((value) => `  - ${value}`).join("\n");
}

export type DirectiveRuntimeProofArtifact = {
  title: string;
  candidateId: string;
  candidateName: string;
  proofDate: string;
  currentStatus: string;
  runtimeObjective: string;
  proposedHost: string;
  proposedRuntimeSurface: string;
  linkedRuntimeRecordPath: string;
  linkedFollowUpPath: string;
  linkedRoutingPath: string | null;
  rollback: string;
  noOpPath: string;
  reviewCadence: string;
  requiredProofItems: string[];
  requiredGates: string[];
  runtimeProofRelativePath: string;
  runtimeProofAbsolutePath: string;
  runtimeCapabilityBoundaryRelativePath: string;
  runtimeCapabilityBoundaryAbsolutePath: string;
  runtimeCapabilityBoundaryExists: boolean;
  approvalAllowed: boolean;
  content: string;
  runtimeRecordArtifact: DirectiveRuntimeRecordArtifact;
};

export type DirectiveRuntimeProofRuntimeCapabilityBoundaryOpenResult = {
  ok: true;
  created: boolean;
  directiveRoot: string;
  runtimeProofRelativePath: string;
  runtimeCapabilityBoundaryRelativePath: string;
  runtimeCapabilityBoundaryAbsolutePath: string;
  candidateId: string;
  candidateName: string;
};

function renderRuntimeCapabilityBoundaryArtifact(input: {
  artifact: DirectiveRuntimeProofArtifact;
  approvedBy: string;
}) {
  const record = input.artifact.runtimeRecordArtifact;
  const followUp = record.followUpArtifact;

  return `# Runtime V0 Runtime Capability Boundary: ${input.artifact.candidateName} (${input.artifact.proofDate})

## bounded runtime usefulness being converted
- Convert the approved Runtime proof scope into one bounded runtime capability boundary for Directive Workspace runtime-usefulness conversion.
- Keep the boundary constrained to the approved runtime objective and proposed runtime surface only.
- Do not widen into runtime execution, host integration, callable implementation, orchestration, or promotion.

## reusable capability shape
- Candidate id: \`${input.artifact.candidateId}\`
- Candidate name: \`${input.artifact.candidateName}\`
- Capability form: bounded runtime capability boundary
- Runtime objective: ${input.artifact.runtimeObjective}
- Proposed host: \`${input.artifact.proposedHost}\`
- Proposed runtime surface: ${input.artifact.proposedRuntimeSurface}
- Execution state: not executing, not host-integrated, not implemented, not promoted

## source inputs
- Runtime proof artifact: \`${input.artifact.runtimeProofRelativePath}\`
- Runtime v0 record: \`${input.artifact.linkedRuntimeRecordPath}\`
- Source Runtime follow-up record: \`${input.artifact.linkedFollowUpPath}\`
${input.artifact.linkedRoutingPath ? `- Linked Discovery routing record: \`${input.artifact.linkedRoutingPath}\`\n` : ""}- Runtime objective: ${input.artifact.runtimeObjective}
- Proposed host: \`${input.artifact.proposedHost}\`
- Proposed runtime surface: ${input.artifact.proposedRuntimeSurface}

## capability boundary
- Preserve the approved runtime objective only.
- Preserve the bounded proof items:
${renderListOrPlaceholder(input.artifact.requiredProofItems)}
- Preserve the required gates:
${renderListOrPlaceholder(input.artifact.requiredGates.map((value) => `\`${value}\``))}
- Do not add runtime triggers, host adapters, scheduling, background work, or callable implementation.
- Do not claim promotion readiness, runtime execution, or host integration from this artifact.

## proof and promotion boundary
- Current Runtime proof status: \`${input.artifact.currentStatus}\`
- Boundary opening decision: \`approved_for_bounded_runtime_capability_boundary\`
- Opened by: \`${input.approvedBy}\`
- Opened on: \`${input.artifact.proofDate}\`
- Host-facing promotion remains out of scope and unopened.

## rollback boundary
- Rollback: ${input.artifact.rollback}
- No-op path: ${input.artifact.noOpPath}
- Review cadence: ${input.artifact.reviewCadence}

## artifact linkage
- Runtime capability boundary: \`${input.artifact.runtimeCapabilityBoundaryRelativePath}\`
- Proof artifact: \`${input.artifact.runtimeProofRelativePath}\`
- Runtime record: \`${input.artifact.linkedRuntimeRecordPath}\`
- Source Runtime follow-up record: \`${input.artifact.linkedFollowUpPath}\`
${input.artifact.linkedRoutingPath ? `- Linked Discovery routing record: \`${input.artifact.linkedRoutingPath}\`\n` : ""}`;
}

export function readDirectiveRuntimeProofArtifact(input: {
  runtimeProofPath: string;
  directiveRoot?: string;
}): DirectiveRuntimeProofArtifact {
  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const runtimeProofRelativePath = resolveDirectiveWorkspaceRelativePath(
    directiveRoot,
    input.runtimeProofPath,
    "runtimeProofPath",
  );

  if (
    !runtimeProofRelativePath.startsWith("runtime/03-proof/")
    || !runtimeProofRelativePath.endsWith("-proof.md")
  ) {
    throw new Error("invalid_input: runtimeProofPath must point to runtime/03-proof/*-proof.md");
  }

  const runtimeProofAbsolutePath = path.resolve(directiveRoot, runtimeProofRelativePath).replace(/\\/g, "/");
  if (!fs.existsSync(runtimeProofAbsolutePath)) {
    throw new Error(`invalid_input: runtimeProofPath not found: ${runtimeProofRelativePath}`);
  }

  const content = readUtf8(runtimeProofAbsolutePath);
  if (!content.includes("## runtime record identity")) {
    throw new Error("invalid_input: runtimeProofPath must point to a follow-up review Runtime proof artifact");
  }

  const candidateId = extractBulletValue(content, "Candidate id");
  const proofDate = extractBulletValue(content, "Opened on");
  const linkedRuntimeRecordPath = extractBulletValue(content, "Runtime v0 record path");
  const runtimeRecordArtifact = readDirectiveRuntimeRecordArtifact({
    directiveRoot,
    runtimeRecordPath: linkedRuntimeRecordPath,
  });
  const runtimeCapabilityBoundaryRelativePath = buildRuntimeCapabilityBoundaryRelativePath({
    proofDate,
    candidateId,
  });
  const runtimeCapabilityBoundaryAbsolutePath = path
    .resolve(directiveRoot, runtimeCapabilityBoundaryRelativePath)
    .replace(/\\/g, "/");
  const currentStatus = extractBulletValue(content, "Current status");

  return {
    title: extractMarkdownTitle(content),
    candidateId,
    candidateName: extractBulletValue(content, "Candidate name"),
    proofDate,
    currentStatus,
    runtimeObjective: extractBulletValue(content, "Runtime objective"),
    proposedHost: extractBulletValue(content, "Proposed host"),
    proposedRuntimeSurface: extractBulletValue(content, "Proposed runtime surface"),
    linkedRuntimeRecordPath,
    linkedFollowUpPath: extractBulletValue(content, "Source follow-up record path"),
    linkedRoutingPath: content.includes("Linked Discovery routing record")
      ? extractBulletValue(content, "Linked Discovery routing record")
      : null,
    rollback: extractBulletValue(content, "Rollback"),
    noOpPath: extractBulletValue(content, "No-op path"),
    reviewCadence: extractBulletValue(content, "Review cadence"),
    requiredProofItems: [...runtimeRecordArtifact.followUpArtifact.requiredProof],
    requiredGates: [...runtimeRecordArtifact.requiredGates],
    runtimeProofRelativePath,
    runtimeProofAbsolutePath,
    runtimeCapabilityBoundaryRelativePath,
    runtimeCapabilityBoundaryAbsolutePath,
    runtimeCapabilityBoundaryExists: fs.existsSync(runtimeCapabilityBoundaryAbsolutePath),
    approvalAllowed: currentStatus === "proof_scope_opened",
    content,
    runtimeRecordArtifact,
  };
}

export function openDirectiveRuntimeProofRuntimeCapabilityBoundary(input: {
  runtimeProofPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
}): DirectiveRuntimeProofRuntimeCapabilityBoundaryOpenResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "open a Runtime runtime capability boundary",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveRuntimeProofArtifact({
    directiveRoot,
    runtimeProofPath: input.runtimeProofPath,
  });

  requireDirectiveIntegrityForOpening({
    directiveRoot,
    artifactPath: artifact.runtimeProofRelativePath,
    subject: "Runtime proof artifact",
  });
  requireDirectiveEligibleStatus({
    subject: "Runtime proof artifact",
    currentStatus: artifact.currentStatus,
    allowedStatuses: ["proof_scope_opened"],
    action: "open a runtime capability boundary",
  });

  const approvedBy = normalizeDirectiveApprovalActor(input.approvedBy);
  const created = writeDirectiveArtifactIfMissing({
    absolutePath: artifact.runtimeCapabilityBoundaryAbsolutePath,
    content: renderRuntimeCapabilityBoundaryArtifact({
      artifact,
      approvedBy,
    }),
  });

  return {
    ok: true,
    created,
    directiveRoot,
    runtimeProofRelativePath: artifact.runtimeProofRelativePath,
    runtimeCapabilityBoundaryRelativePath: artifact.runtimeCapabilityBoundaryRelativePath,
    runtimeCapabilityBoundaryAbsolutePath: artifact.runtimeCapabilityBoundaryAbsolutePath,
    candidateId: artifact.candidateId,
    candidateName: artifact.candidateName,
  };
}
