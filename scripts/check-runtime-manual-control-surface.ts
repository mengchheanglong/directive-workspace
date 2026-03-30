import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveActionRunnerRecord,
  readDirectiveRuntimeTwoStepSequenceRecord,
  type DirectiveRunnerActionResult,
} from "../shared/lib/directive-runner-state.ts";
import { readDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import {
  DIRECTIVE_RUNTIME_MANUAL_ACTION_KINDS,
  DIRECTIVE_RUNTIME_MANUAL_SEQUENCE_KINDS,
  type DirectiveRuntimeManualControlResult,
} from "../shared/lib/runtime-manual-control.ts";
import {
  runDirectiveRuntimeActionByExplicitInvocation,
  type DirectiveRuntimeSharedInvocationInput,
  type DirectiveRuntimeSharedInvocationResult,
} from "../shared/lib/runtime-runner-invocation.ts";
import {
  runDirectiveRuntimeNamedSequenceByExplicitInvocation,
  type DirectiveRuntimeNamedSequenceInput,
  type DirectiveRuntimeNamedSequenceResult,
} from "../shared/lib/runtime-sequence-invocation.ts";

type QueueEntry = {
  candidate_id: string;
  candidate_name: string;
  source_type: string;
  source_reference: string;
  status: string;
  routing_target: string | null;
  intake_record_path?: string | null;
  routing_record_path?: string | null;
  result_record_path?: string | null;
  notes?: string | null;
  completed_at?: string | null;
  operating_mode?: string | null;
};

type ManualActionSuccess = Extract<
  DirectiveRuntimeManualControlResult,
  { mode: "action"; ok: true }
>;
type ManualSequenceSuccess = Extract<
  DirectiveRuntimeManualControlResult,
  { mode: "sequence"; ok: true }
>;
type SharedActionSuccess = Extract<
  DirectiveRuntimeSharedInvocationResult,
  { ok: true }
>;
type SharedSequenceSuccess = Extract<
  DirectiveRuntimeNamedSequenceResult,
  { ok: true }
>;

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANUAL_CONTROL_SCRIPT_PATH = path.join(DIRECTIVE_ROOT, "scripts", "runtime-manual-control.ts");
const CASE_UNDER_TEST = {
  candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  followUpPath: "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  runtimePromotionReadinessPath: "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
} as const;

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readRelativeContent(directiveRoot: string, relativePath: string) {
  return fs.readFileSync(path.join(directiveRoot, relativePath), "utf8");
}

function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
}

