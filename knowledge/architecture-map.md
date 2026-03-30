---
id: def0ff99-1160-42a0-a210-47cd0394efde
title: Architecture Map
userId: 795edcca-fd18-4be3-8ba0-b86045af08ef
createdAt: '2026-03-07T16:07:41.302Z'
updatedAt: '2026-03-24T00:00:00.000Z'
tags:
  - architecture
  - system
---
# Architecture Map

Primary reference:
- `C:\Users\User\projects\directive-workspace\knowledge\doctrine.md`

## System Topology

Doctrine:
- Directive Workspace is an objective-driven capability evolution system that converts breakthroughs into mission-relevant usefulness.
- The operating loop (Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report) decomposes into three Engine lanes separated by adoption target, not source type.

### Mission Control
- Active runtime host and unified command surface.
- Owns runtime code, APIs, health gates, nightly/canary checks, and production behavior.
- Hosts Runtime runtime behavior but does not own Runtime as a product concept.

### Directive Workspace (the product)
- Objective-driven capability evolution system with one Engine and three main Engine lanes:
  - Directive Discovery - mission-aware intake queue, routing, and capability-gap detection
  - Directive Runtime - bounded runtime operationalization and behavior-preserving transformation
  - Directive Architecture - reusable internal operating logic (org-as-code)
- Owns doctrine, contracts, decision model, Engine structure, and capability evolution logic.
- Current status: standalone ownership complete, runtime hosted through Mission Control.

### OpenClaw
- Persistent orchestration layer.
- Coordinates memory-backed agent and session behavior.
- Owns OpenClaw-native rescue/recovery surfaces under `C:\Users\User\.openclaw\workspace\openclaw\`.

### agent-lab
- Source catalog of external repos/tools used as reference inputs.
- Not a direct runtime execution surface.
- Current role: temporary extraction quarry while Directive Workspace re-homes useful skills, patterns, and contracts.
- Planned end state: archive or delete after cutover from `C:\Users\User\.openclaw\workspace\agent-lab`.

### Directive Architecture surface
- target product-owned surface: `C:\Users\User\projects\directive-workspace\architecture`
- legacy redirect path: `C:\Users\User\.openclaw\workspace\architecture-lab`
- current role: reusable operating-code layer — contracts, schemas, templates, policies, bounded experiments, adopted patterns, and historical records.
- does not own OpenClaw-native rescue role definitions

### Directive Runtime surface
- target product-owned surface: `C:\Users\User\projects\directive-workspace\runtime`
- current role: bounded runtime operationalization and behavior-preserving transformation — records, contracts, core host-agnostic logic, promotion semantics, and dimensional evaluator proof.
- current lifecycle: `follow-up -> records -> promotion-records -> registry`
- current runtime host: `C:\Users\User\.openclaw\workspace\mission-control`

### knowledge
- Canonical docs for boundary, workflow, and governance rules.

## Status Model
- `framework_status`: intake -> analyzed -> experimenting -> evaluated -> decided
- `runtime_status`: none -> planned -> implementing -> callable -> parked -> removed

Integration is complete only when runtime is callable with proof.

## Decision Rules
- No blind external repo adoption into runtime.
- Framework-adopted patterns in Directive Architecture do not automatically become runtime-callable assets.
- Discovery is the operational front door for intake/triage/routing; it is not a delivery runtime.
- Build order may implement Discovery module later, but flow order still starts at Discovery.
- Adopted callable capabilities require promotion contract fields and gates before callable status.
- Runtime changes always go through Mission Control verification gates.
