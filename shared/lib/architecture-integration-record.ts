import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveArchitectureRetentionDetail,
} from "./architecture-retention.ts";

export type CreateDirectiveArchitectureIntegrationRecordInput = {
  retainedPath: string;
  directiveRoot?: string;
  createdBy?: string | null;
  integrationTargetSurface?: string | null;
  readinessSummary?: string | null;
  expectedEffect?: string | null;
  validationBoundary?: string | null;
  integrationDecision?: string | null;
  rollbackBoundary?: string | null;
};

export type DirectiveArchitectureIntegrationRecordCreateResult = {
  ok: true;
  created: boolean;
  snapshotAt: string;
  directiveRoot: string;
  retainedRelativePath: string;
  retainedAbsolutePath: string;
  integrationRelativePath: string;
  integrationAbsolutePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
};

export type DirectiveArchitectureIntegrationRecordDetail = {
  directiveRoot: string;
  integrationRelativePath: string;
  integrationAbsolutePath: string;
  retainedRelativePath: string;
  retainedAbsolutePath: string;
  resultRelativePath: string;
  targetRelativePath: string;
  adoptionRelativePath: string;
  sourceResultRelativePath: string;
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

function resolveIntegrationRecordRelativePath(retainedRelativePath: string) {
  const fileName = path.posix.basename(retainedRelativePath);
  if (!fileName.endsWith("-retained.md")) {
    throw new Error("invalid_input: retainedPath must point to a retained Architecture artifact");
  }

  return path.posix.join(
    "architecture/07-integration-records",
    fileName.replace(/-retained\.md$/u, "-integration-record.md"),
  );
}

function renderIntegrationRecordMarkdown(input: {
  snapshotAt: string;
  createdBy: string;
  integrationRelativePath: string;
  retainedRelativePath: string;
  resultRelativePath: string;
  targetRelativePath: string;
  adoptionRelativePath: string;
  sourceResultRelativePath: string;
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
}) {
  return [
    `# Architecture Integration Record: ${input.candidateName} (${input.snapshotAt.slice(0, 10)})`,
    "",
    "## retained objective",
    `- Candidate id: \`${input.candidateId}\``,
    `- Candidate name: ${input.candidateName}`,
    `- Source retained artifact: \`${input.retainedRelativePath}\``,
    `- Source implementation result: \`${input.resultRelativePath}\``,
    `- Source implementation target: \`${input.targetRelativePath}\``,
    `- Source adoption artifact: \`${input.adoptionRelativePath}\``,
    `- Source bounded result artifact: \`${input.sourceResultRelativePath}\``,
    `- Usefulness level: \`${input.usefulnessLevel}\``,
    `- Objective retained: ${input.objective}`,
    "",
    "## integration target/surface",
    `- ${input.integrationTargetSurface}`,
    "",
    "## readiness summary",
    `- ${input.readinessSummary}`,
    "",
    "## expected effect",
    `- ${input.expectedEffect}`,
    "",
    "## validation boundary",
    `- ${input.validationBoundary}`,
    "",
    "## evidence links",
    `- Retained artifact: \`${input.retainedRelativePath}\``,
    `- Implementation result: \`${input.resultRelativePath}\``,
    `- Implementation target: \`${input.targetRelativePath}\``,
    `- Adoption artifact: \`${input.adoptionRelativePath}\``,
    `- Upstream bounded result: \`${input.sourceResultRelativePath}\``,
    "",
    "## integration decision",
    `- Decision approval: \`${input.createdBy}\``,
    `- Decision: ${input.integrationDecision}`,
    "",
    "## rollback boundary",
    `- ${input.rollbackBoundary}`,
    "",
    "## artifact linkage",
    `- This integration-ready Architecture record is now retained at \`${input.integrationRelativePath}\`.`,
    `- If integration readiness later proves premature, resume from \`${input.retainedRelativePath}\` instead of reconstructing the chain by hand.`,
    "",
  ].join("\n");
}

export function createDirectiveArchitectureIntegrationRecord(
  input: CreateDirectiveArchitectureIntegrationRecordInput,
): DirectiveArchitectureIntegrationRecordCreateResult {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const retainedRelativePath = resolveDirectiveRelativePath(directiveRoot, input.retainedPath);
  const retainedDetail = readDirectiveArchitectureRetentionDetail({
    directiveRoot,
    retainedPath: retainedRelativePath,
  });
  const integrationRelativePath = resolveIntegrationRecordRelativePath(retainedRelativePath);
  const integrationAbsolutePath = normalizePath(path.join(directiveRoot, integrationRelativePath));
  const created = !fs.existsSync(integrationAbsolutePath);
  const snapshotAt = new Date().toISOString();
  const createdBy = String(input.createdBy || "directive-frontend-operator").trim()
    || "directive-frontend-operator";
  const integrationTargetSurface = optionalString(input.integrationTargetSurface)
    || "Directive Workspace engine-owned product logic within the current Architecture boundary.";
  const readinessSummary = optionalString(input.readinessSummary)
    || "This retained Architecture output is stable enough within the bounded scope to be recorded as integration-ready product input.";
  const expectedEffect = optionalString(input.expectedEffect)
    || "Directive Workspace can consume this retained output as an explicit engine-owned integration candidate without re-reading the prior Architecture chain.";
  const validationBoundary = optionalString(input.validationBoundary)
    || "Validate against the retained artifact, implementation result, and bounded source chain only; do not imply execution or downstream automation.";
  const integrationDecision = optionalString(input.integrationDecision)
    || "Record this retained output as integration-ready Directive Workspace Architecture output for the current bounded scope.";
  const rollbackBoundary = optionalString(input.rollbackBoundary)
    || "If this integration-ready record proves premature, fall back to the retained artifact and reopen a bounded Architecture slice before any further integration step.";

  const markdown = renderIntegrationRecordMarkdown({
    snapshotAt,
    createdBy,
    integrationRelativePath,
    retainedRelativePath,
    resultRelativePath: retainedDetail.resultRelativePath,
    targetRelativePath: retainedDetail.targetRelativePath,
    adoptionRelativePath: retainedDetail.adoptionRelativePath,
    sourceResultRelativePath: retainedDetail.sourceResultRelativePath,
    candidateId: retainedDetail.candidateId,
    candidateName: retainedDetail.candidateName,
    usefulnessLevel: retainedDetail.usefulnessLevel,
    objective: retainedDetail.objective,
    integrationTargetSurface,
    readinessSummary,
    expectedEffect,
    validationBoundary,
    integrationDecision,
    rollbackBoundary,
  });

  fs.mkdirSync(path.dirname(integrationAbsolutePath), { recursive: true });
  fs.writeFileSync(integrationAbsolutePath, markdown, "utf8");

  return {
    ok: true,
    created,
    snapshotAt,
    directiveRoot,
    retainedRelativePath,
    retainedAbsolutePath: retainedDetail.retainedAbsolutePath,
    integrationRelativePath,
    integrationAbsolutePath,
    candidateId: retainedDetail.candidateId,
    candidateName: retainedDetail.candidateName,
    usefulnessLevel: retainedDetail.usefulnessLevel,
  };
}

export function readDirectiveArchitectureIntegrationRecordDetail(input: {
  integrationPath: string;
  directiveRoot?: string;
}): DirectiveArchitectureIntegrationRecordDetail {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const integrationRelativePath = resolveDirectiveRelativePath(directiveRoot, input.integrationPath);
  if (!integrationRelativePath.startsWith("architecture/07-integration-records/")) {
    throw new Error("invalid_input: integrationPath must point to architecture/07-integration-records/");
  }

  const integrationAbsolutePath = normalizePath(path.join(directiveRoot, integrationRelativePath));
  if (!fs.existsSync(integrationAbsolutePath)) {
    throw new Error(`invalid_input: integrationPath not found: ${integrationRelativePath}`);
  }

  const content = fs.readFileSync(integrationAbsolutePath, "utf8");
  const retainedRelativePath = content.match(/- Source retained artifact: `([^`]+)`/)?.[1] || "";
  const retainedDetail = readDirectiveArchitectureRetentionDetail({
    directiveRoot,
    retainedPath: retainedRelativePath,
  });

  return {
    directiveRoot,
    integrationRelativePath,
    integrationAbsolutePath,
    retainedRelativePath,
    retainedAbsolutePath: retainedDetail.retainedAbsolutePath,
    resultRelativePath: retainedDetail.resultRelativePath,
    targetRelativePath: retainedDetail.targetRelativePath,
    adoptionRelativePath: retainedDetail.adoptionRelativePath,
    sourceResultRelativePath: retainedDetail.sourceResultRelativePath,
    candidateId: retainedDetail.candidateId,
    candidateName: retainedDetail.candidateName,
    usefulnessLevel: retainedDetail.usefulnessLevel,
    objective: content.match(/- Objective retained: (.+)$/m)?.[1]?.trim() || "",
    integrationTargetSurface: content.match(/^## integration target\/surface\r?\n- (.+)$/m)?.[1]?.trim() || "",
    readinessSummary: content.match(/^## readiness summary\r?\n- (.+)$/m)?.[1]?.trim() || "",
    expectedEffect: content.match(/^## expected effect\r?\n- (.+)$/m)?.[1]?.trim() || "",
    validationBoundary: content.match(/^## validation boundary\r?\n- (.+)$/m)?.[1]?.trim() || "",
    integrationDecision: content.match(/- Decision: (.+)$/m)?.[1]?.trim() || "",
    rollbackBoundary: content.match(/^## rollback boundary\r?\n- (.+)$/m)?.[1]?.trim() || "",
    content,
  };
}
