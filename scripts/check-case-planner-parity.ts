import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appendDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE } from "../engine/workspace-truth.ts";
import { planDirectiveMirroredCaseNextStep } from "../shared/lib/case-planner.ts";
import {
  materializeDirectiveMirroredCaseSnapshot,
  type DirectiveMirroredCaseSnapshotResult,
} from "../shared/lib/case-snapshot.ts";
import {
  writeDirectiveMirroredDiscoveryCaseRecord,
  type DirectiveMirroredDiscoveryCaseRecord,
} from "../shared/lib/case-store.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  status: string;
  routing_target: string | null;
  operating_mode?: string | null;
  intake_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "case_planner_parity" as const;
const FAILURE_CONTRACT_VERSION = 1 as const;
const RECOMMEND_TASK_STOP_SKEW_PROBE = "recommend_task_stop_skew" as const;
const RETENTION_CANDIDATE_ID = "dw-mission-core-principles-operating-discipline-2026-03-26";
const PROBE_CONSUMPTION_STAGE = "architecture.consumption.success";
const PROBE_CONSUMPTION_NEXT_LEGAL_STEP =
  "Explicitly evaluate the applied Architecture output after use.";
const GOLDEN_CANDIDATE_IDS = [
  "dw-live-gpt-researcher-engine-pressure-2026-03-24",
  "dw-source-openevals-2026-03-28",
  "dw-source-inspect-ai-2026-03-28",
  "dw-source-promptwizard-2026-03-28",
  "dw-source-ts-edge-2026-03-27",
  "dw-source-scientify-research-workflow-plugin-2026-03-27",
  "dw-source-temporal-durable-execution-2026-04-01",
  "dw-pressure-openmoss-architecture-loop-2026-03-26",
  "dw-mission-core-principles-operating-discipline-2026-03-26",
  "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26",
  "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
  "dw-live-scientify-engine-pressure-2026-03-24",
] as const;

type ProbeMode = typeof RECOMMEND_TASK_STOP_SKEW_PROBE;
type ViolationCode =
  | "golden_queue_entry_missing"
  | "golden_routing_record_missing"
  | "authoritative_focus_missing"
  | "snapshot_missing"
  | "snapshot_nondeterministic"
  | "planner_nondeterministic"
  | "planner_outcome_mismatch"
  | "snapshot_stage_mismatch"
  | "planner_review_target_mismatch"
  | "planner_reason_mismatch"
  | "planner_task_kind_mismatch"
  | "planner_task_precondition_missing"
  | "planner_task_legal_mismatch"
  | "blocked_fixture_mismatch"
  | "checker_runtime_error";

type Violation = {
  code: ViolationCode;
  candidateId: string;
  path: string;
  message: string;
  expected?: string | number | boolean;
  actual?: string | number | boolean;
};

type Success = {
  ok: true;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  checked: Array<{
    candidateId: string;
    outcome: string;
    currentStage: string | null;
    nextLegalStep: string | null;
  }>;
  blockedFixture: ReturnType<typeof planDirectiveMirroredCaseNextStep>;
};

type Failure = {
  ok: false;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  summary: string;
  violations: Violation[];
};

type CheckResult = Success | Failure;
type Options = { probeMode?: ProbeMode };

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function scalarize(value: unknown): string | number | boolean {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  return JSON.stringify(value);
}

function push(violations: Violation[], violation: Violation) {
  violations.push(violation);
}

function eq(
  violations: Violation[],
  candidateId: string,
  code: ViolationCode,
  path: string,
  actual: unknown,
  expected: unknown,
  message: string,
) {
  if (actual === expected) {
    return;
  }
  push(violations, {
    code,
    candidateId,
    path,
    message,
    expected: scalarize(expected),
    actual: scalarize(actual),
  });
}

function match(
  violations: Violation[],
  candidateId: string,
  code: ViolationCode,
  path: string,
  actual: string | undefined,
  expectedPattern: RegExp,
  message: string,
) {
  if (actual && expectedPattern.test(actual)) {
    return;
  }
  push(violations, {
    code,
    candidateId,
    path,
    message,
    expected: expectedPattern.source,
    actual: scalarize(actual ?? "missing"),
  });
}

function arrayContains(
  violations: Violation[],
  candidateId: string,
  path: string,
  actual: string[] | undefined,
  expected: string,
  message: string,
) {
  if (actual?.includes(expected)) {
    return;
  }
  push(violations, {
    code: "planner_task_precondition_missing",
    candidateId,
    path,
    message,
    expected,
    actual: scalarize(actual ?? "missing"),
  });
}

