import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDirectiveArchitectureBoundedResultArtifact,
  readDirectiveArchitectureBoundedStartArtifact,
} from "../shared/lib/architecture-bounded-closeout.ts";
import { readDirectiveArchitectureAdoptionDetail } from "../shared/lib/architecture-result-adoption.ts";
import {
  DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
  DIRECTIVE_WORKSPACE_PRODUCT_TRUTH,
} from "../engine/workspace-truth.ts";
import {
  readDirectiveFrontendHandoffDetail,
  readDirectiveFrontendSnapshot,
  readDirectiveFrontendRuntimeProofDetail,
  readDirectiveFrontendRuntimeRecordDetail,
  readDirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail,
  readFrontendQueueOverview,
} from "../hosts/web-host/data.ts";
import { runDirectiveArchitectureCompositionCheck } from "./check-architecture-composition.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { syncDiscoveryIntakeLifecycle } from "../shared/lib/discovery-intake-lifecycle-sync.ts";
import { openDirectiveDiscoveryRoute } from "../shared/lib/discovery-route-opener.ts";
import { openDirectiveRuntimeFollowUp } from "../shared/lib/runtime-follow-up-opener.ts";
import { openDirectiveRuntimeRecordProof } from "../shared/lib/runtime-record-proof-opener.ts";
import { openDirectiveRuntimeProofRuntimeCapabilityBoundary } from "../shared/lib/runtime-proof-runtime-capability-boundary-opener.ts";
import { openDirectiveRuntimePromotionReadiness } from "../shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ARCHITECTURE_ROUTE_PATH =
  "discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md";
const RUNTIME_ROUTE_PATH =
  "discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md";
const ARCHITECTURE_EVALUATION_PATH =
  "architecture/09-post-consumption-evaluations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-evaluation.md";
const ARCHITECTURE_HANDOFF_PATH =
  "architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-engine-handoff.md";
const ARCHITECTURE_BOUNDED_START_PATH =
  "architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-start.md";
const ARCHITECTURE_BOUNDED_RESULT_PATH =
  "architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md";
const ARCHITECTURE_ADOPTION_PATH =
  "architecture/03-adopted/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-adopted-planned-next.md";
const ARCHITECTURE_IMPLEMENTATION_TARGET_PATH =
  "architecture/04-implementation-targets/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-implementation-target.md";
const ARCHITECTURE_IMPLEMENTATION_RESULT_PATH =
  "architecture/05-implementation-results/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-implementation-result.md";
const ARCHITECTURE_RETAINED_PATH =
  "architecture/06-retained/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-retained.md";
const ARCHITECTURE_INTEGRATION_PATH =
  "architecture/07-integration-records/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-integration-record.md";
const ARCHITECTURE_CONSUMPTION_PATH =
  "architecture/08-consumption-records/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-consumption.md";
const ARCHITECTURE_STALE_EVALUATION_PATH =
  "architecture/09-post-consumption-evaluations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-evaluation.md";
const RUNTIME_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md";
const LEGACY_RUNTIME_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-20-cli-anything-runtime-follow-up-record.md";
const LEGACY_RUNTIME_ACTIVE_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md";
const LEGACY_RUNTIME_AGENT_ORCHESTRATOR_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md";
const LEGACY_RUNTIME_PROMPTFOO_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-20-promptfoo-runtime-followup.md";
const LEGACY_RUNTIME_PUPPETEER_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-20-puppeteer-browser-runtime-followup.md";
const LEGACY_RUNTIME_AGENTICS_RECORD_PATH =
  "runtime/records/2026-03-19-agentics-runtime-record.md";
const LEGACY_RUNTIME_PROMPTFOO_RECORD_PATH =
  "runtime/records/2026-03-21-promptfoo-runtime-record.md";
const LEGACY_RUNTIME_SCIENTIFY_RECORD_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-runtime-record.md";
const LEGACY_RUNTIME_CLI_ANYTHING_REENTRY_RECORD_PATH =
  "runtime/records/2026-03-22-cli-anything-reentry-preconditions-slice-01.md";
const LEGACY_RUNTIME_PROMPTFOO_SLICE_PROOF_PATH =
  "runtime/records/2026-03-21-promptfoo-runtime-slice-01-proof.md";
const LEGACY_RUNTIME_AGENT_ORCHESTRATOR_SLICE_PROOF_PATH =
  "runtime/records/2026-03-21-agent-orchestrator-cli-runtime-slice-01-proof.md";
const LEGACY_RUNTIME_SUPERPOWERS_SLICE_PROOF_PATH =
  "runtime/records/2026-03-21-superpowers-runtime-slice-01-proof.md";
const LEGACY_RUNTIME_AGENT_ORCHESTRATOR_SLICE_EXECUTION_PATH =
  "runtime/records/2026-03-21-agent-orchestrator-cli-runtime-slice-01-execution.md";
const LEGACY_RUNTIME_PUPPETEER_SLICE_EXECUTION_PATH =
  "runtime/records/2026-03-21-puppeteer-runtime-slice-01-execution.md";
const LEGACY_RUNTIME_SKILLS_MANAGER_SLICE_EXECUTION_PATH =
  "runtime/records/2026-03-21-skills-manager-runtime-slice-01-execution.md";
const LEGACY_RUNTIME_MINI_SWE_FALLBACK_REHEARSAL_PATH =
  "runtime/records/2026-03-20-mini-swe-agent-fallback-rehearsal.md";
const LEGACY_RUNTIME_SCIENTIFY_PROOF_CHECKLIST_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md";
const LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_PROOF_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-runtime-slice-02-live-fetch-proof.md";
const LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_GATE_SNAPSHOT_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-live-fetch-gate-snapshot.json";
const LEGACY_RUNTIME_SCIENTIFY_LIVE_QUALIFIED_POOL_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-live-qualified-pool.json";
const LEGACY_RUNTIME_SCIENTIFY_LIVE_DEGRADED_POOL_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-live-degraded-pool.json";
const LEGACY_RUNTIME_SCIENTIFY_SAMPLE_QUALIFIED_POOL_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-qualified-pool-sample.json";
const LEGACY_RUNTIME_SCIENTIFY_SAMPLE_DEGRADED_POOL_PATH =
  "runtime/records/2026-03-23-scientify-literature-monitoring-degraded-quality-sample.json";
const LEGACY_RUNTIME_SYSTEM_BUNDLE_02_PATH =
  "runtime/records/2026-03-21-runtime-system-bundle-02-boundary-inventory.md";
const LEGACY_RUNTIME_SYSTEM_BUNDLE_03_PATH =
  "runtime/records/2026-03-21-runtime-system-bundle-03-source-pack-catalog-cleanup.md";
const LEGACY_RUNTIME_SYSTEM_BUNDLE_04_PATH =
  "runtime/records/2026-03-21-runtime-system-bundle-04-promotion-profile-normalization.md";
const LEGACY_RUNTIME_SYSTEM_BUNDLE_05_PATH =
  "runtime/records/2026-03-21-runtime-system-bundle-05-import-source-policy-alignment.md";
const LEGACY_RUNTIME_SYSTEM_BUNDLE_06_PATH =
  "runtime/records/2026-03-21-runtime-system-bundle-06-legacy-live-runtime-normalization.md";
const LEGACY_RUNTIME_AGENTICS_DOCS_VALIDATION_PATH =
  "runtime/records/2026-03-20-agentics-docs-maintenance-validation.md";
const LEGACY_RUNTIME_AGENTICS_DOCS_VALIDATION_RERUN_PATH =
  "runtime/records/2026-03-20-agentics-docs-maintenance-validation-rerun.md";
const LEGACY_RUNTIME_AGENT_ORCHESTRATOR_PRECONDITION_PROOF_PATH =
  "runtime/records/2026-03-21-agent-orchestrator-cli-precondition-proof.md";
const LEGACY_RUNTIME_AGENT_ORCHESTRATOR_PRECONDITION_CORRECTION_PATH =
  "runtime/records/2026-03-21-agent-orchestrator-precondition-correction.md";
const LEGACY_RUNTIME_AGENT_ORCHESTRATOR_HOST_ADAPTER_DECISION_PATH =
  "runtime/records/2026-03-21-agent-orchestrator-host-adapter-decision.md";
const LEGACY_RUNTIME_AGENTICS_REGISTRY_PATH =
  "runtime/registry/2026-03-20-agentics-registry-entry.md";
const LEGACY_RUNTIME_PROMPTFOO_REGISTRY_PATH =
  "runtime/registry/2026-03-21-promptfoo-registry-entry.md";
const LEGACY_RUNTIME_V0_NORMALIZER_REGISTRY_PATH =
  "runtime/registry/2026-03-22-v0-normalizer-transformation-registry-entry.md";
const LEGACY_RUNTIME_AGENTICS_PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-03-20-agentics-promotion-record.md";
const LEGACY_RUNTIME_PROMPTFOO_PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-03-21-promptfoo-promotion-record.md";
const LEGACY_RUNTIME_V0_NORMALIZER_PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-03-22-v0-normalizer-transformation-promotion-record.md";
const LEGACY_RUNTIME_ASYNC_LATENCY_TRANSFORMATION_RECORD_PATH =
  "runtime/records/2026-03-22-context-pack-async-latency-transformation-record.md";
const LEGACY_RUNTIME_V0_NORMALIZER_TRANSFORMATION_RECORD_PATH =
  "runtime/records/2026-03-22-v0-normalizer-transformation-record.md";
const LEGACY_RUNTIME_REMAINING_BACKEND_TRANSFORMATION_RECORD_PATH =
  "runtime/records/2026-03-22-remaining-backend-test-boilerplate-transformation-record.md";
const LEGACY_RUNTIME_AUTOMATION_TEST_TRANSFORMATION_RECORD_PATH =
  "runtime/records/2026-03-22-automation-test-boilerplate-transformation-record.md";
const LEGACY_RUNTIME_REPO_SNAPSHOT_CODE_INTEL_TRANSFORMATION_RECORD_PATH =
  "runtime/records/2026-03-23-repo-snapshot-code-intel-cache-transformation-record.md";
const LEGACY_RUNTIME_ASYNC_LATENCY_TRANSFORMATION_PROOF_PATH =
  "runtime/records/2026-03-22-context-pack-async-latency-transformation-proof.json";
const LEGACY_RUNTIME_V0_NORMALIZER_TRANSFORMATION_PROOF_PATH =
  "runtime/records/2026-03-22-v0-normalizer-transformation-proof.json";
const LEGACY_RUNTIME_REPO_SNAPSHOT_CODE_INTEL_TRANSFORMATION_PROOF_PATH =
  "runtime/records/2026-03-23-repo-snapshot-code-intel-cache-transformation-proof.json";
const LEGACY_RUNTIME_HANDOFF_AUTORESEARCH_PATH =
  "runtime/handoff/2026-03-22-autoresearch-architecture-to-runtime-handoff.md";
const LEGACY_RUNTIME_HANDOFF_SCIENTIFY_PATH =
  "runtime/handoff/2026-03-23-scientify-literature-monitoring-architecture-to-runtime-handoff.md";
const LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH =
  "runtime/follow-up/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-follow-up-record.md";
const RUNTIME_PROOF_PATH =
  "runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md";
const RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH =
  "runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md";
const RUNTIME_ROUTE_PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-promotion-readiness.md";
const RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH =
  "runtime/04-capability-boundaries/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-runtime-capability-boundary.md";
const PRESSURE_KARPATHY_CANDIDATE_ID = "dw-pressure-karpathy-autoresearch-2026-03-25";
const PRESSURE_KARPATHY_HEAD_PATH =
  "architecture/02-experiments/2026-03-25-dw-pressure-karpathy-autoresearch-2026-03-25-bounded-result.md";
const PRESSURE_MINI_SWE_CANDIDATE_ID = "dw-pressure-mini-swe-agent-2026-03-25";
const PRESSURE_MINI_SWE_HEAD_PATH =
  "runtime/05-promotion-readiness/2026-03-25-dw-pressure-mini-swe-agent-2026-03-25-promotion-readiness.md";
const PRESSURE_PAPERCODER_CANDIDATE_ID = "dw-pressure-papercoder-2026-03-25";
const PRESSURE_PAPERCODER_HEAD_PATH =
  "architecture/02-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result.md";
const COMPLETED_MONITOR_CANDIDATE_ID = "dw-mission-agentics-issue-triage-discovery-restart-2026-03-26";
const DISCOVERY_MONITOR_ROUTE_PATH =
  "discovery/routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md";
const DISCOVERY_MONITOR_RECORD_PATH =
  "discovery/monitor/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-monitor-record.md";
