# Implementation Target: OpenMOSS Review Feedback Lib (2026-03-26)

## target
- Candidate id: `dw-src-openmoss-review-feedback-lib`
- Candidate name: OpenMOSS Review Feedback Lib
- Source adoption artifact: `architecture/03-adopted/2026-03-23-openmoss-review-feedback-lib-adopted.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-23-openmoss-review-feedback-lib-adoption-decision.json`
- Source bounded result artifact: not retained in this legacy adopted slice.
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopted`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize one bounded reuse of the adopted shared lib inside one live Directive Architecture path.
- Materialization basis: This is the code-level Architecture extraction that the earlier OpenMOSS work was still missing.

It does not adopt the OpenMOSS runtime.
It operationalizes the already-proven useful mechanism as product-owned code.

That improves Directive Workspace more directly than another contract-only slice because the system can now call one canonical helper instead of re-deriving the same behavior from Markdown.

## selected tactical slice
- Replace the synthetic review-resolution stub in shared/lib/architecture-result-adoption.ts with canonical lifecycle review feedback derived from shared/lib/lifecycle-review-feedback.ts.

## mechanical success criteria
- Adopted Architecture outputs resolve valid lifecycle feedback and transition requests instead of fake approved/operator placeholders.
- Product-materialized adopted slices resolve to promote_to_decision with decision_owner as the required role.
- Product-partial or planned-next adopted slices resolve to accept_with_follow_up without inventing invalid lifecycle state names.

## explicit limitations
- Do not change the retained adoption-decision artifact schema in this slice.
- Do not add runtime execution, host integration, or Runtime reopening from this target.
- Keep the change inside the Architecture adoption/materialization lane.

## scope (bounded)
- Keep this to one bounded Directive-owned implementation slice.
- Consume the adopted value directly instead of re-deriving it from source prose or host-local logic.
- Do not add runtime execution, host integration, or Runtime reopening from this target.

## inputs
- Primary adopted product artifact: `shared/lib/lifecycle-review-feedback.ts`
- Retained product artifact: `shared/lib/lifecycle-review-feedback.ts`
- Source analysis reference: `architecture/02-experiments/2026-03-23-openmoss-review-feedback-lib-source-analysis.md`
- Adaptation decision reference: `architecture/02-experiments/2026-03-23-openmoss-review-feedback-lib-adaptation.md`
- Keep excluded baggage out of scope: SQLAlchemy transaction wiring; database models and tables; FastAPI routing; OpenMOSS UI and leaderboard behavior
- Adopted artifact: `architecture/03-adopted/2026-03-23-openmoss-review-feedback-lib-adopted.md`
- Adoption decision artifact: `architecture/03-adopted/2026-03-23-openmoss-review-feedback-lib-adoption-decision.json`
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
- This legacy adopted slice does not retain a bounded-result/start/run chain, so validate against the adopted artifact, paired decision, and retained product artifact directly.
- Confirm the implementation target still matches the adopted artifact and paired decision artifact.
- Confirm the target remains one bounded slice and does not imply execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned shared library implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-23-openmoss-review-feedback-lib-implementation-target.md`.
