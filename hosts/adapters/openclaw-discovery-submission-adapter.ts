import type {
  DiscoverySubmissionRequest,
  DiscoverySubmissionShape,
} from "../../discovery/lib/discovery-submission-router.ts";
import type { DiscoverySourceType } from "../../discovery/lib/discovery-intake-queue-writer.ts";
import { requiredString } from "../../architecture/lib/architecture-deep-tail-artifact-helpers.ts";

export type OpenClawDiscoverySubmissionPayload = {
  candidate_id: string;
  candidate_name: string;
  source_type?: DiscoverySourceType | null;
  source_reference: string;
  mission_alignment?: string | null;
  capability_gap_id?: string | null;
  notes?: string | null;
};

export type OpenClawDiscoverySubmissionAdapterResult = {
  request: DiscoverySubmissionRequest;
  boundedRecordShape: DiscoverySubmissionShape;
};

const DISCOVERY_SOURCE_TYPES: DiscoverySourceType[] = [
  "github-repo",
  "paper",
  "product-doc",
  "theory",
  "technical-essay",
  "workflow-writeup",
  "external-system",
  "internal-signal",
];

const DISCOVERY_SOURCE_TYPE_SET = new Set<DiscoverySourceType>(DISCOVERY_SOURCE_TYPES);

function optionalNullableString(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error("invalid_input: optional fields must be strings or null");
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeSourceType(value: DiscoverySourceType | null | undefined) {
  if (value === null || value === undefined) {
    return "internal-signal" as const;
  }
  if (!DISCOVERY_SOURCE_TYPE_SET.has(value)) {
    throw new Error(`invalid_input: source_type must be one of ${DISCOVERY_SOURCE_TYPES.join(", ")}`);
  }
  return value;
}

export function adaptOpenClawDiscoverySubmissionToDirectiveRequest(
  payload: OpenClawDiscoverySubmissionPayload,
): OpenClawDiscoverySubmissionAdapterResult {
  const request: DiscoverySubmissionRequest = {
    candidate_id: requiredString(payload.candidate_id, "candidate_id"),
    candidate_name: requiredString(payload.candidate_name, "candidate_name"),
    source_type: normalizeSourceType(payload.source_type),
    source_reference: requiredString(payload.source_reference, "source_reference"),
    mission_alignment: optionalNullableString(payload.mission_alignment),
    capability_gap_id: optionalNullableString(payload.capability_gap_id),
    notes: optionalNullableString(payload.notes),
    // OpenClaw's bounded submission contract intentionally stays at queue-only
    // and leaves route choice plus downstream record creation in Discovery.
    record_shape: "queue_only",
  };

  return {
    request,
    boundedRecordShape: "queue_only",
  };
}
