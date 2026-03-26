import fs from "node:fs";
import path from "node:path";

import type { DiscoveryHostStorageBridge } from "../integration-kit/starter/discovery-submission-adapter.template";
import {
  renderRuntimeFollowUpRecord,
  resolveRuntimeFollowUpRecordPath,
  type RuntimeFollowUpRecordRequest,
} from "../../shared/lib/runtime-follow-up-record-writer";
import {
  renderRuntimeRecord,
  resolveRuntimeRecordPath,
  type RuntimeRecordRequest,
} from "../../shared/lib/runtime-record-writer";
import {
  renderRuntimeProofChecklist,
  resolveRuntimeProofChecklistPath,
  resolveRuntimeProofGateSnapshotPath,
  type RuntimeProofBundleRequest,
} from "../../shared/lib/runtime-proof-bundle-writer";
import {
  renderRuntimeTransformationProof,
  resolveRuntimeTransformationProofPath,
  type RuntimeTransformationProofRequest,
} from "../../shared/lib/runtime-transformation-proof-writer";
import {
  renderRuntimeTransformationRecord,
  resolveRuntimeTransformationRecordPath,
  type RuntimeTransformationRecordRequest,
} from "../../shared/lib/runtime-transformation-record-writer";
import {
  renderRuntimePromotionRecord,
  resolveRuntimePromotionRecordPath,
  type RuntimePromotionRecordRequest,
} from "../../shared/lib/runtime-promotion-record-writer";
import {
  renderRuntimeRegistryEntry,
  resolveRuntimeRegistryEntryPath,
  type RuntimeRegistryEntryRequest,
} from "../../shared/lib/runtime-registry-entry-writer";

function normalizeAbsolutePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function resolveDirectivePathLike(
  storage: DiscoveryHostStorageBridge,
  filePath: string,
) {
  const normalized = String(filePath).trim();
  if (!normalized) {
    return normalized;
  }

  if (path.isAbsolute(normalized)) {
    return normalizeAbsolutePath(normalized);
  }

  return storage.resolveWithinDirectiveRoot(normalized);
}

