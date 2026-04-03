import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDirectiveRuntimePromotionSpecification,
  DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
  parseDirectiveRuntimePromotionReadinessFields,
  readDirectiveRuntimePromotionSpecification,
  resolveDirectiveRuntimePromotionSpecificationPath,
  type DirectiveRuntimePromotionSpecification,
} from "../shared/lib/runtime-promotion-specification.ts";

/**
 * Non-executing promotion specification checker.
 *
 * Reads all promotion-readiness artifacts, validates completeness against
 * the promotion contract, computes blockers, and verifies that the generated
 * promotion-specification JSON artifacts match current repo truth.
 *
 * This does NOT execute, automate, or trigger promotion.
 */

const DIRECTIVE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const PROMOTION_READINESS_DIR = path.join(
  DIRECTIVE_ROOT,
  "runtime",
  "05-promotion-readiness",
);

type PromotionSpecificationCheck = {
  candidateId: string;
  candidateName: string;
  artifactPath: string;
  generatedSpecificationPath: string;
  generatedSpecificationPresent: boolean;
  generatedSpecificationMatches: boolean;
  fields: ReturnType<typeof parseDirectiveRuntimePromotionReadinessFields>;
  linkedArtifactsPresent: string[];
  linkedArtifactsMissing: string[];
  blockers: string[];
  contractCompleteness: {
    hasCandidate: boolean;
    hasCapabilityBoundary: boolean;
    hasProof: boolean;
    hasRecord: boolean;
    hasHost: boolean;
    hasRuntimeSurface: boolean;
    hasExecutionState: boolean;
    hasCompileContract: boolean;
    complete: boolean;
    missingFields: string[];
  };
};

type PromotionSpecificationResult = {
  ok: boolean;
  checkerId: string;
  failureContractVersion: string;
  snapshotAt: string;
  totalPromotionReadinessArtifacts: number;
  specifications: PromotionSpecificationCheck[];
  summary: {
    complete: number;
    incomplete: number;
    blockedByHost: number;
    blockedByImplementation: number;
    blockedByPromotion: number;
    generatedSpecMismatches: number;
  };
  violations: string[];
};

function checkLinkedArtifact(
  relativePath: string | null,
): { present: boolean; path: string } | null {
  if (!relativePath) {
    return null;
  }
  const absolutePath = path.join(DIRECTIVE_ROOT, relativePath);
  return {
    present: fs.existsSync(absolutePath),
    path: relativePath,
  };
}

function isSpecificationEqual(
  actual: DirectiveRuntimePromotionSpecification,
  expected: DirectiveRuntimePromotionSpecification,
) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function buildCheck(relativePath: string): PromotionSpecificationCheck {
  const fields = parseDirectiveRuntimePromotionReadinessFields({
    directiveRoot: DIRECTIVE_ROOT,
    promotionReadinessPath: relativePath,
  });
  const specificationPath = resolveDirectiveRuntimePromotionSpecificationPath({
    promotionReadinessPath: relativePath,
  });
  const specificationAbsolutePath = path.join(DIRECTIVE_ROOT, specificationPath);
  const specificationPresent = fs.existsSync(specificationAbsolutePath);

  const linkedChecks = [
    { label: "capability-boundary", result: checkLinkedArtifact(fields.linkedArtifacts.capabilityBoundaryPath) },
    { label: "runtime-proof", result: checkLinkedArtifact(fields.linkedArtifacts.runtimeProofPath) },
    { label: "runtime-record", result: checkLinkedArtifact(fields.linkedArtifacts.runtimeRecordPath) },
    { label: "follow-up", result: checkLinkedArtifact(fields.linkedArtifacts.followUpPath) },
    { label: "routing", result: checkLinkedArtifact(fields.linkedArtifacts.routingPath) },
    { label: "callable-stub", result: checkLinkedArtifact(fields.linkedArtifacts.callableStubPath) },
    { label: "promotion-record", result: checkLinkedArtifact(fields.linkedArtifacts.promotionRecordPath) },
    { label: "compile-contract", result: checkLinkedArtifact(DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH) },
    { label: "promotion-specification", result: checkLinkedArtifact(specificationPath) },
  ];

  const linkedArtifactsPresent: string[] = [];
  const linkedArtifactsMissing: string[] = [];
  for (const check of linkedChecks) {
    if (!check.result) {
      continue;
    }
    if (check.result.present) {
      linkedArtifactsPresent.push(`${check.label}: ${check.result.path}`);
    } else {
      linkedArtifactsMissing.push(`${check.label}: ${check.result.path}`);
    }
  }

  const blockers: string[] = [];
  if (fields.proposedHost === "pending_host_selection") {
    blockers.push("proposed_host_pending_selection");
  }
  if (fields.executionState?.includes("not implemented")) {
    blockers.push("runtime_implementation_unopened");
  }
  if (
    fields.executionState?.includes("not promoted")
    && !fields.linkedArtifacts.promotionRecordPath
  ) {
    blockers.push("host_facing_promotion_unopened");
  }
  if (linkedArtifactsMissing.length > 0) {
    blockers.push("linked_artifacts_missing");
  }
  if (
    fields.candidateId === "dw-source-scientify-research-workflow-plugin-2026-03-27"
    && !fields.linkedArtifacts.callableStubPath
  ) {
    blockers.push("callable_stub_unopened");
    linkedArtifactsMissing.push("callable-stub: runtime/01-callable-integrations/*.ts");
  }

  let generatedSpecificationMatches = false;
  if (specificationPresent) {
    const actual = readDirectiveRuntimePromotionSpecification({
      directiveRoot: DIRECTIVE_ROOT,
      promotionSpecificationPath: specificationPath,
    });
    const expected = buildDirectiveRuntimePromotionSpecification({
      directiveRoot: DIRECTIVE_ROOT,
      promotionReadinessPath: relativePath,
      generatedAt: actual.generatedAt,
    });
    generatedSpecificationMatches = isSpecificationEqual(actual, expected);
  }

  const missingFields: string[] = [];
  if (!fields.candidateId) missingFields.push("candidateId");
  if (!fields.linkedArtifacts.capabilityBoundaryPath) missingFields.push("capabilityBoundaryPath");
  if (!fields.linkedArtifacts.runtimeProofPath) missingFields.push("runtimeProofPath");
  if (!fields.linkedArtifacts.runtimeRecordPath) missingFields.push("runtimeRecordPath");
  if (!fields.proposedHost) missingFields.push("proposedHost");
  if (!fields.integrationMode) missingFields.push("integrationMode");
  if (!fields.executionState) missingFields.push("executionState");
  if (!fs.existsSync(path.join(DIRECTIVE_ROOT, DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH))) {
    missingFields.push("compileContractArtifact");
  }

  return {
    candidateId: fields.candidateId,
    candidateName: fields.candidateName,
    artifactPath: relativePath,
    generatedSpecificationPath: specificationPath,
    generatedSpecificationPresent: specificationPresent,
    generatedSpecificationMatches,
    fields,
    linkedArtifactsPresent,
    linkedArtifactsMissing,
    blockers,
    contractCompleteness: {
      hasCandidate: Boolean(fields.candidateId),
      hasCapabilityBoundary: Boolean(fields.linkedArtifacts.capabilityBoundaryPath),
      hasProof: Boolean(fields.linkedArtifacts.runtimeProofPath),
      hasRecord: Boolean(fields.linkedArtifacts.runtimeRecordPath),
      hasHost: Boolean(fields.proposedHost),
      hasRuntimeSurface: Boolean(fields.integrationMode),
      hasExecutionState: Boolean(fields.executionState),
      hasCompileContract: fs.existsSync(
        path.join(DIRECTIVE_ROOT, DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH),
      ),
      complete: missingFields.length === 0,
      missingFields,
    },
  };
}

