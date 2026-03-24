# Puppeteer Browser Runtime Follow-up

Date: 2026-03-20
Track: Directive Forge
Type: browser runtime follow-up
Status: completed (bounded browser smoke lane promoted 2026-03-21)

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\puppeteer`

## Runtime Value To Evaluate

- browser automation
- JS-heavy extraction
- screenshot capture
- UI smoke checks

## Why It Matters

This is a clear Forge-type source:
- useful callable runtime capability
- little Architecture value beyond the generic wrapper boundary already captured

## Keep Rule

Keep:
- bounded browser task wrappers
- explicit output artifact discipline
- host-integrated smoke-check or capture use cases

Do not keep:
- upstream repo as product truth
- every Puppeteer feature surface
- browser download/runtime assumptions beyond actual host need

## Exit Condition

This source becomes removable when:
- any retained browser wrapper is re-homed into Forge/host ownership
- no active workflow needs `C:\Users\User\.openclaw\workspace\agent-lab\tooling\puppeteer`

## Current Closure

- bounded browser smoke wrapper is now re-homed through Mission Control host scripts:
  - `C:\Users\User\.openclaw\workspace\mission-control\scripts\run-ui-smoke.ts`
  - `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-ui-smoke.ts`
- Forge promotion/proof artifacts now exist for the bounded browser lane under `directive-workspace/forge`
