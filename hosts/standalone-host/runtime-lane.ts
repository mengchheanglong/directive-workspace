import fs from "node:fs";
import path from "node:path";

import type { DiscoveryHostStorageBridge } from "../integration-kit/starter/discovery-submission-adapter.template";
import { resolveDirectiveWorkspaceState } from "../../shared/lib/dw-state.ts";
import {
  DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
  readDirectiveRuntimePromotionSpecification,
} from "../../shared/lib/runtime-promotion-specification.ts";
import {
  renderRuntimeFollowUpRecord,
  resolveRuntimeFollowUpRecordPath,
  type RuntimeFollowUpRecordRequest,
} from "../../shared/lib/runtime-follow-up-record-writer.ts";
import {
  renderRuntimeRecord,
  resolveRuntimeRecordPath,
  type RuntimeRecordRequest,
} from "../../shared/lib/runtime-record-writer.ts";
import {
  renderRuntimeProofChecklist,
  resolveRuntimeProofChecklistPath,
  resolveRuntimeProofGateSnapshotPath,
  type RuntimeProofBundleRequest,
} from "../../shared/lib/runtime-proof-bundle-writer.ts";
import {
  renderRuntimeTransformationProof,
  resolveRuntimeTransformationProofPath,
  type RuntimeTransformationProofRequest,
} from "../../shared/lib/runtime-transformation-proof-writer.ts";
import {
  renderRuntimeTransformationRecord,
  resolveRuntimeTransformationRecordPath,
  type RuntimeTransformationRecordRequest,
} from "../../shared/lib/runtime-transformation-record-writer.ts";
import {
  renderRuntimePromotionRecord,
  resolveRuntimePromotionRecordPath,
  type RuntimePromotionRecordRequest,
} from "../../shared/lib/runtime-promotion-record-writer.ts";
import {
  renderRuntimeRegistryEntry,
  resolveRuntimeRegistryEntryPath,
  type RuntimeRegistryEntryRequest,
} from "../../shared/lib/runtime-registry-entry-writer.ts";
import {
  runDirectiveRuntimeCallableExecution,
  type DirectiveRuntimeCallableExecutionRunResult,
} from "../../runtime/core/callable-execution.ts";
import {
  runDirectiveRuntimeV0LiveMiniSweAgentCallableIntegration,
} from "../../runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts";

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

export type StandaloneScientifyToolDescriptor = {
  tool: string;
  functionName: string;
  modulePath: string;
};

export type StandaloneLiveMiniSweCallableBoundaryDescriptor = {
  inputShape: string[];
  outputShape: string[];
  description: string;
  safetyRules: string[];
};

export type StandaloneScientifyBundleDescriptor = {
  candidateId: string;
  candidateName: string;
  hostSurface: string;
  currentStage: string;
  nextLegalStep: string;
  proposedHost: string | null;
  executionState: string | null;
  promotionReadinessBlockers: string[];
  prePromotionSlicePath: string;
  implementationSlicePath: string;
  artifactPath: string;
  linkedArtifacts: {
    runtimeRecordPath: string | null;
    runtimeProofPath: string | null;
    runtimeCapabilityBoundaryPath: string | null;
    runtimePromotionReadinessPath: string | null;
    runtimePromotionRecordPath: string | null;
    runtimePromotionSpecificationPath: string | null;
    runtimeCallableStubPath: string | null;
  };
  adapter: {
    adapterId: string;
    loadMode: "read_promotion_specification_only";
    compileContractArtifact: string;
    promotionSpecificationPath: string;
    callableStubPath: string | null;
    integrationMode: string | null;
    targetRuntimeSurface: string | null;
    requiredGates: string[];
    openDecisions: string[];
    hostConsumableDescription: string;
  };
  tools: StandaloneScientifyToolDescriptor[];
  runtimeOwnedBoundary: string[];
  standaloneHostOwnedBoundary: string[];
};

export type StandaloneScientifyHostInvocationRequest = {
  tool: StandaloneScientifyToolDescriptor["tool"];
  input: Record<string, unknown>;
  timeoutMs?: number;
  executionAt?: string;
  persistArtifacts?: boolean;
};

export type StandaloneScientifyHostInvocationResult = {
  candidateId: string;
  candidateName: string;
  hostSurface: string;
  currentStage: string;
  proposedHost: string | null;
  linkedArtifacts: StandaloneScientifyBundleDescriptor["linkedArtifacts"];
  adapter: {
    adapterId: string;
    invokeSurface: "standalone_host_runtime_scientify_invoke";
    compileContractArtifact: string;
    promotionSpecificationPath: string;
    callableStubPath: string | null;
    runtimeExecutorSurface: "runtime/core/callable-execution.ts";
    runtimeInternalsBypassed: false;
    hostIntegrated: true;
    promotionAutomation: false;
    automaticWorkflowAdvancement: false;
  };
  execution: DirectiveRuntimeCallableExecutionRunResult;
};

