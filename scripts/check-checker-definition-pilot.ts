import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { readJson } from "./checker-test-helpers.ts";

type PackageJson = {
  scripts?: Record<string, string>;
};

type CheckerDefinition = {
  checkerId: string;
  npmScript: string;
  entryPoint: string;
  targetSurface: string;
  purpose: string;
  successSemantics: string;
  failureSemantics: string;
  failureExpectation?: {
    kind: "json_failure_probe";
    probeArgs: string[];
    expectedExitCode: number;
    requiredJsonPaths: Array<{
      path: string;
      equals: string | number | boolean;
    }>;
  };
  proofExpectation: {
    kind: "json_summary";
    mustInclude: string[];
    requiredJsonPaths?: Array<{
      path: string;
      equals: string | number | boolean;
    }>;
  };
};

type CheckerDefinitionRegistry = {
  schemaVersion: number;
  schemaRef: string;
  owningLane: string;
  registryIntent?: string;
  pilotPolicy?: {
    maxDefinitions: number;
    approvedCheckerIds: string[];
  };
  definitions: CheckerDefinition[];
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_JSON_PATH = path.join(DIRECTIVE_ROOT, "package.json");
const SCHEMA_PATH = path.join(
  DIRECTIVE_ROOT,
  "shared",
  "schemas",
  "checker-definition-registry.schema.json",
);
const REGISTRY_PATH = path.join(DIRECTIVE_ROOT, "scripts", "checker-definition-pilot.json");

function assertNonEmptyString(value: unknown, label: string) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
}

function validateDefinitionShape(definition: CheckerDefinition, index: number) {
  const label = `definitions[${index}]`;
  assertNonEmptyString(definition.checkerId, `${label}.checkerId`);
  assert.match(definition.npmScript, /^check:/u, `${label}.npmScript must start with check:`);
  assert.match(
    definition.entryPoint,
    /^scripts\/.+\.ts$/u,
    `${label}.entryPoint must point at a repo script`,
  );
  assertNonEmptyString(definition.targetSurface, `${label}.targetSurface`);
  assertNonEmptyString(definition.purpose, `${label}.purpose`);
  assertNonEmptyString(definition.successSemantics, `${label}.successSemantics`);
  assertNonEmptyString(definition.failureSemantics, `${label}.failureSemantics`);
  assert.equal(
    definition.proofExpectation.kind,
    "json_summary",
    `${label}.proofExpectation.kind must remain json_summary for this pilot`,
  );
  assert.ok(
    Array.isArray(definition.proofExpectation.mustInclude) &&
      definition.proofExpectation.mustInclude.length > 0,
    `${label}.proofExpectation.mustInclude must list at least one expected output marker`,
  );
  for (const marker of definition.proofExpectation.mustInclude) {
    assertNonEmptyString(marker, `${label}.proofExpectation.mustInclude[]`);
  }
  assert.ok(
    Array.isArray(definition.proofExpectation.requiredJsonPaths) &&
      definition.proofExpectation.requiredJsonPaths.length > 0,
    `${label}.proofExpectation.requiredJsonPaths must declare at least one exact JSON expectation`,
  );
  for (const expectation of definition.proofExpectation.requiredJsonPaths ?? []) {
    assertNonEmptyString(expectation.path, `${label}.proofExpectation.requiredJsonPaths[].path`);
    assert.ok(
      ["string", "number", "boolean"].includes(typeof expectation.equals),
      `${label}.proofExpectation.requiredJsonPaths[].equals must be a scalar`,
    );
  }

  if (definition.failureExpectation) {
    assert.equal(
      definition.failureExpectation.kind,
      "json_failure_probe",
      `${label}.failureExpectation.kind must remain json_failure_probe`,
    );
    assert.ok(
      Array.isArray(definition.failureExpectation.probeArgs) &&
        definition.failureExpectation.probeArgs.length > 0,
      `${label}.failureExpectation.probeArgs must declare a bounded probe invocation`,
    );
    assert.ok(
      Number.isInteger(definition.failureExpectation.expectedExitCode) &&
        definition.failureExpectation.expectedExitCode > 0,
      `${label}.failureExpectation.expectedExitCode must be a non-zero integer`,
    );
    assert.ok(
      Array.isArray(definition.failureExpectation.requiredJsonPaths) &&
        definition.failureExpectation.requiredJsonPaths.length > 0,
      `${label}.failureExpectation.requiredJsonPaths must declare exact failure JSON expectations`,
    );
    for (const expectation of definition.failureExpectation.requiredJsonPaths) {
      assertNonEmptyString(expectation.path, `${label}.failureExpectation.requiredJsonPaths[].path`);
      assert.ok(
        ["string", "number", "boolean"].includes(typeof expectation.equals),
        `${label}.failureExpectation.requiredJsonPaths[].equals must be a scalar`,
      );
    }
  }
}

