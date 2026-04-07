# Remaining Candidates Execution Plan (2026-03-19)

## lock reference
- Classification baseline source: `../04-deferred-or-rejected/2026-03-19-recheck-deferred-rejected-v2.md`
- Baseline state: `LOCKED_BASELINE_ACTIVE`
- This plan must not reclassify candidates silently; classification changes require a new dated re-check artifact.

## scope
- Planning + triage only.
- No mission-control runtime implementation in this slice.
- Direction lock enforced: external repositories are reverse-engineering sources; only extracted patterns/mechanisms are candidates for adoption.

## completion rule used
A candidate is treated as "completed" only when it has candidate-specific execution/decision evidence in:
- `02-experiments` (execution/experiment artifact), and
- `03-adopted` or `04-deferred-or-rejected` (candidate-specific decision artifact).

Batch parking notes are treated as interim status, not final per-candidate completion.

## inventory result
- Intake candidates total: 12
- Completed with candidate-specific artifacts: 7
  - `autoresearch`, `agentics`, `mini-swe-agent`, `gh-aw`, `openmoss`, `scientify`, `gpt-researcher`
- Remaining for candidate-specific completion: 5
  - `MetaClaw`, `SWE-agent`, `AutoResearchClaw`, `autogen`, `OpenHands`

## evidence basis for ranking
- Existing triage weighted score and risk from:
  - `01-triage/2026-03-18-metaclaw.md`
  - `01-triage/2026-03-18-swe-agent.md`
  - `01-triage/2026-03-18-autoresearchclaw.md`
  - `01-triage/2026-03-18-autogen.md`
  - `01-triage/2026-03-18-openhands.md`
- Existing parking context from:
  - `04-deferred-or-rejected/2026-03-19-day3-parked-candidates.md`

## prioritized execution queue (highest ROI first)

### 1) MetaClaw (score 3.60, risk: medium)
- Why first: highest weighted score in remaining set; unique meta-learning/proxy pattern potential for framework-level feedback loops.
- Decision target: likely `defer` with explicit re-entry condition (agent baseline + isolated non-RL proof) unless a low-risk extracted proxy pattern is validated quickly.
- Planned bounded slice: static reverse-engineering of skills-only proxy pattern + decision artifact.

### 2) SWE-agent (score 3.45, risk: low-medium)
- Why second: strong execution quality signal with clearer observability than heavyweight research stacks; could yield reusable issue-lifecycle policy patterns.
- Decision target: likely `defer/monitor` due overlap with Codex + mini-swe-agent lane unless a distinct framework pattern is extracted.
- Planned bounded slice: extract orchestration/benchmark-evidence interface pattern (not runtime adoption) + decision artifact.

### 3) AutoResearchClaw (score 3.45, risk: medium-high)
- Why third: high impact potential but heavy complexity; best handled after two narrower slices.
- Decision target: likely `defer` with re-entry at dedicated research-automation track, unless a thin stage-gating pattern is extracted.
- Planned bounded slice: extract stage-gate/review-contract pattern from early pipeline only + decision artifact.

### 4) autogen (score 3.15, risk: medium)
- Why fourth: broad framework with weaker Directive-specific fit; moderate reusable pattern potential for agent coordination contracts.
- Decision target: likely `defer` unless one clear policy/interface pattern is extractable with low adaptation cost.
- Planned bounded slice: static extraction of minimal agent-role/message-contract pattern + decision artifact.

### 5) OpenHands (score 3.00, risk: low-medium)
- Why fifth: lowest score in remaining set and highest overlap with existing execution lanes.
- Decision target: likely `defer/reject` unless a unique operator-observability pattern is identified.
- Planned bounded slice: extract only differentiated workflow/telemetry interface if present + decision artifact.

## execution protocol for each remaining candidate
1. Verify intake path + pin revision (`rev-parse`, `describe`, clean status).
2. Define one bounded reverse-engineering proof (timebox <= 45 minutes).
3. Capture extracted pattern candidates, integration cost/risk, and rollback.
4. Write candidate-specific execution artifact in `02-experiments`.
5. Write candidate-specific decision artifact in `03-adopted` or `04-deferred-or-rejected`.
6. Update queue closure/progress note after each slice.

## no-conflict confirmation
- No critical contradiction detected with:
  - `PHASE_2_ARCHITECTURE_EXPLORATION.md`
  - `directive-workspace-execution-plan.md`
  - `workspace-operating-model.md`
- This plan remains in Directive framework lane and does not treat external repos as runtime truth.

## v2 recheck promoted items (2026-03-19, updated by Opus re-check)

### promote_to_queue

#### 1. `gpt-researcher` (re-opened from deferred)
- **Why promoted now:**
  - Previous defer was runtime-host instability focused (Python 3.14.3 numpy crash).
  - Updated v1 Architecture direction allows reverse-engineering-first extraction without runtime truth adoption.
  - Prior runtime blocker is irrelevant for static pattern extraction.
