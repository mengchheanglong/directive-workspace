import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type DirectiveArchitectureHandoffStartResult = {
  ok: true;
  created: boolean;
  snapshotAt: string;
  directiveRoot: string;
  handoffRelativePath: string;
  handoffAbsolutePath: string;
  startRelativePath: string;
  startAbsolutePath: string;
  candidateId: string;
  candidateName: string;
  usefulnessLevel: string;
  usefulnessRationale: string;
  objective: string;
};

export type DirectiveArchitectureHandoffArtifact = {
  title: string;
  date: string;
  status: string;
  candidateId: string;
  sourceReference: string;
  engineRunRecordPath: string;
  engineRunReportPath: string;
  discoveryRoutingRecordPath: string;
  usefulnessLevel: string;
  usefulnessRationale: string;
  objective: string;
  boundedScope: string[];
  inputs: string[];
  validationGates: string[];
  forgeThresholdCheck: string;
  rollback: string;
  nextDecision: string[];
  directiveRoot: string;
  handoffRelativePath: string;
  handoffAbsolutePath: string;
  startRelativePath: string | null;
  startAbsolutePath: string | null;
  startExists: boolean;
};

type ParsedArchitectureHandoff = Omit<
  DirectiveArchitectureHandoffArtifact,
  | "directiveRoot"
  | "handoffRelativePath"
  | "handoffAbsolutePath"
  | "startRelativePath"
  | "startAbsolutePath"
  | "startExists"
>;

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

function stripBackticks(value: string) {
  return value.trim().replace(/^`|`$/g, "");
}

function extractSection(markdown: string, heading: string) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === `## ${heading}`.toLowerCase(),
  );
  if (startIndex < 0) {
    throw new Error(`invalid_input: missing section "${heading}" in Architecture handoff stub`);
  }

  const body: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (line.trim().startsWith("## ")) {
      break;
    }
    body.push(line);
  }
  return body.join("\n").trim();
}

function extractSingleValue(section: string, label: string) {
  const line = section
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`- ${label}:`));
  if (!line) {
    throw new Error(`invalid_input: missing "${label}" in Architecture handoff stub`);
  }
  return stripBackticks(line.replace(/^- /, "").split(":").slice(1).join(":"));
}

