import assert from "node:assert/strict";

import {
  runDiscoveryFrontDoorStarterSmoke,
} from "../hosts/integration-kit/starter/discovery-front-door-adapter.smoke.template.ts";

const CHECKER_ID = "host_integration_kit_front_door_starter" as const;
const FAILURE_CONTRACT_VERSION = 1 as const;

async function main() {
  try {
    const checked = await runDiscoveryFrontDoorStarterSmoke();
    assert.equal(checked.ok, true);
    assert.equal(checked.routingTarget, "architecture");
    assert.ok(["high", "medium"].includes(checked.confidence));

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          checkerId: CHECKER_ID,
          failureContractVersion: FAILURE_CONTRACT_VERSION,
          checked,
        },
        null,
        2,
      )}\n`,
    );
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: false,
          checkerId: CHECKER_ID,
          failureContractVersion: FAILURE_CONTRACT_VERSION,
          summary: "Host integration kit front-door starter contract violated.",
          message: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      )}\n`,
    );
    process.exitCode = 1;
  }
}

await main();
