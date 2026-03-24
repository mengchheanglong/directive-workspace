import fs from "node:fs";
import path from "node:path";

import type { DiscoveryHostStorageBridge } from "../integration-kit/starter/discovery-submission-adapter.template";
import {
  renderForgeFollowUpRecord,
  resolveForgeFollowUpRecordPath,
  type ForgeFollowUpRecordRequest,
} from "../../shared/lib/forge-follow-up-record-writer";
import {
  renderForgeRecord,
  resolveForgeRecordPath,
  type ForgeRecordRequest,
} from "../../shared/lib/forge-record-writer";
import {
  renderForgeProofChecklist,
  resolveForgeProofChecklistPath,
  resolveForgeProofGateSnapshotPath,
  type ForgeProofBundleRequest,
} from "../../shared/lib/forge-proof-bundle-writer";
import {
  renderForgeTransformationProof,
  resolveForgeTransformationProofPath,
  type ForgeTransformationProofRequest,
} from "../../shared/lib/forge-transformation-proof-writer";
import {
  renderForgeTransformationRecord,
  resolveForgeTransformationRecordPath,
  type ForgeTransformationRecordRequest,
} from "../../shared/lib/forge-transformation-record-writer";
import {
  renderForgePromotionRecord,
  resolveForgePromotionRecordPath,
  type ForgePromotionRecordRequest,
} from "../../shared/lib/forge-promotion-record-writer";
import {
  renderForgeRegistryEntry,
  resolveForgeRegistryEntryPath,
  type ForgeRegistryEntryRequest,
} from "../../shared/lib/forge-registry-entry-writer";

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

