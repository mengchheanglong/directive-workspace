import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveActionRunnerRecord,
  type DirectiveRunnerActionResult,
} from "../shared/lib/directive-runner-state.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../shared/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { readDirectiveCaseMirrorEvents } from "../shared/lib/case-event-log.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import {
  DIRECTIVE_RUNTIME_SHARED_INVOCATION_ACTIONS,
  runDirectiveRuntimeActionByExplicitInvocation,
  type DirectiveRuntimeSharedInvocationActionKind,
  type DirectiveRuntimeSharedInvocationInterruptionPoint,
  type DirectiveRuntimeSharedInvocationResult,
} from "../shared/lib/runtime-runner-invocation.ts";
import {
  runDirectiveRuntimeCapabilityBoundaryWithRunner,
  type DirectiveRuntimeCapabilityBoundaryRunnerResult,
} from "../shared/lib/runtime-capability-boundary-runner.ts";
import {
  runDirectiveRuntimeFollowUpWithRunner,
  type DirectiveRuntimeFollowUpRunnerResult,
} from "../shared/lib/runtime-follow-up-runner.ts";
import {
  runDirectiveRuntimePromotionReadinessWithRunner,
  type DirectiveRuntimePromotionReadinessRunnerResult,
} from "../shared/lib/runtime-promotion-readiness-runner.ts";
import {
  runDirectiveRuntimeProofOpenWithRunner,
  type DirectiveRuntimeProofOpenRunnerResult,
} from "../shared/lib/runtime-proof-open-runner.ts";

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

type RuntimeFocus = NonNullable<ReturnType<typeof resolveDirectiveWorkspaceState>["focus"]>;

type RuntimeActionSeed = {
  liveFocus: RuntimeFocus;
  liveMarkdown: string;
  approvedBy: string;
  proofOpenedBy?: string;
  boundaryOpenedBy?: string;
};

type DirectRunnerResult =
  | DirectiveRuntimeFollowUpRunnerResult
  | DirectiveRuntimeProofOpenRunnerResult
  | DirectiveRuntimeCapabilityBoundaryRunnerResult
  | DirectiveRuntimePromotionReadinessRunnerResult;

type RuntimeActionConfig = {
  actionKind: DirectiveRuntimeSharedInvocationActionKind;
  targetPath: string;
  expectedArtifactPath: string;
  mirrorOpenEventType: string;
  laterMirrorEventTypes: string[];
  seed: (directiveRoot: string) => RuntimeActionSeed;
  prepare: (directiveRoot: string, seed: RuntimeActionSeed) => void;
  runDirect: (input: {
    directiveRoot: string;
    runnerId: string;
    seed: RuntimeActionSeed;
    testInterruptPoint?: DirectiveRuntimeSharedInvocationInterruptionPoint;
  }) => DirectRunnerResult;
  nextAutomaticArtifactPaths: (seed: RuntimeActionSeed) => Array<string | null | undefined>;
  downstreamPaths: (seed: RuntimeActionSeed) => Array<string | null | undefined>;
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
  assert.ok(fs.existsSync(sourcePath), `Missing source file for shared-runner copy: ${relativePath}`);
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
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-runtime-shared-runner-"));
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

function uniqueRelativePaths(items: Array<string | null | undefined>) {
  return [...new Set(items.filter((value): value is string => Boolean(value)))];
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
    runtimePromotionReadinessRelativePath: actionResult.runtimePromotionReadinessRelativePath ?? null,
    candidateId: actionResult.candidateId,
    candidateName: actionResult.candidateName,
  };
}

function countMirrorEvents(input: {
  directiveRoot: string;
  caseId: string;
  eventType: string;
}) {
  return readDirectiveCaseMirrorEvents({
    directiveRoot: input.directiveRoot,
    caseId: input.caseId,
  }).events.filter((event) => event.eventType === input.eventType).length;
}

function assertSuccess(
  result: DirectRunnerResult | DirectiveRuntimeSharedInvocationResult,
): asserts result is
  | Extract<DirectRunnerResult, { ok: true }>
  | Extract<DirectiveRuntimeSharedInvocationResult, { ok: true }> {
  if (!result.ok) {
    throw new Error(`Expected success result but got interruption: ${result.reason}`);
  }
}

