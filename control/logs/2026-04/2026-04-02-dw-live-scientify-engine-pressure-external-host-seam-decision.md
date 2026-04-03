# 2026-04-02 - Scientify External-Host Runtime Seam Decision

## Slice

- Owning lane: `Runtime`
- Case: `dw-live-scientify-engine-pressure-2026-03-24`
- Result: keep one-case external-host Runtime promotion work closed for now

## Repo truth

- `dw-live-scientify-engine-pressure-2026-03-24` is the strongest single reopen candidate inside the parked Runtime promotion-readiness cluster.
- `npm run check:runtime-promotion-assistance` proves that this case is uniquely stronger than the rest of the cluster:
  - assistance state: `ready_but_external_host_candidate`
  - recommended action: `keep_parked_external_host_candidate`
  - missing prerequisites: none
- Focused Runtime state proves the remaining blocker is genuinely host scope, not missing Runtime artifacts:
  - promotion-readiness artifact exists
  - promotion specification exists
  - Runtime record, proof, capability boundary, follow-up, and routing artifacts exist
  - current blockers are `runtime_implementation_unopened` and `host_facing_promotion_unopened`
  - proposed host is explicit: `mission-control`
- The remaining boundary is not ordinary pre-host incompleteness. It is that the host is external.

## Why the seam stays closed

- Current repo doctrine still says:
  - Mission Control remains an external integration
  - broad host integration remains intentionally closed
  - runtime execution remains intentionally closed
  - promotion automation remains intentionally closed
- Current bounded manual host-loading seams are explicitly limited to:
  - `dw-source-scientify-research-workflow-plugin-2026-03-27` on the Directive Workspace standalone host
  - `dw-mission-openmoss-runtime-orchestration-2026-03-26` on the Directive Workspace web host
- The repo has explicit bounded guard contracts for those repo-native seams:
  - `shared/contracts/standalone-scientify-runtime-promotion-guard.md`
  - `shared/contracts/openmoss-dw-web-host-runtime-promotion-guard.md`
- The repo does not yet have the equivalent bounded Mission Control external-host promotion guard, profile family, or primary host checker for this case.
- Opening the seam now would therefore overstate repo truth and risk implicitly authorizing broader external-host Runtime work rather than one narrow manual case.

## Decision

- Keep one-case external-host Runtime promotion work for `dw-live-scientify-engine-pressure-2026-03-24` closed.
- Keep the case parked as the top external-host candidate only.
- Do not reopen any other Runtime case in this slice.

## Explicit non-authorizations

This decision does not authorize:

- Mission Control host integration
- broad external-host Runtime work
- runtime execution
- promotion automation
- a generalized external-host promotion framework

## Exact reopen trigger

Reopen this seam later only if a separate bounded decision first establishes one explicit Mission Control external-host promotion contract for this case, including:

- one-case-only scope
- one explicit bounded guard artifact
- one explicit primary host checker
- one explicit statement that execution, automation, and broad host integration remain closed

## Proof path

- `npm run check:runtime-promotion-assistance`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- `npm run check`

## Rollback

- Remove this log only.

## Stop-line

Stop once the keep-closed decision is explicit. Do not implement Mission Control integration, host-facing promotion, runtime execution, or automation in this slice.
