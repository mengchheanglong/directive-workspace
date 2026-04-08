import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizeAbsolutePath } from "../shared/lib/path-normalization.ts";

import { closeDirectiveArchitectureBoundedStart } from "../architecture/lib/architecture-bounded-closeout.ts";
import {
  adoptDirectiveArchitectureResult,
  resolveDirectiveArchitectureAdoptionReviewResolution,
} from "../architecture/lib/architecture-result-adoption.ts";
import { createDirectiveArchitectureImplementationTarget } from "../architecture/lib/architecture-implementation-target.ts";
import { createDirectiveArchitectureImplementationResult } from "../architecture/lib/architecture-implementation-result.ts";
import { readDirectiveArchitectureMaterializationDueCheck } from "../architecture/lib/architecture-materialization-due-check.ts";
import { confirmDirectiveArchitectureRetention } from "../architecture/lib/architecture-retention.ts";
import { createDirectiveArchitectureIntegrationRecord } from "../architecture/lib/architecture-integration-record.ts";
import { recordDirectiveArchitectureConsumption } from "../architecture/lib/architecture-consumption-record.ts";
import { evaluateDirectiveArchitectureConsumption } from "../architecture/lib/architecture-post-consumption-evaluation.ts";
import { reopenDirectiveArchitectureFromEvaluation } from "../architecture/lib/architecture-reopen-from-evaluation.ts";
import {
  continueDirectiveArchitectureFromBoundedResult,
  readDirectiveArchitectureBoundedResultArtifact,
  readDirectiveArchitectureBoundedStartArtifact,
} from "../architecture/lib/architecture-bounded-closeout.ts";
import {
  readDirectiveFrontendArchitectureAdoptionDetail,
  readDirectiveFrontendArchitectureConsumptionRecordDetail,
  readDirectiveFrontendArchitectureImplementationResultDetail,
  readDirectiveFrontendArchitectureImplementationTargetDetail,
  readDirectiveFrontendArchitectureIntegrationRecordDetail,
  readDirectiveFrontendArchitecturePostConsumptionEvaluationDetail,
  readDirectiveFrontendArchitectureResultDetail,
  readDirectiveFrontendArchitectureRetentionDetail,
} from "../hosts/web-host/data.ts";
import { resolveDirectiveWorkspaceArtifactAbsolutePath } from "../shared/lib/directive-workspace-artifact-storage.ts";

type ProofReport = {
  workspace: {
    sourceRoot: string;
    tempRoot: string;
  };
  normal: {
    boundedStart: string;
    boundedResult: string;
    continuationStart: string;
    continuationResult: string;
    adoption: string;
    implementationTarget: string;
    implementationResult: string;
    retained: string;
    integration: string;
    consumption: string;
    evaluation: string;
  };
  reopened: {
    boundedStart: string;
    experimentalResult: string;
    experimentalContinuation: string;
    positiveResult: string;
    adoption: string;
    implementationTarget: string;
    implementationResult: string;
    retained: string;
    integration: string;
    consumption: string;
    evaluation: string;
  };
  standalone: {
    normalContinuationShownOnlyForExperimental: boolean;
    normalAdoptionShown: boolean;
    reopenEvaluationHasReopenStart: boolean;
    keepEvaluationHasNoReopenStart: boolean;
    reopenedPositiveResultHasAdoption: boolean;
    reopenedDownstreamLinksResolve: boolean;
  };
};

const SOURCE_ROOT = normalizeAbsolutePath(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
);

const NORMAL_BOUNDED_START =
  "architecture/01-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-bounded-start.md";
const NORMAL_CONTINUATION_START =
  "architecture/01-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-start.md";
const REOPENED_BOUNDED_START =
  "architecture/01-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-bounded-start.md";
const TEMP_REOPENED_CONTINUATION =
  "architecture/01-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-continuation-bounded-start.md";