function assertRunnerStateMatchesLive(input: {
  directRoot: string;
  sharedRoot: string;
  artifactPath: string;
  liveFocus: RuntimeFocus;
}) {
  const directFocus = resolveFocusOrThrow({
    directiveRoot: input.directRoot,
    artifactPath: input.artifactPath,
    label: "Direct runner",
  });
  const sharedFocus = resolveFocusOrThrow({
    directiveRoot: input.sharedRoot,
    artifactPath: input.artifactPath,
    label: "Shared runner",
  });

  assert.equal(directFocus.currentHead.artifactPath, sharedFocus.currentHead.artifactPath);
  assert.equal(directFocus.currentStage, sharedFocus.currentStage);
  assert.equal(directFocus.nextLegalStep, sharedFocus.nextLegalStep);

  assert.equal(sharedFocus.currentHead.artifactPath, input.liveFocus.currentHead.artifactPath);
  assert.equal(sharedFocus.currentStage, input.liveFocus.currentStage);
  assert.equal(sharedFocus.nextLegalStep, input.liveFocus.nextLegalStep);
}

function readRelativeContent(directiveRoot: string, relativePath: string) {
  return fs.readFileSync(path.join(directiveRoot, relativePath), "utf8");
}

function assertSharedLayerDidNotChain(input: {
  directiveRoot: string;
  config: RuntimeActionConfig;
  seed: RuntimeActionSeed;
}) {
  assert.equal(
    countMirrorEvents({
      directiveRoot: input.directiveRoot,
      caseId: CASE_UNDER_TEST.candidateId,
      eventType: input.config.mirrorOpenEventType,
    }),
    1,
    `Shared layer should emit exactly one ${input.config.mirrorOpenEventType} event`,
  );

  for (const eventType of input.config.laterMirrorEventTypes) {
    assert.equal(
      countMirrorEvents({
        directiveRoot: input.directiveRoot,
        caseId: CASE_UNDER_TEST.candidateId,
        eventType,
      }),
      0,
      `Shared layer must not auto-open later Runtime step ${eventType}`,
    );
  }

  for (const relativePath of uniqueRelativePaths(
    input.config.nextAutomaticArtifactPaths(input.seed),
  )) {
    assert.equal(
      fs.existsSync(path.join(input.directiveRoot, relativePath)),
      false,
      `Shared layer must not auto-create downstream artifact ${relativePath}`,
    );
  }

  const runnerDir = path.join(input.directiveRoot, "state", "runners");
  const runnerFiles = fs.existsSync(runnerDir)
    ? fs.readdirSync(runnerDir).filter((entry) => entry.endsWith(".json"))
    : [];
  assert.equal(
    runnerFiles.length,
    1,
    `Shared layer must dispatch exactly one runner for ${input.config.actionKind}`,
  );
}

function seedFollowUpAction(directiveRoot: string): RuntimeActionSeed {
  seedQueueBackedDirectiveRoot({ directiveRoot });
  const liveMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeRecordPath),
    "utf8",
  );
  return {
    liveFocus: resolveFocusOrThrow({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: CASE_UNDER_TEST.runtimeRecordPath,
      label: "Live follow-up",
    }),
    liveMarkdown,
    approvedBy: extractReviewedBy(liveMarkdown),
  };
}

function seedProofAction(directiveRoot: string): RuntimeActionSeed {
  seedQueueBackedDirectiveRoot({
    directiveRoot,
    extraRelativePaths: [CASE_UNDER_TEST.runtimeRecordPath],
  });
  const liveMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  return {
    liveFocus: resolveFocusOrThrow({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: CASE_UNDER_TEST.runtimeProofPath,
      label: "Live proof",
    }),
    liveMarkdown,
    approvedBy: extractOpenedBy(liveMarkdown),
  };
}

function seedCapabilityBoundaryAction(directiveRoot: string): RuntimeActionSeed {
  seedQueueBackedDirectiveRoot({
    directiveRoot,
    extraRelativePaths: [CASE_UNDER_TEST.runtimeRecordPath],
  });
  const proofMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  const liveMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
    "utf8",
  );
  return {
    liveFocus: resolveFocusOrThrow({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
      label: "Live capability boundary",
    }),
    liveMarkdown,
    approvedBy: extractOpenedBy(liveMarkdown),
    proofOpenedBy: extractOpenedBy(proofMarkdown),
  };
}

