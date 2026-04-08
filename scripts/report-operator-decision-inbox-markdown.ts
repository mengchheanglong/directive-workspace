import fs from "node:fs";
import path from "node:path";

import {
  buildOperatorDecisionInboxReport,
  renderOperatorDecisionInboxMarkdown,
} from "../engine/coordination/operator-decision-inbox.ts";
import { normalizeAbsolutePath } from "../shared/lib/path-normalization.ts";
import { getDefaultDirectiveWorkspaceRoot } from "../shared/lib/workspace-root.ts";

function main() {
  const directiveRoot = normalizeAbsolutePath(getDefaultDirectiveWorkspaceRoot());
  const report = buildOperatorDecisionInboxReport({
    directiveRoot,
  });
  const markdown = renderOperatorDecisionInboxMarkdown(report);
  const reportPath = path.join(directiveRoot, "control", "reports", "operator-decision-inbox.md");

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, markdown, "utf8");
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        reportPath,
        inboxVersion: report.inboxVersion,
        totalActionableEntries: report.summary.totalActionableEntries,
      },
      null,
      2,
    )}\n`,
  );
}

main();
