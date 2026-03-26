# Runtime System Bundle 05: Import-Source Policy Alignment

Date: 2026-03-21
Owner: Directive Runtime
Status: completed

## Purpose

Stop the agent-pack import lane from bypassing Runtime source-pack classification policy.

## Problem

After the source-pack catalog was normalized, the backend import-pack service still had a private hardcoded default source list.

That caused two mismatches:
- omitted `sources` could still surface follow-up/reference material operationally
- explicit imports were not governed by one canonical Runtime-owned rule

## Changes

1. Added canonical Runtime policy:
   - `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\IMPORT_SOURCE_POLICY.json`
2. Declared three import availability modes:
   - `default_import`
   - `explicit_import_only`
   - `blocked`
3. Updated the backend import-pack lane to:
   - derive omitted-source defaults from the policy
   - allow explicit imports only when policy permits them
   - reject blocked sources with `source_blocked`
   - verify policy classification/activation against `source-packs/CATALOG.json`
4. Added host enforcement:
   - `npm run check:directive-import-source-policy`
   - expanded backend API proof for default, explicit, and blocked import cases

## Result

Runtime import behavior now follows product-owned policy instead of a hidden backend list:
- default imports: `agency-agents`, `skills-manager`
- explicit import only: `arscontexta`, `superpowers`, `software-design-philosophy-skill`
- blocked: `agent-orchestrator`, `impeccable`, `celtrix`

## Validation

- `npm run check:directive-import-source-policy`
- `npm run check:agents-import-packs-api-backend`
- `npm run check:ops-stack`

## Next

Open Runtime System Bundle 06:
- legacy live-runtime normalization for `agency-agents` and `desloppify`
