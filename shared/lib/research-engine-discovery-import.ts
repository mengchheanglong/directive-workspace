import fs from "node:fs";
import path from "node:path";

import type {
  DiscoveryIntakeQueueDocument,
  DiscoverySourceType,
} from "./discovery-intake-queue-writer.ts";
import {
  submitDirectiveDiscoveryFrontDoor,
  type DirectiveDiscoveryFrontDoorResult,
} from "./discovery-front-door.ts";
import type {
  DiscoverySubmissionRequest,
  DiscoverySubmissionShape,
} from "./discovery-submission-router.ts";

type ResearchEngineArtifactRefs = {
  source_intelligence_packet: string;
  dw_discovery_packet: string;
};

export type ResearchEngineDwImportBundle = {
  packet_kind: string;
  contract_version: number;
  mission_id: string;
  generated_at: string;
  decision_boundary: string;
  import_ready: boolean;
  artifact_refs: ResearchEngineArtifactRefs;
};

type ResearchEngineSignalReference = {
  name: string;
  link: string;
  why: string;
};

export type ResearchEngineSourceIntelligencePacket = {
  packet_kind: string;
  contract_version: number;
  mission_id: string;
  generated_at: string;
  decision_boundary: string;
  strong_signals?: ResearchEngineSignalReference[];
  machine_friendly_research_packet?: {
    strong_signals?: ResearchEngineSignalReference[];
  } | null;
};

export type ResearchEngineDwDiscoveryCandidate = {
  candidate_id: string;
  candidate_name: string;
  source_kind?: string | null;
  source_reference: string;
  mission_relevance: string;
  initial_value_hypothesis?: string | null;
  initial_baggage_signals?: string[] | null;
  capability_gap_hint?: string | null;
  evidence_bundle_refs?: string[] | null;
  evidence_cluster_summary?: string[] | null;
  contradiction_flags?: string[] | null;
  rejection_or_hold_reasons?: string[] | null;
  provenance_summary?: string[] | null;
  discovery_signal_band?: string | null;
  signal_total_score?: number | null;
  signal_score_summary?: string | null;
  freshness_summary?: string | null;
  freshness_signal?: string | null;
  freshest_source_updated_at?: string | null;
  freshest_source_age_days?: number | null;
  uncertainty_notes?: string[] | null;
};

export type ResearchEngineDwDiscoveryPacket = {
  packet_kind: string;
  contract_version: number;
  mission_id: string;
  generated_at: string;
  decision_boundary: string;
  candidates: ResearchEngineDwDiscoveryCandidate[];
  holds_and_rejections?: ResearchEngineDwDiscoveryCandidate[];
};

export type ResearchEngineDiscoveryImportPayload = {
  bundleManifestPath: string;
  bundle: ResearchEngineDwImportBundle;
  sourceIntelligencePacket: ResearchEngineSourceIntelligencePacket;
  discoveryPacket: ResearchEngineDwDiscoveryPacket;
  candidate: ResearchEngineDwDiscoveryCandidate;
  strongSignalReason?: string | null;
  importedCandidateId: string;
};

export type ResearchEngineDiscoverySubmissionAdapterResult = {
  request: DiscoverySubmissionRequest;
  boundedRecordShape: DiscoverySubmissionShape;
  importedCandidateId: string;
  sourceCandidateId: string;
};

export type ResearchEngineDiscoveryImportOptions = {
  directiveRoot: string;
  bundlePath: string;
  candidateIds?: string[] | null;
  receivedAt?: string;
  runtimeArtifactsRoot?: string;
};

export type ResearchEngineDiscoveryImportResult = {
  bundleManifestPath: string;
  importedCount: number;
  selectedSourceCandidateIds: string[];
  imports: Array<{
    sourceCandidateId: string;
    importedCandidateId: string;
    sourceReference: string;
    sourceType: DiscoverySourceType;
    strongSignalReason: string | null;
    discovery: DirectiveDiscoveryFrontDoorResult;
  }>;
};

const RESEARCH_ENGINE_BUNDLE_KIND = "research_engine.dw_import_bundle";
const RESEARCH_ENGINE_SOURCE_PACKET_KIND = "research_engine.source_intelligence_packet";
const RESEARCH_ENGINE_DISCOVERY_PACKET_KIND = "research_engine.dw_discovery_packet";
const IMPORTED_SOURCE_TYPE = "external-system" as const;

