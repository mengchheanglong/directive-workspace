# Adopted — Arscontexta Assembly Over Creation

Date: 2026-03-23
Track: Architecture
Type: adopted source-driven improvement

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: `yes` — this mechanism is still valuable without a runtime surface because it improves how Architecture preserves and reuses adapted source value

## Problem

Directive Workspace can now analyze and adapt sources more explicitly, but the output of a completed source-driven slice is still too heavy.
Future Architecture work often has to reopen full source-analysis and adaptation records instead of assembling from a smaller reusable building block.

That weakens:
- adaptation reuse
- self-improvement compounding
- packet-based continuity across Architecture slices

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\arscontexta\methodology\intermediate packets enable assembly over creation.md`
- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\arscontexta\methodology\session outputs are packets for future selves.md`

## What was adopted

Directive Workspace now has a reusable mechanism-packet layer for source-driven Architecture work:

1. `shared/contracts/architecture-mechanism-packet.md`
2. `shared/templates/architecture-mechanism-packet.md`
3. `shared/schemas/architecture-mechanism-packet.schema.json`

This packet is the reusable condensed output of a source-driven Architecture slice.
It does not replace source-analysis or adaptation records.
It preserves the adapted/improved mechanism in a form future Architecture work can assemble from directly.

## Why this is the right adaptation

The original source argues for packet-based assembly across sessions.
Directive Workspace does not need the full PKM/archive framing.
It needs a bounded product-owned packet for reusable Architecture mechanisms.

The adapted form:
- removes archive/vault baggage
- binds packet contents to adapted/improved Directive value
- requires excluded baggage and product artifact refs
- makes the packet compatible with phase isolation and transformation-artifact gating

## Improvement beyond the source

Directive improved the source mechanism by:
- tying packet quality to transformed Directive-owned assets
- making packet contents explicit about Runtime threshold and meta-usefulness
- adding a machine-readable schema for future validation
- making packets serve Architecture self-improvement rather than general session capture

## Why this improves the Architecture system

This is a direct Architecture-system improvement because it changes what a successful source-driven slice leaves behind.

Before:
- source-driven slices produced analysis/adaptation/adopted records only
- reuse required reopening large records

After:
- source-driven slices can emit a smaller reusable mechanism packet
- later Architecture work can assemble from the packet directly
- phase-isolated execution now has a stronger long-term output than only a temporary handoff packet

## Integration

- `knowledge/workflow.md`
- `shared/contracts/source-analysis-contract.md`
- `shared/contracts/adaptation-decision-contract.md`
- `shared/contracts/phase-isolated-processing.md`
- `shared/contracts/transformation-artifact-gate.md`
- `shared/schemas/README.md`
- `shared/lib/README.md`

## Self-improvement evidence

- Claim: Future Architecture source-driven slices will preserve more reusable value because adapted mechanisms can now be condensed into packets for later assembly instead of being trapped inside long historical records.
- Mechanism: `architecture-mechanism-packet.md` plus its template/schema provide a standard reusable output for source-driven Architecture work.
- Verification method: the next source-driven Architecture slice should be able to consume or emit a mechanism packet without reopening the whole prior source chain.
- Expected effect: better adaptation reuse, better continuity across slices, and stronger compounding of Architecture self-improvement work.
- Category: `adaptation_quality`

## Rollback

If this mechanism proves redundant or unused:
- remove `shared/contracts/architecture-mechanism-packet.md`
- remove `shared/templates/architecture-mechanism-packet.md`
- remove `shared/schemas/architecture-mechanism-packet.schema.json`
- revert the workflow/contract/readme/changelog references
