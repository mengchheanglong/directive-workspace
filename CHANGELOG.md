# Changelog

## 2026-03-24

### Changed
- aligned the package surface, inventory, doctrine, and focused engine checks to the Engine hierarchy now governed by `Directive Workspace -> Engine -> Discovery/Runtime/Architecture lanes`, removing the stale peer `profiles/` surface and treating the three lanes as Engine-owned operating lanes
- restored the full governing workflow to `Source -> Analyze -> Route -> Extract -> Adapt -> Improve -> Prove -> Decide -> Integrate + Report`, then extended the executable Engine with first-class analysis, extraction, adaptation, improvement, decision, and report planning artifacts so the runtime shape no longer stops at proof/integration planning alone

## 2026-03-23

### Changed
- separated the first engine slice from Discovery / Architecture / Runtime policy by introducing `DirectiveEngineProfile` in `engine/` plus a separate `profiles/directive-workspace.ts` feature-profile layer, so hosts can keep the engine stable while tailoring track behavior to their own objective without rewriting the kernel
- materialized the first canonical engine slice under `engine/` with `DirectiveEngine`, a product-owned store boundary, and one executable source -> mission -> routing -> proof-plan -> integration-proposal flow, then aligned the root package/inventory/check direction around that kernel instead of leaving `./engine` as a placeholder export
- corrected product-direction drift in doctrine/planning docs so Directive Workspace now explicitly centers the missing executable engine kernel instead of treating standalone hosts, Mission Control integration, or Markdown-first assets as the core system
- strengthened the standalone Runtime local/shareable lane with canonical `runtime-proof-bundle-writer.ts`, a new standalone proof CLI/API flow, bootstrap/examples, overview accounting, and proof-existence enforcement on promotion/registry writes, so outside users can now generate real Runtime proof artifacts locally instead of advancing with placeholder proof paths
- added canonical `runtime-transformation-proof-writer.ts` and `runtime-transformation-record-writer.ts` plus standalone-host CLI/API/bootstrap coverage and enforcement, so the local/shareable Runtime lane now covers product-owned transformation proof and transformation record flows instead of leaving that slice as templates and historical records only
- extended the standalone Runtime local/shareable lane from follow-up-and-record only to the full bounded Runtime artifact lifecycle through canonical promotion-record and registry-entry writers, new standalone CLI/API routes, bootstrap examples, and expanded checks, so outside users can now carry a local Runtime candidate through follow-up, execution record, promotion, registry, and overview without Mission Control while still staying short of broad Runtime runtime parity
- expanded the standalone reference host with a first bounded Runtime-side local workflow lane through `hosts/standalone-host/runtime.ts`, new Runtime CLI/API commands, bootstrap/examples, and a dedicated checker, so outside GitHub/local users can now write Runtime follow-up/record artifacts and read Runtime overview state without Mission Control while still keeping the host well short of full Runtime runtime parity
- added a standalone-host bootstrap/init lane through `hosts/standalone-host/bootstrap.ts`, the `init` CLI command, and a dedicated checker, so outside GitHub/local users can scaffold a usable Directive root, config, and starter Discovery input in one step instead of hand-assembling internal folders
- added an optional product-owned SQLite persistence lane to the standalone reference host through `hosts/standalone-host/persistence.ts`, config/schema support, and a dedicated checker, so Directive Workspace now has a stronger standalone ledger/index without borrowing Mission Control's database layer or replacing canonical filesystem artifacts
- added an optional static-bearer auth boundary to the standalone reference API host through `auth` config support, `/api/*` guard enforcement, and a dedicated auth checker, so the product-owned reference server no longer has to remain fully open when used beyond throwaway local testing
- extended the standalone reference host with `hosts/standalone-host/config.ts`, `standalone-host.config.example.json`, and persisted `status.json` / `access-log.jsonl` / `boot-log.jsonl` runtime artifacts, so Directive Workspace now has a config-driven reference API host profile without claiming a deployed standalone runtime
- extended the product-owned standalone reference host with `hosts/standalone-host/server.ts` plus the `serve` CLI command and root `./standalone-host/server` export, so Directive Workspace now has a bounded HTTP API for health, Discovery submission, and Discovery overview without reusing Mission Control API code or claiming a deployed standalone runtime
- added a minimal product-owned standalone filesystem reference host through `hosts/standalone-host/runtime.ts`, `hosts/standalone-host/cli.ts`, and root package exports, so Directive Workspace can now execute acceptance, Discovery submission, and Discovery overview flows without Mission Control while still staying clear that this is not yet a deployed standalone runtime
- materialized the root package-ready standalone product surface through `directive-workspace/package.json`, `directive-workspace/index.ts`, `shared/lib/discovery/index.ts`, `shared/lib/architecture/index.ts`, and `STANDALONE_SURFACE.json`, so third-party hosts can target one Directive Workspace package/export boundary for shareable GitHub/local use without pretending the broader host surface is already complete
- normalized Discovery split-case intake linkage by adding explicit `intake_record_path` support to the queue/lifecycle model, added canonical `shared/lib/discovery-front-door-coverage.ts` plus the host `check:discovery-front-door-coverage` gate, and resolved the remaining Discovery front-door coverage gap from executable corpus metrics (`13` native-like post-primary entries, `100%` native-like intake linkage coverage) instead of stale hand-counted markdown ratios
- decoupled live OpenClaw Discovery signal helpers and host-integration starter/examples from the now-resolved `gap-discovery-front-door-coverage` assumption, making `capability_gap_id` nullable for maintenance/watchdog signal payloads and tightening checks so active helpers stay valid after gap resolution
- added `shared/lib/architecture-cycle-decision-loader.ts` plus the bounded Mission Control mirror and wave-evaluation host script, so Architecture cycle evaluation can now load closeout-emitted decision artifacts directly from a wave's experiment/adopted record refs instead of maintaining separate manual JSON path lists
- added `shared/lib/architecture-closeout.ts` plus the bounded Mission Control mirror and host closeout script, so Architecture slices can now resolve review, resolve adoption, enforce record-state correctness, and emit retained machine-readable decision artifacts through one canonical executable Decide-step lane instead of manual helper sequencing
- consumed machine-readable Architecture adoption artifacts in the cycle-evaluation lane through `shared/lib/architecture-cycle-decision-summary.ts` plus the bounded Mission Control mirror, so cycle evaluation can now aggregate adoption verdicts, artifact types, completion statuses, Runtime handoff demand, and meta self-improvement categories from generated decision artifacts instead of prose-only adopted records
- materialized the Architecture Decide-step output as executable product-owned code through `shared/lib/architecture-adoption-artifacts.ts` plus the bounded Mission Control mirror, so adoption decisions can now be emitted directly in the canonical `architecture-adoption-decision.schema.json` shape instead of stopping at prose plus resolver output
- turned the Architecture Decide step into executable product-owned code through `shared/lib/architecture-adoption-resolution.ts` plus the bounded Mission Control mirror, so adoption readiness, artifact-type selection, completion-status classification, and Runtime handoff resolution now run through one canonical helper instead of remaining contract/schema-only
- turned the Architecture review lane into executable product-owned code through `shared/lib/architecture-review-resolution.ts` plus the bounded Mission Control mirror, so `architecture_review_guardrails/v1` now resolves evaluated slices into scored approve/follow-up/resume/block outcomes instead of remaining checklist-only
- operationalized the already-adopted OpenMOSS lifecycle and review-score mechanisms as executable product-owned code through `shared/lib/lifecycle-review-feedback.ts` plus the bounded Mission Control mirror, so Directive Workspace now has a canonical transition/review/recovery helper instead of leaving that behavior at contract-only depth
- extracted MetaClaw's generation-bump stale-sample boundary into Architecture through `shared/contracts/self-improvement-generation-boundary.md`, `shared/templates/generation-boundary-note.md`, and `shared/schemas/generation-boundary-note.schema.json`, then opened `architecture/01-experiments/2026-03-23-post-doctrine-architecture-generation-boundary.md` so self-improvement claims can now separate historical baseline evidence from clean post-change confirmation
- completed the first bounded live-provider Runtime proof for `scientify-literature-monitoring` through `mission-control/scripts/run-scientify-literature-monitoring-live-fetch.ts`, emitting real OpenAlex + arXiv qualified/degraded artifacts plus `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-live-fetch-gate-snapshot.json` while keeping delivery host-neutral/no-op and not opening promotion yet
- completed the first product-side Runtime proof for `scientify-literature-monitoring` through generated qualified/degraded sample artifacts plus `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof.md`, proving executable digest/degraded artifact generation before any host promotion or live provider execution
- added canonical shared-lib builder `shared/lib/literature-monitoring-artifacts.ts` plus the bounded Mission Control mirror so the first Runtime literature-monitoring slice can emit normalized digest and degraded-state artifacts from executable product-owned code instead of only Markdown templates
- materialized the first Runtime runtime output artifacts for `scientify-literature-monitoring` through `shared/templates/literature-monitoring-digest.md`, `shared/templates/literature-monitoring-degraded-state.md`, and their paired schemas, so the first execution slice now has concrete success/degraded payloads instead of only workflow-level guard language
- opened the first real Runtime runtime-definition slice for a mixed-value Architecture handoff through `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-record.md`, keeping the `scientify-literature-monitoring` candidate bounded at workflow/proof-definition level before any host promotion or runtime activation
- adopted `shared/contracts/bounded-literature-monitoring-workflow.md` and `shared/contracts/literature-monitoring-degraded-state-guard.md` so Runtime now has an explicit minimal workflow surface and degraded-state proof rule for bounded literature-monitoring candidates instead of only a handoff note
- added `runtime/legacy-records/2026-03-23-scientify-literature-monitoring-runtime-slice-01-proof-checklist.md` and linked it from the active follow-up, making the next Runtime step concrete: prove both qualified-pool digest output and degraded-quality visibility before any host-facing promotion
- accepted the first live mixed-value Architecture-to-Runtime follow-up inside Runtime itself through `runtime/legacy-handoff/2026-03-23-scientify-literature-monitoring-architecture-to-runtime-handoff.md` and `runtime/00-follow-up/2026-03-23-scientify-literature-monitoring-runtime-followup.md`, so the `scientify` literature-monitoring candidate now exists as a bounded Runtime-owned follow-up instead of only an Architecture-side handoff note
- updated `runtime/README.md` so Runtime no longer claims there is no active candidate after the real `scientify-literature-monitoring` Architecture handoff; the track now reflects one active bounded follow-up with no runtime slice opened yet
- activated the first real mixed-value Architecture-to-Runtime handoff through `architecture/02-adopted/2026-03-23-scientify-literature-monitoring-runtime-handoff.md`, narrowing the `scientify` source to a bounded literature-monitoring runtime candidate instead of handing the whole plugin stack to Runtime
- updated the `scientify` mixed-value partition adoption with an explicit Runtime handoff transition and added `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-05.md`, moving the weakest Architecture category from handoff ambiguity toward actual Runtime acceptance
- executed the first mixed-value Architecture routing slice on `scientify`, reusing the existing evidence-backed stage-synthesis packets where valid but adding an explicit mixed-value partition surface for packet coverage scope, fresh re-analysis scope, Architecture-retained mechanisms, and later Runtime candidates
- adopted `shared/contracts/mixed-value-source-partition.md`, `shared/templates/mixed-value-source-partition.md`, and `shared/schemas/mixed-value-source-partition.schema.json` so Architecture can now process ambiguous sources without collapsing into whole-source Runtime routing or unnecessary full-source reconstruction
- integrated mixed-value source partitioning into `knowledge/workflow.md`, `shared/contracts/source-analysis-contract.md`, `shared/contracts/architecture-to-runtime.md`, and `shared/contracts/architecture-adoption-criteria.md`, then added `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-04.md` to record the routing-quality gain and the remaining handoff-quality gap
- executed the first packet-consumption Architecture slice on the `impeccable` review family, consuming the existing `evidence-backed-stage-synthesis` mechanism packet and its paired cross-source synthesis packet as primary inputs to improve Architecture review and cycle-evaluation quality instead of creating another packet family
- upgraded `shared/contracts/architecture-review-guardrails.md`, `shared/templates/architecture-review-checklist.md`, `shared/templates/architecture-cycle-evaluation.md`, and `knowledge/workflow.md` so Architecture review explicitly checks packet consumption and artifact/evidence continuity and cycle evaluation can now measure packet-consumption reuse directly
- added the third real Architecture cycle evaluation at `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-03.md`, confirming the system has moved from packet emission to packet consumption and shifting the next priority to noisier mixed-value packet reuse tests
- executed the first non-arscontexta packet-reuse Architecture slice on `Paper2Code` + `gpt-researcher`, reusing the existing cross-source-synthesis-packet and architecture-mechanism-packet system to preserve an evidence-backed stage synthesis without adding a new packet family
- added the second real Architecture cycle evaluation at `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-02.md`, showing the first post-baseline source-driven Architecture wave moved explicit adaptation and improvement coverage from `0%` baseline tracking to `100%` across `4` bounded slices and shifting the next system priority from basic execution to proving packet reuse on non-arscontexta sources
- adopted cross-source synthesis packets as Directive-owned Architecture operating code through `shared/contracts/cross-source-synthesis-packet.md`, `shared/templates/cross-source-synthesis-packet.md`, and `shared/schemas/cross-source-synthesis-packet.schema.json`, using a real phase-isolated cross-source slice derived from arscontexta multi-source synthesis patterns
- integrated cross-source synthesis packets into `knowledge/workflow.md`, `shared/contracts/source-analysis-contract.md`, `shared/contracts/adaptation-decision-contract.md`, and `shared/contracts/architecture-mechanism-packet.md` so cross-source Architecture work can preserve reusable synthesis instead of only long comparison records
- adopted `arscontexta` assembly-over-creation as Directive-owned Architecture operating code through `shared/contracts/architecture-mechanism-packet.md`, `shared/templates/architecture-mechanism-packet.md`, and `shared/schemas/architecture-mechanism-packet.schema.json`, using a real phase-isolated handoff packet and the full post-doctrine source-analysis -> adaptation-decision -> adoption chain on a mission-relevant source
- integrated mechanism packets into `knowledge/workflow.md`, `shared/contracts/source-analysis-contract.md`, `shared/contracts/adaptation-decision-contract.md`, `shared/contracts/phase-isolated-processing.md`, and `shared/contracts/transformation-artifact-gate.md` so source-driven Architecture slices can leave behind reusable building blocks instead of only long historical records
- adopted `arscontexta` transformation-artifact gate as Directive-owned Architecture operating code through `shared/contracts/transformation-artifact-gate.md`, using the post-doctrine source-analysis -> adaptation-decision -> adoption chain on a mission-relevant source
- integrated the transformation-artifact gate into `knowledge/workflow.md`, `shared/templates/experiment-record.md`, `knowledge/architecture-completion-rubric.md`, and `shared/templates/architecture-cycle-evaluation.md` so source-driven Architecture work is evaluated on transformed operating value rather than note churn
- adopted `arscontexta` phase-isolation as Directive-owned Architecture operating code through `shared/contracts/phase-isolated-processing.md`, `shared/templates/phase-handoff-packet.md`, and `shared/schemas/phase-handoff-packet.schema.json`, using the full post-doctrine source-analysis -> adaptation-decision -> adoption chain on a mission-relevant source
- integrated phase-isolated processing into `knowledge/workflow.md`, `shared/contracts/source-analysis-contract.md`, and `shared/contracts/adaptation-decision-contract.md` so future heavy source-driven Architecture slices can pass state through packets instead of chat continuity
- added the first real Architecture cycle evaluation at `architecture/01-experiments/2026-03-23-architecture-cycle-evaluation-wave-01.md`, establishing the current Architecture system baseline as strong in evaluation quality but weak in explicit adaptation/improvement coverage
- established the first recurring Architecture self-improvement baseline: `24` adopted records, `7` meta-useful adoptions, `29.2%` meta-usefulness rate, and `0%` explicit adaptation/improvement coverage across the pre-doctrine cycle
- opened a derived-doc-context cache transformation slice on `mission-control/src/server/services/context-pack-service.ts`, reusing docs maps, search index, link map, graph data, and doc analysis across repeated context-pack work and reducing the dedicated derived-prep benchmark from 0.30ms to 0.00ms while preserving the same graph counts
- opened a repo-snapshot internal-cache transformation slice on `mission-control/src/server/services/workspace-intel-service.ts`, adding short-lived git and static-surface caches beneath `buildRepoSnapshot(project)` so outer snapshot cache misses drop from 108.93ms to 0.35ms in the dedicated benchmark while preserving the same snapshot summary, route count, key-file count, git summary, and code-intel tool count
- opened a readonly repo-cache transformation slice on `mission-control/src/server/repositories/docs-repo.ts`, `quests-repo.ts`, `notes-repo.ts`, and `reports-repo.ts`, adding short-lived list-surface caches plus local mutation invalidation so repeated context-pack repo loads drop from 9.51ms to 0.02ms in the control-plane benchmark while preserving the same quest/report/doc/note ids
- added `mission-control/scripts/benchmark-context-pack-readonly-repos.ts` as the dedicated verifier for the repeated readonly repo-load path, with `benchmark-context-pack-phases.ts` retained as a broader secondary signal for context-pack `loadDataMs`