function requiredString(value: string | null | undefined, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`invalid_input: ${fieldName} is required`);
  }
  return value.trim();
}

function optionalString(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error("invalid_input: optional fields must be strings or null");
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalStringArray(value: string[] | null | undefined, fieldName: string) {
  if (value === null || value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`invalid_input: ${fieldName} must be an array of strings`);
  }
  return value
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function requiredStringArray(value: string[] | null | undefined, fieldName: string) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`invalid_input: ${fieldName} must be an array of strings`);
  }
  return value
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function requiredFiniteNullableNumber(
  value: number | null | undefined,
  fieldName: string,
) {
  if (value === null) {
    return null;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`invalid_input: ${fieldName} must be a finite number or null`);
  }
  return value;
}

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function normalizeAbsolutePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function resolveBundleManifestPath(bundlePath: string) {
  const resolved = path.resolve(bundlePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`bundle_path_not_found: ${resolved}`);
  }
  const stat = fs.statSync(resolved);
  if (stat.isDirectory()) {
    const manifestPath = path.join(resolved, "dw_import_bundle.json");
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`bundle_manifest_not_found: ${manifestPath}`);
    }
    return normalizeAbsolutePath(manifestPath);
  }
  return normalizeAbsolutePath(resolved);
}

function resolveBundleArtifactPath(bundleManifestPath: string, artifactRef: string) {
  return normalizeAbsolutePath(path.resolve(path.dirname(bundleManifestPath), artifactRef));
}

function sanitizePathSegment(value: string) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function compactTimestampSegment(value: string, fieldName: string) {
  const normalized = requiredString(value, fieldName);
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.valueOf())) {
    throw new Error(`invalid_input: ${fieldName} must be an ISO timestamp`);
  }
  return parsed
    .toISOString()
    .toLowerCase()
    .replace(/[-:]/g, "")
    .replace(".000", "");
}

function normalizeReceivedAt(value: string | undefined) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return new Date().toISOString();
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return `${normalized}T00:00:00.000Z`;
  }
  return normalized;
}

function readDiscoveryQueueCandidateIds(directiveRoot: string) {
  const queuePath = path.join(directiveRoot, "discovery", "intake-queue.json");
  const queue = readJson<DiscoveryIntakeQueueDocument>(queuePath);
  return new Set(queue.entries.map((entry) => entry.candidate_id));
}

function validateMissionIdCoherence(input: {
  bundle: ResearchEngineDwImportBundle;
  sourceIntelligencePacket: ResearchEngineSourceIntelligencePacket;
  discoveryPacket: ResearchEngineDwDiscoveryPacket;
}) {
  const bundleMissionId = requiredString(input.bundle.mission_id, "bundle.mission_id");
  const sourceMissionId = requiredString(
    input.sourceIntelligencePacket.mission_id,
    "source_intelligence_packet.mission_id",
  );
  const discoveryMissionId = requiredString(
    input.discoveryPacket.mission_id,
    "dw_discovery_packet.mission_id",
  );

  if (
    bundleMissionId !== sourceMissionId
    || bundleMissionId !== discoveryMissionId
  ) {
    throw new Error(
      `invalid_input: mission_id_mismatch bundle=${bundleMissionId} source_intelligence_packet=${sourceMissionId} dw_discovery_packet=${discoveryMissionId}`,
    );
  }
}

function validatePacketKind(actual: string, expected: string, fieldName: string) {
  if (actual !== expected) {
    throw new Error(`invalid_input: ${fieldName} must be ${expected}`);
  }
}

function validateSignalReferences(
  value: ResearchEngineSignalReference[] | null | undefined,
  fieldName: string,
) {
  if (value === null || value === undefined) {
    return;
  }
  if (!Array.isArray(value)) {
    throw new Error(`invalid_input: ${fieldName} must be an array`);
  }
  for (const [index, signal] of value.entries()) {
    if (!signal || typeof signal !== "object") {
      throw new Error(`invalid_input: ${fieldName}[${index}] must be an object`);
    }
    requiredString(signal.name, `${fieldName}[${index}].name`);
    requiredString(signal.link, `${fieldName}[${index}].link`);
    requiredString(signal.why, `${fieldName}[${index}].why`);
  }
}