export type StandaloneLiveMiniSweAgentDescriptor = {
  candidateId: string;
  candidateName: string;
  hostSurface: string;
  currentStage: string;
  nextLegalStep: string;
  proposedHost: string | null;
  executionState: string | null;
  promotionReadinessBlockers: string[];
  prePromotionSlicePath: string;
  implementationSlicePath: string;
  artifactPath: string;
  linkedArtifacts: {
    runtimeRecordPath: string | null;
    runtimeProofPath: string | null;
    runtimeCapabilityBoundaryPath: string | null;
    runtimePromotionReadinessPath: string | null;
    runtimePromotionRecordPath: string | null;
    runtimePromotionSpecificationPath: string | null;
    runtimeCallableStubPath: string | null;
  };
  adapter: {
    adapterId: string;
    loadMode: "read_promotion_specification_only";
    compileContractArtifact: string;
    promotionSpecificationPath: string;
    callableStubPath: string | null;
    integrationMode: string | null;
    targetRuntimeSurface: string | null;
    requiredGates: string[];
    openDecisions: string[];
    hostConsumableDescription: string;
  };
  callableBoundary: StandaloneLiveMiniSweCallableBoundaryDescriptor;
  runtimeOwnedBoundary: string[];
  standaloneHostOwnedBoundary: string[];
};

const SCIENTIFY_PROMOTION_READINESS_RELATIVE_PATH =
  "runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md";
const SCIENTIFY_PRE_PROMOTION_SLICE_RELATIVE_PATH =
  "runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-pre-promotion-implementation-slice-01.md";
const SCIENTIFY_IMPLEMENTATION_SLICE_RELATIVE_PATH =
  "runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-runtime-implementation-slice-01.md";
const STANDALONE_HOST_TARGET =
  "Directive Workspace standalone host (hosts/standalone-host/)";
const SCIENTIFY_DESCRIPTOR_TOOLS: StandaloneScientifyToolDescriptor[] = [
  {
    tool: "arxiv-search",
    functionName: "arxivSearch",
    modulePath: "runtime/capabilities/literature-access/arxiv-search.ts",
  },
  {
    tool: "arxiv-download",
    functionName: "arxivDownload",
    modulePath: "runtime/capabilities/literature-access/arxiv-download.ts",
  },
  {
    tool: "openalex-search",
    functionName: "openalexSearch",
    modulePath: "runtime/capabilities/literature-access/openalex-search.ts",
  },
  {
    tool: "unpaywall-download",
    functionName: "unpaywallDownload",
    modulePath: "runtime/capabilities/literature-access/unpaywall-download.ts",
  },
];

const LIVE_MINI_SWE_PROMOTION_READINESS_RELATIVE_PATH =
  "runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md";
const LIVE_MINI_SWE_PRE_PROMOTION_SLICE_RELATIVE_PATH =
  "runtime/follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-pre-promotion-implementation-slice-01.md";
const LIVE_MINI_SWE_IMPLEMENTATION_SLICE_RELATIVE_PATH =
  "runtime/follow-up/2026-04-02-dw-live-mini-swe-agent-engine-pressure-2026-03-24-standalone-host-runtime-implementation-slice-01.md";

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

