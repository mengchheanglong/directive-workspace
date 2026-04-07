import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  writeDiscoveryRoutingReviewResolution,
  readDiscoveryRoutingReviewResolution,
  type DiscoveryRoutingReviewDecision,
} from "../discovery/lib/discovery-routing-review-resolution.ts";

function readArg(flag: string, args: string[]) {
  const index = args.indexOf(flag);
  if (index < 0 || index === args.length - 1) return null;
  return args[index + 1] ?? null;
}

async function main() {
  const directiveRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const args = process.argv.slice(2);
  const routingRecordPath = readArg("--routing-record", args);
  const decision = readArg("--decision", args) as DiscoveryRoutingReviewDecision | null;
  const rationale = readArg("--rationale", args);
  const reviewedBy = readArg("--reviewed-by", args) ?? "operator";
  const resolvedConfidence = readArg("--resolved-confidence", args) as "high" | "medium" | "low" | null;
  const readOnly = args.includes("--read-only");

  if (!routingRecordPath) {
    throw new Error("--routing-record is required");
  }

  if (readOnly) {
    const existing = readDiscoveryRoutingReviewResolution({
      directiveRoot,
      routingRecordPath,
    });
    process.stdout.write(`${JSON.stringify(existing, null, 2)}\n`);
    return;
  }

  if (!decision) {
    throw new Error("--decision is required (confirm_architecture, confirm_runtime, redirect_to_architecture, redirect_to_runtime, reject, defer)");
  }
  if (!rationale) {
    throw new Error("--rationale is required");
  }

  const result = writeDiscoveryRoutingReviewResolution({
    directiveRoot,
    routingRecordPath,
    decision,
    rationale,
    reviewedBy,
    resolvedConfidence: resolvedConfidence ?? undefined,
  });

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
