# Intake Checklist

## 1) Candidate

- Candidate name: scientify
- Source type: `github-repo`
- Source reference: sources/intake/scientify
- Local intake path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\scientify`
- Date: 2026-03-18

For `github-repo`:
- Repo: scientify (OpenClaw plugin)
- Branch or tag checked: main

## 2) Problem fit

- Which current pain does this solve? Academic research pipeline is manual. Scientify automates literature survey → deep analysis → implementation planning → code generation → review.
- Is this for OpenClaw orchestration, Codex execution, or both? Both — OpenClaw plugin with execution sub-agents.
- Expected impact (speed, reliability, quality): Moderate-high speed, moderate quality, moderate reliability.

## 3) Architecture fit

- Compatible with current stack (Next BFF + Nest backend + Drizzle)? Yes — TypeScript/Node.js OpenClaw plugin. Native fit.
- Requires replacement or only extension? Extension only.
- Operational risk (low/medium/high): Medium (academic pipeline complexity)

## 4) Evidence and references

- Core evidence observed: OpenClaw plugin. Automates literature survey, deep analysis, implementation planning, code generation, review. ArXiv/OpenAlex search. Paper downloads. Scheduled literature monitoring.
- Related references discovered: None notable.
- Should any related reference be added as a new intake candidate? No

## 5) Experiment plan (bounded)

- Smallest test to prove value: Run scientify on one research topic. Evaluate output quality vs manual literature review.
- Success criteria: Produces structured analysis with verifiable sources.
- Timebox: 4 hours

## 6) Decision

- Adopt / Defer / Reject: **Defer**
- Reason: Score 3.80 (tied with gpt-researcher) but narrower scope. gpt-researcher covers general research; scientify is academic-specific. Revisit after gpt-researcher is validated.
- Next action: Monitor. Revisit if academic research becomes a priority workflow.

## Scoring

| Dimension | Score |
|-----------|-------|
| Workflow Impact | 4 |
| Integration Cost (reverse) | 4 |
| Operational Risk (reverse) | 3 |
| Reusability | 4 |
| Observability Fit | 4 |
| **Weighted Total** | **3.80** |
| **Tier** | **MID (bubble)** |
