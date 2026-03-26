import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTINUATION_ROOT = path.join(DIRECTIVE_ROOT, "knowledge", "continuation");

const CANONICAL_EXAMPLES = {
  discoveryArchitectureRoute:
    "discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md",
  discoveryRuntimeRoute:
    "discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md",
  architectureKeepEvaluation:
    "architecture/09-post-consumption-evaluations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-evaluation.md",
  architectureBoundedResult:
    "architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md",
  runtimeFollowUp:
    "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md",
  runtimeProof:
    "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md",
  runtimeRuntimeCapabilityBoundary:
    "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md",
} as const;

function writeUtf8(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function focused(relativePath: string) {
  const report = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: relativePath,
  });

  if (!report.focus) {
    throw new Error(`missing focus for continuation example: ${relativePath}`);
  }

  return report.focus;
}

function buildMachineReadablePack() {
  const overview = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
  });

  return {
    generatedAt: new Date().toISOString(),
    directiveRoot: DIRECTIVE_ROOT.replace(/\\/g, "/"),
    canonicalTruth: {
      readFirst: [
        "workspace/CLAUDE.md",
        "workspace/directive-workspace/CLAUDE.md",
        "workspace/directive-workspace/knowledge/continuation/READ_THIS_FIRST.md",
      ],
      runFirst: [
        "npm run check",
        "npm run report:directive-workspace-state",
      ],
      resolverModule: "shared/lib/dw-state.ts",
      checkerCommand: "npm run check",
      checkerScript: "scripts/check-directive-workspace-composition.ts",
      reportCommand: "npm run report:directive-workspace-state",
      reportScript: "scripts/report-directive-workspace-state.ts",
      continuationPackCommand: "npm run report:directive-workspace-continuation-pack",
    },
    interpretation: {
      artifactStage: overview.product.fieldInterpretation.artifactStage,
      currentStage: overview.product.fieldInterpretation.currentStage,
      currentHead: overview.product.fieldInterpretation.currentHead,
      artifactNextLegalStep: overview.product.fieldInterpretation.artifactNextLegalStep,
      nextLegalStep: overview.product.fieldInterpretation.nextLegalStep,
      routeTarget: overview.product.fieldInterpretation.routeTarget,
    },
    proven: overview.product.proven,
    partiallyBuilt: overview.product.partiallyBuilt,
    intentionallyMinimal: overview.product.intentionallyMinimal,
    notBuilt: overview.product.notBuilt,
    forbiddenScopeExpansion: overview.product.forbiddenScopeExpansion,
    legalNextSeams: overview.product.legalNextSeams,
    canonicalExamples: Object.fromEntries(
      Object.entries(CANONICAL_EXAMPLES).map(([key, relativePath]) => [
        key,
        {
          artifactPath: relativePath,
          focus: focused(relativePath),
        },
      ]),
    ),
    overview,
  };
}

function renderReadThisFirst(pack: ReturnType<typeof buildMachineReadablePack>) {
  return `# Read This First

1. Read \`workspace/CLAUDE.md\`.
2. Read \`workspace/directive-workspace/CLAUDE.md\`.
3. Run \`npm run check\` from \`workspace/directive-workspace\`.
4. Run \`npm run report:directive-workspace-state\`.
5. Treat [dw-state.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/shared/lib/dw-state.ts) as the canonical read surface.

How to read focused state:
- \`artifactStage\` / \`artifactNextLegalStep\`: the inspected artifact's own boundary.
- \`currentStage\` / \`nextLegalStep\`: the latest reachable case state from linked artifacts.
- \`currentHead.artifactPath\` / \`currentHead.artifactStage\`: the current live artifact to continue from; this is a derived read pointer, not queue-owned workflow state.
- \`routeTarget\`: the original Discovery route when available, not a claim about the current artifact lane.

Do not:
- add workflow advancement from this note
- imply runtime execution, host integration, callable implementation, or promotion automation
- rebuild state through lane-local readers when the shared resolver already answers it

Current canonical examples:
- Discovery -> Architecture route: \`${CANONICAL_EXAMPLES.discoveryArchitectureRoute}\`
- Discovery -> Runtime route: \`${CANONICAL_EXAMPLES.discoveryRuntimeRoute}\`
- Architecture keep/reopen truth: \`${CANONICAL_EXAMPLES.architectureKeepEvaluation}\`
- Runtime v0 proof truth: \`${CANONICAL_EXAMPLES.runtimeProof}\`
- Runtime runtime capability boundary truth: \`${CANONICAL_EXAMPLES.runtimeRuntimeCapabilityBoundary}\`
`;
}

