# 2026-04-02 - Standalone Scientify Host Consumption

## Slice

- CLAUDE roadmap slices: `era_b_b1_real_host_adapter_path`, `era_b_b2_host_acceptance_surface`
- Owning lane: `Runtime`
- Result: the standalone host now consumes the promoted Scientify callable through one bounded invoke adapter, with one durable host-consumption report and one focused acceptance checker

## What changed

- Added a thin standalone-host invoke adapter in [runtime-lane.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/runtime-lane.ts), exposed through [runtime.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/runtime.ts) and [cli.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/cli.ts).
- Added [check-standalone-scientify-host-consumption.ts](/C:/Users/User/projects/directive-workspace/scripts/check-standalone-scientify-host-consumption.ts) to prove the host path executes the promoted Scientify callable through [callable-execution.ts](/C:/Users/User/projects/directive-workspace/runtime/core/callable-execution.ts) without bypassing Runtime internals.
- Added the durable host-consumption report [2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json](/C:/Users/User/projects/directive-workspace/runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json) plus [report-standalone-scientify-host-consumption.ts](/C:/Users/User/projects/directive-workspace/scripts/report-standalone-scientify-host-consumption.ts).

## Resulting truth

- One promoted Runtime callable is now consumable through one bounded product-owned host path.
- The host path remains thin: it delegates execution to the shared Runtime executor and keeps promotion automation and automatic workflow advancement closed.
- Host acceptance for this exact path is now durable and reportable instead of living only as a transient checker result.

## Proof path

- `npm run check:standalone-scientify-host-consumption`
- `npm run check:standalone-scientify-host-adapter`
- `npm run report:standalone-scientify-host-consumption`

## Rollback

Revert:

- [runtime-lane.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/runtime-lane.ts)
- [runtime.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/runtime.ts)
- [cli.ts](/C:/Users/User/projects/directive-workspace/hosts/standalone-host/cli.ts)
- [check-standalone-scientify-host-consumption.ts](/C:/Users/User/projects/directive-workspace/scripts/check-standalone-scientify-host-consumption.ts)
- [report-standalone-scientify-host-consumption.ts](/C:/Users/User/projects/directive-workspace/scripts/report-standalone-scientify-host-consumption.ts)
- [2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json](/C:/Users/User/projects/directive-workspace/runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json)

## Stop-line

Stop at one bounded standalone-host invoke path and one one-case acceptance/report surface. Do not open registry acceptance, host parity, or automation in this slice.