function parseJsonSummary(stdout: string) {
  try {
    return JSON.parse(stdout) as Record<string, unknown>;
  } catch (error) {
    throw new Error(`checker output was not valid JSON summary: ${String((error as Error).message || error)}`);
  }
}

function readPathValue(input: unknown, pathExpression: string): unknown {
  return pathExpression.split(".").reduce<unknown>((current, segment) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(segment);
      return Number.isInteger(index) ? current[index] : undefined;
    }

    if (typeof current === "object") {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, input);
}

function runChecker(definition: CheckerDefinition) {
  const execution = spawnSync(
    process.execPath,
    ["--experimental-strip-types", `./${definition.entryPoint}`],
    {
      cwd: DIRECTIVE_ROOT,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 10,
    },
  );

  if (execution.error) {
    throw execution.error;
  }

  assert.equal(
    execution.status,
    0,
    `${definition.npmScript} must exit zero when the pilot registry claims it is healthy.\n${execution.stderr}`,
  );

  for (const marker of definition.proofExpectation.mustInclude) {
    assert.match(
      execution.stdout,
      new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"),
      `${definition.npmScript} output did not contain expected proof marker: ${marker}`,
    );
  }

  const parsed = parseJsonSummary(execution.stdout);
  for (const expectation of definition.proofExpectation.requiredJsonPaths ?? []) {
    assert.deepEqual(
      readPathValue(parsed, expectation.path),
      expectation.equals,
      `${definition.npmScript} JSON output did not match ${expectation.path} === ${JSON.stringify(expectation.equals)}`,
    );
  }

  return {
    npmScript: definition.npmScript,
    entryPoint: definition.entryPoint,
    proofMarkers: definition.proofExpectation.mustInclude,
    requiredJsonPaths: definition.proofExpectation.requiredJsonPaths,
  };
}

function runFailureExpectation(definition: CheckerDefinition) {
  if (!definition.failureExpectation) {
    return null;
  }

  const execution = spawnSync(
    process.execPath,
    ["--experimental-strip-types", `./${definition.entryPoint}`, ...definition.failureExpectation.probeArgs],
    {
      cwd: DIRECTIVE_ROOT,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 10,
    },
  );

  if (execution.error) {
    throw execution.error;
  }

  assert.equal(
    execution.status,
    definition.failureExpectation.expectedExitCode,
    `${definition.npmScript} failure probe must exit with ${definition.failureExpectation.expectedExitCode}.\nstdout=${execution.stdout}\nstderr=${execution.stderr}`,
  );

  const parsed = parseJsonSummary(execution.stdout);
  for (const expectation of definition.failureExpectation.requiredJsonPaths) {
    assert.deepEqual(
      readPathValue(parsed, expectation.path),
      expectation.equals,
      `${definition.npmScript} failure JSON did not match ${expectation.path} === ${JSON.stringify(expectation.equals)}`,
    );
  }

  return {
    probeArgs: definition.failureExpectation.probeArgs,
    expectedExitCode: definition.failureExpectation.expectedExitCode,
    requiredJsonPaths: definition.failureExpectation.requiredJsonPaths,
  };
}