function seedPromotionReadinessAction(directiveRoot: string): RuntimeActionSeed {
  seedQueueBackedDirectiveRoot({
    directiveRoot,
    extraRelativePaths: [CASE_UNDER_TEST.runtimeRecordPath],
  });
  const proofMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeProofPath),
    "utf8",
  );
  const capabilityMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimeCapabilityBoundaryPath),
    "utf8",
  );
  const liveMarkdown = fs.readFileSync(
    path.join(DIRECTIVE_ROOT, CASE_UNDER_TEST.runtimePromotionReadinessPath),
    "utf8",
  );
  return {
    liveFocus: resolveFocusOrThrow({
      directiveRoot: DIRECTIVE_ROOT,
      artifactPath: CASE_UNDER_TEST.runtimePromotionReadinessPath,
      label: "Live promotion-readiness",
    }),
    liveMarkdown,
    approvedBy: extractOpenedBy(liveMarkdown),
    proofOpenedBy: extractOpenedBy(proofMarkdown),
    boundaryOpenedBy: extractOpenedBy(capabilityMarkdown),
  };
}

function prepareNoop() {}

function prepareCapabilityBoundaryPrerequisites(
  directiveRoot: string,
  seed: RuntimeActionSeed,
) {
  assert.ok(seed.proofOpenedBy, "Capability-boundary seed requires proofOpenedBy");
  openDirectiveRuntimeRecordProof({
    directiveRoot,
    runtimeRecordPath: CASE_UNDER_TEST.runtimeRecordPath,
    approved: true,
    approvedBy: seed.proofOpenedBy,
  });
}

function preparePromotionReadinessPrerequisites(
  directiveRoot: string,
  seed: RuntimeActionSeed,
) {
  assert.ok(seed.proofOpenedBy, "Promotion seed requires proofOpenedBy");
  assert.ok(seed.boundaryOpenedBy, "Promotion seed requires boundaryOpenedBy");
  openDirectiveRuntimeRecordProof({
    directiveRoot,
    runtimeRecordPath: CASE_UNDER_TEST.runtimeRecordPath,
    approved: true,
    approvedBy: seed.proofOpenedBy,
  });
  openDirectiveRuntimeProofRuntimeCapabilityBoundary({
    directiveRoot,
    runtimeProofPath: CASE_UNDER_TEST.runtimeProofPath,
    approved: true,
    approvedBy: seed.boundaryOpenedBy,
  });
}

const ACTION_CONFIGS: RuntimeActionConfig[] = [
  {
    actionKind: "runtime_follow_up_open",
    targetPath: CASE_UNDER_TEST.followUpPath,
    expectedArtifactPath: CASE_UNDER_TEST.runtimeRecordPath,
    mirrorOpenEventType: "runtime_follow_up_opened",
    laterMirrorEventTypes: [
      "runtime_proof_opened",
      "runtime_capability_boundary_opened",
      "runtime_promotion_readiness_opened",
    ],
    seed: seedFollowUpAction,
    prepare: prepareNoop,
    runDirect: ({ directiveRoot, runnerId, seed, testInterruptPoint }) =>
      runDirectiveRuntimeFollowUpWithRunner({
        directiveRoot,
        runnerId,
        followUpPath: CASE_UNDER_TEST.followUpPath,
        approved: true,
        approvedBy: seed.approvedBy,
        testInterruptPoint,
      }),
    nextAutomaticArtifactPaths: () => [CASE_UNDER_TEST.runtimeProofPath],
    downstreamPaths: (seed) => [
      seed.liveFocus.linkedArtifacts.runtimeProofPath,
      seed.liveFocus.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
      seed.liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
      seed.liveFocus.linkedArtifacts.runtimeCallableStubPath,
    ],
  },
  {
    actionKind: "runtime_proof_open",
    targetPath: CASE_UNDER_TEST.runtimeRecordPath,
    expectedArtifactPath: CASE_UNDER_TEST.runtimeProofPath,
    mirrorOpenEventType: "runtime_proof_opened",
    laterMirrorEventTypes: [
      "runtime_capability_boundary_opened",
      "runtime_promotion_readiness_opened",
    ],
    seed: seedProofAction,
    prepare: prepareNoop,
    runDirect: ({ directiveRoot, runnerId, seed, testInterruptPoint }) =>
      runDirectiveRuntimeProofOpenWithRunner({
        directiveRoot,
        runnerId,
        runtimeRecordPath: CASE_UNDER_TEST.runtimeRecordPath,
        approved: true,
        approvedBy: seed.approvedBy,
        testInterruptPoint,
      }),
    nextAutomaticArtifactPaths: () => [CASE_UNDER_TEST.runtimeCapabilityBoundaryPath],
    downstreamPaths: (seed) => [
      seed.liveFocus.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
      seed.liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
      seed.liveFocus.linkedArtifacts.runtimeCallableStubPath,
    ],
  },
  {
    actionKind: "runtime_capability_boundary_open",
    targetPath: CASE_UNDER_TEST.runtimeProofPath,
    expectedArtifactPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
    mirrorOpenEventType: "runtime_capability_boundary_opened",
    laterMirrorEventTypes: ["runtime_promotion_readiness_opened"],
    seed: seedCapabilityBoundaryAction,
    prepare: prepareCapabilityBoundaryPrerequisites,
    runDirect: ({ directiveRoot, runnerId, seed, testInterruptPoint }) =>
      runDirectiveRuntimeCapabilityBoundaryWithRunner({
        directiveRoot,
        runnerId,
        runtimeProofPath: CASE_UNDER_TEST.runtimeProofPath,
        approved: true,
        approvedBy: seed.approvedBy,
        testInterruptPoint,
      }),
    nextAutomaticArtifactPaths: () => [CASE_UNDER_TEST.runtimePromotionReadinessPath],
    downstreamPaths: (seed) => [
      seed.liveFocus.linkedArtifacts.runtimePromotionReadinessPath,
      seed.liveFocus.linkedArtifacts.runtimeCallableStubPath,
    ],
  },
  {
    actionKind: "runtime_promotion_readiness_open",
    targetPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
    expectedArtifactPath: CASE_UNDER_TEST.runtimePromotionReadinessPath,
    mirrorOpenEventType: "runtime_promotion_readiness_opened",
    laterMirrorEventTypes: [],
    seed: seedPromotionReadinessAction,
    prepare: preparePromotionReadinessPrerequisites,
    runDirect: ({ directiveRoot, runnerId, seed, testInterruptPoint }) =>
      runDirectiveRuntimePromotionReadinessWithRunner({
        directiveRoot,
        runnerId,
        capabilityBoundaryPath: CASE_UNDER_TEST.runtimeCapabilityBoundaryPath,
        approved: true,
        approvedBy: seed.approvedBy,
        testInterruptPoint,
      }),
    nextAutomaticArtifactPaths: (seed) => [
      seed.liveFocus.linkedArtifacts.runtimeCallableStubPath,
    ],
    downstreamPaths: () => [],
  },
];