function copyRelativeFile(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  assert.ok(fs.existsSync(sourcePath), `Missing source file for manual-surface copy: ${relativePath}`);
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function copyRelativeFiles(relativePaths: Array<string | null | undefined>, directiveRoot: string) {
  for (const relativePath of uniqueRelativePaths(relativePaths)) {
    copyRelativeFile(relativePath, directiveRoot);
  }
}

function withTempDirectiveRoot(run: (directiveRoot: string) => void) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-manual-control-"));
  const directiveRoot = path.join(tempRoot, "directive-workspace");
  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    run(directiveRoot);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function extractReviewedBy(markdown: string) {
  const match = markdown.match(/- Reviewed by: `([^`]+)`/u);
  assert.ok(match?.[1], "Unable to parse Runtime review actor");
  return match[1];
}

function extractOpenedBy(markdown: string) {
  const match = markdown.match(/- Opened by: `([^`]+)`/u);
  assert.ok(match?.[1], "Unable to parse Runtime opened-by actor");
  return match[1];
}

function seedQueueBackedDirectiveRoot(input: {
  directiveRoot: string;
  extraRelativePaths?: Array<string | null | undefined>;
}) {
  const queueDocument = readJson<{ entries: QueueEntry[] }>(
    path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json"),
  );
  const queueEntry = queueDocument.entries.find(
    (item) => item.candidate_id === CASE_UNDER_TEST.candidateId,
  ) ?? null;
  assert.ok(queueEntry, `Missing queue entry for ${CASE_UNDER_TEST.candidateId}`);

  const routing = readDirectiveDiscoveryRoutingArtifact({
    directiveRoot: DIRECTIVE_ROOT,
    routingPath: queueEntry.routing_record_path ?? "",
  });

  copyRelativeFiles([
    queueEntry.intake_record_path,
    routing.linkedTriageRecord,
    queueEntry.routing_record_path,
    routing.engineRunRecordPath,
    routing.engineRunReportPath,
    CASE_UNDER_TEST.followUpPath,
    ...(input.extraRelativePaths ?? []),
  ], input.directiveRoot);

  writeJson(path.join(input.directiveRoot, "discovery", "intake-queue.json"), {
    status: "primary",
    updatedAt: "2026-03-29",
    entries: [
      {
        ...queueEntry,
        status: "routed",
        completed_at: null,
        result_record_path: CASE_UNDER_TEST.followUpPath,
      },
    ],
  });
}

function seedFollowUpRoot(directiveRoot: string) {
  seedQueueBackedDirectiveRoot({ directiveRoot });
}

function seedProofToCapabilityBoundaryRoot(directiveRoot: string) {
  seedQueueBackedDirectiveRoot({
    directiveRoot,
    extraRelativePaths: [CASE_UNDER_TEST.runtimeRecordPath],
  });
}

function resolveFocusOrThrow(input: {
  directiveRoot: string;
  artifactPath: string;
  label: string;
}) {
  const focus = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    artifactPath: input.artifactPath,
  }).focus;
  assert.ok(focus?.ok, `${input.label} state did not resolve`);
  return focus;
}

function comparableActionResult(actionResult: DirectiveRunnerActionResult) {
  return {
    created: actionResult.created,
    followUpRelativePath: actionResult.followUpRelativePath,
    runtimeRecordRelativePath: actionResult.runtimeRecordRelativePath,
    runtimeProofRelativePath: actionResult.runtimeProofRelativePath ?? null,
    runtimeCapabilityBoundaryRelativePath: actionResult.runtimeCapabilityBoundaryRelativePath ?? null,
    candidateId: actionResult.candidateId,
    candidateName: actionResult.candidateName,
  };
}

function countMirrorEvents(input: {
  directiveRoot: string;
  eventType: string;
}) {
  return readDirectiveCaseMirrorEvents({
    directiveRoot: input.directiveRoot,
    caseId: CASE_UNDER_TEST.candidateId,
  }).events.filter((event) => event.eventType === input.eventType).length;
}

function buildFollowUpActionInput(): Omit<DirectiveRuntimeSharedInvocationInput, "directiveRoot" | "runnerId"> {
  const liveRuntimeRecord = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath),
    "utf8",
  );
  return {
    actionKind: "runtime_follow_up_open",
    targetPath: CASE_UNDER_TEST.followUpPath,
    approved: true,
    approvedBy: extractReviewedBy(liveRuntimeRecord),
  };
}

function buildProofToCapabilityBoundarySequenceInput(): Omit<
  Extract<DirectiveRuntimeNamedSequenceInput, { sequenceKind: "runtime_proof_to_capability_boundary" }>,
  "directiveRoot" | "sequenceId"
> {
  const liveRuntimeProof = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  const liveCapabilityBoundary = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
    "utf8",
  );
  return {
    sequenceKind: "runtime_proof_to_capability_boundary",
    approved: true,
    steps: [
      {
        actionKind: "runtime_proof_open",
        targetPath: CASE_UNDER_TEST.runtimeRecordPath,
        approvedBy: extractOpenedBy(liveRuntimeProof),
      },
      {
        actionKind: "runtime_capability_boundary_open",
        targetPath: CASE_UNDER_TEST.runtimeProofPath,
        approvedBy: extractOpenedBy(liveCapabilityBoundary),
      },
    ],
  };
}