function assertDirectivePathExists(filePath: string, fieldName: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${fieldName}_not_found`);
  }
}

function listMarkdownFiles(dirPath: string) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => normalizeAbsolutePath(path.join(dirPath, entry.name)))
    .sort();
}

function listJsonFiles(dirPath: string) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => normalizeAbsolutePath(path.join(dirPath, entry.name)))
    .sort();
}

function readField(content: string, label: string) {
  const match = content.match(
    new RegExp(`^-\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*(.*)$`, "im"),
  );
  return match ? match[1].trim().replace(/^`|`$/g, "") : null;
}

function readHeading(content: string) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

export type StandaloneRuntimeOverviewEntry = {
  kind:
    | "follow_up"
    | "record"
    | "proof_bundle"
    | "transformation_record"
    | "transformation_proof"
    | "promotion_record"
    | "registry_entry";
  path: string;
  title: string | null;
  candidateId: string | null;
  candidateName: string | null;
  status: string | null;
};

export type StandaloneRuntimeOverviewSummary = {
  followUpCount: number;
  recordCount: number;
  proofBundleCount: number;
  transformationRecordCount: number;
  transformationProofCount: number;
  promotionRecordCount: number;
  registryEntryCount: number;
  recentEntries: StandaloneRuntimeOverviewEntry[];
};

export async function writeStandaloneRuntimeFollowUp(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimeFollowUpRecordRequest;
}) {
  const request = {
    ...input.request,
    promotion_contract_path: input.request.promotion_contract_path
      ? resolveDirectivePathLike(input.storage, input.request.promotion_contract_path)
      : input.request.promotion_contract_path,
    reentry_contract_path: input.request.reentry_contract_path
      ? resolveDirectivePathLike(input.storage, input.request.reentry_contract_path)
      : input.request.reentry_contract_path,
    linked_handoff_path: input.request.linked_handoff_path
      ? resolveDirectivePathLike(input.storage, input.request.linked_handoff_path)
      : input.request.linked_handoff_path,
    linked_runtime_record_path: input.request.linked_runtime_record_path
      ? resolveDirectivePathLike(input.storage, input.request.linked_runtime_record_path)
      : input.request.linked_runtime_record_path,
    linked_proof_checklist_path: input.request.linked_proof_checklist_path
      ? resolveDirectivePathLike(
          input.storage,
          input.request.linked_proof_checklist_path,
        )
      : input.request.linked_proof_checklist_path,
    linked_live_proof_path: input.request.linked_live_proof_path
      ? resolveDirectivePathLike(input.storage, input.request.linked_live_proof_path)
      : input.request.linked_live_proof_path,
  } satisfies RuntimeFollowUpRecordRequest;

  const relativePath = resolveRuntimeFollowUpRecordPath({
    candidate_id: request.candidate_id,
    follow_up_date: request.follow_up_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderRuntimeFollowUpRecord(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneRuntimeRecord(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimeRecordRequest;
}) {
  const request = {
    ...input.request,
    origin_path: resolveDirectivePathLike(input.storage, input.request.origin_path),
    linked_follow_up_record: resolveDirectivePathLike(
      input.storage,
      input.request.linked_follow_up_record,
    ),
    required_proof: resolveDirectivePathLike(
      input.storage,
      input.request.required_proof,
    ),
    supporting_contracts: (input.request.supporting_contracts ?? []).map((value) =>
      resolveDirectivePathLike(input.storage, value)
    ),
  } satisfies RuntimeRecordRequest;

  const relativePath = resolveRuntimeRecordPath({
    candidate_id: request.candidate_id,
    runtime_record_date: request.runtime_record_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderRuntimeRecord(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneRuntimeProofBundle(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimeProofBundleRequest;
}) {
  const linkedRuntimeRecord = resolveDirectivePathLike(
    input.storage,
    input.request.linked_runtime_record,
  );
  assertDirectivePathExists(linkedRuntimeRecord, "linked_runtime_record");

  const request = {
    ...input.request,
    linked_runtime_record: linkedRuntimeRecord,
    source_proof_artifacts: (input.request.source_proof_artifacts ?? []).map((value) =>
      resolveDirectivePathLike(input.storage, value)
    ),
  } satisfies RuntimeProofBundleRequest;

  const relativePath = resolveRuntimeProofChecklistPath({
    candidate_id: request.candidate_id,
    proof_date: request.proof_date,
    output_relative_path: request.output_relative_path,
  });
  const gateSnapshotRelativePath = resolveRuntimeProofGateSnapshotPath({
    candidate_id: request.candidate_id,
    proof_date: request.proof_date,
    gate_snapshot_relative_path: request.gate_snapshot_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  const gateSnapshotPath =
    input.storage.resolveWithinDirectiveRoot(gateSnapshotRelativePath);

  await input.storage.writeJson(gateSnapshotPath, request.gate_snapshot);
  await input.storage.writeText(
    absolutePath,
    renderRuntimeProofChecklist({
      request,
      gateSnapshotPath,
    }),
  );

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    gateSnapshotPath,
    gateSnapshotRelativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneRuntimeTransformationProof(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimeTransformationProofRequest;
}) {
  const relativePath = resolveRuntimeTransformationProofPath({
    candidate_id: input.request.candidate_id,
    proof_date: input.request.proof_date,
    output_relative_path: input.request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeJson(
    absolutePath,
    renderRuntimeTransformationProof(input.request),
  );

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: input.request.candidate_id,
  };
}

export async function writeStandaloneRuntimeTransformationRecord(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimeTransformationRecordRequest;
}) {
  const request = {
    ...input.request,
    discovery_intake_path: resolveDirectivePathLike(
      input.storage,
      input.request.discovery_intake_path,
    ),
    baseline_artifact_path: resolveDirectivePathLike(
      input.storage,
      input.request.baseline_artifact_path,
    ),
    result_artifact_path: resolveDirectivePathLike(
      input.storage,
      input.request.result_artifact_path,
    ),
    promotion_record: input.request.promotion_record
      ? resolveDirectivePathLike(input.storage, input.request.promotion_record)
      : input.request.promotion_record,
  } satisfies RuntimeTransformationRecordRequest;

  assertDirectivePathExists(request.baseline_artifact_path, "baseline_artifact_path");
  assertDirectivePathExists(request.result_artifact_path, "result_artifact_path");

  const relativePath = resolveRuntimeTransformationRecordPath({
    candidate_id: request.candidate_id,
    record_date: request.record_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(
    absolutePath,
    renderRuntimeTransformationRecord(request),
  );

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneRuntimePromotionRecord(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimePromotionRecordRequest;
}) {
  const linkedRuntimeRecord = resolveDirectivePathLike(
    input.storage,
    input.request.linked_runtime_record,
  );
  const sourceIntentArtifact = resolveDirectivePathLike(
    input.storage,
    input.request.source_intent_artifact,
  );
  const compileContractArtifact = resolveDirectivePathLike(
    input.storage,
    input.request.compile_contract_artifact,
  );
  const proofPath = resolveDirectivePathLike(input.storage, input.request.proof_path);
  assertDirectivePathExists(linkedRuntimeRecord, "linked_runtime_record");
  assertDirectivePathExists(sourceIntentArtifact, "source_intent_artifact");
  assertDirectivePathExists(proofPath, "proof_path");

  const request = {
    ...input.request,
    linked_runtime_record: linkedRuntimeRecord,
    source_intent_artifact: sourceIntentArtifact,
    compile_contract_artifact: compileContractArtifact,
    proof_path: proofPath,
  } satisfies RuntimePromotionRecordRequest;

  const relativePath = resolveRuntimePromotionRecordPath({
    candidate_id: request.candidate_id,
    promotion_date: request.promotion_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderRuntimePromotionRecord(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneRuntimeRegistryEntry(input: {
  storage: DiscoveryHostStorageBridge;
  request: RuntimeRegistryEntryRequest;
}) {
  const linkedPromotionRecord = resolveDirectivePathLike(
    input.storage,
    input.request.linked_promotion_record,
  );
  const proofPath = resolveDirectivePathLike(input.storage, input.request.proof_path);
  assertDirectivePathExists(linkedPromotionRecord, "linked_promotion_record");
  assertDirectivePathExists(proofPath, "proof_path");

  const request = {
    ...input.request,
    linked_promotion_record: linkedPromotionRecord,
    proof_path: proofPath,
  } satisfies RuntimeRegistryEntryRequest;

  const relativePath = resolveRuntimeRegistryEntryPath({
    candidate_id: request.candidate_id,
    registry_date: request.registry_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderRuntimeRegistryEntry(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export function readStandaloneRuntimeOverview(input: {
  directiveRoot: string;
  maxEntries?: number;
}): StandaloneRuntimeOverviewSummary {
  const followUpDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "runtime", "follow-up"),
  );
  const recordsDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "runtime", "records"),
  );
  const transformationRecordFiles = listMarkdownFiles(recordsDir).filter(
    (filePath) =>
      !filePath.endsWith("/README.md")
      && filePath.endsWith("-transformation-record.md"),
  );
  const proofChecklistFiles = listMarkdownFiles(recordsDir).filter(
    (filePath) =>
      !filePath.endsWith("/README.md")
      && /-proof-checklist(?:-artifact)?\.md$/i.test(filePath),
  );
  const transformationProofFiles = listJsonFiles(recordsDir).filter((filePath) =>
    filePath.endsWith("-transformation-proof.json")
  );
  const promotionRecordsDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "runtime", "promotion-records"),
  );
  const registryDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "runtime", "registry"),
  );
  const followUpFiles = listMarkdownFiles(followUpDir).filter(
    (filePath) => !filePath.endsWith("/README.md") && !filePath.endsWith("/.gitkeep"),
  );
  const recordFiles = listMarkdownFiles(recordsDir).filter(
    (filePath) => !filePath.endsWith("/README.md") && filePath.endsWith("-runtime-record.md"),
  );
  const promotionRecordFiles = listMarkdownFiles(promotionRecordsDir).filter(
    (filePath) =>
      !filePath.endsWith("/README.md")
      && !filePath.endsWith("-runtime-promotion-backlog.md")
      && filePath.endsWith("-promotion-record.md"),
  );
  const registryEntryFiles = listMarkdownFiles(registryDir).filter(
    (filePath) =>
      !filePath.endsWith("/README.md") && filePath.endsWith("-registry-entry.md"),
  );

  const recentEntries = [
    ...followUpFiles,
    ...recordFiles,
    ...proofChecklistFiles,
    ...transformationRecordFiles,
    ...transformationProofFiles,
    ...promotionRecordFiles,
    ...registryEntryFiles,
  ]
    .map((filePath) => {
      const isJson = filePath.endsWith(".json");
      const content = fs.readFileSync(filePath, "utf8");
      const json =
        isJson && content.trim().length > 0
          ? (JSON.parse(content) as Record<string, unknown>)
          : null;
      const kind = filePath.includes("/runtime/follow-up/")
        ? ("follow_up" as const)
        : filePath.includes("/runtime/records/")
          ? /-proof-checklist(?:-artifact)?\.md$/i.test(filePath)
            ? ("proof_bundle" as const)
            : filePath.endsWith("-transformation-record.md")
              ? ("transformation_record" as const)
              : filePath.endsWith("-transformation-proof.json")
                ? ("transformation_proof" as const)
            : ("record" as const)
          : filePath.includes("/runtime/promotion-records/")
            ? ("promotion_record" as const)
            : ("registry_entry" as const);
      return {
        kind,
        path: filePath,
        title:
          kind === "transformation_proof"
            ? `Transformation Proof: ${String(json?.candidate_id ?? "unknown")}`
            : readHeading(content),
        candidateId:
          kind === "transformation_proof"
            ? String(json?.candidate_id ?? "").trim() || null
            : readField(content, "Candidate id") ?? readField(content, "Capability id"),
        candidateName:
          kind === "transformation_proof"
            ? null
            : readField(content, "Candidate name")
              ?? readField(content, "Capability name"),
        status:
          kind === "follow_up"
            ? readField(content, "Current status")
            : kind === "record"
              ? readField(content, "Current status")
              : kind === "proof_bundle"
                ? readField(content, "Status")
                : kind === "transformation_record"
                  ? readField(content, "Decision state")
                  : kind === "transformation_proof"
                    ? Array.isArray(json?.regression_checks)
                      && (json?.regression_checks as Array<Record<string, unknown>>).length > 0
                      ? (json?.regression_checks as Array<Record<string, unknown>>).every(
                          (check) => check.result === "pass",
                        )
                        ? "pass"
                        : "fail"
                      : null
              : kind === "promotion_record"
                ? readField(content, "Promotion decision")
                : readField(content, "Runtime status"),
        mtime: fs.statSync(filePath).mtimeMs,
      };
    })
    .sort((left, right) => right.mtime - left.mtime)
    .slice(0, input.maxEntries ?? 8)
    .map(({ mtime: _mtime, ...entry }) => entry);

  return {
    followUpCount: followUpFiles.length,
    recordCount: recordFiles.length,
    proofBundleCount: proofChecklistFiles.length,
    transformationRecordCount: transformationRecordFiles.length,
    transformationProofCount: transformationProofFiles.length,
    promotionRecordCount: promotionRecordFiles.length,
    registryEntryCount: registryEntryFiles.length,
    recentEntries,
  };
}
