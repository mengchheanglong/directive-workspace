import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDirectiveRuntimePromotionSpecification,
  parseDirectiveRuntimePromotionReadinessFields,
  resolveDirectiveRuntimePromotionSpecificationPath,
} from "../shared/lib/runtime-promotion-specification.ts";

/**
 * Generates host-consumable promotion specification artifacts.
 *
 * Reads each promotion-readiness artifact and produces a structured JSON
 * promotion specification at runtime/06-promotion-specifications/.
 *
 * This is the bounded forward pathway from promotion-readiness to a
 * host-consumable artifact. The specification is non-executing but provides
 * all the structured information a host needs to understand what it would
 * integrate and what decisions remain open.
 */

const DIRECTIVE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const PROMOTION_READINESS_DIR = path.join(
  DIRECTIVE_ROOT,
  "runtime",
  "05-promotion-readiness",
);

function main() {
  if (!fs.existsSync(PROMOTION_READINESS_DIR)) {
    process.stdout.write("No promotion-readiness directory found.\n");
    return;
  }

  const files = fs
    .readdirSync(PROMOTION_READINESS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .sort((a, b) => a.name.localeCompare(b.name));

  const generated: string[] = [];

  for (const file of files) {
    const promotionReadinessPath =
      `runtime/05-promotion-readiness/${file.name}` as const;
    const generatedAt = new Date().toISOString();
    const specification = buildDirectiveRuntimePromotionSpecification({
      directiveRoot: DIRECTIVE_ROOT,
      promotionReadinessPath,
      generatedAt,
    });
    const specificationPath = resolveDirectiveRuntimePromotionSpecificationPath({
      promotionReadinessPath,
    });
    const specificationAbsolutePath = path.join(DIRECTIVE_ROOT, specificationPath);

    fs.mkdirSync(path.dirname(specificationAbsolutePath), { recursive: true });
    fs.writeFileSync(
      specificationAbsolutePath,
      `${JSON.stringify(specification, null, 2)}\n`,
      "utf8",
    );

    // Force a parse round-trip so generator failures surface immediately.
    parseDirectiveRuntimePromotionReadinessFields({
      directiveRoot: DIRECTIVE_ROOT,
      promotionReadinessPath,
    });
    generated.push(specificationPath);
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        generatedAt: new Date().toISOString(),
        totalGenerated: generated.length,
        specifications: generated,
      },
      null,
      2,
    )}\n`,
  );
}

main();