function assertSharedActionSuccess(
  result: DirectiveRuntimeSharedInvocationResult,
): asserts result is SharedActionSuccess {
  if (!result.ok) {
    throw new Error(`Expected shared action success but got interruption: ${result.reason}`);
  }
}

function assertSharedSequenceSuccess(
  result: DirectiveRuntimeNamedSequenceResult,
): asserts result is SharedSequenceSuccess {
  if (!result.ok) {
    throw new Error(`Expected shared sequence success but got interruption: ${result.reason}`);
  }
}

function parseManualControlJson(stdout: string) {
  return JSON.parse(stdout) as DirectiveRuntimeManualControlResult;
}

function runManualControlCli(args: string[]) {
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", MANUAL_CONTROL_SCRIPT_PATH, ...args],
    {
      cwd: DIRECTIVE_ROOT,
      encoding: "utf8",
    },
  );
  if (result.error) {
    throw result.error;
  }

  return {
    status: result.status ?? 1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function runManualControlCliExpectSuccess(args: string[]) {
  const result = runManualControlCli(args);
  assert.equal(
    result.status,
    0,
    `Manual control CLI should succeed.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  return parseManualControlJson(result.stdout);
}

function runManualControlCliExpectFailure(args: string[]) {
  const result = runManualControlCli(args);
  assert.notEqual(
    result.status,
    0,
    `Manual control CLI should fail.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  return result;
}

function assertManualActionSuccess(
  result: DirectiveRuntimeManualControlResult,
): asserts result is ManualActionSuccess {
  assert.equal(result.surface, "runtime_manual_control_cli");
  assert.equal(result.mode, "action");
  assert.equal(result.ok, true, "Manual action CLI should succeed");
}

function assertManualSequenceSuccess(
  result: DirectiveRuntimeManualControlResult,
): asserts result is ManualSequenceSuccess {
  assert.equal(result.surface, "runtime_manual_control_cli");
  assert.equal(result.mode, "sequence");
  assert.equal(result.ok, true, "Manual sequence CLI should succeed");
}

function writeStepsJsonFile(input: {
  directiveRoot: string;
  fileName: string;
  steps: Extract<DirectiveRuntimeNamedSequenceInput, { sequenceKind: "runtime_proof_to_capability_boundary" }>["steps"];
}) {
  const stepsPath = path.join(input.directiveRoot, "state", "manual-control-inputs", input.fileName);
  writeJson(stepsPath, input.steps);
  return stepsPath;
}

function buildActionCliArgs(input: {
  directiveRoot: string;
  runnerId?: string;
  approved: boolean;
  approvedBy: string;
}) {
  return [
    "action",
    "--directive-root",
    input.directiveRoot,
    "--action-kind",
    "runtime_follow_up_open",
    "--target-path",
    CASE_UNDER_TEST.followUpPath,
    "--approved",
    String(input.approved),
    "--approved-by",
    input.approvedBy,
    ...(input.runnerId ? ["--runner-id", input.runnerId] : []),
  ];
}

function buildSequenceCliArgs(input: {
  directiveRoot: string;
  sequenceId?: string;
  approved: boolean;
  steps: Extract<DirectiveRuntimeNamedSequenceInput, { sequenceKind: "runtime_proof_to_capability_boundary" }>["steps"];
}) {
  const stepsJsonPath = writeStepsJsonFile({
    directiveRoot: input.directiveRoot,
    fileName: `${input.sequenceId || "runtime-proof-to-capability-boundary"}.json`,
    steps: input.steps,
  });
  return [
    "sequence",
    "--directive-root",
    input.directiveRoot,
    "--sequence-kind",
    "runtime_proof_to_capability_boundary",
    "--steps-json-path",
    stepsJsonPath,
    "--approved",
    String(input.approved),
    ...(input.sequenceId ? ["--sequence-id", input.sequenceId] : []),
  ];
}

function scenarioManualActionMatchesDirectPath() {
  withTempDirectiveRoot((directRoot) => {
    seedFollowUpRoot(directRoot);
    const declared = buildFollowUpActionInput();
    const directResult = runDirectiveRuntimeActionByExplicitInvocation({
      ...declared,
      directiveRoot: directRoot,
      runnerId: "manual-direct-action",
    });
    assertSharedActionSuccess(directResult);

    withTempDirectiveRoot((manualRoot) => {
      seedFollowUpRoot(manualRoot);
      const manualResult = runManualControlCliExpectSuccess(
        buildActionCliArgs({
          directiveRoot: manualRoot,
          runnerId: "manual-cli-action",
          approved: true,
          approvedBy: declared.approvedBy!,
        }),
      );
      assertManualActionSuccess(manualResult);

      assert.equal(manualResult.dispatchCount, 1);
      assert.equal(manualResult.actionKind, "runtime_follow_up_open");
      assert.equal(manualResult.runnerRecord.actionKind, "runtime_follow_up_open");
      assert.deepEqual(
        comparableActionResult(manualResult.actionResult),
        comparableActionResult(directResult.actionResult),
      );

      assert.equal(
        readRelativeContent(manualRoot, CASE_UNDER_TEST.runtimeRecordPath),
        readRelativeContent(directRoot, CASE_UNDER_TEST.runtimeRecordPath),
      );
      assert.equal(
        readRelativeContent(manualRoot, CASE_UNDER_TEST.runtimeRecordPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath), "utf8"),
      );

      const directFocus = resolveFocusOrThrow({
        directiveRoot: directRoot,
        artifactPath: CASE_UNDER_TEST.runtimeRecordPath,
        label: "Direct action path",
      });
      const manualFocus = resolveFocusOrThrow({
        directiveRoot: manualRoot,
        artifactPath: CASE_UNDER_TEST.runtimeRecordPath,
        label: "Manual action path",
      });
      assert.equal(manualFocus.currentHead.artifactPath, directFocus.currentHead.artifactPath);
      assert.equal(manualFocus.currentStage, directFocus.currentStage);
      assert.equal(manualFocus.nextLegalStep, directFocus.nextLegalStep);

      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_follow_up_opened",
        }),
        1,
      );
      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_proof_opened",
        }),
        0,
      );
      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_capability_boundary_opened",
        }),
        0,
      );
      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_promotion_readiness_opened",
        }),
        0,
      );
      assert.equal(
        fs.existsSync(path.join(manualRoot, CASE_UNDER_TEST.runtimeProofPath)),
        false,
      );
      assert.equal(
        fs.existsSync(path.join(manualRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath)),
        false,
      );
      assert.equal(
        fs.existsSync(path.join(manualRoot, CASE_UNDER_TEST.runtimePromotionReadinessPath)),
        false,
      );

      const runnerFiles = fs.readdirSync(path.join(manualRoot, "state", "runners"))
        .filter((entry) => entry.endsWith(".json"));
      assert.equal(runnerFiles.length, 1);
      assert.equal(
        fs.existsSync(path.join(manualRoot, "state", "runner-sequences")),
        false,
      );
    });
  });
}