function validateDiscoveryCandidateContract(
  candidate: ResearchEngineDwDiscoveryCandidate,
  fieldName: string,
) {
  requiredString(candidate.candidate_id, `${fieldName}.candidate_id`);
  requiredString(candidate.candidate_name, `${fieldName}.candidate_name`);
  requiredString(candidate.source_reference, `${fieldName}.source_reference`);
  requiredString(candidate.mission_relevance, `${fieldName}.mission_relevance`);
  requiredString(candidate.source_kind, `${fieldName}.source_kind`);
  requiredString(candidate.discovery_signal_band, `${fieldName}.discovery_signal_band`);
  requiredString(candidate.signal_score_summary, `${fieldName}.signal_score_summary`);
  requiredFiniteNullableNumber(candidate.signal_total_score, `${fieldName}.signal_total_score`);
  optionalString(candidate.initial_value_hypothesis);
  optionalStringArray(candidate.initial_baggage_signals, `${fieldName}.initial_baggage_signals`);
  optionalString(candidate.capability_gap_hint);
  optionalStringArray(candidate.evidence_bundle_refs, `${fieldName}.evidence_bundle_refs`);
  optionalStringArray(candidate.evidence_cluster_summary, `${fieldName}.evidence_cluster_summary`);
  optionalStringArray(candidate.contradiction_flags, `${fieldName}.contradiction_flags`);
  optionalStringArray(candidate.rejection_or_hold_reasons, `${fieldName}.rejection_or_hold_reasons`);
  optionalStringArray(candidate.provenance_summary, `${fieldName}.provenance_summary`);
  optionalString(candidate.freshness_summary);
  optionalString(candidate.freshness_signal);
  optionalString(candidate.freshest_source_updated_at);
  if (
    candidate.freshest_source_age_days !== undefined
    && candidate.freshest_source_age_days !== null
    && (!Number.isInteger(candidate.freshest_source_age_days) || candidate.freshest_source_age_days < 0)
  ) {
    throw new Error(`invalid_input: ${fieldName}.freshest_source_age_days must be a non-negative integer or null`);
  }
  requiredStringArray(candidate.uncertainty_notes ?? [], `${fieldName}.uncertainty_notes`);
}

function validateResearchEngineSourceIntelligencePacket(
  packet: ResearchEngineSourceIntelligencePacket,
) {
  validateSignalReferences(packet.strong_signals, "source_intelligence_packet.strong_signals");
  validateSignalReferences(
    packet.machine_friendly_research_packet?.strong_signals,
    "source_intelligence_packet.machine_friendly_research_packet.strong_signals",
  );
}

function validateResearchEngineDiscoveryPacket(
  packet: ResearchEngineDwDiscoveryPacket,
) {
  if (!Array.isArray(packet.candidates)) {
    throw new Error("invalid_input: dw_discovery_packet.candidates must be an array");
  }
  for (const [index, candidate] of packet.candidates.entries()) {
    if (!candidate || typeof candidate !== "object") {
      throw new Error(`invalid_input: dw_discovery_packet.candidates[${index}] must be an object`);
    }
    validateDiscoveryCandidateContract(candidate, `dw_discovery_packet.candidates[${index}]`);
  }
  if (packet.holds_and_rejections !== undefined && packet.holds_and_rejections !== null) {
    if (!Array.isArray(packet.holds_and_rejections)) {
      throw new Error("invalid_input: dw_discovery_packet.holds_and_rejections must be an array");
    }
    for (const [index, candidate] of packet.holds_and_rejections.entries()) {
      if (!candidate || typeof candidate !== "object") {
        throw new Error(`invalid_input: dw_discovery_packet.holds_and_rejections[${index}] must be an object`);
      }
      validateDiscoveryCandidateContract(
        candidate,
        `dw_discovery_packet.holds_and_rejections[${index}]`,
      );
    }
  }
}

function strongSignalsFromPacket(packet: ResearchEngineSourceIntelligencePacket) {
  return packet.strong_signals ?? packet.machine_friendly_research_packet?.strong_signals ?? [];
}

