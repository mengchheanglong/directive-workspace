# Runtime Promotion Records

This folder holds host-facing promotion contracts for Runtime candidates.

Use:
- `shared/templates/promotion-record.md`
- `shared/contracts/runtime-to-host.md`
- `runtime/meta/PROMOTION_PROFILES.json`

Create a promotion record when a bounded host-facing manual promotion seam is explicitly open for that Runtime candidate.

Do not mark a candidate as accepted runtime state until the linked host gates and proof are explicit.

Pre-host manual promotion-record prerequisite work is allowed before this step only when it stays non-executing and proves:
- the promotion-readiness artifact exists
- the generated promotion specification exists
- `shared/contracts/runtime-to-host.md` exists
- linked Runtime record, proof, capability boundary, follow-up, routing, and callable-stub artifacts are present
- the candidate is still not promoted, not host-integrated, and not executing
- no live promotion record has been opened yet

That prerequisite proof does not itself create a promotion record and does not imply host acceptance or registry readiness.

Current bounded exception:
- `dw-source-scientify-research-workflow-plugin-2026-03-27` may now hold one manual standalone-host promotion record
- that record is still pre-registry, non-automated, non-executing, and non-integrated
- `dw-mission-openmoss-runtime-orchestration-2026-03-26` may now hold one manual Directive Workspace web-host promotion record
- that record is still pre-registry, non-automated, non-executing, and non-integrated

Rule:
- `Quality gate profile` selects the canonical promotion profile.
- `Promotion profile family`, `Proof shape`, and `Primary host checker` must match the selected entry in `PROMOTION_PROFILES.json`.

Current backlog:
- `runtime/07-promotion-records/2026-03-20-runtime-promotion-backlog.md`
