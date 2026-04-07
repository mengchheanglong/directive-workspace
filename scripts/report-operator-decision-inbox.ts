import {
  buildOperatorDecisionInboxReport,
} from "../engine/coordination/operator-decision-inbox.ts";

function main() {
  process.stdout.write(
    `${JSON.stringify(
      buildOperatorDecisionInboxReport(),
      null,
      2,
    )}\n`,
  );
}

main();
