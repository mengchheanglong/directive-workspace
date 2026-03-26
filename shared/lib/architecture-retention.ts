import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveArchitectureImplementationResultDetail,
} from "./architecture-implementation-result.ts";
import {
  resolveArchitectureReview,
  type ArchitectureReviewResolution,
} from "./architecture-review-resolution.ts";

export type ConfirmDirectiveArchitectureRetentionInput = {
  resultPath: string;
  directiveRoot?: string;
  confirmedBy?: string | null;
  usefulnessAssessment?: string | null;
  stabilityLevel?: "stable" | "bounded-stable" | "provisional";
  reuseScope?: string | null;
  confirmationDecision?: string | null;
  rollbackBoundary?: string | null;
};

export type DirectiveArchitectureRetentionConfirmResult = {
  ok: true;
  created: boolean;
  snapshotAt: string;
  directiveRoot: string;
  resultRelativePath: string;
  resultAbsolutePath: string;
  retainedRelativePath: string;
  retainedAbsolutePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
  stabilityLevel: "stable" | "bounded-stable" | "provisional";
};

export type DirectiveArchitectureRetentionDetail = {
  directiveRoot: string;
  retainedRelativePath: string;
  retainedAbsolutePath: string;
  resultRelativePath: string;
  resultAbsolutePath: string;
  targetRelativePath: string;
  adoptionRelativePath: string;
  sourceResultRelativePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
  objective: string;
  reviewScore: string;
  reviewResult: string;
  lifecycleOutcome: string;
  transitionRequest: string;
  stabilityLevel: string;
  reuseScope: string;
  confirmationDecision: string;
  rollbackBoundary: string;
  content: string;
};

function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
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
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeRelativePath(inputPath: string) {
  return requiredString(inputPath, "path").replace(/\\/g, "/");
}

function resolveDirectiveRelativePath(directiveRoot: string, inputPath: string) {
  const normalizedInput = normalizeRelativePath(inputPath);
  const root = path.resolve(directiveRoot);
  const absolutePath = path.isAbsolute(normalizedInput)
    ? path.resolve(normalizedInput)
    : path.resolve(root, normalizedInput);
  const normalizedRootPrefix = `${root}${path.sep}`;

  if (absolutePath !== root && !absolutePath.startsWith(normalizedRootPrefix)) {
    throw new Error("invalid_input: path must stay within directive-workspace");
  }

  return path.relative(root, absolutePath).replace(/\\/g, "/");
}

function resolveRetentionRelativePath(resultRelativePath: string) {
  const fileName = path.posix.basename(resultRelativePath);
  if (!fileName.endsWith("-implementation-result.md")) {
    throw new Error("invalid_input: resultPath must point to an implementation result artifact");
  }

  return path.posix.join(
    "architecture/06-retained",
    fileName.replace(/-implementation-result\.md$/u, "-retained.md"),
  );
}