function extractList(section: string) {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^- /.test(line) || /^- `/.test(line) || /^-/.test(line))
    .map((line) => stripBackticks(line.replace(/^- /, "").trim()))
    .filter(Boolean);
}

function extractParagraph(section: string) {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .trim();
}

function parseArchitectureHandoffMarkdown(markdown: string): ParsedArchitectureHandoff {
  const lines = markdown.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# "));
  const dateLine = lines.find((line) => line.startsWith("Date: "));
  const statusLine = lines.find((line) => line.startsWith("Status: "));
  if (!titleLine || !dateLine || !statusLine) {
    throw new Error("invalid_input: Architecture handoff stub header is incomplete");
  }

  const sourceSection = extractSection(markdown, "Source");
  const lifecycleSection = extractSection(markdown, "Lifecycle classification");

  return {
    title: titleLine.replace(/^# /, "").replace(/ Engine-Routed Architecture Experiment$/, "").trim(),
    date: requiredString(dateLine.replace(/^Date:\s*/, ""), "handoff date"),
    status: requiredString(statusLine.replace(/^Status:\s*/, ""), "handoff status"),
    candidateId: extractSingleValue(sourceSection, "Candidate id"),
    sourceReference: extractSingleValue(sourceSection, "Source reference"),
    engineRunRecordPath: extractSingleValue(sourceSection, "Engine run record"),
    engineRunReportPath: extractSingleValue(sourceSection, "Engine run report"),
    discoveryRoutingRecordPath: extractSingleValue(sourceSection, "Discovery routing record"),
    usefulnessLevel: extractSingleValue(sourceSection, "Usefulness level"),
    usefulnessRationale: requiredString(
      sourceSection
        .split(/\r?\n/)
        .find((entry) => entry.trim().startsWith("- Usefulness rationale:"))
        ?.replace(/^- Usefulness rationale:\s*/, ""),
      "usefulness rationale",
    ),
    objective: extractParagraph(extractSection(markdown, "Objective")),
    boundedScope: extractList(extractSection(markdown, "Bounded scope")),
    inputs: extractList(extractSection(markdown, "Inputs")),
    validationGates: extractList(extractSection(markdown, "Validation gate(s)")),
    forgeThresholdCheck: requiredString(
      lifecycleSection
        .split(/\r?\n/)
        .find((entry) => entry.trim().startsWith("- Forge threshold check:"))
        ?.replace(/^- Forge threshold check:\s*/, ""),
      "forge threshold check",
    ),
    rollback: extractParagraph(extractSection(markdown, "Rollback")),
    nextDecision: extractList(extractSection(markdown, "Next decision")),
  };
}

function resolveDirectiveRelativePath(directiveRoot: string, inputPath: string) {
  const normalizedInput = requiredString(inputPath, "handoffPath").replace(/\\/g, "/");
  const root = path.resolve(directiveRoot);
  const absolutePath = path.isAbsolute(normalizedInput)
    ? path.resolve(normalizedInput)
    : path.resolve(root, normalizedInput);
  const normalizedRootPrefix = `${root}${path.sep}`;

  if (absolutePath !== root && !absolutePath.startsWith(normalizedRootPrefix)) {
    throw new Error("invalid_input: handoffPath must stay within directive-workspace");
  }

  return path.relative(root, absolutePath).replace(/\\/g, "/");
}

function resolveStartRelativePath(handoffRelativePath: string) {
  if (!handoffRelativePath.endsWith("-engine-handoff.md")) {
    throw new Error("invalid_input: handoffPath must point to an Architecture engine-handoff stub");
  }
  return handoffRelativePath.replace(/-engine-handoff\.md$/u, "-bounded-start.md");
}

function readArchitectureHandoffArtifact(input: {
  directiveRoot: string;
  handoffRelativePath: string;
}): DirectiveArchitectureHandoffArtifact {
  if (!input.handoffRelativePath.startsWith("architecture/02-experiments/")) {
    throw new Error("invalid_input: handoffPath must point to architecture/02-experiments/");
  }

  const handoffAbsolutePath = normalizePath(
    path.join(input.directiveRoot, input.handoffRelativePath),
  );
  if (!fs.existsSync(handoffAbsolutePath)) {
    throw new Error(`invalid_input: handoffPath not found: ${input.handoffRelativePath}`);
  }

  const parsed = parseArchitectureHandoffMarkdown(
    fs.readFileSync(handoffAbsolutePath, "utf8"),
  );
  const startRelativePath = resolveStartRelativePath(input.handoffRelativePath);
  const startAbsolutePath = normalizePath(path.join(input.directiveRoot, startRelativePath));

  return {
    ...parsed,
    directiveRoot: input.directiveRoot,
    handoffRelativePath: input.handoffRelativePath,
    handoffAbsolutePath,
    startRelativePath,
    startAbsolutePath,
    startExists: fs.existsSync(startAbsolutePath),
  };
}

function renderArchitectureBoundedStart(input: {
  handoffRelativePath: string;
  startDate: string;
  startedBy: string;
  parsed: ParsedArchitectureHandoff;
}) {
  const metaUseful = input.parsed.usefulnessLevel === "meta" ? "yes" : "no";
  const boundedScope = input.parsed.boundedScope.length > 0
    ? input.parsed.boundedScope.map((item) => `- ${item}`).join("\n")
    : "- Keep the experiment bounded to one Architecture slice.";
  const inputs = input.parsed.inputs.length > 0
    ? input.parsed.inputs.map((item) => `- ${item}`).join("\n")
    : "- n/a";
  const gates = input.parsed.validationGates.length > 0
    ? input.parsed.validationGates.map((item) => `- \`${item}\``).join("\n")
    : "- n/a";
  const nextDecision = input.parsed.nextDecision[0] || "needs-more-evidence";

  return [
    `# ${input.parsed.title} Bounded Architecture Start`,
    "",
    `- Candidate id: ${input.parsed.candidateId}`,
    `- Candidate name: ${input.parsed.title}`,
    `- Experiment date: ${input.startDate}`,
    "- Owning track: Architecture",
    "- Experiment type: engine-routed bounded start",
    `- Start approval: approved by ${input.startedBy} from routed handoff \`${input.handoffRelativePath}\``,
    "",
    `- Objective: ${input.parsed.objective}`,
    "- Bounded scope:",
    boundedScope,
    "- Inputs:",
    inputs,
    "- Expected output:",
    "- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.",
    "- Validation gate(s):",
    gates,
    "- Transition policy profile: `decision_review`",
    "- Scoring policy profile: `architecture_self_improvement`",
    "- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.",
    "- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.",
    `- Rollback: ${input.parsed.rollback}`,
    "- Result summary: pending_execution",
    "- Evidence path:",
    `- Handoff stub: \`${input.handoffRelativePath}\``,
    `- Engine run record: \`${input.parsed.engineRunRecordPath}\``,
    `- Engine run report: \`${input.parsed.engineRunReportPath}\``,
    `- Discovery routing record: \`${input.parsed.discoveryRoutingRecordPath}\``,
    `- Next decision: \`${nextDecision}\``,
    "",
    "## Lifecycle classification (per `architecture-artifact-lifecycle` contract)",
    "",
    "- Origin: `source-driven`",
    `- Usefulness level: \`${input.parsed.usefulnessLevel}\``,
    `- Forge threshold check: ${input.parsed.forgeThresholdCheck}`,
    "",
    "## Source adaptation fields (Architecture source-driven experiments only)",
    "",
    `- Source analysis ref: ${input.handoffRelativePath}`,
    "- Adaptation decision ref: n/a",
    "- Adaptation quality: `skipped`",
    "- Improvement quality: `skipped`",
    `- Meta-useful: \`${metaUseful}\``,
    "- Meta-usefulness category: `n/a`",
    "- Transformation artifact gate result: `partial`",
    `- Transformed artifacts produced: \`${input.handoffRelativePath}\``,
    "",
  ].join("\n");
}

