# Scientify Literature Monitoring Runtime Follow-up

- Candidate id: `scientify-literature-monitoring`
- Candidate name: `scientify literature monitoring workflow`
- Follow-up date: `2026-03-23`
- Current decision state: `accept follow-up`
- Origin track: `Directive Architecture`
- Runtime value to operationalize: one bounded recurring workflow that queries a small paper-source candidate pool, ranks and filters it against a bounded topic signal, renders a concise digest artifact, and exposes degraded-state visibility when evidence quality is weak
- Proposed host: `OpenClaw`
- Proposed integration mode: `bounded workflow` (host-neutral-first, delivery-adapter boundary)
- Source-pack allowlist profile: `pending explicit-only bounded source-pack candidate`
- Allowed export surfaces:
  - topic input contract
  - bounded query + ranking/filter workflow
  - digest artifact renderer
  - delivery adapter boundary
  - degraded-state visibility surface
- Excluded baggage:
  - full Scientify plugin/runtime stack
  - broad autonomous research pipeline behavior
  - host-wide scheduler assumptions beyond one bounded recurring workflow
  - architecture-owned mixed-value partition logic
- Promotion contract path: pending (create only when one bounded runtime slice is ready to propose to a host)
- Re-entry contract path (if deferred): n/a - active bounded follow-up
- Re-entry preconditions (checklist):
  - [x] formal Architecture-to-Forge handoff exists
  - [x] mixed-value partition is explicit
  - [x] bounded runtime candidate is narrower than the source runtime
  - [x] bounded Forge runtime-definition slice exists
  - [x] digest-quality proof exists
  - [x] degraded-state proof exists
  - [ ] host proposal surface is chosen and bounded
- Required proof:
  - bounded candidate-pool fetch proof
  - deterministic-enough ranking/filter inspection proof
  - digest artifact proof
  - degraded-state handling proof when evidence quality is insufficient
  - parity proof against retained promotion-quality gate expectations
- Required gates:
  - bounded Forge evaluator/proof gate for digest quality
  - bounded Forge evaluator/proof gate for degraded-state handling
  - relevant Directive Forge/runtime checks for the chosen runtime surface
- Trial scope limit (if experimenting):
  - max workflow objective: `1` bounded literature-monitoring loop
  - max source set: `2` bounded paper providers
  - max delivery surface: `1`
  - no broad plugin/runtime import
- Risks:
  - weak evidence quality hidden behind attractive digest output
  - scope creep from bounded workflow into broad autonomous research behavior
  - host coupling too early if the first slice is designed around one scheduler/runtime
- Rollback: return candidate to follow-up-only state, discard slice-specific runtime artifacts and host bindings, and preserve the Architecture-owned partition and quality-gate patterns
- No-op path: keep the candidate as an active Forge follow-up without opening runtime execution until one bounded slice is specified clearly enough to prove
- Review cadence: on next Forge runtime opening or architecture-to-forge boundary review
- Current status: `active bounded follow-up`

Linked handoff:
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\handoff\2026-03-23-scientify-literature-monitoring-architecture-to-forge-handoff.md`

Linked Forge runtime-definition slice:
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\records\2026-03-23-scientify-literature-monitoring-forge-record.md`

Linked proof checklist:
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\records\2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md`

Linked live-fetch proof:
- `C:\Users\User\.openclaw\workspace\directive-workspace\forge\records\2026-03-23-scientify-literature-monitoring-runtime-slice-02-live-fetch-proof.md`