function renderOptionalBulletList(items: string[], fallback: string) {
  if (items.length === 0) {
    return `- ${fallback}`;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function resolveRetentionReviewResolution(
  resultDetail: ReturnType<typeof readDirectiveArchitectureImplementationResultDetail>,
): ArchitectureReviewResolution {
  return resolveArchitectureReview({
    candidateId: resultDetail.candidateId,
    checks: {
      state_visibility_check: "pass",
      rollback_check: resultDetail.rollbackNote ? "pass" : "fail",
      scope_isolation_check:
        resultDetail.explicitLimitations.length > 0 ? "pass" : "warning",
      validation_link_check: resultDetail.validationResult ? "pass" : "fail",
      ownership_boundary_check: "pass",
      packet_consumption_check: "not_applicable",
      artifact_evidence_continuity_check:
        resultDetail.targetRelativePath
        && resultDetail.adoptionRelativePath
          ? "pass"
          : "fail",
    },
    antiPatterns: {},
  });
}

function renderRetentionMarkdown(input: {
  snapshotAt: string;
  confirmedBy: string;
  retainedRelativePath: string;
  resultRelativePath: string;
  targetRelativePath: string;
  adoptionRelativePath: string;
  sourceResultRelativePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
  objective: string;
  actualResultSummary: string;
  reviewResolution: ArchitectureReviewResolution;
  usefulnessAssessment: string;
  stabilityLevel: "stable" | "bounded-stable" | "provisional";
  reuseScope: string;
  confirmationDecision: string;
  rollbackBoundary: string;
}) {
  const requiredChanges = renderOptionalBulletList(
    input.reviewResolution.requiredChanges,
    "none",
  );
  const warningChecks = renderOptionalBulletList(
    input.reviewResolution.warningChecks,
    "none",
  );
  const failingChecks = renderOptionalBulletList(
    input.reviewResolution.failingChecks,
    "none",
  );

  return [
    `# Retained Architecture Output: ${input.candidateName} (${input.snapshotAt.slice(0, 10)})`,
    "",
    "## retained objective",
    `- Candidate id: \`${input.candidateId}\``,
    `- Candidate name: ${input.candidateName}`,
    `- Source implementation result: \`${input.resultRelativePath}\``,
    `- Source implementation target: \`${input.targetRelativePath}\``,
    `- Source adoption artifact: \`${input.adoptionRelativePath}\``,
    `- Source bounded result artifact: \`${input.sourceResultRelativePath}\``,
    `- Objective retained: ${input.objective}`,
    "",
    "## final usefulness assessment",
    `- Usefulness level: \`${input.usefulnessLevel}\``,
    `- Assessment: ${input.usefulnessAssessment}`,
    "",
    "## retained review resolution",
    `- Review score: \`${input.reviewResolution.reviewScore}\``,
    `- Review result: \`${input.reviewResolution.reviewResult}\``,
    `- Lifecycle outcome: \`${input.reviewResolution.lifecycleFeedback.outcome}\``,
    `- Transition request: \`${input.reviewResolution.transitionRequest.from} -> ${input.reviewResolution.transitionRequest.to}\` via \`${input.reviewResolution.transitionRequest.role}\``,
    "",
    "### warning checks",
    warningChecks,
    "",
    "### failing checks",
    failingChecks,
    "",
    "### required changes",
    requiredChanges,
    "",
    "## stability and reuse",
    `- Stability level: \`${input.stabilityLevel}\``,
    `- Reuse scope: ${input.reuseScope}`,
    "",
    "## evidence links",
    `- Actual implementation result summary: ${input.actualResultSummary}`,
    `- Implementation result artifact: \`${input.resultRelativePath}\``,
    `- Implementation target artifact: \`${input.targetRelativePath}\``,
    `- Adoption artifact: \`${input.adoptionRelativePath}\``,
    `- Upstream bounded result artifact: \`${input.sourceResultRelativePath}\``,
    "",
    "## confirmation decision",
    `- Confirmation approval: \`${input.confirmedBy}\``,
    `- Decision: ${input.confirmationDecision}`,
    "",
    "## rollback boundary",
    `- ${input.rollbackBoundary}`,
    "",
    "## artifact linkage",
    `- This retained Architecture output is now recorded at \`${input.retainedRelativePath}\`.`,
    `- If retention later proves premature, resume from \`${input.resultRelativePath}\` or \`${input.targetRelativePath}\` instead of reconstructing the chain by hand.`,
    "",
  ].join("\n");
}

export function confirmDirectiveArchitectureRetention(
  input: ConfirmDirectiveArchitectureRetentionInput,
): DirectiveArchitectureRetentionConfirmResult {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const resultRelativePath = resolveDirectiveRelativePath(directiveRoot, input.resultPath);
  const resultDetail = readDirectiveArchitectureImplementationResultDetail({
    directiveRoot,
    resultPath: resultRelativePath,
  });
  const retainedRelativePath = resolveRetentionRelativePath(resultRelativePath);
  const retainedAbsolutePath = normalizePath(path.join(directiveRoot, retainedRelativePath));
  const created = !fs.existsSync(retainedAbsolutePath);
  const snapshotAt = new Date().toISOString();
  const confirmedBy = String(input.confirmedBy || "directive-frontend-operator").trim()
    || "directive-frontend-operator";
  const stabilityLevel = input.stabilityLevel || "bounded-stable";
  const usefulnessAssessment = optionalString(input.usefulnessAssessment)
    || "The completed implementation result is worth retaining as Directive-owned Architecture output within the current bounded scope.";
  const reuseScope = optionalString(input.reuseScope)
    || "Retain for Directive Workspace Architecture use within the current engine-improvement boundary.";
  const confirmationDecision = optionalString(input.confirmationDecision)
    || "Retain this implementation result as valid Directive Workspace Architecture output for the current bounded scope.";
  const rollbackBoundary = optionalString(input.rollbackBoundary)
    || "If this retained output proves unstable or premature, return to the implementation result or implementation target and reopen a bounded Architecture slice.";
  const reviewResolution = resolveRetentionReviewResolution(resultDetail);

  const markdown = renderRetentionMarkdown({
    snapshotAt,
    confirmedBy,
    retainedRelativePath,
    resultRelativePath,
    targetRelativePath: resultDetail.targetRelativePath,
    adoptionRelativePath: resultDetail.adoptionRelativePath,
    sourceResultRelativePath: resultDetail.sourceResultRelativePath,
    candidateId: resultDetail.candidateId,
    candidateName: resultDetail.candidateName,
    usefulnessLevel: resultDetail.usefulnessLevel,
    objective: resultDetail.objective,
    actualResultSummary: resultDetail.resultSummary,
    reviewResolution,
    usefulnessAssessment,
    stabilityLevel,
    reuseScope,
    confirmationDecision,
    rollbackBoundary,
  });

  fs.mkdirSync(path.dirname(retainedAbsolutePath), { recursive: true });
  fs.writeFileSync(retainedAbsolutePath, markdown, "utf8");

  return {
    ok: true,
    created,
    snapshotAt,
    directiveRoot,
    resultRelativePath,
    resultAbsolutePath: resultDetail.resultAbsolutePath,
    retainedRelativePath,
    retainedAbsolutePath,
    candidateId: resultDetail.candidateId,
    candidateName: resultDetail.candidateName,
    usefulnessLevel: resultDetail.usefulnessLevel,
    stabilityLevel,
  };
}

export function readDirectiveArchitectureRetentionDetail(input: {
  retainedPath: string;
  directiveRoot?: string;
}): DirectiveArchitectureRetentionDetail {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const retainedRelativePath = resolveDirectiveRelativePath(directiveRoot, input.retainedPath);
  if (!retainedRelativePath.startsWith("architecture/06-retained/")) {
    throw new Error("invalid_input: retainedPath must point to architecture/06-retained/");
  }

  const retainedAbsolutePath = normalizePath(path.join(directiveRoot, retainedRelativePath));
  if (!fs.existsSync(retainedAbsolutePath)) {
    throw new Error(`invalid_input: retainedPath not found: ${retainedRelativePath}`);
  }

  const content = fs.readFileSync(retainedAbsolutePath, "utf8");
  const resultRelativePath = content.match(/- Source implementation result: `([^`]+)`/)?.[1] || "";
  const resultDetail = readDirectiveArchitectureImplementationResultDetail({
    directiveRoot,
    resultPath: resultRelativePath,
  });

  return {
    directiveRoot,
    retainedRelativePath,
    retainedAbsolutePath,
    resultRelativePath,
    resultAbsolutePath: resultDetail.resultAbsolutePath,
    targetRelativePath: resultDetail.targetRelativePath,
    adoptionRelativePath: resultDetail.adoptionRelativePath,
    sourceResultRelativePath: resultDetail.sourceResultRelativePath,
    candidateId: resultDetail.candidateId,
    candidateName: resultDetail.candidateName,
    usefulnessLevel: resultDetail.usefulnessLevel,
    objective: content.match(/- Objective retained: (.+)$/m)?.[1]?.trim() || "",
    reviewScore: content.match(/- Review score: `([^`]+)`/)?.[1] || "",
    reviewResult: content.match(/- Review result: `([^`]+)`/)?.[1] || "",
    lifecycleOutcome: content.match(/- Lifecycle outcome: `([^`]+)`/)?.[1] || "",
    transitionRequest: content.match(/- Transition request: `([^`]+)`/)?.[1] || "",
    stabilityLevel: content.match(/- Stability level: `([^`]+)`/)?.[1] || "",
    reuseScope: content.match(/- Reuse scope: (.+)$/m)?.[1]?.trim() || "",
    confirmationDecision: content.match(/- Decision: (.+)$/m)?.[1]?.trim() || "",
    rollbackBoundary: content.match(/^## rollback boundary\r?\n- (.+)$/m)?.[1]?.trim() || "",
    content,
  };
}
