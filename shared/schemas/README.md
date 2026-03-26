# Shared Schemas

This folder holds the canonical Directive Workspace contract schemas used by
Discovery, Architecture, Runtime, and host checks.

Current scope:
- architecture-contract artifacts plus Discovery operating-surface request schemas and the standalone-host runtime-profile schema
- schema-level validation and planning alignment
- bounded standalone reference-host import support, with broader host parity still incomplete

Current canonical artifacts:
- `intake-normalized-artifact.schema.json`
- `analysis-plan-artifact.schema.json`
- `experiment-design-artifact.schema.json`
- `integration-contract-artifact.schema.json`
- `proof-checklist-artifact.schema.json`
- `architecture-adoption-decision.schema.json`
- `analysis-evidence-artifact.schema.json`
- `citation-set-artifact.schema.json`
- `evaluation-support-artifact.schema.json`
- `discovery-intake-queue-entry.schema.json`
- `discovery-intake-transition-request.schema.json`
- `discovery-intake-lifecycle-sync-request.schema.json`
- `discovery-routing-record-request.schema.json`
- `discovery-completion-record-request.schema.json`
- `discovery-case-record-request.schema.json`
- `discovery-fast-path-record-request.schema.json`
- `discovery-submission-request.schema.json`
- `discovery-gap-worklist.schema.json`
- `phase-handoff-packet.schema.json`
- `architecture-mechanism-packet.schema.json`
- `mixed-value-source-partition.schema.json`
- `cross-source-synthesis-packet.schema.json`
- `generation-boundary-note.schema.json`
- `literature-monitoring-digest.schema.json`
- `literature-monitoring-degraded-state.schema.json`
- `openclaw-runtime-verification-signal.schema.json`
- `openclaw-maintenance-watchdog-signal.schema.json`
- `standalone-host-config.schema.json`

Stage-contract notes:
- the Paper2Code-derived handoff family is modeled as a canonical stage chain
- `intake -> analysis -> experiment design -> integration/proof`
- integration/proof templates may remain markdown-facing, but their minimum fields are also normalized as schemas here

Citation schema notes:
- citation `url` must be URI-formatted and match `^https?://`
- coverage state remains `complete|partial|missing`

Boundary:
- Mission Control runtime types still execute host behavior.
- These schemas are the architecture contract truth for artifact shape checks.
- Any runtime binding must be an explicit follow-up decision and remain fail-closed.

Host-neutral integration reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\README.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\examples\`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\host-integration-acceptance-report.schema.json`

Phase-isolation reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\phase-isolated-processing.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\phase-handoff-packet.md`

Mechanism-packet reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\architecture-mechanism-packet.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\architecture-mechanism-packet.md`

Cross-source synthesis reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\cross-source-synthesis-packet.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\cross-source-synthesis-packet.md`

Generation-boundary reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\self-improvement-generation-boundary.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\generation-boundary-note.md`

Literature-monitoring runtime reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\bounded-literature-monitoring-workflow.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\literature-monitoring-digest.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\literature-monitoring-degraded-state.md`

Standalone-host runtime reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\standalone-host-runtime-profile.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\standalone-host-api-auth-guard.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\standalone-host-sqlite-persistence-profile.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\standalone-host\standalone-host.config.example.json`

Architecture adoption reference:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\architecture-adoption-criteria.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\lib\architecture-adoption-artifacts.ts`
