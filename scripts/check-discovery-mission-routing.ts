import assert from "node:assert/strict";

import {
  assessDiscoveryMissionRouting,
  type DiscoveryMissionRoutingAssessment,
} from "../discovery/lib/discovery-mission-routing.ts";
import type { DiscoverySubmissionRequest } from "../discovery/lib/discovery-submission-router.ts";

const CHECKER_ID = "discovery_mission_routing" as const;
const FAILURE_CONTRACT_VERSION = 1 as const;

type Success = {
  ok: true;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  runtimeNoGap: Pick<DiscoveryMissionRoutingAssessment, "recommended_track" | "recommended_record_shape" | "confidence" | "needs_human_review">;
  architectureNoGap: Pick<DiscoveryMissionRoutingAssessment, "recommended_track" | "recommended_record_shape" | "confidence" | "needs_human_review">;
  lowConfidenceFallback: Pick<DiscoveryMissionRoutingAssessment, "recommended_track" | "recommended_record_shape" | "confidence" | "needs_human_review">;
  routeConflict: Pick<DiscoveryMissionRoutingAssessment, "recommended_track" | "recommended_record_shape" | "route_conflict" | "needs_human_review">;
  structuredEvidence: {
    lowConfidenceGuidanceKind: string | null;
    architectureNoGapGuidanceKind: string | null;
    routeConflictGuidanceKind: string | null;
  };
};

type Failure = {
  ok: false;
  checkerId: typeof CHECKER_ID;
  failureContractVersion: typeof FAILURE_CONTRACT_VERSION;
  summary: string;
  message: string;
};

type CheckResult = Success | Failure;

function missionMarkdown() {
  return [
    "# Active Mission",
    "",
    "## Current Objective",
    "",
    "Improve the Directive Workspace engine.",
    "",
    "## What Usefulness Means Under This Objective",
    "",
    "- Prefer reusable runtime capability when repeated call value is explicit.",
    "- Prefer Engine workflow and evaluation improvements when the source primarily upgrades Directive Workspace judgment.",
    "",
    "## Capability Lanes That Matter Most",
    "",
    "1. Discovery",
    "2. Runtime",
    "3. Architecture",
  ].join("\n");
}

function runtimeNoGapRequest(): DiscoverySubmissionRequest {
  return {
    candidate_id: "dw-discovery-runtime-no-gap-check",
    candidate_name: "Runtime Workflow Plugin",
    source_type: "github-repo",
    source_reference: "https://example.com/runtime-workflow-plugin",
    mission_alignment: "Turn this into a reusable runtime capability.",
    capability_gap_id: null,
    notes:
      "callable runtime plugin workflow repeated execution reusable tool latency reliability package",
  };
}

function architectureNoGapRequest(): DiscoverySubmissionRequest {
  return {
    candidate_id: "dw-discovery-architecture-no-gap-check",
    candidate_name: "Engine Workflow Boundary Guide",
    source_type: "workflow-writeup",
    source_reference: "https://example.com/engine-workflow-boundary-guide",
    mission_alignment: "Improve Directive Workspace engine workflow judgment.",
    capability_gap_id: null,
    notes:
      "architecture workflow evaluation policy contract schema engine structure operating logic",
  };
}

function conflictingExplicitRouteRequest(): DiscoverySubmissionRequest {
  return {
    candidate_id: "dw-discovery-route-conflict-check",
    candidate_name: "Architecture Evaluation Boundary Notes",
    source_type: "workflow-writeup",
    source_reference: "https://example.com/architecture-evaluation-boundary-notes",
    mission_alignment: "Improve engine evaluation policy and workflow structure.",
    capability_gap_id: null,
    notes:
      "architecture evaluation policy workflow engine structure contract schema",
    fast_path: {
      route_date: "2026-04-05",
      route_destination: "runtime",
      claimed_value: "A reusable runtime pattern",
      first_pass_summary: "Quick route sketch",
      why_this_route: "Explicitly forcing runtime to prove route-conflict review still works.",
      why_not_alternatives: "Test fixture.",
      need_bounded_proof: "Review conflicting route decision.",
      next_artifact: "runtime follow-up if accepted",
    },
  };
}

function lowConfidenceFallbackRequest(): DiscoverySubmissionRequest {
  return {
    candidate_id: "dw-discovery-low-confidence-fallback-check",
    candidate_name: "Unclear helper note",
    source_type: "workflow-writeup",
    source_reference: "https://example.com/unclear-helper-note",
    mission_alignment: "Unclear value.",
    capability_gap_id: null,
    notes: "note",
  };
}

