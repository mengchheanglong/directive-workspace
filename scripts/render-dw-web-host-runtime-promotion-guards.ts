import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DW_WEB_HOST_RUNTIME_PROMOTION_GUARD_CASES,
  type DwWebHostRuntimePromotionGuardCase,
} from "./dw-web-host-runtime-promotion-guard-registry.ts";

type PromotionProfile = {
  id: string;
  family: string;
  proofShape: string;
  contractPath: string;
  primaryHostCheckCommand: string;
  supportingHostCheckCommands: string[];
};

type PromotionProfileCatalog = {
  profiles: PromotionProfile[];
};

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROMOTION_PROFILES_PATH = path.join(DIRECTIVE_ROOT, "runtime", "PROMOTION_PROFILES.json");

function readPromotionProfiles() {
  return JSON.parse(
    fs.readFileSync(PROMOTION_PROFILES_PATH, "utf8"),
  ) as PromotionProfileCatalog;
}

function renderBullets(items: readonly string[]) {
  return items.map((item) => `- ${item}`);
}

function formatInlineCodeList(items: readonly string[]) {
  return items.join(", ");
}

function renderGuardMarkdown(
  guardCase: DwWebHostRuntimePromotionGuardCase,
  profile: PromotionProfile,
) {
  const negations = guardCase.nonImplicationList;
  const noClaimText = `- no ${formatInlineCodeList(negations.slice(1))} claim is introduced`;

  return [
    `# ${guardCase.title}`,
    "",
    `Quality gate profile: \`${profile.id}\`  `,
    `Promotion profile family: \`${profile.family}\`  `,
    `Proof shape: \`${profile.proofShape}\`  `,
    `Primary host checker: \`${profile.primaryHostCheckCommand}\``,
    "",
    "## Purpose",
    "",
    guardCase.purposeLine,
    "",
    "This guard opens one explicit manual promotion-record seam only. It does not open:",
    ...renderBullets(negations),
    "",
    "## Scope",
    "",
    `- applies only to \`${guardCase.candidateId}\``,
    "- applies only to the Directive Workspace web host (`frontend/ + hosts/web-host/`)",
    "- applies only while the promoted surface remains one read-only Runtime seam-review surface over canonical Runtime truth",
    "- requires Runtime and Engine to remain the owners of stage truth, blockers, legality, and downstream progression",
    "",
    "## Pass Conditions",
    "",
    `- the ${guardCase.surfaceLabel} promotion record exists and links the Runtime record, Runtime proof, Runtime capability boundary, and DW web-host compile-contract artifact truthfully`,
    `- canonical state resolves the ${guardCase.surfaceLabel} current head to that promotion record`,
    "- the linked promotion specification remains canonical and checked",
    "- the Directive Workspace web host still exposes the bounded seam-review route and detail payload without fake integration or execution controls",
    `- no registry entry exists yet for the ${guardCase.candidateLabel}`,
    noClaimText,
    "",
    "## Required Host Artifacts",
    "",
    `- current ${guardCase.surfaceLabel} promotion-readiness artifact`,
    `- current ${guardCase.surfaceLabel} promotion specification`,
    `- current ${guardCase.surfaceLabel} promotion record`,
    `- current ${guardCase.surfaceLabel} DW web-host seam-review compile-contract artifact`,
    "- `shared/contracts/runtime-to-host.md`",
    "",
    "## Required Host Commands",
    "",
    ...renderBullets([
      `\`${profile.primaryHostCheckCommand}\``,
      ...profile.supportingHostCheckCommands.map((command) => `\`${command}\``),
    ]),
    "",
    "## Required Evidence",
    "",
    "- promotion record declares:",
    ...[
      `  - \`Quality gate profile: ${profile.id}\``,
      `  - \`Promotion profile family: ${profile.family}\``,
      `  - \`Proof shape: ${profile.proofShape}\``,
      `  - \`Primary host checker: ${profile.primaryHostCheckCommand}\``,
    ],
    "- promotion record keeps:",
    ...[
      "  - target host bounded to `Directive Workspace web host (frontend/ + hosts/web-host/)`",
      `  - compile contract bounded to the existing ${guardCase.surfaceLabel} DW web-host seam-review compile-contract artifact`,
      "  - rollback explicit",
      "  - validation bounded to local/manual proof only",
    ],
    "",
    "## Decision Rules",
    "",
    `1. This guard validates one manual ${guardCase.surfaceLabel} promotion record only.`,
    `2. Passing this guard does not imply ${negations[0]}.`,
    `3. Passing this guard does not imply ${formatInlineCodeList(negations.slice(1))}.`,
    "4. Any later registry entry must still prove explicit host acceptance and linked proof.",
    "",
    "## Validation Hooks",
    "",
    `- \`${profile.primaryHostCheckCommand}\``,
    "- `npm run check:frontend-host`",
    "",
    "## Canonical Inventory",
    "",
    "- `runtime/PROMOTION_PROFILES.json`",
    "",
  ].join("\n");
}

function main() {
  const promotionProfiles = readPromotionProfiles();

  for (const guardCase of DW_WEB_HOST_RUNTIME_PROMOTION_GUARD_CASES) {
    const profile = promotionProfiles.profiles.find((entry) => entry.id === guardCase.profileId);
    if (!profile) {
      throw new Error(`Missing Runtime promotion profile: ${guardCase.profileId}`);
    }

    if (profile.contractPath !== guardCase.contractPath) {
      throw new Error(
        `Contract path mismatch for ${guardCase.profileId}: expected ${guardCase.contractPath}, got ${profile.contractPath}`,
      );
    }

    const rendered = renderGuardMarkdown(guardCase, profile);
    const absolutePath = path.join(DIRECTIVE_ROOT, guardCase.contractPath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, rendered, "utf8");
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        rendered: DW_WEB_HOST_RUNTIME_PROMOTION_GUARD_CASES.map((entry) => entry.contractPath),
      },
      null,
      2,
    )}\n`,
  );
}

main();
