import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveArchitectureConsumptionRecordDetail,
} from "./architecture-consumption-record.ts";

export type EvaluateDirectiveArchitectureConsumptionInput = {
  consumptionPath: string;
  directiveRoot?: string;
  evaluatedBy?: string | null;
  decision?: "keep" | "reopen";
  rationale?: string | null;
  observedStability?: string | null;
  retainedUsefulnessAssessment?: string | null;
  nextBoundedAction?: string | null;
  rollbackNote?: string | null;
};

export type DirectiveArchitecturePostConsumptionEvaluationResult = {
  ok: true;
  created: boolean;
  snapshotAt: string;
  directiveRoot: string;
  consumptionRelativePath: string;
  consumptionAbsolutePath: string;
  evaluationRelativePath: string;
  evaluationAbsolutePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
  decision: "keep" | "reopen";
};

export type DirectiveArchitecturePostConsumptionEvaluationDetail = {
  directiveRoot: string;
  evaluationRelativePath: string;
  evaluationAbsolutePath: string;
  consumptionRelativePath: string;
  consumptionAbsolutePath: string;
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
  decision: "keep" | "reopen";
  rationale: string;
  observedStability: string;
  retainedUsefulnessAssessment: string;
  nextBoundedAction: string;
  rollbackNote: string;
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

function resolveEvaluationRelativePath(consumptionRelativePath: string) {
  const fileName = path.posix.basename(consumptionRelativePath);
  if (!fileName.endsWith("-consumption.md")) {
    throw new Error("invalid_input: consumptionPath must point to a consumption record artifact");
  }

  return path.posix.join(
    "architecture/09-post-consumption-evaluations",
    fileName.replace(/-consumption\.md$/u, "-evaluation.md"),
  );
}

function renderEvaluationMarkdown(input: {
  snapshotAt: string;
  evaluatedBy: string;
  evaluationRelativePath: string;
  consumptionRelativePath: string;
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
  decision: "keep" | "reopen";
  rationale: string;
  observedStability: string;
  retainedUsefulnessAssessment: string;
  nextBoundedAction: string;
  rollbackNote: string;
}) {
  return [
    `# Post-Consumption Evaluation: ${input.candidateName} (${input.snapshotAt.slice(0, 10)})`,
    "",
    "## consumption reference",
    `- Candidate id: \`${input.candidateId}\``,
    `- Candidate name: ${input.candidateName}`,
    `- Source consumption record: \`${input.consumptionRelativePath}\``,
    `- Source integration record: \`${input.integrationRelativePath}\``,
    `- Source retained artifact: \`${input.retainedRelativePath}\``,
    `- Source implementation result: \`${input.resultRelativePath}\``,
    `- Source implementation target: \`${input.targetRelativePath}\``,
    `- Source adoption artifact: \`${input.adoptionRelativePath}\``,
    `- Source bounded result artifact: \`${input.sourceResultRelativePath}\``,
    `- Usefulness level: \`${input.usefulnessLevel}\``,
    `- Retained objective: ${input.objective}`,
    "",
    "## keep or reopen decision",
    `- Decision: \`${input.decision}\``,
    `- Evaluation approval: \`${input.evaluatedBy}\``,
    "",
    "## rationale",
    `- ${input.rationale}`,
    "",
    "## observed stability",
    `- ${input.observedStability}`,
    "",
    "## retained usefulness assessment",
    `- ${input.retainedUsefulnessAssessment}`,
    "",
    "## next bounded action if reopen",
    `- ${input.nextBoundedAction}`,
    "",
    "## rollback note",
    `- ${input.rollbackNote}`,
    "",
    "## artifact linkage",
    `- This post-consumption evaluation is now stored at \`${input.evaluationRelativePath}\`.`,
    `- If this judgment later proves wrong, resume from \`${input.consumptionRelativePath}\` instead of reconstructing the applied chain by hand.`,
    "",
  ].join("\n");
}

export function evaluateDirectiveArchitectureConsumption(
  input: EvaluateDirectiveArchitectureConsumptionInput,
): DirectiveArchitecturePostConsumptionEvaluationResult {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const consumptionRelativePath = resolveDirectiveRelativePath(directiveRoot, input.consumptionPath);
  const consumptionDetail = readDirectiveArchitectureConsumptionRecordDetail({
    directiveRoot,
    consumptionPath: consumptionRelativePath,
  });
  const evaluationRelativePath = resolveEvaluationRelativePath(consumptionRelativePath);
  const evaluationAbsolutePath = normalizePath(path.join(directiveRoot, evaluationRelativePath));
  const created = !fs.existsSync(evaluationAbsolutePath);
  const snapshotAt = new Date().toISOString();
  const evaluatedBy = String(input.evaluatedBy || "directive-frontend-operator").trim()
    || "directive-frontend-operator";
  const decision = input.decision === "reopen" ? "reopen" : "keep";
  const rationale = optionalString(input.rationale)
    || (decision === "keep"
      ? "Real bounded use validated this applied Architecture output strongly enough to keep it as valid retained Directive Workspace Architecture output."
      : "Real bounded use exposed enough uncertainty that this applied Architecture output should reopen a bounded Architecture slice.");
  const observedStability = optionalString(input.observedStability)
    || (decision === "keep"
      ? "Observed behavior stayed stable within the applied integration boundary."
      : "Observed behavior indicates the applied integration should not yet be treated as stable retained output.");
  const retainedUsefulnessAssessment = optionalString(input.retainedUsefulnessAssessment)
    || (decision === "keep"
      ? "The retained Architecture output still appears useful and valid after real bounded consumption."
      : "The retained Architecture output needs another bounded Architecture pass before it should remain valid retained output.");
  const nextBoundedAction = optionalString(input.nextBoundedAction)
    || (decision === "keep"
      ? "No reopen action required within the current bounded scope."
      : "Reopen one bounded Architecture slice from the retained or integration artifact and re-evaluate the applied boundary.");
  const rollbackNote = optionalString(input.rollbackNote)
    || "If this evaluation later proves inaccurate, return to the consumption record and reassess keep versus reopen before any further step.";

  const markdown = renderEvaluationMarkdown({
    snapshotAt,
    evaluatedBy,
    evaluationRelativePath,
    consumptionRelativePath,
    integrationRelativePath: consumptionDetail.integrationRelativePath,
    retainedRelativePath: consumptionDetail.retainedRelativePath,
    resultRelativePath: consumptionDetail.resultRelativePath,
    targetRelativePath: consumptionDetail.targetRelativePath,
    adoptionRelativePath: consumptionDetail.adoptionRelativePath,
    sourceResultRelativePath: consumptionDetail.sourceResultRelativePath,
    candidateId: consumptionDetail.candidateId,
    candidateName: consumptionDetail.candidateName,
    usefulnessLevel: consumptionDetail.usefulnessLevel,
    objective: consumptionDetail.objective,
    decision,
    rationale,
    observedStability,
    retainedUsefulnessAssessment,
    nextBoundedAction,
    rollbackNote,
  });

  fs.mkdirSync(path.dirname(evaluationAbsolutePath), { recursive: true });
  fs.writeFileSync(evaluationAbsolutePath, markdown, "utf8");

  return {
    ok: true,
    created,
    snapshotAt,
    directiveRoot,
    consumptionRelativePath,
    consumptionAbsolutePath: consumptionDetail.consumptionAbsolutePath,
    evaluationRelativePath,
    evaluationAbsolutePath,
    candidateId: consumptionDetail.candidateId,
    candidateName: consumptionDetail.candidateName,
    usefulnessLevel: consumptionDetail.usefulnessLevel,
    decision,
  };
}

export function readDirectiveArchitecturePostConsumptionEvaluationDetail(input: {
  evaluationPath: string;
  directiveRoot?: string;
}): DirectiveArchitecturePostConsumptionEvaluationDetail {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const evaluationRelativePath = resolveDirectiveRelativePath(directiveRoot, input.evaluationPath);
  if (!evaluationRelativePath.startsWith("architecture/09-post-consumption-evaluations/")) {
    throw new Error("invalid_input: evaluationPath must point to architecture/09-post-consumption-evaluations/");
  }

  const evaluationAbsolutePath = normalizePath(path.join(directiveRoot, evaluationRelativePath));
  if (!fs.existsSync(evaluationAbsolutePath)) {
    throw new Error(`invalid_input: evaluationPath not found: ${evaluationRelativePath}`);
  }

  const content = fs.readFileSync(evaluationAbsolutePath, "utf8");
  const consumptionRelativePath = content.match(/- Source consumption record: `([^`]+)`/)?.[1] || "";
  const consumptionDetail = readDirectiveArchitectureConsumptionRecordDetail({
    directiveRoot,
    consumptionPath: consumptionRelativePath,
  });

  return {
    directiveRoot,
    evaluationRelativePath,
    evaluationAbsolutePath,
    consumptionRelativePath,
    consumptionAbsolutePath: consumptionDetail.consumptionAbsolutePath,
    integrationRelativePath: consumptionDetail.integrationRelativePath,
    retainedRelativePath: consumptionDetail.retainedRelativePath,
    resultRelativePath: consumptionDetail.resultRelativePath,
    targetRelativePath: consumptionDetail.targetRelativePath,
    adoptionRelativePath: consumptionDetail.adoptionRelativePath,
    sourceResultRelativePath: consumptionDetail.sourceResultRelativePath,
    candidateId: consumptionDetail.candidateId,
    candidateName: consumptionDetail.candidateName,
    usefulnessLevel: consumptionDetail.usefulnessLevel,
    objective: content.match(/- Retained objective: (.+)$/m)?.[1]?.trim() || "",
    decision: (content.match(/- Decision: `([^`]+)`/)?.[1] || "keep") as "keep" | "reopen",
    rationale: content.match(/^## rationale\r?\n- (.+)$/m)?.[1]?.trim() || "",
    observedStability: content.match(/^## observed stability\r?\n- (.+)$/m)?.[1]?.trim() || "",
    retainedUsefulnessAssessment: content.match(/^## retained usefulness assessment\r?\n- (.+)$/m)?.[1]?.trim() || "",
    nextBoundedAction: content.match(/^## next bounded action if reopen\r?\n- (.+)$/m)?.[1]?.trim() || "",
    rollbackNote: content.match(/^## rollback note\r?\n- (.+)$/m)?.[1]?.trim() || "",
    content,
  };
}