function loadGoldenQueueEntries(violations: Violation[]) {
  const queueDocument = readJson<{ entries: QueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );

  return GOLDEN_CANDIDATE_IDS.flatMap((candidateId) => {
    const entry = queueDocument.entries.find((item) => item.candidate_id === candidateId) ?? null;
    if (!entry) {
      push(violations, {
        code: "golden_queue_entry_missing",
        candidateId,
        path: "discovery/intake-queue.json",
        message: `Golden case missing from discovery queue: ${candidateId}`,
        expected: "present",
        actual: "missing",
      });
      return [];
    }
    if (!entry.routing_record_path) {
      push(violations, {
        code: "golden_routing_record_missing",
        candidateId,
        path: "discovery/intake-queue.json",
        message: `Golden case missing routing record: ${candidateId}`,
        expected: "routing_record_path",
        actual: "missing",
      });
      return [];
    }
    return [entry];
  });
}

function buildMirroredRecord(input: {
  queueEntry: QueueEntry;
  routing: ReturnType<typeof readDirectiveDiscoveryRoutingArtifact>;
  authoritative: NonNullable<ReturnType<typeof resolveDirectiveWorkspaceState>["focus"]>;
}): DirectiveMirroredDiscoveryCaseRecord {
  return {
    schemaVersion: 1,
    mirrorKind: "discovery_front_door_submission",
    caseId: input.queueEntry.candidate_id,
    candidateId: input.queueEntry.candidate_id,
    candidateName: input.queueEntry.candidate_name,
    sourceType: input.queueEntry.source_type,
    sourceReference: input.queueEntry.source_reference,
    decisionState: input.routing.decisionState,
    routeTarget: input.authoritative.routeTarget,
    operatingMode: input.queueEntry.operating_mode ?? null,
    queueStatus: input.queueEntry.status,
    createdAt: input.routing.routingDate,
    updatedAt: input.routing.routingDate,
    linkedArtifacts: {
      intakeRecordPath: input.routing.linkedIntakeRecord,
      triageRecordPath: input.routing.linkedTriageRecord,
      routingRecordPath: input.routing.routingRelativePath,
      engineRunRecordPath: input.routing.engineRunRecordPath,
      engineRunReportPath: input.routing.engineRunReportPath,
      resultRecordPath: input.queueEntry.result_record_path ?? null,
    },
  };
}

function expectedOutcomeForCase(candidateId: string) {
  switch (candidateId) {
    case "dw-live-gpt-researcher-engine-pressure-2026-03-24":
    case "dw-source-openevals-2026-03-28":
    case "dw-source-inspect-ai-2026-03-28":
    case "dw-source-promptwizard-2026-03-28":
    case RETENTION_CANDIDATE_ID:
      return "stop";
    case "dw-source-ts-edge-2026-03-27":
    case "dw-source-scientify-research-workflow-plugin-2026-03-27":
    case "dw-source-temporal-durable-execution-2026-04-01":
    case "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26":
    case "dw-pressure-openmoss-architecture-loop-2026-03-26":
    case "dw-live-mini-swe-agent-engine-pressure-2026-03-24":
    case "dw-live-scientify-engine-pressure-2026-03-24":
      return "parked";
    default:
      throw new Error(`Missing expected planner outcome for ${candidateId}`);
  }
}

function expectedRecommendTaskKindForCase(candidateId: string) {
  switch (candidateId) {
    case RETENTION_CANDIDATE_ID:
      return "evaluate_post_consumption";
    default:
      throw new Error(`Missing expected recommend-task kind for ${candidateId}`);
  }
}

function expectedRecommendTaskPatternForCase(candidateId: string) {
  switch (candidateId) {
    case RETENTION_CANDIDATE_ID:
      return /(evaluate the applied architecture output after use)/i;
    default:
      throw new Error(`Missing expected recommend-task legal pattern for ${candidateId}`);
  }
}

function applySnapshotProbe(
  snapshot: DirectiveMirroredCaseSnapshotResult,
  candidateId: string,
  options: Options,
): DirectiveMirroredCaseSnapshotResult {
  if (
    options.probeMode !== RECOMMEND_TASK_STOP_SKEW_PROBE
    || candidateId !== RETENTION_CANDIDATE_ID
    || !snapshot.ok
  ) {
    return snapshot;
  }

  return {
    ...snapshot,
    currentStage: PROBE_CONSUMPTION_STAGE,
    nextLegalStep: PROBE_CONSUMPTION_NEXT_LEGAL_STEP,
  };
}

