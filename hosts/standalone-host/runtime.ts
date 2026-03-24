import path from "node:path";

import type { DiscoverySubmissionRequest } from "../../shared/lib/discovery-submission-router.ts";
import {
  DirectiveEngine,
  createDirectiveWorkspaceEngineLanes,
  type DirectiveEngineMissionInput,
  type DirectiveEngineRunRecord,
  type DirectiveEngineSourceItem,
} from "../../engine/index.ts";
import type {
  ResolvedStandaloneHostConfig,
  ResolvedStandaloneHostPersistence,
} from "./config.ts";
import {
  readDiscoveryOverviewWithHostBridge,
  type DiscoveryOverviewSummary,
} from "../integration-kit/starter/discovery-overview-reader.template.ts";
import {
  createFilesystemDiscoveryHostStorageBridge,
} from "../integration-kit/starter/discovery-host-storage-bridge.filesystem.template.ts";
import {
  submitDiscoveryEntryWithHostBridge,
} from "../integration-kit/starter/discovery-submission-adapter.template.ts";
import { createStandaloneHostPersistenceLedger } from "./persistence.ts";
import type { ForgeFollowUpRecordRequest } from "../../shared/lib/forge-follow-up-record-writer.ts";
import type { ForgeProofBundleRequest } from "../../shared/lib/forge-proof-bundle-writer.ts";
import type { ForgePromotionRecordRequest } from "../../shared/lib/forge-promotion-record-writer.ts";
import type { ForgeRegistryEntryRequest } from "../../shared/lib/forge-registry-entry-writer.ts";
import type { ForgeRecordRequest } from "../../shared/lib/forge-record-writer.ts";
import type { ForgeTransformationProofRequest } from "../../shared/lib/forge-transformation-proof-writer.ts";
import type { ForgeTransformationRecordRequest } from "../../shared/lib/forge-transformation-record-writer.ts";

type JsonValue = Record<string, unknown>;

export const DEFAULT_STANDALONE_HOST_NAME =
  "Directive Workspace Standalone Host";

export type CreateStandaloneFilesystemHostOptions = {
  directiveRoot: string;
  unresolvedGapIds?: string[];
  receivedAt?: string;
  initialQueue?: JsonValue;
  persistence?: ResolvedStandaloneHostPersistence;
  runtimeArtifactsRoot?: string;
};

function normalizeAbsolutePath(filePath: string) {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function normalizeRelativeDirectivePath(
  directiveRoot: string,
  filePath: string,
) {
  return path.relative(directiveRoot, filePath).replace(/\\/g, "/");
}

function sanitizePathSegment(value: string) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function normalizeStandaloneHostReceivedAt(value: string | undefined) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return new Date().toISOString();
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return `${normalized}T00:00:00.000Z`;
  }
  return normalized;
}

function buildDirectiveEngineSourceFromDiscoverySubmission(
  request: DiscoverySubmissionRequest,
): DirectiveEngineSourceItem {
  const notes = [
    typeof request.notes === "string" ? request.notes : null,
    request.record_shape ? `record_shape:${request.record_shape}` : null,
  ].filter((value): value is string => Boolean(value && value.trim()));
  const summary =
    request.mission_alignment?.trim()
    || "Discovery front-door submission processed by the standalone host.";

  return {
    sourceId: request.candidate_id,
    sourceType: request.source_type ?? "internal-signal",
    sourceRef: request.source_reference,
    title: request.candidate_name,
    summary,
    notes,
    missionAlignmentHint: request.mission_alignment ?? null,
    capabilityGapId: request.capability_gap_id ?? null,
  };
}

function buildDirectiveEngineMissionFromDiscoverySubmission(
  request: DiscoverySubmissionRequest,
): DirectiveEngineMissionInput {
  const currentObjective =
    request.mission_alignment?.trim()
    || `Assess ${request.candidate_name} for Directive Workspace usefulness.`;

  return {
    missionId: null,
    currentObjective,
    usefulnessSignals: [
      "mission-relevant usefulness",
      "safe routing through Discovery, Forge, or Architecture",
    ],
    capabilityLanes: [
      "Discovery lane intake and routing",
      "Architecture lane engine self-improvement",
      "Forge lane runtime usefulness conversion",
    ],
  };
}

