# Adopted - Scientify Mixed-Value Partition

Date: 2026-03-23
Track: Architecture
Type: adopted mixed-value source improvement

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Forge threshold check: `yes` - the retained value improves Directive Workspace's source-routing and split-decision quality even if no runtime surface is built

## Problem

Directive Workspace had become better at packet emission, packet consumption, and packet-aware review, but it still lacked a clean operating surface for mixed-value sources where packet reuse is helpful but partial and the Architecture/Forge split must be made explicitly.

Scientify is the clearest example because it contains:
- staged evidence-backed research workflow value
- promotion-quality gating and validation-state logic
- plugin runtime, scheduled jobs, MCP delivery, and execution-stack behavior

## Sources and packet inputs

- Primary source:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\scientify\README.md`
- Historical retained value:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-scientify-slice-6-adopted-planned-next.md`
- Packet inputs reused:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-23-paper2code-gpt-researcher-mechanism-packet.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-23-paper2code-gpt-researcher-cross-source-synthesis-packet.md`

## What was adopted

1. mixed-value partition contract:
   - `shared/contracts/mixed-value-source-partition.md`
2. mixed-value partition template:
   - `shared/templates/mixed-value-source-partition.md`
3. mixed-value partition schema:
   - `shared/schemas/mixed-value-source-partition.schema.json`

## What the system gained

The system can now say, for one source:
- what retained value is already covered by existing packets
- what still needs fresh source re-analysis
- what should stay in Architecture now
- what should become a bounded Forge candidate later
- what should be excluded as baggage

## Forge handoff transition

- Forge handoff: `yes`
- Forge handoff ref:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-23-scientify-literature-monitoring-forge-handoff.md`

The first bounded runtime candidate selected from the partition is:
- scheduled literature monitoring with digest delivery

## Self-improvement evidence

- Claim: Directive Workspace now handles mixed-value sources more accurately because it can distinguish partial packet reuse from fresh source re-analysis and separate Architecture-retained value from Forge candidates explicitly.
- Mechanism: this slice used Scientify plus the existing evidence-backed stage-synthesis packets to create a mixed-value partition contract/template/schema.
- Baseline observation: before this slice, packet reuse and Architecture-to-Forge handoff existed, but no explicit surface described partial packet coverage and mixed-value partition decisions together.
- Expected effect: future ambiguous sources can be processed without collapsing into either full historical reconstruction or premature whole-source Forge routing.
- Verification method: `next_cycle_comparison`
- Category: `routing_quality`

## Rollback

- remove the contract/template/schema
- revert the workflow and contract integration changes
- remove this adopted record
