import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ARCHITECTURE_DEEP_TAIL_STAGE,
  type ArchitectureDeepTailStageDefinition,
  type ArchitectureDeepTailStageId,
} from "./architecture-deep-tail-stage-map.ts";
import { resolveDirectiveWorkspaceArtifactAbsolutePath } from "./directive-workspace-artifact-storage.ts";

export function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

export function getDefaultDirectiveWorkspaceRoot() {
  return normalizePath(fileURLToPath(new URL("../../", import.meta.url)));
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
  if (!relativePath.startsWith(input.stage.pathPrefix)) {
    throw new Error(`invalid_input: ${input.fieldName} must point to ${input.stage.pathPrefix}`);
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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
