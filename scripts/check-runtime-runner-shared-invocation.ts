import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveActionRunnerRecord,
  type DirectiveRunnerActionResult,
} from "../engine/execution/directive-runner-state.ts";
import type { DiscoveryIntakeQueueEntry } from "../discovery/lib/discovery-intake-queue-writer.ts";
import { readDirectiveDiscoveryRoutingArtifact } from "../discovery/lib/discovery-route-opener.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import { readDirectiveCaseMirrorEvents } from "../engine/cases/case-event-log.ts";
import { openDirectiveRuntimeRecordProof } from "../runtime/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../runtime/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import {
  DIRECTIVE_RUNTIME_SHARED_INVOCATION_ACTIONS,
  runDirectiveRuntimeActionByExplicitInvocation,
  type DirectiveRuntimeSharedInvocationActionKind,
  type DirectiveRuntimeSharedInvocationInterruptionPoint,
  type DirectiveRuntimeSharedInvocationResult,
} from "../runtime/lib/runtime-runner-invocation.ts";
import {
  runDirectiveRuntimeCapabilityBoundaryWithRunner,
  type DirectiveRuntimeCapabilityBoundaryRunnerResult,
} from "../runtime/lib/runtime-capability-boundary-runner.ts";
import {
  runDirectiveRuntimeFollowUpWithRunner,
  type DirectiveRuntimeFollowUpRunnerResult,
} from "../runtime/lib/runtime-follow-up-runner.ts";
import {
  runDirectiveRuntimePromotionReadinessWithRunner,
  type DirectiveRuntimePromotionReadinessRunnerResult,
} from "../runtime/lib/runtime-promotion-readiness-runner.ts";
import {
  copyRelativeFile,
  copyRelativeFiles,
  extractOpenedBy,
  extractReviewedBy,
  readJson,
  uniqueRelativePaths,
  writeJson,
} from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";
import {
  runDirectiveRuntimeProofOpenWithRunner,
  type DirectiveRuntimeProofOpenRunnerResult,
} from "../runtime/lib/runtime-proof-open-runner.ts";

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
const EXPECTED_PRE_PROMOTION_NEXT_STEP =
  "No automatic Runtime step is open; host-facing promotion, callable implementation, host integration, and runtime execution remain intentionally unopened.";
const CASE_UNDER_TEST = {
  candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
  followUpPath: "runtime/00-follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeRecordPath: "runtime/02-records/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-record.md",
  runtimeProofPath: "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  runtimeCapabilityBoundaryPath: "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
  runtimePromotionReadinessPath: "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md",
} as const;

function assertPromotionReadinessBaseContract(input: {
  markdown: string;
  approvedBy: string;
}) {
  const expectedNeedles = [
    "## runtime capability boundary identity",
    `- Candidate id: \`${CASE_UNDER_TEST.candidateId}\``,
    `- Runtime capability boundary path: \`${CASE_UNDER_TEST.runtimeCapabilityBoundaryPath}\``,
    `- Source Runtime proof artifact: \`${CASE_UNDER_TEST.runtimeProofPath}\``,
    `- Source Runtime v0 record: \`${CASE_UNDER_TEST.runtimeRecordPath}\``,
    `- Source Runtime follow-up record: \`${CASE_UNDER_TEST.followUpPath}\``,
    "- Promotion-readiness decision: `approved_for_non_executing_promotion_readiness`",
    `- Opened by: \`${input.approvedBy}\``,
    "- Current status: `promotion_readiness_opened`",
    "## bounded runtime usefulness preserved",
    "## what is now explicit",
    "## validation boundary",
    "## rollback boundary",
    "## artifact linkage",
    `- Promotion-readiness artifact: \`${CASE_UNDER_TEST.runtimePromotionReadinessPath}\``,
    `- Runtime capability boundary: \`${CASE_UNDER_TEST.runtimeCapabilityBoundaryPath}\``,
    `- Runtime proof artifact: \`${CASE_UNDER_TEST.runtimeProofPath}\``,
    `- Runtime v0 record: \`${CASE_UNDER_TEST.runtimeRecordPath}\``,
    `- Source Runtime follow-up record: \`${CASE_UNDER_TEST.followUpPath}\``,
  ];

  for (const needle of expectedNeedles) {
    assert.ok(
      input.markdown.includes(needle),
      `Promotion-readiness base contract missing expected content: ${needle}`,
    );
  }
}