function runCheck(): CheckResult {
  try {
    const activeMissionMarkdown = missionMarkdown();

    const runtimeNoGap = assessDiscoveryMissionRouting({
      request: runtimeNoGapRequest(),
      gaps: [],
      activeMissionMarkdown,
    });
    assert.equal(runtimeNoGap.recommended_track, "runtime");
    assert.equal(runtimeNoGap.confidence, "high");
    assert.equal(runtimeNoGap.recommended_record_shape, "fast_path");
    assert.equal(runtimeNoGap.needs_human_review, false);
    assert.equal(runtimeNoGap.review_guidance, null);
    assert.ok(runtimeNoGap.explanation_breakdown.keyword_signals.length > 0);

    const architectureNoGap = assessDiscoveryMissionRouting({
      request: architectureNoGapRequest(),
      gaps: [],
      activeMissionMarkdown,
    });
    assert.equal(architectureNoGap.recommended_track, "architecture");
    assert.equal(architectureNoGap.confidence, "high");
    assert.equal(architectureNoGap.recommended_record_shape, "split_case");
    assert.equal(architectureNoGap.needs_human_review, false);
    assert.equal(architectureNoGap.review_guidance, null);
    assert.ok(architectureNoGap.ambiguity_summary.score_delta >= 0);

    const lowConfidenceFallback = assessDiscoveryMissionRouting({
      request: lowConfidenceFallbackRequest(),
      gaps: [],
      activeMissionMarkdown,
    });
    assert.equal(lowConfidenceFallback.recommended_track, "discovery");
    assert.equal(lowConfidenceFallback.confidence, "low");
    assert.equal(lowConfidenceFallback.recommended_record_shape, "queue_only");
    assert.equal(lowConfidenceFallback.needs_human_review, true);
    assert.equal(lowConfidenceFallback.review_guidance?.guidance_kind, "low_confidence_discovery_hold");
    assert.ok(lowConfidenceFallback.explanation_breakdown.ambiguity_signals.length > 0);
    assert.match(
      lowConfidenceFallback.rationale.join("\n"),
      /stays in Discovery instead of assigning early architecture ownership/i,
    );

    const routeConflict = assessDiscoveryMissionRouting({
      request: conflictingExplicitRouteRequest(),
      gaps: [],
      activeMissionMarkdown,
    });
    assert.equal(routeConflict.recommended_track, "architecture");
    assert.equal(routeConflict.recommended_record_shape, "split_case");
    assert.equal(routeConflict.route_conflict, true);
    assert.equal(routeConflict.needs_human_review, true);
    assert.equal(routeConflict.review_guidance?.guidance_kind, "conflicted_architecture_review");
    assert.ok(routeConflict.ambiguity_summary.conflicting_signal_families.length > 0);
    assert.match(
      routeConflict.rationale.join("\n"),
      /conflicted Architecture route needs the fuller structural record/i,
    );

    return {
      ok: true,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      runtimeNoGap: {
        recommended_track: runtimeNoGap.recommended_track,
        recommended_record_shape: runtimeNoGap.recommended_record_shape,
        confidence: runtimeNoGap.confidence,
        needs_human_review: runtimeNoGap.needs_human_review,
      },
      architectureNoGap: {
        recommended_track: architectureNoGap.recommended_track,
        recommended_record_shape: architectureNoGap.recommended_record_shape,
        confidence: architectureNoGap.confidence,
        needs_human_review: architectureNoGap.needs_human_review,
      },
      lowConfidenceFallback: {
        recommended_track: lowConfidenceFallback.recommended_track,
        recommended_record_shape: lowConfidenceFallback.recommended_record_shape,
        confidence: lowConfidenceFallback.confidence,
        needs_human_review: lowConfidenceFallback.needs_human_review,
      },
      routeConflict: {
        recommended_track: routeConflict.recommended_track,
        recommended_record_shape: routeConflict.recommended_record_shape,
        route_conflict: routeConflict.route_conflict,
        needs_human_review: routeConflict.needs_human_review,
      },
      structuredEvidence: {
        lowConfidenceGuidanceKind: lowConfidenceFallback.review_guidance?.guidance_kind ?? null,
        architectureNoGapGuidanceKind: architectureNoGap.review_guidance?.guidance_kind ?? null,
        routeConflictGuidanceKind: routeConflict.review_guidance?.guidance_kind ?? null,
      },
    };
  } catch (error) {
    return {
      ok: false,
      checkerId: CHECKER_ID,
      failureContractVersion: FAILURE_CONTRACT_VERSION,
      summary: "Discovery mission routing contract violated.",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

process.stdout.write(`${JSON.stringify(runCheck(), null, 2)}\n`);
