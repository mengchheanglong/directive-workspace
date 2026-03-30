import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SIDECAR_SCHEMA_PATH = path.join(
  DIRECTIVE_ROOT,
  "architecture",
  "02-experiments",
  "2026-03-29-structural-mapping-sidecar-schema-experiment.md",
);
const TS_EDGE_SIDECAR_PATH = path.join(
  DIRECTIVE_ROOT,
  "architecture",
  "02-experiments",
  "2026-03-29-dw-source-ts-edge-2026-03-27-structural-mapping-sidecar.md",
);
const SCIENTIFY_SIDECAR_PATH = path.join(
  DIRECTIVE_ROOT,
  "architecture",
  "02-experiments",
  "2026-03-29-dw-source-scientify-research-workflow-plugin-2026-03-27-structural-mapping-sidecar.md",
);
const IMPLEMENT_PATH = path.join(DIRECTIVE_ROOT, "implement.md");

function readText(filePath: string) {
  assert.ok(fs.existsSync(filePath), `Missing structural-mapping experiment file: ${filePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function assertContainsAll(input: {
  label: string;
  text: string;
  requiredSnippets: string[];
}) {
  for (const snippet of input.requiredSnippets) {
    assert.match(
      input.text,
      new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"),
      `${input.label} is missing required content: ${snippet}`,
    );
  }
}

function collectTsFiles(rootPath: string) {
  const results: string[] = [];
  const queue = [rootPath];
  while (queue.length > 0) {
    const current = queue.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (entry.isFile() && fullPath.endsWith(".ts")) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function relativeFromRoot(filePath: string) {
  return path.relative(DIRECTIVE_ROOT, filePath).replace(/\\/g, "/");
}

function assertNoLiveTsReferences(sidecarBasenames: string[]) {
  const searchRoots = [
    path.join(DIRECTIVE_ROOT, "shared"),
    path.join(DIRECTIVE_ROOT, "engine"),
    path.join(DIRECTIVE_ROOT, "hosts"),
    path.join(DIRECTIVE_ROOT, "runtime"),
    path.join(DIRECTIVE_ROOT, "discovery"),
  ].filter((entry) => fs.existsSync(entry));

  const offenders: string[] = [];
  for (const root of searchRoots) {
    for (const filePath of collectTsFiles(root)) {
      const content = fs.readFileSync(filePath, "utf8");
      for (const basename of sidecarBasenames) {
        if (content.includes(basename)) {
          offenders.push(`${relativeFromRoot(filePath)} -> ${basename}`);
        }
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Live TypeScript surfaces must not reference structural-mapping sidecars: ${offenders.join(", ")}`,
  );
}

function main() {
  const schemaText = readText(SIDECAR_SCHEMA_PATH);
  const tsEdgeText = readText(TS_EDGE_SIDECAR_PATH);
  const scientifyText = readText(SCIENTIFY_SIDECAR_PATH);
  const implementText = readText(IMPLEMENT_PATH);

  assertContainsAll({
    label: "Schema note",
    text: schemaText,
    requiredSnippets: [
      "Experimental status: `non-authoritative sidecar`",
      "Scope: `structural usefulness cases only`",
      "live Discovery routing",
      "planner recommendation logic",
      "NOTE-mode review sources",
      "no structural mapping counts unless it captures relations, not just attributes",
    ],
  });

  for (const [label, text] of [
    ["ts-edge sidecar", tsEdgeText],
    ["Scientify sidecar", scientifyText],
  ] as const) {
    assertContainsAll({
      label,
      text,
      requiredSnippets: [
        "Experimental status: `non-authoritative sidecar`",
        "Live integration status: `none`",
        "`transferable_relation`",
        "`non_transfer_conditions`",
        "`source_specific_baggage`",
        "`false_analogy_risk`",
        "`blueprint_confidence`",
        "## sharper than current bounded-result language",
        "## why this sidecar is not authority",
      ],
    });
  }

  assertContainsAll({
    label: "Planning boundary note",
    text: implementText,
    requiredSnippets: [
      "## Current Structural Mapping Experiment Boundary",
      "structural usefulness cases only",
      "sidecar-only experimental documentation",
      "not a live system field",
      "not required for NOTE-mode review sources",
    ],
  });

  assertNoLiveTsReferences([
    path.basename(SIDECAR_SCHEMA_PATH),
    path.basename(TS_EDGE_SIDECAR_PATH),
    path.basename(SCIENTIFY_SIDECAR_PATH),
  ]);

  process.stdout.write(`${JSON.stringify({
    ok: true,
    checked: {
      schemaNote: relativeFromRoot(SIDECAR_SCHEMA_PATH),
      sidecars: [
        relativeFromRoot(TS_EDGE_SIDECAR_PATH),
        relativeFromRoot(SCIENTIFY_SIDECAR_PATH),
      ],
      boundaryNote: relativeFromRoot(IMPLEMENT_PATH),
      containment: "no_live_ts_references",
    },
  }, null, 2)}\n`);
}

main();
