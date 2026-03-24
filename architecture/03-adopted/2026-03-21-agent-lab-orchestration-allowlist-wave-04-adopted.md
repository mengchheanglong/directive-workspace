# Adopted: Agent-Lab Orchestration Allowlist Wave 04 (2026-03-21)

- Candidate id: `al-src-agent-lab-orchestration-allowlist`
- Source type: `other`
- Decision state: `accept_for_architecture`
- Adoption target: `Directive Architecture`
- Adoption form:
  - shared contract
  - Forge-facing template binding
  - Architecture policy note
- Status class: `product_materialized`

## Why Accepted

The source-map already isolated one surviving internal mechanism from `agent-lab/orchestration` that was not yet normalized: the curation/export allowlist boundary.

That value belongs to Architecture because it governs what Directive Workspace may preserve and promote from external tooling without drifting into blind import or runtime-truth mirroring.

## Materialized Outputs

1. Added shared allowlist contract:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\source-pack-curation-allowlist.md`
2. Bound the rule into Forge follow-up capture:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\forge-follow-up-record.md`
3. Bound the rule into the Forge source-pack surface description:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\forge\source-packs\README.md`
4. Recorded the retained mechanism and adaptation rule:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-agent-lab-orchestration-allowlist-policy.md`

## Excluded Baggage

- upstream orchestration folder layout
- vendored dependencies
- local logs and generated test artifacts
- local stack scripts as default runtime truth

## Validation

- `npm run check:directive-orchestration-allowlist-contracts`
- `npm run check:directive-architecture-contracts`
- `npm run check:ops-stack`

## Rollback

- remove the shared allowlist contract
- remove the Forge template/readme bindings
- remove host checker wiring
- return the value to source-map/reference-only status