export function allocateResearchEngineImportedCandidateId(input: {
  candidateId: string;
  bundleGeneratedAt: string;
  receivedAt: string;
  existingCandidateIds?: Iterable<string>;
}) {
  const candidateSegment = sanitizePathSegment(input.candidateId).slice(0, 32);
  if (!candidateSegment) {
    throw new Error("invalid_input: candidate_id must produce a non-empty import identifier");
  }
  const bundleSegment = compactTimestampSegment(
    input.bundleGeneratedAt,
    "bundle.generated_at",
  ).slice(0, 16);
  const importSegment = compactTimestampSegment(input.receivedAt, "receivedAt").slice(0, 16);
  const baseId = `research-engine-${candidateSegment}-${bundleSegment}-${importSegment}`;
  const existingCandidateIds = new Set(input.existingCandidateIds ?? []);
  if (!existingCandidateIds.has(baseId)) {
    return baseId;
  }

  let collisionIndex = 2;
  while (existingCandidateIds.has(`${baseId}-r${collisionIndex}`)) {
    collisionIndex += 1;
  }
  return `${baseId}-r${collisionIndex}`;
}

function toSentence(parts: Array<string | null>) {
  return parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ");
}

export function loadResearchEngineDiscoveryBundle(bundlePath: string) {
  const bundleManifestPath = resolveBundleManifestPath(bundlePath);
  const bundle = readJson<ResearchEngineDwImportBundle>(bundleManifestPath);
  validatePacketKind(bundle.packet_kind, RESEARCH_ENGINE_BUNDLE_KIND, "packet_kind");
  if (bundle.import_ready !== true) {
    throw new Error("invalid_input: research-engine bundle is not marked import_ready");
  }

  const sourceIntelligencePacketPath = resolveBundleArtifactPath(
    bundleManifestPath,
    requiredString(
      bundle.artifact_refs?.source_intelligence_packet,
      "artifact_refs.source_intelligence_packet",
    ),
  );
  const discoveryPacketPath = resolveBundleArtifactPath(
    bundleManifestPath,
    requiredString(
      bundle.artifact_refs?.dw_discovery_packet,
      "artifact_refs.dw_discovery_packet",
    ),
  );

  const sourceIntelligencePacket =
    readJson<ResearchEngineSourceIntelligencePacket>(sourceIntelligencePacketPath);
  const discoveryPacket = readJson<ResearchEngineDwDiscoveryPacket>(discoveryPacketPath);

  validatePacketKind(
    sourceIntelligencePacket.packet_kind,
    RESEARCH_ENGINE_SOURCE_PACKET_KIND,
    "source_intelligence_packet.packet_kind",
  );
  validatePacketKind(
    discoveryPacket.packet_kind,
    RESEARCH_ENGINE_DISCOVERY_PACKET_KIND,
    "dw_discovery_packet.packet_kind",
  );
  validateMissionIdCoherence({
    bundle,
    sourceIntelligencePacket,
    discoveryPacket,
  });
  validateResearchEngineSourceIntelligencePacket(sourceIntelligencePacket);
  validateResearchEngineDiscoveryPacket(discoveryPacket);

  return {
    bundleManifestPath,
    sourceIntelligencePacketPath,
    discoveryPacketPath,
    bundle,
    sourceIntelligencePacket,
    discoveryPacket,
  };
}