function resolveStandaloneHostEngineArtifactPaths(input: {
  directiveRoot: string;
  runtimeArtifactsRoot: string;
  record: DirectiveEngineRunRecord;
}) {
  const runtimeArtifactsRoot = normalizeAbsolutePath(input.runtimeArtifactsRoot);
  const artifactDir = path.resolve(runtimeArtifactsRoot, "engine-runs");
  const timestamp = input.record.receivedAt.replace(/[:.]/g, "-");
  const candidateSegment =
    sanitizePathSegment(input.record.candidate.candidateId)
    || sanitizePathSegment(input.record.runId)
    || "directive-engine-run";
  const runSegment = input.record.runId.slice(0, 8).toLowerCase();
  const baseName = `${timestamp}-${candidateSegment}-${runSegment}`;
  const recordPath = normalizeAbsolutePath(path.resolve(artifactDir, `${baseName}.json`));
  const reportPath = normalizeAbsolutePath(path.resolve(artifactDir, `${baseName}.md`));

  return {
    recordPath,
    reportPath,
    recordRelativePath: normalizeRelativeDirectivePath(input.directiveRoot, recordPath),
    reportRelativePath: normalizeRelativeDirectivePath(input.directiveRoot, reportPath),
  };
}

function renderStandaloneHostEngineRunReport(input: {
  record: DirectiveEngineRunRecord;
  artifactPaths: {
    recordRelativePath: string;
  };
}) {
  const { record } = input;

  return [
    "# Directive Engine Run",
    "",
    `- Run ID: \`${record.runId}\``,
    `- Received At: \`${record.receivedAt}\``,
    `- Candidate ID: \`${record.candidate.candidateId}\``,
    `- Candidate Name: ${record.candidate.candidateName}`,
    `- Source Type: \`${record.source.sourceType}\``,
    `- Source Ref: \`${record.source.sourceRef}\``,
    `- Selected Lane: \`${record.selectedLane.laneId}\``,
    `- Usefulness Level: \`${record.candidate.usefulnessLevel}\``,
    `- Decision State: \`${record.decision.decisionState}\``,
    `- Integration Mode: \`${record.integrationProposal.integrationMode}\``,
    `- Proof Kind: \`${record.proofPlan.proofKind}\``,
    `- Run Record Path: \`${input.artifactPaths.recordRelativePath}\``,
    "",
    "## Mission Fit",
    "",
    record.analysis.missionFitSummary,
    "",
    "## Usefulness Rationale",
    "",
    record.analysis.usefulnessRationale,
    "",
    "## Report Summary",
    "",
    record.reportPlan.summary,
    "",
    "## Routing Rationale",
    "",
    ...record.candidate.rationale.map((entry) => `- ${entry}`),
    "",
    "## Next Action",
    "",
    record.integrationProposal.nextAction,
    "",
  ].join("\n");
}

async function loadStandaloneForgeModule() {
  return import("./forge.ts");
}

async function loadStandaloneAcceptanceModule() {
  return import("../integration-kit/starter/run-host-integration-acceptance-quickstart.template.ts");
}

