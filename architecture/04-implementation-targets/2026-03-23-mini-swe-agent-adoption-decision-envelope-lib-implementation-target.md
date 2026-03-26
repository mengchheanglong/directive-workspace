# Implementation Target: mini-SWE-agent Adoption Decision Envelope Lib (2026-03-26)

## target
- Candidate id: `dw-src-mini-swe-agent-adoption-decision-envelope-lib`
- Candidate name: mini-SWE-agent Adoption Decision Envelope Lib
- Source adoption artifact: `architecture/03-adopted/2026-03-23-mini-swe-agent-adoption-decision-envelope-lib-adopted.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-23-mini-swe-agent-adoption-decision-envelope-lib-adoption-decision.json`
- Source bounded result artifact: not retained in this legacy adopted slice.
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopted`
- Target approval: `codex-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize one bounded reuse of the adopted shared lib inside one live Directive Architecture path.
- Materialization basis: This makes the retained Architecture decision lane more durable.

The system can now distinguish the current adoption-decision artifact format explicitly and can compose nested optional sections through one reusable helper instead of hand-filtered object construction.

That is a real Architecture-system improvement, not just another schema note.

## source decision envelope
- Decision format: `directive-architecture-adoption-decision-1.0`
- Source completion status: `product_materialized`
- Source verification method: `structural_inspection`
- Source verification result: `confirmed`
- Source runtime threshold check: yes - the mechanism is still valuable without a runtime surface, so Architecture should retain product-owned value

## selected tactical slice
- Carry the adopted decision envelope into the live implementation target/result chain instead of only linking the paired adoption decision artifact.
- Record the adopted decision format, completion status, verification method/result, and runtime-threshold context directly in the target and result artifacts.

## mechanical success criteria
- The implementation target renders a source decision envelope section derived from the paired adoption decision artifact.
- The implementation target validation gates include decision_envelope_continuity_check.
- The implementation result preserves the same source decision envelope fields and records continuity in its validation summary.

## explicit limitations
- Do not change adoption verdict semantics or reopen Runtime work from this slice.
- Do not broaden this into a general contract/schema redesign beyond the live Architecture ratchet.
- Keep the change bounded to implementation target/result handling for adopted Architecture slices.

## scope (bounded)
- Keep this to one bounded Directive-owned implementation slice.
- Consume the adopted value directly instead of re-deriving it from source prose or host-local logic.
- Do not add runtime execution, host integration, or Runtime reopening from this target.

## inputs
- Primary adopted product artifact: `shared/lib/architecture-adoption-decision-envelope.ts`
- Retained product artifact: `shared/lib/architecture-adoption-decision-envelope.ts`
- Source analysis reference: `architecture/02-experiments/2026-03-23-mini-swe-agent-adoption-decision-envelope-source-analysis.md`
- Adaptation decision reference: `architecture/02-experiments/2026-03-23-mini-swe-agent-adoption-decision-envelope-adaptation.md`
- Keep excluded baggage out of scope: mini-SWE-agent trajectory payloads; run config serialization; agent/model/environment metadata; full trajectory persistence logic
- Adopted artifact: `architecture/03-adopted/2026-03-23-mini-swe-agent-adoption-decision-envelope-lib-adopted.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-23-mini-swe-agent-adoption-decision-envelope-lib-adoption-decision.json`
- Source bounded result artifact: not retained in this legacy adopted slice.

## constraints
- Preserve explicit human review before any downstream execution or host integration.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code from this target artifact alone.
- Rollback boundary: Return to the adopted artifact if this target is not the right bounded slice.

## validation approach
- `decision_review`
- `ownership_boundary_check`
- `artifact_evidence_continuity_check`
- `decision_envelope_continuity_check`
- This legacy adopted slice does not retain a bounded-result/start/run chain, so validate against the adopted artifact, paired decision, and retained product artifact directly.
- Confirm the implementation target still matches the adopted artifact and paired decision artifact.
- Confirm the target remains one bounded slice and does not imply execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned shared library implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-23-mini-swe-agent-adoption-decision-envelope-lib-implementation-target.md`.
