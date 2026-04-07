import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  runDirectiveAutonomousLaneLoopSupervised,
} from "../engine/coordination/autonomous-lane-loop.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";
import {
  copyRelativeFiles,
  writeJson,
} from "./checker-test-helpers.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const RUNTIME_PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md";

const RUNTIME_COPY_PATHS = [
  "runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md",
  "runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md",
  "runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md",
  "runtime/00-follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md",
  "runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts",
  "discovery/03-routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md",
  "shared/contracts/runtime-to-host.md",
];

const ARCHITECTURE_IMPLEMENTATION_TARGET_SOURCE_PATH =
  "architecture/04-materialization/04-implementation-targets/2026-03-25-dw-pressure-papercoder-2026-03-25-implementation-target.md";

const ARCHITECTURE_IMPLEMENTATION_TARGET_PATH =
  "architecture/04-materialization/04-implementation-targets/2026-03-25-dw-pressure-papercoder-2026-03-25-implementation-target.md";

const ARCHITECTURE_BOUNDED_START_PATH =
  "architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-start.md";

const ARCHITECTURE_BOUNDED_RESULT_PATH =
  "architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result.md";

const ARCHITECTURE_ADOPTED_PATH =
  "architecture/02-adopted/2026-03-25-dw-pressure-papercoder-2026-03-25-adopted.md";

const ARCHITECTURE_ADOPTED_PLANNED_NEXT_PATH =
  "architecture/02-adopted/2026-03-25-dw-pressure-papercoder-2026-03-25-adopted-planned-next.md";

const ARCHITECTURE_COPY_PATHS = [
  "architecture/02-adopted/2026-03-25-dw-pressure-papercoder-2026-03-25-adopted.md",
  "architecture/02-adopted/2026-03-25-dw-pressure-papercoder-2026-03-25-adoption-decision.json",
  "architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result.md",
  "architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result-adoption-decision.json",
  "architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-start.md",
  "architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-engine-handoff.md",
  "runtime/standalone-host/engine-runs/2026-03-25T07-17-04-948Z-dw-pressure-papercoder-2026-03-25-5a070db4.json",
  "runtime/standalone-host/engine-runs/2026-03-25T07-17-04-948Z-dw-pressure-papercoder-2026-03-25-5a070db4.md",
  "discovery/03-routing-log/2026-03-25-dw-pressure-papercoder-2026-03-25-routing-record.md",
];

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function removeIfExists(root: string, relativePath: string) {
  const absolutePath = path.join(root, relativePath);
  if (fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { force: true });
  }
}

function seedBaseDirectiveRoot(directiveRoot: string) {
  writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), {
    status: "primary",
    updatedAt: "2026-04-06T00:00:00.000Z",
    policy: {},
    entries: [],
  });
  writeJson(path.join(directiveRoot, "discovery", "capability-gaps.json"), { gaps: [] });
  writeText(
    path.join(directiveRoot, "knowledge", "active-mission.md"),
    "# Active Mission\n\nImprove Directive Workspace as a working source-adaptation system.\n",
  );
  writeJson(path.join(directiveRoot, "control", "state", "autonomous-lane-loop-policy.json"), {
    enabled: true,
    approvedBy: "autonomous-loop-checker",
    maxActionsPerRun: 12,
    discovery: {
      autoOpenRoute: true,
      requireNoHumanReview: true,
      minimumConfidence: "high",
    },
    architecture: {
      autoStartFromHandoff: true,
      autoCloseBoundedStart: true,
      autoAdoptBoundedResult: true,
      autoCreateImplementationTargetForPlannedNext: true,
      autoCompleteMaterializationChain: true,
    },
    runtime: {
      autoAdvanceToPromotionReadiness: true,
      autoGeneratePromotionSpecification: true,
      autoCreatePromotionRecord: true,
      requireNoHumanReview: true,
    },
  });
}