function main() {
  assert.ok(fs.existsSync(SCHEMA_PATH), `Missing checker-definition schema: ${SCHEMA_PATH}`);
  assert.ok(fs.existsSync(REGISTRY_PATH), `Missing checker-definition pilot registry: ${REGISTRY_PATH}`);

  const schema = readJson<Record<string, unknown>>(SCHEMA_PATH);
  const registry = readJson<CheckerDefinitionRegistry>(REGISTRY_PATH);
  const packageJson = readJson<PackageJson>(PACKAGE_JSON_PATH);

  assert.equal(
    schema.title,
    "Directive Workspace Checker Definition Registry",
    "The checker-definition schema must declare the canonical registry title.",
  );
  assert.equal(registry.schemaVersion, 1, "checker-definition pilot registry must stay on schemaVersion 1");
  assert.equal(
    registry.schemaRef,
    "shared/schemas/checker-definition-registry.schema.json",
    "checker-definition pilot registry must reference the canonical shared schema",
  );
  assert.equal(
    registry.owningLane,
    "architecture",
    "checker-definition pilot registry must remain Architecture-owned for this slice",
  );
  assert.equal(
    registry.registryIntent,
    "bounded_pilot",
    "checker-definition pilot registry must declare that it is still a bounded pilot",
  );
  assert.ok(registry.pilotPolicy, "checker-definition pilot registry must declare an explicit pilot policy");
  assert.equal(
    registry.pilotPolicy?.maxDefinitions,
    3,
    "checker-definition pilot registry must keep the explicit maxDefinitions pilot bound at 3",
  );
  assert.ok(
    Array.isArray(registry.definitions) && registry.definitions.length === 3,
    "checker-definition pilot registry must stay bounded to exactly three pilot definitions after the parity extension",
  );
  assert.ok(
    registry.definitions.length <= (registry.pilotPolicy?.maxDefinitions ?? 0),
    "checker-definition pilot registry must not grow beyond its declared pilot maxDefinitions bound",
  );

  const approvedCheckerIds = registry.pilotPolicy?.approvedCheckerIds ?? [];
  assert.deepEqual(
    approvedCheckerIds,
    [
      "control_authority",
      "directive_engine_stage_chaining",
      "case_planner_parity",
    ],
    "checker-definition pilot registry must keep the approved pilot membership explicit and bounded",
  );
  assert.deepEqual(
    registry.definitions.map((definition) => definition.checkerId),
    approvedCheckerIds,
    "checker-definition pilot registry definitions must match the explicit approved pilot membership list",
  );

  const checked = registry.definitions.map((definition, index) => {
    validateDefinitionShape(definition, index);

    const packageScript = packageJson.scripts?.[definition.npmScript];
    assert.ok(packageScript, `package.json is missing ${definition.npmScript}`);
    assert.match(
      packageScript,
      new RegExp(
        `node --experimental-strip-types ./` +
          definition.entryPoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "u",
      ),
      `${definition.npmScript} must stay wired to ${definition.entryPoint}`,
    );
    assert.ok(
      fs.existsSync(path.join(DIRECTIVE_ROOT, definition.entryPoint)),
      `Missing checker entry point for ${definition.npmScript}: ${definition.entryPoint}`,
    );

    const successCheck = runChecker(definition);
    const failureCheck = runFailureExpectation(definition);

    return {
      ...successCheck,
      failureExpectation: failureCheck,
    };
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        schemaRef: registry.schemaRef,
        owningLane: registry.owningLane,
        registryIntent: registry.registryIntent,
        pilotPolicy: registry.pilotPolicy,
        checked,
      },
      null,
      2,
    )}\n`,
  );
}

main();