## 2026-03-22

### Added
- canonical `shared/contracts/architecture-artifact-lifecycle.md` defining Architecture artifact states, transition rules, reference-pattern admission/retirement criteria, pre-doctrine handling, normalization annotation policy, historical-record review checklist, and reference-pattern retirement checklist
- Architecture corpus normalization record `2026-03-22-architecture-corpus-normalization.md` classifying all 24 adopted records, all 31 reference patterns, and all 8 deferred/rejected records against the new Architecture operating model (revision 2, corrected from initial baseline)
- Architecture adopted record `2026-03-22-architecture-corpus-normalization-adopted.md` documenting the deep audit, normalization baseline, corpus upgrade program, and lifecycle-governance gain
- normalization annotations (retroactive) on 4 historical adopted records: gpt-researcher, impeccable, hermes, adopted-candidates-architecture-recheck â€” including retroactive self-improvement evidence for 2 meta-useful records (impeccable/evaluation_quality, architecture-recheck/routing_quality)
- retirement header on reference pattern `stage-evidence-citation-handoff-contract` (fully absorbed by shared schemas)
- canonical `shared/contracts/source-analysis-contract.md` operationalizing the Analyze step of the source flow with structured value maps, baggage maps, adaptation opportunities, improvement opportunities, and three-level usefulness classification
- canonical `shared/contracts/adaptation-decision-contract.md` operationalizing the Extract â†’ Adapt â†’ Improve chain with per-mechanism extraction, adaptation, and improvement decisions plus mandatory delta evidence and meta-usefulness checks
- canonical `shared/templates/source-adaptation-record.md` as the reusable working template enforcing both source-analysis and adaptation-decision contracts
- canonical `shared/schemas/source-adaptation-decision.schema.json` making the full adaptation decision chain machine-readable with required delta fields and meta-usefulness structure
- Architecture adopted record `2026-03-22-source-adaptation-chain-operating-code-adopted.md` documenting the gap between stated doctrine and missing operating code for the adapt/improve steps
- integrated the source-adaptation chain into the Discovery â†’ Architecture handoff contract with source-analysis preparation fields and a rule requiring source-analysis-contract as Architecture's next step
- integrated adaptation/improvement evidence into the Architecture â†’ Runtime handoff contract so Runtime receives adapted/improved value, not raw extracts
- added source-adaptation fields to the experiment-record template for Architecture source-driven experiments
- added source-analysis preparation section to the discovery-fast-path-record template for Architecture-bound routing
- added Architecture adaptation evaluation metrics to the evaluator contract (adaptation coverage, improvement coverage, baggage exclusion rate, delta evidence completeness, meta-usefulness hit rate)
- updated the routing-record template with handoff-contract and next-artifact guidance for Architecture source work
- updated the routing matrix to require source-analysis and adaptation-decision chain when routing sources to Architecture
- updated the canonical workflow with an explicit Architecture source-driven work section describing the 4-step adaptation chain
- updated the intake checklist to reference source-analysis-contract as the deeper evaluation step after triage
- Architecture adopted record `2026-03-22-source-adaptation-integration-bundle-adopted.md` documenting the integration of source-adaptation assets into routing, templates, handoffs, workflow, and evaluation
- canonical `shared/contracts/architecture-adoption-criteria.md` defining structured adoption readiness checks, artifact type selection matrix, Architecture-to-Runtime threshold logic, and usefulness-level treatment paths (direct/structural/meta)
- canonical `shared/contracts/architecture-self-improvement-contract.md` defining seven self-improvement categories, falsifiable evidence structure for meta-useful adoptions, cycle evaluation structure, and verification methods for meta-usefulness claims
- canonical `shared/schemas/architecture-adoption-decision.schema.json` making adoption decisions machine-readable with required readiness checks, self-improvement evidence for meta-useful adoptions, and Runtime threshold logic
- canonical `shared/templates/architecture-cycle-evaluation.md` for cycle-over-cycle self-improvement assessment with adaptation/improvement coverage metrics, per-category state tracking, and meta-usefulness claim verification
- updated the canonical workflow with Architecture adoption decision and cycle evaluation sections
- updated the adaptation-decision contract and source-analysis contract relationship sections to reference downstream adoption criteria and self-improvement tracking
- updated the architecture-completion-rubric with adoption quality rule and self-improvement tracking rule
- Architecture adopted record `2026-03-22-architecture-maturity-bundle-adopted.md` documenting the maturity gain from adoption criteria, self-improvement tracking, and cycle evaluation
- canonical `shared/contracts/architecture-artifact-lifecycle.md` defining the Architecture artifact type system: 4 states (experiment, adopted, reference-pattern, deferred), adopted-to-Runtime handoff rules, reference-pattern admission/retirement criteria, and pre-doctrine record handling
- deep audit and retroactive classification of the full Architecture corpus in `architecture/01-experiments/2026-03-22-architecture-corpus-normalization.md` covering all 21 adopted records by usefulness level and contract coverage, all 25 reference patterns by lifecycle state, and 6 specific audit findings
- added lifecycle classification fields (origin, usefulness level, Runtime threshold check) and explicit next-decision options to the experiment-record template
- updated the canonical workflow with Architecture artifact lifecycle governance section
- updated the architecture-completion-rubric with corpus normalization baseline and artifact lifecycle governance sections
- Architecture adopted record `2026-03-22-architecture-corpus-normalization-adopted.md` documenting the deep audit, corpus classification, artifact lifecycle contract, and integration

