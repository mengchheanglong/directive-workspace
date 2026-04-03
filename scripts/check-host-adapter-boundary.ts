import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Host adapter boundary checker.
 *
 * Validates that host directories only import from the declared adapter surface.
 * The adapter surface is the set of engine/ and shared/lib/ modules that hosts
 * are explicitly allowed to depend on.
 *
 * Any new host dependency on engine/ or shared/lib/ must be added to the
 * ALLOWED_HOST_IMPORTS list below so the boundary stays explicit and auditable.
 */

const DIRECTIVE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

/**
 * Declared host adapter boundary.
 *
 * Each entry is a prefix — if a resolved import path starts with any of these,
 * it's within the adapter surface. Add new entries only when a host genuinely
 * needs a new dependency (this is the enforcement gate).
 */
const ALLOWED_HOST_IMPORT_PREFIXES: string[] = [
  // Engine public surface
  "engine/index.ts",
  "engine/approval-boundary.ts",

  // Canonical read surface
  "shared/lib/dw-state",
  "shared/lib/runtime-promotion-specification",

  // Discovery submission and lifecycle
  "shared/lib/discovery-submission-router",
  "shared/lib/discovery-front-door",
  "shared/lib/discovery-route-opener",
  "shared/lib/discovery-intake-queue-writer",
  "shared/lib/discovery-intake-queue-transition",
  "shared/lib/discovery-fast-path-record-writer",
  "shared/lib/discovery-routing-record-writer",
  "shared/lib/discovery-completion-record-writer",
  "shared/lib/discovery-intake-lifecycle-sync",
  "shared/lib/discovery-case-record-writer",

  // Architecture deep-tail canonical stage map
  "shared/lib/architecture-deep-tail-stage-map",

  // Architecture lane openers/writers
  "shared/lib/architecture-bounded-closeout",
  "shared/lib/architecture-result-adoption",
  "shared/lib/architecture-implementation-target",
  "shared/lib/architecture-implementation-result",
  "shared/lib/architecture-retention",
  "shared/lib/architecture-integration-record",
  "shared/lib/architecture-consumption-record",
  "shared/lib/architecture-post-consumption-evaluation",
  "shared/lib/architecture-reopen-from-evaluation",
  "shared/lib/architecture-handoff-start",

  // Runtime lane openers/writers
  "shared/lib/runtime-follow-up-opener",
  "shared/lib/runtime-follow-up-record-writer",
  "shared/lib/runtime-record-proof-opener",
  "shared/lib/runtime-record-writer",
  "shared/lib/runtime-proof-bundle-writer",
  "shared/lib/runtime-proof-runtime-capability-boundary-opener",
  "shared/lib/runtime-runtime-capability-boundary-promotion-readiness-opener",
  "shared/lib/runtime-transformation-proof-writer",
  "shared/lib/runtime-transformation-record-writer",
  "shared/lib/runtime-promotion-record-writer",
  "shared/lib/runtime-registry-entry-writer",

  // Engine run artifacts
  "shared/lib/engine-run-artifacts",
];

type Violation = {
  file: string;
  line: number;
  importPath: string;
  resolvedTarget: string;
};

type HostAdapterBoundaryResult = {
  ok: boolean;
  checkerId: string;
  failureContractVersion: string;
  snapshotAt: string;
  scanned: {
    hostFiles: number;
    hostDirs: string[];
  };
  adapterSurfaceSize: number;
  violations: Violation[];
};

function collectTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      results.push(...collectTsFiles(fullPath));
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractImports(filePath: string): Array<{ line: number; importPath: string }> {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const imports: Array<{ line: number; importPath: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const match = line.match(/(?:import|export)\s+.*?\s+from\s+["']([^"']+)["']/);
    if (match?.[1]) {
      imports.push({ line: i + 1, importPath: match[1] });
    }
    const dynamicMatch = line.match(/import\s*\(\s*["']([^"']+)["']\s*\)/);
    if (dynamicMatch?.[1]) {
      imports.push({ line: i + 1, importPath: dynamicMatch[1] });
    }
  }

  return imports;
}

function resolveImportTarget(
  sourceFile: string,
  importPath: string,
): string | null {
  if (!importPath.startsWith(".")) return null;
  const sourceDir = path.dirname(sourceFile);
  const resolved = path.resolve(sourceDir, importPath);
  return path.relative(DIRECTIVE_ROOT, resolved).replace(/\\/g, "/");
}

function isWithinAdapterBoundary(target: string): boolean {
  return ALLOWED_HOST_IMPORT_PREFIXES.some((prefix) => target.startsWith(prefix));
}

function isProductImport(target: string): boolean {
  return target.startsWith("engine/") || target.startsWith("shared/");
}

function main() {
  const hostsDir = path.join(DIRECTIVE_ROOT, "hosts");
  const hostSubdirs = fs
    .readdirSync(hostsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const allHostFiles: string[] = [];
  for (const sub of hostSubdirs) {
    allHostFiles.push(...collectTsFiles(path.join(hostsDir, sub)));
  }

  const violations: Violation[] = [];

  for (const file of allHostFiles) {
    const imports = extractImports(file);
    for (const imp of imports) {
      const target = resolveImportTarget(file, imp.importPath);
      if (!target) continue;
      if (!isProductImport(target)) continue;
      if (isWithinAdapterBoundary(target)) continue;

      violations.push({
        file: path.relative(DIRECTIVE_ROOT, file).replace(/\\/g, "/"),
        line: imp.line,
        importPath: imp.importPath,
        resolvedTarget: target,
      });
    }
  }

  const result: HostAdapterBoundaryResult = {
    ok: violations.length === 0,
    checkerId: "host-adapter-boundary",
    failureContractVersion: "v1",
    snapshotAt: new Date().toISOString(),
    scanned: {
      hostFiles: allHostFiles.length,
      hostDirs: hostSubdirs,
    },
    adapterSurfaceSize: ALLOWED_HOST_IMPORT_PREFIXES.length,
    violations,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.ok) {
    process.exit(1);
  }
}

main();