export function readStandaloneScientifyLiteratureAccessBundle(input: {
  directiveRoot: string;
}): StandaloneScientifyBundleDescriptor {
  const resolved = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    artifactPath: SCIENTIFY_PROMOTION_READINESS_RELATIVE_PATH,
    includeAnchors: false,
  }).focus;

  if (!resolved || !resolved.runtime) {
    throw new Error("scientify_runtime_descriptor_unavailable");
  }
  const promotionSpecificationPath =
    resolved.linkedArtifacts.runtimePromotionSpecificationPath;
  if (!promotionSpecificationPath) {
    throw new Error("scientify_runtime_promotion_specification_unavailable");
  }
  const promotionSpecification = readDirectiveRuntimePromotionSpecification({
    directiveRoot: input.directiveRoot,
    promotionSpecificationPath,
  });

  return {
    candidateId: resolved.candidateId ?? "dw-source-scientify-research-workflow-plugin-2026-03-27",
    candidateName: resolved.candidateName ?? "Scientify Literature-Access Tool Bundle",
    hostSurface: "Directive Workspace standalone host CLI descriptor",
    currentStage: resolved.currentStage,
    nextLegalStep: resolved.nextLegalStep,
    proposedHost: resolved.runtime.proposedHost,
    executionState: resolved.runtime.executionState,
    promotionReadinessBlockers: [...resolved.runtime.promotionReadinessBlockers],
    prePromotionSlicePath: SCIENTIFY_PRE_PROMOTION_SLICE_RELATIVE_PATH,
    implementationSlicePath: SCIENTIFY_IMPLEMENTATION_SLICE_RELATIVE_PATH,
    artifactPath: SCIENTIFY_PROMOTION_READINESS_RELATIVE_PATH,
    linkedArtifacts: {
      runtimeRecordPath: resolved.linkedArtifacts.runtimeRecordPath,
      runtimeProofPath: resolved.linkedArtifacts.runtimeProofPath,
      runtimeCapabilityBoundaryPath: resolved.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
      runtimePromotionReadinessPath: resolved.linkedArtifacts.runtimePromotionReadinessPath,
      runtimePromotionRecordPath: resolved.linkedArtifacts.runtimePromotionRecordPath,
      runtimePromotionSpecificationPath: promotionSpecificationPath,
      runtimeCallableStubPath: resolved.linkedArtifacts.runtimeCallableStubPath,
    },
    adapter: {
      adapterId: `${promotionSpecification.candidateId}:standalone_host:promotion_spec_adapter`,
      loadMode: "read_promotion_specification_only",
      compileContractArtifact: DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
      promotionSpecificationPath,
      callableStubPath: promotionSpecification.linkedArtifacts.callableStubPath,
      integrationMode: promotionSpecification.integrationMode,
      targetRuntimeSurface: promotionSpecification.targetRuntimeSurface,
      requiredGates: [...promotionSpecification.requiredGates],
      openDecisions: [...promotionSpecification.openDecisions],
      hostConsumableDescription: promotionSpecification.hostConsumableDescription,
    },
    tools: [...SCIENTIFY_DESCRIPTOR_TOOLS],
    runtimeOwnedBoundary: [
      "lifecycle truth",
      "blocker judgment",
      "tool module ownership",
      "promotion/execution/integration legality",
    ],
    standaloneHostOwnedBoundary: [
      "read-only descriptor surface for the approved 4-tool bundle",
      "promotion-specification reader for the approved Runtime-owned capability",
      "host-visible summary of current Runtime truth and linked artifacts",
    ],
  };
}

export async function invokeStandaloneScientifyLiteratureAccessTool(input: {
  directiveRoot: string;
  request: StandaloneScientifyHostInvocationRequest;
}): Promise<StandaloneScientifyHostInvocationResult> {
  const descriptor = readStandaloneScientifyLiteratureAccessBundle({
    directiveRoot: input.directiveRoot,
  });
  const promotionSpecificationPath =
    descriptor.linkedArtifacts.runtimePromotionSpecificationPath;
  if (!promotionSpecificationPath) {
    throw new Error("scientify_runtime_promotion_specification_unavailable");
  }
  if (descriptor.currentStage !== "runtime.promotion_record.opened") {
    throw new Error("scientify_host_invoke_requires_promotion_record");
  }
  if (descriptor.proposedHost !== STANDALONE_HOST_TARGET) {
    throw new Error("scientify_host_invoke_requires_standalone_host_target");
  }

  const promotionSpecification = readDirectiveRuntimePromotionSpecification({
    directiveRoot: input.directiveRoot,
    promotionSpecificationPath,
  });
  const execution = await runDirectiveRuntimeCallableExecution({
    directiveRoot: input.directiveRoot,
    capabilityId: descriptor.candidateId,
    tool: input.request.tool,
    input: input.request.input,
    timeoutMs: input.request.timeoutMs,
    executionAt: input.request.executionAt,
    persistArtifacts: input.request.persistArtifacts,
  });

  return {
    candidateId: descriptor.candidateId,
    candidateName: descriptor.candidateName,
    hostSurface: "Directive Workspace standalone host callable invoke adapter",
    currentStage: descriptor.currentStage,
    proposedHost: descriptor.proposedHost,
    linkedArtifacts: descriptor.linkedArtifacts,
    adapter: {
      adapterId: `${promotionSpecification.candidateId}:standalone_host:runtime_callable_invoke_adapter`,
      invokeSurface: "standalone_host_runtime_scientify_invoke",
      compileContractArtifact: DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
      promotionSpecificationPath,
      callableStubPath: promotionSpecification.linkedArtifacts.callableStubPath,
      runtimeExecutorSurface: "runtime/core/callable-execution.ts",
      runtimeInternalsBypassed: false,
      hostIntegrated: true,
      promotionAutomation: false,
      automaticWorkflowAdvancement: false,
    },
    execution,
  };
}