### Changed
- removed remaining workspace-level direct execution references to `workspace/agent-lab/orchestration/scripts/invoke-external-tool.ps1` by routing active callers through the OpenClaw-root runner instead
- fixed `runtime/source-packs/scripts/sync-curated-packs.ps1` to mirror from Runtime-owned source packs instead of the retired `agent-lab/tooling` root
- updated bridge-status docs so the only remaining legacy dependency is described as an OpenClaw-root bridge issue, not an active Directive Workspace runtime dependency
- migrated the OpenClaw-root external-tool bridge to `scripts/external-tools/` so live adapters now resolve through Runtime source packs, Mission Control runtime dependencies, or OpenClaw-owned root state instead of `workspace/agent-lab/orchestration`
- Discovery now has a canonical gap worklist so unresolved mission-linked capability gaps can drive the next internal slice instead of remaining passive registry rows
- moved raw Architecture source snapshots out of `architecture/00-intake` and `architecture/04-deferred-or-rejected` into the dedicated `sources/` surface so Architecture stays operating-code-oriented instead of behaving like repo storage
- updated Doctrine / README / execution-plan guidance so raw source storage is separated from Architecture and Runtime operating lanes
- removed the generated `node_modules` tree from the `runtime/source-packs/agent-orchestrator` product surface and tightened the Runtime source-pack hygiene rule around generated dependencies and caches
- opened the first mission-relevant host transformation slice on `mission-control/src/server/services/context-pack-service.ts` and reduced `buildContextPack` from 264 lines to 130 by extracting explicit focus-resolution helpers without changing the `ContextPack` contract
- opened the second mission-relevant host transformation slice on `mission-control/src/server/services/workspace-intel-service.ts` and reduced `buildWorkspaceReadiness` from 171 lines to 26 by extracting explicit readiness-signal and readiness-check helpers without changing the `WorkspaceReadiness` contract
- opened the third mission-relevant host transformation slice on `mission-control/src/server/services/workspace-intel-service.ts` and reduced `collectCodeIntelSnapshot` from 193 lines to 51 by extracting explicit language-probe helpers without changing the `RepoCodeIntelSnapshot` contract
- opened the first latency-oriented host transformation slice on `mission-control/src/server/services/context-pack-service.ts` by overlapping independent async context surfaces, reducing measured control-plane benchmark time from 0.32ms to 0.18ms in the current environment without changing the `ContextPack` contract
- opened a dashboard-context preload transformation slice on `mission-control/src/server/services/workspace-context-writer.ts` and `mission-control/src/server/services/context-pack-service.ts`, reusing one shared surface bundle across summary, overview, full, readiness, collaboration guide, and repo snapshot generation while preserving legacy quest-scope behavior and reducing measured control-plane bundle time from 711.8ms to 171.56ms
- opened a readonly daily-report-log cache transformation slice on `mission-control/src/server/services/daily-report-log-service.ts`, adding explicit report-mutation invalidation for the non-materializing daily-log path and reducing measured repeated readonly log reads from 43.39ms to 19.53ms while preserving the same grouped log output
- opened a repo-snapshot cache transformation slice on `mission-control/src/server/services/workspace-intel-service.ts`, adding a short-lived per-project cache for repeated snapshot reads and reducing measured repeated control-plane snapshot calls from 518.68ms to 0.01ms inside the bounded cache window
- aligned the canonical Directive Workspace v0 core and backend host path with the source-adaptation doctrine so the product code now accepts mission-conditioned non-repo source types, carries source-flow/usefulness metadata, and no longer hardcodes `github-repo` intake as the only valid system shape
- turned `discovery/gap-worklist.json` into a scored mission-priority operating surface with a canonical scorer in `shared/lib/discovery-gap-priority.ts`, explicit score breakdown fields, and checker enforcement that rank order matches computed priority rather than manual convenience
- added a canonical Discovery lifecycle sync surface so queue state and linked intake/result artifacts can move together through one validated path instead of separate manual updates
- added a canonical Discovery routing-record writer so split routing markdown can be generated and linked into the queue through one validated path instead of separate file edits and queue updates
- added a canonical Discovery completion-record writer so final result markdown can be generated and linked into the queue completion path through one validated operation
- added a canonical Discovery case-record writer so intake, triage, routing, and optional completion markdown can be emitted from one product-owned payload while queue lifecycle state stays synchronized
- added a canonical Discovery fast-path writer plus unified submission router so one operator payload can now stay queue-only, create a simple routed fast-path record, or generate the full split-case record set automatically through Mission Control and OpenClaw
- added a real Mission Control Discovery submission API surface so the unified submission router is now callable through `src/app/api/directive-workspace/discovery/submissions/route.ts` and checked by `check:directive-discovery-submission-api`
- exposed the canonical Discovery mission-routing assessment through the Mission Control operator panel as a debounced live advisory plus explicit dry-run preview, so operators can see and apply recommended shape, route, matched gap, adoption target, next artifact, bounded proof text, and route-rationale drafts before queue mutation