function scenarioManualSequenceMatchesDirectPath() {
  withTempDirectiveRoot((directRoot) => {
    seedProofToCapabilityBoundaryRoot(directRoot);
    const declared = buildProofToCapabilityBoundarySequenceInput();
    const directResult = runDirectiveRuntimeNamedSequenceByExplicitInvocation({
      ...declared,
      directiveRoot: directRoot,
      sequenceId: "manual-direct-sequence",
    });
    assertSharedSequenceSuccess(directResult);

    withTempDirectiveRoot((manualRoot) => {
      seedProofToCapabilityBoundaryRoot(manualRoot);
      const manualResult = runManualControlCliExpectSuccess(
        buildSequenceCliArgs({
          directiveRoot: manualRoot,
          sequenceId: "manual-cli-sequence",
          approved: true,
          steps: declared.steps,
        }),
      );
      assertManualSequenceSuccess(manualResult);

      assert.equal(manualResult.dispatchCount, 1);
      assert.equal(manualResult.sequenceKind, "runtime_proof_to_capability_boundary");
      assert.equal(manualResult.declaredActionCount, 2);
      assert.deepEqual(
        manualResult.stepResults.map((entry) => comparableActionResult(entry)),
        directResult.stepResults.map((entry) => comparableActionResult(entry)),
      );

      assert.equal(
        readRelativeContent(manualRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
        readRelativeContent(directRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
      );
      assert.equal(
        readRelativeContent(manualRoot, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath), "utf8"),
      );

      const directFocus = resolveFocusOrThrow({
        directiveRoot: directRoot,
        artifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
        label: "Direct named-sequence path",
      });
      const manualFocus = resolveFocusOrThrow({
        directiveRoot: manualRoot,
        artifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
        label: "Manual named-sequence path",
      });
      assert.equal(manualFocus.currentHead.artifactPath, directFocus.currentHead.artifactPath);
      assert.equal(manualFocus.currentStage, directFocus.currentStage);
      assert.equal(manualFocus.nextLegalStep, directFocus.nextLegalStep);

      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_proof_opened",
        }),
        1,
      );
      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_capability_boundary_opened",
        }),
        1,
      );
      assert.equal(
        countMirrorEvents({
          directiveRoot: manualRoot,
          eventType: "runtime_promotion_readiness_opened",
        }),
        0,
      );
      assert.equal(
        fs.existsSync(path.join(manualRoot, CASE_UNDER_TEST.runtimePromotionReadinessPath)),
        false,
      );

      const sequenceFiles = fs.readdirSync(path.join(manualRoot, "state", "runner-sequences"))
        .filter((entry) => entry.endsWith(".json"));
      assert.equal(sequenceFiles.length, 1);
    });
  });
}