export function createStandaloneFilesystemHost(
  options: CreateStandaloneFilesystemHostOptions,
) {
  const harness = createFilesystemDiscoveryHostStorageBridge({
    directiveRoot: options.directiveRoot,
    unresolvedGapIds: options.unresolvedGapIds,
    receivedAt: options.receivedAt,
    initialQueue: options.initialQueue,
  });
  const persistenceLedger = createStandaloneHostPersistenceLedger({
    persistence: options.persistence,
  });
  const runtimeArtifactsRoot = normalizeAbsolutePath(
    options.runtimeArtifactsRoot
      ?? path.resolve(options.directiveRoot, "runtime", "standalone-host"),
  );
  const storage = {
    ...harness.bridge,
    async writeJson(filePath: string, value: unknown) {
      await harness.bridge.writeJson(filePath, value);
      persistenceLedger.recordJsonArtifact(filePath, value, "json_artifact");
    },
    async writeText(filePath: string, content: string) {
      await harness.bridge.writeText(filePath, content);
      persistenceLedger.recordTextArtifact(filePath, content, "text_artifact");
    },
  };

  return {
    directiveRoot: harness.directiveRoot,
    runtimeArtifactsRoot,
    receivedAt: options.receivedAt,
    unresolvedGapIds: [...(options.unresolvedGapIds ?? [])],
    persistence: persistenceLedger.describe(),
    storage,
    submitDiscoveryEntry(
      request: DiscoverySubmissionRequest,
      dryRun = false,
    ) {
      return submitDiscoveryEntryWithHostBridge({
        request,
        storage,
        dryRun,
      });
    },
    async submitDiscoveryEntryWithEngine(
      request: DiscoverySubmissionRequest,
      dryRun = false,
    ) {
      const submission = await submitDiscoveryEntryWithHostBridge({
        request,
        storage,
        dryRun,
      });

      if (dryRun) {
        return {
          ...submission,
          engine: {
            ok: true,
            processed: false,
            reason: "dry_run",
          },
        };
      }

      try {
        const engine = new DirectiveEngine({
          laneSet: createDirectiveWorkspaceEngineLanes(),
        });
        const engineResult = await engine.processSource({
          source: buildDirectiveEngineSourceFromDiscoverySubmission(request),
          mission: buildDirectiveEngineMissionFromDiscoverySubmission(request),
          receivedAt: normalizeStandaloneHostReceivedAt(
            options.receivedAt ?? harness.bridge.receivedAt,
          ),
        });
        const artifactPaths = resolveStandaloneHostEngineArtifactPaths({
          directiveRoot: harness.directiveRoot,
          runtimeArtifactsRoot,
          record: engineResult.record,
        });
        await storage.writeJson(artifactPaths.recordPath, engineResult.record);
        await storage.writeText(
          artifactPaths.reportPath,
          renderStandaloneHostEngineRunReport({
            record: engineResult.record,
            artifactPaths,
          }),
        );

        return {
          ...submission,
          engine: {
            ok: true,
            processed: true,
            path: artifactPaths.recordPath,
            relativePath: artifactPaths.recordRelativePath,
            reportPath: artifactPaths.reportPath,
            reportRelativePath: artifactPaths.reportRelativePath,
            record: engineResult.record,
            adapterResults: engineResult.adapterResults,
          },
        };
      } catch (error) {
        return {
          ...submission,
          engine: {
            ok: false,
            processed: false,
            error: String((error as Error).message || error),
          },
        };
      }
    },
    readDiscoveryOverview(maxEntries?: number): DiscoveryOverviewSummary {
      return readDiscoveryOverviewWithHostBridge({
        storage,
        maxEntries,
      });
    },
    async writeForgeFollowUp(request: ForgeFollowUpRecordRequest) {
      const { writeStandaloneForgeFollowUp } = await loadStandaloneForgeModule();
      return writeStandaloneForgeFollowUp({
        storage,
        request,
      });
    },
    async writeForgeRecord(request: ForgeRecordRequest) {
      const { writeStandaloneForgeRecord } = await loadStandaloneForgeModule();
      return writeStandaloneForgeRecord({
        storage,
        request,
      });
    },
    async writeForgeProofBundle(request: ForgeProofBundleRequest) {
      const { writeStandaloneForgeProofBundle } = await loadStandaloneForgeModule();
      return writeStandaloneForgeProofBundle({
        storage,
        request,
      });
    },
    async writeForgeTransformationProof(request: ForgeTransformationProofRequest) {
      const { writeStandaloneForgeTransformationProof } = await loadStandaloneForgeModule();
      return writeStandaloneForgeTransformationProof({
        storage,
        request,
      });
    },
    async writeForgeTransformationRecord(request: ForgeTransformationRecordRequest) {
      const { writeStandaloneForgeTransformationRecord } = await loadStandaloneForgeModule();
      return writeStandaloneForgeTransformationRecord({
        storage,
        request,
      });
    },
    async writeForgePromotionRecord(request: ForgePromotionRecordRequest) {
      const { writeStandaloneForgePromotionRecord } = await loadStandaloneForgeModule();
      return writeStandaloneForgePromotionRecord({
        storage,
        request,
      });
    },
    async writeForgeRegistryEntry(request: ForgeRegistryEntryRequest) {
      const { writeStandaloneForgeRegistryEntry } = await loadStandaloneForgeModule();
      return writeStandaloneForgeRegistryEntry({
        storage,
        request,
      });
    },
    async readForgeOverview(maxEntries?: number) {
      const { readStandaloneForgeOverview } = await loadStandaloneForgeModule();
      return readStandaloneForgeOverview({
        directiveRoot: harness.directiveRoot,
        maxEntries,
      });
    },
    readQueue() {
      return harness.readQueue();
    },
    readText(relativePath: string) {
      return harness.readText(relativePath);
    },
    listTextArtifactPaths() {
      return harness.listTextArtifactPaths();
    },
    listJsonArtifactPaths() {
      return harness.listJsonArtifactPaths();
    },
    close() {
      persistenceLedger.close();
    },
  };
}

export function createStandaloneFilesystemHostFromConfig(
  config: ResolvedStandaloneHostConfig,
) {
  return createStandaloneFilesystemHost({
    directiveRoot: config.directiveRoot,
    receivedAt: config.receivedAt,
    unresolvedGapIds: config.unresolvedGapIds,
    initialQueue: config.initialQueue,
    persistence: config.persistence,
    runtimeArtifactsRoot: config.runtimeArtifacts.root,
  });
}

export async function runStandaloneHostAcceptanceQuickstart(input: {
  outputRoot: string;
  hostName?: string;
  relativeOutputPath?: string;
  generatedAt?: string;
}) {
  const { runHostIntegrationAcceptanceQuickstart } = await loadStandaloneAcceptanceModule();
  return runHostIntegrationAcceptanceQuickstart({
    hostName: input.hostName ?? DEFAULT_STANDALONE_HOST_NAME,
    moduleSurface: "package_import",
    outputRoot: input.outputRoot,
    relativeOutputPath: input.relativeOutputPath,
    generatedAt: input.generatedAt,
  });
}