## 2026-03-21

### Added
- canonical `knowledge/workflow.md` fast-path operating loop
- canonical `knowledge/architecture-completion-rubric.md` for product-owned Architecture completion accounting
- canonical `knowledge/technology-policy.md` for language and performance-escalation decisions
- `shared/templates/discovery-fast-path-record.md`
- canonical `shared/lib/` surface for product-owned executable helpers
- canonical `shared/contracts/lifecycle-transition-policy.md`
- canonical `shared/contracts/experiment-score-feedback.md`
- canonical `shared/contracts/escalation-boundary-policy.md`
- canonical `shared/contracts/index-query-state-boundary.md`
- canonical `shared/contracts/context-compaction-fidelity.md`
- canonical `shared/contracts/architecture-review-guardrails.md`
- canonical `shared/contracts/intake-stack-signals.md`
- canonical `shared/templates/architecture-review-checklist.md`
- canonical stage-handoff schema family for Paper2Code-derived Architecture normalization
- post-closure `Architecture Wave 02` shortlist and Discovery routing bundle
- post-closure `Architecture Wave 03` shortlist centered on Celtrix stack-signal routing quality
- workflow doctrine hardening and report-sync coverage for workflow docs
- canonical `shared/contracts/agent-eval-guard.md` for bounded eval-lane Runtime promotion
- Discovery routing artifact for Runtime system-first reprioritization
- host-side source-pack readiness enforcement check
- canonical Runtime mirror/package boundary inventory
- host-side Runtime boundary inventory enforcement check
- canonical Runtime source-pack catalog and classification surface
- host-side source-pack catalog enforcement check
- canonical Runtime promotion-profile catalog
- host-side promotion-profile catalog enforcement check
- canonical Runtime import-source policy catalog
- host-side import-source policy enforcement check
- canonical `shared/contracts/legacy-live-runtime-guard.md`
- canonical Runtime live-runtime accounting inventory
- canonical `shared/contracts/context-operator-import-guard.md`
- canonical `shared/contracts/browser-smoke-guard.md`
- host-side bounded browser-lane Runtime checker
- canonical `shared/contracts/skill-lifecycle-guard.md`
- host-side bounded skill-lifecycle Runtime checker
- host-side `agent-orchestrator` precondition checker
- Runtime Wave 02 queue refresh artifacts
- host-side live-runtime accounting enforcement check
- host-side bounded arscontexta import-lane Runtime checker
- canonical `shared/contracts/design-review-skill-guard.md`
- host-side bounded design-review skill Runtime checker
- canonical `shared/contracts/workflow-operator-import-guard.md`
- host-side bounded workflow-operator Runtime checker
- Runtime Wave 03 shortlist and Discovery routing bundle