function scenarioSharedDispatchMatchesDirectRunner(config: RuntimeActionConfig) {
  withTempDirectiveRoot((directRoot) => {
    const directSeed = config.seed(directRoot);
    config.prepare(directRoot, directSeed);
    const directResult = config.runDirect({
      directiveRoot: directRoot,
      runnerId: `${config.actionKind}-direct`,
      seed: directSeed,
    });
    assertSuccess(directResult);

    withTempDirectiveRoot((sharedRoot) => {
      const sharedSeed = config.seed(sharedRoot);
      config.prepare(sharedRoot, sharedSeed);
      const sharedResult = runDirectiveRuntimeActionByExplicitInvocation({
        directiveRoot: sharedRoot,
        actionKind: config.actionKind,
        runnerId: `${config.actionKind}-shared`,
        targetPath: config.targetPath,
        approved: true,
        approvedBy: sharedSeed.approvedBy,
      });
      assertSuccess(sharedResult);

      assert.equal(sharedResult.dispatchCount, 1);
      assert.equal(sharedResult.actionKind, config.actionKind);
      assert.equal(sharedResult.runnerRecord.actionKind, config.actionKind);
      assert.equal(sharedResult.targetPath, config.targetPath);
      assert.deepEqual(
        comparableActionResult(sharedResult.actionResult),
        comparableActionResult(directResult.actionResult),
      );

      assert.equal(
        readRelativeContent(sharedRoot, config.expectedArtifactPath),
        readRelativeContent(directRoot, config.expectedArtifactPath),
      );
      assert.equal(
        readRelativeContent(sharedRoot, config.expectedArtifactPath),
        sharedSeed.liveMarkdown,
      );

      assertSharedLayerDidNotChain({
        directiveRoot: sharedRoot,
        config,
        seed: sharedSeed,
      });

      copyRelativeFiles(config.downstreamPaths(directSeed), directRoot);
      copyRelativeFiles(config.downstreamPaths(sharedSeed), sharedRoot);
      assertRunnerStateMatchesLive({
        directRoot,
        sharedRoot,
        artifactPath: config.expectedArtifactPath,
        liveFocus: sharedSeed.liveFocus,
      });
    });
  });
}

