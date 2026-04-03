import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildOperationalArchitectureImprovementCandidatesReport } from "../shared/lib/operational-architecture-improvement-candidates.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildOperationalArchitectureImprovementCandidatesReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