- **Extractable mechanism:** evidence/citation pipeline contracts, parallelized research pattern, structured report schema.
- **v1 Architecture value:** formalize Directive analysis-phase evidence capture with verifiable citations and structured output.
- **Explicitly excluded:** runtime installation, FastAPI backend, NextJS frontend, LangSmith, API keys, Mission Control callable integration.
- **Next-cycle bounded slice:**
  - Static analysis of report generation modules to extract output schema, citation format, and evidence-linking pattern.
  - Deliverable: evidence-artifact schema proposal for Directive analysis phase.
  - Timebox: 60 minutes.
  - Success criteria: schema document with citation-linking pattern mapped to Directive analysis artifacts.
- **Risk:** Low (static analysis only). **Rollback:** delete experiment artifact.

#### 2. `Paper2Code` (re-opened from low-tier batch reject)
- **Why promoted now:**
  - Old rejection (score 2.75) evaluated Paper2Code as a runtime-callable tool — correctly rejected under that frame.
  - Updated v1 Architecture direction evaluates it as a **pattern source**: the stage-contract pipeline architecture (planning → analysis → code generation with typed artifact handoffs) is directly applicable to Directive lifecycle improvement.
  - The RAG-augmented configuration pattern is independently valuable for intake normalization.
- **Extractable mechanism:** stage-contract pipeline (input/output contracts per stage), artifact type schema, RAG-config pattern for source normalization.
- **v1 Architecture value:** formalize Directive lifecycle phase handoffs with typed artifacts; improve intake normalization with RAG-context pattern.
- **Explicitly excluded:** PaperCoder runtime (Python scripts, LLM API calls, PDF processing, dataset, benchmarks), Mission Control callable integration, any runtime dependency import.
- **Next-cycle bounded slice:**
  - Static reverse-engineering of `codes/` directory: read `1_planning.py`, `2_analyzing.py`, `3_coding.py` and extract (a) input type per stage, (b) output artifact type per stage, (c) handoff contract between stages, (d) error/fallback handling.
  - Deliverable: stage-contract schema document mapping Paper2Code pipeline stages to Directive Workspace lifecycle phases.
  - Timebox: 90 minutes.
  - Success criteria: schema document with >= 3 mapped stage contracts.
- **Risk:** Low (static analysis only). **Rollback:** delete experiment artifact.
- **Intake normalization prerequisite:**
  - move/restore active candidate pointer from `04-deferred-or-rejected/Paper2Code` to active intake tracking before experiment execution.

### defer_monitor (no action, periodic re-check)
- `swe-agent` — overlap with mini-swe-agent/Codex; re-entry if execution quality ceiling hit.
- `autoresearchclaw` — high complexity; re-entry if dedicated research-automation workstream starts.
- `autogen` — broad framework; re-entry if multi-agent orchestration becomes bottleneck.
- `openhands` — highest overlap, lowest score; re-entry only if unique observability pattern identified.

### still_reject (no re-entry planned)
- `minimal-agent-tutorial` — tutorial/reference only.
- `codescientist` — specialized paradigm, low ROI.
- `AI-Scientist` — heavyweight, high cost/risk.
- `DeepCode` — category saturation.

## queue execution update (2026-03-19)

### Paper2Code architecture slice executed
- Artifact: `02-experiments/2026-03-19-paper2code-directive-architecture-slice.md`
- Outcome: `adopt` (pattern-only, no runtime adoption)
- Extracted value accepted:
  - stage-contract handoff model (`intake -> analysis -> experiment design -> integration/proof`)
  - typed artifact schema proposal
  - fallback-aware parsing/contract validation pattern
- Explicit exclusions retained:
  - Paper2Code runtime pipeline, dependencies, benchmarks, and generated-repo stack.

## decision-cycle closure update (2026-03-19)
- Paper2Code closure status: `closed_this_cycle -> adopt_planned_next`.
- Decision artifact:
  - `03-adopted/2026-03-19-paper2code-directive-architecture-adopted-planned-next.md`
- Closure scope:
  - v1 architecture pattern adoption only (stage-contract + typed artifacts + fallback policy pattern).
  - no runtime/callable integration in this cycle.
- Next queue item remains:
  - `gpt-researcher` (static evidence/citation artifact extraction slice), unchanged.

## decision-cycle closure update (2026-03-19, gpt-researcher)
- gpt-researcher closure status: `closed_this_cycle -> adopt_planned_next`.
- Experiment artifact:
  - `02-experiments/2026-03-19-gpt-researcher-directive-architecture-slice.md`
- Decision artifact:
  - `03-adopted/2026-03-19-gpt-researcher-directive-architecture-adopted-planned-next.md`
- Extracted value accepted:
  - evidence object contract (web + MCP normalized entries)
  - citation/reference contract (visited URL references + learning citation map)
  - partial-result/fallback contract suitable for Directive artifact states
- Explicit exclusions retained:
  - runtime install/deployment, frontend/backend stack, callable promotion.
- Queue progression note:
  - this supersedes the prior "next queue item remains gpt-researcher" line;
  - next active queue candidate reverts to prioritized backlog order (`MetaClaw`, then `SWE-agent`, then `AutoResearchClaw`).
