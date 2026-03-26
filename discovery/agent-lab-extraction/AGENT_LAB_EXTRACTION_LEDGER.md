# Agent-Lab Extraction Ledger

Last updated: 2026-03-20

Purpose:
- inventory all meaningful `agent-lab` assets
- assign each asset to an adoption target
- track whether the useful value has been extracted into Directive Workspace
- define what can be dropped without regret

Decision classes:
- `architecture-extract`
- `runtime-extract`
- `discovery-extract`
- `both`
- `reference-only`
- `drop`

Retirement status:
- `not-started`
- `partially-extracted`
- `extracted`
- `safe-to-drop`

## Core Surfaces

| Source | Current role | Useful value | Directive target | Extraction form | Retirement status | Notes |
|---|---|---|---|---|---|---|
| `agent-lab/orchestration/CAPABILITY_REGISTRY.json` | Capability catalog and selection source | Registry vocabulary, capability metadata shape, admission semantics | `Directive Runtime` + `Directive Discovery` | contract + registry model | `partially-extracted` | Mapped in `discovery/reference/2026-03-20-agent-lab-orchestration-source-map.md`; next step is product-owned registry vocabulary. |
| `agent-lab/orchestration/contracts/external-tool-run.contract.schema.json` | External tool run contract | Safe external tool invocation contract | `Directive Runtime` | interface contract | `partially-extracted` | Re-homed as `shared/contracts/runtime-external-run-envelope.md`. |
| `agent-lab/orchestration/adapters/*` | Tool-specific curation/launch adapters | Wrapper patterns, curation stages, adapter boundaries | `Directive Runtime` + `Directive Architecture` | wrapper + pattern docs | `partially-extracted` | Extraction intent recorded in `runtime/follow-up/2026-03-20-agent-lab-orchestration-cutover.md`; curation/export allowlist boundary is now normalized in `shared/contracts/source-pack-curation-allowlist.md`, while broader adapter-runtime extraction remains partial. |
| `agent-lab/orchestration/scripts/*` | Local orchestration and health scripts | Operational runbook patterns, health checks, start/stop discipline | `Directive Runtime` + `Directive Discovery` | runbook + utility extraction | `partially-extracted` | Routed in `discovery/reference/2026-03-20-agent-lab-orchestration-source-map.md`; preserve only surviving runbook value. |
| `agent-lab/orchestration/test-contracts/*` | Contract examples | Example fixtures and verification shape | `Directive Runtime` | test fixture pattern | `reference-only` | Useful as reference while Runtime contracts harden. |
| `agent-lab/orchestration/test-artifacts/*` | Historical runs | Evidence of prior behavior | `Directive Discovery` | historical reference | `reference-only` | Do not migrate raw artifacts unless needed for proof. |
| `agent-lab/orchestration/node_modules/*` | Installed dependencies | none | none | excluded baggage | `safe-to-drop` | Never migrate vendored dependencies. |
| `agent-lab/logs/*` | Local logs | none | none | excluded baggage | `safe-to-drop` | No product value. |

## Active Tooling

| Source | Current role | Useful value | Directive target | Extraction form | Retirement status | Notes |
|---|---|---|---|---|---|---|
| `agent-lab/tooling/agency-agents` | Specialist agent profile library | Reusable agent role definitions and operating prompts | `Directive Runtime` | skill pack | `extracted` | Runtime-owned source pack is active at `runtime/source-packs/agency-agents` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/agent-orchestrator` | Multi-agent execution/orchestration | Supervision and orchestration patterns | `both` | workflow rule + callable wrapper | `extracted` | Architecture/Runtime split recorded and Runtime-owned source pack is active at `runtime/source-packs/agent-orchestrator` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/arscontexta` | Context architecture patterns | Long-lived memory and context navigation patterns | `Directive Architecture` + `Directive Runtime` | architecture pattern + source pack | `extracted` | Architecture reference pattern is re-homed and Runtime-owned source pack is active at `runtime/source-packs/arscontexta` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/promptfoo` | Eval and red-team tooling | Evaluation harness patterns and quality checks | `Directive Runtime` + `Directive Architecture` | evaluation method + source pack | `extracted` | Architecture evaluation patterns are re-homed and Runtime-owned source pack is active at `runtime/source-packs/promptfoo` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/puppeteer` | Browser automation backend | Browser-capable host wrapper pattern | `Directive Runtime` | runtime follow-up candidate + source pack | `extracted` | Runtime runtime follow-up is recorded and Runtime-owned source pack is active at `runtime/source-packs/puppeteer` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/scripts` | Utility scripts | Reusable local operator helpers | `Directive Discovery` + `Directive Runtime` | utility extraction + source pack | `extracted` | Re-homed as Discovery reference source map and Runtime-owned source pack is active at `runtime/source-packs/scripts` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/skills-manager` | Skill lifecycle tooling | Skill inventory and lifecycle management logic | `Directive Runtime` + `Directive Discovery` | workflow rule + utility extraction | `extracted` | Runtime-owned source pack is active at `runtime/source-packs/skills-manager` with `SOURCE_PACK_READY.md` (2026-03-20); Discovery source map already re-homed. |
| `agent-lab/tooling/software-design-philosophy-skill` | Coding/review skill | Prompt/skill content | `Directive Runtime` | skill pack | `extracted` | Runtime-owned source pack is active at `runtime/source-packs/software-design-philosophy-skill` with `SOURCE_PACK_READY.md` (2026-03-20). |
| `agent-lab/tooling/superpowers` | Workflow discipline patterns | Planning/verification discipline patterns + callable pack destination | `Directive Architecture` + `Directive Runtime` | workflow rule + source pack | `extracted` | Architecture pattern re-homed and Runtime-owned source pack is active at `runtime/source-packs/superpowers` with `SOURCE_PACK_READY.md` (2026-03-20). |

