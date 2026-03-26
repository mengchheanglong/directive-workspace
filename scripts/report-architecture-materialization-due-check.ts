import path from "node:path";
import { fileURLToPath } from "node:url";

import { readDirectiveArchitectureMaterializationDueCheck } from "../shared/lib/architecture-materialization-due-check.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = readDirectiveArchitectureMaterializationDueCheck({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