export function selectResearchEngineCandidatesForImport(input: {
  sourceIntelligencePacket: ResearchEngineSourceIntelligencePacket;
  discoveryPacket: ResearchEngineDwDiscoveryPacket;
  candidateIds?: string[] | null;
}) {
  const candidates = Array.isArray(input.discoveryPacket.candidates)
    ? input.discoveryPacket.candidates
    : [];
  const candidateMap = new Map(
    candidates.map((candidate) => [requiredString(candidate.candidate_id, "candidate.candidate_id"), candidate]),
  );

  if (input.candidateIds && input.candidateIds.length > 0) {
    return input.candidateIds.map((candidateId) => {
      const normalizedId = requiredString(candidateId, "candidateIds[]");
      const candidate = candidateMap.get(normalizedId);
      if (!candidate) {
        throw new Error(
          `invalid_input: requested research-engine candidate_id not found in dw_discovery_packet: ${normalizedId}`,
        );
      }
      return {
        candidate,
        strongSignalReason: null,
      };
    });
  }

  const strongSignals = strongSignalsFromPacket(input.sourceIntelligencePacket);
  if (strongSignals.length === 0) {
    throw new Error(
      "invalid_input: source_intelligence_packet does not expose strong_signals for default import selection",
    );
  }

  return strongSignals.map((signal) => {
    const candidate = candidates.find(
      (entry) =>
        entry.candidate_name.trim().toLowerCase() === signal.name.trim().toLowerCase()
        || entry.source_reference.trim().toLowerCase() === signal.link.trim().toLowerCase(),
    );
    if (!candidate) {
      throw new Error(
        `invalid_input: strong signal could not be resolved in dw_discovery_packet: ${signal.name}`,
      );
    }
    return {
      candidate,
      strongSignalReason: requiredString(signal.why, "strong_signal.why"),
    };
  });
}

export function adaptResearchEngineCandidateToDirectiveRequest(
  input: ResearchEngineDiscoveryImportPayload,
): ResearchEngineDiscoverySubmissionAdapterResult {
  const candidate = input.candidate;
  const importedCandidateId = requiredString(
    input.importedCandidateId,
    "importedCandidateId",
  );
  const candidateName = requiredString(candidate.candidate_name, "candidate.candidate_name");
  const sourceReference = requiredString(candidate.source_reference, "candidate.source_reference");
  const missionRelevance = requiredString(candidate.mission_relevance, "candidate.mission_relevance");
  const bundlePath = normalizeAbsolutePath(input.bundleManifestPath);
  const signalReason = optionalString(input.strongSignalReason);
  const freshnessSummary = optionalString(candidate.freshness_summary);
  const valueHypothesis = optionalString(candidate.initial_value_hypothesis);
  const baggageSignals = optionalStringArray(
    candidate.initial_baggage_signals,
    "candidate.initial_baggage_signals",
  );
  const capabilityGapHint = optionalString(candidate.capability_gap_hint);
  const evidenceRefs = optionalStringArray(candidate.evidence_bundle_refs, "candidate.evidence_bundle_refs");
  const evidenceClusterSummary = optionalStringArray(
    candidate.evidence_cluster_summary,
    "candidate.evidence_cluster_summary",
  );
  const contradictionFlags = optionalStringArray(
    candidate.contradiction_flags,
    "candidate.contradiction_flags",
  );
  const holdReasons = optionalStringArray(
    candidate.rejection_or_hold_reasons,
    "candidate.rejection_or_hold_reasons",
  );
  const uncertaintyNotes = optionalStringArray(candidate.uncertainty_notes, "candidate.uncertainty_notes");
  const provenanceSummary = optionalStringArray(candidate.provenance_summary, "candidate.provenance_summary");
  const sourceKind = optionalString(candidate.source_kind);
  const discoverySignalBand = optionalString(candidate.discovery_signal_band);
  const signalScoreSummary = optionalString(candidate.signal_score_summary);
  const signalTotalScore =
    typeof candidate.signal_total_score === "number" && Number.isFinite(candidate.signal_total_score)
      ? candidate.signal_total_score
      : null;

  const request: DiscoverySubmissionRequest = {
    candidate_id: importedCandidateId,
    candidate_name: candidateName,
    source_type: IMPORTED_SOURCE_TYPE,
    source_reference: sourceReference,
    submission_origin: "research-engine",
    discovery_signal_band: discoverySignalBand,
    signal_total_score: signalTotalScore,
    signal_score_summary: signalScoreSummary,
    mission_alignment: toSentence([
      missionRelevance,
      "Imported from research-engine for Directive Workspace Discovery review only.",
    ]),
    capability_gap_id: null,
    notes: toSentence([
      `Imported source candidate ${candidate.candidate_id} from research-engine bundle ${bundlePath}.`,
      `Bundle decision boundary: ${requiredString(input.bundle.decision_boundary, "bundle.decision_boundary")}`,
      `Source intelligence boundary: ${requiredString(input.sourceIntelligencePacket.decision_boundary, "sourceIntelligencePacket.decision_boundary")}`,
      `Discovery packet boundary: ${requiredString(input.discoveryPacket.decision_boundary, "discoveryPacket.decision_boundary")}`,
      sourceKind ? `Research-engine source kind: ${sourceKind}` : null,
      discoverySignalBand ? `Discovery signal band: ${discoverySignalBand}` : null,
      signalScoreSummary ? `Signal score summary: ${signalScoreSummary}` : null,
      signalTotalScore !== null ? `Signal total score: ${signalTotalScore}.` : null,
      signalReason ? `Strong signal: ${signalReason}` : null,
      valueHypothesis ? `Initial value hypothesis: ${valueHypothesis}` : null,
      baggageSignals.length > 0 ? `Baggage signals: ${baggageSignals.join(" | ")}.` : null,
      capabilityGapHint ? `Capability gap hint: ${capabilityGapHint}` : null,
      freshnessSummary ? `Freshness: ${freshnessSummary}` : null,
      evidenceRefs.length > 0 ? `Evidence bundle refs: ${evidenceRefs.join(", ")}.` : null,
      evidenceClusterSummary.length > 0
        ? `Evidence cluster summary: ${evidenceClusterSummary.join(" | ")}.`
        : null,
      contradictionFlags.length > 0
        ? `Contradiction flags: ${contradictionFlags.join(", ")}.`
        : null,
      holdReasons.length > 0 ? `Hold/rejection reasons: ${holdReasons.join(" | ")}.` : null,
      provenanceSummary.length > 0 ? `Provenance: ${provenanceSummary.join(" | ")}.` : null,
      uncertaintyNotes.length > 0 ? `Uncertainty notes: ${uncertaintyNotes.join(" ")}` : null,
    ]),
    operating_mode: "note",
    record_shape: "queue_only",
  };

  return {
    request,
    boundedRecordShape: "queue_only",
    importedCandidateId,
    sourceCandidateId: candidate.candidate_id,
  };
}