function scenarioManualSurfaceRequiresExplicitChoiceAndApproval() {
  withTempDirectiveRoot((directiveRoot) => {
    seedFollowUpRoot(directiveRoot);
    const declaredAction = buildFollowUpActionInput();

    const missingActionKind = runManualControlCliExpectFailure([
      "action",
      "--directive-root",
      directiveRoot,
      "--target-path",
      CASE_UNDER_TEST.followUpPath,
      "--approved",
      "true",
      "--approved-by",
      declaredAction.approvedBy!,
    ]);
    assert.match(missingActionKind.stderr, /Missing required flag --action-kind/i);

    const missingActionApproval = runManualControlCliExpectFailure(
      buildActionCliArgs({
        directiveRoot,
        runnerId: "manual-missing-approval-action",
        approved: false,
        approvedBy: declaredAction.approvedBy!,
      }),
    );
    assert.match(missingActionApproval.stderr, /explicit approval/i);
    assert.equal(
      readDirectiveActionRunnerRecord({
        directiveRoot,
        runnerId: "manual-missing-approval-action",
      }).record,
      null,
    );
  });

  withTempDirectiveRoot((directiveRoot) => {
    seedProofToCapabilityBoundaryRoot(directiveRoot);
    const declaredSequence = buildProofToCapabilityBoundarySequenceInput();
    const stepsJsonPath = writeStepsJsonFile({
      directiveRoot,
      fileName: "missing-sequence-kind.json",
      steps: declaredSequence.steps,
    });

    const missingSequenceKind = runManualControlCliExpectFailure([
      "sequence",
      "--directive-root",
      directiveRoot,
      "--steps-json-path",
      stepsJsonPath,
      "--approved",
      "true",
    ]);
    assert.match(missingSequenceKind.stderr, /Missing required flag --sequence-kind/i);

    const missingSequenceApproval = runManualControlCliExpectFailure(
      buildSequenceCliArgs({
        directiveRoot,
        sequenceId: "manual-missing-approval-sequence",
        approved: false,
        steps: declaredSequence.steps,
      }),
    );
    assert.match(missingSequenceApproval.stderr, /explicit approval/i);
    assert.equal(
      readDirectiveRuntimeTwoStepSequenceRecord({
        directiveRoot,
        sequenceId: "manual-missing-approval-sequence",
      }).record,
      null,
    );
  });
}