const LEGACY_ARCHITECTURE_IMPLEMENTATION_TARGET_GAP = "architecture/04-implementation-targets/*.md";
const LEGACY_ARCHITECTURE_ADOPTION_CASES = [
  {
    candidateId: "dw-openclaw-runtime-verification-freshness-2026-03-22",
    candidateName: "OpenClaw Runtime Verification Freshness",
    artifactPath: "architecture/03-adopted/2026-03-22-openclaw-runtime-verification-freshness-adopted.md",
  },
  {
    candidateId: "dw-openclaw-maintenance-watchdog-signal-lane",
    candidateName: "OpenClaw Maintenance Watchdog Signal Lane",
    artifactPath: "architecture/03-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md",
  },
  {
    candidateId: "dw-openclaw-discovery-submission-flow",
    candidateName: "OpenClaw Discovery Submission Flow",
    artifactPath: "architecture/03-adopted/2026-03-22-openclaw-discovery-submission-flow-adopted.md",
  },
  {
    candidateId: "dw-discovery-gap-driven-priority-loop",
    candidateName: "Discovery Gap Priority Worklist",
    artifactPath: "architecture/03-adopted/2026-03-22-discovery-gap-priority-worklist-adopted.md",
  },
] as const;
const INTERNAL_ARCHITECTURE_2026_03_28_START_CASES = [
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-proof-checklist-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-gate-snapshot-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-pool-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-start.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-start.md",
] as const;
const INTERNAL_ARCHITECTURE_2026_03_28_RESULT_CASES = [
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-held-route-equivalence-hardening-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-monitor-truth-surface-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-follow-up-focus-compatibility-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-handoff-focus-compatibility-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-active-follow-up-focus-compatibility-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-record-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-registry-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-promotion-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-transformation-label-link-normalization-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-proof-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-slice-execution-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-proof-checklist-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-proof-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-fetch-gate-snapshot-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-live-pool-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-sample-pool-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-system-bundle-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-validation-note-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-precondition-decision-note-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-cli-anything-reentry-record-focus-compat-2026-03-28-bounded-result.md",
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-mini-swe-fallback-rehearsal-focus-compat-2026-03-28-bounded-result.md",
] as const;
const CURRENT_BOUNDED_START_PARSE_GUARD_CASES = [
  {
    startPath:
      "architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-bounded-start.md",
    candidateId:
      "dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28",
  },
  {
    startPath:
      "architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-bounded-start.md",
    candidateId:
      "dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28",
  },
] as const;
const CURRENT_BOUNDED_RESULT_PARSE_GUARD_CASES = [
  {
    resultPath:
      "architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-bounded-result.md",
    candidateId:
      "dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28",
    verdict: "adopt",
  },
  {
    resultPath:
      "architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-bounded-result.md",
    candidateId:
      "dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28",
    verdict: "adopt",
  },
] as const;
const CURRENT_ADOPTION_PARSE_GUARD_CASES = [
  {
    adoptedPath:
      "architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-adopted-planned-next.md",
    candidateId:
      "dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28",
    finalStatus: "adopt_planned_next",
  },
  {
    adoptedPath:
      "architecture/03-adopted/2026-03-28-dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28-adopted-planned-next.md",
    candidateId:
      "dw-pressure-engine-stale-current-head-architecture-closure-legality-hardening-2026-03-28",
    finalStatus: "adopt_planned_next",
  },
] as const;
const ROUTED_PROGRESS_ARCHITECTURE_CANDIDATE_ID = "dw-source-ts-edge-2026-03-27";
const ROUTED_PROGRESS_RUNTIME_CANDIDATE_ID = "dw-source-scientify-research-workflow-plugin-2026-03-27";
const ROUTED_BROKEN_CANDIDATE_ID = "dw-live-gpt-researcher-engine-pressure-2026-03-24";
const ROUTED_PENDING_CONTROL_CANDIDATE_ID = "dw-pressure-openmoss-architecture-loop-2026-03-26";
const COMPLETED_PROMPTFOO_CANDIDATE_ID = "al-tooling-promptfoo";
const TS_EDGE_ROUTE_PATH =
  "discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md";
const LEGACY_RUNTIME_LABEL_ROUTE_PATH =
  "discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md";
const LEGACY_ARCHITECTURE_ADOPTION_COMPATIBILITY_HANDOFF_PATH =
  "architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-engine-handoff.md";

function uniqueRelativePaths(paths: Array<string | null | undefined>) {
  return [...new Set(paths.filter((value): value is string => Boolean(value)))];
}

function expectFocus(relativePath: string, directiveRoot = DIRECTIVE_ROOT) {
  const report = resolveDirectiveWorkspaceState({
    directiveRoot,
    artifactPath: relativePath,
  });
  assert.ok(report.focus, `missing focus for ${relativePath}`);
  return report.focus;
}

function expectNoDrift(relativePath: string, focus: ReturnType<typeof expectFocus>) {
  assert.equal(
    focus.integrityState,
    "ok",
    `${relativePath} unexpectedly resolved as broken: ${focus.inconsistentLinks.join(", ")}`,
  );
  assert.equal(
    focus.missingExpectedArtifacts.length,
    0,
    `${relativePath} is missing expected artifacts: ${focus.missingExpectedArtifacts.join(", ")}`,
  );
  assert.equal(
    focus.inconsistentLinks.length,
    0,
    `${relativePath} has inconsistent links: ${focus.inconsistentLinks.join(", ")}`,
  );
}

function expectPendingNextArtifactGap(
  relativePath: string,
  focus: ReturnType<typeof expectFocus>,
  expectedMissingArtifact: string,
) {
  assert.equal(
    focus.integrityState,
    "ok",
    `${relativePath} unexpectedly resolved as broken: ${focus.inconsistentLinks.join(", ")}`,
  );
  assert.deepEqual(
    focus.missingExpectedArtifacts,
    [expectedMissingArtifact],
    `${relativePath} should only expose the still-unopened next artifact gap`,
  );
  assert.equal(
    focus.inconsistentLinks.length,
    0,
    `${relativePath} has inconsistent links: ${focus.inconsistentLinks.join(", ")}`,
  );
}

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyRelativeFile(relativePath: string, stagedRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`copy source missing: ${relativePath}`);
  }
  const targetPath = path.join(stagedRoot, relativePath);
  ensureParentDir(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
}

function writeRelativeFile(relativePath: string, stagedRoot: string, transform: (content: string) => string) {
  const targetPath = path.join(stagedRoot, relativePath);
  const existing = fs.readFileSync(targetPath, "utf8");
  fs.writeFileSync(targetPath, transform(existing), "utf8");
}

function withStagedDirectiveRoot(label: string, run: (stagedRoot: string) => void) {
  const stagedRoot = fs.mkdtempSync(path.join(os.tmpdir(), `directive-workspace-${label}-`));
  try {
    run(stagedRoot);
  } finally {
    fs.rmSync(stagedRoot, { recursive: true, force: true });
  }
}

function expectBlockedAdvancement(relativePath: string, focus: ReturnType<typeof expectFocus>) {
  assert.equal(focus.integrityState, "broken", `${relativePath} should resolve as broken`);
  assert.equal(
    focus.artifactNextLegalStep,
    DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
    `${relativePath} still exposes an optimistic artifact-local next step: ${focus.artifactNextLegalStep}`,
  );
  assert.equal(
    focus.nextLegalStep,
    DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
    `${relativePath} still exposes an optimistic case-level next step: ${focus.nextLegalStep}`,
  );
}

