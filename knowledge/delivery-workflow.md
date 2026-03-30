---
id: 229d5478-f2f2-41a1-bd28-599e2639060e
title: Delivery Workflow
userId: 795edcca-fd18-4be3-8ba0-b86045af08ef
createdAt: '2026-03-07T16:07:41.303Z'
updatedAt: '2026-03-07T16:07:41.303Z'
tags:
  - workflow
  - process
---
# Delivery Workflow

System-boundary reference:
- `C:\Users\User\projects\directive-workspace\knowledge\doctrine.md`

## Standard Loop
Primary workflow reference:
- `C:\Users\User\projects\directive-workspace\knowledge\workflow.md`

Default loop (canonical 5-step fast path):
1. Capture once in Discovery.
2. Route by adoption target.
3. Prove only when the claim needs evidence.
4. Decide explicitly.
5. Integrate in the chosen track + sync Mission Control reports.

Escalate to the full split workflow only when the candidate is complex, cross-track, or being turned into a reusable contract/policy.

## Commands Used Often
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run check:directive-v0`
- `npm run check:directive-workspace-health`
- `npm run check:directive-integration-proof`
- `npm run check:ops-stack`

## Handoff Rules
- Update canonical docs when boundaries, decisions, or promotion rules change.
- Prefer one record when one record is enough.
- Keep quests concrete and tied to one track (Discovery, Architecture, Runtime, or runtime host) to avoid mixed ownership.
- Log reports with explicit pass/fail gates and artifact paths.
- Do not mark runtime integration complete from framework decision alone; require runtime proof.
- Treat stale adopt decisions without promotion task/proof as release blockers.
- Apply routing rule consistently: Runtime and Architecture are separated by adoption target, not source type.
