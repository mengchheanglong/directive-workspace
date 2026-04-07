# Recheck Deferred/Rejected v2 (2026-03-19)

Updated: 2026-03-19 (Opus re-check under v1 Architecture criteria)

## lock status
- State: `LOCKED_BASELINE_ACTIVE`
- Locked on: `2026-03-19`
- Scope: Directive Architecture re-check classification baseline.
- Unlock rule: only change classifications via a new dated re-check artifact that explicitly references this file and explains deltas.

## scope
- Re-evaluated all records currently present in `04-deferred-or-rejected`.
- Applied updated direction:
  - v0 Runtime = callable capability lane
  - v1 Architecture = framework-improvement lane (reverse-engineer patterns/mechanisms, not runtime adoption)
  - v2 Discovery = planned future discovery lane
- Candidates are evaluated strictly as v1 Architecture reverse-engineering sources, NOT as runtime-callable integrations.

## reclassification rules
- `still_reject`: no near-term framework value or redundant/noise source.
- `defer_monitor`: has some value but not next-cycle priority under current constraints.
- `promote_to_queue`: merits a fresh bounded experiment in next cycle under extracted-pattern mode.

## file-level recheck (every record in 04/)

| Record | Old status | New status | Reason |
|---|---|---|---|
| `2026-03-18-low-tier-decisions.md` | batch reject/defer | `defer_monitor` | Batch contains mostly rejects, but `Paper2Code` is promoted for a fresh reverse-engineering slice under updated concept/paper->skill direction. |
| `2026-03-19-day3-parked-candidates.md` | parked/defer snapshot | `defer_monitor` | Historical parking note remains useful for context, but candidate-specific decisions now exist for its listed repos. |
| `2026-03-19-gpt-researcher-deferred.md` | defer | `promote_to_queue` | Prior blocker was host runtime instability (Python 3.14.3 numpy crash); updated direction allows reverse-engineering-first experiment without runtime truth adoption. |
| `2026-03-19-swe-agent-slice-8-deferred.md` | defer | `defer_monitor` | Useful patterns already extracted; overlap with mini-swe-agent/Codex remains high. |
| `2026-03-19-autoresearchclaw-slice-9-deferred.md` | defer | `defer_monitor` | High complexity remains; most valuable gating patterns already extracted. |
| `2026-03-19-autogen-slice-10-deferred.md` | defer | `defer_monitor` | Broad framework still high-cost; retain for periodic architectural reference checks. |
| `2026-03-19-openhands-slice-11-deferred.md` | defer | `defer_monitor` | Strong overlap with existing lanes; extracted boundary patterns already captured. |

## candidate-level normalization (from batch records)

### from `2026-03-18-low-tier-decisions.md`
- `Paper2Code` -> `promote_to_queue` (paper-to-implementation pipeline is now aligned with updated direction, but must be reverse-engineered pattern extraction only).
- `minimal-agent-tutorial` -> `still_reject` (tutorial/reference only, no direct capability surface).
- `codescientist` -> `still_reject` (specialized evolutionary paradigm, low incremental ROI now).
- `AI-Scientist` -> `still_reject` (heavyweight stack; cost/risk too high for current cycle).
- `DeepCode` -> `still_reject` (category saturation and weak differentiation evidence).

### from `2026-03-19-day3-parked-candidates.md`
- `metaclaw` -> superseded by adopted slice in `03-adopted`; keep parked note as `defer_monitor` historical context only.
- `swe-agent` -> superseded by candidate-specific defer record; remains `defer_monitor`.
- `autoresearchclaw` -> superseded by candidate-specific defer record; remains `defer_monitor`.
- `autogen` -> superseded by candidate-specific defer record; remains `defer_monitor`.
- `openhands` -> superseded by candidate-specific defer record; remains `defer_monitor`.

---

## detailed per-candidate v1 Architecture re-check

### 1. Paper2Code — `promote_to_queue`

