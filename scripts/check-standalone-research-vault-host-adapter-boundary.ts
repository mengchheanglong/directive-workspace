import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStandaloneFilesystemHost } from "../hosts/standalone-host/runtime.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "standalone_research_vault_host_adapter_boundary";
const REQUIRED_CHAIN = [
  "discovery/03-routing-log/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702--routing-record.md",
  "runtime/00-follow-up/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643-runtime-follow-up-record.md",
  "runtime/02-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-runtime-record.md",
  "runtime/03-proof/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-proof.md",
  "runtime/04-capability-boundaries/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-runtime-capability-boundary.md",
  "runtime/05-promotion-readiness/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-readiness.md",
  "runtime/06-promotion-specifications/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-specification.json",
  "runtime/07-promotion-records/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-promotion-record.md",
];

function copyArtifact(relativePath: string, directiveRoot: string) {
  const sourcePath = path.join(DIRECTIVE_ROOT, relativePath);
  const targetPath = path.join(directiveRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

async function main() {
  await withTempDirectiveRoot(
    { prefix: "dw-standalone-research-vault-boundary-" },
    async (directiveRoot) => {
      for (const relativePath of REQUIRED_CHAIN) {
        copyArtifact(relativePath, directiveRoot);
      }

      const host = createStandaloneFilesystemHost({ directiveRoot });
      try {
        await assert.rejects(
          () => host.readResearchVaultDescriptor(),
          /research_vault_host_descriptor_requires_host_selection_resolution/u,
        );
      } finally {
        host.close();
      }
    },
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        boundary: "missing_host_selection_resolution_blocks_descriptor",
      },
      null,
      2,
    )}\n`,
  );
}

void main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checkerId: CHECKER_ID,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