function stageRealArtifact(sourceRoot: string, tempRoot: string, relativePath: string) {
  const source = resolveDirectiveWorkspaceArtifactAbsolutePath({
    directiveRoot: sourceRoot,
    relativePath,
    mode: "read",
  });
  if (!fs.existsSync(source)) {
    throw new Error(`setup: missing real artifact ${relativePath}`);
  }

  const target = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function phase<T>(name: string, run: () => T): T {
  try {
    return run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${name}: ${message}`);
  }
}

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function expectOk<T extends { ok: boolean }>(value: T, message: string): asserts value is T & { ok: true } {
  invariant(value.ok === true, message);
}

function expectEqual<T>(actual: T, expected: T, message: string) {
  invariant(actual === expected, `${message} (expected ${String(expected)}, got ${String(actual)})`);
}

function expectIncludes(actual: string | null | undefined, expected: string, message: string) {
  invariant(typeof actual === "string" && actual.includes(expected), message);
}

function expectThrows(run: () => unknown, expectedSubstring: string, message: string) {
  try {
    run();
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    invariant(text.includes(expectedSubstring), `${message}: ${text}`);
    return;
  }

  throw new Error(message);
}

function removeIfExists(root: string, relativePath: string) {
  const absolute = path.join(root, relativePath);
  if (fs.existsSync(absolute)) {
    fs.rmSync(absolute, { force: true });
  }
}

export function runDirectiveArchitectureCompositionCheck() {
  const tempRoot = normalizeAbsolutePath(
    fs.mkdtempSync(path.join(os.tmpdir(), "directive-architecture-composition-")),
  );

  try {
    phase("setup", () => {
      stageRealArtifact(SOURCE_ROOT, tempRoot, NORMAL_BOUNDED_START);
      stageRealArtifact(SOURCE_ROOT, tempRoot, NORMAL_CONTINUATION_START);
      stageRealArtifact(SOURCE_ROOT, tempRoot, REOPENED_BOUNDED_START);
    });

    const report: ProofReport = {
      workspace: {
        sourceRoot: SOURCE_ROOT,
        tempRoot,
      },
      normal: {
        boundedStart: NORMAL_BOUNDED_START,
        boundedResult: "",
        continuationStart: "",
        continuationResult: "",
        adoption: "",
        implementationTarget: "",
        implementationResult: "",
        retained: "",
        integration: "",
        consumption: "",
        evaluation: "",
      },
      reopened: {
        boundedStart: REOPENED_BOUNDED_START,
        experimentalResult: "",
        experimentalContinuation: "",
        positiveResult: "",
        adoption: "",
        implementationTarget: "",
        implementationResult: "",
        retained: "",
        integration: "",
        consumption: "",
        evaluation: "",
      },
      standalone: {
        normalContinuationShownOnlyForExperimental: false,
        normalAdoptionShown: false,
        reopenEvaluationHasReopenStart: false,
        keepEvaluationHasNoReopenStart: false,
        reopenedPositiveResultHasAdoption: false,
        reopenedDownstreamLinksResolve: false,
      },
    };

    phase("adoption.review_feedback_resolution", () => {
      const materialized = resolveDirectiveArchitectureAdoptionReviewResolution({
        candidateId: "materialized-slice",
        finalStatus: "adopted",
        completionStatus: "product_materialized",
      });
      expectEqual(
        materialized.lifecycleFeedback.outcome,
        "promote_to_decision",
        "materialized adopted slices should promote to decision through canonical lifecycle feedback",
      );
      expectEqual(
        materialized.transitionRequest.to,
        "decided",
        "materialized adopted slices should transition to decided",
      );
      expectEqual(
        materialized.transitionRequest.role,
        "decision_owner",
        "materialized adopted slices should require the decision owner",
      );

      const partial = resolveDirectiveArchitectureAdoptionReviewResolution({
        candidateId: "partial-slice",
        finalStatus: "adopt_planned_next",
        completionStatus: "product_partial",
      });
      expectEqual(
        partial.lifecycleFeedback.outcome,
        "accept_with_follow_up",
        "planned-next adopted slices should keep explicit follow-up pressure",
      );
      invariant(
        partial.warningChecks.includes("validation_link_check"),
        "planned-next adopted slices should retain validation follow-up warning pressure",
      );
      expectEqual(
        partial.transitionRequest.to,
        "decided",
        "planned-next adopted slices should still use a valid decided transition target",
      );
      expectEqual(
        partial.transitionRequest.role,
        "decision_owner",
        "planned-next adopted slices should keep the review handoff on the decision owner",
      );
    });

    phase("normal.experimental_closeout", () => {
      const closeout = closeDirectiveArchitectureBoundedStart({
        directiveRoot: tempRoot,
        startPath: NORMAL_BOUNDED_START,
        resultSummary:
          "The initial bounded Architecture slice clarified the first operating boundary but still needs one continued experimental pass before adoption.",
        primaryEvidencePath: NORMAL_BOUNDED_START,
        transformedArtifactsProduced: [NORMAL_BOUNDED_START],
        nextDecision: "needs-more-evidence",
        proofExecuted: true,
        targetArtifactClarified: true,
        deltaEvidencePresent: true,
      });

      invariant(closeout.ok, "normal bounded closeout did not return ok=true");
      invariant(closeout.created, "normal bounded closeout should create the first bounded result in the staged workspace");
      expectEqual(closeout.verdict, "stay_experimental", "normal bounded result should stay experimental");
      expectEqual(closeout.nextDecision, "needs-more-evidence", "normal bounded result should require more evidence");

      const result = readDirectiveArchitectureBoundedResultArtifact({
        directiveRoot: tempRoot,
        resultPath: closeout.resultRelativePath,
      });

      expectEqual(result.verdict, "stay_experimental", "normal bounded-result artifact should preserve the experimental verdict");
      expectEqual(
        result.primaryEvidencePath,
        NORMAL_BOUNDED_START,
        "normal bounded-result artifact should preserve the explicit primary evidence path",
      );
      expectEqual(
        result.transformedArtifactsProduced[0],
        NORMAL_BOUNDED_START,
        "normal bounded-result artifact should preserve explicit transformed artifacts produced",
      );
      report.normal.boundedResult = closeout.resultRelativePath;
    });

    phase("normal.experimental_continuation", () => {
      const continuation = continueDirectiveArchitectureFromBoundedResult({
        directiveRoot: tempRoot,
        resultPath: report.normal.boundedResult,
      });

      invariant(continuation.ok, "normal continuation helper did not return ok=true");
      invariant(
        continuation.created === false,
        "normal continuation helper should reuse the real March 24 continuation start artifact in the staged workspace",
      );
      expectEqual(
        continuation.continuationStartRelativePath,
        NORMAL_CONTINUATION_START,
        "normal continuation helper should resolve the real March 24 continuation start path",
      );
      report.normal.continuationStart = continuation.continuationStartRelativePath;
    });

    phase("normal.adoption_path", () => {
      const continuationCloseout = closeDirectiveArchitectureBoundedStart({
        directiveRoot: tempRoot,
        startPath: report.normal.continuationStart,
        resultSummary:
          "The continued Architecture slice is now specific enough to adopt as the next bounded product-owned materialization boundary.",
        nextDecision: "needs-more-evidence",
        proofExecuted: true,
        targetArtifactClarified: true,
        deltaEvidencePresent: true,
      });

      invariant(continuationCloseout.ok, "normal continuation closeout did not return ok=true");
      expectEqual(
        continuationCloseout.verdict,
        "stay_experimental",
        "normal continuation result should remain experimental for planned-next adoption",
      );
      report.normal.continuationResult = continuationCloseout.resultRelativePath;

      const adoption = adoptDirectiveArchitectureResult({
        directiveRoot: tempRoot,
        resultPath: report.normal.continuationResult,
      });

      invariant(adoption.ok, "normal adoption helper did not return ok=true");
      invariant(adoption.created, "normal adoption helper should create the planned-next adoption artifact");
      expectEqual(adoption.finalStatus, "adopt_planned_next", "normal adoption should stay planned-next");
      report.normal.adoption = adoption.adoptedRelativePath;

      const dueCheck = readDirectiveArchitectureMaterializationDueCheck({
        directiveRoot: tempRoot,
      });
      invariant(
        dueCheck.dueItems.some((item) =>
          item.currentArtifactPath === report.normal.adoption
          && item.dueKind === "create_implementation_target"),
        "normal adoption should appear in the materialization due-check until its implementation target is opened",
      );
      invariant(
        dueCheck.dueAdoptionDecisionSummary !== null,
        "normal adoption should contribute to the due adopted decision summary until its implementation target is opened",
      );
      expectEqual(
        dueCheck.dueAdoptionDecisionSummary.totalAdoptionsSummarized,
        1,
        "normal adoption should be the only summarized due adopted slice in the staged workspace",
      );
      expectEqual(
        dueCheck.dueAdoptionDecisionSummary.summary.verdictCounts.adopt,
        1,
        "normal due adopted decision summary should count the open adopted slice",
      );
    });

    phase("normal.downstream_materialization", () => {
      const implementationTarget = createDirectiveArchitectureImplementationTarget({
        directiveRoot: tempRoot,
        adoptionPath: report.normal.adoption,
      });
      invariant(implementationTarget.ok, "normal implementation target helper did not return ok=true");
      invariant(implementationTarget.created, "normal implementation target should be created");
      report.normal.implementationTarget = implementationTarget.targetRelativePath;

      const dueAfterTarget = readDirectiveArchitectureMaterializationDueCheck({
        directiveRoot: tempRoot,
      });
      invariant(
        dueAfterTarget.dueItems.some((item) =>
          item.currentArtifactPath === report.normal.implementationTarget
          && item.dueKind === "record_implementation_result"),
        "normal implementation target should appear in the materialization due-check until its implementation result is recorded",
      );
      invariant(
        dueAfterTarget.dueAdoptionDecisionSummary === null,
        "normal implementation target should clear the due adopted decision summary once no adopted slices still need targets",
      );

      const implementationResult = createDirectiveArchitectureImplementationResult({
        directiveRoot: tempRoot,
        targetPath: report.normal.implementationTarget,
        outcome: "success",
        resultSummary:
          "The adopted planned-next Architecture output was materialized within one bounded implementation slice.",
      });
      invariant(implementationResult.ok, "normal implementation result helper did not return ok=true");
      invariant(implementationResult.created, "normal implementation result should be created");
      report.normal.implementationResult = implementationResult.resultRelativePath;

      const dueAfterResult = readDirectiveArchitectureMaterializationDueCheck({
        directiveRoot: tempRoot,
      });
      invariant(
        !dueAfterResult.dueItems.some((item) => item.candidateId === "dw-real-gpt-researcher-engine-handoff-2026-03-24"),
        "normal implementation result should clear the candidate from the materialization due-check",
      );

      const retained = confirmDirectiveArchitectureRetention({
        directiveRoot: tempRoot,
        resultPath: report.normal.implementationResult,
      });
      invariant(retained.ok, "normal retention helper did not return ok=true");
      invariant(retained.created, "normal retained artifact should be created");
      report.normal.retained = retained.retainedRelativePath;

      const integration = createDirectiveArchitectureIntegrationRecord({
        directiveRoot: tempRoot,
        retainedPath: report.normal.retained,
      });
      invariant(integration.ok, "normal integration helper did not return ok=true");
      invariant(integration.created, "normal integration record should be created");
      report.normal.integration = integration.integrationRelativePath;

      const consumption = recordDirectiveArchitectureConsumption({
        directiveRoot: tempRoot,
        integrationPath: report.normal.integration,
        outcome: "success",
      });
      invariant(consumption.ok, "normal consumption helper did not return ok=true");
      invariant(consumption.created, "normal consumption record should be created");
      report.normal.consumption = consumption.consumptionRelativePath;

      const evaluation = evaluateDirectiveArchitectureConsumption({
        directiveRoot: tempRoot,
        consumptionPath: report.normal.consumption,
        decision: "reopen",
      });
      invariant(evaluation.ok, "normal evaluation helper did not return ok=true");
      invariant(evaluation.created, "normal post-consumption evaluation should be created");
      expectEqual(evaluation.decision, "reopen", "normal evaluation should reopen the Architecture slice");
      report.normal.evaluation = evaluation.evaluationRelativePath;
    });

    phase("normal.reopen_path", () => {
      const reopen = reopenDirectiveArchitectureFromEvaluation({
        directiveRoot: tempRoot,
        evaluationPath: report.normal.evaluation,
      });

      invariant(reopen.ok, "reopen helper did not return ok=true");
      invariant(
        reopen.created === false,
        "reopen helper should reuse the real reopened March 24 bounded-start artifact in the staged workspace",
      );
      expectEqual(
        reopen.reopenedStartRelativePath,
        REOPENED_BOUNDED_START,
        "reopen helper should resolve the real reopened March 24 bounded-start path",
      );
    });

    phase("reopened.experimental_reentry", () => {
      removeIfExists(tempRoot, TEMP_REOPENED_CONTINUATION);

      const experimentalCloseout = closeDirectiveArchitectureBoundedStart({
        directiveRoot: tempRoot,
        startPath: REOPENED_BOUNDED_START,
        resultSummary:
          "The reopened Architecture slice still needs another bounded experiment before it can move forward confidently.",
        nextDecision: "needs-more-evidence",
        proofExecuted: true,
        targetArtifactClarified: true,
        deltaEvidencePresent: true,
      });

      invariant(experimentalCloseout.ok, "reopened experimental closeout did not return ok=true");
      expectEqual(
        experimentalCloseout.verdict,
        "stay_experimental",
        "reopened experimental proof should stay experimental",
      );
      report.reopened.experimentalResult = experimentalCloseout.resultRelativePath;

      const continuation = continueDirectiveArchitectureFromBoundedResult({
        directiveRoot: tempRoot,
        resultPath: report.reopened.experimentalResult,
      });

      invariant(continuation.ok, "reopened experimental continuation helper did not return ok=true");
      invariant(continuation.created, "reopened experimental continuation should create a continuation start");
      expectEqual(
        continuation.continuationStartRelativePath,
        TEMP_REOPENED_CONTINUATION,
        "reopened experimental continuation should use the derived continuation path",
      );
      report.reopened.experimentalContinuation = continuation.continuationStartRelativePath;
    });

    phase("reopened.forward_adoption", () => {
      removeIfExists(tempRoot, TEMP_REOPENED_CONTINUATION);

      const positiveCloseout = closeDirectiveArchitectureBoundedStart({
        directiveRoot: tempRoot,
        startPath: REOPENED_BOUNDED_START,
        resultSummary:
          "The reopened Architecture slice now closes with a clear, adoption-ready Directive-owned outcome.",
        nextDecision: "adopt",
        adaptationQuality: "strong",
        improvementQuality: "strong",
        proofExecuted: true,
        targetArtifactClarified: true,
        deltaEvidencePresent: true,
        noUnresolvedBaggage: true,
      });

      invariant(positiveCloseout.ok, "reopened positive closeout did not return ok=true");
      expectEqual(positiveCloseout.verdict, "adopt", "reopened positive closeout should produce an adopt-worthy verdict");
      expectEqual(positiveCloseout.nextDecision, "adopt", "reopened positive closeout should preserve nextDecision=adopt");
      report.reopened.positiveResult = positiveCloseout.resultRelativePath;

      const adoption = adoptDirectiveArchitectureResult({
        directiveRoot: tempRoot,
        resultPath: report.reopened.positiveResult,
      });

      invariant(adoption.ok, "reopened adoption helper did not return ok=true");
      invariant(adoption.created, "reopened adoption helper should create the adopted artifact");
      expectEqual(adoption.finalStatus, "adopted", "reopened positive result should adopt directly");
      report.reopened.adoption = adoption.adoptedRelativePath;
    });

    phase("reopened.downstream_materialization", () => {
      const implementationTarget = createDirectiveArchitectureImplementationTarget({
        directiveRoot: tempRoot,
        adoptionPath: report.reopened.adoption,
      });
      invariant(implementationTarget.ok, "reopened implementation target helper did not return ok=true");
      invariant(implementationTarget.created, "reopened implementation target should be created");
      report.reopened.implementationTarget = implementationTarget.targetRelativePath;

      const implementationResult = createDirectiveArchitectureImplementationResult({
        directiveRoot: tempRoot,
        targetPath: report.reopened.implementationTarget,
        outcome: "success",
        resultSummary:
          "The reopened adopted Architecture output was materialized successfully within one bounded implementation slice.",
      });
      invariant(implementationResult.ok, "reopened implementation result helper did not return ok=true");
      invariant(implementationResult.created, "reopened implementation result should be created");
      report.reopened.implementationResult = implementationResult.resultRelativePath;

      const retained = confirmDirectiveArchitectureRetention({
        directiveRoot: tempRoot,
        resultPath: report.reopened.implementationResult,
      });
      invariant(retained.ok, "reopened retention helper did not return ok=true");
      invariant(retained.created, "reopened retained artifact should be created");
      report.reopened.retained = retained.retainedRelativePath;

      const integration = createDirectiveArchitectureIntegrationRecord({
        directiveRoot: tempRoot,
        retainedPath: report.reopened.retained,
      });
      invariant(integration.ok, "reopened integration helper did not return ok=true");
      invariant(integration.created, "reopened integration record should be created");
      report.reopened.integration = integration.integrationRelativePath;

      const consumption = recordDirectiveArchitectureConsumption({
        directiveRoot: tempRoot,
        integrationPath: report.reopened.integration,
        outcome: "success",
      });
      invariant(consumption.ok, "reopened consumption helper did not return ok=true");
      invariant(consumption.created, "reopened consumption record should be created");
      report.reopened.consumption = consumption.consumptionRelativePath;

      const evaluation = evaluateDirectiveArchitectureConsumption({
        directiveRoot: tempRoot,
        consumptionPath: report.reopened.consumption,
        decision: "keep",
      });
      invariant(evaluation.ok, "reopened evaluation helper did not return ok=true");
      invariant(evaluation.created, "reopened post-consumption evaluation should be created");
      expectEqual(evaluation.decision, "keep", "reopened downstream evaluation should keep the applied output");
      report.reopened.evaluation = evaluation.evaluationRelativePath;

      expectThrows(
        () =>
          reopenDirectiveArchitectureFromEvaluation({
            directiveRoot: tempRoot,
            evaluationPath: report.reopened.evaluation,
          }),
        "decision reopen",
        "keep evaluation must not reopen Architecture work",
      );
    });

    phase("standalone.surface_alignment", () => {
      const normalResultDetail = readDirectiveFrontendArchitectureResultDetail({
        directiveRoot: tempRoot,
        relativePath: report.normal.boundedResult,
      });
      expectOk(normalResultDetail, "frontend must be able to read the normal bounded-result detail");
      invariant(
        normalResultDetail.continuationStartRelativePath === NORMAL_CONTINUATION_START
          && normalResultDetail.adoptionRelativePath === null,
        "frontend result detail should only expose continuation for the experimental normal result",
      );

      const normalAdoptionDetail = readDirectiveFrontendArchitectureAdoptionDetail({
        directiveRoot: tempRoot,
        relativePath: report.normal.adoption,
      });
      expectOk(normalAdoptionDetail, "frontend must be able to read the normal adoption detail");
      expectEqual(
        normalAdoptionDetail.implementationTargetRelativePath,
        report.normal.implementationTarget,
        "frontend adoption detail should link to the normal implementation target",
      );

      const reopenEvaluationDetail = readDirectiveFrontendArchitecturePostConsumptionEvaluationDetail({
        directiveRoot: tempRoot,
        relativePath: report.normal.evaluation,
      });
      expectOk(reopenEvaluationDetail, "frontend must be able to read the normal reopen evaluation detail");
      expectEqual(
        reopenEvaluationDetail.reopenedStartRelativePath,
        REOPENED_BOUNDED_START,
        "frontend reopen evaluation detail should resolve the reopened start",
      );

      const reopenedResultDetail = readDirectiveFrontendArchitectureResultDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.positiveResult,
      });
      expectOk(reopenedResultDetail, "frontend must be able to read the reopened positive result detail");
      expectEqual(
        reopenedResultDetail.adoptionRelativePath,
        report.reopened.adoption,
        "frontend reopened positive result detail should link to adoption",
      );

      const reopenedImplementationTargetDetail = readDirectiveFrontendArchitectureImplementationTargetDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.implementationTarget,
      });
      expectOk(
        reopenedImplementationTargetDetail,
        "frontend must be able to read the reopened implementation target detail",
      );
      expectEqual(
        reopenedImplementationTargetDetail.implementationResultRelativePath,
        report.reopened.implementationResult,
        "frontend reopened implementation target detail should link to implementation result",
      );
      invariant(
        reopenedImplementationTargetDetail.selectedBoundedSlice.length > 0,
        "frontend reopened implementation target detail should expose a bounded tactical slice",
      );
      invariant(
        reopenedImplementationTargetDetail.mechanicalSuccessCriteria.length > 0,
        "frontend reopened implementation target detail should expose mechanical success criteria",
      );
      invariant(
        reopenedImplementationTargetDetail.explicitLimitations.length > 0,
        "frontend reopened implementation target detail should expose explicit limitations",
      );
      expectEqual(
        reopenedImplementationTargetDetail.sourceAdoptionVerdict,
        "adopt",
        "frontend reopened implementation target detail should preserve the source adoption verdict",
      );
      invariant(
        reopenedImplementationTargetDetail.sourceReadinessPassed,
        "frontend reopened implementation target detail should preserve readiness-passed continuity",
      );
      invariant(
        reopenedImplementationTargetDetail.sourceRuntimeHandoffRequired === false,
        "frontend reopened implementation target detail should preserve Runtime handoff continuity",
      );
      invariant(
        reopenedImplementationTargetDetail.sourceArtifactPath.length > 0,
        "frontend reopened implementation target detail should preserve the source artifact path",
      );
      expectEqual(
        reopenedImplementationTargetDetail.sourceSelfImprovementVerificationMethod,
        "structural_inspection",
        "frontend reopened implementation target detail should preserve self-improvement verification method continuity",
      );

      const reopenedImplementationResultDetail = readDirectiveFrontendArchitectureImplementationResultDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.implementationResult,
      });
      expectOk(
        reopenedImplementationResultDetail,
        "frontend must be able to read the reopened implementation result detail",
      );
      expectEqual(
        reopenedImplementationResultDetail.retainedRelativePath,
        report.reopened.retained,
        "frontend reopened implementation result detail should link to retention",
      );
      invariant(
        reopenedImplementationResultDetail.selectedBoundedSlice.length > 0,
        "frontend reopened implementation result detail should preserve the tactical slice",
      );
      invariant(
        reopenedImplementationResultDetail.mechanicalSuccessCriteria.length > 0,
        "frontend reopened implementation result detail should preserve mechanical success criteria",
      );
      invariant(
        reopenedImplementationResultDetail.explicitLimitations.length > 0,
        "frontend reopened implementation result detail should preserve explicit limitations",
      );
      expectEqual(
        reopenedImplementationResultDetail.sourceAdoptionVerdict,
        "adopt",
        "frontend reopened implementation result detail should preserve the source adoption verdict",
      );
      invariant(
        reopenedImplementationResultDetail.sourceReadinessPassed,
        "frontend reopened implementation result detail should preserve readiness-passed continuity",
      );
      invariant(
        reopenedImplementationResultDetail.sourceRuntimeHandoffRequired === false,
        "frontend reopened implementation result detail should preserve Runtime handoff continuity",
      );
      invariant(
        reopenedImplementationResultDetail.sourceArtifactPath.length > 0,
        "frontend reopened implementation result detail should preserve the source artifact path",
      );
      expectEqual(
        reopenedImplementationResultDetail.sourceSelfImprovementVerificationMethod,
        "structural_inspection",
        "frontend reopened implementation result detail should preserve self-improvement verification method continuity",
      );

      const reopenedRetentionDetail = readDirectiveFrontendArchitectureRetentionDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.retained,
      });
      expectOk(reopenedRetentionDetail, "frontend must be able to read the reopened retained detail");
      expectEqual(
        reopenedRetentionDetail.integrationRecordRelativePath,
        report.reopened.integration,
        "frontend reopened retained detail should link to the integration record",
      );

      const reopenedIntegrationDetail = readDirectiveFrontendArchitectureIntegrationRecordDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.integration,
      });
      expectOk(reopenedIntegrationDetail, "frontend must be able to read the reopened integration detail");
      expectEqual(
        reopenedIntegrationDetail.consumptionRelativePath,
        report.reopened.consumption,
        "frontend reopened integration detail should link to the consumption record",
      );

      const reopenedConsumptionDetail = readDirectiveFrontendArchitectureConsumptionRecordDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.consumption,
      });
      expectOk(reopenedConsumptionDetail, "frontend must be able to read the reopened consumption detail");
      expectEqual(
        reopenedConsumptionDetail.evaluationRelativePath,
        report.reopened.evaluation,
        "frontend reopened consumption detail should link to the post-consumption evaluation",
      );

      const keepEvaluationDetail = readDirectiveFrontendArchitecturePostConsumptionEvaluationDetail({
        directiveRoot: tempRoot,
        relativePath: report.reopened.evaluation,
      });
      expectOk(keepEvaluationDetail, "frontend must be able to read the reopened keep evaluation detail");
      invariant(
        keepEvaluationDetail.reopenedStartRelativePath === null,
        "frontend keep evaluation detail must not expose a reopened start",
      );

      report.standalone.normalContinuationShownOnlyForExperimental = true;
      report.standalone.normalAdoptionShown = true;
      report.standalone.reopenEvaluationHasReopenStart = true;
      report.standalone.keepEvaluationHasNoReopenStart = true;
      report.standalone.reopenedPositiveResultHasAdoption = true;
      report.standalone.reopenedDownstreamLinksResolve = true;
    });

    const normalResultArtifact = readDirectiveArchitectureBoundedResultArtifact({
      directiveRoot: tempRoot,
      resultPath: report.normal.boundedResult,
    });
    const reopenedStartArtifact = readDirectiveArchitectureBoundedStartArtifact({
      directiveRoot: tempRoot,
      startPath: REOPENED_BOUNDED_START,
    });
    expectIncludes(
      normalResultArtifact.startRelativePath,
      "architecture/01-experiments/",
      "normal bounded result should stay linked to the normal Architecture experiment space",
    );
    expectIncludes(
      reopenedStartArtifact.startRelativePath,
      "architecture/01-experiments/",
      "reopened start should stay linked to the Architecture experiment space",
    );

    console.log(JSON.stringify({ ok: true, report }, null, 2));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

const entryHref = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;

if (entryHref === import.meta.url) {
  runDirectiveArchitectureCompositionCheck();
}

