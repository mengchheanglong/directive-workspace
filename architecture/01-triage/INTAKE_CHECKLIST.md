# Intake Checklist

Use this checklist for each candidate source from `sources/intake`.

## 1) Candidate

- Candidate name:
- Source type: `github-repo` / `paper` / `theory` / `product-doc` / `other`
- Source reference (URL/DOI/path):
- Local intake path:
- Date:

For `github-repo`:
- Repo: `owner/repo`
- Branch or tag checked:

## 2) Problem fit

- Which current pain does this solve?
- Is this for OpenClaw orchestration, Codex execution, or both?
- Expected impact (speed, reliability, quality):

## 3) Architecture fit

- Compatible with current stack (Next BFF + Nest backend + Drizzle)?
- Requires replacement or only extension?
- Operational risk (low/medium/high):

## 4) Evidence and references

- Core evidence observed (specific file/module/section):
- Related references discovered from this source:
  - Papers:
  - Theory/framework posts:
  - Product/docs:
- Should any related reference be added as a new intake candidate? (yes/no)

## 5) Experiment plan (bounded)

- Smallest test to prove value:
- Success criteria:
- Timebox:

## 6) Decision

- Adopt / Defer / Reject
- Reason:
- Next action:

## 7) Source-adaptation chain (if routed to Architecture)

If the decision is Adopt and the route is Architecture, the next required step is a full source analysis per `shared/contracts/source-analysis-contract.md`.

This checklist provides first-pass triage. The source-analysis contract provides the deeper structured evaluation including:
- value map (extractable mechanisms)
- baggage map (what to exclude)
- adaptation opportunity (how to reshape for Directive Workspace)
- improvement opportunity (how to improve beyond the source)
- meta-usefulness check (does this improve the engine itself?)

Do not skip the source-analysis step and jump directly to extraction or adoption.
