# Hermes Context Compaction Contract

Date: 2026-03-20
Track: Directive Architecture
Source slice: `2026-03-20-hermes-agent-implementation-slice-01.md`
Status: active architecture contract

## Intent

Define safe context compaction without breaking handoff fidelity.

## Compaction Boundary

Compaction is allowed only for:
- verbose trace text
- repetitive evidence blocks
- low-value formatting noise

Compaction is not allowed for:
- decision states
- adoption targets
- gate outcomes
- rollback instructions
- explicit owner/route assignments

## Required Retained Fields

Every compacted handoff must retain:
- `candidateId`
- `decisionState`
- `adoptionTarget`
- `nextAction`
- `riskNotes`
- `rollbackOrNoOp`

## Allowed Loss Envelope

Allowed loss:
- duplicated explanatory wording
- long raw logs after key evidence extraction

Disallowed loss:
- any field required above
- any contradiction signal
- any unresolved blocker reference

## Low-Confidence Fallback

If compaction confidence is low:
- emit uncompressed handoff
- set `compactionStatus = "bypass"`
- include reason in metadata

## Validation Rule

Compacted output is valid only if required retained fields are present and unchanged in meaning.