export type StandaloneForgeOverviewEntry = {
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

export type StandaloneForgeOverviewSummary = {
  followUpCount: number;
  recordCount: number;
  proofBundleCount: number;
  transformationRecordCount: number;
  transformationProofCount: number;
  promotionRecordCount: number;
  registryEntryCount: number;
  recentEntries: StandaloneForgeOverviewEntry[];
};

export async function writeStandaloneForgeFollowUp(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgeFollowUpRecordRequest;
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
    linked_forge_record_path: input.request.linked_forge_record_path
      ? resolveDirectivePathLike(input.storage, input.request.linked_forge_record_path)
      : input.request.linked_forge_record_path,
    linked_proof_checklist_path: input.request.linked_proof_checklist_path
      ? resolveDirectivePathLike(
          input.storage,
          input.request.linked_proof_checklist_path,
        )
      : input.request.linked_proof_checklist_path,
    linked_live_proof_path: input.request.linked_live_proof_path
      ? resolveDirectivePathLike(input.storage, input.request.linked_live_proof_path)
      : input.request.linked_live_proof_path,
  } satisfies ForgeFollowUpRecordRequest;

  const relativePath = resolveForgeFollowUpRecordPath({
    candidate_id: request.candidate_id,
    follow_up_date: request.follow_up_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderForgeFollowUpRecord(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneForgeRecord(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgeRecordRequest;
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
  } satisfies ForgeRecordRequest;

  const relativePath = resolveForgeRecordPath({
    candidate_id: request.candidate_id,
    forge_record_date: request.forge_record_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderForgeRecord(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneForgeProofBundle(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgeProofBundleRequest;
}) {
  const linkedForgeRecord = resolveDirectivePathLike(
    input.storage,
    input.request.linked_forge_record,
  );
  assertDirectivePathExists(linkedForgeRecord, "linked_forge_record");

  const request = {
    ...input.request,
    linked_forge_record: linkedForgeRecord,
    source_proof_artifacts: (input.request.source_proof_artifacts ?? []).map((value) =>
      resolveDirectivePathLike(input.storage, value)
    ),
  } satisfies ForgeProofBundleRequest;

  const relativePath = resolveForgeProofChecklistPath({
    candidate_id: request.candidate_id,
    proof_date: request.proof_date,
    output_relative_path: request.output_relative_path,
  });
  const gateSnapshotRelativePath = resolveForgeProofGateSnapshotPath({
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
    renderForgeProofChecklist({
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

export async function writeStandaloneForgeTransformationProof(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgeTransformationProofRequest;
}) {
  const relativePath = resolveForgeTransformationProofPath({
    candidate_id: input.request.candidate_id,
    proof_date: input.request.proof_date,
    output_relative_path: input.request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeJson(
    absolutePath,
    renderForgeTransformationProof(input.request),
  );

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: input.request.candidate_id,
  };
}

export async function writeStandaloneForgeTransformationRecord(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgeTransformationRecordRequest;
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
  } satisfies ForgeTransformationRecordRequest;

  assertDirectivePathExists(request.baseline_artifact_path, "baseline_artifact_path");
  assertDirectivePathExists(request.result_artifact_path, "result_artifact_path");

  const relativePath = resolveForgeTransformationRecordPath({
    candidate_id: request.candidate_id,
    record_date: request.record_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(
    absolutePath,
    renderForgeTransformationRecord(request),
  );

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneForgePromotionRecord(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgePromotionRecordRequest;
}) {
  const linkedForgeRecord = resolveDirectivePathLike(
    input.storage,
    input.request.linked_forge_record,
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
  assertDirectivePathExists(linkedForgeRecord, "linked_forge_record");
  assertDirectivePathExists(sourceIntentArtifact, "source_intent_artifact");
  assertDirectivePathExists(proofPath, "proof_path");

  const request = {
    ...input.request,
    linked_forge_record: linkedForgeRecord,
    source_intent_artifact: sourceIntentArtifact,
    compile_contract_artifact: compileContractArtifact,
    proof_path: proofPath,
  } satisfies ForgePromotionRecordRequest;

  const relativePath = resolveForgePromotionRecordPath({
    candidate_id: request.candidate_id,
    promotion_date: request.promotion_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderForgePromotionRecord(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export async function writeStandaloneForgeRegistryEntry(input: {
  storage: DiscoveryHostStorageBridge;
  request: ForgeRegistryEntryRequest;
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
  } satisfies ForgeRegistryEntryRequest;

  const relativePath = resolveForgeRegistryEntryPath({
    candidate_id: request.candidate_id,
    registry_date: request.registry_date,
    output_relative_path: request.output_relative_path,
  });
  const absolutePath = input.storage.resolveWithinDirectiveRoot(relativePath);
  await input.storage.writeText(absolutePath, renderForgeRegistryEntry(request));

  return {
    ok: true,
    path: absolutePath,
    relativePath,
    candidate_id: request.candidate_id,
  };
}

export function readStandaloneForgeOverview(input: {
  directiveRoot: string;
  maxEntries?: number;
}): StandaloneForgeOverviewSummary {
  const followUpDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "forge", "follow-up"),
  );
  const recordsDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "forge", "records"),
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
    path.resolve(input.directiveRoot, "forge", "promotion-records"),
  );
  const registryDir = normalizeAbsolutePath(
    path.resolve(input.directiveRoot, "forge", "registry"),
  );
  const followUpFiles = listMarkdownFiles(followUpDir).filter(
    (filePath) => !filePath.endsWith("/README.md") && !filePath.endsWith("/.gitkeep"),
  );
  const recordFiles = listMarkdownFiles(recordsDir).filter(
    (filePath) => !filePath.endsWith("/README.md") && filePath.endsWith("-forge-record.md"),
  );
  const promotionRecordFiles = listMarkdownFiles(promotionRecordsDir).filter(
    (filePath) =>
      !filePath.endsWith("/README.md")
      && !filePath.endsWith("-forge-promotion-backlog.md")
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
      const kind = filePath.includes("/forge/follow-up/")
        ? ("follow_up" as const)
        : filePath.includes("/forge/records/")
          ? /-proof-checklist(?:-artifact)?\.md$/i.test(filePath)
            ? ("proof_bundle" as const)
            : filePath.endsWith("-transformation-record.md")
              ? ("transformation_record" as const)
              : filePath.endsWith("-transformation-proof.json")
                ? ("transformation_proof" as const)
            : ("record" as const)
          : filePath.includes("/forge/promotion-records/")
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
