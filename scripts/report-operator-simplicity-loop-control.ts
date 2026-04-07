import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveOperatorSimplicityLoopControlReport } from "../architecture/lib/operator-simplicity-loop-control.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildDirectiveOperatorSimplicityLoopControlReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