### Changed
- doctrine, execution plan, delivery workflow, and track readmes now point to one canonical workflow
- Discovery defaults to one fast-path record unless complexity requires split artifacts
- Architecture now uses validation bundles instead of defaulting every slice to the heaviest gate set
- Mission Control shared Directive helpers now mirror canonical files from `directive-workspace/shared/lib/`
- `shared/templates/experiment-record.md` now includes transition/scoring/recovery fields
- `shared/templates/integration-contract-artifact.md` now includes escalation/background-window/boundary-check fields
- `shared/schemas/` now includes the full stage-contract chain (`intake`, `analysis`, `experiment design`, `integration`, `proof`)
- Runtime Wave 01 is now explicitly system-first after the completed promptfoo slice
- runtime source-pack resolution now requires `SOURCE_PACK_READY.md`
- Runtime quality-profile handling now splits `promotion_quality_gate/v1` from `agent_eval_guard/v1`
- Runtime mirror/package boundary truth now lives in `runtime/meta/BOUNDARY_INVENTORY.json` instead of hardcoded host script lists
- Runtime source-pack activation now depends on `source-packs/CATALOG.json` classification plus `SOURCE_PACK_READY.md`, not readiness alone
- Runtime promotion-profile handling now resolves family, proof shape, and primary host checker from `runtime/meta/PROMOTION_PROFILES.json` instead of implicit per-checker assumptions
- Runtime agent-pack import defaults and explicit import eligibility now resolve from `runtime/meta/IMPORT_SOURCE_POLICY.json` instead of hardcoded backend lists
- `agency-agents` and `desloppify` now have explicit Runtime proof/promotion/registry accounting instead of silent legacy live-runtime status
- `arscontexta` is now promoted as an explicit-only bounded context-operator import lane with live-runtime accounting
- `software-design-philosophy-skill` is now promoted as an explicit-only bounded design-review skill import lane with live-runtime accounting
- `superpowers` is now promoted as an explicit-only bounded workflow-operator import lane with live-runtime accounting
- Puppeteer is now promoted as a bounded browser smoke lane with live-runtime source-pack classification and Runtime proof/promotion/registry artifacts
- Skills-manager is now promoted as a bounded skill lifecycle import lane with live-runtime source-pack classification and Runtime proof/promotion/registry artifacts
- `agent-orchestrator` is corrected back to blocked Runtime follow-up until the Runtime-owned pack contains a runnable AO CLI artifact
- Runtime Wave 01 is now closed, Wave 02 system cleanup plus `arscontexta`, `software-design-philosophy-skill`, and `superpowers` are complete, and Wave 03 now opens with the AO CLI precondition-build target

