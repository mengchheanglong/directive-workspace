# Implementation Target: Agent-Lab Orchestration Allowlist Wave 04 (2026-03-30)

## target
- Candidate id: `al-src-agent-lab-orchestration-allowlist`
- Candidate name: Agent-Lab Orchestration Allowlist Wave 04
- Source adoption artifact: `architecture/03-adopted/2026-03-21-agent-lab-orchestration-allowlist-wave-04-adopted.md`
- Paired adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: `architecture/02-experiments/2026-03-21-orchestration-allowlist-contract-closure-slice-20.md`
- Usefulness level: `meta`
- Artifact type intent: `policy-contract-bundle`
- Final adoption status: `product_materialized`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one bounded Architecture materialization closure slice over the already-landed allowlist boundary outputs.
- Objective retained: Ratchet the existing source-pack curation allowlist contract, Runtime-facing template binding, Runtime source-pack description binding, and Architecture policy note into the canonical implementation chain without broadening the scope beyond the already-landed governance mechanism.
- Materialization basis: The shared contract, Runtime template/readme bindings, and Architecture policy note already exist as Directive-owned product outputs, but this legacy adopted slice has no implementation target or downstream Architecture lifecycle artifacts yet.

## source decision envelope
- Decision format: `legacy_adopted_markdown`
- Source completion status: `product_materialized`
- Source verification method: `legacy_host_checks`
- Source verification result: `pass`
- Source runtime threshold check: not recorded

## source adoption resolution
- Source verdict: `adopt`
- Source readiness passed: yes
- Source Runtime handoff required: no
- Source Runtime handoff rationale: none recorded
- Source artifact path: `shared/contracts/source-pack-curation-allowlist.md`
- Source primary evidence path: `architecture/05-reference-patterns/2026-03-21-agent-lab-orchestration-allowlist-policy.md`
- Source self-improvement category: `governance_boundary`
- Source self-improvement verification method: `contract_and_policy_check`
- Source self-improvement verification result: `pass`

### failed readiness checks
- none

## selected tactical slice
- Record the already-landed allowlist boundary bundle as one bounded product-owned Architecture implementation slice.
- Keep the retained mechanism limited to the explicit curation/export allowlist, ownership-path declaration, readiness-marker rule, excluded-baggage rule, and the existing Runtime-facing bindings.
- Do not add new governance surfaces or broaden the policy beyond what is already encoded in the landed contract/template/readme/policy outputs.

## mechanical success criteria
- One explicit implementation target can point at the already-landed allowlist contract/template/readme/policy outputs without inventing new product scope.
- Focused verification proves the landed outputs still exist, still align with the adopted rationale, and still pass the existing allowlist and Architecture contract checks.
- The target remains bounded to policy/contract materialization and does not imply Runtime activation, host ownership, or new execution surfaces.

## explicit limitations
- Stay within one legacy-adoption materialization slice.
- Do not add new contracts, schemas, templates, or host surfaces unless verification proves the existing outputs are broken.
- Do not broaden the allowlist rule into general source-pack redesign.
- Do not open Runtime execution, host-admin, planner, or structural-mapping work.

## scope (bounded)
- Keep this to one Architecture-owned implementation target over the already-landed allowlist boundary outputs.
- Stop at explicit implementation-chain materialization for the retained governance mechanism; do not reopen extraction or add new allowlist policy surfaces.

## inputs
- Primary adopted product artifact: `shared/contracts/source-pack-curation-allowlist.md`
- Runtime-facing template binding: `shared/templates/runtime-follow-up-record.md`
- Runtime source-pack surface description: `runtime/source-packs/README.md`
- Architecture policy note: `architecture/05-reference-patterns/2026-03-21-agent-lab-orchestration-allowlist-policy.md`
- Source experiment artifact: `architecture/02-experiments/2026-03-21-orchestration-allowlist-contract-closure-slice-20.md`
- Adoption artifact: `architecture/03-adopted/2026-03-21-agent-lab-orchestration-allowlist-wave-04-adopted.md`
- Existing focused checks: `npm run check:directive-orchestration-allowlist-contracts`; `npm run check:directive-architecture-contracts`

## constraints
- Preserve the current allowlist boundary exactly as a governance mechanism, not as a Runtime activation rule by itself.
- Keep Mission Control and OpenClaw as external integrations, not owners of this policy surface.
- Rollback boundary: Delete this implementation target and any paired downstream Architecture lifecycle artifacts, then continue from the adopted artifact if the legacy adoption should stay undocumented downstream.

## validation approach
- `decision_review`
- `directive_orchestration_allowlist_contracts`
- `directive_architecture_contracts`
- `existing_output_alignment`
- This legacy adopted slice does not require new product logic; validate that the already-landed outputs remain explicit, bounded, and check-backed.

## expected outcome
- One explicit Architecture implementation target that ratchets the already-landed allowlist boundary bundle into the canonical implementation chain without reconstructing the adoption story by hand.
- No new execution or host exposure change is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-21-agent-lab-orchestration-allowlist-wave-04-implementation-target.md`.
