import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const artifactPath = process.argv[2] ?? null;
  const report = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath,
  });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
