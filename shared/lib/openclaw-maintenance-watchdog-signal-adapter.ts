import type { DiscoverySubmissionShape } from "./discovery-submission-router.ts";
import {
  adaptOpenClawDiscoverySubmissionToDirectiveRequest,
} from "./openclaw-discovery-submission-adapter.ts";

export type OpenClawMaintenanceWatchdogSignal = {
  candidate_id: string;
  candidate_name: "OpenClaw Maintenance Watchdog Signal";
  source_type: "internal-signal";
  source_reference: string;
  mission_alignment: string;
  capability_gap_id: string | null;
  notes: string;
};

export type OpenClawMaintenanceWatchdogSignalAdapterResult = {
  request: ReturnType<typeof adaptOpenClawDiscoverySubmissionToDirectiveRequest>["request"];
  boundedRecordShape: DiscoverySubmissionShape;
};

function requiredString(value: string | null | undefined, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`invalid_input: ${fieldName} is required`);
  }
  return value.trim();
}

function requireExactString(
  value: string | null | undefined,
  fieldName: string,
  expected: string,
) {
  const normalized = requiredString(value, fieldName);
  if (normalized !== expected) {
    throw new Error(`invalid_input: ${fieldName} must be ${expected}`);
  }
  return normalized;
}

function requireNullableString(value: string | null | undefined, fieldName: string) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error(`invalid_input: ${fieldName} must be string or null`);
  }
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`invalid_input: ${fieldName} must not be empty when provided`);
  }
  return normalized;
}

export function adaptOpenClawMaintenanceWatchdogSignalToDirectiveRequest(
  signal: OpenClawMaintenanceWatchdogSignal,
): OpenClawMaintenanceWatchdogSignalAdapterResult {
  const adapted = adaptOpenClawDiscoverySubmissionToDirectiveRequest({
    candidate_id: requiredString(signal.candidate_id, "candidate_id"),
    candidate_name: requireExactString(
      signal.candidate_name,
      "candidate_name",
      "OpenClaw Maintenance Watchdog Signal",
    ),
    source_type: requireExactString(signal.source_type, "source_type", "internal-signal"),
    source_reference: requiredString(signal.source_reference, "source_reference"),
    mission_alignment: requiredString(signal.mission_alignment, "mission_alignment"),
    capability_gap_id: requireNullableString(signal.capability_gap_id, "capability_gap_id"),
    notes: requiredString(signal.notes, "notes"),
  });

  return {
    request: adapted.request,
    boundedRecordShape: adapted.boundedRecordShape,
  };
}
