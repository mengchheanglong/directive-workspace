import fs from "node:fs";
import path from "node:path";

import {
  readDirectiveArchitectureBoundedResultArtifact,
  readDirectiveArchitectureBoundedStartArtifact,
  type DirectiveArchitectureBoundedResultArtifact,
  type DirectiveArchitectureBoundedStartArtifact,
} from "../../shared/lib/architecture-bounded-closeout.ts";
import {
  readDirectiveArchitectureHandoffArtifact,
  type DirectiveArchitectureHandoffArtifact,
} from "../../shared/lib/architecture-handoff-start.ts";
import {
  readDirectiveEngineRunDetail,
  readDirectiveEngineRunsOverview,
  type DirectiveEngineRunDetail,
  type DirectiveEngineRunsOverview,
} from "../../shared/lib/engine-run-artifacts.ts";
import { createStandaloneFilesystemHost } from "../standalone-host/runtime.ts";

export type FrontendQueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  received_at: string;
  status: string;
  routing_target: string | null;
  capability_gap_id: string | null;
  intake_record_path: string | null;
  fast_path_record_path: string | null;
  routing_record_path: string | null;
  result_record_path: string | null;
  notes: string | null;
};

export type FrontendQueueOverview = {
  ok: boolean;
  rootPath: string;
  queuePath: string;
  updatedAt: string | null;
  totalEntries: number;
  entries: FrontendQueueEntry[];
};

export type FrontendHandoffStub = {
  kind: "architecture_handoff" | "architecture_handoff_invalid" | "forge_follow_up";
  lane: "architecture" | "forge";
  relativePath: string;
  candidateId: string;
  title: string;
  status: string;
  startRelativePath: string | null;
  warning: string | null;
};

export type DirectiveFrontendSnapshot = {
  engineRuns: DirectiveEngineRunsOverview;
  queue: FrontendQueueOverview;
  architectureHandoffs: DirectiveArchitectureHandoffArtifact[];
  handoffStubs: FrontendHandoffStub[];
  handoffWarnings: string[];
};

export type DirectiveFrontendHandoffDetail =
  | {
      ok: true;
      kind: "architecture_handoff";
      relativePath: string;
      content: string;
      artifact: DirectiveArchitectureHandoffArtifact;
    }
  | {
      ok: true;
      kind: "forge_follow_up";
      relativePath: string;
      content: string;
      title: string;
      candidateId: string;
      status: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureStartDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      objective: string;
      startApproval: string;
      resultSummary: string;
      handoffStubPath: string;
      resultRelativePath: string | null;
      decisionRelativePath: string | null;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

export type DirectiveFrontendArchitectureResultDetail =
  | {
      ok: true;
      relativePath: string;
      absolutePath: string;
      title: string;
      candidateId: string;
      candidateName: string;
      objective: string;
      closeoutApproval: string;
      resultSummary: string;
      nextDecision: string;
      verdict: string;
      rationale: string;
      startRelativePath: string;
      handoffStubPath: string;
      decisionRelativePath: string;
      content: string;
    }
  | {
      ok: false;
      error: string;
      relativePath: string;
    };

function normalizePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}

function extractMarkdownTitle(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .find((line) => line.startsWith("# "))
    ?.replace(/^# /, "")
    .trim()
    || "";
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    return "";
  }

  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
}