export function readDirectiveArchitectureHandoffArtifact(input: {
  handoffPath: string;
  directiveRoot?: string;
}) {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const handoffRelativePath = resolveDirectiveRelativePath(directiveRoot, input.handoffPath);
  return readArchitectureHandoffArtifact({
    directiveRoot,
    handoffRelativePath,
  });
}

export function listDirectiveArchitectureHandoffArtifacts(input: {
  directiveRoot?: string;
  maxEntries?: number;
} = {}) {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const experimentsRoot = normalizePath(path.join(directiveRoot, "architecture", "02-experiments"));
  const maxEntries = Math.max(1, input.maxEntries ?? 20);

  if (!fs.existsSync(experimentsRoot)) {
    return [];
  }

  return fs
    .readdirSync(experimentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith("-engine-handoff.md"))
    .map((entry) =>
      readArchitectureHandoffArtifact({
        directiveRoot,
        handoffRelativePath: `architecture/02-experiments/${entry.name}`,
      }))
    .sort((left, right) => right.handoffRelativePath.localeCompare(left.handoffRelativePath))
    .slice(0, maxEntries);
}

export function startDirectiveArchitectureFromHandoff(input: {
  handoffPath: string;
  directiveRoot?: string;
  startedBy?: string | null;
}): DirectiveArchitectureHandoffStartResult {
  const directiveRoot = normalizePath(input.directiveRoot || getDefaultDirectiveWorkspaceRoot());
  const handoffRelativePath = resolveDirectiveRelativePath(directiveRoot, input.handoffPath);
  const artifact = readArchitectureHandoffArtifact({
    directiveRoot,
    handoffRelativePath,
  });

  if (artifact.status !== "pending_review") {
    throw new Error("invalid_input: only pending_review Architecture handoff stubs can be started");
  }

  const snapshotAt = new Date().toISOString();
  const created = !artifact.startExists;

  if (created) {
    const startedBy = String(input.startedBy || "directive-frontend-operator").trim()
      || "directive-frontend-operator";
    const startDate = snapshotAt.slice(0, 10);
    const markdown = renderArchitectureBoundedStart({
      handoffRelativePath,
      startDate,
      startedBy,
      parsed: {
        title: artifact.title,
        date: artifact.date,
        status: artifact.status,
        candidateId: artifact.candidateId,
        sourceReference: artifact.sourceReference,
        engineRunRecordPath: artifact.engineRunRecordPath,
        engineRunReportPath: artifact.engineRunReportPath,
        discoveryRoutingRecordPath: artifact.discoveryRoutingRecordPath,
        usefulnessLevel: artifact.usefulnessLevel,
        usefulnessRationale: artifact.usefulnessRationale,
        objective: artifact.objective,
        boundedScope: artifact.boundedScope,
        inputs: artifact.inputs,
        validationGates: artifact.validationGates,
        forgeThresholdCheck: artifact.forgeThresholdCheck,
        rollback: artifact.rollback,
        nextDecision: artifact.nextDecision,
      },
    });
    fs.mkdirSync(path.dirname(artifact.startAbsolutePath as string), { recursive: true });
    fs.writeFileSync(artifact.startAbsolutePath as string, markdown, "utf8");
  }

  return {
    ok: true,
    created,
    snapshotAt,
    directiveRoot,
    handoffRelativePath,
    handoffAbsolutePath: artifact.handoffAbsolutePath,
    startRelativePath: artifact.startRelativePath as string,
    startAbsolutePath: artifact.startAbsolutePath as string,
    candidateId: artifact.candidateId,
    candidateName: artifact.title,
    usefulnessLevel: artifact.usefulnessLevel,
    usefulnessRationale: artifact.usefulnessRationale,
    objective: artifact.objective,
  };
}