function main() {
  const violations: string[] = [];
  const specifications: PromotionSpecificationCheck[] = [];

  if (!fs.existsSync(PROMOTION_READINESS_DIR)) {
    const result: PromotionSpecificationResult = {
      ok: true,
      checkerId: "runtime-promotion-specification",
      failureContractVersion: "v2",
      snapshotAt: new Date().toISOString(),
      totalPromotionReadinessArtifacts: 0,
      specifications: [],
      summary: {
        complete: 0,
        incomplete: 0,
        blockedByHost: 0,
        blockedByImplementation: 0,
        blockedByPromotion: 0,
        generatedSpecMismatches: 0,
      },
      violations: [],
    };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const files = fs
    .readdirSync(PROMOTION_READINESS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const file of files) {
    const relativePath = `runtime/05-promotion-readiness/${file.name}`;
    try {
      const specification = buildCheck(relativePath);
      specifications.push(specification);

      if (specification.linkedArtifactsMissing.length > 0) {
        violations.push(
          `${specification.candidateId}: missing linked artifacts: ${specification.linkedArtifactsMissing.join(", ")}`,
        );
      }
      if (!specification.generatedSpecificationPresent) {
        violations.push(
          `${specification.candidateId}: missing generated promotion specification: ${specification.generatedSpecificationPath}`,
        );
      } else if (!specification.generatedSpecificationMatches) {
        violations.push(
          `${specification.candidateId}: generated promotion specification does not match current promotion-readiness truth`,
        );
      }
    } catch (error) {
      violations.push(
        `${file.name}: parse error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const result: PromotionSpecificationResult = {
    ok: violations.length === 0,
    checkerId: "runtime-promotion-specification",
    failureContractVersion: "v2",
    snapshotAt: new Date().toISOString(),
    totalPromotionReadinessArtifacts: specifications.length,
    specifications,
    summary: {
      complete: specifications.filter((item) => item.contractCompleteness.complete).length,
      incomplete: specifications.filter((item) => !item.contractCompleteness.complete).length,
      blockedByHost: specifications.filter((item) =>
        item.blockers.includes("proposed_host_pending_selection")
      ).length,
      blockedByImplementation: specifications.filter((item) =>
        item.blockers.includes("runtime_implementation_unopened")
      ).length,
      blockedByPromotion: specifications.filter((item) =>
        item.blockers.includes("host_facing_promotion_unopened")
      ).length,
      generatedSpecMismatches: specifications.filter((item) =>
        !item.generatedSpecificationPresent || !item.generatedSpecificationMatches
      ).length,
    },
    violations,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.ok) {
    process.exit(1);
  }
}

main();
