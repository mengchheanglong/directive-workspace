import fs from "node:fs";
import path from "node:path";

import {
  normalizeDirectiveApprovalActor,
  normalizeDirectiveWorkspaceRoot,
  requireDirectiveExplicitApproval,
  requireDirectiveString,
  resolveDirectiveWorkspaceRelativePath,
  writeDirectiveArtifactIfMissing,
} from "../../engine/approval-boundary.ts";
import {
  renderRuntimeFollowUpRecord,
  type RuntimeFollowUpRecordRequest,
} from "./runtime-follow-up-record-writer.ts";
import { syncDiscoveryIntakeLifecycle } from "./discovery-intake-lifecycle-sync.ts";

type DiscoveryRouteDestination = "architecture" | "runtime" | "monitor" | "defer" | "reject" | "reference";

type DirectiveEngineRunRecordLike = {
  runId: string;
  receivedAt: string;
  source: {
    sourceRef: string;
  };
  candidate: {
    candidateId: string;
    candidateName: string;
    usefulnessLevel: string;
    matchedGapId?: string | null;
  };
  analysis: {
    usefulnessRationale: string;
  };
  routingAssessment?: {
    matchedGapId?: string | null;
  };
  extractionPlan: {
    extractedValue: string[];
    excludedBaggage: string[];
  };
  proofPlan: {
    objective: string;
    requiredEvidence: string[];
    requiredGates: string[];
    rollbackPrompt: string;
  };
  decision: {
    decisionState: string;
  };
  integrationProposal: {
    integrationMode: string;
    nextAction: string;
    valuableWithoutHostRuntime: boolean;
    hostDependence?: string | null;
  };
};

export type DirectiveDiscoveryRoutingArtifact = {
  title: string;
  date: string;
  candidateId: string;
  candidateName: string;
  routingDate: string;
  sourceType: string;
  decisionState: string;
  adoptionTarget: string;
  routeDestination: DiscoveryRouteDestination;
  whyThisRoute: string;
  whyNotAlternatives: string;
  handoffContractUsed: string | null;
  receivingTrackOwner: string;
  requiredNextArtifact: string;
  reentryOrPromotionConditions: string | null;
  reviewCadence: string | null;
  linkedIntakeRecord: string;
  linkedTriageRecord: string | null;
  routingRelativePath: string;
  routingAbsolutePath: string;
  downstreamStubRelativePath: string | null;
  downstreamStubExists: boolean;
  approvalAllowed: boolean;
  engineRunRecordPath: string | null;
  engineRunReportPath: string | null;
  engineRunId: string | null;
  usefulnessLevel: string | null;
  usefulnessRationale: string | null;
  matchedGapId: string | null;
};

export type DirectiveDiscoveryRouteOpenResult = {
  ok: true;
  created: boolean;
  directiveRoot: string;
  routingRelativePath: string;
  routeDestination: "architecture" | "runtime";
  stubKind: "architecture_handoff" | "runtime_follow_up";
  stubRelativePath: string;
  stubAbsolutePath: string;
  candidateId: string;
  candidateName: string;
  queuePath: string;
};

function normalizeRelativePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}

function optionalString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === "n/a") {
    return null;
  }
  return normalized;
}

