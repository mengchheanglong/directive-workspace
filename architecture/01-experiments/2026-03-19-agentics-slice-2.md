# Integration Slice 2: agentics

## objective
Validate whether `agentics` reusable workflow patterns can be translated into Directive Workspace operator playbooks without introducing tooling lock-in.

## bounded experiment steps
1. Select two `agentics` workflows that map directly to Directive operations (for example: daily status summarization and docs maintenance).
2. Re-express each as a Mission Control playbook template (inputs, outputs, guardrails, stop conditions).
3. Run one dry-run against existing directive artifacts (no writes outside experiment files).

## success criteria
- Two translated playbook templates are documented.
- Each template has deterministic inputs/outputs and rollback guidance.
- Dry-run produces usable output structure.

## risk + rollback
- Risk: medium (over-general templates that are not actionable).
- Rollback: discard template docs; no runtime changes needed.

## required gates
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`
