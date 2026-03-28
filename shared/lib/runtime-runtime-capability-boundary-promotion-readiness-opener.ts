import fs from "node:fs";
import path from "node:path";

import {
  normalizeDirectiveApprovalActor,
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveCurrentStageForOpening,
  requireDirectiveEligibleStatus,
  requireDirectiveExplicitApproval,
  requireDirectiveString,
  resolveDirectiveWorkspaceRelativePath,
  writeDirectiveArtifactIfMissing,
} from "../../engine/approval-boundary.ts";
import {
  readDirectiveRuntimeProofArtifact,
  type DirectiveRuntimeProofArtifact,
} from "./runtime-proof-runtime-capability-boundary-opener.ts";
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
    "runtime capability boundary title",
  );
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    throw new Error(`invalid_input: missing "${label}" in Runtime runtime capability boundary`);
  }
  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
}

function buildPromotionReadinessRelativePath(input: {
  boundaryDate: string;
  candidateId: string;
}) {
  return normalizeRelativePath(
    path.join(
      "runtime",
      "05-promotion-readiness",
      `${input.boundaryDate}-${input.candidateId}-promotion-readiness.md`,
    ),
  );
}

function renderListOrPlaceholder(values: string[], placeholder = "  - n/a") {
  if (values.length === 0) {
    return placeholder;
  }
  return values.map((value) => `  - ${value}`).join("\n");
}

export type DirectiveRuntimeRuntimeCapabilityBoundaryArtifact = {
  title: string;
  candidateId: string;
  candidateName: string;
  boundaryDate: string;
  currentProofStatus: string;
  runtimeObjective: string;
  proposedHost: string;
  proposedRuntimeSurface: string;
  linkedRuntimeProofPath: string;
  linkedRuntimeRecordPath: string;
  linkedFollowUpPath: string;
  linkedRoutingPath: string | null;
  linkedCallableStubPath: string | null;
  rollback: string;
  noOpPath: string;
  reviewCadence: string;
  requiredProofItems: string[];
  requiredGates: string[];
  capabilityBoundaryRelativePath: string;
  capabilityBoundaryAbsolutePath: string;
  promotionReadinessRelativePath: string;
  promotionReadinessAbsolutePath: string;
  promotionReadinessExists: boolean;
  approvalAllowed: boolean;
  content: string;
  proofArtifact: DirectiveRuntimeProofArtifact;
  runtimeRecordArtifact: DirectiveRuntimeRecordArtifact;
};

export type DirectiveRuntimePromotionReadinessOpenResult = {
  ok: true;
  created: boolean;
  directiveRoot: string;
  capabilityBoundaryRelativePath: string;
  promotionReadinessRelativePath: string;
  promotionReadinessAbsolutePath: string;
  candidateId: string;
  candidateName: string;
};

function renderPromotionReadinessArtifact(input: {
  artifact: DirectiveRuntimeRuntimeCapabilityBoundaryArtifact;
  approvedBy: string;
}) {
  return `# Runtime Promotion-Readiness Artifact: ${input.artifact.candidateName} (${input.artifact.boundaryDate})

## runtime capability boundary identity
- Candidate id: \`${input.artifact.candidateId}\`
- Candidate name: \`${input.artifact.candidateName}\`
- Runtime capability boundary path: \`${input.artifact.capabilityBoundaryRelativePath}\`
- Source Runtime proof artifact: \`${input.artifact.linkedRuntimeProofPath}\`
- Source Runtime v0 record: \`${input.artifact.linkedRuntimeRecordPath}\`
- Source Runtime follow-up record: \`${input.artifact.linkedFollowUpPath}\`
${input.artifact.linkedRoutingPath ? `- Linked Discovery routing record: \`${input.artifact.linkedRoutingPath}\`\n` : ""}- Promotion-readiness decision: \`approved_for_non_executing_promotion_readiness\`
- Opened by: \`${input.approvedBy}\`
- Opened on: \`${input.artifact.boundaryDate}\`
- Current status: \`promotion_readiness_opened\`

## bounded runtime usefulness preserved
- Runtime objective: ${input.artifact.runtimeObjective}
- Proposed host: \`${input.artifact.proposedHost}\`
- Proposed runtime surface: ${input.artifact.proposedRuntimeSurface}
- Capability form: non-executing promotion-readiness artifact
- Execution state: not executing, not host-integrated, not implemented, not promoted

## what is now explicit
- The bounded runtime capability boundary has been explicitly reviewed as a possible future promotion candidate.
- Required proof items remain explicit:
${renderListOrPlaceholder(input.artifact.requiredProofItems)}
- Required gates remain explicit:
${renderListOrPlaceholder(input.artifact.requiredGates.map((value) => `\`${value}\``))}
- This artifact does not approve host-facing promotion, runtime execution, callable implementation, or host integration.

## validation boundary
- Validate against the bounded runtime capability boundary, Runtime proof artifact, Runtime v0 record, source follow-up record, and linked Discovery routing record only.
- Do not infer runtime readiness, host readiness, or automatic promotion from this artifact.
- A separate host-facing promotion record remains unopened and out of scope.

## rollback boundary
- Rollback: ${input.artifact.rollback}
- No-op path: ${input.artifact.noOpPath}
- Review cadence: ${input.artifact.reviewCadence}

