import assert from "node:assert/strict";

import { collectHistoricalStalePathInventory } from "./report-historical-stale-path-inventory.ts";

function main() {
  const inventory = collectHistoricalStalePathInventory();

  assert.equal(
    inventory.summary.operationallyConsumedCount,
    0,
    `historical_stale_paths_have_operational_consumers:${inventory.summary.operationallyConsumedCount}`,
  );
  assert.equal(
    inventory.summary.classifications.operationally_consumed,
    0,
    `historical_stale_paths_marked_operational:${inventory.summary.classifications.operationally_consumed}`,
  );
  assert.equal(
    inventory.summary.historicalOnlyCount,
    inventory.summary.staleArtifactCount,
    `historical_only_count_mismatch:${inventory.summary.historicalOnlyCount}:${inventory.summary.staleArtifactCount}`,
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: "historical_stale_path_operational_boundary",
        historicalArtifactCount: inventory.summary.historicalArtifactCount,
        staleArtifactCount: inventory.summary.staleArtifactCount,
        historicalOnlyCount: inventory.summary.historicalOnlyCount,
        operationallyConsumedCount: inventory.summary.operationallyConsumedCount,
      },
      null,
      2,
    )}\n`,
  );
}

main();