#### 1. Extractable mechanism/pattern
- **Three-stage transformation pipeline**: planning → analysis → code generation, each with distinct LLM-driven stages (`1_planning.py`, `2_analyzing.py`, `3_coding.py`) plus a debugging/validation step (`4_debugging.py`).
- **Stage-contract pattern**: each stage produces structured artifacts (JSON plans, analysis docs, code files) consumed by the next stage. Clear input/output contracts per stage.
- **PDF-to-structured-input preprocessing**: `0_pdf_process.py` normalizes unstructured source material into a form the pipeline can consume.
- **RAG-augmented configuration**: `1.1_extract_config.py` and `1.2_rag_config.py` use retrieval-augmented generation to refine planning parameters from source material.

#### 2. Why it improves v1 Architecture specifically
- Directive Workspace's intake-to-decision lifecycle currently lacks a formal stage-contract model where each phase (intake → analysis → experiment → evaluation → decision → proof) produces typed artifacts consumed by the next phase.
- Paper2Code's planning→analysis→code pipeline is a concrete, working implementation of exactly this pattern.
- Extracting the stage-contract and artifact-schema pattern would give Directive Architecture a reusable mechanism for enforcing structured handoffs between lifecycle phases.
- The RAG-config pattern is directly applicable to improving how Directive Workspace consumes and normalizes external source material during intake.

#### 3. What is explicitly excluded
- The PaperCoder runtime itself (Python scripts, LLM API calls, PDF processing dependencies).
- OpenAI o3-mini / open-source model integration.
- The paper2code dataset and benchmark evaluation tooling.
- Any attempt to make Paper2Code callable from Mission Control.
- The debugging stage (`4_debugging.py`) — beyond current scope.

#### 4. Smallest bounded experiment (1 slice)
- **Objective**: Static reverse-engineering of the stage-contract pattern from Paper2Code's `codes/` directory.
- **Method**: Read `1_planning.py`, `2_analyzing.py`, `3_coding.py` and extract: (a) input type per stage, (b) output artifact type per stage, (c) handoff contract between stages, (d) error/fallback handling at stage boundaries.
- **Deliverable**: A stage-contract schema document mapping Paper2Code's pipeline stages to Directive Workspace lifecycle phases, with a concrete proposal for typed artifact handoffs.
- **Timebox**: 90 minutes (static analysis only, no runtime execution).
- **Success criteria**: Schema document produced with >= 3 mapped stage contracts.

#### 5. Risk + rollback
- **Risk**: Low. Static analysis only; no code execution, no dependency installation, no runtime changes.
- **Rollback**: Delete the experiment artifact from `02-experiments/`. No framework changes until the experiment is reviewed and a separate integration decision is made.

---

### 2. gpt-researcher — `promote_to_queue`

#### 1. Extractable mechanism/pattern
- **Research pipeline with citation-backed evidence**: structured research → source gathering → report generation with verifiable citations.
- **Parallelized agent research pattern**: multiple sub-agents explore different facets concurrently and merge results.
- **Report/evidence artifact contracts**: structured output format with citations, confidence levels, and source references.

#### 2. Why it improves v1 Architecture specifically
- Directive Workspace's analysis phase currently produces unstructured assessment text. gpt-researcher's evidence/citation pipeline pattern could formalize how analysis evidence is captured and made verifiable.
- The parallelized research pattern could improve how Directive Workspace handles multi-faceted candidate evaluation (architecture fit, operational risk, reusability scored from different evidence sources concurrently).

#### 3. What is explicitly excluded
- The gpt-researcher runtime (Python package, FastAPI backend, API keys).
- Direct installation or execution on host (prior blocker: Python 3.14.3 numpy crash).
- Any Mission Control callable integration.
- The NextJS frontend and LangSmith observability layer.

#### 4. Smallest bounded experiment (1 slice)
- **Objective**: Extract the report/citation/evidence artifact schema from gpt-researcher source code.
- **Method**: Static analysis of report generation modules — identify output schema, citation format, and evidence linking pattern.
- **Deliverable**: Evidence-artifact schema proposal for Directive Workspace analysis phase.
- **Timebox**: 60 minutes.
- **Success criteria**: Schema document with citation-linking pattern mapped to Directive analysis artifacts.

#### 5. Risk + rollback
- **Risk**: Low. Static analysis only. Prior runtime blocker (numpy crash on Python 3.14.3) is irrelevant for pattern extraction.
- **Rollback**: Delete experiment artifact. No framework changes.

---

### 3. swe-agent — `defer_monitor`