function main() {
  runDirectiveArchitectureCompositionCheck();

  const overview = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
  });
  assert.ok(overview.ok, "Directive Workspace overview resolver failed");
  assert.ok(overview.anchors.length >= 4, "Expected at least four canonical product anchors");
  assert.deepEqual(
    overview.product.fieldInterpretation,
    DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.fieldInterpretation,
    "Overview field-interpretation semantics drifted away from the Engine-owned truth catalog",
  );
  assert.deepEqual(
    overview.product.proven,
    [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.proven],
    "Overview proven-state catalog drifted away from the Engine-owned truth catalog",
  );
  assert.deepEqual(
    overview.product.partiallyBuilt,
    [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.partiallyBuilt],
    "Overview partially-built catalog drifted away from the Engine-owned truth catalog",
  );
  assert.deepEqual(
    overview.product.intentionallyMinimal,
    [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.intentionallyMinimal],
    "Overview intentionally-minimal catalog drifted away from the Engine-owned truth catalog",
  );
  assert.equal(
    overview.product.fieldInterpretation.currentHead,
    DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.fieldInterpretation.currentHead,
    "Overview current-head interpretation drifted away from the Engine-owned truth catalog",
  );

  const architectureRoute = expectFocus(ARCHITECTURE_ROUTE_PATH);
  assert.equal(architectureRoute.lane, "discovery");
  assert.equal(architectureRoute.routeTarget, "architecture");
  assert.equal(architectureRoute.artifactStage, "discovery.route.architecture");
  assert.ok(
    architectureRoute.currentStage.startsWith("architecture."),
    `Architecture route did not resolve downstream Architecture truth: ${architectureRoute.currentStage}`,
  );
  assert.ok(
    architectureRoute.nextLegalStep.includes("Architecture")
    || architectureRoute.nextLegalStep.includes("bounded closeout")
    || architectureRoute.nextLegalStep.includes("bounded result")
    || architectureRoute.nextLegalStep.includes("implementation target")
    || architectureRoute.nextLegalStep.includes("implementation result")
    || architectureRoute.nextLegalStep.includes("retention")
    || architectureRoute.nextLegalStep.includes("integration record")
    || architectureRoute.nextLegalStep.includes("consumption"),
    `Architecture route next step is not explicit enough: ${architectureRoute.nextLegalStep}`,
  );
  assert.ok(architectureRoute.linkedArtifacts.discoveryIntakePath);
  assert.ok(architectureRoute.linkedArtifacts.engineRunRecordPath);
  expectNoDrift(ARCHITECTURE_ROUTE_PATH, architectureRoute);

  const runtimeRoute = expectFocus(RUNTIME_ROUTE_PATH);
  assert.equal(runtimeRoute.lane, "discovery");
  assert.equal(runtimeRoute.routeTarget, "runtime");
  assert.equal(runtimeRoute.artifactStage, "discovery.route.runtime");
  assert.equal(runtimeRoute.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimeRoute.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime route next step is not honest about the current seam: ${runtimeRoute.nextLegalStep}`,
  );
  assert.ok(runtimeRoute.linkedArtifacts.runtimeFollowUpPath);
  assert.ok(runtimeRoute.linkedArtifacts.runtimeRecordPath);
  assert.ok(runtimeRoute.linkedArtifacts.runtimeProofPath);
  assert.equal(
    runtimeRoute.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
    RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
  );
  assert.equal(
    runtimeRoute.linkedArtifacts.runtimePromotionReadinessPath,
    RUNTIME_ROUTE_PROMOTION_READINESS_PATH,
  );
  expectNoDrift(RUNTIME_ROUTE_PATH, runtimeRoute);

  const architectureEvaluation = expectFocus(ARCHITECTURE_EVALUATION_PATH);
  assert.equal(architectureEvaluation.lane, "architecture");
  assert.equal(architectureEvaluation.currentStage, "architecture.post_consumption_evaluation.keep");
  assert.ok(
    architectureEvaluation.nextLegalStep.includes("No automatic Architecture step is open"),
    `Architecture evaluation overstates downstream movement: ${architectureEvaluation.nextLegalStep}`,
  );
  assert.ok(architectureEvaluation.linkedArtifacts.architectureIntegrationRecordPath);
  assert.ok(architectureEvaluation.linkedArtifacts.architectureEvaluationPath);
  expectNoDrift(ARCHITECTURE_EVALUATION_PATH, architectureEvaluation);

  const architectureHandoff = expectFocus(ARCHITECTURE_HANDOFF_PATH);
  assert.equal(architectureHandoff.lane, "architecture");
  assert.equal(architectureHandoff.artifactStage, "architecture.handoff.pending_review");
  assert.equal(architectureHandoff.currentStage, "architecture.bounded_result.stay_experimental");
  assert.ok(
    architectureHandoff.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture handoff should downgrade its stale artifact-local next step: ${architectureHandoff.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureHandoff.artifactNextLegalStep.includes(architectureHandoff.currentHead.artifactPath),
    `Architecture handoff should point to currentHead: ${architectureHandoff.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureHandoff.nextLegalStep.includes("Explicitly continue the experimental Architecture slice"),
    `Architecture handoff should preserve the live case-level next step: ${architectureHandoff.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_HANDOFF_PATH, architectureHandoff);

  const architectureBoundedStart = expectFocus(ARCHITECTURE_BOUNDED_START_PATH);
  assert.equal(architectureBoundedStart.lane, "architecture");
  assert.equal(architectureBoundedStart.artifactStage, "architecture.bounded_start.opened");
  assert.equal(architectureBoundedStart.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureBoundedStart.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture bounded start should downgrade its stale artifact-local next step: ${architectureBoundedStart.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureBoundedStart.artifactNextLegalStep.includes(architectureBoundedStart.currentHead.artifactPath),
    `Architecture bounded start should point to currentHead: ${architectureBoundedStart.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureBoundedStart.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture bounded start should preserve the live case-level next step: ${architectureBoundedStart.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_BOUNDED_START_PATH, architectureBoundedStart);

  const architectureBoundedResult = expectFocus(ARCHITECTURE_BOUNDED_RESULT_PATH);
  assert.equal(architectureBoundedResult.lane, "architecture");
  assert.equal(architectureBoundedResult.artifactStage, "architecture.bounded_result.stay_experimental");
  assert.equal(architectureBoundedResult.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureBoundedResult.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture bounded result should downgrade its stale artifact-local next step: ${architectureBoundedResult.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureBoundedResult.artifactNextLegalStep.includes(architectureBoundedResult.currentHead.artifactPath),
    `Architecture bounded result should point to currentHead: ${architectureBoundedResult.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureBoundedResult.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture bounded result should preserve the live case-level next step: ${architectureBoundedResult.nextLegalStep}`,
  );
  assert.equal(
    architectureBoundedResult.missingExpectedArtifacts.length,
    0,
    "Architecture bounded result should not demand a continuation artifact after the chain already moved into adoption/materialization",
  );
  expectNoDrift(ARCHITECTURE_BOUNDED_RESULT_PATH, architectureBoundedResult);

  const architectureAdoption = expectFocus(ARCHITECTURE_ADOPTION_PATH);
  assert.equal(architectureAdoption.lane, "architecture");
  assert.equal(architectureAdoption.artifactStage, "architecture.adoption.adopt_planned_next");
  assert.equal(architectureAdoption.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureAdoption.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture adoption should downgrade its stale artifact-local next step: ${architectureAdoption.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureAdoption.artifactNextLegalStep.includes(architectureAdoption.currentHead.artifactPath),
    `Architecture adoption should point to currentHead: ${architectureAdoption.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureAdoption.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture adoption should preserve the live case-level next step: ${architectureAdoption.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_ADOPTION_PATH, architectureAdoption);

  const architectureImplementationTarget = expectFocus(ARCHITECTURE_IMPLEMENTATION_TARGET_PATH);
  assert.equal(architectureImplementationTarget.lane, "architecture");
  assert.equal(architectureImplementationTarget.artifactStage, "architecture.implementation_target.opened");
  assert.equal(architectureImplementationTarget.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureImplementationTarget.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture implementation target should downgrade its stale artifact-local next step: ${architectureImplementationTarget.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureImplementationTarget.artifactNextLegalStep.includes(architectureImplementationTarget.currentHead.artifactPath),
    `Architecture implementation target should point to currentHead: ${architectureImplementationTarget.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureImplementationTarget.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture implementation target should preserve the live case-level next step: ${architectureImplementationTarget.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_IMPLEMENTATION_TARGET_PATH, architectureImplementationTarget);

  const architectureImplementationResult = expectFocus(ARCHITECTURE_IMPLEMENTATION_RESULT_PATH);
  assert.equal(architectureImplementationResult.lane, "architecture");
  assert.equal(architectureImplementationResult.artifactStage, "architecture.implementation_result.success");
  assert.equal(architectureImplementationResult.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureImplementationResult.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture implementation result should downgrade its stale artifact-local next step: ${architectureImplementationResult.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureImplementationResult.artifactNextLegalStep.includes(architectureImplementationResult.currentHead.artifactPath),
    `Architecture implementation result should point to currentHead: ${architectureImplementationResult.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureImplementationResult.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture implementation result should preserve the live case-level next step: ${architectureImplementationResult.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_IMPLEMENTATION_RESULT_PATH, architectureImplementationResult);

  const architectureRetained = expectFocus(ARCHITECTURE_RETAINED_PATH);
  assert.equal(architectureRetained.lane, "architecture");
  assert.equal(architectureRetained.artifactStage, "architecture.retained.confirmed");
  assert.equal(architectureRetained.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureRetained.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture retained should downgrade its stale artifact-local next step: ${architectureRetained.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureRetained.artifactNextLegalStep.includes(architectureRetained.currentHead.artifactPath),
    `Architecture retained should point to currentHead: ${architectureRetained.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureRetained.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture retained should preserve the live case-level next step: ${architectureRetained.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_RETAINED_PATH, architectureRetained);

  const architectureIntegration = expectFocus(ARCHITECTURE_INTEGRATION_PATH);
  assert.equal(architectureIntegration.lane, "architecture");
  assert.equal(architectureIntegration.artifactStage, "architecture.integration_record.ready");
  assert.equal(architectureIntegration.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureIntegration.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture integration record should downgrade its stale artifact-local next step: ${architectureIntegration.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureIntegration.artifactNextLegalStep.includes(architectureIntegration.currentHead.artifactPath),
    `Architecture integration record should point to currentHead: ${architectureIntegration.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureIntegration.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture integration record should preserve the live case-level next step: ${architectureIntegration.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_INTEGRATION_PATH, architectureIntegration);

  const architectureConsumption = expectFocus(ARCHITECTURE_CONSUMPTION_PATH);
  assert.equal(architectureConsumption.lane, "architecture");
  assert.equal(architectureConsumption.artifactStage, "architecture.consumption.success");
  assert.equal(architectureConsumption.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureConsumption.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture consumption record should downgrade its stale artifact-local next step: ${architectureConsumption.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureConsumption.artifactNextLegalStep.includes(architectureConsumption.currentHead.artifactPath),
    `Architecture consumption record should point to currentHead: ${architectureConsumption.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureConsumption.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture consumption record should preserve the live case-level next step: ${architectureConsumption.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_CONSUMPTION_PATH, architectureConsumption);

  const architectureStaleEvaluation = expectFocus(ARCHITECTURE_STALE_EVALUATION_PATH);
  assert.equal(architectureStaleEvaluation.lane, "architecture");
  assert.equal(architectureStaleEvaluation.artifactStage, "architecture.post_consumption_evaluation.reopen");
  assert.equal(architectureStaleEvaluation.currentStage, "architecture.post_consumption_evaluation.reopen");
  assert.ok(
    architectureStaleEvaluation.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Architecture stale evaluation should downgrade its stale artifact-local next step: ${architectureStaleEvaluation.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureStaleEvaluation.artifactNextLegalStep.includes(architectureStaleEvaluation.currentHead.artifactPath),
    `Architecture stale evaluation should point to currentHead: ${architectureStaleEvaluation.artifactNextLegalStep}`,
  );
  assert.ok(
    architectureStaleEvaluation.nextLegalStep.includes("Explicitly continue or close the reopened bounded Architecture slice"),
    `Architecture stale evaluation should preserve the live case-level next step: ${architectureStaleEvaluation.nextLegalStep}`,
  );
  expectNoDrift(ARCHITECTURE_STALE_EVALUATION_PATH, architectureStaleEvaluation);

  const runtimeFollowUp = expectFocus(RUNTIME_FOLLOW_UP_PATH);
  assert.equal(runtimeFollowUp.lane, "runtime");
  assert.equal(runtimeFollowUp.artifactStage, "runtime.follow_up.pending_review");
  assert.equal(runtimeFollowUp.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimeFollowUp.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Historical runtime follow-up should downgrade its stale artifact-local next step: ${runtimeFollowUp.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeFollowUp.artifactNextLegalStep.includes(runtimeFollowUp.currentHead.artifactPath),
    `Historical runtime follow-up should point to currentHead: ${runtimeFollowUp.artifactNextLegalStep}`,
  );
  expectNoDrift(RUNTIME_FOLLOW_UP_PATH, runtimeFollowUp);
  const historicalFollowUpDetail = readDirectiveFrontendHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: RUNTIME_FOLLOW_UP_PATH,
  });
  assert.ok(
    historicalFollowUpDetail.ok && historicalFollowUpDetail.kind === "runtime_follow_up",
    "Expected a runtime follow-up detail for the historical mini-swe route",
  );
  assert.equal(
    historicalFollowUpDetail.approvalAllowed,
    false,
    "Historical runtime follow-up detail should not advertise approval once the case head moved downstream",
  );
  const frontendSnapshot = readDirectiveFrontendSnapshot({
    directiveRoot: DIRECTIVE_ROOT,
    maxHandoffs: 20,
    maxQueueEntries: 20,
    maxRuns: 4,
  });
  const legacyInternallyGeneratedHandoffDetail = readDirectiveFrontendHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: LEGACY_ARCHITECTURE_ADOPTION_COMPATIBILITY_HANDOFF_PATH,
  });
  assert.ok(
    legacyInternallyGeneratedHandoffDetail.ok && legacyInternallyGeneratedHandoffDetail.kind === "architecture_handoff",
    "Expected the internally-generated legacy Architecture adoption compatibility handoff to resolve cleanly",
  );
  assert.equal(
    legacyInternallyGeneratedHandoffDetail.artifact.engineRunRecordPath,
    null,
    "Internally-generated Architecture handoff should not invent an Engine run record path",
  );
  assert.equal(
    legacyInternallyGeneratedHandoffDetail.artifact.engineRunReportPath,
    null,
    "Internally-generated Architecture handoff should not invent an Engine run report path",
  );
  assert.equal(
    legacyInternallyGeneratedHandoffDetail.artifact.discoveryRoutingRecordPath,
    null,
    "Internally-generated Architecture handoff should not invent a Discovery routing record path",
  );
  assert.ok(
    !frontendSnapshot.handoffWarnings.some((warning) => warning.includes(LEGACY_ARCHITECTURE_ADOPTION_COMPATIBILITY_HANDOFF_PATH)),
    "Internally-generated Architecture handoff should not remain in the frontend handoff warning inventory",
  );
  const historicalFollowUpStub = frontendSnapshot.handoffStubs.find((stub) => stub.relativePath === RUNTIME_FOLLOW_UP_PATH);
  assert.ok(historicalFollowUpStub, "Expected historical mini-swe Runtime follow-up stub in the frontend snapshot");
  assert.equal(
    historicalFollowUpStub.candidateId,
    runtimeFollowUp.candidateId,
    "Runtime follow-up stub candidate id should come from the artifact, not the filename prefix",
  );
  assert.equal(
    historicalFollowUpStub.status,
    "progressed_downstream",
    "Historical runtime follow-up stub should no longer advertise pending review once the live head moved downstream",
  );
  assert.match(
    historicalFollowUpStub.warning ?? "",
    /do not treat this follow-up artifact as a pending review stub/i,
    "Historical runtime follow-up stub should explain that the live head has moved downstream",
  );
  const livePendingFollowUpDetail = readDirectiveFrontendHandoffDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
  });
  assert.ok(
    livePendingFollowUpDetail.ok && livePendingFollowUpDetail.kind === "runtime_follow_up",
    "Expected a runtime follow-up detail for the still-pending OpenMOSS loop pressure case",
  );
  assert.equal(
    livePendingFollowUpDetail.approvalAllowed,
    true,
    "Current-head runtime follow-up detail should still advertise approval when the case is genuinely pending review",
  );
  const livePendingRuntimeFollowUp = expectFocus(LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH);
  assert.equal(livePendingRuntimeFollowUp.currentStage, "runtime.follow_up.pending_review");
  const livePendingFollowUpStub = frontendSnapshot.handoffStubs.find((stub) => stub.relativePath === LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH);
  assert.ok(livePendingFollowUpStub, "Expected live pending OpenMOSS Runtime follow-up stub in the frontend snapshot");
  assert.equal(
    livePendingFollowUpStub.candidateId,
    livePendingRuntimeFollowUp.candidateId,
    "Live pending Runtime follow-up stub should preserve the real candidate id from the artifact",
  );
  assert.equal(
    livePendingFollowUpStub.status,
    "pending_review",
    "Live pending Runtime follow-up stub should remain pending review while it is still the current head",
  );
  assert.equal(
    livePendingFollowUpStub.warning,
    null,
    "Live pending Runtime follow-up stub should not carry a stale-status warning",
  );
  expectPendingNextArtifactGap(
    LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
    livePendingRuntimeFollowUp,
    "runtime/02-records/2026-03-26-dw-pressure-openmoss-architecture-loop-2026-03-26-runtime-record.md",
  );

  const runtimeProof = expectFocus(RUNTIME_PROOF_PATH);
  assert.equal(runtimeProof.lane, "runtime");
  assert.equal(runtimeProof.artifactStage, "runtime.proof.opened");
  assert.equal(runtimeProof.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimeProof.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Runtime proof artifact-local next step drifted: ${runtimeProof.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeProof.artifactNextLegalStep.includes(runtimeProof.currentHead.artifactPath),
    `Runtime proof artifact-local next step should point to currentHead: ${runtimeProof.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeProof.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime proof next step drifted: ${runtimeProof.nextLegalStep}`,
  );
  assert.ok(runtimeProof.linkedArtifacts.runtimeRecordPath);
  assert.equal(
    runtimeProof.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
    RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
  );
  assert.equal(
    runtimeProof.linkedArtifacts.runtimePromotionReadinessPath,
    RUNTIME_ROUTE_PROMOTION_READINESS_PATH,
  );
  expectNoDrift(RUNTIME_PROOF_PATH, runtimeProof);
  const historicalRuntimeRecordDetail = readDirectiveFrontendRuntimeRecordDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
  });
  assert.ok(historicalRuntimeRecordDetail.ok, "Expected runtime record detail for historical mini-swe case");
  const historicalRuntimeRecordFocus = expectFocus(runtimeFollowUp.linkedArtifacts.runtimeRecordPath!);
  assert.ok(
    historicalRuntimeRecordFocus.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Historical runtime record should downgrade its stale artifact-local next step: ${historicalRuntimeRecordFocus.artifactNextLegalStep}`,
  );
  assert.ok(
    historicalRuntimeRecordFocus.artifactNextLegalStep.includes(historicalRuntimeRecordFocus.currentHead.artifactPath),
    `Historical runtime record should point to currentHead: ${historicalRuntimeRecordFocus.artifactNextLegalStep}`,
  );
  assert.equal(
    historicalRuntimeRecordDetail.approvalAllowed,
    false,
    "Historical runtime record detail should not advertise proof opening after the case head moved downstream",
  );
  const historicalRuntimeProofDetail = readDirectiveFrontendRuntimeProofDetail({
    directiveRoot: DIRECTIVE_ROOT,
    relativePath: RUNTIME_PROOF_PATH,
  });
  assert.ok(historicalRuntimeProofDetail.ok, "Expected runtime proof detail for historical mini-swe case");
  assert.equal(
    historicalRuntimeProofDetail.approvalAllowed,
    false,
    "Historical runtime proof detail should not advertise capability-boundary opening after the case head moved downstream",
  );

  const runtimeRouteCapabilityBoundary = expectFocus(RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH);
  assert.equal(runtimeRouteCapabilityBoundary.lane, "runtime");
  assert.equal(runtimeRouteCapabilityBoundary.artifactStage, "runtime.runtime_capability_boundary.opened");
  assert.equal(
    runtimeRouteCapabilityBoundary.currentStage,
    "runtime.promotion_readiness.opened",
  );
  assert.ok(
    runtimeRouteCapabilityBoundary.artifactNextLegalStep.includes("no longer the live continuation point"),
    `Runtime runtime capability boundary artifact-local next step drifted: ${runtimeRouteCapabilityBoundary.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeRouteCapabilityBoundary.artifactNextLegalStep.includes(runtimeRouteCapabilityBoundary.currentHead.artifactPath),
    `Runtime capability boundary should point to currentHead: ${runtimeRouteCapabilityBoundary.artifactNextLegalStep}`,
  );
  assert.ok(
    runtimeRouteCapabilityBoundary.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime route capability boundary overstates downstream movement: ${runtimeRouteCapabilityBoundary.nextLegalStep}`,
  );
  expectNoDrift(RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH, runtimeRouteCapabilityBoundary);
  const historicalRuntimeCapabilityBoundaryDetail =
    readDirectiveFrontendRuntimeRuntimeCapabilityBoundaryDetail({
      directiveRoot: DIRECTIVE_ROOT,
      relativePath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
    });
  assert.ok(
    historicalRuntimeCapabilityBoundaryDetail.ok,
    "Expected runtime capability-boundary detail for historical mini-swe case",
  );
  assert.equal(
    historicalRuntimeCapabilityBoundaryDetail.approvalAllowed,
    false,
    "Historical runtime capability-boundary detail should not advertise promotion-readiness opening after the case head moved downstream",
  );

  const runtimePromotionReadiness = expectFocus(RUNTIME_ROUTE_PROMOTION_READINESS_PATH);
  assert.equal(runtimePromotionReadiness.lane, "runtime");
  assert.equal(runtimePromotionReadiness.artifactStage, "runtime.promotion_readiness.opened");
  assert.equal(runtimePromotionReadiness.currentStage, "runtime.promotion_readiness.opened");
  assert.ok(
    runtimePromotionReadiness.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime promotion-readiness next step drifted: ${runtimePromotionReadiness.nextLegalStep}`,
  );
  assert.equal(
    runtimePromotionReadiness.runtime?.proposedHost,
    "pending_host_selection",
    "Runtime promotion-readiness should expose the unresolved proposed host through the shared resolver",
  );
  assert.ok(
    runtimePromotionReadiness.runtime?.promotionReadinessBlockers.includes("proposed_host_pending_selection"),
    `Runtime promotion-readiness should expose the pending-host blocker, got: ${runtimePromotionReadiness.runtime?.promotionReadinessBlockers.join(", ")}`,
  );
  assert.ok(
    runtimePromotionReadiness.runtime?.promotionReadinessBlockers.includes("host_facing_promotion_unopened"),
    `Runtime promotion-readiness should expose that host-facing promotion remains unopened, got: ${runtimePromotionReadiness.runtime?.promotionReadinessBlockers.join(", ")}`,
  );
  expectNoDrift(RUNTIME_ROUTE_PROMOTION_READINESS_PATH, runtimePromotionReadiness);

  const runtimeCapabilityBoundary = expectFocus(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH);
  assert.equal(runtimeCapabilityBoundary.lane, "runtime");
  assert.equal(
    runtimeCapabilityBoundary.currentStage,
    "runtime.runtime_capability_boundary.opened",
  );
  assert.ok(
    runtimeCapabilityBoundary.nextLegalStep.includes("No automatic Runtime step is open"),
    `Runtime capability boundary overstates downstream movement: ${runtimeCapabilityBoundary.nextLegalStep}`,
  );
  assert.ok(runtimeCapabilityBoundary.linkedArtifacts.runtimeCallableStubPath);
  expectNoDrift(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, runtimeCapabilityBoundary);

  const tsEdgeRoute = expectFocus(TS_EDGE_ROUTE_PATH);
  assert.equal(tsEdgeRoute.lane, "discovery");
  assert.equal(tsEdgeRoute.routeTarget, "architecture");
  assert.equal(tsEdgeRoute.discovery.operatingMode, "standard");
  assert.equal(tsEdgeRoute.engine.selectedLane, "runtime");
  assert.equal(tsEdgeRoute.currentStage, "architecture.bounded_result.stay_experimental");
  assert.equal(
    tsEdgeRoute.nextLegalStep,
    "Explicitly continue the experimental Architecture slice or stop without auto-advancing.",
  );
  expectNoDrift(TS_EDGE_ROUTE_PATH, tsEdgeRoute);

  const legacyRuntimeLabelRoute = expectFocus(LEGACY_RUNTIME_LABEL_ROUTE_PATH);
  assert.equal(legacyRuntimeLabelRoute.lane, "discovery");
  assert.equal(legacyRuntimeLabelRoute.routeTarget, "runtime");
  assert.equal(
    legacyRuntimeLabelRoute.missingExpectedArtifacts.length,
    0,
    `Legacy Discovery route labels should not be misread as missing concrete downstream artifacts: ${legacyRuntimeLabelRoute.missingExpectedArtifacts.join(", ")}`,
  );
  expectNoDrift(LEGACY_RUNTIME_LABEL_ROUTE_PATH, legacyRuntimeLabelRoute);

  const queueOverview = readFrontendQueueOverview({
    directiveRoot: DIRECTIVE_ROOT,
    maxEntries: 500,
  });
  const pressureKarpathyEntry = queueOverview.entries.find((entry) => entry.candidate_id === PRESSURE_KARPATHY_CANDIDATE_ID);
  assert.ok(pressureKarpathyEntry, "Missing queue entry for pressure-run Karpathy case");
  assert.equal(
    pressureKarpathyEntry.current_head?.artifact_path,
    PRESSURE_KARPATHY_HEAD_PATH,
    "Queue current head should point at the Architecture bounded result for the Karpathy pressure-run case",
  );
  assert.equal(
    pressureKarpathyEntry.current_head?.artifact_stage,
    "architecture.bounded_result.stay_experimental",
    "Queue current head stage should reflect the Architecture bounded result stage for the Karpathy pressure-run case",
  );
  assert.equal(
    pressureKarpathyEntry.current_case_stage,
    "architecture.bounded_result.stay_experimental",
    "Queue case stage should reflect the current Architecture case state for the Karpathy pressure-run case",
  );
  assert.notEqual(
    pressureKarpathyEntry.result_record_path,
    pressureKarpathyEntry.current_head?.artifact_path,
    "Karpathy pressure-run case should distinguish the first downstream stub from the live current artifact",
  );

  const pressureMiniSweEntry = queueOverview.entries.find((entry) => entry.candidate_id === PRESSURE_MINI_SWE_CANDIDATE_ID);
  assert.ok(pressureMiniSweEntry, "Missing queue entry for pressure-run mini-swe-agent case");
  assert.equal(
    pressureMiniSweEntry.current_head?.artifact_path,
    PRESSURE_MINI_SWE_HEAD_PATH,
    "Queue current head should point at promotion-readiness for the mini-swe-agent pressure-run case",
  );
  assert.equal(
    pressureMiniSweEntry.current_head?.artifact_stage,
    "runtime.promotion_readiness.opened",
    "Queue current head stage should reflect Runtime promotion-readiness for the mini-swe-agent pressure-run case",
  );
  assert.equal(
    pressureMiniSweEntry.current_case_stage,
    "runtime.promotion_readiness.opened",
    "Queue case stage should reflect Runtime promotion-readiness for the mini-swe-agent pressure-run case",
  );
  assert.notEqual(
    pressureMiniSweEntry.result_record_path,
    pressureMiniSweEntry.current_head?.artifact_path,
    "mini-swe-agent pressure-run case should distinguish the first Runtime stub from the live current artifact",
  );

  const pressurePaperCoderEntry = queueOverview.entries.find((entry) => entry.candidate_id === PRESSURE_PAPERCODER_CANDIDATE_ID);
  assert.ok(pressurePaperCoderEntry, "Missing queue entry for pressure-run PaperCoder case");
  assert.equal(
    pressurePaperCoderEntry.current_head?.artifact_path,
    PRESSURE_PAPERCODER_HEAD_PATH,
    "Queue current head should point at the Architecture bounded result for the PaperCoder pressure-run case",
  );
  assert.equal(
    pressurePaperCoderEntry.current_head?.artifact_stage,
    "architecture.bounded_result.adopt",
    "Queue current head stage should reflect the Architecture bounded result stage for the PaperCoder pressure-run case",
  );
  assert.equal(
    pressurePaperCoderEntry.current_case_stage,
    "architecture.bounded_result.adopt",
    "Queue case stage should reflect the Architecture bounded result state for the PaperCoder pressure-run case",
  );

  const completedPromptfooEntry = queueOverview.entries.find((entry) =>
    entry.candidate_id === COMPLETED_PROMPTFOO_CANDIDATE_ID
  );
  assert.ok(completedPromptfooEntry, "Missing completed promptfoo queue entry for completed-status validation");
  assert.equal(completedPromptfooEntry.status, "completed");
  assert.equal(
    completedPromptfooEntry.status_effective,
    "completed",
    "Completed runtime-slice proof entries should stay clean once the historical proof family resolves canonically",
  );
  assert.equal(
    completedPromptfooEntry.status_warning,
    null,
    "Completed runtime-slice proof entries should not surface a stale-completion warning once the proof family resolves canonically",
  );
  assert.equal(
    queueOverview.entries.filter((entry) => entry.status_effective === "completed_inconsistent").length,
    0,
    "No live queue row should remain completed_inconsistent once the historical proof family resolves canonically",
  );

  withStagedDirectiveRoot("completed-status-hardening", (stagedRoot) => {
    copyRelativeFile("discovery/intake-queue.json", stagedRoot);
    const stagedQueueOverview = readFrontendQueueOverview({
      directiveRoot: stagedRoot,
      maxEntries: 500,
    });
    const stagedBrokenCompletedEntry = stagedQueueOverview.entries.find((entry) =>
      entry.candidate_id === COMPLETED_PROMPTFOO_CANDIDATE_ID
    );
    assert.ok(
      stagedBrokenCompletedEntry,
      "Missing staged completed promptfoo queue entry for stale-status validation",
    );
    assert.equal(stagedBrokenCompletedEntry.status, "completed");
    assert.equal(
      stagedBrokenCompletedEntry.status_effective,
      "completed_inconsistent",
      "Completed queue entries should stop advertising clean completion when canonical truth cannot resolve the recorded result artifact",
    );
    assert.match(
      stagedBrokenCompletedEntry.status_warning ?? "",
      /do not treat this queue status as a truthful completion signal/i,
      "Completed queue entries should explain why the raw completed status is stale when the recorded result artifact is unresolved",
    );
  });

  const completedMonitorEntry = queueOverview.entries.find((entry) =>
    entry.candidate_id === COMPLETED_MONITOR_CANDIDATE_ID
  );
  assert.ok(completedMonitorEntry, "Missing completed monitor queue entry for completed-status validation");
  assert.equal(completedMonitorEntry.status, "completed");
  assert.equal(
    completedMonitorEntry.status_effective,
    "completed",
    "Discovery-held monitor completion should stay clean once the route monitor state resolves canonically",
  );
  assert.equal(
    completedMonitorEntry.status_warning,
    null,
    "Discovery-held monitor completion should not surface a stale-completion warning once the route monitor state is consistent",
  );

  const discoveryMonitorRoute = expectFocus(DISCOVERY_MONITOR_ROUTE_PATH);
  assert.equal(discoveryMonitorRoute.integrityState, "ok");
  assert.equal(discoveryMonitorRoute.routeTarget, "monitor");
  assert.equal(discoveryMonitorRoute.engine.selectedLane, "discovery");
  assert.equal(
    discoveryMonitorRoute.currentStage,
    "discovery.monitor.active",
    "Discovery-held monitor routes should resolve through the live monitor artifact once it exists",
  );
  assert.equal(
    completedMonitorEntry.current_head?.artifact_path,
    DISCOVERY_MONITOR_RECORD_PATH,
    "Completed monitor queue entries should point at the real monitor artifact as the live current head",
  );
  assert.equal(
    completedMonitorEntry.current_case_stage,
    "discovery.monitor.active",
    "Completed monitor queue entries should expose the live monitor stage",
  );

  const discoveryMonitorRecord = expectFocus(DISCOVERY_MONITOR_RECORD_PATH);
  assert.equal(discoveryMonitorRecord.integrityState, "ok");
  assert.equal(discoveryMonitorRecord.artifactKind, "discovery_monitor_record");
  assert.equal(discoveryMonitorRecord.currentStage, "discovery.monitor.active");
  assert.equal(
    discoveryMonitorRecord.currentHead.artifactPath,
    DISCOVERY_MONITOR_RECORD_PATH,
    "Direct monitor focus should treat the monitor artifact as the current head",
  );
  assert.equal(
    discoveryMonitorRecord.nextLegalStep,
    "Keep the source in Discovery monitor until a later explicit reroute decision is justified.",
    "Monitor artifacts should expose a bounded Discovery hold next step",
  );

  const legacyRuntimeFollowUpFocus = expectFocus(LEGACY_RUNTIME_FOLLOW_UP_PATH);
  assert.equal(
    legacyRuntimeFollowUpFocus.integrityState,
    "ok",
    "The deferred legacy Runtime follow-up should resolve cleanly instead of crashing the canonical report",
  );
  assert.equal(legacyRuntimeFollowUpFocus.artifactKind, "runtime_follow_up_legacy");
  assert.equal(legacyRuntimeFollowUpFocus.candidateId, "al-parked-cli-anything");
  assert.equal(legacyRuntimeFollowUpFocus.candidateName, "CLI-Anything");
  assert.equal(
    legacyRuntimeFollowUpFocus.artifactStage,
    "runtime.follow_up.legacy_deferred",
    "The deferred legacy Runtime follow-up should keep an explicit legacy-deferred artifact stage",
  );
  assert.equal(
    legacyRuntimeFollowUpFocus.currentStage,
    "runtime.follow_up.legacy_deferred",
    "The deferred legacy Runtime follow-up should remain parked at its own read-only current stage",
  );
  assert.equal(
    legacyRuntimeFollowUpFocus.currentHead.artifactPath,
    LEGACY_RUNTIME_FOLLOW_UP_PATH,
    "The deferred legacy Runtime follow-up should become its own live current head",
  );
  assert.equal(
    legacyRuntimeFollowUpFocus.runtime?.proposedHost,
    "Mission Control",
    "The deferred legacy Runtime follow-up should preserve its declared host in canonical focus",
  );
  assert.equal(
    legacyRuntimeFollowUpFocus.routeTarget,
    "defer",
    "The deferred legacy Runtime follow-up should preserve its Discovery defer route when the queue still records it",
  );
  assert.equal(
    legacyRuntimeFollowUpFocus.nextLegalStep,
    "No automatic Runtime step is open; this historical deferred Runtime follow-up remains parked unless a new bounded Runtime v0 re-entry is explicitly opened.",
  );

  const legacyRuntimeActiveFollowUpFocus = expectFocus(LEGACY_RUNTIME_ACTIVE_FOLLOW_UP_PATH);
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.integrityState,
    "ok",
    "The active bounded legacy Runtime follow-up should resolve cleanly instead of surfacing a false missing deferred-contract error",
  );
  assert.equal(legacyRuntimeActiveFollowUpFocus.artifactKind, "runtime_follow_up_legacy");
  assert.equal(legacyRuntimeActiveFollowUpFocus.candidateId, "scientify-literature-monitoring");
  assert.equal(legacyRuntimeActiveFollowUpFocus.candidateName, "scientify literature monitoring workflow");
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.artifactStage,
    "runtime.follow_up.legacy_recorded",
    "The active bounded legacy Runtime follow-up should remain at a read-only legacy-recorded stage",
  );
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.currentStage,
    "runtime.follow_up.legacy_recorded",
    "The active bounded legacy Runtime follow-up should remain parked at its own read-only current stage",
  );
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.currentHead.artifactPath,
    LEGACY_RUNTIME_ACTIVE_FOLLOW_UP_PATH,
    "The active bounded legacy Runtime follow-up should become its own live current head",
  );
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.runtime?.proposedHost,
    "OpenClaw",
    "The active bounded legacy Runtime follow-up should preserve its declared host in canonical focus",
  );
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.inconsistentLinks.length,
    0,
    `The active bounded legacy Runtime follow-up should not invent a deferred re-entry requirement: ${legacyRuntimeActiveFollowUpFocus.inconsistentLinks.join(", ")}`,
  );
  assert.equal(
    legacyRuntimeActiveFollowUpFocus.nextLegalStep,
    "No automatic Runtime step is open; this historical Runtime follow-up remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
  );

  for (const [relativePath, candidateId, candidateName, currentStatus] of [
    [LEGACY_RUNTIME_AGENT_ORCHESTRATOR_FOLLOW_UP_PATH, "agent-orchestrator", "Agent-Orchestrator", "active"],
    [LEGACY_RUNTIME_PROMPTFOO_FOLLOW_UP_PATH, "promptfoo", "Promptfoo", "planned"],
    [
      LEGACY_RUNTIME_PUPPETEER_FOLLOW_UP_PATH,
      "puppeteer-browser",
      "Puppeteer Browser",
      "completed (bounded browser smoke lane promoted 2026-03-21)",
    ],
  ] as const) {
    const legacyNarrativeRuntimeFollowUpFocus = expectFocus(relativePath);
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.integrityState,
      "ok",
      `The legacy narrative Runtime follow-up should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyNarrativeRuntimeFollowUpFocus.artifactKind, "runtime_follow_up_legacy");
    assert.equal(legacyNarrativeRuntimeFollowUpFocus.candidateId, candidateId);
    assert.equal(legacyNarrativeRuntimeFollowUpFocus.candidateName, candidateName);
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.artifactStage,
      "runtime.follow_up.legacy_recorded",
      `The legacy narrative Runtime follow-up should remain at a read-only legacy-recorded stage: ${relativePath}`,
    );
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.currentStage,
      "runtime.follow_up.legacy_recorded",
      `The legacy narrative Runtime follow-up should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.currentHead.artifactPath,
      relativePath,
      `The legacy narrative Runtime follow-up should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime follow-up remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.inconsistentLinks.length,
      0,
      `The legacy narrative Runtime follow-up should not invent broken downstream requirements: ${relativePath}`,
    );
    assert.equal(
      legacyNarrativeRuntimeFollowUpFocus.artifactStage === "runtime.follow_up.legacy_recorded",
      true,
      `The legacy narrative Runtime follow-up should keep the recorded stage for status ${currentStatus}: ${relativePath}`,
    );
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [LEGACY_RUNTIME_HANDOFF_AUTORESEARCH_PATH, "autoresearch", "autoresearch Bounded Run", "Mission Control"],
    [LEGACY_RUNTIME_HANDOFF_SCIENTIFY_PATH, "scientify-literature-monitoring", "scientify literature monitoring", "OpenClaw as first reference host"],
  ] as const) {
    const legacyRuntimeHandoffFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeHandoffFocus.integrityState,
      "ok",
      `The legacy Runtime handoff should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyRuntimeHandoffFocus.artifactKind, "runtime_handoff_legacy");
    assert.equal(legacyRuntimeHandoffFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeHandoffFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeHandoffFocus.artifactStage,
      "runtime.handoff.legacy_recorded",
      `Legacy Runtime handoffs should keep an explicit historical handoff artifact stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeHandoffFocus.currentStage,
      "runtime.handoff.legacy_recorded",
      `Legacy Runtime handoffs should remain read-only historical current heads: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeHandoffFocus.currentHead.artifactPath,
      relativePath,
      `Legacy Runtime handoffs should become their own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeHandoffFocus.runtime?.proposedHost,
      proposedHost,
      `Legacy Runtime handoffs should preserve their declared host in canonical focus: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeHandoffFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical architecture-to-runtime handoff remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [LEGACY_RUNTIME_AGENTICS_RECORD_PATH, "agentics", "agentics", "Mission Control"],
    [LEGACY_RUNTIME_PROMPTFOO_RECORD_PATH, "promptfoo", "promptfoo", "Mission Control"],
    [
      LEGACY_RUNTIME_SCIENTIFY_RECORD_PATH,
      "scientify-literature-monitoring",
      "scientify literature monitoring workflow",
      "OpenClaw",
    ],
    [
      LEGACY_RUNTIME_CLI_ANYTHING_REENTRY_RECORD_PATH,
      "al-parked-cli-anything",
      "CLI-Anything",
      "Mission Control",
    ],
  ] as const) {
    const legacyRuntimeRecordFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeRecordFocus.integrityState,
      "ok",
      `The legacy Runtime record should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyRuntimeRecordFocus.artifactKind, "runtime_record_legacy");
    assert.equal(legacyRuntimeRecordFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeRecordFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeRecordFocus.artifactStage,
      "runtime.record.legacy_recorded",
      `The legacy Runtime record should remain at a read-only legacy-recorded stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRecordFocus.currentStage,
      "runtime.record.legacy_recorded",
      `The legacy Runtime record should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRecordFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime record should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRecordFocus.runtime?.proposedHost,
      proposedHost,
      `The legacy Runtime record should preserve its declared host in canonical focus: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRecordFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [LEGACY_RUNTIME_PROMPTFOO_SLICE_PROOF_PATH, "promptfoo", "Promptfoo", "Mission Control"],
    [LEGACY_RUNTIME_AGENT_ORCHESTRATOR_SLICE_PROOF_PATH, "agent-orchestrator", "agent-orchestrator", null],
    [LEGACY_RUNTIME_SUPERPOWERS_SLICE_PROOF_PATH, "superpowers", "Superpowers", "Mission Control"],
  ] as const) {
    const legacyRuntimeSliceProofFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeSliceProofFocus.integrityState,
      "ok",
      `The legacy Runtime slice proof should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyRuntimeSliceProofFocus.artifactKind, "runtime_slice_proof_legacy");
    assert.equal(legacyRuntimeSliceProofFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeSliceProofFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeSliceProofFocus.artifactStage,
      "runtime.slice_proof.legacy_recorded",
      `The legacy Runtime slice proof should remain at a read-only legacy-recorded stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceProofFocus.currentStage,
      "runtime.slice_proof.legacy_recorded",
      `The legacy Runtime slice proof should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceProofFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime slice proof should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceProofFocus.runtime?.proposedHost ?? null,
      proposedHost,
      `The legacy Runtime slice proof should preserve its inferred or linked host when available: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceProofFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime slice proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    expectNoDrift(relativePath, legacyRuntimeSliceProofFocus);
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [LEGACY_RUNTIME_AGENT_ORCHESTRATOR_SLICE_EXECUTION_PATH, "agent-orchestrator", "Agent-Orchestrator CLI", null],
    [LEGACY_RUNTIME_PUPPETEER_SLICE_EXECUTION_PATH, "puppeteer", "Puppeteer", "Mission Control"],
    [LEGACY_RUNTIME_SKILLS_MANAGER_SLICE_EXECUTION_PATH, "skills-manager", "skills-manager", "Mission Control"],
    [LEGACY_RUNTIME_MINI_SWE_FALLBACK_REHEARSAL_PATH, "mini-swe-agent", "Mini-SWE-Agent", null],
  ] as const) {
    const legacyRuntimeSliceExecutionFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeSliceExecutionFocus.integrityState,
      "ok",
      `The legacy Runtime slice execution should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyRuntimeSliceExecutionFocus.artifactKind, "runtime_slice_execution_legacy");
    assert.equal(legacyRuntimeSliceExecutionFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeSliceExecutionFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeSliceExecutionFocus.artifactStage,
      "runtime.slice_execution.legacy_recorded",
      `The legacy Runtime slice execution should remain at a read-only legacy-recorded stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceExecutionFocus.currentStage,
      "runtime.slice_execution.legacy_recorded",
      `The legacy Runtime slice execution should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceExecutionFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime slice execution should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceExecutionFocus.runtime?.proposedHost ?? null,
      proposedHost,
      `The legacy Runtime slice execution should preserve its inferred or linked host when available: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceExecutionFocus.linkedArtifacts.runtimeProofPath ?? null,
      relativePath === LEGACY_RUNTIME_MINI_SWE_FALLBACK_REHEARSAL_PATH ? null : legacyRuntimeSliceExecutionFocus.linkedArtifacts.runtimeProofPath,
      `The legacy Runtime slice execution should preserve only truthful proof linkage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSliceExecutionFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime slice execution remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    expectNoDrift(relativePath, legacyRuntimeSliceExecutionFocus);
  }

  const legacyRuntimeProofChecklistFocus = expectFocus(LEGACY_RUNTIME_SCIENTIFY_PROOF_CHECKLIST_PATH);
  assert.equal(
    legacyRuntimeProofChecklistFocus.integrityState,
    "ok",
    "The legacy Runtime proof checklist should resolve cleanly instead of crashing the canonical report",
  );
  assert.equal(legacyRuntimeProofChecklistFocus.artifactKind, "runtime_proof_checklist_legacy");
  assert.equal(legacyRuntimeProofChecklistFocus.candidateId, "scientify-literature-monitoring");
  assert.equal(legacyRuntimeProofChecklistFocus.candidateName, "scientify literature monitoring workflow");
  assert.equal(legacyRuntimeProofChecklistFocus.artifactStage, "runtime.proof_checklist.legacy_recorded");
  assert.equal(legacyRuntimeProofChecklistFocus.currentStage, "runtime.proof_checklist.legacy_recorded");
  assert.equal(
    legacyRuntimeProofChecklistFocus.currentHead.artifactPath,
    LEGACY_RUNTIME_SCIENTIFY_PROOF_CHECKLIST_PATH,
    "The legacy Runtime proof checklist should become its own live current head",
  );
  assert.equal(
    legacyRuntimeProofChecklistFocus.runtime?.proposedHost,
    "OpenClaw",
    "The legacy Runtime proof checklist should preserve the linked runtime-record host",
  );
  assert.equal(
    legacyRuntimeProofChecklistFocus.nextLegalStep,
    "No automatic Runtime step is open; this historical Runtime proof checklist remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
  );
  expectNoDrift(LEGACY_RUNTIME_SCIENTIFY_PROOF_CHECKLIST_PATH, legacyRuntimeProofChecklistFocus);

  const legacyRuntimeLiveFetchProofFocus = expectFocus(LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_PROOF_PATH);
  assert.equal(
    legacyRuntimeLiveFetchProofFocus.integrityState,
    "ok",
    "The legacy Runtime live-fetch proof should resolve cleanly instead of crashing the canonical report",
  );
  assert.equal(legacyRuntimeLiveFetchProofFocus.artifactKind, "runtime_live_fetch_proof_legacy");
  assert.equal(legacyRuntimeLiveFetchProofFocus.candidateId, "scientify-literature-monitoring");
  assert.equal(legacyRuntimeLiveFetchProofFocus.candidateName, "Scientify Literature Monitoring");
  assert.equal(legacyRuntimeLiveFetchProofFocus.artifactStage, "runtime.live_fetch_proof.legacy_recorded");
  assert.equal(legacyRuntimeLiveFetchProofFocus.currentStage, "runtime.live_fetch_proof.legacy_recorded");
  assert.equal(
    legacyRuntimeLiveFetchProofFocus.currentHead.artifactPath,
    LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_PROOF_PATH,
    "The legacy Runtime live-fetch proof should become its own live current head",
  );
  assert.equal(
    legacyRuntimeLiveFetchProofFocus.runtime?.proposedHost,
    "OpenClaw",
    "The legacy Runtime live-fetch proof should preserve the linked runtime-record host",
  );
  assert.equal(
    legacyRuntimeLiveFetchProofFocus.nextLegalStep,
    "No automatic Runtime step is open; this historical Runtime live-fetch proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
  );
  expectNoDrift(LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_PROOF_PATH, legacyRuntimeLiveFetchProofFocus);

  const legacyRuntimeLiveFetchGateSnapshotFocus = expectFocus(
    LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_GATE_SNAPSHOT_PATH,
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.integrityState,
    "ok",
    "The legacy Runtime live-fetch gate snapshot should resolve cleanly instead of crashing the canonical report",
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.artifactKind,
    "runtime_live_fetch_gate_snapshot_legacy",
  );
  assert.equal(legacyRuntimeLiveFetchGateSnapshotFocus.candidateId, "scientify-literature-monitoring");
  assert.equal(legacyRuntimeLiveFetchGateSnapshotFocus.candidateName, "Scientify Literature Monitoring");
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.artifactStage,
    "runtime.live_fetch_gate_snapshot.legacy_recorded",
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.currentStage,
    "runtime.live_fetch_gate_snapshot.legacy_recorded",
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.currentHead.artifactPath,
    LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_GATE_SNAPSHOT_PATH,
    "The legacy Runtime live-fetch gate snapshot should become its own live current head",
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.linkedArtifacts.runtimeProofPath,
    LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_PROOF_PATH,
    "The legacy Runtime live-fetch gate snapshot should link back to the live-fetch proof artifact",
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.runtime?.proposedHost,
    "OpenClaw",
    "The legacy Runtime live-fetch gate snapshot should preserve the linked runtime-record host",
  );
  assert.equal(
    legacyRuntimeLiveFetchGateSnapshotFocus.nextLegalStep,
    "No automatic Runtime step is open; this historical Runtime live-fetch gate snapshot remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
  );
  expectNoDrift(
    LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_GATE_SNAPSHOT_PATH,
    legacyRuntimeLiveFetchGateSnapshotFocus,
  );

  for (const [relativePath, expectedStage] of [
    [
      LEGACY_RUNTIME_SCIENTIFY_LIVE_QUALIFIED_POOL_PATH,
      "runtime.live_qualified_pool.legacy_recorded",
    ],
    [
      LEGACY_RUNTIME_SCIENTIFY_LIVE_DEGRADED_POOL_PATH,
      "runtime.live_degraded_pool.legacy_recorded",
    ],
  ] as const) {
    const legacyRuntimeLivePoolFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeLivePoolFocus.integrityState,
      "ok",
      `The legacy Runtime live pool artifact should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeLivePoolFocus.artifactKind,
      "runtime_live_pool_artifact_legacy",
      `The legacy Runtime live pool artifact should use the shared live-pool artifact kind: ${relativePath}`,
    );
    assert.equal(legacyRuntimeLivePoolFocus.candidateId, "scientify-literature-monitoring");
    assert.equal(legacyRuntimeLivePoolFocus.candidateName, "Scientify Literature Monitoring");
    assert.equal(legacyRuntimeLivePoolFocus.artifactStage, expectedStage);
    assert.equal(legacyRuntimeLivePoolFocus.currentStage, expectedStage);
    assert.equal(
      legacyRuntimeLivePoolFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime live pool artifact should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeLivePoolFocus.linkedArtifacts.runtimeProofPath,
      LEGACY_RUNTIME_SCIENTIFY_LIVE_FETCH_PROOF_PATH,
      `The legacy Runtime live pool artifact should link back to the live-fetch proof artifact: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeLivePoolFocus.runtime?.proposedHost,
      "OpenClaw",
      `The legacy Runtime live pool artifact should preserve the linked runtime-record host: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeLivePoolFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime live pool artifact remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    expectNoDrift(relativePath, legacyRuntimeLivePoolFocus);
  }

  for (const [relativePath, expectedStage] of [
    [
      LEGACY_RUNTIME_SCIENTIFY_SAMPLE_QUALIFIED_POOL_PATH,
      "runtime.sample_qualified_pool.legacy_recorded",
    ],
    [
      LEGACY_RUNTIME_SCIENTIFY_SAMPLE_DEGRADED_POOL_PATH,
      "runtime.sample_degraded_pool.legacy_recorded",
    ],
  ] as const) {
    const legacyRuntimeSamplePoolFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeSamplePoolFocus.integrityState,
      "ok",
      `The legacy Runtime sample pool artifact should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSamplePoolFocus.artifactKind,
      "runtime_sample_pool_artifact_legacy",
      `The legacy Runtime sample pool artifact should use the shared sample-pool artifact kind: ${relativePath}`,
    );
    assert.equal(legacyRuntimeSamplePoolFocus.candidateId, "scientify-literature-monitoring");
    assert.equal(legacyRuntimeSamplePoolFocus.candidateName, "Scientify Literature Monitoring");
    assert.equal(legacyRuntimeSamplePoolFocus.artifactStage, expectedStage);
    assert.equal(legacyRuntimeSamplePoolFocus.currentStage, expectedStage);
    assert.equal(
      legacyRuntimeSamplePoolFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime sample pool artifact should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSamplePoolFocus.linkedArtifacts.runtimeProofPath,
      null,
      `The legacy Runtime sample pool artifact should remain read-only standalone evidence without a live-proof link: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSamplePoolFocus.runtime?.proposedHost ?? null,
      null,
      `The legacy Runtime sample pool artifact should not invent a host surface: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSamplePoolFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime sample pool artifact remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    expectNoDrift(relativePath, legacyRuntimeSamplePoolFocus);
  }

  for (const [relativePath, candidateId, candidateName] of [
    [
      LEGACY_RUNTIME_SYSTEM_BUNDLE_02_PATH,
      "runtime-system-bundle-02-boundary-inventory",
      "Boundary Inventory",
    ],
    [
      LEGACY_RUNTIME_SYSTEM_BUNDLE_03_PATH,
      "runtime-system-bundle-03-source-pack-catalog-cleanup",
      "Source-Pack Catalog and Activation Cleanup",
    ],
    [
      LEGACY_RUNTIME_SYSTEM_BUNDLE_04_PATH,
      "runtime-system-bundle-04-promotion-profile-normalization",
      "Promotion Profile Family Normalization",
    ],
    [
      LEGACY_RUNTIME_SYSTEM_BUNDLE_05_PATH,
      "runtime-system-bundle-05-import-source-policy-alignment",
      "Import-Source Policy Alignment",
    ],
    [
      LEGACY_RUNTIME_SYSTEM_BUNDLE_06_PATH,
      "runtime-system-bundle-06-legacy-live-runtime-normalization",
      "Legacy Live-Runtime Normalization",
    ],
  ] as const) {
    const legacyRuntimeSystemBundleFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeSystemBundleFocus.integrityState,
      "ok",
      `The legacy Runtime system-bundle note should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSystemBundleFocus.artifactKind,
      "runtime_system_bundle_note_legacy",
      `The legacy Runtime system-bundle note should use the shared system-bundle artifact kind: ${relativePath}`,
    );
    assert.equal(legacyRuntimeSystemBundleFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeSystemBundleFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeSystemBundleFocus.artifactStage,
      "runtime.system_bundle.legacy_recorded",
      `The legacy Runtime system-bundle note should remain at a read-only system-bundle stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSystemBundleFocus.currentStage,
      "runtime.system_bundle.legacy_recorded",
      `The legacy Runtime system-bundle note should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSystemBundleFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime system-bundle note should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSystemBundleFocus.linkedArtifacts.runtimeProofPath,
      null,
      `The legacy Runtime system-bundle note should not invent a linked runtime proof: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSystemBundleFocus.runtime?.proposedHost ?? null,
      null,
      `The legacy Runtime system-bundle note should not invent a host surface: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeSystemBundleFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime system-bundle note remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    expectNoDrift(relativePath, legacyRuntimeSystemBundleFocus);
  }

  for (const [relativePath, candidateId, candidateName] of [
    [
      LEGACY_RUNTIME_AGENTICS_DOCS_VALIDATION_PATH,
      "agentics-docs-maintenance-validation",
      "Directive Docs Maintenance Validation (Agentics Slice 2)",
    ],
    [
      LEGACY_RUNTIME_AGENTICS_DOCS_VALIDATION_RERUN_PATH,
      "agentics-docs-maintenance-validation-rerun",
      "Directive Docs Maintenance Validation (Agentics Slice 2 Rerun)",
    ],
  ] as const) {
    const legacyRuntimeValidationNoteFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeValidationNoteFocus.integrityState,
      "ok",
      `The legacy Runtime validation note should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeValidationNoteFocus.artifactKind,
      "runtime_validation_note_legacy",
      `The legacy Runtime validation note should use the shared validation-note artifact kind: ${relativePath}`,
    );
    assert.equal(legacyRuntimeValidationNoteFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeValidationNoteFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeValidationNoteFocus.artifactStage,
      "runtime.validation_note.legacy_recorded",
      `The legacy Runtime validation note should remain at a read-only validation-note stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeValidationNoteFocus.currentStage,
      "runtime.validation_note.legacy_recorded",
      `The legacy Runtime validation note should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeValidationNoteFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime validation note should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeValidationNoteFocus.linkedArtifacts.runtimeProofPath,
      null,
      `The legacy Runtime validation note should not invent a linked runtime proof: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeValidationNoteFocus.runtime?.proposedHost ?? null,
      null,
      `The legacy Runtime validation note should not invent a host surface: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeValidationNoteFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime validation note remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
    expectNoDrift(relativePath, legacyRuntimeValidationNoteFocus);
  }

  for (const [relativePath, expectedStage, expectedFollowUpPath] of [
    [
      LEGACY_RUNTIME_AGENT_ORCHESTRATOR_PRECONDITION_PROOF_PATH,
      "runtime.precondition_proof.legacy_recorded",
      LEGACY_RUNTIME_AGENT_ORCHESTRATOR_FOLLOW_UP_PATH,
    ],
    [
      LEGACY_RUNTIME_AGENT_ORCHESTRATOR_PRECONDITION_CORRECTION_PATH,
      "runtime.precondition_correction.legacy_recorded",
      null,
    ],
    [
      LEGACY_RUNTIME_AGENT_ORCHESTRATOR_HOST_ADAPTER_DECISION_PATH,
      "runtime.host_adapter_decision.legacy_recorded",
      LEGACY_RUNTIME_AGENT_ORCHESTRATOR_FOLLOW_UP_PATH,
    ],
  ] as const) {
    const legacyRuntimePreconditionDecisionNoteFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimePreconditionDecisionNoteFocus.integrityState,
      "ok",
      `The legacy Runtime precondition/decision note should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePreconditionDecisionNoteFocus.artifactKind,
      "runtime_precondition_decision_note_legacy",
      `The legacy Runtime precondition/decision note should use the shared artifact kind: ${relativePath}`,
    );
    assert.equal(legacyRuntimePreconditionDecisionNoteFocus.candidateId, "agent-orchestrator");
    assert.equal(legacyRuntimePreconditionDecisionNoteFocus.candidateName, "Agent-Orchestrator");
    assert.equal(legacyRuntimePreconditionDecisionNoteFocus.artifactStage, expectedStage);
    assert.equal(legacyRuntimePreconditionDecisionNoteFocus.currentStage, expectedStage);
    assert.equal(
      legacyRuntimePreconditionDecisionNoteFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime precondition/decision note should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePreconditionDecisionNoteFocus.linkedArtifacts.runtimeFollowUpPath ?? null,
      expectedFollowUpPath,
      `The legacy Runtime precondition/decision note should preserve only truthful follow-up linkage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePreconditionDecisionNoteFocus.runtime?.proposedHost ?? null,
      null,
      `The legacy Runtime precondition/decision note should not invent a host surface: ${relativePath}`,
    );
    const expectedNextStep =
      expectedStage === "runtime.precondition_proof.legacy_recorded"
        ? "No automatic Runtime step is open; this historical Runtime CLI precondition proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened."
        : expectedStage === "runtime.precondition_correction.legacy_recorded"
          ? "No automatic Runtime step is open; this historical Runtime precondition correction remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened."
          : "No automatic Runtime step is open; this historical Runtime host-adapter decision remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.";
    assert.equal(legacyRuntimePreconditionDecisionNoteFocus.nextLegalStep, expectedNextStep);
    expectNoDrift(relativePath, legacyRuntimePreconditionDecisionNoteFocus);
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [LEGACY_RUNTIME_AGENTICS_REGISTRY_PATH, "agentics", "agentics", "Mission Control"],
    [LEGACY_RUNTIME_PROMPTFOO_REGISTRY_PATH, "promptfoo", "promptfoo", "Mission Control"],
    [
      LEGACY_RUNTIME_V0_NORMALIZER_REGISTRY_PATH,
      "dw-transform-v0-normalizer-consolidation",
      "v0 Normalizer Transformation",
      "Mission Control",
    ],
  ] as const) {
    const legacyRuntimeRegistryFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimeRegistryFocus.integrityState,
      "ok",
      `The legacy Runtime registry entry should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyRuntimeRegistryFocus.artifactKind, "runtime_registry_legacy");
    assert.equal(legacyRuntimeRegistryFocus.candidateId, candidateId);
    assert.equal(legacyRuntimeRegistryFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimeRegistryFocus.artifactStage,
      "runtime.registry.legacy_recorded",
      `The legacy Runtime registry entry should remain at a read-only legacy registry stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRegistryFocus.currentStage,
      "runtime.registry.legacy_recorded",
      `The legacy Runtime registry entry should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRegistryFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime registry entry should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRegistryFocus.runtime?.proposedHost,
      proposedHost,
      `The legacy Runtime registry entry should preserve its declared host in canonical focus: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimeRegistryFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime registry entry remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [LEGACY_RUNTIME_AGENTICS_PROMOTION_RECORD_PATH, "agentics", "agentics", "Mission Control"],
    [LEGACY_RUNTIME_PROMPTFOO_PROMOTION_RECORD_PATH, "promptfoo", "promptfoo", "Mission Control"],
    [
      LEGACY_RUNTIME_V0_NORMALIZER_PROMOTION_RECORD_PATH,
      "dw-transform-v0-normalizer-consolidation",
      "v0.ts Normalizer Consolidation",
      "Mission Control",
    ],
  ] as const) {
    const legacyRuntimePromotionRecordFocus = expectFocus(relativePath);
    assert.equal(
      legacyRuntimePromotionRecordFocus.integrityState,
      "ok",
      `The legacy Runtime promotion record should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyRuntimePromotionRecordFocus.artifactKind, "runtime_promotion_record_legacy");
    assert.equal(legacyRuntimePromotionRecordFocus.candidateId, candidateId);
    assert.equal(legacyRuntimePromotionRecordFocus.candidateName, candidateName);
    assert.equal(
      legacyRuntimePromotionRecordFocus.artifactStage,
      "runtime.promotion_record.legacy_recorded",
      `The legacy Runtime promotion record should remain at a read-only historical promotion stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePromotionRecordFocus.currentStage,
      "runtime.promotion_record.legacy_recorded",
      `The legacy Runtime promotion record should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePromotionRecordFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime promotion record should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePromotionRecordFocus.runtime?.proposedHost,
      proposedHost,
      `The legacy Runtime promotion record should preserve its declared host in canonical focus: ${relativePath}`,
    );
    assert.equal(
      legacyRuntimePromotionRecordFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime promotion record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [
      LEGACY_RUNTIME_ASYNC_LATENCY_TRANSFORMATION_RECORD_PATH,
      "dw-transform-context-pack-async-latency",
      "Context Pack Async Surface Concurrency",
      null,
    ],
    [
      LEGACY_RUNTIME_V0_NORMALIZER_TRANSFORMATION_RECORD_PATH,
      "dw-transform-v0-normalizer-consolidation",
      "v0.ts Normalizer Consolidation",
      "Mission Control",
    ],
    [
      LEGACY_RUNTIME_REMAINING_BACKEND_TRANSFORMATION_RECORD_PATH,
      "dw-transform-remaining-backend-test-boilerplate",
      "Remaining Backend Test Boilerplate Consolidation",
      null,
    ],
    [
      LEGACY_RUNTIME_AUTOMATION_TEST_TRANSFORMATION_RECORD_PATH,
      "dw-transform-automation-test-boilerplate",
      "Automation Backend Test Boilerplate Consolidation",
      null,
    ],
    [
      LEGACY_RUNTIME_REPO_SNAPSHOT_CODE_INTEL_TRANSFORMATION_RECORD_PATH,
      "dw-transform-repo-snapshot-code-intel-cache",
      "Repo Snapshot Code-Intel Cache Transformation",
      null,
    ],
  ] as const) {
    const legacyTransformationRecordFocus = expectFocus(relativePath);
    assert.equal(
      legacyTransformationRecordFocus.integrityState,
      "ok",
      `The legacy Runtime transformation record should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyTransformationRecordFocus.artifactKind, "runtime_transformation_record_legacy");
    assert.equal(legacyTransformationRecordFocus.candidateId, candidateId);
    assert.equal(legacyTransformationRecordFocus.candidateName, candidateName);
    assert.equal(
      legacyTransformationRecordFocus.artifactStage,
      "runtime.transformation_record.legacy_recorded",
      `The legacy Runtime transformation record should remain at a read-only historical transformation stage: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationRecordFocus.currentStage,
      "runtime.transformation_record.legacy_recorded",
      `The legacy Runtime transformation record should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationRecordFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime transformation record should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationRecordFocus.runtime?.proposedHost ?? null,
      proposedHost,
      `The legacy Runtime transformation record should preserve its linked host when available: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationRecordFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime transformation record remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
  }

  for (const [relativePath, candidateId, candidateName, proposedHost] of [
    [
      LEGACY_RUNTIME_ASYNC_LATENCY_TRANSFORMATION_PROOF_PATH,
      "dw-transform-context-pack-async-latency",
      "Context Pack Async Surface Concurrency",
      null,
    ],
    [
      LEGACY_RUNTIME_V0_NORMALIZER_TRANSFORMATION_PROOF_PATH,
      "dw-transform-v0-normalizer-consolidation",
      "v0.ts Normalizer Consolidation",
      "Mission Control",
    ],
    [
      LEGACY_RUNTIME_REPO_SNAPSHOT_CODE_INTEL_TRANSFORMATION_PROOF_PATH,
      "dw-transform-repo-snapshot-code-intel-cache",
      "Repo Snapshot Code-Intel Cache Transformation",
      null,
    ],
  ] as const) {
    const legacyTransformationProofFocus = expectFocus(relativePath);
    assert.equal(
      legacyTransformationProofFocus.integrityState,
      "ok",
      `The legacy Runtime transformation proof should resolve cleanly instead of crashing the canonical report: ${relativePath}`,
    );
    assert.equal(legacyTransformationProofFocus.artifactKind, "runtime_transformation_proof_legacy");
    assert.equal(legacyTransformationProofFocus.candidateId, candidateId);
    assert.equal(legacyTransformationProofFocus.candidateName, candidateName);
    assert.equal(
      legacyTransformationProofFocus.artifactStage,
      "runtime.transformation_proof.legacy_recorded",
      `The legacy Runtime transformation proof should remain at a read-only historical proof stage: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationProofFocus.currentStage,
      "runtime.transformation_proof.legacy_recorded",
      `The legacy Runtime transformation proof should remain parked at its own read-only current stage: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationProofFocus.currentHead.artifactPath,
      relativePath,
      `The legacy Runtime transformation proof should become its own live current head: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationProofFocus.runtime?.proposedHost ?? null,
      proposedHost,
      `The legacy Runtime transformation proof should preserve its linked host when available: ${relativePath}`,
    );
    assert.equal(
      legacyTransformationProofFocus.nextLegalStep,
      "No automatic Runtime step is open; this historical Runtime transformation proof remains read-only unless a new bounded Runtime v0 re-entry is explicitly opened.",
    );
  }

  for (const legacyAdoptionCase of LEGACY_ARCHITECTURE_ADOPTION_CASES) {
    const legacyAdoptionFocus = expectFocus(legacyAdoptionCase.artifactPath);
    assert.equal(
      legacyAdoptionFocus.integrityState,
      "ok",
      `Legacy adopted Architecture artifact should resolve cleanly: ${legacyAdoptionCase.artifactPath}`,
    );
    assert.equal(
      legacyAdoptionFocus.artifactKind,
      "architecture_adoption",
      `Legacy adopted Architecture artifact should resolve as an adoption record: ${legacyAdoptionCase.artifactPath}`,
    );
    assert.equal(legacyAdoptionFocus.candidateId, legacyAdoptionCase.candidateId);
    assert.equal(legacyAdoptionFocus.candidateName, legacyAdoptionCase.candidateName);
    assert.equal(
      legacyAdoptionFocus.currentStage,
      "architecture.adoption.adopted",
      `Legacy adopted Architecture artifact should resolve as an adopted current head: ${legacyAdoptionCase.artifactPath}`,
    );
    assert.equal(
      legacyAdoptionFocus.currentHead.artifactPath,
      legacyAdoptionCase.artifactPath,
      `Legacy adopted Architecture artifact should become its own live current head: ${legacyAdoptionCase.artifactPath}`,
    );
    expectPendingNextArtifactGap(
      legacyAdoptionCase.artifactPath,
      legacyAdoptionFocus,
      LEGACY_ARCHITECTURE_IMPLEMENTATION_TARGET_GAP,
    );
  }

  for (const startPath of INTERNAL_ARCHITECTURE_2026_03_28_START_CASES) {
    const startFocus = expectFocus(startPath);
    assert.equal(
      startFocus.integrityState,
      "ok",
      `Internally-generated 2026-03-28 Architecture bounded start should resolve cleanly: ${startPath}`,
    );
    assert.equal(
      startFocus.artifactKind,
      "architecture_bounded_start",
      `Internally-generated 2026-03-28 Architecture bounded start should resolve as a bounded start: ${startPath}`,
    );
    assert.equal(
      startFocus.artifactStage,
      "architecture.bounded_start.opened",
      `Internally-generated 2026-03-28 Architecture bounded start should keep the bounded-start artifact stage: ${startPath}`,
    );
    assert.equal(
      startFocus.currentStage,
      "architecture.implementation_result.success",
      `Internally-generated 2026-03-28 Architecture bounded start should now resolve through adoption into the implementation result: ${startPath}`,
    );
    expectPendingNextArtifactGap(
      startPath,
      startFocus,
      "architecture/06-retained/*.md",
    );
  }

  for (const guardedStart of CURRENT_BOUNDED_START_PARSE_GUARD_CASES) {
    const startArtifact = readDirectiveArchitectureBoundedStartArtifact({
      directiveRoot: DIRECTIVE_ROOT,
      startPath: guardedStart.startPath,
    });
    assert.equal(
      startArtifact.candidateId,
      guardedStart.candidateId,
      `Current repo-generated bounded start should parse with the expected candidate id: ${guardedStart.startPath}`,
    );
    assert.equal(
      startArtifact.resultExists,
      true,
      `Current repo-generated bounded start should keep its linked bounded-result path: ${guardedStart.startPath}`,
    );
  }

  for (const guardedResult of CURRENT_BOUNDED_RESULT_PARSE_GUARD_CASES) {
    const resultArtifact = readDirectiveArchitectureBoundedResultArtifact({
      directiveRoot: DIRECTIVE_ROOT,
      resultPath: guardedResult.resultPath,
    });
    assert.equal(
      resultArtifact.candidateId,
      guardedResult.candidateId,
      `Current repo-generated bounded result should parse with the expected candidate id: ${guardedResult.resultPath}`,
    );
    assert.equal(
      resultArtifact.verdict,
      guardedResult.verdict,
      `Current repo-generated bounded result should preserve the expected verdict: ${guardedResult.resultPath}`,
    );
  }

  for (const guardedAdoption of CURRENT_ADOPTION_PARSE_GUARD_CASES) {
    const adoptionArtifact = readDirectiveArchitectureAdoptionDetail({
      directiveRoot: DIRECTIVE_ROOT,
      adoptionPath: guardedAdoption.adoptedPath,
    });
    assert.equal(
      adoptionArtifact.candidateId,
      guardedAdoption.candidateId,
      `Current repo-generated adoption should parse with the expected candidate id: ${guardedAdoption.adoptedPath}`,
    );
    assert.equal(
      adoptionArtifact.finalStatus,
      guardedAdoption.finalStatus,
      `Current repo-generated adoption should preserve the expected final status: ${guardedAdoption.adoptedPath}`,
    );
  }

  for (const resultPath of INTERNAL_ARCHITECTURE_2026_03_28_RESULT_CASES) {
    const resultFocus = expectFocus(resultPath);
    assert.equal(
      resultFocus.integrityState,
      "ok",
      `Internally-generated 2026-03-28 Architecture bounded result should resolve cleanly: ${resultPath}`,
    );
    assert.equal(
      resultFocus.artifactKind,
      "architecture_bounded_result",
      `Internally-generated 2026-03-28 Architecture bounded result should resolve as a bounded result: ${resultPath}`,
    );
    assert.equal(
      resultFocus.artifactStage,
      "architecture.bounded_result.adopt",
      `Internally-generated 2026-03-28 Architecture bounded result should keep the adopt artifact stage: ${resultPath}`,
    );
    assert.equal(
      resultFocus.currentStage,
      "architecture.implementation_result.success",
      `Internally-generated 2026-03-28 Architecture bounded result should now resolve through adoption into the implementation result: ${resultPath}`,
    );
    expectPendingNextArtifactGap(
      resultPath,
      resultFocus,
      "architecture/06-retained/*.md",
    );
  }

  const routedProgressArchitectureEntry = queueOverview.entries.find((entry) =>
    entry.candidate_id === ROUTED_PROGRESS_ARCHITECTURE_CANDIDATE_ID
  );
  assert.ok(routedProgressArchitectureEntry, "Missing routed Architecture queue entry for routed-status validation");
  assert.equal(routedProgressArchitectureEntry.status, "routed");
  assert.equal(
    routedProgressArchitectureEntry.status_effective,
    "routed_progressed",
    "Routed Architecture entries should stop advertising clean routed status once the live head progressed downstream",
  );
  assert.match(
    routedProgressArchitectureEntry.status_warning ?? "",
    /live case head has already progressed/i,
    "Progressed routed Architecture entries should explain that the live head moved downstream",
  );

  const routedProgressRuntimeEntry = queueOverview.entries.find((entry) =>
    entry.candidate_id === ROUTED_PROGRESS_RUNTIME_CANDIDATE_ID
  );
  assert.ok(routedProgressRuntimeEntry, "Missing routed Runtime queue entry for routed-status validation");
  assert.equal(routedProgressRuntimeEntry.status, "routed");
  assert.equal(
    routedProgressRuntimeEntry.status_effective,
    "routed_progressed",
    "Routed Runtime entries should stop advertising clean routed status once the live head progressed downstream",
  );

  const routedBrokenEntry = queueOverview.entries.find((entry) =>
    entry.candidate_id === ROUTED_BROKEN_CANDIDATE_ID
  );
  assert.ok(routedBrokenEntry, "Missing routed Architecture handoff queue entry for routed-status validation");
  assert.equal(routedBrokenEntry.status, "routed");
  assert.equal(
    routedBrokenEntry.status_effective,
    "routed",
    "Routed Architecture entries should preserve the raw routed status when the linked handoff stub is now truthful",
  );
  assert.equal(
    routedBrokenEntry.status_warning,
    null,
    "Routed Architecture handoff entries should not surface a stale-status warning once the handoff stub resolves cleanly",
  );
  assert.equal(
    routedBrokenEntry.current_head?.artifact_path,
    "architecture/02-experiments/2026-03-24-dw-live-gpt-researcher-engine-pressure-2026-03-24-engine-handoff.md",
    "Routed Architecture handoff entries should point at the live handoff stub as the current head",
  );
  assert.equal(
    routedBrokenEntry.current_case_stage,
    "architecture.handoff.pending_review",
    "Routed Architecture handoff entries should expose the pending-review Architecture handoff stage",
  );

  const routedPendingControlEntry = queueOverview.entries.find((entry) =>
    entry.candidate_id === ROUTED_PENDING_CONTROL_CANDIDATE_ID
  );
  assert.ok(routedPendingControlEntry, "Missing still-pending routed queue entry for routed-status validation");
  assert.equal(
    routedPendingControlEntry.status_effective,
    "routed",
    "Still-live routed queue entries should preserve the raw routed status when the downstream stub remains current",
  );
  assert.equal(
    routedPendingControlEntry.status_warning,
    null,
    "Still-live routed queue entries should not surface a stale-status warning",
  );

  const runtimeRecordPath = runtimeFollowUp.linkedArtifacts.runtimeRecordPath;
  assert.ok(runtimeRecordPath, "Runtime follow-up should resolve a Runtime v0 record path");

  withStagedDirectiveRoot("negative-route-mismatch", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      "discovery/intake-queue.json",
      ...Object.values(runtimeRoute.linkedArtifacts),
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile("discovery/intake-queue.json", stagedRoot, (content) => {
      const payload = JSON.parse(content) as { entries?: Array<Record<string, unknown>> };
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      const targetEntry = entries.find((entry) => entry.candidate_id === runtimeRoute.candidateId);
      assert.ok(targetEntry, "Expected staged queue entry for Runtime route negative case");
      targetEntry.routing_target = "architecture";
      return `${JSON.stringify(payload, null, 2)}\n`;
    });

    const brokenRoute = expectFocus(RUNTIME_ROUTE_PATH, stagedRoot);
    expectBlockedAdvancement(RUNTIME_ROUTE_PATH, brokenRoute);
    assert.ok(
      brokenRoute.inconsistentLinks.some((entry) => entry.includes("queue routing target")),
      `Expected queue mismatch to be detected, got: ${brokenRoute.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("negative-required-next-artifact-mismatch", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      "discovery/intake-queue.json",
      ...Object.values(runtimeRoute.linkedArtifacts),
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile(RUNTIME_ROUTE_PATH, stagedRoot, (content) =>
      content.replace(
        /^- Required next artifact: .+$/m,
        "- Required next artifact: runtime/follow-up/mismatched-runtime-follow-up-record.md",
      ));

    const brokenRoute = expectFocus(RUNTIME_ROUTE_PATH, stagedRoot);
    expectBlockedAdvancement(RUNTIME_ROUTE_PATH, brokenRoute);
    assert.ok(
      brokenRoute.inconsistentLinks.some((entry) => entry.includes("required downstream artifact")),
      `Expected required-next-artifact mismatch to be detected, got: ${brokenRoute.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("negative-required-next-artifact-missing", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      runtimeRoute.linkedArtifacts.discoveryIntakePath,
      runtimeRoute.linkedArtifacts.discoveryTriagePath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile("discovery/intake-queue.json", stagedRoot, (content) => {
      const payload = JSON.parse(content) as { entries?: Array<Record<string, unknown>> };
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      const targetEntry = entries.find((entry) => entry.candidate_id === runtimeRoute.candidateId);
      assert.ok(targetEntry, "Expected staged queue entry for missing required-next-artifact negative case");
      targetEntry.result_record_path = null;
      return `${JSON.stringify(payload, null, 2)}\n`;
    });

    const brokenRoute = expectFocus(RUNTIME_ROUTE_PATH, stagedRoot);
    expectBlockedAdvancement(RUNTIME_ROUTE_PATH, brokenRoute);
    assert.ok(
      brokenRoute.inconsistentLinks.some((entry) => entry.includes("missing required downstream artifact for legal next step")),
      `Expected missing required-next-artifact legality block, got: ${brokenRoute.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("lifecycle-sync-routed-required-next-artifact", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      RUNTIME_FOLLOW_UP_PATH,
      LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
      "discovery/intake-queue.json",
      runtimeRoute.linkedArtifacts.discoveryIntakePath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    const stagedQueue = JSON.parse(
      fs.readFileSync(path.join(stagedRoot, "discovery", "intake-queue.json"), "utf8"),
    ) as {
      status: string;
      updatedAt: string;
      entries: Array<Record<string, unknown>>;
    };

    const validSync = syncDiscoveryIntakeLifecycle({
      queue: stagedQueue,
      request: {
        candidate_id: runtimeRoute.candidateId!,
        target_phase: "routed",
        routing_target: "runtime",
        intake_record_path: runtimeRoute.linkedArtifacts.discoveryIntakePath,
        routing_record_path: RUNTIME_ROUTE_PATH,
        result_record_path: RUNTIME_FOLLOW_UP_PATH,
        note_append: "composition-check-valid-sync",
      },
      transitionDate: "2026-03-25",
      directiveRoot: stagedRoot,
    });
    assert.equal(
      validSync.entry.result_record_path,
      RUNTIME_FOLLOW_UP_PATH,
      "Lifecycle sync should preserve the canonical required-next artifact when the routed stub matches",
    );

    assert.throws(
      () =>
        syncDiscoveryIntakeLifecycle({
          queue: stagedQueue,
          request: {
            candidate_id: runtimeRoute.candidateId!,
            target_phase: "routed",
            routing_target: "runtime",
            intake_record_path: runtimeRoute.linkedArtifacts.discoveryIntakePath,
            routing_record_path: RUNTIME_ROUTE_PATH,
            result_record_path: LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
            note_append: "composition-check-invalid-sync",
          },
          transitionDate: "2026-03-25",
          directiveRoot: stagedRoot,
        }),
      /required next artifact/i,
      "Lifecycle sync should reject routed queue linkage when the downstream stub conflicts with the routing record",
    );

    assert.throws(
      () =>
        syncDiscoveryIntakeLifecycle({
          queue: stagedQueue,
          request: {
            candidate_id: runtimeRoute.candidateId!,
            target_phase: "routed",
            routing_target: "runtime",
            intake_record_path: runtimeRoute.linkedArtifacts.discoveryIntakePath,
            routing_record_path: RUNTIME_ROUTE_PATH,
            result_record_path: "runtime/follow-up/missing-runtime-follow-up-record.md",
            note_append: "composition-check-missing-sync",
          },
          transitionDate: "2026-03-25",
          directiveRoot: stagedRoot,
        }),
      /result_record_path not found/i,
      "Lifecycle sync should reject routed queue linkage when the concrete downstream stub path does not exist",
    );
  });

  withStagedDirectiveRoot("negative-runtime-record-link", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      runtimeRecordPath,
      runtimeFollowUp.linkedArtifacts.runtimeProofPath,
      runtimeFollowUp.linkedArtifacts.discoveryRoutingPath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile(runtimeRecordPath, stagedRoot, (content) =>
      content.replace(
        /^- Source follow-up record: .+$/m,
        "- Source follow-up record: runtime/follow-up/missing-runtime-follow-up-record.md",
      ));

    const brokenRuntimeRecord = expectFocus(runtimeRecordPath, stagedRoot);
    expectBlockedAdvancement(runtimeRecordPath, brokenRuntimeRecord);
    assert.ok(
      brokenRuntimeRecord.inconsistentLinks.some((entry) => entry.includes("linked follow-up artifact")),
      `Expected missing follow-up link to be detected, got: ${brokenRuntimeRecord.inconsistentLinks.join(", ")}`,
    );
  });

  assert.throws(
    () =>
      openDirectiveRuntimeFollowUp({
        directiveRoot: DIRECTIVE_ROOT,
        followUpPath: RUNTIME_FOLLOW_UP_PATH,
        approved: true,
        approvedBy: "composition-check",
      }),
    /live current stage/i,
    "Historical Runtime follow-up should not reopen downstream work once the live case head moved on",
  );

  assert.throws(
    () =>
      openDirectiveRuntimeRecordProof({
        directiveRoot: DIRECTIVE_ROOT,
        runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
        approved: true,
        approvedBy: "composition-check",
      }),
    /live current stage/i,
    "Historical Runtime record should not reopen proof once the live case head moved on",
  );

  assert.throws(
    () =>
      openDirectiveRuntimeProofRuntimeCapabilityBoundary({
        directiveRoot: DIRECTIVE_ROOT,
        runtimeProofPath: RUNTIME_PROOF_PATH,
        approved: true,
        approvedBy: "composition-check",
      }),
    /live current stage/i,
    "Historical Runtime proof should not reopen the capability boundary once the live case head moved on",
  );

  assert.throws(
    () =>
      openDirectiveRuntimePromotionReadiness({
        directiveRoot: DIRECTIVE_ROOT,
        capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
        approved: true,
        approvedBy: "composition-check",
      }),
    /live current stage/i,
    "Historical Runtime capability boundary should not reopen promotion-readiness once the live case head moved on",
  );

  withStagedDirectiveRoot("negative-capability-boundary-link", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH,
      runtimeCapabilityBoundary.linkedArtifacts.runtimeRecordPath,
      runtimeCapabilityBoundary.linkedArtifacts.runtimeCallableStubPath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    writeRelativeFile(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, stagedRoot, (content) =>
      content.replace(
        /^- Proof artifact: .+$/m,
        "- Proof artifact: runtime/03-proof/missing-proof-artifact.md",
      ));

    const brokenCapabilityBoundary = expectFocus(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, stagedRoot);
    expectBlockedAdvancement(RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH, brokenCapabilityBoundary);
    assert.ok(
      brokenCapabilityBoundary.inconsistentLinks.some((entry) => entry.includes("missing linked Runtime proof artifact")),
      `Expected missing Runtime proof artifact to be detected, got: ${brokenCapabilityBoundary.inconsistentLinks.join(", ")}`,
    );
  });

  withStagedDirectiveRoot("negative-malformed-runtime-record", (stagedRoot) => {
    copyRelativeFile(runtimeRecordPath, stagedRoot);
    writeRelativeFile(runtimeRecordPath, stagedRoot, (content) =>
      content.replace(/^- Current status: .+\r?\n/m, ""),
    );

    assert.throws(
      () => expectFocus(runtimeRecordPath, stagedRoot),
      /current status/i,
      "Malformed Runtime record should fail clearly",
    );
  });

  assert.throws(
    () =>
      resolveDirectiveWorkspaceState({
        directiveRoot: DIRECTIVE_ROOT,
        artifactPath: path.resolve(DIRECTIVE_ROOT, "..", "CLAUDE.md"),
      }),
    /must stay within directive-workspace/i,
    "Artifact paths outside directive-workspace should be rejected",
  );

  withStagedDirectiveRoot("route-opener-approval-idempotency", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_PATH,
      runtimeRoute.linkedArtifacts.discoveryIntakePath,
      runtimeRoute.linkedArtifacts.discoveryTriagePath,
      runtimeRoute.linkedArtifacts.engineRunRecordPath,
      runtimeRoute.linkedArtifacts.engineRunReportPath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () => openDirectiveDiscoveryRoute({ directiveRoot: stagedRoot, routingPath: RUNTIME_ROUTE_PATH }),
      /explicit approval/i,
      "Discovery route opener should require explicit approval",
    );

    const first = openDirectiveDiscoveryRoute({
      directiveRoot: stagedRoot,
      routingPath: RUNTIME_ROUTE_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(first.created, true, "Discovery route opener should create the downstream stub on first approval");

    const second = openDirectiveDiscoveryRoute({
      directiveRoot: stagedRoot,
      routingPath: RUNTIME_ROUTE_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(second.created, false, "Discovery route opener should be idempotent on repeated approval");
  });

  withStagedDirectiveRoot("follow-up-opener-stale-after-open", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
      livePendingRuntimeFollowUp.linkedArtifacts.discoveryRoutingPath,
      livePendingRuntimeFollowUp.linkedArtifacts.discoveryIntakePath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () => openDirectiveRuntimeFollowUp({ directiveRoot: stagedRoot, followUpPath: LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH }),
      /explicit approval/i,
      "Runtime follow-up opener should require explicit approval",
    );

    const first = openDirectiveRuntimeFollowUp({
      directiveRoot: stagedRoot,
      followUpPath: LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(first.created, true, "Runtime follow-up opener should create the Runtime record on first approval");

    assert.throws(
      () =>
        openDirectiveRuntimeFollowUp({
          directiveRoot: stagedRoot,
          followUpPath: LIVE_PENDING_RUNTIME_FOLLOW_UP_PATH,
          approved: true,
          approvedBy: "composition-check",
        }),
      /live current stage/i,
      "Runtime follow-up opener should reject repeated approval after the case advances downstream",
    );
  });

  assert.ok(runtimeFollowUp.linkedArtifacts.runtimeRecordPath, "Runtime follow-up should resolve a Runtime record path");
  withStagedDirectiveRoot("runtime-record-opener-stale-after-open", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      runtimeFollowUp.linkedArtifacts.runtimeRecordPath,
      RUNTIME_FOLLOW_UP_PATH,
      runtimeFollowUp.linkedArtifacts.discoveryRoutingPath,
      runtimeFollowUp.linkedArtifacts.discoveryIntakePath,
      runtimeFollowUp.linkedArtifacts.engineRunRecordPath,
      runtimeFollowUp.linkedArtifacts.engineRunReportPath,
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () =>
        openDirectiveRuntimeRecordProof({
          directiveRoot: stagedRoot,
          runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
        }),
      /explicit approval/i,
      "Runtime record opener should require explicit approval",
    );

    const first = openDirectiveRuntimeRecordProof({
      directiveRoot: stagedRoot,
      runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(first.created, true, "Runtime record opener should create the proof artifact on first approval");

    assert.throws(
      () =>
        openDirectiveRuntimeRecordProof({
          directiveRoot: stagedRoot,
          runtimeRecordPath: runtimeFollowUp.linkedArtifacts.runtimeRecordPath!,
          approved: true,
          approvedBy: "composition-check",
        }),
      /live current stage/i,
      "Runtime record opener should reject repeated approval after the case advances downstream",
    );
  });

  withStagedDirectiveRoot("runtime-proof-opener-stale-after-open", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_PROOF_PATH,
      runtimeProof.linkedArtifacts.runtimeRecordPath,
      runtimeProof.linkedArtifacts.runtimeFollowUpPath,
      runtimeProof.linkedArtifacts.discoveryRoutingPath,
      runtimeProof.linkedArtifacts.discoveryIntakePath,
      runtimeProof.linkedArtifacts.engineRunRecordPath,
      runtimeProof.linkedArtifacts.engineRunReportPath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () =>
        openDirectiveRuntimeProofRuntimeCapabilityBoundary({
          directiveRoot: stagedRoot,
          runtimeProofPath: RUNTIME_PROOF_PATH,
        }),
      /explicit approval/i,
      "Runtime proof opener should require explicit approval",
    );

    const first = openDirectiveRuntimeProofRuntimeCapabilityBoundary({
      directiveRoot: stagedRoot,
      runtimeProofPath: RUNTIME_PROOF_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(
      first.created,
      true,
      "Runtime proof opener should create the runtime capability boundary on first approval",
    );

    assert.throws(
      () =>
        openDirectiveRuntimeProofRuntimeCapabilityBoundary({
          directiveRoot: stagedRoot,
          runtimeProofPath: RUNTIME_PROOF_PATH,
          approved: true,
          approvedBy: "composition-check",
        }),
      /live current stage/i,
      "Runtime proof opener should reject repeated approval after the case advances downstream",
    );
  });

  withStagedDirectiveRoot("runtime-promotion-readiness-opener-stale-after-open", (stagedRoot) => {
    for (const relativePath of uniqueRelativePaths([
      RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
      runtimeRouteCapabilityBoundary.linkedArtifacts.runtimeProofPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.runtimeRecordPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.runtimeFollowUpPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.discoveryRoutingPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.discoveryIntakePath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.engineRunRecordPath,
      runtimeRouteCapabilityBoundary.linkedArtifacts.engineRunReportPath,
      "discovery/intake-queue.json",
    ])) {
      copyRelativeFile(relativePath, stagedRoot);
    }

    assert.throws(
      () =>
        openDirectiveRuntimePromotionReadiness({
          directiveRoot: stagedRoot,
          capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
        }),
      /explicit approval/i,
      "Runtime promotion-readiness opener should require explicit approval",
    );

    const first = openDirectiveRuntimePromotionReadiness({
      directiveRoot: stagedRoot,
      capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
      approved: true,
      approvedBy: "composition-check",
    });
    assert.equal(
      first.created,
      true,
      "Runtime promotion-readiness opener should create the promotion-readiness artifact on first approval",
    );

    assert.throws(
      () =>
        openDirectiveRuntimePromotionReadiness({
          directiveRoot: stagedRoot,
          capabilityBoundaryPath: RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
          approved: true,
          approvedBy: "composition-check",
        }),
      /live current stage/i,
      "Runtime promotion-readiness opener should reject repeated approval after the case advances downstream",
    );
  });

  assert.throws(
    () =>
      openDirectiveRuntimeFollowUp({
        directiveRoot: DIRECTIVE_ROOT,
        followUpPath: path.resolve(DIRECTIVE_ROOT, "..", "CLAUDE.md"),
        approved: true,
      }),
    /must stay within directive-workspace/i,
    "Openers should reject out-of-root paths through the shared approval-boundary helper",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        directiveRoot: DIRECTIVE_ROOT,
        anchorsChecked: [
          ARCHITECTURE_ROUTE_PATH,
          RUNTIME_ROUTE_PATH,
          ARCHITECTURE_EVALUATION_PATH,
          ARCHITECTURE_BOUNDED_RESULT_PATH,
          RUNTIME_FOLLOW_UP_PATH,
          RUNTIME_PROOF_PATH,
          RUNTIME_ROUTE_CAPABILITY_BOUNDARY_PATH,
          RUNTIME_ROUTE_PROMOTION_READINESS_PATH,
          RUNTIME_CALLABLE_CAPABILITY_BOUNDARY_PATH,
        ],
        negativeCasesChecked: [
          "discovery queue routing mismatch blocks advancement",
          "discovery required-next-artifact mismatch blocks advancement",
          "discovery lifecycle sync rejects mismatched or missing routed downstream stubs before queue mutation",
          "broken completed queue entries stop advertising clean completion",
          "progressed routed queue entries stop advertising clean routed status",
          "historical runtime handoff stubs stop advertising pending review",
          "historical runtime approval surfaces stop advertising stale downstream openings",
          "historical runtime openers block when the live current head moved downstream",
          "runtime record missing linked follow-up blocks advancement",
          "runtime capability boundary missing linked proof blocks advancement",
          "malformed Runtime record fails clearly",
          "artifact path containment is enforced",
        ],
        openerSemanticsChecked: [
          "discovery route opener requires approval and stays idempotent",
          "runtime follow-up opener requires approval and rejects stale repeated approval after advancement",
          "runtime record proof opener requires approval and rejects stale repeated approval after advancement",
          "runtime proof boundary opener requires approval and rejects stale repeated approval after advancement",
          "runtime promotion-readiness opener requires approval and rejects stale repeated approval after advancement",
          "openers reject out-of-root paths",
        ],
        overview: {
          totalEngineRuns: overview.engine.totalRuns,
          anchorCount: overview.anchors.length,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