function buildBlockedFixture() {
  return {
    ok: true as const,
    caseId: "fixture:blocked-integrity",
    candidateId: "fixture:blocked-integrity",
    candidateName: "Blocked Integrity Fixture",
    routeTarget: "architecture",
    operatingMode: "standard",
    queueStatus: "routed",
    decisionState: "accept_for_architecture",
    currentHeadPath: "discovery/routing-log/fixture-blocked-routing-record.md",
    currentStage: "discovery.route.architecture",
    nextLegalStep: DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
    latestEventType: "state_materialized" as const,
    materializedFromEventId: "fixture:blocked-integrity:state_materialized:v1",
    linkedArtifacts: {
      intakeRecordPath: "discovery/intake/fixture-blocked-intake.md",
      triageRecordPath: "discovery/triage/fixture-blocked-triage.md",
      routingRecordPath: "discovery/routing-log/fixture-blocked-routing-record.md",
      engineRunRecordPath: null,
      engineRunReportPath: null,
      resultRecordPath: null,
    },
  };
}

async function validate(options: Options = {}): Promise<CheckResult> {
  const violations: Violation[] = [];
  const goldenEntries = loadGoldenQueueEntries(violations);
  const checked: Success["checked"] = [];
  let blockedFixture: Success["blockedFixture"] | null = null;

  if (violations.length > 0) {
    return {
      ok: false,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      summary: "Case planner parity contract violated.",
      violations,
    };
  }

  try {
    await withTempDirectiveRoot({ prefix: "directive-case-planner-parity-" }, async (directiveRoot) => {
      for (const queueEntry of goldenEntries) {
        const candidateId = queueEntry.candidate_id;
        const routing = readDirectiveDiscoveryRoutingArtifact({
          directiveRoot: DIRECTIVE_ROOT,
          routingPath: queueEntry.routing_record_path ?? "",
        });
        const authoritative = resolveDirectiveWorkspaceState({
          directiveRoot: DIRECTIVE_ROOT,
          artifactPath: queueEntry.routing_record_path ?? null,
        });
        const focus = authoritative.focus;
        if (!focus?.ok) {
          push(violations, {
            code: "authoritative_focus_missing",
            candidateId,
            path: queueEntry.routing_record_path ?? "routing_record_path",
            message: `Authoritative focus failed: ${candidateId}`,
            expected: "focus.ok",
            actual: "missing_or_false",
          });
          continue;
        }

        writeDirectiveMirroredDiscoveryCaseRecord({
          directiveRoot,
          record: buildMirroredRecord({
            queueEntry,
            routing,
            authoritative: focus,
          }),
        });

        appendDirectiveCaseMirrorEvents({
          directiveRoot,
          caseId: candidateId,
          events: [
            {
              schemaVersion: 1,
              eventId: `${candidateId}:source_submitted:planner-backfill-v1`,
              caseId: candidateId,
              candidateId,
              candidateName: queueEntry.candidate_name,
              sequence: 1,
              eventType: "source_submitted",
              occurredAt: `${routing.routingDate}T00:00:00.000Z`,
              queueStatus: "pending",
              routeTarget: null,
              operatingMode: queueEntry.operating_mode ?? null,
              linkedArtifactPath: routing.linkedIntakeRecord,
              decisionState: null,
            },
            {
              schemaVersion: 1,
              eventId: `${candidateId}:triaged:planner-backfill-v1`,
              caseId: candidateId,
              candidateId,
              candidateName: queueEntry.candidate_name,
              sequence: 2,
              eventType: "triaged",
              occurredAt: `${routing.routingDate}T00:00:00.000Z`,
              queueStatus: "pending",
              routeTarget: null,
              operatingMode: queueEntry.operating_mode ?? null,
              linkedArtifactPath: routing.linkedTriageRecord,
              decisionState: null,
            },
            {
              schemaVersion: 1,
              eventId: `${candidateId}:routed:planner-backfill-v1`,
              caseId: candidateId,
              candidateId,
              candidateName: queueEntry.candidate_name,
              sequence: 3,
              eventType: "routed",
              occurredAt: `${routing.routingDate}T00:00:00.000Z`,
              queueStatus: "routed",
              routeTarget: focus.routeTarget,
              operatingMode: queueEntry.operating_mode ?? null,
              linkedArtifactPath: routing.routingRelativePath,
              decisionState: routing.decisionState,
            },
            {
              schemaVersion: 1,
              eventId: `${candidateId}:state_materialized:planner-backfill-v1`,
              caseId: candidateId,
              candidateId,
              candidateName: queueEntry.candidate_name,
              sequence: 4,
              eventType: "state_materialized",
              occurredAt: `${routing.routingDate}T00:00:00.000Z`,
              queueStatus: focus.discovery.queueStatus,
              routeTarget: focus.routeTarget,
              operatingMode: focus.discovery.operatingMode,
              linkedArtifactPath: focus.currentHead.artifactPath,
              decisionState: routing.decisionState,
              currentHeadPath: focus.currentHead.artifactPath,
              currentStage: focus.currentStage,
              nextLegalStep: focus.nextLegalStep,
            },
          ],
        });

        const snapshotA = applySnapshotProbe(
          materializeDirectiveMirroredCaseSnapshot({ directiveRoot, caseId: candidateId }),
          candidateId,
          options,
        );
        const snapshotB = applySnapshotProbe(
          materializeDirectiveMirroredCaseSnapshot({ directiveRoot, caseId: candidateId }),
          candidateId,
          options,
        );

        eq(
          violations,
          candidateId,
          "snapshot_nondeterministic",
          "snapshot",
          JSON.stringify(snapshotA),
          JSON.stringify(snapshotB),
          `Snapshot must remain deterministic before planning: ${candidateId}`,
        );
        if (!snapshotA.ok || !snapshotB.ok) {
          push(violations, {
            code: "snapshot_missing",
            candidateId,
            path: "snapshot.ok",
            message: `Mirrored snapshot must exist before planning: ${candidateId}`,
            expected: true,
            actual: snapshotA.ok && snapshotB.ok,
          });
          continue;
        }

        const planA = planDirectiveMirroredCaseNextStep({ snapshot: snapshotA });
        const planB = planDirectiveMirroredCaseNextStep({ snapshot: snapshotB });
        eq(
          violations,
          candidateId,
          "planner_nondeterministic",
          "plan",
          JSON.stringify(planA),
          JSON.stringify(planB),
          `Planner output was not deterministic: ${candidateId}`,
        );

        const expectedOutcome = expectedOutcomeForCase(candidateId);
        if (planA.outcome !== expectedOutcome) {
          push(violations, {
            code: "planner_outcome_mismatch",
            candidateId,
            path: "plan.outcome",
            message: `Planner outcome mismatch for ${candidateId}`,
            expected: expectedOutcome,
            actual: planA.outcome,
          });
          continue;
        }

        switch (expectedOutcome) {
          case "stop":
          case "parked":
            if (candidateId === RETENTION_CANDIDATE_ID) {
              eq(
                violations,
                candidateId,
                "snapshot_stage_mismatch",
                "snapshot.currentStage",
                snapshotA.currentStage,
                "architecture.post_consumption_evaluation.keep",
                "The core-principles case should now resolve to the post-consumption keep stop boundary",
              );
              match(
                violations,
                candidateId,
                "planner_reason_mismatch",
                "plan.legalBecause",
                "legalBecause" in planA ? planA.legalBecause : undefined,
                /keep remains an explicit stop|no automatic architecture step is open/i,
                "The post-consumption keep boundary should remain an explicit stop rather than another task",
              );
            }
            if (candidateId === "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26") {
              eq(
                violations,
                candidateId,
                "snapshot_stage_mismatch",
                "snapshot.currentStage",
                snapshotA.currentStage,
                "discovery.monitor.active",
                "Discovery monitor control should materialize as a Discovery-held non-advancing current stage",
              );
              match(
                violations,
                candidateId,
                "planner_reason_mismatch",
                "plan.legalBecause",
                "legalBecause" in planA ? planA.legalBecause : undefined,
                /discovery monitor|keep the source in discovery/i,
                "Discovery monitor control should preserve the explicit hold boundary rather than inventing a task",
              );
            }
            break;
          case "waiting_review":
            eq(
              violations,
              candidateId,
              "planner_review_target_mismatch",
              "plan.reviewTarget",
              "reviewTarget" in planA ? planA.reviewTarget : null,
              "runtime",
              `Waiting-review case should stay on the Runtime review boundary for ${candidateId}`,
            );
            match(
              violations,
              candidateId,
              "planner_reason_mismatch",
              "plan.legalBecause",
              "legalBecause" in planA ? planA.legalBecause : undefined,
              /review the runtime follow-up/i,
              `Waiting-review case should preserve the explicit review boundary for ${candidateId}`,
            );
            break;
          case "recommend_task":
            eq(
              violations,
              candidateId,
              "snapshot_stage_mismatch",
              "snapshot.currentStage",
              snapshotA.currentStage,
              "architecture.consumption.success",
              `Recommend-task case should now resolve to the consumption-record Architecture boundary for ${candidateId}`,
            );
            eq(
              violations,
              candidateId,
              "planner_task_kind_mismatch",
              "plan.task.kind",
              "task" in planA ? planA.task.kind : null,
              expectedRecommendTaskKindForCase(candidateId),
              `Recommend-task case should open the bounded post-consumption evaluation task for ${candidateId}`,
            );
            arrayContains(
              violations,
              candidateId,
              "plan.task.requiredPreconditionsSatisfied",
              "task" in planA ? planA.task.requiredPreconditionsSatisfied : undefined,
              "snapshot_current_stage_known",
              `Recommend-task case should keep the minimal bounded preconditions for ${candidateId}`,
            );
            match(
              violations,
              candidateId,
              "planner_task_legal_mismatch",
              "plan.task.legalBecause",
              "task" in planA ? planA.task.legalBecause : undefined,
              expectedRecommendTaskPatternForCase(candidateId),
              `Recommend-task case should preserve the explicit next legal step for ${candidateId}`,
            );
            break;
        }

        checked.push({
          candidateId,
          outcome: planA.outcome,
          currentStage: snapshotA.currentStage,
          nextLegalStep: snapshotA.nextLegalStep,
        });
      }

      if (violations.length === 0) {
        const blockedPlanA = planDirectiveMirroredCaseNextStep({ snapshot: buildBlockedFixture() });
        const blockedPlanB = planDirectiveMirroredCaseNextStep({ snapshot: buildBlockedFixture() });
        eq(
          violations,
          "fixture:blocked-integrity",
          "blocked_fixture_mismatch",
          "blockedFixture",
          JSON.stringify(blockedPlanA),
          JSON.stringify(blockedPlanB),
          "Blocked fixture planner output was not deterministic",
        );
        eq(
          violations,
          "fixture:blocked-integrity",
          "blocked_fixture_mismatch",
          "blockedFixture.outcome",
          blockedPlanA.outcome,
          "blocked",
          "Blocked integrity fixture should remain blocked",
        );
        eq(
          violations,
          "fixture:blocked-integrity",
          "blocked_fixture_mismatch",
          "blockedFixture.blockedOn",
          JSON.stringify("blockedOn" in blockedPlanA ? blockedPlanA.blockedOn : null),
          JSON.stringify(["integrity_repair"]),
          "Blocked integrity fixture should preserve the bounded integrity repair blocker",
        );
        match(
          violations,
          "fixture:blocked-integrity",
          "blocked_fixture_mismatch",
          "blockedFixture.highestConfidenceWhy",
          "highestConfidenceWhy" in blockedPlanA ? blockedPlanA.highestConfidenceWhy : undefined,
          /declares advancement blocked/i,
          "Blocked integrity fixture should explain that the legal-next-step text already blocks advancement",
        );
        blockedFixture = blockedPlanA;
      }
    });
  } catch (error) {
    push(violations, {
      code: "checker_runtime_error",
      candidateId: "checker",
      path: "main",
      message: "Case planner parity checker raised an unexpected runtime error.",
      actual: String((error as Error).message || error),
    });
  }

  if (violations.length > 0) {
    return {
      ok: false,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      summary: "Case planner parity contract violated.",
      violations,
    };
  }

  return {
    ok: true,
    checkerId: CHECKER_ID,
    failureContractVersion: FAILURE_CONTRACT_VERSION,
    checked,
    blockedFixture: blockedFixture!,
  };
}

function resolveOptionsFromArgs(args: string[]): Options {
  const probeArg = args.find((arg) => arg.startsWith("--probe="));
  if (!probeArg) {
    return {};
  }
  const probeMode = probeArg.slice("--probe=".length);
  if (probeMode !== RECOMMEND_TASK_STOP_SKEW_PROBE) {
    throw new Error(`Unsupported case-planner-parity probe mode: ${probeMode}`);
  }
  return { probeMode };
}

function isDirectExecution() {
  const currentFile = path.resolve(fileURLToPath(import.meta.url));
  const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return currentFile === executedFile;
}

async function main() {
  const result = await validate(resolveOptionsFromArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (isDirectExecution()) {
  void main();
}
