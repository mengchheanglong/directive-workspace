import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildRuntimeCallableExecutionEvidenceReport } from "../runtime/lib/runtime-callable-execution-evidence.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildRuntimeCallableExecutionEvidenceReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