function scenarioManualSurfacePreservesStaleHeadGuards() {
  withTempDirectiveRoot((directiveRoot) => {
    seedFollowUpRoot(directiveRoot);
    const declared = buildFollowUpActionInput();

    const firstSuccess = runManualControlCliExpectSuccess(
      buildActionCliArgs({
        directiveRoot,
        runnerId: "manual-stale-action-first",
        approved: true,
        approvedBy: declared.approvedBy!,
      }),
    );
    assertManualActionSuccess(firstSuccess);

    const staleResult = runManualControlCliExpectFailure(
      buildActionCliArgs({
        directiveRoot,
        runnerId: "manual-stale-action-second",
        approved: true,
        approvedBy: declared.approvedBy!,
      }),
    );
    assert.match(staleResult.stderr, /live current stage/i);

    const staleRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: "manual-stale-action-second",
    }).record;
    assert.ok(staleRecord, "Action stale-head failure should persist runner state");
    assert.equal(staleRecord.lifecycleState, "failed");
    assert.equal(staleRecord.checkpointStage, "before_action");
  });

  withTempDirectiveRoot((directiveRoot) => {
    seedProofToCapabilityBoundaryRoot(directiveRoot);
    const declared = buildProofToCapabilityBoundarySequenceInput();

    const firstSuccess = runManualControlCliExpectSuccess(
      buildSequenceCliArgs({
        directiveRoot,
        sequenceId: "manual-stale-sequence-first",
        approved: true,
        steps: declared.steps,
      }),
    );
    assertManualSequenceSuccess(firstSuccess);

    const staleResult = runManualControlCliExpectFailure(
      buildSequenceCliArgs({
        directiveRoot,
        sequenceId: "manual-stale-sequence-second",
        approved: true,
        steps: declared.steps,
      }),
    );
    assert.match(staleResult.stderr, /live current stage/i);

    const staleRecord = readDirectiveRuntimeTwoStepSequenceRecord({
      directiveRoot,
      sequenceId: "manual-stale-sequence-second",
    }).record;
    assert.ok(staleRecord, "Sequence stale-head failure should persist sequence state");
    assert.equal(staleRecord.lifecycleState, "failed");
    assert.equal(staleRecord.checkpointStage, "before_step_1");
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        eventType: "runtime_promotion_readiness_opened",
      }),
      0,
    );
    assert.equal(
      fs.existsSync(path.join(directiveRoot, CASE_UNDER_TEST.runtimePromotionReadinessPath)),
      false,
    );
  });
}

function main() {
  assert.deepEqual(DIRECTIVE_RUNTIME_MANUAL_ACTION_KINDS, [
    "runtime_follow_up_open",
    "runtime_proof_open",
    "runtime_capability_boundary_open",
    "runtime_promotion_readiness_open",
  ]);
  assert.deepEqual(DIRECTIVE_RUNTIME_MANUAL_SEQUENCE_KINDS, [
    "runtime_follow_up_to_proof",
    "runtime_proof_to_capability_boundary",
  ]);

  scenarioManualActionMatchesDirectPath();
  scenarioManualSequenceMatchesDirectPath();
  scenarioManualSurfaceRequiresExplicitChoiceAndApproval();
  scenarioManualSurfacePreservesStaleHeadGuards();

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      candidateId: CASE_UNDER_TEST.candidateId,
      manualSurface: "runtime_manual_control_cli",
      singleAction: "runtime_follow_up_open",
      namedSequence: "runtime_proof_to_capability_boundary",
      explicitOnly: true,
      preservedGuards: [
        "explicit_approval",
        "stale_head",
      ],
      prohibitedAutoBehavior: [
        "no_action_auto_selection",
        "no_sequence_auto_selection",
        "no_promotion_readiness_open",
      ],
    },
  }, null, 2)}\n`);
}

main();
