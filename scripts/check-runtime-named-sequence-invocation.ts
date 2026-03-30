import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveRuntimeTwoStepSequenceRecord,
  type DirectiveRunnerActionResult,
} from "../shared/lib/directive-runner-state.ts";
import { readDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import {
  runDirectiveRuntimeFollowUpProofTwoStepSequence,
  type DirectiveRuntimeFollowUpProofSequenceResult,
} from "../shared/lib/runtime-follow-up-proof-sequence.ts";
import {
  runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence,
  type DirectiveRuntimeProofCapabilityBoundarySequenceResult,
} from "../shared/lib/runtime-proof-capability-boundary-sequence.ts";
import {
  DIRECTIVE_RUNTIME_NAMED_SEQUENCE_KINDS,
  runDirectiveRuntimeNamedSequenceByExplicitInvocation,
  type DirectiveRuntimeNamedSequenceInput,
  type DirectiveRuntimeNamedSequenceKind,
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

type DirectSequenceResult =
  | DirectiveRuntimeFollowUpProofSequenceResult
  | DirectiveRuntimeProofCapabilityBoundarySequenceResult;

type SequenceConfig = {
  sequenceKind: DirectiveRuntimeNamedSequenceKind;
  finalArtifactPath: string;
  seed: (directiveRoot: string) => void;
  buildInput: () => Omit<DirectiveRuntimeNamedSequenceInput, "directiveRoot" | "sequenceId">;
  runDirect: (input: { directiveRoot: string; sequenceId: string }) => DirectSequenceResult;
  forbiddenArtifactPaths: string[];
  expectedOpenEventTypes: string[];
  forbiddenEventTypes: string[];
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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

function copyRelativeFile(relativePath: string, tempRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  assert.ok(fs.existsSync(sourcePath), `Missing source file for named-sequence copy: ${relativePath}`);
  const targetPath = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
}

function copyRelativeFiles(relativePaths: Array<string | null | undefined>, directiveRoot: string) {
  for (const relativePath of uniqueRelativePaths(relativePaths)) {
    copyRelativeFile(relativePath, directiveRoot);
  }
}

function withTempDirectiveRoot(run: (directiveRoot: string) => void) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-named-sequence-"));
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

function seedFollowUpToProofRoot(directiveRoot: string) {
  seedQueueBackedDirectiveRoot({ directiveRoot });
}

function seedProofToCapabilityBoundaryRoot(directiveRoot: string) {
  seedQueueBackedDirectiveRoot({
    directiveRoot,
    extraRelativePaths: [CASE_UNDER_TEST.runtimeRecordPath],
  });
}

function buildFollowUpToProofInput(): Omit<
  Extract<DirectiveRuntimeNamedSequenceInput, { sequenceKind: "runtime_follow_up_to_proof" }>,
  "directiveRoot" | "sequenceId"
> {
  const liveRuntimeRecord = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath),
    "utf8",
  );
  const liveRuntimeProof = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  return {
    sequenceKind: "runtime_follow_up_to_proof",
    approved: true,
    steps: [
      {
        actionKind: "runtime_follow_up_open",
        targetPath: CASE_UNDER_TEST.followUpPath,
        approvedBy: extractReviewedBy(liveRuntimeRecord),
      },
      {
        actionKind: "runtime_proof_open",
        targetPath: CASE_UNDER_TEST.runtimeRecordPath,
        approvedBy: extractOpenedBy(liveRuntimeProof),
      },
    ],
  };
}

function buildProofToCapabilityBoundaryInput(): Omit<
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

function runDirectFollowUpToProof(input: { directiveRoot: string; sequenceId: string }) {
  const declared = buildFollowUpToProofInput();
  return runDirectiveRuntimeFollowUpProofTwoStepSequence({
    directiveRoot: input.directiveRoot,
    sequenceId: input.sequenceId,
    approved: declared.approved,
    steps: declared.steps,
  });
}

function runDirectProofToCapabilityBoundary(input: { directiveRoot: string; sequenceId: string }) {
  const declared = buildProofToCapabilityBoundaryInput();
  return runDirectiveRuntimeProofCapabilityBoundaryTwoStepSequence({
    directiveRoot: input.directiveRoot,
    sequenceId: input.sequenceId,
    approved: declared.approved,
    steps: declared.steps,
  });
}

function assertSuccess(
  result: DirectSequenceResult | DirectiveRuntimeNamedSequenceResult,
): asserts result is
  | Extract<DirectSequenceResult, { ok: true }>
  | Extract<DirectiveRuntimeNamedSequenceResult, { ok: true }> {
  if (!result.ok) {
    throw new Error(`Expected success result but got interruption: ${result.reason}`);
  }
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

function readRelativeContent(directiveRoot: string, relativePath: string) {
  return fs.readFileSync(path.join(directiveRoot, relativePath), "utf8");
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

function assertNamedLayerDidNotChain(input: {
  directiveRoot: string;
  expectedOpenEventTypes: string[];
  forbiddenEventTypes: string[];
  forbiddenArtifactPaths: string[];
}) {
  const sequenceDir = path.join(input.directiveRoot, "state", "runner-sequences");
  const sequenceFiles = fs.existsSync(sequenceDir)
    ? fs.readdirSync(sequenceDir).filter((entry) => entry.endsWith(".json"))
    : [];
  assert.equal(
    sequenceFiles.length,
    1,
    "Named sequence layer must dispatch exactly one pair-specific sequence",
  );

  for (const eventType of input.expectedOpenEventTypes) {
    assert.equal(
      countMirrorEvents({
        directiveRoot: input.directiveRoot,
        eventType,
      }),
      1,
      `Named sequence layer must emit ${eventType} exactly once`,
    );
  }

  for (const eventType of input.forbiddenEventTypes) {
    assert.equal(
      countMirrorEvents({
        directiveRoot: input.directiveRoot,
        eventType,
      }),
      0,
      `Named sequence layer must not auto-trigger ${eventType}`,
    );
  }

  for (const relativePath of input.forbiddenArtifactPaths) {
    assert.equal(
      fs.existsSync(path.join(input.directiveRoot, relativePath)),
      false,
      `Named sequence layer must not auto-create ${relativePath}`,
    );
  }
}

function assertNoForbiddenDownstream(input: {
  directiveRoot: string;
  forbiddenEventTypes: string[];
  forbiddenArtifactPaths: string[];
}) {
  for (const eventType of input.forbiddenEventTypes) {
    assert.equal(
      countMirrorEvents({
        directiveRoot: input.directiveRoot,
        eventType,
      }),
      0,
      `Named sequence layer must not auto-trigger ${eventType}`,
    );
  }

  for (const relativePath of input.forbiddenArtifactPaths) {
    assert.equal(
      fs.existsSync(path.join(input.directiveRoot, relativePath)),
      false,
      `Named sequence layer must not auto-create ${relativePath}`,
    );
  }
}

const SEQUENCE_CONFIGS: SequenceConfig[] = [
  {
    sequenceKind: "runtime_follow_up_to_proof",
    finalArtifactPath: CASE_UNDER_TEST.runtimeProofPath,
    seed: seedFollowUpToProofRoot,
    buildInput: buildFollowUpToProofInput,
    runDirect: runDirectFollowUpToProof,
    forbiddenArtifactPaths: [
      CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      CASE_UNDER_TEST.runtimePromotionReadinessPath,
    ],
    expectedOpenEventTypes: [
      "runtime_follow_up_opened",
      "runtime_proof_opened",
    ],
    forbiddenEventTypes: [
      "runtime_capability_boundary_opened",
      "runtime_promotion_readiness_opened",
    ],
  },
  {
    sequenceKind: "runtime_proof_to_capability_boundary",
    finalArtifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
    seed: seedProofToCapabilityBoundaryRoot,
    buildInput: buildProofToCapabilityBoundaryInput,
    runDirect: runDirectProofToCapabilityBoundary,
    forbiddenArtifactPaths: [
      CASE_UNDER_TEST.runtimePromotionReadinessPath,
    ],
    expectedOpenEventTypes: [
      "runtime_proof_opened",
      "runtime_capability_boundary_opened",
    ],
    forbiddenEventTypes: [
      "runtime_promotion_readiness_opened",
    ],
  },
];

function scenarioNamedDispatchMatchesDirectSequence(config: SequenceConfig) {
  withTempDirectiveRoot((directRoot) => {
    config.seed(directRoot);
    const directResult = config.runDirect({
      directiveRoot: directRoot,
      sequenceId: `${config.sequenceKind}-direct`,
    });
    assertSuccess(directResult);

    withTempDirectiveRoot((sharedRoot) => {
      config.seed(sharedRoot);
      const declared = config.buildInput();
      const sharedResult = runDirectiveRuntimeNamedSequenceByExplicitInvocation({
        ...declared,
        directiveRoot: sharedRoot,
        sequenceId: `${config.sequenceKind}-shared`,
      });
      assertSuccess(sharedResult);

      assert.equal(sharedResult.dispatchCount, 1);
      assert.equal(sharedResult.sequenceKind, config.sequenceKind);
      assert.equal(sharedResult.sequenceRecord.sequenceId, sharedResult.sequenceId);
      assert.equal(sharedResult.declaredActionCount, 2);

      assert.deepEqual(
        sharedResult.stepResults.map((entry) => comparableActionResult(entry)),
        directResult.stepResults.map((entry) => comparableActionResult(entry)),
      );

      assert.equal(
        readRelativeContent(sharedRoot, config.finalArtifactPath),
        readRelativeContent(directRoot, config.finalArtifactPath),
      );
      assert.equal(
        readRelativeContent(sharedRoot, config.finalArtifactPath),
        fs.readFileSync(path.join(DIRECTIVE_ROOT, config.finalArtifactPath), "utf8"),
      );

      const directFocus = resolveFocusOrThrow({
        directiveRoot: directRoot,
        artifactPath: config.finalArtifactPath,
        label: "Direct pair-specific sequence",
      });
      const sharedFocus = resolveFocusOrThrow({
        directiveRoot: sharedRoot,
        artifactPath: config.finalArtifactPath,
        label: "Shared named-sequence layer",
      });
      assert.equal(sharedFocus.currentHead.artifactPath, directFocus.currentHead.artifactPath);
      assert.equal(sharedFocus.currentStage, directFocus.currentStage);
      assert.equal(sharedFocus.nextLegalStep, directFocus.nextLegalStep);

      assertNamedLayerDidNotChain({
        directiveRoot: sharedRoot,
        expectedOpenEventTypes: config.expectedOpenEventTypes,
        forbiddenEventTypes: config.forbiddenEventTypes,
        forbiddenArtifactPaths: config.forbiddenArtifactPaths,
      });
    });
  });
}

function scenarioNamedAfterStep2ResumeDoesNotDuplicate(config: SequenceConfig) {
  withTempDirectiveRoot((directiveRoot) => {
    config.seed(directiveRoot);
    const declared = config.buildInput();
    const interrupted = runDirectiveRuntimeNamedSequenceByExplicitInvocation({
      ...declared,
      directiveRoot,
      sequenceId: `${config.sequenceKind}-after-step-2`,
      testInterruptPoint: "after_step_2_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "after_step_2");
    assert.equal(
      readRelativeContent(directiveRoot, config.finalArtifactPath),
      fs.readFileSync(path.join(DIRECTIVE_ROOT, config.finalArtifactPath), "utf8"),
    );

    const resumed = runDirectiveRuntimeNamedSequenceByExplicitInvocation({
      ...declared,
      directiveRoot,
      sequenceId: `${config.sequenceKind}-after-step-2`,
    });
    assertSuccess(resumed);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, true);
    assert.equal(resumed.executedActionCount, 0);

    for (const eventType of config.expectedOpenEventTypes) {
      assert.equal(
        countMirrorEvents({
          directiveRoot,
          eventType,
        }),
        1,
        `Resume must not duplicate ${eventType}`,
      );
    }

    assertNoForbiddenDownstream({
      directiveRoot,
      forbiddenEventTypes: config.forbiddenEventTypes,
      forbiddenArtifactPaths: config.forbiddenArtifactPaths,
    });
  });
}

function scenarioNamedApprovalAndStaleHeadGuards(config: SequenceConfig) {
  withTempDirectiveRoot((directiveRoot) => {
    config.seed(directiveRoot);
    const declared = config.buildInput();

    assert.throws(
      () =>
        runDirectiveRuntimeNamedSequenceByExplicitInvocation({
          ...declared,
          directiveRoot,
          sequenceId: `${config.sequenceKind}-missing-approval`,
          approved: false,
        }),
      /explicit approval/i,
      "Named sequence layer should preserve explicit approval",
    );
    assert.equal(
      readDirectiveRuntimeTwoStepSequenceRecord({
        directiveRoot,
        sequenceId: `${config.sequenceKind}-missing-approval`,
      }).record,
      null,
      "Missing approval must not create sequence state",
    );

    const firstSuccess = runDirectiveRuntimeNamedSequenceByExplicitInvocation({
      ...declared,
      directiveRoot,
      sequenceId: `${config.sequenceKind}-first-success`,
    });
    assertSuccess(firstSuccess);

    assert.throws(
      () =>
        runDirectiveRuntimeNamedSequenceByExplicitInvocation({
          ...declared,
          directiveRoot,
          sequenceId: `${config.sequenceKind}-stale-head`,
        }),
      /live current stage/i,
      "Named sequence layer should preserve stale-head guards",
    );

    const failedRecord = readDirectiveRuntimeTwoStepSequenceRecord({
      directiveRoot,
      sequenceId: `${config.sequenceKind}-stale-head`,
    }).record;
    assert.ok(failedRecord, "Failed stale-head sequence should persist state");
    assert.equal(failedRecord.lifecycleState, "failed");
    assert.equal(failedRecord.checkpointStage, "before_step_1");
    assert.match(failedRecord.lastError?.message || "", /live current stage/i);

    assertNoForbiddenDownstream({
      directiveRoot,
      forbiddenEventTypes: config.forbiddenEventTypes,
      forbiddenArtifactPaths: config.forbiddenArtifactPaths,
    });
  });
}

function main() {
  assert.deepEqual(DIRECTIVE_RUNTIME_NAMED_SEQUENCE_KINDS, [
    "runtime_follow_up_to_proof",
    "runtime_proof_to_capability_boundary",
  ]);

  for (const config of SEQUENCE_CONFIGS) {
    scenarioNamedDispatchMatchesDirectSequence(config);
    scenarioNamedAfterStep2ResumeDoesNotDuplicate(config);
    scenarioNamedApprovalAndStaleHeadGuards(config);
  }

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      candidateId: CASE_UNDER_TEST.candidateId,
      sequenceKinds: DIRECTIVE_RUNTIME_NAMED_SEQUENCE_KINDS,
      dispatch: "single_named_sequence_only",
      preservedGuards: [
        "explicit_approval",
        "stale_head",
      ],
      preservedResumeSafety: [
        "after_step_2_checkpoint_resume",
        "no_duplicate_runtime_artifacts",
      ],
      prohibitedAutoSequenceOrArtifact: [
        "no_follow_on_sequence",
        "no_promotion_readiness_open",
      ],
    },
  }, null, 2)}\n`);
}

main();
