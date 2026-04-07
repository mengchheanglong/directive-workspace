import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CURRENT_SCRIPT_PATH = fileURLToPath(import.meta.url);

const HISTORICAL_ROOTS = [
  "architecture/01-experiments",
  "architecture/04-materialization",
  "runtime/follow-up",
  "runtime/02-records",
  "runtime/03-proof",
  "runtime/04-capability-boundaries",
  "runtime/05-promotion-readiness",
  "runtime/06-promotion-specifications",
  "runtime/promotion-records",
  "runtime/records",
  "discovery/triage",
  "discovery/routing-log",
  "discovery/monitor",
] as const;

const ACTIVE_CONSUMER_ROOTS = [
  "engine",
  "hosts",
  "scripts",
  "shared",
  "control/runbook",
  "control/policies",
  "control/state",
] as const;

const ACTIVE_CONSUMER_FILES = [
  "README.md",
  "CLAUDE.md",
  "OWNERSHIP.md",
  "operator-start.md",
  "PUBLISH_READINESS.md",
  "road-to-completion.md",
] as const;

const STALE_PATH_PATTERNS = [
  {
    id: "shared_lib_dw_state",
    match: /shared\/lib\/dw-state(?:\/[^\s`)]*)?\.ts/g,
    canonicalOwner: "engine_state",
    canonicalLocationHint: "engine/state/",
  },
  {
    id: "shared_lib_architecture",
    match: /shared\/lib\/architecture-[^\s`)]*\.ts/g,
    canonicalOwner: "architecture_lane_code",
    canonicalLocationHint: "architecture/lib/",
  },
  {
    id: "shared_lib_runtime",
    match: /shared\/lib\/runtime-[^\s`)]*\.ts/g,
    canonicalOwner: "runtime_lane_code",
    canonicalLocationHint: "runtime/lib/",
  },
  {
    id: "shared_lib_discovery",
    match: /shared\/lib\/discovery-[^\s`)]*\.ts/g,
    canonicalOwner: "discovery_lane_code",
    canonicalLocationHint: "discovery/lib/",
  },
  {
    id: "engine_lane_code",
    match: /engine\/(?:architecture|runtime|discovery)\/[^\s`)]*\.ts/g,
    canonicalOwner: "lane_code_root",
    canonicalLocationHint: "architecture/lib/, runtime/lib/, discovery/lib/",
  },
] as const;

type StaleReferenceMatch = {
  family: (typeof STALE_PATH_PATTERNS)[number]["id"];
  value: string;
  canonicalOwner: (typeof STALE_PATH_PATTERNS)[number]["canonicalOwner"];
  canonicalLocationHint: string;
};

export type HistoricalArtifactClassification = "historical_only" | "operationally_consumed";

export type HistoricalArtifactEntry = {
  artifactPath: string;
  staleReferences: StaleReferenceMatch[];
  operationallyConsumed: boolean;
  consumers: string[];
  classification: HistoricalArtifactClassification;
};

export type HistoricalStalePathInventory = {
  ok: true;
  generatedAt: string;
  summary: {
    historicalArtifactCount: number;
    staleArtifactCount: number;
    operationallyConsumedCount: number;
    historicalOnlyCount: number;
    families: Record<(typeof STALE_PATH_PATTERNS)[number]["id"], number>;
    classifications: Record<HistoricalArtifactClassification, number>;
    canonicalLocationHints: Record<
      (typeof STALE_PATH_PATTERNS)[number]["id"],
      {
        owner: (typeof STALE_PATH_PATTERNS)[number]["canonicalOwner"];
        locationHint: string;
      }
    >;
  };
  entries: HistoricalArtifactEntry[];
};

function walkFiles(rootPath: string, relativeBase = ""): string[] {
  const absolute = path.join(rootPath, relativeBase);
  if (!fs.existsSync(absolute)) {
    return [];
  }

  const entries = fs.readdirSync(absolute, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeBase.replaceAll("\\", "/"), entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(rootPath, relativePath));
      continue;
    }
    files.push(relativePath);
  }

  return files;
}

function readText(relativePath: string) {
  return fs.readFileSync(path.join(DIRECTIVE_ROOT, relativePath), "utf8");
}

function collectHistoricalFiles() {
  return HISTORICAL_ROOTS.flatMap((relativeRoot) =>
    walkFiles(DIRECTIVE_ROOT, relativeRoot).filter((relativePath) =>
      relativePath.endsWith(".md") || relativePath.endsWith(".json")
    )
  );
}

function collectActiveConsumers() {
  const relativePaths = new Set<string>(ACTIVE_CONSUMER_FILES);

  for (const relativeRoot of ACTIVE_CONSUMER_ROOTS) {
    for (const relativePath of walkFiles(DIRECTIVE_ROOT, relativeRoot)) {
      if (
        relativePath.endsWith(".ts")
        || relativePath.endsWith(".md")
        || relativePath.endsWith(".json")
      ) {
        relativePaths.add(relativePath);
      }
    }
  }

  return [...relativePaths];
}

function extractStaleReferences(content: string): StaleReferenceMatch[] {
  const results: StaleReferenceMatch[] = [];

  for (const pattern of STALE_PATH_PATTERNS) {
    const matches = content.match(pattern.match) ?? [];
    for (const value of matches) {
      results.push({
        family: pattern.id,
        value,
        canonicalOwner: pattern.canonicalOwner,
        canonicalLocationHint: pattern.canonicalLocationHint,
      });
    }
  }

  const unique = new Map<string, StaleReferenceMatch>();
  for (const match of results) {
    unique.set(`${match.family}:${match.value}`, match);
  }
  return [...unique.values()];
}

function buildConsumerIndex(relativePaths: string[]) {
  return relativePaths.map((relativePath) => ({
    relativePath,
    content: readText(relativePath),
  }));
}

export function collectHistoricalStalePathInventory(): HistoricalStalePathInventory {
  const historicalFiles = collectHistoricalFiles();
  const activeConsumers = buildConsumerIndex(collectActiveConsumers());

  const entries: HistoricalArtifactEntry[] = [];

  for (const artifactPath of historicalFiles) {
    const content = readText(artifactPath);
    const staleReferences = extractStaleReferences(content);
    if (staleReferences.length === 0) {
      continue;
    }

    const consumers = activeConsumers
      .filter((consumer) => consumer.content.includes(artifactPath))
      .map((consumer) => consumer.relativePath)
      .sort();
    const operationallyConsumed = consumers.length > 0;

    entries.push({
      artifactPath,
      staleReferences,
      operationallyConsumed,
      consumers,
      classification: operationallyConsumed ? "operationally_consumed" : "historical_only",
    });
  }

  const summary: HistoricalStalePathInventory["summary"] = {
    historicalArtifactCount: historicalFiles.length,
    staleArtifactCount: entries.length,
    operationallyConsumedCount: entries.filter((entry) => entry.operationallyConsumed).length,
    historicalOnlyCount: entries.filter((entry) => entry.classification === "historical_only").length,
    families: Object.fromEntries(
      STALE_PATH_PATTERNS.map((pattern) => [
        pattern.id,
        entries.filter((entry) => entry.staleReferences.some((match) => match.family === pattern.id))
          .length,
      ]),
    ) as HistoricalStalePathInventory["summary"]["families"],
    classifications: {
      historical_only: entries.filter((entry) => entry.classification === "historical_only").length,
      operationally_consumed: entries.filter((entry) => entry.classification === "operationally_consumed").length,
    },
    canonicalLocationHints: Object.fromEntries(
      STALE_PATH_PATTERNS.map((pattern) => [
        pattern.id,
        {
          owner: pattern.canonicalOwner,
          locationHint: pattern.canonicalLocationHint,
        },
      ]),
    ) as HistoricalStalePathInventory["summary"]["canonicalLocationHints"],
  };

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    summary,
    entries: entries.sort((left, right) => left.artifactPath.localeCompare(right.artifactPath)),
  };
}

function main() {
  process.stdout.write(`${JSON.stringify(collectHistoricalStalePathInventory(), null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === CURRENT_SCRIPT_PATH) {
  main();
}
