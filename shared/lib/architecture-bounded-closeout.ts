import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDirectiveArchitectureCloseoutFile,
  type DirectiveArchitectureCloseoutWriteRequest,
} from "./architecture-closeout.ts";
import {
  upsertDirectiveArchitectureAdoptionDecisionArtifact,
} from "./architecture-adoption-decision-store.ts";
import type {
  ArchitectureUsefulnessLevel,
  ArchitectureValueShape,
} from "./architecture-adoption-resolution.ts";

export type DirectiveArchitectureBoundedStartArtifact = {
  title: string;
  candidateId: string;
  candidateName: string;
  experimentDate: string;
  startApproval: string;
  objective: string;
  boundedScope: string[];
  inputs: string[];
  validationGates: string[];
  blockedRecoveryPath: string;
  failureCriteria: string;
  rollback: string;
  resultSummary: string;
  expectedOutput: string[];
  handoffStubPath: string;
  engineRunRecordPath: string;
  engineRunReportPath: string;
  discoveryRoutingRecordPath: string;
  nextDecision: string;
  usefulnessLevel: ArchitectureUsefulnessLevel;
  forgeThresholdCheck: string;
  sourceAnalysisRef: string;
  adaptationDecisionRef: string;
  adaptationQuality: "strong" | "adequate" | "weak" | "skipped";
  improvementQuality: "strong" | "adequate" | "weak" | "skipped";
  metaUseful: boolean;
  metaUsefulnessCategory: string;
  transformationArtifactGateResult: string;
  transformedArtifactsProduced: string[];
  directiveRoot: string;
  startRelativePath: string;
  startAbsolutePath: string;
  resultRelativePath: string;
  resultAbsolutePath: string;
  resultExists: boolean;
  decisionRelativePath: string;
  decisionAbsolutePath: string;
  decisionExists: boolean;
};

export type DirectiveArchitectureBoundedResultArtifact = {
  title: string;
  candidateId: string;
  candidateName: string;
  experimentDate: string;
  closeoutApproval: string;
  objective: string;
  boundedScope: string[];
  inputs: string[];
  validationGates: string[];
  resultSummary: string;
  nextDecision: string;
  handoffStubPath: string;
  startRelativePath: string;
  engineRunRecordPath: string;
  engineRunReportPath: string;
  discoveryRoutingRecordPath: string;
  decisionRelativePath: string;
  usefulnessLevel: ArchitectureUsefulnessLevel;
  forgeThresholdCheck: string;
  rollback: string;
  verdict: string;
  rationale: string;
  directiveRoot: string;
  resultRelativePath: string;
  resultAbsolutePath: string;
  decisionAbsolutePath: string;
  decisionExists: boolean;
};

export type CloseDirectiveArchitectureBoundedStartInput = {
  startPath: string;
  directiveRoot?: string;
  closedBy?: string | null;
  resultSummary: string;
  nextDecision?: "needs-more-evidence" | "defer" | "reject";
  valueShape?: ArchitectureValueShape;
  adaptationQuality?: "strong" | "adequate" | "weak" | "skipped";
  improvementQuality?: "strong" | "adequate" | "weak" | "skipped";
  proofExecuted?: boolean;
  targetArtifactClarified?: boolean;
  deltaEvidencePresent?: boolean;
  productArtifactMaterialized?: boolean;
};

export type DirectiveArchitectureBoundedCloseoutResult = {
  ok: true;
  created: boolean;
  snapshotAt: string;
  directiveRoot: string;
  startRelativePath: string;
  startAbsolutePath: string;
  resultRelativePath: string;
  resultAbsolutePath: string;
  decisionRelativePath: string;
  decisionAbsolutePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: ArchitectureUsefulnessLevel;
  objective: string;
  resultSummary: string;
  nextDecision: string;
  verdict: string;
  closeoutState: string;
};

