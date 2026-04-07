# Directive Architecture

Directive Architecture is the reusable operating-code layer of Directive Workspace.

Architecture artifacts are not passive documentation. Contracts, schemas, templates, workflow rules, and doctrine are operating code (program-MD / org-as-code).

It owns:
- extraction of essential mechanisms from outside systems
- conversion of extracted value into product-owned contracts, schemas, templates, policies, and reusable rules
- bounded experiments to prove internal improvements
- adopted operating-code patterns and deferred decisions
- doctrine improvement over time
- Architecture decision records and bounded experiment notes only; raw source snapshots live under `C:\Users\User\.openclaw\workspace\directive-workspace\sources\`

It does not own:
- runtime/callable capability delivery (that is Runtime)
- external host runtime code, database, or APIs
- intake, triage, or routing (that is Discovery)
- raw upstream repo storage (that is `directive-workspace/sources/`)
- OpenClaw-native rescue role ownership (that belongs to OpenClaw)

OpenClaw note:
- if an Architecture document needs to mention OpenClaw rescue/recovery, reference `C:\Users\User\.openclaw\workspace\openclaw\RESCUE_OPENCLAW.md` instead of redefining the role here

Handoff rule:
- When Architecture work discovers runtime-worthy value, hand it to Runtime via the Architecture-to-Runtime handoff contract.
- Do not leak runtime work into Architecture.

Completion rule:
- Architecture is complete only when extracted value is materialized as product-owned Directive Workspace artifacts (contracts, schemas, templates, policies, rules).
- Host-side consumption can validate the result, but it does not define Architecture completion by itself.
- Canonical reference: `C:\Users\User\projects\directive-workspace\knowledge\architecture-completion-rubric.md`

Default path (NOTE/STANDARD):
- one routed candidate
- one bounded experiment/result slice
- one adopted or deferred outcome only when the result justifies extension
- normal finish line: `bounded-result`
- adopted records are a valid default stop when the accepted value is already retained in product-owned Architecture form

The old Architecture-local intake, triage, and bounded-start compatibility folders were removed from the active tree. New Architecture work should start in `architecture/01-experiments/` after Discovery has already handled intake, triage, and routing. Reopened Architecture slices also now live in `architecture/01-experiments/`.

DEEP-only continuation bundle:
- `implementation-target` (logical artifact paths stay under `architecture/04-implementation-targets/`; physical storage lives under `architecture/04-materialization/04-implementation-targets/`)
- `implementation-result` (logical artifact paths stay under `architecture/05-implementation-results/`; physical storage lives under `architecture/04-materialization/05-implementation-results/`)
- `retained` (logical artifact paths stay under `architecture/06-retained/`; physical storage lives under `architecture/04-materialization/06-retained/`)
- `integration-record` (logical artifact paths stay under `architecture/07-integration-records/`; physical storage lives under `architecture/04-materialization/07-integration-records/`)
- `consumption-record` (logical artifact paths stay under `architecture/08-consumption-records/`; physical storage lives under `architecture/04-materialization/08-consumption-records/`)
- `post-consumption-evaluation` (logical artifact paths stay under `architecture/09-post-consumption-evaluations/`; physical storage lives under `architecture/04-materialization/09-post-consumption-evaluations/`)

Only continue into this bundle when the next stage adds a concrete new Directive-owned artifact or required consumption proof.
Treat this bundle as explicit DEEP continuation, not the normal Architecture path.

Operator navigation map:
- Start and stop by default in `architecture/01-experiments/`.
- Use `architecture/02-adopted/` or `architecture/03-deferred-or-rejected/` only when the bounded result requires an explicit decision surface.
- Do not open the DEEP materialization bundle under `architecture/04-materialization/` unless the case is explicitly DEEP-mode.
- Deep-tail logical artifact links remain stable at `architecture/04-...` through `architecture/09-...` even though the physical files now live under `architecture/04-materialization/`.

Canonical references:
- `C:\Users\User\projects\directive-workspace\CLAUDE.md`
- `C:\Users\User\projects\directive-workspace\control\runbook\current-priority.md`
- `C:\Users\User\projects\directive-workspace\knowledge\README.md`
- `C:\Users\User\projects\directive-workspace\knowledge\architecture-completion-rubric.md`
- `C:\Users\User\projects\directive-workspace\architecture\ARCHITECTURE_EXPLORATION.md`

