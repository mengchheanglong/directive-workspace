# Operator Decision Inbox v1

Date: 2026-04-08

## Bounded Slice

Added a read-only `operator_decision_inbox.v1` report that aggregates actionable Discovery and Runtime decisions without resolving, accepting, executing, or automating anything.

## Required State

- Affected layer: Engine coordination / operator reporting
- Owning lane: Engine, reading Discovery and Runtime decision surfaces
- Mission usefulness: reduces friction after the gates are built by showing what needs review, why it is blocked, and the safe next action
- Proof path: `npm run check:operator-decision-inbox`, `npm run report:operator-decision-inbox`, `npm run check`
- Rollback path: remove the inbox builder, report/check scripts, package/batch entries, and this control log
- Stop-line: report-only; no routing review resolution, host selection resolution, registry entry write, host adapter run, or automation policy change

## Scope

The inbox reads:

- unresolved Discovery routing review/conflict records
- Runtime promotion-assistance recommendations such as pending host selection
- Runtime registry-acceptance dry-run status when evidence is present but automation remains disabled

## Boundary

This is not an approval UI and not an automation executor. It does not mutate queue state, write registry entries, run host adapters, or bypass review. It only makes the next safe operator decisions visible.