function renderGuide(pack: ReturnType<typeof buildMachineReadablePack>) {
  const examples = pack.canonicalExamples;

  return `# Directive Workspace Continuation Guide

## What to read first

1. \`workspace/CLAUDE.md\`
2. \`workspace/directive-workspace/CLAUDE.md\`
3. [READ_THIS_FIRST.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/continuation/READ_THIS_FIRST.md)

## What to run first

1. \`npm run check\`
2. \`npm run report:directive-workspace-state\`
3. \`npm run report:directive-workspace-continuation-pack\` if you need to refresh this pack

Focused example commands:

\`\`\`bash
npm run report:directive-workspace-state -- ${CANONICAL_EXAMPLES.discoveryRuntimeRoute}
npm run report:directive-workspace-state -- ${CANONICAL_EXAMPLES.architectureBoundedResult}
\`\`\`

## Canonical truth

- Resolver: [dw-state.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/shared/lib/dw-state.ts)
- Whole-product checker: [check-directive-workspace-composition.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/scripts/check-directive-workspace-composition.ts)
- Current-state report: [report-directive-workspace-state.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/scripts/report-directive-workspace-state.ts)

## How to interpret focused reads

- \`artifactStage\` / \`artifactNextLegalStep\`
  - what the inspected artifact itself represents
  - use this for local boundary truth
- \`currentStage\` / \`nextLegalStep\`
  - the latest reachable case state from linked artifacts
  - use this for full-case truth
- \`currentHead.artifactPath\` / \`currentHead.artifactStage\`
  - the current live artifact and its artifact-local stage
  - use this when you need the practical continuation point for the case
- \`routeTarget\`
  - the original Discovery route when available
  - do not mistake it for the current artifact lane on later Runtime or Architecture artifacts

Do not collapse those pairs into one meaning.

## Proven

${pack.proven.map((entry) => `- ${entry}`).join("\n")}

## Partially built

${pack.partiallyBuilt.map((entry) => `- ${entry}`).join("\n")}

## Intentionally minimal

${pack.intentionallyMinimal.map((entry) => `- ${entry}`).join("\n")}

## Not built

${pack.notBuilt.map((entry) => `- ${entry}`).join("\n")}

## Forbidden scope expansion

${pack.forbiddenScopeExpansion.map((entry) => `- ${entry}`).join("\n")}

## Canonical examples

- Discovery -> Architecture route
  - artifact: \`${examples.discoveryArchitectureRoute.artifactPath}\`
  - artifact stage: \`${examples.discoveryArchitectureRoute.focus.artifactStage}\`
  - current stage: \`${examples.discoveryArchitectureRoute.focus.currentStage}\`
- Discovery -> Runtime route
  - artifact: \`${examples.discoveryRuntimeRoute.artifactPath}\`
  - artifact stage: \`${examples.discoveryRuntimeRoute.focus.artifactStage}\`
  - current stage: \`${examples.discoveryRuntimeRoute.focus.currentStage}\`
- Architecture bounded result vs case state
  - artifact: \`${examples.architectureBoundedResult.artifactPath}\`
  - artifact stage: \`${examples.architectureBoundedResult.focus.artifactStage}\`
  - current stage: \`${examples.architectureBoundedResult.focus.currentStage}\`
- Runtime follow-up vs case state
  - artifact: \`${examples.runtimeFollowUp.artifactPath}\`
  - artifact stage: \`${examples.runtimeFollowUp.focus.artifactStage}\`
  - current stage: \`${examples.runtimeFollowUp.focus.currentStage}\`
- Runtime runtime capability boundary
  - artifact: \`${examples.runtimeRuntimeCapabilityBoundary.artifactPath}\`
  - artifact stage: \`${examples.runtimeRuntimeCapabilityBoundary.focus.artifactStage}\`
  - current stage: \`${examples.runtimeRuntimeCapabilityBoundary.focus.currentStage}\`

## Current legal next seams

### Discovery

${pack.legalNextSeams.discovery.map((entry) => `- ${entry}`).join("\n")}

### Runtime

${pack.legalNextSeams.runtime.map((entry) => `- ${entry}`).join("\n")}

### Architecture

${pack.legalNextSeams.architecture.map((entry) => `- ${entry}`).join("\n")}

### Shared Engine / Whole Product

${pack.legalNextSeams.sharedEngineWholeProduct.map((entry) => `- ${entry}`).join("\n")}

## If you are working in a specific lane

- Runtime
  - start from \`${CANONICAL_EXAMPLES.discoveryRuntimeRoute}\`
  - then inspect \`${CANONICAL_EXAMPLES.runtimeFollowUp}\`, \`${CANONICAL_EXAMPLES.runtimeProof}\`, and \`${CANONICAL_EXAMPLES.runtimeRuntimeCapabilityBoundary}\`
- Architecture
  - start from \`${CANONICAL_EXAMPLES.discoveryArchitectureRoute}\`
  - then inspect \`${CANONICAL_EXAMPLES.architectureBoundedResult}\` and \`${CANONICAL_EXAMPLES.architectureKeepEvaluation}\`
- Discovery
  - start from the routing records and queue-linked Engine runs
  - do not duplicate usefulness/routing reasoning outside Engine
- Shared Engine / Product truth
  - start from the overview report and the whole-product checker
  - prefer truth hardening over workflow expansion
`;
}

function main() {
  const pack = buildMachineReadablePack();

  writeUtf8(
    path.join(CONTINUATION_ROOT, "directive-workspace-current-state.continuation.json"),
    `${JSON.stringify(pack, null, 2)}\n`,
  );
  writeUtf8(
    path.join(CONTINUATION_ROOT, "DIRECTIVE_WORKSPACE_CONTINUATION_GUIDE.md"),
    renderGuide(pack),
  );
  writeUtf8(
    path.join(CONTINUATION_ROOT, "READ_THIS_FIRST.md"),
    renderReadThisFirst(pack),
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        outputRoot: CONTINUATION_ROOT.replace(/\\/g, "/"),
        files: [
          "knowledge/continuation/directive-workspace-current-state.continuation.json",
          "knowledge/continuation/DIRECTIVE_WORKSPACE_CONTINUATION_GUIDE.md",
          "knowledge/continuation/READ_THIS_FIRST.md",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

main();