## 2026-03-19

### Added
- Standalone `directive-workspace` product root
- dedicated `discovery`, `runtime`, `architecture`, `shared`, `knowledge`, and `hosts` surfaces
- standalone ownership, doctrine, execution, and migration references
- standalone Runtime core surface and host-sync discipline
- publish-readiness and contributor guidance

### Changed
- Directive Architecture moved under the standalone root
- Mission Control now operates as the first host rather than the product home
- Architecture records were normalized to the standalone path

### Notes
- Runtime runtime remains hosted in Mission Control
- remaining work is host/runtime polish, not product-boundary migration
### Notes
- opened Architecture Wave 04 through `al-src-agent-lab-orchestration-allowlist`, keeping monitor-held candidates closed by trigger rule and keeping Runtime-routed source-map items out of Architecture scope
- closed the Wave 04 allowlist boundary by materializing `shared/contracts/source-pack-curation-allowlist.md` and binding it into Runtime follow-up/source-pack guidance
- opened Runtime Wave 01 with `al-tooling-promptfoo` as the first active runtime candidate
- completed the promptfoo bounded eval-lane promotion slice
- reprioritized the remaining Runtime queue around system cleanup before broader runtime expansion
- 2026-03-21: proved the Runtime-owned `agent-orchestrator` CLI precondition through a bounded local build and `ao --help` execution, reopened AO as an active bounded CLI follow-up candidate while keeping it `follow_up_only` rather than `live_runtime`.
- 2026-03-21: completed bounded AO CLI runtime slice 01 with a temp-copy `ao status --json` host proof against a generated local runtime config, while keeping `agent-orchestrator` `follow_up_only` pending a narrower host-adapter promotion decision.
# 2026-03-21

