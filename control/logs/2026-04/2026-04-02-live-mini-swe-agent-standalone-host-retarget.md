# 2026-04-02 - live mini-swe-agent Standalone Host Retarget

## Slice

- Candidate: `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
- Owning lane: `Runtime`
- Move: retarget the case from the out-of-scope host to the repo-native standalone host and make the callable boundary explicit

## Repo truth used

- the case was the top Runtime loop-control target
- Runtime assistance reported:
  - `assistanceState = blocked_missing_callable_boundary`
  - `recommendedActionKind = clarify_callable_boundary`
- the retained Runtime value is explicitly callable/local-shareable rather than frontend-review-first
- the standalone host already exists as Directive Workspace's bounded local/shareable Runtime host surface without Mission Control

## Product result made real

- proposed host is now:
  - `Directive Workspace standalone host (hosts/standalone-host/)`
- the callable boundary is now explicit at:
  - `runtime/01-callable-integrations/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-callable-integration.ts`
- the canonical promotion-readiness/spec chain now points to the standalone host and callable boundary instead of the out-of-scope host

## Proof path

- `npm run check:directive-live-mini-swe-agent-runtime-callable`
- `npm run check:runtime-promotion-assistance`
- `npm run check:runtime-loop-control`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-promotion-readiness.md`

## Stop-line

Stop at the explicit callable-boundary and repo-native host retarget stop.

Host-facing promotion, host integration, runtime execution, and automation remain unopened after this slice.
