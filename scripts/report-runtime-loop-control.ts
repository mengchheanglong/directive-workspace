import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveRuntimeLoopControlReport } from "../shared/lib/runtime-loop-control.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildDirectiveRuntimeLoopControlReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