## artifact linkage
- Promotion-readiness artifact: \`${input.artifact.promotionReadinessRelativePath}\`
- Runtime capability boundary: \`${input.artifact.capabilityBoundaryRelativePath}\`
- Runtime proof artifact: \`${input.artifact.linkedRuntimeProofPath}\`
- Runtime v0 record: \`${input.artifact.linkedRuntimeRecordPath}\`
- Source Runtime follow-up record: \`${input.artifact.linkedFollowUpPath}\`
${input.artifact.linkedRoutingPath ? `- Linked Discovery routing record: \`${input.artifact.linkedRoutingPath}\`\n` : ""}${input.artifact.linkedCallableStubPath ? `- Linked callable stub: \`${input.artifact.linkedCallableStubPath}\`\n` : ""}`;
}

export function readDirectiveRuntimeRuntimeCapabilityBoundaryArtifact(input: {
  capabilityBoundaryPath: string;
  directiveRoot?: string;
}): DirectiveRuntimeRuntimeCapabilityBoundaryArtifact {
  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const capabilityBoundaryRelativePath = resolveDirectiveWorkspaceRelativePath(
    directiveRoot,
    input.capabilityBoundaryPath,
    "capabilityBoundaryPath",
  );

  if (
    !capabilityBoundaryRelativePath.startsWith("runtime/04-capability-boundaries/")
    || !capabilityBoundaryRelativePath.endsWith("-runtime-capability-boundary.md")
  ) {
    throw new Error(
      "invalid_input: capabilityBoundaryPath must point to runtime/04-capability-boundaries/*-runtime-capability-boundary.md",
    );
  }

  const capabilityBoundaryAbsolutePath = path
    .resolve(directiveRoot, capabilityBoundaryRelativePath)
    .replace(/\\/g, "/");
  if (!fs.existsSync(capabilityBoundaryAbsolutePath)) {
    throw new Error(`invalid_input: capabilityBoundaryPath not found: ${capabilityBoundaryRelativePath}`);
  }

  const content = readUtf8(capabilityBoundaryAbsolutePath);
  const linkedRuntimeProofPath = extractBulletValue(content, "Proof artifact");
  const linkedRuntimeRecordPath = extractBulletValue(content, "Runtime record");
  const proofArtifact = readDirectiveRuntimeProofArtifact({
    directiveRoot,
    runtimeProofPath: linkedRuntimeProofPath,
  });
  const runtimeRecordArtifact = readDirectiveRuntimeRecordArtifact({
    directiveRoot,
    runtimeRecordPath: linkedRuntimeRecordPath,
  });
  const boundaryDate = extractBulletValue(content, "Opened on");
  const candidateId = extractBulletValue(content, "Candidate id");
  const promotionReadinessRelativePath = buildPromotionReadinessRelativePath({
    boundaryDate,
    candidateId,
  });
  const promotionReadinessAbsolutePath = path
    .resolve(directiveRoot, promotionReadinessRelativePath)
    .replace(/\\/g, "/");
  const currentProofStatus = extractBulletValue(content, "Current Runtime proof status");

  return {
    title: extractMarkdownTitle(content),
    candidateId,
    candidateName: extractBulletValue(content, "Candidate name"),
    boundaryDate,
    currentProofStatus,
    runtimeObjective: extractBulletValue(content, "Runtime objective"),
    proposedHost: extractBulletValue(content, "Proposed host"),
    proposedRuntimeSurface: extractBulletValue(content, "Proposed runtime surface"),
    linkedRuntimeProofPath,
    linkedRuntimeRecordPath,
    linkedFollowUpPath: extractBulletValue(content, "Source Runtime follow-up record"),
    linkedRoutingPath: content.includes("Linked Discovery routing record")
      ? extractBulletValue(content, "Linked Discovery routing record")
      : null,
    linkedCallableStubPath: content.includes("Callable stub")
      ? extractBulletValue(content, "Callable stub")
      : null,
    rollback: extractBulletValue(content, "Rollback"),
    noOpPath: extractBulletValue(content, "No-op path"),
    reviewCadence: extractBulletValue(content, "Review cadence"),
    requiredProofItems: [...proofArtifact.requiredProofItems],
    requiredGates: [...proofArtifact.requiredGates],
    capabilityBoundaryRelativePath,
    capabilityBoundaryAbsolutePath,
    promotionReadinessRelativePath,
    promotionReadinessAbsolutePath,
    promotionReadinessExists: fs.existsSync(promotionReadinessAbsolutePath),
    approvalAllowed: currentProofStatus === "proof_scope_opened",
    content,
    proofArtifact,
    runtimeRecordArtifact,
  };
}

export function openDirectiveRuntimePromotionReadiness(input: {
  capabilityBoundaryPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
}): DirectiveRuntimePromotionReadinessOpenResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "open a Runtime promotion-readiness artifact",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveRuntimeRuntimeCapabilityBoundaryArtifact({
    directiveRoot,
    capabilityBoundaryPath: input.capabilityBoundaryPath,
  });

  requireDirectiveCurrentStageForOpening({
    directiveRoot,
    artifactPath: artifact.capabilityBoundaryRelativePath,
    subject: "Runtime runtime capability boundary artifact",
    allowedCurrentStages: ["runtime.runtime_capability_boundary.opened"],
  });
  requireDirectiveEligibleStatus({
    subject: "Runtime runtime capability boundary artifact",
    currentStatus: artifact.currentProofStatus,
    allowedStatuses: ["proof_scope_opened"],
    action: "open a promotion-readiness artifact",
  });

  const approvedBy = normalizeDirectiveApprovalActor(input.approvedBy);
  const created = writeDirectiveArtifactIfMissing({
    absolutePath: artifact.promotionReadinessAbsolutePath,
    content: renderPromotionReadinessArtifact({
      artifact,
      approvedBy,
    }),
  });

  return {
    ok: true,
    created,
    directiveRoot,
    capabilityBoundaryRelativePath: artifact.capabilityBoundaryRelativePath,
    promotionReadinessRelativePath: artifact.promotionReadinessRelativePath,
    promotionReadinessAbsolutePath: artifact.promotionReadinessAbsolutePath,
    candidateId: artifact.candidateId,
    candidateName: artifact.candidateName,
  };
}
