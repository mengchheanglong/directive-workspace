import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ARCHITECTURE_DEEP_TAIL_STAGE,
  matchesArchitectureDeepTailStagePath,
  type ArchitectureDeepTailStageDefinition,
  type ArchitectureDeepTailStageId,
} from "./architecture-deep-tail-stage-map.ts";
import { recordArchitectureDeepTailLinkedArtifactPath } from "./architecture-deep-tail-linkage-index.ts";
import { resolveDirectiveWorkspaceArtifactAbsolutePath } from "../../shared/lib/directive-workspace-artifact-storage.ts";

export function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

export function getDefaultDirectiveWorkspaceRoot() {
  return normalizePath(fileURLToPath(new URL("../..", import.meta.url)));
}

export function resolveDirectiveWorkspaceRoot(directiveRoot?: string) {
  return normalizePath(directiveRoot || getDefaultDirectiveWorkspaceRoot());
}

export function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function requiredString(value: string | null | undefined, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`invalid_input: ${fieldName} is required`);
  }
  return value.trim();
}

export function optionalString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeRelativePath(inputPath: string, fieldName = "path") {
  return requiredString(inputPath, fieldName).replace(/\\/g, "/");
}

export function resolveDirectiveRelativePath(directiveRoot: string, inputPath: string, fieldName = "path") {
  const normalizedInput = normalizeRelativePath(inputPath, fieldName);
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

export function resolveArchitectureDeepTailRelativePath(input: {
  sourceRelativePath: string;
  expectedSourceSuffix: string;
  targetStage: ArchitectureDeepTailStageId;
  inputFieldName: string;
  targetSuffix?: string;
}) {
  const fileName = path.posix.basename(input.sourceRelativePath);
  if (!fileName.endsWith(input.expectedSourceSuffix)) {
    throw new Error(`invalid_input: ${input.inputFieldName} must point to an ${input.expectedSourceSuffix.replace(/^-/, "").replace(/\.md$/, "")} artifact`);
  }

  const targetSuffix = input.targetSuffix || ARCHITECTURE_DEEP_TAIL_STAGE[input.targetStage].artifactSuffix;

  return path.posix.join(
    ARCHITECTURE_DEEP_TAIL_STAGE[input.targetStage].relativeDir,
    fileName.replace(new RegExp(`${escapeRegExp(input.expectedSourceSuffix)}$`, "u"), targetSuffix),
  );
}

export function readDirectiveArchitectureDeepTailArtifact(input: {
  directiveRoot: string;
  artifactPath: string;
  stage: ArchitectureDeepTailStageDefinition;
  fieldName: string;
}) {
  const relativePath = resolveDirectiveRelativePath(input.directiveRoot, input.artifactPath, input.fieldName);
  if (!matchesArchitectureDeepTailStagePath(input.stage, relativePath)) {
    throw new Error(
      `invalid_input: ${input.fieldName} must point to ${input.stage.pathPrefix} or ${input.stage.storagePathPrefix}`,
    );
  }

  const absolutePath = resolveDirectiveWorkspaceArtifactAbsolutePath({
    directiveRoot: input.directiveRoot,
    relativePath,
    mode: "read",
  });
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: ${input.fieldName} not found: ${relativePath}`);
  }

  return {
    relativePath,
    absolutePath,
    content: fs.readFileSync(absolutePath, "utf8"),
  };
}

export function readDirectiveArchitectureDeepTailDetailArtifact(input: {
  directiveRoot?: string;
  artifactPath: string;
  stage: ArchitectureDeepTailStageDefinition;
  fieldName: string;
}) {
  const directiveRoot = resolveDirectiveWorkspaceRoot(input.directiveRoot);
  const artifact = readDirectiveArchitectureDeepTailArtifact({
    directiveRoot,
    artifactPath: input.artifactPath,
    stage: input.stage,
    fieldName: input.fieldName,
  });

  return {
    directiveRoot,
    relativePath: artifact.relativePath,
    absolutePath: artifact.absolutePath,
    content: artifact.content,
  };
}

export function prepareDirectiveArchitectureDeepTailWrite(input: {
  directiveRoot?: string;
  sourcePath: string;
  sourceFieldName: string;
  resolveTargetRelativePath: (sourceRelativePath: string) => string;
  actor?: string | null;
  defaultActor?: string;
}) {
  const directiveRoot = resolveDirectiveWorkspaceRoot(input.directiveRoot);
  const sourceRelativePath = resolveDirectiveRelativePath(
    directiveRoot,
    input.sourcePath,
    input.sourceFieldName,
  );
  const targetRelativePath = input.resolveTargetRelativePath(sourceRelativePath);
  const targetAbsolutePath = resolveDirectiveWorkspaceArtifactAbsolutePath({
    directiveRoot,
    relativePath: targetRelativePath,
    mode: "write",
  });
  const created = !fs.existsSync(targetAbsolutePath);
  const snapshotAt = new Date().toISOString();
  const actor = String(input.actor || input.defaultActor || "directive-frontend-operator").trim()
    || "directive-frontend-operator";

  return {
    directiveRoot,
    sourceRelativePath,
    targetRelativePath,
    targetAbsolutePath,
    created,
    snapshotAt,
    actor,
  };
}

export function writeDirectiveArtifactMarkdown(absolutePath: string, markdown: string) {
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, markdown, "utf8");
}

export function writeJsonPretty(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function writeDirectiveArchitectureDeepTailArtifact(input: {
  directiveRoot: string;
  stageId: ArchitectureDeepTailStageId;
  sourceRelativePath: string;
  targetRelativePath: string;
  targetAbsolutePath: string;
  markdown: string;
}) {
  writeDirectiveArtifactMarkdown(input.targetAbsolutePath, input.markdown);
  recordArchitectureDeepTailLinkedArtifactPath({
    directiveRoot: input.directiveRoot,
    stageId: input.stageId,
    sourceRelativePath: input.sourceRelativePath,
    targetRelativePath: input.targetRelativePath,
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
