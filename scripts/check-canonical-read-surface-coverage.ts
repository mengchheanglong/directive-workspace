import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { DiscoveryIntakeQueueEntry } from "../discovery/lib/discovery-intake-queue-writer.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CHECKER_ID = "canonical_read_surface_coverage" as const;
const FAILURE_CONTRACT_VERSION = 1 as const;

type ViolationCode =
  | "resolution_error"
  | "null_focus"
  | "broken_integrity"
  | "route_target_mismatch"
  | "candidate_id_mismatch";

type Violation = {
  code: ViolationCode;
  candidateId: string;
  routingRecordPath: string;
  message: string;
  expected?: string;
  actual?: string;
};

type ResolvedEntry = {
  candidateId: string;
  routingRecordPath: string;
  routeTarget: string;
  resolvedRouteTarget: string | null;
  currentStage: string;
  integrityState: string;
};

type SuccessResult = {
  ok: true;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  checked: {
    totalQueueEntries: number;
    resolvedOk: number;
    exemptNoRoutingRecord: number;
    entries: ResolvedEntry[];
  };
};

type FailureResult = {
  ok: false;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  summary: string;
  violations: Violation[];
};

export type CanonicalReadSurfaceCoverageResult = SuccessResult | FailureResult;

export function runCanonicalReadSurfaceCoverageCheck(
  directiveRoot: string,
): CanonicalReadSurfaceCoverageResult {
  const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8")) as {
    entries: DiscoveryIntakeQueueEntry[];
  };

  const violations: Violation[] = [];
  const resolvedEntries: ResolvedEntry[] = [];
  let exemptCount = 0;

  for (const entry of queue.entries) {
    if (!entry.routing_record_path) {
      exemptCount++;
      continue;
    }

    const candidateId = entry.candidate_id;
    const routingRecordPath = entry.routing_record_path;

    let focus: ReturnType<typeof resolveDirectiveWorkspaceState>["focus"];
    try {
      const report = resolveDirectiveWorkspaceState({
        directiveRoot,
        artifactPath: routingRecordPath,
        includeAnchors: false,
      });
      focus = report.focus;
    } catch (err) {
      violations.push({
        code: "resolution_error",
        candidateId,
        routingRecordPath,
        message: `Failed to resolve: ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    if (!focus) {
      violations.push({
        code: "null_focus",
        candidateId,
        routingRecordPath,
        message: "Canonical surface returned null focus for routing record",
      });
      continue;
    }

    if (focus.integrityState === "broken") {
      violations.push({
        code: "broken_integrity",
        candidateId,
        routingRecordPath,
        message: `Integrity broken: ${focus.inconsistentLinks.join("; ")}`,
      });
      continue;
    }

    if (
      entry.routing_target
      && entry.routing_target !== "defer"
      && focus.routeTarget
      && focus.routeTarget !== entry.routing_target
    ) {
      violations.push({
        code: "route_target_mismatch",
        candidateId,
        routingRecordPath,
        message: "Resolved routeTarget does not match queue routing_target",
        expected: entry.routing_target,
        actual: focus.routeTarget,
      });
      continue;
    }

    if (focus.candidateId && focus.candidateId !== candidateId) {
      violations.push({
        code: "candidate_id_mismatch",
        candidateId,
        routingRecordPath,
        message: "Resolved candidateId does not match queue candidate_id",
        expected: candidateId,
        actual: focus.candidateId,
      });
      continue;
    }

    resolvedEntries.push({
      candidateId,
      routingRecordPath,
      routeTarget: entry.routing_target ?? "unknown",
      resolvedRouteTarget: focus.routeTarget,
      currentStage: focus.currentStage,
      integrityState: focus.integrityState,
    });
  }

  if (violations.length > 0) {
    const result: FailureResult = {
      ok: false,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      summary: `${violations.length} queue ${violations.length === 1 ? "entry" : "entries"} failed canonical read surface resolution`,
      violations,
    };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = 1;
    return result;
  }

  const result: SuccessResult = {
    ok: true,
    checkerId: CHECKER_ID,
    failureContractVersion: FAILURE_CONTRACT_VERSION,
    checked: {
      totalQueueEntries: queue.entries.length,
      resolvedOk: resolvedEntries.length,
      exemptNoRoutingRecord: exemptCount,
      entries: resolvedEntries,
    },
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

function main() {
  runCanonicalReadSurfaceCoverageCheck(DIRECTIVE_ROOT);
}

main();
