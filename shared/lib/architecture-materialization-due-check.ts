import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveArchitectureAdoptionDetail,
} from "./architecture-result-adoption.ts";
import {
  loadDirectiveArchitectureCycleDecisionArtifacts,
} from "./architecture-cycle-decision-loader.ts";
import type {
  DirectiveArchitectureCycleDecisionSummary,
} from "./architecture-cycle-decision-summary.ts";
import {
  readDirectiveArchitectureImplementationTargetDetail,
  readDirectiveArchitectureImplementationTargetPathForAdoption,
} from "./architecture-implementation-target.ts";
import {
  readDirectiveArchitectureImplementationResultPathForTarget,
} from "./architecture-implementation-result.ts";

export type DirectiveArchitectureMaterializationDueKind =
  | "create_implementation_target"
  | "record_implementation_result";

export type DirectiveArchitectureMaterializationDueItem = {
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
  dueKind: DirectiveArchitectureMaterializationDueKind;
  currentArtifactPath: string;
  nextArtifactPath: string;
  nextLegalStep: string;
  objective: string;
  rationale: string;
};

export type DirectiveArchitectureMaterializationDueCheck = {
  ok: true;
  snapshotAt: string;
  directiveRoot: string;
  summary: {
    totalDueItems: number;
    adoptionsNeedingTargets: number;
    targetsNeedingResults: number;
  };
  dueAdoptionDecisionSummary: {
    totalAdoptionsSummarized: number;
    recordRelativePaths: string[];
    decisionRelativePaths: string[];
    summary: DirectiveArchitectureCycleDecisionSummary;
  } | null;
  warnings: string[];
  dueItems: DirectiveArchitectureMaterializationDueItem[];
};

function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}

function getDefaultDirectiveWorkspaceRoot() {
  return normalizePath(fileURLToPath(new URL("../../", import.meta.url)));
}

function listMarkdownRelativePaths(directiveRoot: string, relativeDir: string) {
  const absoluteDir = path.join(directiveRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) {
    return [] as string[];
  }

  return fs.readdirSync(absoluteDir)
    .filter((entry) => entry.endsWith(".md"))
    .sort((left, right) => right.localeCompare(left))
    .map((entry) => normalizeRelativePath(path.join(relativeDir, entry)));
}

function extractRetainedObjective(content: string) {
  return content.match(/- Objective retained: (.+)$/m)?.[1]?.trim()
    || "Materialize the retained Architecture value as one bounded product-owned slice.";
}

export function readDirectiveArchitectureMaterializationDueCheck(input: {
  directiveRoot?: string;
} = {}): DirectiveArchitectureMaterializationDueCheck {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const snapshotAt = new Date().toISOString();
  const dueItems: DirectiveArchitectureMaterializationDueItem[] = [];
  const warnings: string[] = [];
  const dueAdoptionRecordRelativePaths: string[] = [];

  for (const adoptionRelativePath of listMarkdownRelativePaths(directiveRoot, "architecture/03-adopted")) {
    let adoptionDetail: ReturnType<typeof readDirectiveArchitectureAdoptionDetail>;
    try {
      adoptionDetail = readDirectiveArchitectureAdoptionDetail({
        directiveRoot,
        adoptionPath: adoptionRelativePath,
      });
    } catch (error) {
      warnings.push(
        `Skipped adoption artifact "${adoptionRelativePath}": ${String((error as Error).message || error)}`,
      );
      continue;
    }
    let targetRelativePath: string | null;
    try {
      targetRelativePath = readDirectiveArchitectureImplementationTargetPathForAdoption({
        directiveRoot,
        adoptionRelativePath,
      });
    } catch (error) {
      warnings.push(
        `Skipped adoption artifact "${adoptionRelativePath}": ${String((error as Error).message || error)}`,
      );
      continue;
    }
    if (targetRelativePath) {
      continue;
    }

    const fileName = path.posix.basename(adoptionRelativePath);
    const nextArtifactPath = normalizeRelativePath(path.posix.join(
      "architecture/04-implementation-targets",
      fileName.replace(/-adopted(?:-planned-next)?\.md$/u, "-implementation-target.md"),
    ));

    dueItems.push({
      candidateId: adoptionDetail.candidateId,
      candidateName: adoptionDetail.candidateName,
      usefulnessLevel: adoptionDetail.usefulnessLevel,
      dueKind: "create_implementation_target",
      currentArtifactPath: adoptionRelativePath,
      nextArtifactPath,
      nextLegalStep: "Explicitly create the implementation target.",
      objective: extractRetainedObjective(adoptionDetail.content),
      rationale:
        "This adopted Architecture output has no bounded implementation target yet, so the next self-improvement ratchet step is still only implicit.",
    });
    dueAdoptionRecordRelativePaths.push(adoptionRelativePath);
  }

  for (const targetRelativePath of listMarkdownRelativePaths(directiveRoot, "architecture/04-implementation-targets")) {
    let targetDetail: ReturnType<typeof readDirectiveArchitectureImplementationTargetDetail>;
    try {
      targetDetail = readDirectiveArchitectureImplementationTargetDetail({
        directiveRoot,
        targetPath: targetRelativePath,
      });
    } catch (error) {
      warnings.push(
        `Skipped implementation target "${targetRelativePath}": ${String((error as Error).message || error)}`,
      );
      continue;
    }
    const resultRelativePath = readDirectiveArchitectureImplementationResultPathForTarget({
      directiveRoot,
      targetRelativePath,
    });
    if (resultRelativePath) {
      continue;
    }

    const fileName = path.posix.basename(targetRelativePath);
    const nextArtifactPath = normalizeRelativePath(path.posix.join(
      "architecture/05-implementation-results",
      fileName.replace(/-implementation-target\.md$/u, "-implementation-result.md"),
    ));

    dueItems.push({
      candidateId: targetDetail.candidateId,
      candidateName: targetDetail.candidateName,
      usefulnessLevel: targetDetail.usefulnessLevel,
      dueKind: "record_implementation_result",
      currentArtifactPath: targetRelativePath,
      nextArtifactPath,
      nextLegalStep: "Explicitly record the implementation result.",
      objective: targetDetail.objective,
      rationale:
        "This bounded implementation target is open in repo-backed state but has no recorded result yet, so the iteration is not ratcheted closed.",
    });
  }

  let dueAdoptionDecisionSummary: DirectiveArchitectureMaterializationDueCheck["dueAdoptionDecisionSummary"] = null;
  if (dueAdoptionRecordRelativePaths.length > 0) {
    try {
      const decisionLoad = loadDirectiveArchitectureCycleDecisionArtifacts({
        directiveRoot,
        recordRelativePaths: dueAdoptionRecordRelativePaths,
      });
      dueAdoptionDecisionSummary = {
        totalAdoptionsSummarized: decisionLoad.records.length,
        recordRelativePaths: decisionLoad.records.map((record) => record.recordRelativePath),
        decisionRelativePaths: decisionLoad.records.map((record) => record.decisionRelativePath),
        summary: decisionLoad.summary,
      };
    } catch (error) {
      warnings.push(
        `Could not summarize due adopted Architecture decisions: ${String((error as Error).message || error)}`,
      );
    }
  }

  return {
    ok: true,
    snapshotAt,
    directiveRoot,
    summary: {
      totalDueItems: dueItems.length,
      adoptionsNeedingTargets: dueItems.filter((item) => item.dueKind === "create_implementation_target").length,
      targetsNeedingResults: dueItems.filter((item) => item.dueKind === "record_implementation_result").length,
    },
    dueAdoptionDecisionSummary,
    warnings,
    dueItems,
  };
}
