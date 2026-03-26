# Active Mission

Last updated: 2026-03-24
Status: canonical

## Current Objective

Build and operate a revenue-generating personal AI workspace that continuously strengthens its own capabilities through mission-driven ingestion, proof-backed adoption, and persistent orchestration.

## What Usefulness Means Under This Objective

Useful means anything that materially improves:
- revenue and conversion
- execution speed and automation strength
- decision quality and strategic leverage
- cost efficiency and reliability
- orchestration quality and agent coordination
- capability-gap detection and self-improvement velocity

## Capability Lanes That Matter Most

1. Directive engine materialization - one reusable executable core that hosts can embed cleanly
   Architecture is currently the closest lane to this objective because the current mission is to improve the Engine itself.
2. Runtime operationalization (Runtime) - converting proven patterns into callable, bounded, measurable runtime behavior
3. Orchestration reliability (OpenClaw) - persistent, looping, memory-backed coordination across agents and sessions
4. Discovery as operational front door - mission-aware intake, routing, capability-gap detection, and review-cadence enforcement
5. Behavior-preserving transformation - same capability, better implementation (speed, cost, reliability, maintainability)
6. Evaluation quality - dimensional measurement (evaluators), not just binary gates
7. Unified runtime host (Mission Control) - coherent command surface, less fragmented tooling

## Known Capability Gaps (Open)

- gap: Canonical Directive engine surface only partially materialized
  risk: The first engine slice exists, but Directive Workspace behavior is still too distributed across host helpers, reference hosts, and Markdown-first operating assets, and the Engine/lane split is not yet deep enough to keep Discovery / Runtime / Architecture logic centered inside the Engine
  success condition: one executable engine owns substantially more source intake, routing, adaptation/improvement, proof, and integration state with explicit host-adapter boundaries while Discovery / Runtime / Architecture operate as clear Engine lanes rather than loose top-level features

## Recently Resolved Gaps

- gap: Discovery as actual front door for most work - RESOLVED 2026-03-23
  resolution: `check:discovery-front-door-coverage` now measures front-door routine usage from the live corpus. Current metrics are 22 queue entries total, 14 post-primary entries, 13 native-like post-primary entries, and 100% native-like post-primary intake linkage coverage. The only post-primary entry without intake linkage is a backfill (`al-parked-cli-anything`), so Discovery-first routine usage is now confirmed for native work.

- gap: OpenClaw to Discovery coordination - RESOLVED 2026-03-22
  resolution: Root helper plus dry-run checker are active, and `dw-openclaw-discovery-submission-flow` proves a real OpenClaw-originated candidate can enter the primary Discovery queue without bypass.

- gap: Architecture-to-Runtime handoff - RESOLVED 2026-03-22
  resolution: Formal handoff record created for autoresearch bounded-run pattern. All contract fields exercised.

- gap: Evaluator lane dimensional proof - RESOLVED 2026-03-22
  resolution: Backend test boilerplate consolidation uses dimensional evaluator with numeric before/after (20.6% line reduction, 16.9% byte reduction). First non-vacuous dimensional proof.

- gap: Discovery intake queue native usage - RESOLVED 2026-03-22
  resolution: 5 native primary-mode queue entries achieved (threshold: 5+). 14 total entries (5 native, 9 backfill). Three behavior-preserving transformation candidates processed end-to-end through native queue.

- gap: agent-lab legacy dependency - RESOLVED 2026-03-22
  resolution: OpenClaw root external-tool bridge migrated to `scripts/external-tools/` with no live runtime path into `workspace/agent-lab/orchestration`. Runtime-backed adapters now read from current source packs and host-backed lanes resolve through Mission Control or OpenClaw-owned state.
