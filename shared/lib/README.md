# Shared Libraries

`shared/lib/` contains canonical, host-agnostic executable helpers for Directive Workspace.

Use this folder for reusable product logic that:
- belongs to Directive Workspace rather than a specific host
- is shared across Discovery, Runtime, or Architecture outputs
- should not be redefined by Mission Control

Current canonical shared helpers:
- `structured-output-fallback.ts`
- `lifecycle-artifacts.ts`
- `integration-artifact-generator.ts`
- `discovery-gap-priority.ts`
- `discovery-gap-worklist-generator.ts`
- `discovery-gap-worklist-selector.ts`
- `openclaw-discovery-submission-adapter.ts`
- `openclaw-maintenance-watchdog-signal-adapter.ts`
- `openclaw-runtime-verification-signal-adapter.ts`
- `discovery-intake-queue-writer.ts`
- `discovery-intake-queue-transition.ts`
- `discovery-intake-lifecycle-sync.ts`
- `discovery-front-door-coverage.ts`
- `discovery-routing-record-writer.ts`
- `discovery-completion-record-writer.ts`
- `discovery-case-record-writer.ts`
- `discovery-fast-path-record-writer.ts`
- `discovery-submission-router.ts`
- `discovery-mission-routing.ts`
- `runtime-follow-up-record-writer.ts`
- `runtime-record-writer.ts`
- `runtime-proof-bundle-writer.ts`
- `runtime-transformation-proof-writer.ts`
- `runtime-transformation-record-writer.ts`
- `runtime-promotion-record-writer.ts`
- `runtime-registry-entry-writer.ts`
- `literature-monitoring-artifacts.ts`
- `lifecycle-review-feedback.ts`
- `architecture-review-resolution.ts`
- `architecture-adoption-resolution.ts`
- `architecture-adoption-artifacts.ts`
- `architecture-adoption-decision-envelope.ts`
- `architecture-adoption-decision-store.ts`
- `architecture-closeout.ts`
- `architecture-adoption-decision-writer.ts`
- `architecture-cycle-decision-loader.ts`
- `architecture-cycle-decision-summary.ts`

Mission Control may keep temporary host-local mirrors of these files until direct standalone package consumption is stable in production builds.

Host-neutral adapter guidance and example payloads live under:
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\README.md`

Phase-isolated processing note:
- the current phase-isolation upgrade lands as contract + template + schema first
- no canonical shared-lib helper is required yet because the immediate gap is execution discipline, not packet parsing/runtime enforcement

Mechanism-packet note:
- reusable mechanism packets are currently contract/template/schema surfaces first
- no canonical shared-lib helper is required yet because the immediate need is preserving adapted Architecture value, not runtime packet tooling

Literature-monitoring note:
- the first bounded Runtime literature-monitoring slice now has a canonical shared-lib helper for normal digest and degraded-state artifacts
- this helper remains host-neutral and product-owned until a later host promotion actually opens

Lifecycle-review-feedback note:
- this helper operationalizes the already-adopted OpenMOSS lifecycle and score-feedback patterns as executable product code
- it stays host-neutral and pure, returning transition validity, score deltas, review outcomes, and blocked-recovery plans without database/runtime coupling

Architecture-review-resolution note:
- this helper turns the Impeccable Architecture review guardrails into an executable review lane
- it consumes `lifecycle-review-feedback.ts` to resolve score, approval/block/recovery outcome, and the required lifecycle transition for evaluated Architecture slices

Architecture-adoption-resolution note:
- this helper turns the Architecture adoption criteria into an executable Decide-step lane
- it consumes `architecture-review-resolution.ts` when available, combines review outcome with adoption-readiness and Runtime-threshold logic, and resolves adopt vs stay-experimental vs Runtime handoff

Architecture-adoption-artifacts note:
- this helper materializes the canonical `architecture-adoption-decision.schema.json` shape from the executable adoption lane
- it keeps Decide-step output machine-readable and host-neutral instead of leaving adoption artifacts as prose-only summaries
- it now emits a canonical `decision_format` and builds optional sections through the version-aware envelope helper instead of ad hoc object assembly

Architecture-adoption-decision-envelope note:
- this helper adapts versioned artifact-envelope and recursive-merge discipline into Directive Workspace's retained Architecture decision lane
- it owns the canonical `decision_format` identifier plus the merge behavior used to compose optional nested artifact sections without leaking unset placeholders into on-disk JSON
- it exists so future schema evolution can identify and migrate retained decision artifacts cleanly instead of assuming every JSON file is the same implicit shape

Architecture-adoption-decision-store note:
- this helper adapts the atomic retained-record pattern into Directive Workspace's Architecture closeout lane
- it owns atomic write, read, list, and delete operations for retained `architecture-adoption-decision` artifacts beside Architecture records
- it exists so closeout, backfill, and wave-evaluation paths share one canonical persistence and validation surface instead of reimplementing JSON file handling in host scripts

Architecture-closeout note:
- this helper turns the Decide step into one canonical Architecture closeout lane by resolving review, resolving adoption, enforcing experiment-vs-adopted record state, and emitting the retained decision artifact shape in one path
- it exists so new Architecture slices can close out through one executable system lane instead of manual sequencing across separate review/adoption/writer helpers

Architecture-adoption-decision-writer note:
- this helper turns the machine-readable adoption artifact into a retained on-disk Architecture output beside the adopted record by default
- it exists so future adopted Architecture slices stop hand-authoring `*-adoption-decision.json` files and use one canonical emission path instead
- it can consume raw Architecture review input and resolve the live Decide-step path before writing the retained artifact
- the current retained six-slice Architecture decision corpus can now be regenerated through the host backfill script instead of being maintained by hand

Architecture-cycle-decision-loader note:
- this helper loads closeout-emitted decision artifacts directly from a wave's experiment/adopted record refs using the canonical record-to-decision adjacency rule
- it exists so cycle evaluation can consume real on-disk closeout output without maintaining separate manual lists of `*-adoption-decision.json` files

Architecture-cycle-decision-summary note:
- this helper consumes machine-readable Architecture adoption artifacts to summarize verdict, usefulness, artifact-type, completion-status, Runtime-handoff, and meta-self-improvement composition
- it exists so cycle evaluation can use generated decision artifacts instead of re-deriving those counts from prose adopted records

Discovery-front-door-coverage note:
- this helper measures whether Discovery-first usage is actually routine from the live queue and markdown corpus
- it distinguishes native post-primary entries from backfill-like entries, so the system can judge front-door health from current operation instead of stale historical counts
