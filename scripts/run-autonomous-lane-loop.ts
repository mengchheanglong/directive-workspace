import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runDirectiveAutonomousLaneLoopSupervised } from "../engine/coordination/autonomous-lane-loop.ts";
import type { DiscoverySubmissionRequest } from "../discovery/lib/discovery-submission-router.ts";

function readArg(flag: string, args: string[]) {
  const index = args.indexOf(flag);
  if (index < 0 || index === args.length - 1) {
    return null;
  }
  return args[index + 1] ?? null;
}

async function main() {
  const directiveRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const args = process.argv.slice(2);
  const artifactPath = readArg("--artifact", args);
  const submissionFile = readArg("--submission-file", args);
  const runtimeArtifactsRoot = readArg("--runtime-artifacts-root", args) ?? undefined;
  const receivedAt = readArg("--received-at", args) ?? undefined;

  if (!!artifactPath === !!submissionFile) {
    throw new Error("invalid_input: provide exactly one of --artifact or --submission-file");
  }

  const result = artifactPath
    ? await runDirectiveAutonomousLaneLoopSupervised({
        directiveRoot,
        artifactPath,
      })
    : await runDirectiveAutonomousLaneLoopSupervised({
        directiveRoot,
        request: JSON.parse(
          fs.readFileSync(path.resolve(directiveRoot, submissionFile!), "utf8"),
        ) as DiscoverySubmissionRequest,
        runtimeArtifactsRoot,
        receivedAt,
      });

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
