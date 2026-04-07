import path from "node:path";
import { fileURLToPath } from "node:url";

import { selectNextDirectiveCompletionSlice } from "../engine/coordination/completion-slice-selector.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function main() {
  const selection = selectNextDirectiveCompletionSlice({
    directiveRoot: DIRECTIVE_ROOT,
  });
  process.stdout.write(`${JSON.stringify(selection, null, 2)}\n`);
}

main();
