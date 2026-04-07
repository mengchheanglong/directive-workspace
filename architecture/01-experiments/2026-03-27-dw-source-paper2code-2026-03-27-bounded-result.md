# Paper2Code Multi-Agent Code Generation System Bounded Architecture Result

- Candidate id: dw-source-paper2code-2026-03-27
- Candidate name: Paper2Code Multi-Agent Code Generation System
- Experiment date: 2026-03-27
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by directive-lead-implementer from bounded start `architecture/01-experiments/2026-03-27-dw-source-paper2code-2026-03-27-bounded-start.md`

- Objective: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Bounded scope:
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.
- Inputs:
- Multi-agent system that transforms academic papers into functional code repositories using a 3-stage pipeline (planning, analysis, code generation). Relevant to Directive Workspace's core mission of automated source-to-usefulness conversion â€” the pipeline architecture, agent coordination patterns, and structured extraction workflow are directly applicable to improving Engine's source consumption and adaptation capabilities.
- Python/OpenAI-based. 3 stages: PlanningAgent, AnalysisAgent, CodeGenerationAgent. Uses structured prompts and inter-agent handoff. Could inform Engine workflow design or become a runtime capability for automated paper-to-implementation.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Keep the result at experiment status and do not integrate it into the engine until the adaptation boundary is clearer.
- Result summary: Paper2Code source analysis complete. Three transferable structural patterns identified from the 3-stage pipeline (planning -> analysis -> code generation):

1. Structured intermediate artifact handoff: Each Paper2Code stage produces typed artifacts (JSON task lists, YAML configs, per-file analysis text) that downstream stages consume as explicit input. The Engine currently computes all plans (extraction, adaptation, improvement, proof) independently inside processSource() â€” each buildXxxPlan() function does not see the output of prior plan stages. The pattern suggests Engine plan stages could inform each other sequentially rather than running in parallel isolation.

2. Progressive context accumulation: Paper2Code's planning stage accumulates conversation context across 4 sub-steps (overview -> architecture -> logic -> config) so each sub-step builds on prior outputs. The Engine's current analysis/planning functions receive the same planningInput and do not benefit from each other's outputs.

3. Task decomposition with dependency ordering: Paper2Code decomposes work into an ordered task list with dependency analysis before any implementation begins. The Engine does not currently decompose extraction/adaptation into ordered sub-tasks.

Honest assessment: The Engine is currently deterministic and keyword-overlap based. Paper2Code's patterns are LLM-orchestration patterns designed for multi-turn agent conversations. The most directly transferable insight is structured intermediate artifacts between pipeline stages. However, the Engine's current processSource() already produces structured plans â€” the gap is that these plans are produced independently. No concrete Engine code change is justified from this experiment alone. The pattern should be recorded as a known improvement vector for when the Engine moves beyond keyword-overlap routing to richer analysis.

Excluded baggage: OpenAI API integration, prompt engineering, Python implementation, paper-to-code domain logic (would be Runtime not Architecture), cost tracking.

Verdict: stay_experimental. The structural pattern is real and identified, but no bounded Engine code change emerged from this experiment that passes the adaptation_complete gate. The insight is recorded for future Engine evolution.
- Evidence path:
- Bounded start: `architecture/01-experiments/2026-03-27-dw-source-paper2code-2026-03-27-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-27-dw-source-paper2code-2026-03-27-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-paper2code-2026-03-27-3480346a.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-paper2code-2026-03-27-3480346a.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-27-dw-source-paper2code-2026-03-27-routing-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-27-dw-source-paper2code-2026-03-27-bounded-result-adoption-decision.json`
- Next decision: `needs-more-evidence`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/01-experiments/2026-03-27-dw-source-paper2code-2026-03-27-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `adequate`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/01-experiments/2026-03-27-dw-source-paper2code-2026-03-27-engine-handoff.md`

## Closeout decision

- Verdict: `stay_experimental`
- Rationale: The mechanism is not adoption-ready yet; keep it experimental until readiness and evidence gaps are closed.
- Review result: `approved`
- Review score: `4`

