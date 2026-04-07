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

  const runtimeSignalExample = runCli(["print-signal-example", "--kind", "runtime_verification"]);
  assert.equal(runtimeSignalExample.command, "print-signal-example");
  assert.equal(runtimeSignalExample.kind, "runtime_verification");

  const maintenanceSignalExample = runCli(["print-signal-example", "--kind", "maintenance_watchdog"]);
  assert.equal(maintenanceSignalExample.command, "print-signal-example");
  assert.equal(maintenanceSignalExample.kind, "maintenance_watchdog");

  const runtimeSignalDryRun = runCli([
    "signal-adapter-dry-run",
    "--kind",
    "runtime_verification",
    "--input-json-path",
    path.join(EXAMPLES_ROOT, "openclaw-runtime-verification-signal.json"),
  ]);
  assert.equal(runtimeSignalDryRun.command, "signal-adapter-dry-run");
  assert.equal(runtimeSignalDryRun.kind, "runtime_verification");
  assert.equal(
    (runtimeSignalDryRun.result as { signalDetected?: unknown }).signalDetected,
    true,
  );

  const maintenanceSignalDryRun = runCli([
    "signal-adapter-dry-run",
    "--kind",
    "maintenance_watchdog",
    "--input-json-path",
    path.join(EXAMPLES_ROOT, "openclaw-maintenance-watchdog-signal.json"),
  ]);
  assert.equal(maintenanceSignalDryRun.command, "signal-adapter-dry-run");
  assert.equal(maintenanceSignalDryRun.kind, "maintenance_watchdog");
  assert.equal(
    ((maintenanceSignalDryRun.result as { request?: { candidate_name?: unknown } }).request)
      ?.candidate_name,
    "OpenClaw Maintenance Watchdog Signal",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: "host_integration_kit_example_surfaces",
        checked: {
          submissionShape: submissionExample.shape,
          signalKinds: [
            runtimeSignalExample.kind,
            maintenanceSignalExample.kind,
          ],
          runtimeSignalDetected: (runtimeSignalDryRun.result as { signalDetected?: unknown }).signalDetected,
          maintenanceCandidateName: (
            (maintenanceSignalDryRun.result as { request?: { candidate_name?: unknown } }).request
          )?.candidate_name,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
