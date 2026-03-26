# Directive Workspace Migration Slices

Status: active  
Last updated: 2026-03-19

## Goal

Separate Directive Workspace from Mission Control as a standalone product root while keeping Mission Control as the first host.

## Slice 1

Objective:
- create the standalone product root
- establish product ownership docs
- copy canonical Directive doctrine into the new root

Status:
- complete

## Slice 2

Objective:
- create `discovery/` as the real front door
- create track-owned `runtime/`, `architecture/`, `hosts/`, and `shared/` surfaces
- establish shared contracts and templates

Status:
- complete

## Slice 3

Objective:
- switch canonical reading behavior to prefer the new product root where safe
- keep legacy locations as compatibility surfaces during migration

Status:
- complete

Completed in this slice:
- Mission Control now prefers `workspace/directive-workspace/architecture` and falls back to legacy `workspace/architecture-lab`

## Slice 4

Objective:
- move historical `architecture-lab` contents into `directive-workspace/architecture`
- leave a redirect note at the old path
- verify Mission Control overview and any file readers still work

Status:
- complete

Completed in this slice:
- historical `architecture-lab` contents moved into `directive-workspace/architecture`
- old `architecture-lab` path converted into redirect-only compatibility surface

## Slice 5

Objective:
- decide whether host-agnostic Runtime core logic should begin moving out of Mission Control
- keep host-specific runtime code in Mission Control unless there is a concrete multi-host need

Status:
- complete

Completed in this slice:
- canonical Runtime core modules now live under `directive-workspace/runtime/core`
- Mission Control keeps host-local mirrors for the current Runtime core modules
- `npm run check:directive-runtime-sync` enforces mirror alignment
- host-specific runtime code remains in Mission Control

## Current State

Migration status:
- structural separation is complete
- standalone product ownership is complete
- Mission Control is operating as the first host
- Architecture content has been moved into the standalone root
- Runtime core extraction is complete at the current safe boundary

Remaining work is polish, not migration:
- reduce the last small set of Turbopack broad-pattern warnings in Mission Control
- keep Discovery/Runtime/Architecture workflow hardening moving forward
- revisit full Runtime runtime extraction only if there is a real multi-host need

## Rules

- `agent-lab` stays untouched in this migration
- Discovery is the front door for all new intake from this point forward
- Runtime belongs to Directive Workspace as a product track
- Mission Control remains the current Runtime runtime host
