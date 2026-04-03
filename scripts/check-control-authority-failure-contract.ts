import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const execution = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "./scripts/check-control-authority.ts",
      "--probe=missing_required_content",
    ],
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
    1,
    `Failure-contract probe must exit with code 1.\nstdout=${execution.stdout}\nstderr=${execution.stderr}`,
  );

  const payload = JSON.parse(execution.stdout) as {
    ok: boolean;
    checkerId?: string;
    failureContractVersion?: number;
    summary?: string;
    violations?: Array<{
      code?: string;
      path?: string;
      expected?: string | number;
      actual?: string | number;
    }>;
  };

  assert.equal(payload.ok, false, "Failure-contract probe must produce ok:false");
  assert.equal(payload.checkerId, "control_authority", "Failure-contract probe must identify control_authority");
  assert.equal(
    payload.failureContractVersion,
    1,
    "Failure-contract probe must expose failureContractVersion 1",
  );
  assert.equal(
    payload.summary,
    "Control authority contract violated.",
    "Failure-contract probe must expose the stable failure summary",
  );
  assert.ok(Array.isArray(payload.violations) && payload.violations.length > 0);

  const missingRequiredContent = payload.violations?.find((violation) => violation.code === "missing_required_content");
  assert.ok(
    missingRequiredContent,
    "Failure-contract probe must expose a missing_required_content violation",
  );
  assert.equal(
    missingRequiredContent?.path,
    "implement.md",
    "Failure-contract probe must localize the violation to implement.md",
  );
  assert.equal(
    missingRequiredContent?.expected,
    "control/policies/logging-rules.md",
    "Failure-contract probe must preserve the missing required snippet as expected evidence",
  );
  assert.equal(
    missingRequiredContent?.actual,
    "missing",
    "Failure-contract probe must mark the required snippet as missing",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        probe: "missing_required_content",
        checkerId: payload.checkerId,
        failureContractVersion: payload.failureContractVersion,
        verifiedViolation: missingRequiredContent,
      },
      null,
      2,
    )}\n`,
  );
}

main();