## Parked Tooling

| Source | Current role | Useful value | Directive target | Extraction form | Retirement status | Notes |
|---|---|---|---|---|---|---|
| `agent-lab/tooling-parked/autoresearch` | Parked after value extraction | Bounded autonomous experiment loop | `both` | Architecture pattern + Runtime follow-up | `extracted` | Reanalysis Bundle 01 (2026-03-20) confirms delta-first handling and lane split remains valid; runtime host path audit is now clear. |
| `agent-lab/tooling-parked/Celtrix` | Parked scaffolding source | Stack-aware scaffolding intake checklist + callable pack destination | `Directive Discovery` + `Directive Architecture` + `Directive Runtime` | checklist pattern + source pack | `extracted` | Reanalysis Bundle 02 (2026-03-20) confirms Discovery-first checklist usage with Architecture alignment; Runtime source pack remains active. |
| `agent-lab/tooling-parked/CLI-Anything` | Deferred command mediation | Safety-scoped command mediation concept | `Directive Runtime` | runtime follow-up candidate | `partially-extracted` | Reanalysis Bundle 03 (2026-03-20) keeps this deferred and adds explicit re-entry conditions (mediated-command contract + approval policy + rollback test). |
| `agent-lab/tooling-parked/CodeGraphContext` | Deferred code graph source | Code graph and context compression patterns | `Directive Architecture` | reference pattern + bounded experiment | `extracted` | Reanalysis Bundle 01 (2026-03-20) promotes this to an explicit Architecture bounded experiment slice while preserving no-runtime-import rule. |
| `agent-lab/tooling-parked/desloppify` | Quality helper | Prompt/output cleanup pattern | `Directive Runtime` | utility extraction | `extracted` | Reanalysis Bundle 01 (2026-03-20) upgrades this to `accept-for-runtime-follow-up` with strict helper-only boundary and rollback/no-op path. |
| `agent-lab/tooling-parked/hermes-agent` | Parked after pattern extraction | Context-compaction contract, cache breakpoint helper, skill index generation | `Directive Architecture` + `Directive Runtime` | contract + utility extraction | `partially-extracted` | Reanalysis Bundle 02 (2026-03-20) routes this to a bounded Architecture contract experiment with optional Runtime follow-up only. |
| `agent-lab/tooling-parked/impeccable` | Deferred skill pack | Guardrail and prompt-shaping ideas + callable pack destination | `Directive Architecture` + `Directive Runtime` | reference note + source pack | `extracted` | Reanalysis Bundle 02 (2026-03-20) upgrades this to `accept-for-architecture` policy usage; no runtime dependency introduced. |
| `agent-lab/tooling-unclassified/plane` | Unclassified PM platform | Adapter-target boundary rule | `Directive Discovery` + `Directive Architecture` | boundary rule | `extracted` | Reanalysis Bundle 03 (2026-03-20) locks this as `knowledge-only` with monitor trigger conditions. |

## Extraction Rules

- Never migrate `node_modules`, raw logs, or generated test artifacts.
- Never create a live Directive Workspace dependency on `agent-lab` paths.
- A useful component is considered extracted only when it has a product-owned home in:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\discovery`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\runtime`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture`
- If the value is already represented in Directive Workspace, record that explicitly and mark the original source `safe-to-drop` only after no active workflow still references the `agent-lab` path.
