import path from "node:path";
import { fileURLToPath } from "node:url";

import { aggregateRunEvidence } from "../engine/execution/run-evidence-aggregation.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = aggregateRunEvidence({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
