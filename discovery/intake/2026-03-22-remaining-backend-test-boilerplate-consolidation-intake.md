# Discovery Intake: Remaining Backend Test Boilerplate Consolidation

- Candidate id: dw-transform-remaining-backend-test-boilerplate
- Candidate name: Remaining Backend Test Boilerplate Consolidation
- Received at: 2026-03-22
- Source type: internal-signal
- Source reference: mission-control/scripts/check-{docs,notes,quests,reports,views}-api-backend.ts

## Mission Alignment

Runtime operationalization — maintainability and reliability of verification surface. Extends the proven withBackendTestEnv() pattern to the remaining 5 backend test scripts. Directly exercises BPT lane and creates the 5th native Discovery queue entry, closing the "Discovery queue native usage" capability gap.

## Addresses Known Capability Gap

- gap_id: gap-discovery-native-queue-usage
- gap description: Discovery intake queue has limited primary-mode operational history (target: 5+ native entries)
- This candidate is the 5th native queue entry, meeting the threshold

## Evidence

- Baseline: 5 files, 1,009 lines, 36,938 bytes
- Pattern: same waitForHealth/spawn boilerplate as the 9 automation scripts already consolidated
- Shared helper: backend-test-helper.ts withBackendTestEnv() (no modifications needed)
- Variations: 4 simple (no extra env), 1 with setup callback (docs — workspace dirs + OPENCLAW_SHARED_KNOWLEDGE_PATH)

## Routing

- Routing target: runtime
- Routing rationale: behavior-preserving transformation — live runtime capability, measurable improvement