function scenarioSharedAfterActionResumeDoesNotDuplicate(config: RuntimeActionConfig) {
  withTempDirectiveRoot((directiveRoot) => {
    const seed = config.seed(directiveRoot);
    config.prepare(directiveRoot, seed);
    const runnerId = `${config.actionKind}-shared-after-action`;
    const interrupted = runDirectiveRuntimeActionByExplicitInvocation({
      directiveRoot,
      actionKind: config.actionKind,
      runnerId,
      targetPath: config.targetPath,
      approved: true,
      approvedBy: seed.approvedBy,
      testInterruptPoint: "after_after_action_checkpoint",
    });

    assert.equal(interrupted.ok, false);
    assert.equal(interrupted.checkpointStage, "after_action");
    assert.equal(
      readRelativeContent(directiveRoot, config.expectedArtifactPath),
      seed.liveMarkdown,
    );

    const resumed = runDirectiveRuntimeActionByExplicitInvocation({
      directiveRoot,
      actionKind: config.actionKind,
      runnerId,
      targetPath: config.targetPath,
      approved: true,
      approvedBy: seed.approvedBy,
    });
    assertSuccess(resumed);
    assert.equal(resumed.resumed, true);
    assert.equal(resumed.replayedFromCheckpoint, true);
    assert.equal(
      countMirrorEvents({
        directiveRoot,
        caseId: CASE_UNDER_TEST.candidateId,
        eventType: config.mirrorOpenEventType,
      }),
      1,
      `Resume must not duplicate ${config.mirrorOpenEventType}`,
    );

    const runnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId,
    }).record;
    assert.ok(runnerRecord, "Shared resumed runner record should exist");
    assert.equal(runnerRecord.lifecycleState, "completed");
    assert.equal(runnerRecord.attempts, 1);
  });
}

function scenarioSharedApprovalAndStaleHeadGuards(config: RuntimeActionConfig) {
  withTempDirectiveRoot((directiveRoot) => {
    const seed = config.seed(directiveRoot);
    config.prepare(directiveRoot, seed);

    const missingApprovalRunnerId = `${config.actionKind}-shared-missing-approval`;
    assert.throws(
      () =>
        runDirectiveRuntimeActionByExplicitInvocation({
          directiveRoot,
          actionKind: config.actionKind,
          runnerId: missingApprovalRunnerId,
          targetPath: config.targetPath,
        }),
      /explicit approval/i,
      `Shared layer should preserve explicit approval for ${config.actionKind}`,
    );
    assert.equal(
      readDirectiveActionRunnerRecord({
        directiveRoot,
        runnerId: missingApprovalRunnerId,
      }).record,
      null,
      "Missing approval must not create runner state through the shared layer",
    );

    const firstSuccess = runDirectiveRuntimeActionByExplicitInvocation({
      directiveRoot,
      actionKind: config.actionKind,
      runnerId: `${config.actionKind}-shared-success-first`,
      targetPath: config.targetPath,
      approved: true,
      approvedBy: seed.approvedBy,
    });
    assertSuccess(firstSuccess);

    const staleRunnerId = `${config.actionKind}-shared-stale-head`;
    assert.throws(
      () =>
        runDirectiveRuntimeActionByExplicitInvocation({
          directiveRoot,
          actionKind: config.actionKind,
          runnerId: staleRunnerId,
          targetPath: config.targetPath,
          approved: true,
          approvedBy: seed.approvedBy,
        }),
      /live current stage/i,
      `Shared layer should preserve stale-head guard for ${config.actionKind}`,
    );

    const failedRunnerRecord = readDirectiveActionRunnerRecord({
      directiveRoot,
      runnerId: staleRunnerId,
    }).record;
    assert.ok(failedRunnerRecord, "Failed stale-head shared runner should persist state");
    assert.equal(failedRunnerRecord.lifecycleState, "failed");
    assert.equal(failedRunnerRecord.checkpointStage, "before_action");
    assert.match(failedRunnerRecord.lastError?.message || "", /live current stage/i);
  });
}

function main() {
  for (const config of ACTION_CONFIGS) {
    scenarioSharedDispatchMatchesDirectRunner(config);
    scenarioSharedAfterActionResumeDoesNotDuplicate(config);
    scenarioSharedApprovalAndStaleHeadGuards(config);
  }

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      candidateId: CASE_UNDER_TEST.candidateId,
      actionKinds: DIRECTIVE_RUNTIME_SHARED_INVOCATION_ACTIONS,
      dispatch: "single_action_only",
      preservedGuards: [
        "explicit_approval",
        "stale_head",
      ],
      preservedResumeSafety: [
        "after_action_checkpoint_resume",
        "no_duplicate_runtime_artifacts",
      ],
    },
  }, null, 2)}\n`);
}

main();
