# Runtime Promotion-Readiness Artifact: Scientify Literature-Access Tool Bundle (2026-03-27)

## runtime capability boundary identity
- Candidate id: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- Candidate name: `Scientify Literature-Access Tool Bundle`
- Runtime capability boundary path: `runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md`
- Source Runtime proof artifact: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- Source Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
- Promotion-readiness decision: `approved_for_non_executing_promotion_readiness`
- Opened by: `directive-lead-implementer`
- Opened on: `2026-03-27`
- Current status: `promotion_readiness_opened`

## bounded runtime usefulness preserved
- Runtime objective: Reimplement Scientify's 4 literature-access tools (arxiv-search, arxiv-download, openalex-search, unpaywall-download) as Directive-owned callable runtime capability for automated literature discovery and retrieval.
- Proposed host: `Directive Workspace standalone host (hosts/standalone-host/)`
- Proposed runtime surface: reimplement
- Capability form: non-executing promotion-readiness artifact
- Execution state: bounded standalone-host descriptor implementation opened, not executing, not host-integrated, not promoted

## what is now explicit
- The bounded runtime capability boundary has been explicitly reviewed as a possible future promotion candidate.
- Host selection is now explicit at the current bounded stop: `Directive Workspace standalone host (hosts/standalone-host/)` is the truthful first host for this Runtime case because Scientify's retained value is a local/shareable callable literature-access bundle, and the standalone host already exists as Directive Workspace's bounded local/shareable Runtime host surface without Mission Control.
- Required proof items remain explicit:
  - mission-fit rationale recorded
  - routing rationale recorded
  - next bounded action chosen
  - bounded runtime record opened for the approved slice
- Required gates remain explicit:
  - `behavior_preservation`
  - `metric_improvement_or_equivalent_value`
  - `runtime_boundary_review`
- This artifact does not approve host-facing promotion, runtime execution, callable implementation, or host integration.

## standalone-host pre-promotion implementation slice
- Slice decision: `standalone_host_pre_promotion_slice_explicit`
- Slice artifact: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-pre-promotion-implementation-slice-01.md`
- Opened runtime-implementation slice:
  - `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-runtime-implementation-slice-01.md`
- Implementation result:
  - `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-runtime-implementation-slice-01-result.md`
- Why this slice is the correct first host boundary:
  - the retained Runtime value is a local/shareable callable bundle rather than a frontend-first review seam
  - the standalone host already exists as Directive Workspace's bounded local/shareable Runtime host surface
  - the slice stays non-executing by limiting host ownership to one read-only capability descriptor surface for the approved 4-tool bundle
- Runtime/Engine remain the owners of:
  - lifecycle truth
  - blocker judgment
  - the 4 Directive-owned literature-access modules and their contracts
  - legality of any later promotion, execution, host integration, callable rollout, or automation
- Standalone-host ownership in this slice:
  - one local/shareable descriptor surface for the Scientify literature-access bundle through the existing standalone-host CLI/API/read-model layer
  - visibility of candidate identity, runtime objective, execution state, blockers, linked artifacts, and approved tool/module references only
- Remaining blockers after making the host explicit:
  - `host_facing_promotion_unopened`
- Bounded conclusion: keep Scientify at `promotion_readiness_opened`, record the standalone-host descriptor slice as materially complete and worth keeping, and do not open host-facing promotion, runtime execution, host integration, callable rollout, or automation.

## validation boundary
- Validate against the bounded runtime capability boundary, Runtime proof artifact, Runtime v0 record, source follow-up record, and linked Discovery routing record only.
- Validate the host choice against the standalone-host boundary only: `hosts/standalone-host/README.md` and `hosts/standalone-host/EXPANSION_DIRECTION.md` establish the standalone host as Directive Workspace's bounded local/shareable Runtime host surface without Mission Control.
- Do not infer runtime readiness, host readiness, or automatic promotion from this artifact.
- A separate host-facing promotion record remains unopened and out of scope.

## rollback boundary
- Rollback: Revert proposed host selection to `pending_host_selection`, remove the standalone-host pre-promotion slice, implementation slice, and implementation-result references, and keep the candidate in follow-up status until a more truthful host target is available.
- No-op path: Leave the candidate routed with a follow-up stub only and do not materialize runtime execution yet.
- Review cadence: before any downstream execution or promotion

## artifact linkage
- Promotion-readiness artifact: `runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md`
- Implementation-result artifact: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-standalone-host-runtime-implementation-slice-01-result.md`
- Runtime capability boundary: `runtime/04-capability-boundaries/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-capability-boundary.md`
- Runtime proof artifact: `runtime/03-proof/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-proof.md`
- Runtime v0 record: `runtime/02-records/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-record.md`
- Source Runtime follow-up record: `runtime/follow-up/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-runtime-follow-up-record.md`
- Linked Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-routing-record.md`
