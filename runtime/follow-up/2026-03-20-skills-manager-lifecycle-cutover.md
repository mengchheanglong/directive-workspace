# Skills-Manager Lifecycle Cutover

Date: 2026-03-20
Track: Directive Runtime
Type: skill lifecycle extraction
Status: completed

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\skills-manager`

## Why It Matters

`skills-manager` is useful because it treats skills as a managed surface instead of an unmanaged folder.

The value for Directive Workspace is not the desktop app as a required dependency.

The value is:
- skill library discipline
- deterministic root selection
- multi-tool sync policy
- update tracking for skill assets

## Directive Target

Primary:
- `Directive Runtime`

Secondary:
- `Directive Discovery`

## What To Keep

- canonical skill-root precedence rules
- project-skill vs central-library distinction
- explicit migration guidance when multiple skill ecosystems coexist
- skill inventory/update workflow ideas

## What Not To Keep

- the Tauri desktop app as product truth
- direct dependency on `~/.skills-manager`
- upstream UI/runtime code unless a bounded host need appears

## Follow-up

Completed on 2026-03-21 as:
- bounded Runtime skill-lifecycle import lane
- `Skills Lifecycle Operator` callable import-pack surface in Mission Control
- product-owned guard/profile/record bundle with rollback and host proof

Retained value:
- Runtime skill lifecycle rules
- Discovery intake/routing guidance for skill sources
- bounded host import path only; no desktop app runtime adoption

## Exit Condition

This source becomes removable when:
- the surviving skill lifecycle rules are product-owned
- no active Directive workflow relies on `C:\Users\User\.openclaw\workspace\agent-lab\tooling\skills-manager`

Current state:
- product-owned rules are in Directive Workspace
- active host follow-up is now the bounded callable `Skills Lifecycle Operator` import lane