const START_FIELD_LABELS = new Set([
  "Candidate id",
  "Candidate name",
  "Experiment date",
  "Owning track",
  "Experiment type",
  "Start approval",
  "Objective",
  "Bounded scope",
  "Inputs",
  "Expected output",
  "Validation gate(s)",
  "Transition policy profile",
  "Scoring policy profile",
  "Blocked recovery path",
  "Failure criteria",
  "Rollback",
  "Result summary",
  "Evidence path",
  "Handoff stub",
  "Bounded start",
  "Engine run record",
  "Engine run report",
  "Discovery routing record",
  "Closeout approval",
  "Closeout decision artifact",
  "Next decision",
  "Origin",
  "Usefulness level",
  "Forge threshold check",
  "Source analysis ref",
  "Adaptation decision ref",
  "Adaptation quality",
  "Improvement quality",
  "Meta-useful",
  "Meta-usefulness category",
  "Transformation artifact gate result",
  "Transformed artifacts produced",
  "Verdict",
  "Rationale",
]);

const VALUE_SHAPES: ArchitectureValueShape[] = [
  "interface_or_handoff",
  "data_shape",
  "working_document",
  "behavior_rule",
  "design_pattern",
  "executable_logic",
  "operating_model_change",
];

const QUALITY_LEVELS = new Set(["strong", "adequate", "weak", "skipped"]);

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

function stripBackticks(value: string) {
  return value.trim().replace(/^`|`$/g, "");
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

function parseLabeledBulletFields(markdown: string) {
  const result = new Map<string, string[]>();
  let currentLabel: string | null = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith("- ")) {
      continue;
    }

    const labeledMatch = /^- ([^:]+):(.*)$/.exec(line);
    if (labeledMatch && START_FIELD_LABELS.has(labeledMatch[1].trim())) {
      currentLabel = labeledMatch[1].trim();
      const firstValue = stripBackticks(labeledMatch[2].trim());
      result.set(currentLabel, firstValue ? [firstValue] : []);
      continue;
    }

    if (!currentLabel) {
      continue;
    }

    const values = result.get(currentLabel) || [];
    values.push(stripBackticks(line.replace(/^- /, "").trim()));
    result.set(currentLabel, values);
  }

  return result;
}

function firstField(fields: Map<string, string[]>, label: string, fieldName: string) {
  const value = fields.get(label)?.[0];
  return requiredString(value, fieldName);
}

function optionalFirstField(fields: Map<string, string[]>, label: string) {
  return optionalString(fields.get(label)?.[0]);
}

function listField(fields: Map<string, string[]>, label: string) {
  return (fields.get(label) || []).filter(Boolean);
}

function resolveResultRelativePath(startRelativePath: string) {
  if (!startRelativePath.endsWith("-bounded-start.md")) {
    throw new Error("invalid_input: startPath must point to an Architecture bounded-start artifact");
  }
  return startRelativePath.replace(/-bounded-start\.md$/u, "-bounded-result.md");
}

function parseQualityLevel(value: string | null, fallback: "strong" | "adequate" | "weak" | "skipped") {
  if (value && QUALITY_LEVELS.has(value)) {
    return value as "strong" | "adequate" | "weak" | "skipped";
  }
  return fallback;
}

