import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { readJson, writeJson } from "../shared/lib/file-io.ts";

export { readJson, writeJson };

export function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
}

export function copyRelativeFile(
  relativePath: string,
  sourceRoot: string,
  targetRoot: string,
  missingMessage?: string,
) {
  const sourcePath = path.join(sourceRoot, relativePath);
  assert.ok(fs.existsSync(sourcePath), missingMessage ?? `Missing source file: ${relativePath}`);
  const targetPath = path.join(targetRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

export function copyRelativeFiles(
  relativePaths: Array<string | null | undefined>,
  sourceRoot: string,
  targetRoot: string,
  missingMessagePrefix?: string,
) {
  for (const relativePath of uniqueRelativePaths(relativePaths)) {
    copyRelativeFile(
      relativePath,
      sourceRoot,
      targetRoot,
      missingMessagePrefix ? `${missingMessagePrefix}: ${relativePath}` : undefined,
    );
  }
}

function extractMarkdownActor(markdown: string, label: string, errorMessage: string) {
  const match = markdown.match(new RegExp(`- ${label}: \`([^\\x60]+)\``, "u"));
  assert.ok(match?.[1], errorMessage);
  return match[1];
}

export function extractOpenedBy(markdown: string, errorMessage = "Unable to parse Runtime opened-by actor") {
  return extractMarkdownActor(markdown, "Opened by", errorMessage);
}

export function extractReviewedBy(markdown: string, errorMessage = "Unable to parse Runtime review actor") {
  return extractMarkdownActor(markdown, "Reviewed by", errorMessage);
}