export function readFrontendQueueOverview(input: {
  directiveRoot: string;
  maxEntries?: number;
}): FrontendQueueOverview {
  const host = createStandaloneFilesystemHost({
    directiveRoot: input.directiveRoot,
  });

  try {
    const queue = host.readQueue() as {
      updatedAt?: string | null;
      entries?: FrontendQueueEntry[];
    } | null;
    const queuePath = normalizePath(
      path.join(input.directiveRoot, "discovery", "intake-queue.json"),
    );

    if (!queue || !Array.isArray(queue.entries)) {
      return {
        ok: false,
        rootPath: normalizePath(input.directiveRoot),
        queuePath,
        updatedAt: null,
        totalEntries: 0,
        entries: [],
      };
    }

    const entries = [...queue.entries]
      .sort((left, right) =>
        `${right.received_at}|${right.candidate_id}`.localeCompare(
          `${left.received_at}|${left.candidate_id}`,
        ))
      .slice(0, Math.max(1, input.maxEntries ?? 12));

    return {
      ok: true,
      rootPath: normalizePath(input.directiveRoot),
      queuePath,
      updatedAt: queue.updatedAt ?? null,
      totalEntries: queue.entries.length,
      entries,
    };
  } finally {
    host.close();
  }
}

function readForgeFollowUpStubs(input: {
  directiveRoot: string;
  maxEntries?: number;
}): FrontendHandoffStub[] {
  const followUpRoot = path.join(input.directiveRoot, "forge", "follow-up");
  if (!fs.existsSync(followUpRoot)) {
    return [];
  }

  return fs
    .readdirSync(followUpRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith("-forge-follow-up-record.md"))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, Math.max(1, input.maxEntries ?? 20))
    .map((entry) => {
      const relativePath = normalizeRelativePath(path.join("forge", "follow-up", entry.name));
      const content = fs.readFileSync(path.join(followUpRoot, entry.name), "utf8");
      const title = content
        .split(/\r?\n/)
        .find((line) => line.startsWith("# "))
        ?.replace(/^# /, "")
        .trim()
        || entry.name;
      const candidateId = entry.name.replace(/-forge-follow-up-record\.md$/u, "");

      return {
        kind: "forge_follow_up" as const,
        lane: "forge" as const,
        relativePath,
        candidateId,
        title,
        status: "pending_review",
        startRelativePath: null,
        warning: null,
      };
    });
}

function readArchitectureHandoffStubs(input: {
  directiveRoot: string;
  maxEntries?: number;
}) {
  const experimentsRoot = path.join(input.directiveRoot, "architecture", "02-experiments");
  const maxEntries = Math.max(1, input.maxEntries ?? 20);
  if (!fs.existsSync(experimentsRoot)) {
    return {
      artifacts: [] as DirectiveArchitectureHandoffArtifact[],
      stubs: [] as FrontendHandoffStub[],
      warnings: [] as string[],
    };
  }

  const warnings: string[] = [];
  const artifacts: DirectiveArchitectureHandoffArtifact[] = [];
  const stubs = fs
    .readdirSync(experimentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith("-engine-handoff.md"))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, maxEntries)
    .map((entry) => {
      const relativePath = normalizeRelativePath(path.join("architecture", "02-experiments", entry.name));

      try {
        const handoff = readDirectiveArchitectureHandoffArtifact({
          directiveRoot: input.directiveRoot,
          handoffPath: relativePath,
        });
        artifacts.push(handoff);
        return {
          kind: "architecture_handoff" as const,
          lane: "architecture" as const,
          relativePath: handoff.handoffRelativePath,
          candidateId: handoff.candidateId,
          title: handoff.title,
          status: handoff.status,
          startRelativePath: handoff.startExists ? handoff.startRelativePath : null,
          warning: null,
        };
      } catch (error) {
        const warning = String((error as Error).message || error);
        warnings.push(`${relativePath}: ${warning}`);
        return {
          kind: "architecture_handoff_invalid" as const,
          lane: "architecture" as const,
          relativePath,
          candidateId: entry.name.replace(/-engine-handoff\.md$/u, ""),
          title: entry.name,
          status: "invalid_artifact",
          startRelativePath: null,
          warning,
        };
      }
    });

  return {
    artifacts,
    stubs,
    warnings,
  };
}

