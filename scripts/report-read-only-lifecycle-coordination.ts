import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveReadOnlyLifecycleCoordinationReport } from "../engine/coordination/read-only-lifecycle-coordination.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildDirectiveReadOnlyLifecycleCoordinationReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