function parseBoundedStartMarkdown(markdown: string) {
  const fields = parseLabeledBulletFields(markdown);
  const title = requiredString(
    markdown.split(/\r?\n/).find((line) => line.startsWith("# "))?.replace(/^# /, "").replace(/ Bounded Architecture Start$/, ""),
    "title",
  );

  return {
    title,
    candidateId: firstField(fields, "Candidate id", "candidate id"),
    candidateName: firstField(fields, "Candidate name", "candidate name"),
    experimentDate: firstField(fields, "Experiment date", "experiment date"),
    startApproval: firstField(fields, "Start approval", "start approval"),
    objective: firstField(fields, "Objective", "objective"),
    boundedScope: listField(fields, "Bounded scope"),
    inputs: listField(fields, "Inputs"),
    validationGates: listField(fields, "Validation gate(s)"),
    blockedRecoveryPath: firstField(fields, "Blocked recovery path", "blocked recovery path"),
    failureCriteria: firstField(fields, "Failure criteria", "failure criteria"),
    rollback: firstField(fields, "Rollback", "rollback"),
    resultSummary: firstField(fields, "Result summary", "result summary"),
    expectedOutput: listField(fields, "Expected output"),
    handoffStubPath: firstField(fields, "Handoff stub", "handoff stub"),
    engineRunRecordPath: firstField(fields, "Engine run record", "engine run record"),
    engineRunReportPath: firstField(fields, "Engine run report", "engine run report"),
    discoveryRoutingRecordPath: firstField(fields, "Discovery routing record", "discovery routing record"),
    nextDecision: firstField(fields, "Next decision", "next decision"),
    usefulnessLevel: firstField(fields, "Usefulness level", "usefulness level") as ArchitectureUsefulnessLevel,
    forgeThresholdCheck: firstField(fields, "Forge threshold check", "forge threshold check"),
    sourceAnalysisRef: firstField(fields, "Source analysis ref", "source analysis ref"),
    adaptationDecisionRef: optionalFirstField(fields, "Adaptation decision ref") || "n/a",
    adaptationQuality: parseQualityLevel(optionalFirstField(fields, "Adaptation quality"), "skipped"),
    improvementQuality: parseQualityLevel(optionalFirstField(fields, "Improvement quality"), "skipped"),
    metaUseful: (optionalFirstField(fields, "Meta-useful") || "no").toLowerCase() === "yes",
    metaUsefulnessCategory: optionalFirstField(fields, "Meta-usefulness category") || "n/a",
    transformationArtifactGateResult: optionalFirstField(fields, "Transformation artifact gate result") || "partial",
    transformedArtifactsProduced: listField(fields, "Transformed artifacts produced"),
  };
}

function renderBoundedResultMarkdown(input: {
  startArtifact: DirectiveArchitectureBoundedStartArtifact;
  snapshotAt: string;
  closedBy: string;
  resultSummary: string;
  nextDecision: string;
  closeout: ReturnType<typeof buildDirectiveArchitectureCloseoutFile>;
}) {
  const artifact = input.startArtifact;
  const closeout = input.closeout;
  const boundedScope = artifact.boundedScope.length > 0
    ? artifact.boundedScope.map((item) => `- ${item}`).join("\n")
    : "- Keep the result bounded to the approved Architecture slice.";
  const inputs = artifact.inputs.length > 0
    ? artifact.inputs.map((item) => `- ${item}`).join("\n")
    : "- n/a";
  const gates = artifact.validationGates.length > 0
    ? artifact.validationGates.map((item) => `- \`${item}\``).join("\n")
    : "- n/a";
  const expectedOutput = artifact.expectedOutput.length > 0
    ? artifact.expectedOutput.map((item) => `- ${item}`).join("\n")
    : "- One bounded Architecture result artifact.";
  const transformedArtifacts = artifact.transformedArtifactsProduced.length > 0
    ? artifact.transformedArtifactsProduced.map((item) => `- \`${item}\``).join("\n")
    : `- \`${artifact.handoffStubPath}\``;

  return [
    `# ${artifact.title} Bounded Architecture Result`,
    "",
    `- Candidate id: ${artifact.candidateId}`,
    `- Candidate name: ${artifact.candidateName}`,
    `- Experiment date: ${input.snapshotAt.slice(0, 10)}`,
    "- Owning track: Architecture",
    "- Experiment type: engine-routed bounded result",
    `- Closeout approval: reviewed by ${input.closedBy} from bounded start \`${artifact.startRelativePath}\``,
    "",
    `- Objective: ${artifact.objective}`,
    "- Bounded scope:",
    boundedScope,
    "- Inputs:",
    inputs,
    "- Expected output:",
    expectedOutput,
    "- Validation gate(s):",
    gates,
    "- Transition policy profile: `decision_review`",
    "- Scoring policy profile: `architecture_self_improvement`",
    `- Blocked recovery path: ${artifact.blockedRecoveryPath}`,
    `- Failure criteria: ${artifact.failureCriteria}`,
    `- Rollback: ${artifact.rollback}`,
    `- Result summary: ${input.resultSummary}`,
    "- Evidence path:",
    `- Bounded start: \`${artifact.startRelativePath}\``,
    `- Handoff stub: \`${artifact.handoffStubPath}\``,
    `- Engine run record: \`${artifact.engineRunRecordPath}\``,
    `- Engine run report: \`${artifact.engineRunReportPath}\``,
    `- Discovery routing record: \`${artifact.discoveryRoutingRecordPath}\``,
    `- Closeout decision artifact: \`${closeout.relativePath}\``,
    `- Next decision: \`${input.nextDecision}\``,
    "",
    "## Lifecycle classification (per `architecture-artifact-lifecycle` contract)",
    "",
    "- Origin: `source-driven`",
    `- Usefulness level: \`${artifact.usefulnessLevel}\``,
    `- Forge threshold check: ${artifact.forgeThresholdCheck}`,
    "",
    "## Source adaptation fields (Architecture source-driven experiments only)",
    "",
    `- Source analysis ref: ${artifact.sourceAnalysisRef}`,
    `- Adaptation decision ref: ${artifact.adaptationDecisionRef}`,
    `- Adaptation quality: \`${closeout.artifact.adaptation_quality}\``,
    `- Improvement quality: \`${closeout.artifact.improvement_quality || artifact.improvementQuality}\``,
    `- Meta-useful: \`${artifact.metaUseful ? "yes" : "no"}\``,
    `- Meta-usefulness category: \`${artifact.metaUsefulnessCategory}\``,
    `- Transformation artifact gate result: \`${artifact.transformationArtifactGateResult}\``,
    "- Transformed artifacts produced:",
    transformedArtifacts,
    "",
    "## Closeout decision",
    "",
    `- Verdict: \`${closeout.artifact.decision.verdict}\``,
    `- Rationale: ${closeout.artifact.decision.rationale}`,
    `- Review result: \`${closeout.reviewResolution?.reviewResult || "not_run"}\``,
    `- Review score: \`${String(closeout.reviewResolution?.reviewScore ?? "n/a")}\``,
    "",
  ].join("\n");
}

export function readDirectiveArchitectureBoundedStartArtifact(input: {
  startPath: string;
  directiveRoot?: string;
}): DirectiveArchitectureBoundedStartArtifact {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const startRelativePath = resolveDirectiveRelativePath(directiveRoot, input.startPath);

  if (
    !startRelativePath.startsWith("architecture/02-experiments/")
    || !startRelativePath.endsWith("-bounded-start.md")
  ) {
    throw new Error("invalid_input: startPath must point to architecture/02-experiments/*-bounded-start.md");
  }

  const startAbsolutePath = normalizePath(path.join(directiveRoot, startRelativePath));
  if (!fs.existsSync(startAbsolutePath)) {
    throw new Error(`invalid_input: startPath not found: ${startRelativePath}`);
  }

  const parsed = parseBoundedStartMarkdown(fs.readFileSync(startAbsolutePath, "utf8"));
  const resultRelativePath = resolveResultRelativePath(startRelativePath);
  const resultAbsolutePath = normalizePath(path.join(directiveRoot, resultRelativePath));
  const decisionRelativePath = resultRelativePath.replace(/\.md$/u, "-adoption-decision.json");
  const decisionAbsolutePath = normalizePath(path.join(directiveRoot, decisionRelativePath));

  return {
    ...parsed,
    directiveRoot,
    startRelativePath,
    startAbsolutePath,
    resultRelativePath,
    resultAbsolutePath,
    resultExists: fs.existsSync(resultAbsolutePath),
    decisionRelativePath,
    decisionAbsolutePath,
    decisionExists: fs.existsSync(decisionAbsolutePath),
  };
}

export function readDirectiveArchitectureBoundedResultArtifact(input: {
  resultPath: string;
  directiveRoot?: string;
}): DirectiveArchitectureBoundedResultArtifact {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const resultRelativePath = resolveDirectiveRelativePath(directiveRoot, input.resultPath);

  if (
    !resultRelativePath.startsWith("architecture/02-experiments/")
    || !resultRelativePath.endsWith("-bounded-result.md")
  ) {
    throw new Error("invalid_input: resultPath must point to architecture/02-experiments/*-bounded-result.md");
  }

  const resultAbsolutePath = normalizePath(path.join(directiveRoot, resultRelativePath));
  if (!fs.existsSync(resultAbsolutePath)) {
    throw new Error(`invalid_input: resultPath not found: ${resultRelativePath}`);
  }

  const fields = parseLabeledBulletFields(fs.readFileSync(resultAbsolutePath, "utf8"));
  const decisionRelativePath = resultRelativePath.replace(/\.md$/u, "-adoption-decision.json");
  const decisionAbsolutePath = normalizePath(path.join(directiveRoot, decisionRelativePath));
  const title = requiredString(
    fs.readFileSync(resultAbsolutePath, "utf8")
      .split(/\r?\n/)
      .find((line) => line.startsWith("# "))
      ?.replace(/^# /, "")
      .replace(/ Bounded Architecture Result$/, ""),
    "title",
  );

  return {
    title,
    candidateId: firstField(fields, "Candidate id", "candidate id"),
    candidateName: firstField(fields, "Candidate name", "candidate name"),
    experimentDate: firstField(fields, "Experiment date", "experiment date"),
    closeoutApproval: firstField(fields, "Closeout approval", "closeout approval"),
    objective: firstField(fields, "Objective", "objective"),
    boundedScope: listField(fields, "Bounded scope"),
    inputs: listField(fields, "Inputs"),
    validationGates: listField(fields, "Validation gate(s)"),
    resultSummary: firstField(fields, "Result summary", "result summary"),
    nextDecision: firstField(fields, "Next decision", "next decision"),
    handoffStubPath: firstField(fields, "Handoff stub", "handoff stub"),
    startRelativePath: firstField(fields, "Bounded start", "bounded start"),
    engineRunRecordPath: firstField(fields, "Engine run record", "engine run record"),
    engineRunReportPath: firstField(fields, "Engine run report", "engine run report"),
    discoveryRoutingRecordPath: firstField(fields, "Discovery routing record", "discovery routing record"),
    decisionRelativePath: firstField(fields, "Closeout decision artifact", "closeout decision artifact"),
    usefulnessLevel: firstField(fields, "Usefulness level", "usefulness level") as ArchitectureUsefulnessLevel,
    forgeThresholdCheck: firstField(fields, "Forge threshold check", "forge threshold check"),
    rollback: firstField(fields, "Rollback", "rollback"),
    verdict: firstField(fields, "Verdict", "verdict"),
    rationale: firstField(fields, "Rationale", "rationale"),
    directiveRoot,
    resultRelativePath,
    resultAbsolutePath,
    decisionAbsolutePath,
    decisionExists: fs.existsSync(decisionAbsolutePath),
  };
}

export function closeDirectiveArchitectureBoundedStart(
  input: CloseDirectiveArchitectureBoundedStartInput,
): DirectiveArchitectureBoundedCloseoutResult {
  const startArtifact = readDirectiveArchitectureBoundedStartArtifact({
    directiveRoot: input.directiveRoot,
    startPath: input.startPath,
  });

  const closedBy = String(input.closedBy || "directive-frontend-operator").trim()
    || "directive-frontend-operator";
  const snapshotAt = new Date().toISOString();
  const created = !startArtifact.resultExists;
  const resultSummary = requiredString(input.resultSummary, "resultSummary");
  const nextDecision = input.nextDecision || "needs-more-evidence";
  const valueShape = input.valueShape && VALUE_SHAPES.includes(input.valueShape)
    ? input.valueShape
    : "working_document";
  const adaptationQuality = input.adaptationQuality && QUALITY_LEVELS.has(input.adaptationQuality)
    ? input.adaptationQuality
    : "adequate";
  const improvementQuality = input.improvementQuality && QUALITY_LEVELS.has(input.improvementQuality)
    ? input.improvementQuality
    : "skipped";
  const proofExecuted = input.proofExecuted === true;
  const targetArtifactClarified = input.targetArtifactClarified !== false;
  const deltaEvidencePresent = input.deltaEvidencePresent !== false;
  const productArtifactMaterialized = input.productArtifactMaterialized === true;
  const valuableWithoutRuntimeSurface = startArtifact.forgeThresholdCheck.toLowerCase().includes("yes");

  const closeoutRequest: DirectiveArchitectureCloseoutWriteRequest = {
    recordRelativePath: startArtifact.resultRelativePath,
    sourceId: startArtifact.candidateId,
    usefulnessLevel: startArtifact.usefulnessLevel,
    valueShape,
    readinessCheck: {
      source_analysis_complete: true,
      adaptation_decision_complete: targetArtifactClarified,
      adaptation_quality_acceptable: adaptationQuality === "strong" || adaptationQuality === "adequate",
      delta_evidence_present: deltaEvidencePresent,
      no_unresolved_baggage: false,
    },
    adaptationQuality,
    improvementQuality,
    productArtifactMaterialized,
    proofExecuted,
    targetArtifactClarified,
    valuableWithoutRuntimeSurface,
    sourceAnalysisRef: startArtifact.sourceAnalysisRef,
    adaptationDecisionRef:
      startArtifact.adaptationDecisionRef && startArtifact.adaptationDecisionRef !== "n/a"
        ? startArtifact.adaptationDecisionRef
        : undefined,
    artifactPath: startArtifact.resultRelativePath,
    reviewInput: {
      candidateId: startArtifact.candidateId,
      checks: {
        state_visibility_check: "pass",
        rollback_check: "pass",
        scope_isolation_check: "pass",
        validation_link_check: proofExecuted ? "pass" : "warning",
        ownership_boundary_check: "pass",
        packet_consumption_check: "pass",
        artifact_evidence_continuity_check: deltaEvidencePresent ? "pass" : "warning",
      },
    },
  };

  const closeout = buildDirectiveArchitectureCloseoutFile(closeoutRequest);
  const markdown = renderBoundedResultMarkdown({
    startArtifact,
    snapshotAt,
    closedBy,
    resultSummary,
    nextDecision,
    closeout,
  });

  fs.mkdirSync(path.dirname(startArtifact.resultAbsolutePath), { recursive: true });
  fs.writeFileSync(startArtifact.resultAbsolutePath, markdown, "utf8");

  upsertDirectiveArchitectureAdoptionDecisionArtifact({
    directiveRoot: startArtifact.directiveRoot,
    recordRelativePath: startArtifact.resultRelativePath,
    outputRelativePath: closeout.relativePath,
    artifact: closeout.artifact,
  });

  return {
    ok: true,
    created,
    snapshotAt,
    directiveRoot: startArtifact.directiveRoot,
    startRelativePath: startArtifact.startRelativePath,
    startAbsolutePath: startArtifact.startAbsolutePath,
    resultRelativePath: startArtifact.resultRelativePath,
    resultAbsolutePath: startArtifact.resultAbsolutePath,
    decisionRelativePath: closeout.relativePath,
    decisionAbsolutePath: path.join(startArtifact.directiveRoot, closeout.relativePath).replace(/\\/g, "/"),
    candidateId: startArtifact.candidateId,
    candidateName: startArtifact.candidateName,
    usefulnessLevel: startArtifact.usefulnessLevel,
    objective: startArtifact.objective,
    resultSummary,
    nextDecision,
    verdict: closeout.artifact.decision.verdict,
    closeoutState: closeout.closeoutState,
  };
}