function stripExistingPromotionRecordFromReadiness(directiveRoot: string) {
  const readinessPath = path.join(directiveRoot, RUNTIME_PROMOTION_READINESS_PATH);
  const original = fs.readFileSync(readinessPath, "utf8");
  const withoutManualPromotionSection = original.replace(
    /\r?\n## bounded manual promotion chain[\s\S]*?(?=\r?\n## |\s*$)/u,
    "\n",
  );
  const cleaned = withoutManualPromotionSection.replace(
    /^- Host-facing promotion record: `[^`]+`\r?\n/mu,
    "",
  );
  fs.writeFileSync(readinessPath, cleaned, "utf8");
}

async function main() {
  await withTempDirectiveRoot(
    {
      prefix: "directive-autonomous-loop-",
    },
    async (directiveRoot) => {
      const originalFetch = globalThis.fetch;
      seedBaseDirectiveRoot(directiveRoot);

      try {
        globalThis.fetch = async (input) => {
          const url = String(input);
          if (url.startsWith("https://api.openalex.org/works?")) {
            return new Response(
              JSON.stringify({
                meta: { count: 1 },
                results: [
                  {
                    id: "https://openalex.org/W0000000001",
                    doi: "https://doi.org/10.1000/autonomous-loop-proof",
                    title: "Autonomous Lane Loop Scientify Host Consumption Proof",
                    publication_year: 2026,
                    publication_date: "2026-04-06",
                    type: "article",
                    cited_by_count: 2,
                    authorships: [{ author: { display_name: "Directive Workspace" } }],
                    primary_location: {
                      source: { display_name: "Autonomous Loop Test Journal" },
                    },
                    open_access: {
                      is_oa: true,
                      oa_url: "https://example.com/autonomous-loop-proof.pdf",
                    },
                  },
                ],
              }),
              {
                status: 200,
                headers: { "content-type": "application/json" },
              },
            );
          }

          throw new Error(`Unexpected fetch URL in autonomous loop checker: ${url}`);
        };

        copyRelativeFiles(RUNTIME_COPY_PATHS, DIRECTIVE_ROOT, directiveRoot);
        copyRelativeFiles(ARCHITECTURE_COPY_PATHS, DIRECTIVE_ROOT, directiveRoot);
        copyRelativeFiles(
          [RUNTIME_PROMOTION_READINESS_PATH, ARCHITECTURE_IMPLEMENTATION_TARGET_SOURCE_PATH],
          DIRECTIVE_ROOT,
          directiveRoot,
        );
        stripExistingPromotionRecordFromReadiness(directiveRoot);
        removeIfExists(directiveRoot, ARCHITECTURE_BOUNDED_RESULT_PATH);
        removeIfExists(directiveRoot, ARCHITECTURE_ADOPTED_PATH);
        removeIfExists(directiveRoot, ARCHITECTURE_ADOPTED_PLANNED_NEXT_PATH);

        const runtimeSupervised = await runDirectiveAutonomousLaneLoopSupervised({
          directiveRoot,
          artifactPath: RUNTIME_PROMOTION_READINESS_PATH,
        });
        assert.equal(runtimeSupervised.finalDisposition, "stopped");
        assert.deepEqual(
          runtimeSupervised.phaseReports.map((report) => report.actionKind),
          [
            "runtime_promotion_specification_write",
            "runtime_promotion_record_write",
          ],
        );
        assert.ok(
          runtimeSupervised.phaseReports.every((report) => report.nextLegalStep),
          "supervised loop should emit a nextLegalStep after each phase",
        );

        const runtimeFocus = resolveDirectiveWorkspaceState({
          directiveRoot,
          artifactPath: runtimeSupervised.finalFocusPath!,
          includeAnchors: false,
        }).focus;
        assert.equal(runtimeFocus?.currentStage, "runtime.promotion_record.opened");
        assert.equal(
          runtimeFocus?.nextLegalStep,
          "No automatic Runtime step is open; registry acceptance, host integration, and promotion automation remain intentionally unopened while callable execution is already proven.",
        );

        const runtimeSpecificationPath =
          "runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json";
        assert.ok(
          fs.existsSync(path.join(directiveRoot, runtimeSpecificationPath)),
          "runtime autonomous loop should generate the promotion specification",
        );

        const architectureFromStartSupervised = await runDirectiveAutonomousLaneLoopSupervised({
          directiveRoot,
          artifactPath: ARCHITECTURE_BOUNDED_START_PATH,
        });
        assert.equal(architectureFromStartSupervised.finalDisposition, "stopped");
        assert.deepEqual(
          architectureFromStartSupervised.phaseReports.map((report) => report.actionKind),
          [
            "architecture_bounded_closeout",
            "architecture_result_adoption",
            "architecture_implementation_target_create",
            "architecture_implementation_result_create",
            "architecture_retention_confirm",
            "architecture_integration_record_create",
            "architecture_consumption_record",
            "architecture_post_consumption_evaluation",
          ],
        );
        assert.ok(
          fs.existsSync(path.join(directiveRoot, ARCHITECTURE_BOUNDED_RESULT_PATH)),
          "architecture autonomous loop should generate the bounded result from the bounded start",
        );
        assert.ok(
          fs.existsSync(path.join(directiveRoot, ARCHITECTURE_ADOPTED_PLANNED_NEXT_PATH)),
          "architecture autonomous loop should generate the planned-next adoption artifact from the bounded result",
        );

        const architectureFocus = resolveDirectiveWorkspaceState({
          directiveRoot,
          artifactPath: architectureFromStartSupervised.finalFocusPath!,
          includeAnchors: false,
        }).focus;
        assert.equal(
          architectureFocus?.currentStage,
          "architecture.post_consumption_evaluation.keep",
        );

        process.stdout.write(
          `${JSON.stringify(
            {
              ok: true,
              runtime: {
                finalCurrentStage: runtimeSupervised.finalCurrentStage,
                actionKinds: runtimeSupervised.actions.map((action) => action.actionKind),
                finalFocusPath: runtimeSupervised.finalFocusPath,
                finalDisposition: runtimeSupervised.finalDisposition,
              },
              architecture: {
                finalCurrentStage: architectureFromStartSupervised.finalCurrentStage,
                actionKinds: architectureFromStartSupervised.actions.map((action) => action.actionKind),
                finalFocusPath: architectureFromStartSupervised.finalFocusPath,
                finalDisposition: architectureFromStartSupervised.finalDisposition,
              },
            },
            null,
            2,
          )}\n`,
        );
      } finally {
        globalThis.fetch = originalFetch;
      }
    },
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});
