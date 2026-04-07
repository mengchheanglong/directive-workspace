# Directive Sources

This directory is the canonical raw-source surface for Directive Workspace.

It exists so Directive Workspace can stay source-adaptation-first without turning Discovery, Runtime, or Architecture into source warehouses.

What belongs here:
- raw repo snapshots kept for extraction or follow-up
- parked upstream source trees
- source notes for papers, talks, framework writeups, or other non-repo inputs

What does not belong here:
- Directive-owned contracts, schemas, templates, or policies
- Runtime follow-up, proof, promotion, or other lane-owned workflow artifacts
- Mission Control host reports or runtime state

Rule:
- `sources/intake/` holds source material still feeding active extraction/adaptation work
- `sources/deferred-or-rejected/` holds raw source material for candidates that were deferred, rejected, or parked
- Discovery, Runtime, and Architecture may reference this surface, then produce Directive-owned outputs in their own lanes

## Source Surface Inventory And Authority

Inside `sources/`, treat surfaces as follows:

- `01-intake/`
  - active raw-source intake surface
  - source material still feeding current or reopenable extraction, adaptation, or evaluation work
  - raw source authority only, not workflow authority

- `05-deferred-or-rejected/`
  - deferred, rejected, or historical raw-source corpus
  - retained for traceability and possible later reassessment
  - still raw source material, not lane-owned output

Authority rule:
- `sources/` is authoritative only as the raw-source surface
- it does not own Discovery queue state, Runtime workflow state, Architecture results, or mirrored state
- Discovery, Runtime, and Architecture may cite or read raw sources here, but must emit their own records, proofs, decisions, and evaluations in their own lane surfaces

What must stay in `sources/`:
- upstream repo snapshots
- raw paper, article, framework, or tool source material
- source notes that still describe upstream material rather than Directive-owned outputs

What must never be treated as source storage:
- Discovery intake, triage, routing, monitor, or queue artifacts
- Runtime follow-up, proof, promotion, registry, or runtime asset records
- Architecture experiments, adopted results, retained records, evaluations, contracts, schemas, templates, or policies
- host-generated output, engine-run output, or mirrored state

Growth rule:
- do not split or move source surfaces by momentum alone
- keep `sources/` focused on raw inputs and deferred raw-source history until a later bounded decision justifies structural change
