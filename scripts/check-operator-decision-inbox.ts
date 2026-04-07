import assert from "node:assert/strict";

import {
  buildOperatorDecisionInboxReport,
  OPERATOR_DECISION_INBOX_VERSION,
  renderOperatorDecisionInboxMarkdown,
} from "../engine/coordination/operator-decision-inbox.ts";

const CHECKER_ID = "operator_decision_inbox";

function main() {
  const report = buildOperatorDecisionInboxReport({
    snapshotAt: "2026-04-08T00:00:00.000Z",
  });

  assert.equal(report.ok, true);
  assert.equal(report.inboxVersion, OPERATOR_DECISION_INBOX_VERSION);
  assert.equal(report.guardrails.readOnly, true);
  assert.equal(report.guardrails.mutatesWorkflowState, false);
  assert.equal(report.guardrails.bypassesReview, false);
  assert.equal(report.guardrails.writesRegistryEntries, false);
  assert.equal(report.guardrails.runsHostAdapters, false);
  assert.equal(report.summary.totalActionableEntries, report.entries.length);
  assert.equal(
    report.summary.discoveryRoutingReviewCount
      + report.summary.architectureMaterializationDueCount
      + report.summary.runtimeHostSelectionCount
      + report.summary.runtimeRegistryAcceptanceCount,
    report.summary.totalActionableEntries,
  );
  if (report.summary.runtimeHostSelectionCount > 0) {
    assert.equal(
      report.entries[0]?.decisionSurface,
      "runtime_host_selection",
      "Runtime host-selection decisions should be prioritized first for operator triage.",
    );
  }

  assert.ok(
    report.entries.some((entry) =>
      entry.decisionSurface === "runtime_host_selection"
      && entry.eligibleNextAction === "clarify_repo_native_host_target"
      && entry.resolverCommandOrArtifact.includes("host-selection-resolution.md")
    ),
    "inbox should expose pending Runtime host-selection review actions",
  );

  for (const entry of report.entries) {
    assert.equal(entry.readOnly, true);
    assert.equal(entry.mutatesWorkflowState, false);
    assert.equal(entry.bypassesReview, false);
    assert.ok(entry.entryId.trim());
    assert.ok(entry.artifactPath.trim());
    assert.ok(entry.blockReason.trim());
    assert.ok(entry.eligibleNextAction.trim());
    assert.ok(entry.stopLine.trim());
  }

  const markdown = renderOperatorDecisionInboxMarkdown(report);
  assert.match(markdown, /^# Operator Decision Inbox/m);
  assert.match(markdown, /## Runtime Host Selection/);
  assert.match(markdown, /## Architecture Materialization/);
  assert.match(markdown, /## Discovery Routing Review/);
  assert.match(markdown, /This report is read-only/);
  assert.match(
    markdown,
    new RegExp(`Architecture materialization decisions: ${report.summary.architectureMaterializationDueCount}`),
  );
  assert.match(markdown, new RegExp(`Total actionable entries: ${report.summary.totalActionableEntries}`));

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        inboxVersion: report.inboxVersion,
        totalActionableEntries: report.summary.totalActionableEntries,
        covered: [
          "read_only_guardrails",
          "summary_counts_match_entries",
          "runtime_host_selection_prioritized_first",
          "runtime_host_selection_action_visible",
          "architecture_materialization_group_renders_even_when_clean",
          "entries_have_actionable_context",
          "markdown_report_renders_operator_groups",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

main();
