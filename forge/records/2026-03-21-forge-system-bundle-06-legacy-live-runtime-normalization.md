# Forge System Bundle 06: Legacy Live-Runtime Normalization

Date: 2026-03-21
Owner: Directive Forge
Status: completed

## Purpose

Stop `agency-agents` and `desloppify` from remaining silently live in the host without modern Forge lifecycle accounting.

## Problem

Both packs were already live under Mission Control host adapters before the current Forge proof/promotion/registry discipline existed.

That left two mismatches:
- `CATALOG.json` said they were `live_runtime`
- but Forge had no explicit record, proof, promotion, registry, or accounting entry for them

## Changes

1. Added canonical legacy normalization contract:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\legacy-live-runtime-guard.md`
2. Added the live-runtime accounting inventory:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\forge\LIVE_RUNTIME_ACCOUNTING.json`
3. Added a legacy promotion profile:
   - `legacy_live_runtime_guard/v1`
4. Normalized `agency-agents` with:
   - Forge record
   - proof record
   - promotion record
   - registry entry
5. Normalized `desloppify` with:
   - Forge record
   - proof record
   - promotion record
   - registry entry
6. Added host enforcement so every `live_runtime` pack must have declared lifecycle accounting.

## Keep/Normalize Table

| Candidate id | Previous state | Normalized state | Keep decision | Discard decision |
|---|---|---|---|---|
| `agency-agents` | live in host with no modern Forge accounting | `legacy_live_runtime_guard/v1` + explicit Forge proof/promotion/registry trail | keep bounded run-scoped specialist sync/rollback lane | discard any implication that the full upstream persona library is runtime truth |
| `desloppify` | live in host with no modern Forge accounting | `legacy_live_runtime_guard/v1` + explicit Forge proof/promotion/registry trail | keep bounded run-scoped quality utility prototype lane | discard any implication that upstream scoring output is Directive lifecycle truth |

## Result

Forge now has explicit lifecycle accounting for every `live_runtime` pack:
- `agency-agents`
- `desloppify`
- `promptfoo`
- `puppeteer`
- `skills-manager`

## Validation

- `npm run check:directive-live-runtime-accounting`
- `npm run check:directive-promotion-profile-catalog`
- `npm run check:directive-forge-records`
- `npm run check:directive-source-pack-catalog`
- `npm run check:directive-source-pack-readiness`
- `npm run check:ops-stack`

## Next

Wave 02 system cleanup is complete.

Next bounded candidate:
- `al-tooling-arscontexta`
