# Architecture Adoption Decision Corpus

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Forge threshold check: `yes` - this improves Architecture evaluation and corpus review without requiring a runtime surface

## Why this slice exists

Directive Workspace could generate machine-readable Architecture adoption decisions, but the system still treated those artifacts as checker fixtures rather than a reusable on-disk corpus.

That left two gaps:
- cycle evaluation still depended on synthetic inputs instead of adopted-record-adjacent artifacts
- later corpus review still had no stable machine-readable decision inventory to inspect

## Experiment move

Materialize a bounded on-disk decision corpus beside adopted records in `architecture/03-adopted/`:
1. `2026-03-23-openmoss-review-feedback-lib-adoption-decision.json`
2. `2026-03-23-architecture-review-resolution-lib-adoption-decision.json`
3. `2026-03-23-architecture-adoption-resolution-lib-adoption-decision.json`
4. `2026-03-23-architecture-adoption-artifacts-lib-adoption-decision.json`
5. `2026-03-23-architecture-cycle-decision-summary-lib-adoption-decision.json`
6. `2026-03-23-scientify-literature-monitoring-forge-handoff-adoption-decision.json`

Add an executable corpus checker:
- `mission-control/scripts/check-directive-architecture-adoption-decision-corpus.ts`

Then consume the resulting summary in a new Architecture cycle evaluation wave.

## Expected result

Architecture should be able to review real decision artifacts on disk, not just synthetic checker payloads, and later waves should be able to compare:
- verdict composition
- usefulness distribution
- artifact-type distribution
- completion-status distribution
- Forge handoff demand
- meta self-improvement coverage
