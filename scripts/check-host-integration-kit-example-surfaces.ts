import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI_PATH = path.join(
  DIRECTIVE_ROOT,
  "hosts",
  "integration-kit",
  "cli",
  "host-integration-kit-cli.ts",
);
const EXAMPLES_ROOT = path.join(DIRECTIVE_ROOT, "hosts", "integration-kit", "examples");

function runCli(args: string[]) {
  const result = spawnSync("node", ["--experimental-strip-types", CLI_PATH, ...args], {
    cwd: DIRECTIVE_ROOT,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout) as Record<string, unknown>;
}

function main() {
  const submissionExample = runCli(["print-submission-example", "--shape", "front_door"]);
  assert.equal(submissionExample.command, "print-submission-example");
  assert.equal(submissionExample.shape, "front_door");

  const submissionDryRun = runCli([
    "submission-memory-dry-run",
    "--input-json-path",
    path.join(EXAMPLES_ROOT, "discovery-submission-front-door.json"),
    "--unresolved-gap-id",
    "gap-example-front-door",
  ]);
  assert.equal(submissionDryRun.command, "submission-memory-dry-run");

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: "host_integration_kit_example_surfaces",
        checked: {
          submissionShape: submissionExample.shape,
          submissionDryRunCommand: submissionDryRun.command,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
