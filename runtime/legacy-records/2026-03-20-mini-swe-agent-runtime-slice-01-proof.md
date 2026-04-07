# Mini-SWE-Agent Runtime Slice 01 Proof

Date: 2026-03-20
Candidate id: `mini-swe-agent`
Track: `Directive Runtime`
Slice type: bounded fallback-lane rehearsal

## Run Contract

Source pattern:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\follow-up\DIRECTIVE_MINI_SWE_AGENT_SLICE_3_FALLBACK_PATTERN.md`

Runtime rehearsal artifact:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-20-mini-swe-agent-fallback-rehearsal.md`

## Operational Outcome

- One bounded fallback rehearsal executed in isolated sandbox.
- Preflight and post-run verification both passed.
- Rehearsal generated trajectory artifact with deterministic completion.
- No production runtime path was modified.

## Risk + Mitigation

- Observed runtime issue: Windows `cp1252` encoding error on emoji output from mini-swe-agent banner.
- Mitigation used in bounded run:
  - set `PYTHONIOENCODING=utf-8` explicitly for the rehearsal command.
- This remains an active runtime risk for Windows hosts and is captured in registry notes.

## Required Gates

- `npm run check:directive-workspace-v0` -> PASS
- `npm run check:directive-integration-proof` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:directive-promotion-quality-contracts` -> PASS
- `npm run check:ops-stack` -> PASS

## Quality Gate Snapshot

- Quality gate profile: promotion_quality_gate/v1
- Promotion profile family: research_quality_gate
- Proof shape: quality_metric_snapshot/v1
- Primary host checker: `npm run check:directive-promotion-quality-contracts`
- Full-text coverage threshold (%): 80
- Evidence-binding threshold (%): 90
- Citation-error threshold (%): 2
- Observed full-text coverage (%): 100
- Observed evidence-binding (%): 95
- Observed citation error rate (%): 0
- Quality gate result: pass
- Validation state: self_validated
- Quality gate fail reasons: none

## Rollback

If this slice is rolled back:
- remove bounded rehearsal artifacts
- remove promotion/registry records for this candidate
- keep fallback lane disabled by default
