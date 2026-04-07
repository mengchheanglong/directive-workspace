import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { DiscoveryIntakeQueueEntry } from "../discovery/lib/discovery-intake-queue-writer.ts";
import { resolveDirectiveWorkspaceState } from "../engine/state/index.ts";

/**
 * Unified case catalog report.
 *
 * Reads every intake queue entry, resolves each through the canonical read
 * surface where a routing_record_path exists, and produces a unified catalog
 * showing lifecycle stage, lane, and planner coverage for every case.
 */

const DIRECTIVE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

type CaseCatalogEntry = {
  candidateId: string;
  candidateName: string;
  sourceType: string;
  queueStatus: string;
  routingTarget: string | null;
  operatingMode: string | null;
  receivedAt: string;
  routedAt: string | null;
  completedAt: string | null;
  hasCaseFile: boolean;
  hasRoutingRecord: boolean;
  canonicalResolution: {
    resolved: boolean;
    currentStage: string | null;
    artifactStage: string | null;
    integrityState: string | null;
    nextLegalStep: string | null;
  };
  lifecyclePhase: string;
};

type CaseCatalogResult = {
  ok: boolean;
  checkerId: string;
  snapshotAt: string;
  totalEntries: number;
  catalog: CaseCatalogEntry[];
  coverage: {
    withCaseFile: number;
    withRoutingRecord: number;
    withCanonicalResolution: number;
    withoutCanonicalResolution: number;
  };
  lifecycleDistribution: Record<string, number>;
};

function readQueueEntries(): DiscoveryIntakeQueueEntry[] {
  const queuePath = path.join(DIRECTIVE_ROOT, "discovery", "intake-queue.json");
  const data = JSON.parse(fs.readFileSync(queuePath, "utf8")) as {
    entries?: DiscoveryIntakeQueueEntry[];
  };
  return data.entries ?? [];
}

function hasCaseFile(candidateId: string): boolean {
  const casePath = path.join(DIRECTIVE_ROOT, "state", "cases", `${candidateId}.json`);
  return fs.existsSync(casePath);
}

function deriveLifecyclePhase(entry: DiscoveryIntakeQueueEntry, currentStage: string | null): string {
  if (currentStage) {
    if (currentStage.includes("promotion_readiness")) return "promotion_readiness";
    if (currentStage.includes("capability_boundary")) return "capability_boundary";
    if (currentStage.includes("evaluation") || currentStage.includes("consumption")) return "post_integration";
    if (currentStage.includes("retained") || currentStage.includes("integration")) return "integration";
    if (currentStage.includes("bounded_result")) return "bounded_result";
    if (currentStage.includes("bounded_start") || currentStage.includes("handoff")) return "in_progress";
    if (currentStage.includes("monitor")) return "monitoring";
    if (currentStage.includes("follow_up")) return "follow_up";
    return "active";
  }

  if (entry.completed_at) return "completed_no_resolution";
  if (entry.routing_target === "monitor" || entry.routing_target === "defer") return "monitoring";
  if (entry.routing_target === "reject" || entry.routing_target === "reference") return "terminal";
  if (entry.routed_at) return "routed";
  if (entry.status === "pending") return "pending";
  return "unknown";
}

function main() {
  const queueEntries = readQueueEntries();
  const catalog: CaseCatalogEntry[] = [];
  let withCaseFile = 0;
  let withRoutingRecord = 0;
  let withCanonicalResolution = 0;
  let withoutCanonicalResolution = 0;
  const lifecycleDistribution: Record<string, number> = {};

  for (const entry of queueEntries) {
    const candidateId = entry.candidate_id || "unknown";
    const candidateName = entry.candidate_name || candidateId;
    const hasCase = hasCaseFile(candidateId);
    if (hasCase) withCaseFile += 1;

    const hasRouting = Boolean(entry.routing_record_path);
    if (hasRouting) withRoutingRecord += 1;

    let canonicalResolution: CaseCatalogEntry["canonicalResolution"] = {
      resolved: false,
      currentStage: null,
      artifactStage: null,
      integrityState: null,
      nextLegalStep: null,
    };

    if (entry.routing_record_path) {
      try {
        const state = resolveDirectiveWorkspaceState({
          directiveRoot: DIRECTIVE_ROOT,
          artifactPath: entry.routing_record_path,
          includeAnchors: false,
        });
        if (state.focus) {
          canonicalResolution = {
            resolved: true,
            currentStage: state.focus.currentStage,
            artifactStage: state.focus.artifactStage,
            integrityState: state.focus.integrityState,
            nextLegalStep:
              state.focus.nextLegalStep
                ? state.focus.nextLegalStep.length > 120
                  ? `${state.focus.nextLegalStep.slice(0, 117)}...`
                  : state.focus.nextLegalStep
                : null,
          };
          withCanonicalResolution += 1;
        } else {
          withoutCanonicalResolution += 1;
        }
      } catch {
        withoutCanonicalResolution += 1;
      }
    } else {
      withoutCanonicalResolution += 1;
    }

    const lifecyclePhase = deriveLifecyclePhase(entry, canonicalResolution.currentStage);
    lifecycleDistribution[lifecyclePhase] = (lifecycleDistribution[lifecyclePhase] || 0) + 1;

    catalog.push({
      candidateId,
      candidateName,
      sourceType: entry.source_type || "unknown",
      queueStatus: entry.status || "unknown",
      routingTarget: entry.routing_target || null,
      operatingMode: entry.operating_mode || null,
      receivedAt: entry.received_at || "unknown",
      routedAt: entry.routed_at || null,
      completedAt: entry.completed_at || null,
      hasCaseFile: hasCase,
      hasRoutingRecord: hasRouting,
      canonicalResolution,
      lifecyclePhase,
    });
  }

  const result: CaseCatalogResult = {
    ok: true,
    checkerId: "case-catalog",
    snapshotAt: new Date().toISOString(),
    totalEntries: catalog.length,
    catalog,
    coverage: {
      withCaseFile,
      withRoutingRecord,
      withCanonicalResolution,
      withoutCanonicalResolution,
    },
    lifecycleDistribution,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