#### 1. Extractable mechanism/pattern
- Issue-lifecycle orchestration pattern (issue → exploration → edit → test → submit).
- YAML-based agent configuration.
- SWE-bench evaluation harness.

#### 2. Why NOT promoted now
- mini-swe-agent and Codex already cover the execution-agent lane.
- The orchestration pattern is well-understood and already partially extracted.
- No unique v1 Architecture mechanism that isn't available from existing adopted sources.

#### 3. What is explicitly excluded
- Runtime adoption as a coding agent.

#### 4. Re-entry condition
- Promote if mini-swe-agent/Codex execution quality hits a ceiling AND swe-agent's orchestration pattern offers a distinct improvement not available from existing sources.

#### 5. Risk + rollback
- No risk (no action taken). Monitor only.

---

### 4. autoresearchclaw — `defer_monitor`

#### 1. Extractable mechanism/pattern
- 23-stage research pipeline with stage-gating contracts.
- Multi-agent peer review pattern.
- Hardware-aware sandbox experiments.

#### 2. Why NOT promoted now
- High complexity (23 stages) makes extraction expensive relative to the simpler Paper2Code pipeline that covers the stage-contract pattern more cleanly.
- Most valuable gating patterns already extracted during prior triage.
- Paper2Code promotion covers the stage-contract need with lower cost.

#### 3. What is explicitly excluded
- Full pipeline adoption.
- MetaClaw integration layer.

#### 4. Re-entry condition
- Promote if a dedicated research-automation workstream starts, OR if Paper2Code experiment reveals stage-contract gaps that autoresearchclaw's 23-stage model addresses.

#### 5. Risk + rollback
- No risk (no action taken). Monitor only.

---

### 5. autogen — `defer_monitor`

#### 1. Extractable mechanism/pattern
- Agent-role/message-contract pattern (Core API).
- Multi-agent coordination protocols.
- AgentChat abstraction layer.

#### 2. Why NOT promoted now
- Broad framework with weak Directive-specific fit.
- OpenMOSS patterns (already adopted) cover multi-agent coordination for this workspace.
- Microsoft ecosystem adds adaptation cost without proportional v1 Architecture value.

#### 3. What is explicitly excluded
- Framework adoption or .NET integration.
- AutoGen Studio / no-code layer.

#### 4. Re-entry condition
- Promote if multi-agent orchestration becomes a primary bottleneck AND OpenMOSS patterns prove insufficient.

#### 5. Risk + rollback
- No risk (no action taken). Monitor only.

---

### 6. openhands — `defer_monitor`

#### 1. Extractable mechanism/pattern
- Composable SDK architecture (modular agent composition).
- Operator-facing telemetry/observability pattern.

#### 2. Why NOT promoted now
- Lowest score in remaining set (3.00). Highest overlap with Codex + mini-swe-agent.
- No unique v1 Architecture mechanism identified.
- Existing execution lanes already cover the development-agent need.

#### 3. What is explicitly excluded
- Runtime adoption as a development agent.

#### 4. Re-entry condition
- Promote only if a unique operator-observability or SDK-composition pattern is identified that is not available from existing sources.

#### 5. Risk + rollback
- No risk (no action taken). Monitor only.

---

### 7. Low-tier batch items (from `2026-03-18-low-tier-decisions.md`)

| Candidate | Decision | v1 Architecture rationale |
|---|---|---|
| `minimal-agent-tutorial` | `still_reject` | Tutorial/reference only. No extractable mechanism. |
| `codescientist` | `still_reject` | Specialized evolutionary paradigm. Low incremental ROI. Genetic mutation patterns don't map to Directive lifecycle improvement. |
| `AI-Scientist` | `still_reject` | Heavyweight automated discovery stack. Cost/risk far exceeds bounded extraction value. autoresearch + gpt-researcher cover the same patterns at lower cost. |
| `DeepCode` | `still_reject` | Category saturation. No unique mechanism not covered by existing coding-agent candidates. |

---

## Paper2Code deep rationale section

### Why old rejection happened
- Scored 2.75 (LOW tier) on 2026-03-18.
- Classified as "niche paper-to-code conversion" with "not aligned with Directive Workspace core loop."
- The evaluation frame at the time was **runtime-callable utility**: would this tool be useful to run as a callable service? Answer was no — the workspace doesn't need to convert academic papers into code repositories.
- Correctly rejected under the old frame: Paper2Code as a runtime tool has no fit.

