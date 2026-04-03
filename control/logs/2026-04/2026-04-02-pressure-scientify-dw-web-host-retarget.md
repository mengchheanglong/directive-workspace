# 2026-04-02 - Scientify Pressure DW Web-Host Retarget

## Slice

- Candidate: `dw-pressure-scientify-2026-03-25`
- Owning lane: `Runtime`
- Move: retarget the case from `pending_host_selection` to the repo-native `Directive Workspace web host (frontend/ + hosts/web-host/)`

## Repo truth used

- `runtime-loop-control` selected this exact case as the top bounded Runtime follow-through target
- `runtime-promotion-assistance` showed the only missing prerequisite was:
  - `proposedHost`
- the shared Runtime-to-host contract already permits the Directive Workspace web host as a bounded host target
- adjacent repo-native DW web-host manual promotion patterns already existed on OpenMOSS, Puppeteer, and Scientify live-pressure cases

## Product result made real

- the case no longer depends on `pending_host_selection`
- canonical Runtime truth now records:
  - `proposedHost = Directive Workspace web host (frontend/ + hosts/web-host/)`
- the next bounded work can move to the explicit DW web-host seam-review preparation family

## Proof path

- `npm run check:directive-pressure-scientify-dw-web-host-retarget`
- `npm run check:runtime-promotion-assistance`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-25-dw-pressure-scientify-2026-03-25-promotion-readiness.md`

## Stop-line

Stop at repo-native host-target clarification only.

Promotion, registry acceptance, host integration, runtime execution, and automation remain unopened after this slice.