export async function importResearchEngineDiscoveryBundle(
  input: ResearchEngineDiscoveryImportOptions,
): Promise<ResearchEngineDiscoveryImportResult> {
  const loaded = loadResearchEngineDiscoveryBundle(input.bundlePath);
  const receivedAt = normalizeReceivedAt(input.receivedAt);
  const existingCandidateIds = readDiscoveryQueueCandidateIds(input.directiveRoot);
  const selected = selectResearchEngineCandidatesForImport({
    sourceIntelligencePacket: loaded.sourceIntelligencePacket,
    discoveryPacket: loaded.discoveryPacket,
    candidateIds: input.candidateIds,
  });

  const imports: ResearchEngineDiscoveryImportResult["imports"] = [];
  for (const selection of selected) {
    const importedCandidateId = allocateResearchEngineImportedCandidateId({
      candidateId: requiredString(selection.candidate.candidate_id, "candidate.candidate_id"),
      bundleGeneratedAt: loaded.bundle.generated_at,
      receivedAt,
      existingCandidateIds,
    });
    const adapted = adaptResearchEngineCandidateToDirectiveRequest({
      bundleManifestPath: loaded.bundleManifestPath,
      bundle: loaded.bundle,
      sourceIntelligencePacket: loaded.sourceIntelligencePacket,
      discoveryPacket: loaded.discoveryPacket,
      candidate: selection.candidate,
      strongSignalReason: selection.strongSignalReason,
      importedCandidateId,
    });
    const discovery = await submitDirectiveDiscoveryFrontDoor({
      directiveRoot: input.directiveRoot,
      request: adapted.request,
      receivedAt,
      runtimeArtifactsRoot: input.runtimeArtifactsRoot,
    });
    existingCandidateIds.add(importedCandidateId);
    imports.push({
      sourceCandidateId: adapted.sourceCandidateId,
      importedCandidateId: adapted.importedCandidateId,
      sourceReference: adapted.request.source_reference,
      sourceType: adapted.request.source_type ?? IMPORTED_SOURCE_TYPE,
      strongSignalReason: selection.strongSignalReason,
      discovery,
    });
  }

  return {
    bundleManifestPath: loaded.bundleManifestPath,
    importedCount: imports.length,
    selectedSourceCandidateIds: imports.map((entry) => entry.sourceCandidateId),
    imports,
  };
}
