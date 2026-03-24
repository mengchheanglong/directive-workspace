# Directive Sources

This directory is the canonical raw-source surface for Directive Workspace.

It exists so Directive Workspace can stay source-adaptation-first without turning Architecture or Forge into source warehouses.

What belongs here:
- raw repo snapshots kept for extraction or follow-up
- parked upstream source trees
- source notes for papers, talks, framework writeups, or other non-repo inputs

What does not belong here:
- Directive-owned contracts, schemas, templates, or policies
- Forge promotion records or runtime proof artifacts
- Mission Control host reports or runtime state

Rule:
- `sources/intake/` holds source material still feeding active extraction/adaptation work
- `sources/deferred-or-rejected/` holds raw source material for candidates that were deferred, rejected, or parked
- Architecture and Forge should reference this surface, then produce Directive-owned outputs in their own tracks
