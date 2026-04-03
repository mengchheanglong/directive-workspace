# Directive Workspace Workflow

Last updated: 2026-03-24
Status: canonical

This is the default operating workflow for Directive Workspace.

Workflow precedence note:
- interpret this file through the repo-governing doctrine in `../CLAUDE.md`
- use `../OWNERSHIP.md` and `./doctrine.md` as the local guardrails for whether this workflow is still serving the real project

The goal is to keep the system fast by default and only expand the process when complexity or risk actually requires it.

Default rule:
- start from the shortest truthful path
- escalate only when the next stage adds concrete new product value or opens a real seam

## OpenClaw note

OpenClaw-native rescue/recovery work is not owned by this workflow.
If a Directive Workspace document needs to point at OpenClaw rescue behavior, treat the current adjacent OpenClaw workspace docs as external examples:
- `C:\Users\User\.openclaw\workspace\openclaw\RESCUE_OPENCLAW.md`
- `C:\Users\User\.openclaw\workspace\openclaw\RESCUE_PROTOCOL.md`

## Canonical Flow

Use this full governing flow:

**Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report**

The default fast loop below is an operator compression of this canonical flow.
It must not drop `Decide` or `Report`.

## Default Fast Loop

Default mode:
- `NOTE`, unless current repo truth clearly justifies `STANDARD` or `DEEP`

1. Capture + Analyze
- record the candidate once.
- default surface: Discovery.
- use the Engine to assess mission fit, likely usefulness, likely baggage, and likely adoption target before moving deeper.
- let the Engine emit an explicit usefulness rationale with that judgment so later records and reports do not need to infer the explanation from score breakdowns alone.
- Discovery records and carries that Engine-owned judgment as the front-door lane; it should not recreate the default shared heuristics locally.

2. Route
- decide the adoption target early:
  - Runtime
  - Architecture
  - or Discovery holding state
- when multiple internal-signal slices are available, prefer the highest-ranked unresolved gap in `discovery/gap-worklist.json`

3. Extract + Adapt + Improve
- extract mission-relevant value rather than adopting the source whole.
- adapt the value into Directive-owned form.
- improve it where appropriate before proof.

4. Prove
- run one bounded proof only if the claim needs evidence.
- default proof rule: one claim, one slice, one clear stop condition.

5. Decide
- record one explicit decision state and one explicit adoption target.

6. Integrate + Report
- integrate only in the chosen track.
- sync the outcome into Mission Control reports before ending the session.

## Default Artifact Count

Use the smallest artifact set that preserves clarity.

### Discovery default
- one fast-path record in `discovery/intake/`

### Architecture default
- one experiment slice in `architecture/02-experiments/`
- one adopted or deferred outcome only if the slice survives the decision
- default stop at bounded-result
- downstream materialization stages are DEEP-only unless the next step adds a concrete new Directive-owned artifact or required consumption proof

### Architecture source-driven work
When Architecture processes a source (repo, paper, framework, tool, workflow, method), use the source-adaptation chain:
1. Source analysis per `shared/contracts/source-analysis-contract.md` — value map, baggage map, adaptation/improvement opportunities
2. Adaptation decision per `shared/contracts/adaptation-decision-contract.md` — per-mechanism extract/adapt/improve decisions with mandatory delta evidence
3. Experiment slice using `shared/templates/source-adaptation-record.md` or `experiment-record.md` with the source-adaptation fields filled
4. If the adapted value has a runtime component, hand off to Runtime via `shared/contracts/architecture-to-runtime.md` with adaptation/improvement evidence

The source-adaptation chain replaces the weak pattern (`extract → adopt`) with the doctrine-required strong pattern (`extract → adapt → improve`), which then continues through `Prove → Decide → Integrate + Report`.

Skip the source-adaptation chain only when the Architecture work is purely internal (doctrine update, workflow redesign, template/contract creation) with no external source input.

When the source-driven slice is heavy enough that analysis and adaptation would degrade if chained through one growing context, use `shared/contracts/phase-isolated-processing.md` and emit a packet via `shared/templates/phase-handoff-packet.md` between phases. The next phase should depend on the packet and artifacts, not on conversational continuity.

Source-driven Architecture work must also satisfy `shared/contracts/transformation-artifact-gate.md`.
Moving files, rewording notes, or updating queue/routing state without producing transformed Directive-owned operating value does not count as source processing.

When a source-driven slice is expected to improve future Architecture work, emit a reusable mechanism packet per `shared/contracts/architecture-mechanism-packet.md` so later slices can assemble from adapted Directive value without reopening the full historical chain.
When the value emerges primarily from multiple-source collision rather than any single source, emit a reusable synthesis packet per `shared/contracts/cross-source-synthesis-packet.md`.
When an existing mechanism packet or synthesis packet already covers retained value needed by a later Architecture slice, consume that packet as a primary input before reopening the full historical source chain. Packet creation is not enough; compounding reuse is the stronger system behavior.
When a source is genuinely mixed-value, use `shared/contracts/mixed-value-source-partition.md` to make packet reuse scope, fresh re-analysis scope, Architecture-retained mechanisms, and later Runtime candidates explicit instead of forcing the whole source into one lane.

### Architecture adoption decisions
When an adapted/improved mechanism reaches the Decide step, use `shared/contracts/architecture-adoption-criteria.md` to determine:
- whether the mechanism is ready for adoption (readiness check)
- what artifact type it should become (contract, schema, template, policy, reference-pattern, shared-lib, doctrine-update)
- whether to adopt in Architecture, stay experimental, or hand off to Runtime
- what usefulness-level treatment applies (direct → Runtime handoff, structural → Architecture core, meta → self-improvement priority)

