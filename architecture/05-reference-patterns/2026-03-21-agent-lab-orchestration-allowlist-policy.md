# Agent-Lab Orchestration Allowlist Policy

Date: 2026-03-21
Candidate id: `al-src-agent-lab-orchestration-allowlist`
Source slice: `2026-03-21-orchestration-allowlist-contract-closure-slice-20.md`

Materialized outputs:
- `shared/contracts/source-pack-curation-allowlist.md`
- `shared/templates/runtime-follow-up-record.md`
- `runtime/source-packs/README.md`

Retained mechanisms:
- explicit curation/export allowlist
- ownership-path declaration before promotion
- readiness-marker rule for runtime-capable source packs
- excluded-baggage rule for vendored or environment-specific upstream material

Directive adaptation rule:
- keep source-pack promotion bounded to declared export surfaces
- keep governance-first value in shared contracts and notes instead of inflating Runtime runtime scope
- require explicit ownership and rollback before any source-pack activation
- do not treat upstream folder mirrors as live runtime truth

Validation hooks:
- `npm run check:directive-orchestration-allowlist-contracts`
- `npm run check:directive-architecture-contracts`
- `npm run check:ops-stack`

Completion note:
- this closes the Wave 04 allowlist-boundary gap for the current slice
- remaining future work, if any, would be Runtime consumption of this rule, not Architecture extraction
