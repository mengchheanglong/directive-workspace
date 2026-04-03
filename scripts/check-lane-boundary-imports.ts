import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lane boundary import checker.
 *
 * Enforces the directional import rule:
 *   hosts → engine → shared (allowed direction)
 *
 * Violations:
 *   - engine/ must not import from hosts/
 *   - shared/lib/ must not import from hosts/
 *
 * Allowed:
 *   - shared/lib/ may import from engine/ (the canonical read surface
 *     composes engine truth with artifact reading by design)
 *   - hosts/ may import from engine/ and shared/ (proper direction)
 *
 * Scripts are exempt (they're tooling, not product code).
 * Source-packs under runtime/ are exempt (external consumed sources).
 */

const DIRECTIVE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

type Violation = {
  file: string;
  line: number;
  importPath: string;
  rule: string;
};

type LaneBoundaryResult = {
  ok: boolean;
  checkerId: string;
  failureContractVersion: string;
  snapshotAt: string;
  scanned: {
    engineFiles: number;
    sharedFiles: number;
  };
  violations: Violation[];
};

function collectTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
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
    // Match: import ... from "path" or import ... from 'path'
    // Also match: export ... from "path"
    const match = line.match(/(?:import|export)\s+.*?\s+from\s+["']([^"']+)["']/);
    if (match?.[1]) {
      imports.push({ line: i + 1, importPath: match[1] });
    }
    // Match dynamic import: import("path")
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
  // Only check relative imports
  if (!importPath.startsWith(".")) return null;

  const sourceDir = path.dirname(sourceFile);
  const resolved = path.resolve(sourceDir, importPath);
  const relative = path.relative(DIRECTIVE_ROOT, resolved).replace(/\\/g, "/");
  return relative;
}

function main() {
  const engineDir = path.join(DIRECTIVE_ROOT, "engine");
  const sharedDir = path.join(DIRECTIVE_ROOT, "shared", "lib");

  const engineFiles = collectTsFiles(engineDir);
  const sharedFiles = collectTsFiles(sharedDir);

  const violations: Violation[] = [];

  // Rule 1: engine/ must not import from hosts/
  for (const file of engineFiles) {
    const imports = extractImports(file);
    for (const imp of imports) {
      const target = resolveImportTarget(file, imp.importPath);
      if (target && target.startsWith("hosts/")) {
        violations.push({
          file: path.relative(DIRECTIVE_ROOT, file).replace(/\\/g, "/"),
          line: imp.line,
          importPath: imp.importPath,
          rule: "engine_must_not_import_hosts",
        });
      }
    }
  }

  // Rule 2: shared/lib/ must not import from hosts/
  // (shared/lib/ importing from engine/ is allowed — the canonical read surface
  //  composes engine truth with artifact reading by design)
  for (const file of sharedFiles) {
    const imports = extractImports(file);
    for (const imp of imports) {
      const target = resolveImportTarget(file, imp.importPath);
      if (!target) continue;
      if (target.startsWith("hosts/")) {
        violations.push({
          file: path.relative(DIRECTIVE_ROOT, file).replace(/\\/g, "/"),
          line: imp.line,
          importPath: imp.importPath,
          rule: "shared_must_not_import_hosts",
        });
      }
    }
  }

  const result: LaneBoundaryResult = {
    ok: violations.length === 0,
    checkerId: "lane-boundary-imports",
    failureContractVersion: "v1",
    snapshotAt: new Date().toISOString(),
    scanned: {
      engineFiles: engineFiles.length,
      sharedFiles: sharedFiles.length,
    },
    violations,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.ok) {
    process.exit(1);
  }
}

main();
