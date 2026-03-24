# Intake Checklist

## 1) Candidate

- Candidate name: mini-swe-agent
- Source type: `github-repo`
- Source reference: sources/intake/mini-swe-agent
- Local intake path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent`
- Date: 2026-03-18

For `github-repo`:
- Repo: mini-swe-agent (Princeton/Stanford)
- Branch or tag checked: main (v2)

## 2) Problem fit

- Which current pain does this solve? Provides a minimal, transparent reference for what a coding agent needs to be. Useful as lightweight fallback and architecture benchmark for agent design decisions.
- Is this for OpenClaw orchestration, Codex execution, or both? Primarily execution — lightweight coding agent alternative.
- Expected impact (speed, reliability, quality): Moderate — reference architecture value exceeds direct execution value. 74% SWE-bench with ~100 lines proves simplicity wins.

## 3) Architecture fit

- Compatible with current stack (Next BFF + Nest backend + Drizzle)? Yes — standalone Python script, no stack coupling.
- Requires replacement or only extension? Neither — reference pattern extraction.
- Operational risk (low/medium/high): Low

## 4) Evidence and references

- Core evidence observed (specific file/module/section): ~100 lines core agent code. Bash-only tools. No stateful shell sessions. Production use at Meta, NVIDIA, IBM, Princeton, Stanford. 74% SWE-bench.
- Related references discovered from this source:
  - Papers: None
  - Theory/framework posts: Minimal agent design philosophy
  - Product/docs: Tutorial companion (minimal-agent-tutorial)
- Should any related reference be added as a new intake candidate? No (tutorial already in intake)

## 5) Experiment plan (bounded)

- Smallest test to prove value: Run mini-swe-agent on 5 known issues from mission-control. Compare output quality and time vs Codex on same tasks.
- Success criteria: Produces correct fixes on at least 3/5 issues. Time-to-fix within 2x of Codex.
- Timebox: 4 hours

## 6) Decision

- Adopt / Defer / Reject: **Adopt** (pending experiment)
- Reason: Third-highest score (4.10). Extremely low cost/risk. Architecture reference value is high even if not used as primary agent.
- Next action: Extract architecture patterns. Run comparison experiment.

## Scoring

| Dimension | Score |
|-----------|-------|
| Workflow Impact | 3 |
| Integration Cost (reverse) | 5 |
| Operational Risk (reverse) | 5 |
| Reusability | 4 |
| Observability Fit | 4 |
| **Weighted Total** | **4.10** |
| **Tier** | **HIGH** |