When the Decide step needs an executable outcome, resolve it through `shared/lib/architecture-adoption-resolution.ts` so review result, readiness gates, artifact type selection, and Runtime threshold logic stay canonical.
When the Decide step must emit a machine-readable adoption artifact, build it through `shared/lib/architecture-adoption-artifacts.ts` so the output matches `shared/schemas/architecture-adoption-decision.schema.json`.
When retained decision artifacts are expected to survive across later Architecture generations, keep their canonical `decision_format` through `shared/lib/architecture-adoption-decision-envelope.ts` so closeout, backfill, and cycle evaluation can distinguish artifact-shape upgrades cleanly.
When the Decide step should run review, adoption, and retained decision emission as one canonical closeout lane, execute it through `shared/lib/architecture-closeout.ts`. Use an experiment record under `architecture/02-experiments/` for `stay_experimental` closeouts and an adopted record under `architecture/03-adopted/` for `adopt` or `hand_off_to_runtime` closeouts.
When retained adoption decisions must be written, loaded, or backfilled from disk, route that persistence through `shared/lib/architecture-adoption-decision-store.ts` so closeout, corpus maintenance, and wave evaluation share one atomic product-owned store instead of host-local JSON handling.
When a retained machine-readable adoption artifact is produced for an adopted slice, emit it through `shared/lib/architecture-adoption-decision-writer.ts` so it lands beside the adopted record in `architecture/03-adopted/` by default and cycle evaluation/corpus review can consume the on-disk decision state directly.
When the live Decide-step lane already has review checks but not a pre-resolved review artifact, pass those checks to the same writer so the retained decision output stays on the canonical review -> adoption -> retention path.

When an adoption is flagged as meta-useful, include a self-improvement evidence block per `shared/contracts/architecture-self-improvement-contract.md`.

### Architecture artifact lifecycle
Every Architecture artifact must exist in exactly one state: `experiment`, `adopted`, `reference-pattern`, or `deferred`.
Use `shared/contracts/architecture-artifact-lifecycle.md` for:
- required fields per state
- transition rules between states
- reference-pattern admission criteria
- experiment-to-adopted promotion requirements
- adopted-to-Runtime handoff requirements
- pre-doctrine record handling

All new experiment and adopted records must include lifecycle classification fields:
- origin (`source-driven` | `internally-generated`)
- usefulness level (`direct` | `structural` | `meta`)
- Runtime threshold check

### Architecture cycle evaluation
At the start of each new Architecture wave, evaluate the previous cycle using `shared/templates/architecture-cycle-evaluation.md`. This tracks whether Architecture is getting better at source consumption, not just producing more artifacts.
When machine-readable adoption artifacts exist for the evaluated wave, load them from the wave's experiment/adopted record refs through `shared/lib/architecture-cycle-decision-loader.ts`, then summarize them through `shared/lib/architecture-cycle-decision-summary.ts` so verdict/usefulness/handoff composition comes from generated decision artifacts instead of prose re-interpretation.
Prefer decision artifacts emitted by the live Architecture closeout lane over hand-authored backfills when both exist.

If a meta-useful adoption materially changes how prior evidence should be interpreted, open a boundary per `shared/contracts/self-improvement-generation-boundary.md` and record it with `shared/templates/generation-boundary-note.md`.
Pre-boundary evidence can remain historical context, but it must not be counted as clean confirmation of the new Architecture generation.

The corpus normalization record (`architecture/02-experiments/2026-03-22-architecture-corpus-normalization.md`) provides the baseline classification for all pre-doctrine adopted records.

### Runtime default
- one follow-up record in `runtime/follow-up/`
- one promotion record only when host/runtime delivery is real
- if the case is exploratory or lacks delivery pressure, park at follow-up review or capability-boundary instead of extending the chain

## Escalate To Full Workflow When

Split the process into extra records only when one of these is true:

- the candidate is part of a batch or wave
- the route is disputed or changes midstream
- the result should be held as `monitor`, `defer`, or `reference`
- the output becomes a reusable contract, policy, or template
- the work crosses from Architecture into Runtime
- the work touches Mission Control runtime behavior directly

If none of those conditions are true, stay on the fast path.

For Architecture, the full downstream chain after bounded-result:
- implementation-target
- implementation-result
- retained
- integration-record
- consumption-record
- post-consumption-evaluation

should be treated as DEEP-mode only.

## Fast Stop Rules

- If the adoption target is still unclear after first-pass review, stop and hold in Discovery.
- If the proof cannot be bounded cleanly, narrow the claim before continuing.
- If an Architecture slice turns into runtime/callable work, hand it to Runtime instead of stretching the slice.
- If validation requires broad unrelated host gates, split the slice smaller before proceeding.

## Validation Bundles

Use the smallest gate bundle that matches the actual change.

### Bundle A: Doctrine / workflow / docs only
- `npm run check:directive-workflow-doctrine`
- `npm run directive:sync:reports`
- `npm run check:directive-workspace-report-sync`

### Bundle B: Shared contracts / templates / schemas
- relevant directive contract or schema check
- `npm run check:directive-v0`
- `npm run check:directive-workspace-health`
- report sync

### Bundle C: Mission Control host logic
- relevant directive checks
- `npm run typecheck`
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof` when lifecycle/proof behavior changes
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack` only when host-wide behavior, shared host wiring, or release safety is affected

## Canonical Routing Question

Ask this first:

"Is the main value a runtime/callable capability, or an internal framework improvement?"

- runtime/callable capability -> Runtime
- internal framework improvement -> Architecture
- not actionable yet -> Discovery holding state

## Canonical Efficiency Rule

Do not create three records when one record is enough.

Do not run the heaviest gate bundle when a narrower gate bundle proves the change safely.

Do not continue a slice after the adoption target becomes unclear.

Do not continue a slice after bounded-result unless the next step adds a concrete product artifact that does not already exist.