function seedQueueBackedDirectiveRoot(input: {
  directiveRoot: string;
  extraRelativePaths?: Array<string | null | undefined>;
}) {
  const queueDocument = readJson<{ entries: DiscoveryIntakeQueueEntry[] }>(
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
  ], DIRECTIVE_ROOT, input.directiveRoot, "Missing source file for shared-runner copy");

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
  actionKind: DirectiveRuntimeSharedInvocationActionKind;
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

  if (input.actionKind === "runtime_promotion_readiness_open") {
    assert.ok(
      [
        CASE_UNDER_TEST.runtimePromotionReadinessPath,
        input.liveFocus.currentHead.artifactPath,
      ].includes(sharedFocus.currentHead.artifactPath),
      "Promotion-readiness shared runner should stay at the bounded promotion head or resolve to the same later live head",
    );
    assert.ok(
      [
        "runtime.promotion_readiness.opened",
        input.liveFocus.currentStage,
      ].includes(sharedFocus.currentStage),
      "Promotion-readiness shared runner should preserve the bounded promotion stage or the same later live stage",
    );
    assert.ok(
      [
        EXPECTED_PRE_PROMOTION_NEXT_STEP,
        input.liveFocus.nextLegalStep,
      ].includes(sharedFocus.nextLegalStep),
      "Promotion-readiness shared runner should preserve the bounded pre-promotion next step or the same later live next step",
    );
    assert.equal(sharedFocus.runtime?.proposedHost, input.liveFocus.runtime?.proposedHost);
    return;
  }

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
      seed.liveFocus.linkedArtifacts.runtimePromotionRecordPath,
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
      seed.liveFocus.linkedArtifacts.runtimePromotionRecordPath,
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
      seed.liveFocus.linkedArtifacts.runtimePromotionRecordPath,
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
    downstreamPaths: (seed) => [seed.liveFocus.linkedArtifacts.runtimePromotionRecordPath],
  },
];

function scenarioSharedDispatchMatchesDirectRunner(config: RuntimeActionConfig) {
  withTempDirectiveRoot({ prefix: "directive-runtime-shared-runner-" }, (directRoot) => {
    const directSeed = config.seed(directRoot);
    config.prepare(directRoot, directSeed);
    const directResult = config.runDirect({
      directiveRoot: directRoot,
      runnerId: `${config.actionKind}-direct`,
      seed: directSeed,
    });
    assertSuccess(directResult);

    withTempDirectiveRoot({ prefix: "directive-runtime-shared-runner-" }, (sharedRoot) => {
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
      if (config.actionKind === "runtime_promotion_readiness_open") {
        assertPromotionReadinessBaseContract({
          markdown: readRelativeContent(sharedRoot, config.expectedArtifactPath),
          approvedBy: sharedSeed.approvedBy,
        });
      } else {
        assert.equal(
          readRelativeContent(sharedRoot, config.expectedArtifactPath),
          sharedSeed.liveMarkdown,
        );
      }

      assertSharedLayerDidNotChain({
        directiveRoot: sharedRoot,
        config,
        seed: sharedSeed,
      });

      copyRelativeFiles(
        config.downstreamPaths(directSeed),
        DIRECTIVE_ROOT,
        directRoot,
        "Missing source file for shared-runner copy",
      );
      copyRelativeFiles(
        config.downstreamPaths(sharedSeed),
        DIRECTIVE_ROOT,
        sharedRoot,
        "Missing source file for shared-runner copy",
      );
      assertRunnerStateMatchesLive({
        directRoot,
        sharedRoot,
        artifactPath: config.expectedArtifactPath,
        liveFocus: sharedSeed.liveFocus,
        actionKind: config.actionKind,
      });
    });
  });
}

function scenarioSharedAfterActionResumeDoesNotDuplicate(config: RuntimeActionConfig) {
  withTempDirectiveRoot({ prefix: "directive-runtime-shared-runner-" }, (directiveRoot) => {
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
    if (config.actionKind === "runtime_promotion_readiness_open") {
      assertPromotionReadinessBaseContract({
        markdown: readRelativeContent(directiveRoot, config.expectedArtifactPath),
        approvedBy: seed.approvedBy,
      });
    } else {
      assert.equal(
        readRelativeContent(directiveRoot, config.expectedArtifactPath),
        seed.liveMarkdown,
      );
    }

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
  withTempDirectiveRoot({ prefix: "directive-runtime-shared-runner-" }, (directiveRoot) => {
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
