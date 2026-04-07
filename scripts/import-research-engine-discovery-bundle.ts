import path from "node:path";
import { fileURLToPath } from "node:url";

import { importResearchEngineDiscoveryBundle } from "../hosts/adapters/research-engine-discovery-import.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv: string[]) {
  let bundlePath: string | null = null;
  let directiveRoot = DIRECTIVE_ROOT;
  let receivedAt: string | undefined;
  let runtimeArtifactsRoot: string | undefined;
  const candidateIds: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--bundle") {
      bundlePath = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--directive-root") {
      directiveRoot = path.resolve(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (arg === "--received-at") {
      receivedAt = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--runtime-artifacts-root") {
      runtimeArtifactsRoot = path.resolve(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (arg === "--candidate-id") {
      const candidateId = argv[index + 1] ?? "";
      if (candidateId.trim().length === 0) {
        throw new Error("invalid_input: --candidate-id requires a value");
      }
      candidateIds.push(candidateId);
      index += 1;
      continue;
    }
    throw new Error(`invalid_input: unknown argument ${arg}`);
  }

  if (!bundlePath || bundlePath.trim().length === 0) {
    throw new Error("invalid_input: --bundle <path-to-dw_import_bundle.json-or-directory> is required");
  }

  return {
    bundlePath: path.resolve(bundlePath),
    directiveRoot,
    receivedAt,
    runtimeArtifactsRoot,
    candidateIds,
  };
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  const result = await importResearchEngineDiscoveryBundle({
    directiveRoot: parsed.directiveRoot,
    bundlePath: parsed.bundlePath,
    candidateIds: parsed.candidateIds,
    receivedAt: parsed.receivedAt,
    runtimeArtifactsRoot: parsed.runtimeArtifactsRoot,
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        bundleManifestPath: result.bundleManifestPath,
        importedCount: result.importedCount,
        selectedSourceCandidateIds: result.selectedSourceCandidateIds,
        imports: result.imports.map((entry) => ({
          sourceCandidateId: entry.sourceCandidateId,
          importedCandidateId: entry.importedCandidateId,
          sourceReference: entry.sourceReference,
          sourceType: entry.sourceType,
          submissionOrigin: entry.discovery.queueEntry.submission_origin ?? null,
          discoverySignalBand: entry.discovery.queueEntry.discovery_signal_band ?? null,
          signalTotalScore: entry.discovery.queueEntry.signal_total_score ?? null,
          signalScoreSummary: entry.discovery.queueEntry.signal_score_summary ?? null,
          routeTarget: entry.discovery.discovery.routingTarget,
          decisionState: entry.discovery.discovery.decisionState,
          createdPaths: entry.discovery.createdPaths,
        })),
      },
      null,
      2,
    )}\n`,
  );
}

await main();