### Why updated direction changes the outcome
- The v1 Architecture direction explicitly values **reverse-engineering mechanisms and patterns from external sources**, not running those sources as callable tools.
- Under v1 Architecture criteria, Paper2Code's value is NOT "convert papers to code" — it is the **stage-contract pipeline architecture** itself:
  1. **Structured source normalization** (`0_pdf_process.py`): unstructured input → normalized structured input. Maps to Directive intake normalization.
  2. **Planning stage** (`1_planning.py` + RAG config): source material → structured implementation plan with retrieved context. Maps to Directive analysis phase producing structured evaluation plans.
  3. **Analysis stage** (`2_analyzing.py`): plan → detailed component analysis with dependency mapping. Maps to Directive experiment design phase.
  4. **Code generation stage** (`3_coding.py`): analysis → implementation artifacts. Maps to Directive integration/proof phase producing concrete deliverables.
- Each stage has **explicit input/output contracts** and **artifact types** — exactly the pattern Directive Architecture needs to formalize its own lifecycle phase handoffs.
- The RAG-augmented configuration pattern (`1.1_extract_config.py`, `1.2_rag_config.py`) is independently valuable for improving how Directive Workspace consumes and contextualizes external source material during intake.

### Exact extracted artifacts/stages to map into Directive lifecycle

| Paper2Code stage | Script(s) | Artifact produced | Directive lifecycle phase mapping |
|---|---|---|---|
| Source normalization | `0_pdf_process.py` | Cleaned structured JSON from raw PDF | **Intake**: normalize raw source material (README, docs, code) into structured candidate record |
| Planning | `1_planning.py`, `1.1_extract_config.py`, `1.2_rag_config.py` | Implementation plan + RAG-refined config | **Analysis**: produce structured evaluation plan with retrieved context from existing knowledge |
| Analysis | `2_analyzing.py` | Component analysis with dependency mapping | **Experiment design**: detailed component analysis informing bounded experiment scope |
| Code generation | `3_coding.py` | Implementation artifacts (code files) | **Integration/proof**: concrete deliverable artifacts from approved decisions |
| Debugging/validation | `4_debugging.py` | Validated output | **Gate verification**: post-integration validation (future extraction if needed) |

### Clear boundary: no blind runtime adoption
- **Extract only**: stage-contract schema, artifact type definitions, and handoff patterns.
- **Do not import**: Python scripts, LLM API calls, PDF processing, dataset, benchmarks, or any runtime dependency.
- **Do not make callable**: Paper2Code will not become a Mission Control service or API.
- **Integration path**: extracted patterns are re-implemented natively in Directive Workspace TypeScript/Node.js stack, not wrapped or imported.

---

## promoted for next cycle (summary)

1. **`Paper2Code`** — extract stage-contract + artifact-schema pattern for Directive lifecycle phase handoffs.
2. **`gpt-researcher`** — extract evidence/citation pipeline pattern for Directive analysis artifacts.

## final reclassification table

| Candidate | Old status | New status | Rationale |
|---|---|---|---|
| Paper2Code | reject (score 2.75) | `promote_to_queue` | Stage-contract pipeline architecture directly applicable to v1 Architecture lifecycle improvement |
| gpt-researcher | defer (runtime instability) | `promote_to_queue` | Evidence/citation pattern extractable via static analysis; prior runtime blocker irrelevant |
| swe-agent | defer | `defer_monitor` | Overlap with existing lanes; no unique v1 Architecture mechanism |
| autoresearchclaw | defer | `defer_monitor` | High complexity; Paper2Code covers stage-contract need at lower cost |
| autogen | defer | `defer_monitor` | Broad framework; OpenMOSS patterns already cover multi-agent need |
| openhands | defer | `defer_monitor` | Lowest score; highest overlap; no unique mechanism |
| minimal-agent-tutorial | reject | `still_reject` | Tutorial only |
| codescientist | reject | `still_reject` | Specialized paradigm, low ROI |
| AI-Scientist | reject | `still_reject` | Heavyweight, high cost/risk |
| DeepCode | reject | `still_reject` | Category saturation |