export function readStandaloneLiveMiniSweAgentDescriptor(input: {
  directiveRoot: string;
}): StandaloneLiveMiniSweAgentDescriptor {
  const resolved = resolveDirectiveWorkspaceState({
    directiveRoot: input.directiveRoot,
    artifactPath: LIVE_MINI_SWE_PROMOTION_READINESS_RELATIVE_PATH,
    includeAnchors: false,
  }).focus;

  if (!resolved || !resolved.runtime) {
    throw new Error("live_mini_swe_runtime_descriptor_unavailable");
  }
  const promotionSpecificationPath =
    resolved.linkedArtifacts.runtimePromotionSpecificationPath;
  const callableStubPath = resolved.linkedArtifacts.runtimeCallableStubPath;
  if (!promotionSpecificationPath) {
    throw new Error("live_mini_swe_runtime_promotion_specification_unavailable");
  }
  if (!callableStubPath) {
    throw new Error("live_mini_swe_runtime_callable_stub_unavailable");
  }
  const promotionSpecification = readDirectiveRuntimePromotionSpecification({
    directiveRoot: input.directiveRoot,
    promotionSpecificationPath,
  });
  const callable = runDirectiveRuntimeV0LiveMiniSweAgentCallableIntegration();

  return {
    candidateId: resolved.candidateId ?? "dw-live-mini-swe-agent-engine-pressure-2026-03-24",
    candidateName: resolved.candidateName ?? "mini-swe-agent Runtime Capability Pressure",
    hostSurface: "Directive Workspace standalone host CLI descriptor",
    currentStage: resolved.currentStage,
    nextLegalStep: resolved.nextLegalStep,
    proposedHost: resolved.runtime.proposedHost,
    executionState: resolved.runtime.executionState,
    promotionReadinessBlockers: [...resolved.runtime.promotionReadinessBlockers],
    prePromotionSlicePath: LIVE_MINI_SWE_PRE_PROMOTION_SLICE_RELATIVE_PATH,
    implementationSlicePath: LIVE_MINI_SWE_IMPLEMENTATION_SLICE_RELATIVE_PATH,
    artifactPath: LIVE_MINI_SWE_PROMOTION_READINESS_RELATIVE_PATH,
    linkedArtifacts: {
      runtimeRecordPath: resolved.linkedArtifacts.runtimeRecordPath,
      runtimeProofPath: resolved.linkedArtifacts.runtimeProofPath,
      runtimeCapabilityBoundaryPath: resolved.linkedArtifacts.runtimeRuntimeCapabilityBoundaryPath,
      runtimePromotionReadinessPath: resolved.linkedArtifacts.runtimePromotionReadinessPath,
      runtimePromotionRecordPath: resolved.linkedArtifacts.runtimePromotionRecordPath,
      runtimePromotionSpecificationPath: promotionSpecificationPath,
      runtimeCallableStubPath: callableStubPath,
    },
    adapter: {
      adapterId: `${promotionSpecification.candidateId}:standalone_host:promotion_spec_adapter`,
      loadMode: "read_promotion_specification_only",
      compileContractArtifact: DIRECTIVE_RUNTIME_TO_HOST_CONTRACT_PATH,
      promotionSpecificationPath,
      callableStubPath: promotionSpecification.linkedArtifacts.callableStubPath,
      integrationMode: promotionSpecification.integrationMode,
      targetRuntimeSurface: promotionSpecification.targetRuntimeSurface,
      requiredGates: [...promotionSpecification.requiredGates],
      openDecisions: [...promotionSpecification.openDecisions],
      hostConsumableDescription: promotionSpecification.hostConsumableDescription,
    },
    callableBoundary: {
      inputShape: [...callable.callableBoundary.inputShape],
      outputShape: [...callable.callableBoundary.outputShape],
      description: callable.callableBoundary.description,
      safetyRules: [...callable.callableBoundary.safetyRules],
    },
    runtimeOwnedBoundary: [
      "lifecycle truth",
      "blocker judgment",
      "callable legality",
      "promotion/execution/integration legality",
    ],
    standaloneHostOwnedBoundary: [
      "read-only descriptor surface for the approved live mini-swe callable boundary",
      "promotion-specification reader for the approved Runtime-owned capability",
      "host-visible summary of current Runtime truth and linked artifacts",
    ],
  };
}