function readUtf8(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function extractMarkdownTitle(markdown: string) {
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.startsWith("# "));
  return requireDirectiveString(line?.replace(/^# /, ""), "routing record title");
}

function extractBulletValue(markdown: string, label: string) {
  const prefix = `- ${label}:`;
  const line = markdown
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(prefix));
  if (!line) {
    throw new Error(`invalid_input: missing "${label}" in Discovery routing record`);
  }
  return line
    .trim()
    .replace(prefix, "")
    .trim()
    .replace(/^`|`$/g, "");
}

function parseDiscoveryRoutingMarkdown(markdown: string) {
  const dateLine = markdown
    .split(/\r?\n/)
    .find((entry) => entry.startsWith("Date: "));
  const title = extractMarkdownTitle(markdown).replace(/^Discovery Routing Record:\s*/, "").trim();

  return {
    title,
    date: requireDirectiveString(dateLine?.replace(/^Date:\s*/, ""), "routing record date"),
    candidateId: extractBulletValue(markdown, "Candidate id"),
    candidateName: extractBulletValue(markdown, "Candidate name"),
    routingDate: extractBulletValue(markdown, "Routing date"),
    sourceType: extractBulletValue(markdown, "Source type"),
    decisionState: extractBulletValue(markdown, "Decision state"),
    adoptionTarget: extractBulletValue(markdown, "Adoption target"),
    routeDestination: extractBulletValue(markdown, "Route destination") as DiscoveryRouteDestination,
    whyThisRoute: extractBulletValue(markdown, "Why this route"),
    whyNotAlternatives: extractBulletValue(markdown, "Why not the alternatives"),
    handoffContractUsed: optionalString(extractBulletValue(markdown, "Handoff contract used")),
    receivingTrackOwner: extractBulletValue(markdown, "Receiving track owner"),
    requiredNextArtifact: extractBulletValue(markdown, "Required next artifact"),
    reentryOrPromotionConditions: optionalString(
      extractBulletValue(markdown, "Re-entry/Promotion trigger conditions"),
    ),
    reviewCadence: optionalString(extractBulletValue(markdown, "Review cadence")),
    linkedIntakeRecord: extractBulletValue(markdown, "Linked intake record"),
    linkedTriageRecord: optionalString(extractBulletValue(markdown, "Linked triage record")),
  };
}

function isDirectiveEngineRunRecordLike(value: unknown): value is DirectiveEngineRunRecordLike {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  const candidate = record.candidate as Record<string, unknown> | undefined;
  const analysis = record.analysis as Record<string, unknown> | undefined;
  const extractionPlan = record.extractionPlan as Record<string, unknown> | undefined;
  const proofPlan = record.proofPlan as Record<string, unknown> | undefined;
  const integrationProposal = record.integrationProposal as Record<string, unknown> | undefined;
  const source = record.source as Record<string, unknown> | undefined;

  return Boolean(
    typeof record.runId === "string"
      && typeof record.receivedAt === "string"
      && typeof source?.sourceRef === "string"
      && typeof candidate?.candidateId === "string"
      && typeof candidate?.candidateName === "string"
      && typeof candidate?.usefulnessLevel === "string"
      && typeof analysis?.usefulnessRationale === "string"
      && Array.isArray(extractionPlan?.extractedValue)
      && Array.isArray(extractionPlan?.excludedBaggage)
      && typeof proofPlan?.objective === "string"
      && Array.isArray(proofPlan?.requiredEvidence)
      && Array.isArray(proofPlan?.requiredGates)
      && typeof proofPlan?.rollbackPrompt === "string"
      && typeof integrationProposal?.integrationMode === "string"
      && typeof integrationProposal?.nextAction === "string"
      && typeof integrationProposal?.valuableWithoutHostRuntime === "boolean",
  );
}

function findEngineRunForCandidate(input: {
  directiveRoot: string;
  candidateId: string;
}) {
  const engineRunsRoot = path.join(input.directiveRoot, "runtime", "standalone-host", "engine-runs");
  if (!fs.existsSync(engineRunsRoot)) {
    return null;
  }

  const matches = fs
    .readdirSync(engineRunsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
    .map((entry) => path.join(engineRunsRoot, entry.name))
    .map((recordPath) => {
      try {
        const parsed = JSON.parse(readUtf8(recordPath)) as unknown;
        if (!isDirectiveEngineRunRecordLike(parsed)) {
          return null;
        }
        if (parsed.candidate.candidateId !== input.candidateId) {
          return null;
        }
        const reportPath = recordPath.replace(/\.json$/i, ".md");
        return {
          record: parsed,
          recordAbsolutePath: path.resolve(recordPath).replace(/\\/g, "/"),
          recordRelativePath: normalizeRelativePath(
            path.relative(input.directiveRoot, recordPath),
          ),
          reportAbsolutePath: fs.existsSync(reportPath)
            ? path.resolve(reportPath).replace(/\\/g, "/")
            : null,
          reportRelativePath: fs.existsSync(reportPath)
            ? normalizeRelativePath(path.relative(input.directiveRoot, reportPath))
            : null,
        };
      } catch {
        return null;
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => right.record.receivedAt.localeCompare(left.record.receivedAt));

  return matches[0] ?? null;
}

function readQueueDocument(directiveRoot: string) {
  const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
  if (!fs.existsSync(queuePath)) {
    throw new Error(`invalid_input: discovery queue not found: ${path.resolve(queuePath).replace(/\\/g, "/")}`);
  }
  return {
    queuePath: path.resolve(queuePath).replace(/\\/g, "/"),
    queue: JSON.parse(readUtf8(queuePath)) as {
      status: string;
      updatedAt: string;
      entries: Array<{
        candidate_id: string;
        intake_record_path?: string | null;
        routing_record_path?: string | null;
        routing_target?: string | null;
        result_record_path?: string | null;
      }>;
    },
  };
}

function renderArchitectureHandoffMarkdown(input: {
  routingRelativePath: string;
  routeDate: string;
  engineRecordRelativePath: string;
  engineReportRelativePath: string | null;
  record: DirectiveEngineRunRecordLike;
}) {
  const extractedValue = input.record.extractionPlan.extractedValue.length > 0
    ? input.record.extractionPlan.extractedValue.map((value) => `  - ${value}`).join("\n")
    : "  - n/a";
  const requiredGates = input.record.proofPlan.requiredGates.length > 0
    ? input.record.proofPlan.requiredGates.map((gate) => `  - \`${gate}\``).join("\n")
    : "  - n/a";

  return [
    `# ${input.record.candidate.candidateName} Engine-Routed Architecture Experiment`,
    "",
    `Date: ${input.routeDate}`,
    "Track: Architecture",
    "Type: engine-routed handoff",
    "Status: pending_review",
    "",
    "## Source",
    "",
    `- Candidate id: \`${input.record.candidate.candidateId}\``,
    `- Source reference: \`${input.record.source.sourceRef}\``,
    `- Engine run record: \`${input.engineRecordRelativePath}\``,
    `- Engine run report: \`${input.engineReportRelativePath ?? "n/a"}\``,
    `- Discovery routing record: \`${input.routingRelativePath}\``,
    `- Usefulness level: \`${input.record.candidate.usefulnessLevel}\``,
    `- Usefulness rationale: ${input.record.analysis.usefulnessRationale}`,
    "",
    "## Objective",
    "",
    input.record.integrationProposal.nextAction,
    "",
    "## Bounded scope",
    "",
    "- Keep this at one Architecture experiment slice.",
    "- Preserve human review before any adoption or host integration.",
    "- Do not execute downstream Engine changes from this stub alone.",
    "",
    "## Inputs",
    "",
    extractedValue,
    "",
    "## Validation gate(s)",
    "",
    requiredGates,
    "",
    "## Lifecycle classification",
    "",
    "- Origin: `source-driven`",
    `- Usefulness level: \`${input.record.candidate.usefulnessLevel}\``,
    `- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? \`${input.record.integrationProposal.valuableWithoutHostRuntime ? "yes" : "no"}\``,
    "",
    "## Rollback",
    "",
    input.record.proofPlan.rollbackPrompt,
    "",
    "## Next decision",
    "",
    "- `needs-more-evidence`",
    "",
  ].join("\n");
}

function buildRuntimeFollowUpRequest(input: {
  artifact: DirectiveDiscoveryRoutingArtifact;
  record: DirectiveEngineRunRecordLike;
}): RuntimeFollowUpRecordRequest {
  return {
    candidate_id: input.artifact.candidateId,
    candidate_name: input.artifact.candidateName,
    follow_up_date: input.artifact.routingDate,
    current_decision_state: input.record.decision.decisionState || input.artifact.decisionState,
    origin_track: "discovery-routing-approval",
    runtime_value_to_operationalize:
      input.record.integrationProposal.nextAction
      || input.record.extractionPlan.extractedValue[0]
      || "Bounded runtime usefulness conversion remains to be defined.",
    proposed_host: "pending_host_selection",
    proposed_integration_mode: input.record.integrationProposal.integrationMode,
    source_pack_allowlist_profile: "n/a",
    allowed_export_surfaces: [
      "bounded runtime capability",
      "callable capability boundary",
    ],
    excluded_baggage: input.record.extractionPlan.excludedBaggage,
    promotion_contract_path: null,
    reentry_contract_path: null,
    reentry_preconditions: [
      "Human review confirms the bounded runtime objective.",
      "Proof scope stays narrow and reversible.",
    ],
    required_proof: input.record.proofPlan.requiredEvidence,
    required_gates: input.record.proofPlan.requiredGates,
    trial_scope_limit: [
      "Keep this as a follow-up stub only.",
      "Do not execute runtime integration from this record alone.",
    ],
    risks: [
      "Human review still required.",
      "Host-specific baggage can leak into runtime implementation if adaptation is skipped.",
    ],
    rollback: input.record.proofPlan.rollbackPrompt,
    no_op_path:
      "Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.",
    review_cadence:
      input.artifact.reviewCadence
      ?? "Review on the next active Directive Workspace operating pass.",
    current_status: "pending_review",
    linked_handoff_path: input.artifact.routingRelativePath,
    output_relative_path: input.artifact.requiredNextArtifact,
  };
}

function readRoutingArtifact(input: {
  directiveRoot: string;
  routingRelativePath: string;
}): DirectiveDiscoveryRoutingArtifact {
  if (!input.routingRelativePath.startsWith("discovery/routing-log/")) {
    throw new Error("invalid_input: routingPath must point to discovery/routing-log/");
  }

  const routingAbsolutePath = path.resolve(input.directiveRoot, input.routingRelativePath).replace(/\\/g, "/");
  if (!fs.existsSync(routingAbsolutePath)) {
    throw new Error(`invalid_input: routingPath not found: ${input.routingRelativePath}`);
  }

  const parsed = parseDiscoveryRoutingMarkdown(readUtf8(routingAbsolutePath));
  const engineRun = findEngineRunForCandidate({
    directiveRoot: input.directiveRoot,
    candidateId: parsed.candidateId,
  });
  const { queue } = readQueueDocument(input.directiveRoot);
  const queueEntry = queue.entries.find((entry) => entry.candidate_id === parsed.candidateId) ?? null;
  const approvalAllowed =
    parsed.decisionState === "adopt"
    && (parsed.routeDestination === "architecture" || parsed.routeDestination === "runtime");
  const downstreamStubRelativePath = approvalAllowed
    ? optionalString(queueEntry?.result_record_path)
      ?? (fs.existsSync(path.join(input.directiveRoot, parsed.requiredNextArtifact))
        ? parsed.requiredNextArtifact
        : null)
    : null;

  return {
    ...parsed,
    routingRelativePath: input.routingRelativePath,
    routingAbsolutePath,
    downstreamStubRelativePath,
    downstreamStubExists: Boolean(downstreamStubRelativePath),
    approvalAllowed,
    engineRunRecordPath: engineRun?.recordRelativePath ?? null,
    engineRunReportPath: engineRun?.reportRelativePath ?? null,
    engineRunId: engineRun?.record.runId ?? null,
    usefulnessLevel: engineRun?.record.candidate.usefulnessLevel ?? null,
    usefulnessRationale: engineRun?.record.analysis.usefulnessRationale ?? null,
    matchedGapId:
      engineRun?.record.candidate.matchedGapId
      ?? engineRun?.record.routingAssessment?.matchedGapId
      ?? null,
  };
}

function updateQueueForOpenedRoute(input: {
  directiveRoot: string;
  artifact: DirectiveDiscoveryRoutingArtifact;
  stubRelativePath: string;
  approvedBy: string;
}) {
  const { queuePath, queue } = readQueueDocument(input.directiveRoot);
  const result = syncDiscoveryIntakeLifecycle({
    directiveRoot: input.directiveRoot,
    queue,
    transitionDate: input.artifact.routingDate,
    request: {
      candidate_id: input.artifact.candidateId,
      target_phase: "routed",
      routing_target: input.artifact.routeDestination,
      intake_record_path: input.artifact.linkedIntakeRecord,
      routing_record_path: input.artifact.routingRelativePath,
      result_record_path: input.stubRelativePath,
      note_append: `route approval by ${input.approvedBy} opened ${input.stubRelativePath}`,
    },
  });
  writeJson(queuePath, result.queue);
  return queuePath;
}

export function readDirectiveDiscoveryRoutingArtifact(input: {
  routingPath: string;
  directiveRoot?: string;
}) {
  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const routingRelativePath = resolveDirectiveWorkspaceRelativePath(
    directiveRoot,
    input.routingPath,
    "routingPath",
  );
  return readRoutingArtifact({
    directiveRoot,
    routingRelativePath,
  });
}

export function openDirectiveDiscoveryRoute(input: {
  routingPath: string;
  approved?: boolean;
  approvedBy?: string | null;
  directiveRoot?: string;
}): DirectiveDiscoveryRouteOpenResult {
  requireDirectiveExplicitApproval({
    approved: input.approved,
    action: "open a Discovery route",
  });

  const directiveRoot = normalizeDirectiveWorkspaceRoot(input.directiveRoot);
  const routingRelativePath = resolveDirectiveWorkspaceRelativePath(
    directiveRoot,
    input.routingPath,
    "routingPath",
  );
  const artifact = readRoutingArtifact({
    directiveRoot,
    routingRelativePath,
  });

  if (!artifact.approvalAllowed) {
    throw new Error(
      `invalid_input: routing record cannot open downstream work for route destination "${artifact.routeDestination}" and decision "${artifact.decisionState}"`,
    );
  }

  const engineRun = findEngineRunForCandidate({
    directiveRoot,
    candidateId: artifact.candidateId,
  });
  if (!engineRun) {
    throw new Error(
      `invalid_state: no Engine run artifact found for candidate ${artifact.candidateId}`,
    );
  }
  if (!engineRun.reportRelativePath) {
    throw new Error(
      `invalid_state: Engine run report missing for candidate ${artifact.candidateId}`,
    );
  }

  const approvedBy = normalizeDirectiveApprovalActor(input.approvedBy);
  const stubRelativePath = normalizeRelativePath(artifact.requiredNextArtifact);
  const stubAbsolutePath = path.resolve(directiveRoot, stubRelativePath).replace(/\\/g, "/");

  if (artifact.routeDestination === "architecture") {
    if (
      !stubRelativePath.startsWith("architecture/02-experiments/")
      || !stubRelativePath.endsWith("-engine-handoff.md")
    ) {
      throw new Error("invalid_input: Architecture route must open an engine handoff stub");
    }

    const created = writeDirectiveArtifactIfMissing({
      absolutePath: stubAbsolutePath,
      content: renderArchitectureHandoffMarkdown({
        routingRelativePath,
        routeDate: artifact.routingDate,
        engineRecordRelativePath: engineRun.recordRelativePath,
        engineReportRelativePath: engineRun.reportRelativePath,
        record: engineRun.record,
      }),
    });

    const queuePath = updateQueueForOpenedRoute({
      directiveRoot,
      artifact,
      stubRelativePath,
      approvedBy,
    });

    return {
      ok: true,
      created,
      directiveRoot,
      routingRelativePath,
      routeDestination: "architecture",
      stubKind: "architecture_handoff",
      stubRelativePath,
      stubAbsolutePath,
      candidateId: artifact.candidateId,
      candidateName: artifact.candidateName,
      queuePath,
    };
  }

  if (
    !stubRelativePath.startsWith("runtime/follow-up/")
    || !stubRelativePath.endsWith("-runtime-follow-up-record.md")
  ) {
    throw new Error("invalid_input: Runtime route must open a Runtime follow-up stub");
  }

  const created = writeDirectiveArtifactIfMissing({
    absolutePath: stubAbsolutePath,
    content: renderRuntimeFollowUpRecord(
      buildRuntimeFollowUpRequest({
        artifact,
        record: engineRun.record,
      }),
    ),
  });

  const queuePath = updateQueueForOpenedRoute({
    directiveRoot,
    artifact,
    stubRelativePath,
    approvedBy,
  });

  return {
    ok: true,
    created,
    directiveRoot,
    routingRelativePath,
    routeDestination: "runtime",
    stubKind: "runtime_follow_up",
    stubRelativePath,
    stubAbsolutePath,
    candidateId: artifact.candidateId,
    candidateName: artifact.candidateName,
    queuePath,
  };
}
