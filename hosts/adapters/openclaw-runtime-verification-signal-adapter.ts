import type { DiscoverySubmissionShape } from "../../discovery/lib/discovery-submission-router.ts";
import {
  adaptOpenClawDiscoverySubmissionToDirectiveRequest,
} from "./openclaw-discovery-submission-adapter.ts";
import { requiredString } from "../../architecture/lib/architecture-deep-tail-artifact-helpers.ts";

export type OpenClawRuntimeVerificationSignal = {
  candidate_id: string;
  signal_detected: boolean;
  regression_age_hours: number | null;
  regression_stale: boolean;
  soak_age_hours: number | null;
  soak_stale: boolean;
  reasons: string[];
};

export type OpenClawRuntimeVerificationSignalAdapterResult =
  | {
    signalDetected: false;
    request: null;
    boundedRecordShape: null;
  }
  | {
    signalDetected: true;
    request: ReturnType<typeof adaptOpenClawDiscoverySubmissionToDirectiveRequest>["request"];
    boundedRecordShape: DiscoverySubmissionShape;
  };

const SOURCE_REFERENCE =
  "reports/ops/openclaw-runtime-regression-latest.json + runtime/telegram-soak/daily-latest.json";
const MISSION_ALIGNMENT =
  "OpenClaw as persistent orchestration plus Discovery as front door - surface stale runtime verification before orchestration confidence drifts away from recent proof.";

function requireBoolean(value: boolean | null | undefined, fieldName: string) {
  if (typeof value !== "boolean") {
    throw new Error(`invalid_input: ${fieldName} must be boolean`);
  }
  return value;
}

function requireNullableNumber(value: number | null | undefined, fieldName: string) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`invalid_input: ${fieldName} must be number or null`);
  }
  return value;
}

function normalizeReasons(reasons: string[] | null | undefined) {
  if (!Array.isArray(reasons)) {
    throw new Error("invalid_input: reasons must be an array");
  }

  const normalized = reasons
    .map((reason) => (typeof reason === "string" ? reason.trim() : ""))
    .filter((reason) => reason.length > 0);

  if (normalized.length !== reasons.length) {
    throw new Error("invalid_input: reasons must contain only non-empty strings");
  }

  return normalized;
}

export function adaptOpenClawRuntimeVerificationSignalToDirectiveRequest(
  signal: OpenClawRuntimeVerificationSignal,
): OpenClawRuntimeVerificationSignalAdapterResult {
  const candidateId = requiredString(signal.candidate_id, "candidate_id");
  const signalDetected = requireBoolean(signal.signal_detected, "signal_detected");
  const regressionAgeHours = requireNullableNumber(
    signal.regression_age_hours,
    "regression_age_hours",
  );
  const soakAgeHours = requireNullableNumber(signal.soak_age_hours, "soak_age_hours");
  const regressionStale = requireBoolean(signal.regression_stale, "regression_stale");
  const soakStale = requireBoolean(signal.soak_stale, "soak_stale");
  const reasons = normalizeReasons(signal.reasons);

  if (!signalDetected) {
    if (regressionStale || soakStale || reasons.length > 0) {
      throw new Error(
        "invalid_input: signal_detected=false requires no stale flags and no reasons",
      );
    }

    return {
      signalDetected: false,
      request: null,
      boundedRecordShape: null,
    };
  }

  if (!regressionStale && !soakStale && reasons.length === 0) {
    throw new Error(
      "invalid_input: signal_detected=true requires stale flags or explicit reasons",
    );
  }

  const ageSummary = [
    `regression_age_hours=${regressionAgeHours === null ? "null" : regressionAgeHours}`,
    `soak_age_hours=${soakAgeHours === null ? "null" : soakAgeHours}`,
  ].join("; ");
  const notes = reasons.length > 0 ? `${reasons.join("; ")}; ${ageSummary}` : ageSummary;
  const adapted = adaptOpenClawDiscoverySubmissionToDirectiveRequest({
    candidate_id: candidateId,
    candidate_name: "OpenClaw Runtime Verification Freshness Signal",
    source_type: "internal-signal",
    source_reference: SOURCE_REFERENCE,
    mission_alignment: MISSION_ALIGNMENT,
    capability_gap_id: null,
    notes,
  });

  return {
    signalDetected: true,
    request: adapted.request,
    boundedRecordShape: adapted.boundedRecordShape,
  };
}
