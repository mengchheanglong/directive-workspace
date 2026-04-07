import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDirectiveRuntimeFollowUpNavigationReport } from "../runtime/lib/runtime-follow-up-navigation.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const report = buildDirectiveRuntimeFollowUpNavigationReport({
    directiveRoot: DIRECTIVE_ROOT,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