export function readDirectiveFrontendSnapshot(input: {
  directiveRoot: string;
  maxRuns?: number;
  maxQueueEntries?: number;
  maxHandoffs?: number;
}): DirectiveFrontendSnapshot {
  const architecture = readArchitectureHandoffStubs({
    directiveRoot: input.directiveRoot,
    maxEntries: input.maxHandoffs ?? 20,
  });
  const handoffStubs: FrontendHandoffStub[] = [
    ...architecture.stubs,
    ...readForgeFollowUpStubs({
      directiveRoot: input.directiveRoot,
      maxEntries: input.maxHandoffs ?? 20,
    }),
  ].sort((left, right) => right.relativePath.localeCompare(left.relativePath));

  return {
    engineRuns: readDirectiveEngineRunsOverview({
      directiveRoot: input.directiveRoot,
      maxRuns: input.maxRuns ?? 8,
    }),
    queue: readFrontendQueueOverview({
      directiveRoot: input.directiveRoot,
      maxEntries: input.maxQueueEntries ?? 12,
    }),
    architectureHandoffs: architecture.artifacts,
    handoffStubs,
    handoffWarnings: architecture.warnings,
  };
}

export function readDirectiveFrontendRunDetail(input: {
  directiveRoot: string;
  runId: string;
}): DirectiveEngineRunDetail {
  return readDirectiveEngineRunDetail({
    directiveRoot: input.directiveRoot,
    runId: input.runId,
  });
}

export function readDirectiveFrontendArtifactText(input: {
  directiveRoot: string;
  relativePath: string;
}) {
  const directiveRoot = normalizePath(input.directiveRoot);
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    throw new Error("invalid_input: relativePath is required");
  }
  if (path.isAbsolute(relativePath)) {
    throw new Error("invalid_input: relativePath must be relative to directive-workspace");
  }

  const absolutePath = normalizePath(path.join(directiveRoot, relativePath));
  const rootPrefix = `${normalizePath(directiveRoot)}/`;
  if (absolutePath !== directiveRoot && !absolutePath.startsWith(rootPrefix)) {
    throw new Error("invalid_input: relativePath must stay within directive-workspace");
  }
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`invalid_input: artifact not found: ${relativePath}`);
  }

  return {
    relativePath,
    absolutePath,
    content: fs.readFileSync(absolutePath, "utf8"),
  };
}

export function readDirectiveFrontendQueueEntry(input: {
  directiveRoot: string;
  candidateId: string;
}) {
  const candidateId = String(input.candidateId || "").trim();
  if (!candidateId) {
    return null;
  }

  return readFrontendQueueOverview({
    directiveRoot: input.directiveRoot,
    maxEntries: 500,
  }).entries.find((entry) => entry.candidate_id === candidateId)
    || null;
}

export function readDirectiveFrontendHandoffDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendHandoffDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  try {
    const artifactText = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });

    if (
      relativePath.startsWith("architecture/02-experiments/")
      && relativePath.endsWith("-engine-handoff.md")
    ) {
      return {
        ok: true,
        kind: "architecture_handoff",
        relativePath,
        content: artifactText.content,
        artifact: readDirectiveArchitectureHandoffArtifact({
          directiveRoot: input.directiveRoot,
          handoffPath: relativePath,
        }),
      };
    }

    if (
      relativePath.startsWith("forge/follow-up/")
      && relativePath.endsWith("-forge-follow-up-record.md")
    ) {
      return {
        ok: true,
        kind: "forge_follow_up",
        relativePath,
        content: artifactText.content,
        title: extractMarkdownTitle(artifactText.content) || path.basename(relativePath),
        candidateId: extractBulletValue(artifactText.content, "Candidate id")
          || path.basename(relativePath).replace(/-forge-follow-up-record\.md$/u, ""),
        status: extractBulletValue(artifactText.content, "Current status") || "unknown",
      };
    }

    return {
      ok: false,
      error: "unsupported_handoff_kind",
      relativePath,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureStartDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureStartDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/02-experiments/")
    || !relativePath.endsWith("-bounded-start.md")
  ) {
    return {
      ok: false,
      error: "invalid_start_artifact_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });
    const parsed = readDirectiveArchitectureBoundedStartArtifact({
      directiveRoot: input.directiveRoot,
      startPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.absolutePath,
      title: extractMarkdownTitle(artifact.content),
      candidateId: extractBulletValue(artifact.content, "Candidate id"),
      candidateName: extractBulletValue(artifact.content, "Candidate name"),
      objective: extractBulletValue(artifact.content, "Objective"),
      startApproval: extractBulletValue(artifact.content, "Start approval"),
      resultSummary: extractBulletValue(artifact.content, "Result summary"),
      handoffStubPath: extractBulletValue(artifact.content, "Handoff stub"),
      resultRelativePath: parsed.resultExists ? parsed.resultRelativePath : null,
      decisionRelativePath: parsed.decisionExists ? parsed.decisionRelativePath : null,
      content: artifact.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export function readDirectiveFrontendArchitectureResultDetail(input: {
  directiveRoot: string;
  relativePath: string;
}): DirectiveFrontendArchitectureResultDetail {
  const relativePath = normalizeRelativePath(String(input.relativePath || "").trim());
  if (!relativePath) {
    return {
      ok: false,
      error: "missing_relative_path",
      relativePath,
    };
  }

  if (
    !relativePath.startsWith("architecture/02-experiments/")
    || !relativePath.endsWith("-bounded-result.md")
  ) {
    return {
      ok: false,
      error: "invalid_result_artifact_path",
      relativePath,
    };
  }

  try {
    const artifact = readDirectiveFrontendArtifactText({
      directiveRoot: input.directiveRoot,
      relativePath,
    });
    const parsed = readDirectiveArchitectureBoundedResultArtifact({
      directiveRoot: input.directiveRoot,
      resultPath: relativePath,
    });

    return {
      ok: true,
      relativePath,
      absolutePath: artifact.absolutePath,
      title: parsed.title,
      candidateId: parsed.candidateId,
      candidateName: parsed.candidateName,
      objective: parsed.objective,
      closeoutApproval: parsed.closeoutApproval,
      resultSummary: parsed.resultSummary,
      nextDecision: parsed.nextDecision,
      verdict: parsed.verdict,
      rationale: parsed.rationale,
      startRelativePath: parsed.startRelativePath,
      handoffStubPath: parsed.handoffStubPath,
      decisionRelativePath: parsed.decisionRelativePath,
      content: artifact.content,
    };
  } catch (error) {
    return {
      ok: false,
      error: String((error as Error).message || error),
      relativePath,
    };
  }
}

export type WorkbenchQueueEntry = FrontendQueueEntry;
export type WorkbenchQueueOverview = FrontendQueueOverview;
export type WorkbenchHandoffStub = FrontendHandoffStub;
export type DirectiveWorkbenchSnapshot = DirectiveFrontendSnapshot;
export type DirectiveWorkbenchHandoffDetail = DirectiveFrontendHandoffDetail;
export type DirectiveWorkbenchArchitectureStartDetail = DirectiveFrontendArchitectureStartDetail;
export type DirectiveWorkbenchArchitectureResultDetail = DirectiveFrontendArchitectureResultDetail;

export const readWorkbenchQueueOverview = readFrontendQueueOverview;
export const readDirectiveWorkbenchSnapshot = readDirectiveFrontendSnapshot;
export const readDirectiveWorkbenchRunDetail = readDirectiveFrontendRunDetail;
export const readDirectiveWorkbenchArtifactText = readDirectiveFrontendArtifactText;
export const readDirectiveWorkbenchQueueEntry = readDirectiveFrontendQueueEntry;
export const readDirectiveWorkbenchHandoffDetail = readDirectiveFrontendHandoffDetail;
export const readDirectiveWorkbenchArchitectureStartDetail =
  readDirectiveFrontendArchitectureStartDetail;
export const readDirectiveWorkbenchArchitectureResultDetail =
  readDirectiveFrontendArchitectureResultDetail;
