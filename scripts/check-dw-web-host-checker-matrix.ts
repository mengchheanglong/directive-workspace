import {
  DIRECTIVE_ROOT,
  DW_WEB_HOST_SYNC_CASE_KEYS,
  runDwWebHostCaseRuntimeCheckerMatrix,
  runDwWebHostCaseSyncCheckerMatrix,
} from "./directive-dw-web-host-check-helpers.ts";
import { withDirectiveFrontendCheckServer } from "./frontend-check-helpers.ts";

async function main() {
  for (const caseKey of DW_WEB_HOST_SYNC_CASE_KEYS) {
    runDwWebHostCaseSyncCheckerMatrix(caseKey);
  }

  await withDirectiveFrontendCheckServer({ directiveRoot: DIRECTIVE_ROOT }, async (handle) => {
    for (const caseKey of DW_WEB_HOST_SYNC_CASE_KEYS) {
      await runDwWebHostCaseRuntimeCheckerMatrix(caseKey, handle);
    }
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        runner: "dw_web_host_checker_matrix",
        checkedCases: DW_WEB_HOST_SYNC_CASE_KEYS.length,
        checkedStages: DW_WEB_HOST_SYNC_CASE_KEYS.length * 6,
      },
      null,
      2,
    )}\n`,
  );
}

void main();