- Closed the `agent-orchestrator` host-adapter decision slice as keep-`follow_up_only`; AO remains a verified CLI utility lane, not a live Mission Control backend.
- Added `ao_host_adapter_scope/v1` and aligned Mission Control catalog/update, dispatch, runtime, extras, and agents UI behavior with the blocked AO host surface.

# 2026-03-22

- Discovery gap worklist is now generated from `capability-gaps.json`, `intake-queue.json`, and `knowledge/active-mission.md` through canonical shared lib `shared/lib/discovery-gap-worklist-generator.ts` instead of being hand-maintained JSON.
- Discovery intake now has a canonical queue-writer shared lib plus a host writer wrapper, and OpenClaw submission now uses that path instead of mutating `intake-queue.json` directly.
- Discovery queue status transitions now have a canonical shared transition lib, a host transition writer wrapper, and a checker-backed dry-run path instead of relying on ad hoc JSON edits.
- Re-anchored Directive Workspace doctrine precedence so root `CLAUDE.md` plus the local doctrine/audit skills are the governing sources and DW docs are treated as aligned product-level projections.
- Corrected stale phase-era and mission-gap planning drift in `active-mission.md`, `execution-plan.md`, `charter.md`, and `CONTRIBUTING.md` so current priorities match the real doctrine: Discovery-first coverage, mission-conditioned usefulness, behavior-preserving transformation, and explicit legacy-bridge cleanup.
- Refreshed the Runtime queue for Wave 04 and recorded an explicit no-active-candidate state instead of opening a fake runtime slice.
- Closed stale Runtime follow-up records that were already promoted, normalized, or absorbed into Architecture.
- Added the first real `CLI-Anything` re-entry artifacts: command-mediation contract, command-class approval policy, and a checker-backed deferred state.
- Exercised the bounded `OpenClaw -> Discovery` path with one real root-helper submission, completed it through Discovery-first Architecture processing, and updated the front-door gap/worklist plus host notes to treat that path as active instead of deferred.
- Added a second bounded OpenClaw upstream path that turns stale runtime verification evidence into a Discovery candidate through `submit-openclaw-runtime-verification-signal.ps1`, exercised it once against live stale reports, and closed the resulting Architecture slice.
- Added a third bounded OpenClaw upstream path for degraded maintenance/watchdog state through `submit-openclaw-maintenance-watchdog-signal.ps1`, checker-backed it in Mission Control, and recorded the lane itself as an Architecture operating slice without fabricating a live degraded event.
- 2026-03-22: added a real Mission Control operator-facing Directive Discovery submission surface in the dashboard, backed by the canonical unified submission API instead of manual markdown/script-only intake.
- 2026-03-22: extended the Directive Discovery dashboard with a recent-cases panel driven by canonical queue state so operators can see actual intake/routing/completion movement without dropping to raw files.
- 2026-03-22: locked the host/product boundary more explicitly so Directive Workspace remains the standalone product and Mission Control remains an adapter host rather than a competing product definition.
- 2026-03-22: added a host-neutral integration kit with adapter guidance and example payloads so third-party hosts can integrate Directive Workspace without treating Mission Control as the product definition.
- 2026-03-22: added a starter host adapter template for Discovery submission so third-party hosts have a concrete TypeScript integration shape, not just docs and payload examples.
- Added a host-neutral starter validation layer to the Directive Workspace integration kit with a memory-backed storage bridge template and a starter smoke template, so third-party hosts can prove their Discovery adapter shape before wiring real runtime storage.
- Added a host-neutral Discovery overview starter to the integration kit so third-party hosts can render recent queue movement and status summaries from the canonical intake queue without copying Mission Control backend logic.
- Added a host-neutral signal adapter starter to the integration kit so third-party hosts can route runtime verification and maintenance/watchdog events through canonical Discovery submission instead of bypassing the front door.
- Added a package-ready export surface for the host integration kit with a canonical package manifest and barrel exports, so third-party hosts can import the kit as a stable module instead of copying starter files ad hoc.
- Added a canonical host integration acceptance contract, report schema, and starter acceptance harness so third-party hosts can prove they consume Directive Workspace correctly against one product-owned standard.
- Added a canonical successful host integration acceptance report example to the integration kit so third-party hosts can compare their acceptance output against an exact product-owned sample.
- Added a host-neutral acceptance report writer starter to the Directive Workspace integration kit so third-party hosts can emit the canonical host-integration acceptance artifact directly from code.
- Added a host-neutral acceptance quickstart runner starter to the Directive Workspace integration kit so third-party hosts can run the acceptance harness and emit the canonical artifact to a stable output path through one small entrypoint.
- Added a package-ready host integration kit CLI example so third-party hosts can run acceptance quickstart flows, submission dry-runs, and canonical payload printing from the command line without copying starter files first.
- Added a filesystem-backed starter storage bridge for the host integration kit so package-ready acceptance and split-case submission proofs can validate real artifact existence instead of depending only on in-memory state.
- Added a canonical Discovery mission-routing assessment engine so candidate routing can be scored against active mission pressure, open gaps, and track signals instead of relying mainly on manual handling.
- Added a measured Runtime transformation slice for context-pack quest-focus doc ranking, with a real legacy-vs-indexed benchmark proving faster bounded top-N ranking on the live control-plane dataset.
- Added a measured Runtime transformation slice for context-pack readiness reuse, removing duplicate docs/quests/reports/repo-snapshot loads from the readiness path when buildContextPack already has those surfaces.
- Added a measured Runtime transformation slice for repo-snapshot git command consolidation, cutting git metadata overhead in `buildRepoSnapshot` while preserving the existing snapshot shape.
- Added a measured Runtime transformation slice for context-pack daily-log summary loading, replacing full daily-report markdown/materialization work with a summary-only read path for context-pack assembly.
- 2026-03-23: retained six real `architecture-adoption-decision` JSON artifacts beside adopted Architecture records, added an executable corpus checker for them, and opened Wave 06 so cycle evaluation now consumes on-disk decision state instead of synthetic-only artifact inputs.
- 2026-03-23: added a canonical Architecture adoption-decision writer lib plus a host writer/checker so retained `*-adoption-decision.json` artifacts can be emitted beside adopted records through one executable path instead of manual JSON backfill.
- 2026-03-23: upgraded the Architecture adoption-decision writer into a live Decide-step lane that can consume raw review checks, resolve review/adoption canonically, and retain the decision artifact in one path.
- 2026-03-23: added a canonical backfill path for the retained six-slice Architecture adoption-decision corpus, so the current on-disk decision set is now reproducible through the live writer instead of only hand-authored JSON maintenance.
- 2026-03-23: extracted `gpt-researcher`'s atomic report-store pattern into a canonical Architecture adoption-decision store, wired closeout/backfill/wave-evaluation through that product-owned persistence layer, and used it to close and evaluate a fresh source-driven Architecture slice from real record refs.
- 2026-03-23: extracted mini-SWE-agent's versioned trajectory-envelope and recursive-merge pattern into a canonical Architecture adoption-decision envelope, added explicit `decision_format` identity to retained Architecture decisions, and re-emitted the retained corpus through the live backfill lane.

