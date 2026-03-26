# Adopted Candidates v1 Architecture Re-check (2026-03-19)

## purpose
Quick re-check of all 9 candidates currently in `03-adopted` with `planned-next` status.
Validates fit against the current v1 Architecture direction lock.

## direction context
- v0 Runtime = callable/runtime adoption lane
- v1 Architecture = reverse-engineering + pattern extraction to improve Directive Workspace framework
- v2 Discovery = future intake expansion
- Lock reference: `05-reference-patterns/2026-03-19-directive-v1-architecture-recheck-lock.md`

## re-check criteria
For each candidate:
1. Was the adoption rationale framed as v1 Architecture (pattern extraction)?
2. Does the extracted mechanism improve the Directive framework itself?
3. Do the planned-next steps stay within v1 Architecture scope, or do they drift into v0 Runtime (runtime/callable)?
4. Is there overlap/conflict with other adopted candidates?

---

## re-check results

### 1. autoresearch (Slice 1) — `keep_as_adopted` with lane-boundary note

- **Old rationale:** Documentation-only integration contract (bounded run template + operator rules) for Directive Workspace execution lane.
- **v1 Architecture fit:** Partial. The bounded-run template pattern (how to structure experiments with iteration count, metric capture, operator rules) is a reusable framework-improvement pattern. However, the adoption note explicitly says "Directive Workspace execution lane" and the planned-next step is "execute one real bounded run" — this is v0 Runtime (runtime execution), not v1 Architecture.
- **Overlap:** Low. No conflict with other adopted patterns.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** Bounded experiment template structure (iteration count, metric delta capture, operator rules as reusable pattern for Directive experiment design).
- **Lane-boundary note:** The planned-next "execute one real bounded run" step should be tracked as a v0 Runtime follow-up, not a v1 Architecture task. The extracted template pattern itself is v1 Architecture.

### 2. agentics (Slice 2) — `keep_as_adopted` with lane-boundary note

- **Old rationale:** Translated two workflow patterns into Mission Control playbook templates (Daily Status Digest, Docs Maintenance Sweep).
- **v1 Architecture fit:** Partial. The playbook template patterns (structured digest format, maintenance sweep cadence) are framework-improvement patterns that improve Directive operational procedures. However, the planned-next "run one live Daily Status Digest" is v0 Runtime (runtime execution).
- **Overlap:** Low. Digest/sweep patterns are unique — no other candidate covers operational cadence patterns.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** Structured operational playbook templates (digest format, sweep cadence) as reusable patterns for Directive Workspace operational lifecycle.
- **Lane-boundary note:** Live playbook execution belongs in v0 Runtime. The template patterns themselves are v1 Architecture.

### 3. mini-swe-agent (Slice 3) — `keep_as_adopted` with lane-boundary note

- **Old rationale:** Extracted fallback execution pattern/interface. Policy: adopt pattern only, do not absorb full runtime.
- **v1 Architecture fit:** Partial. The fallback-lane-separation pattern (primary lane + deterministic-rehearsal fallback lane) is a valid framework-level pattern for Directive execution reliability. However, planned-next steps (wrapper script, host preflight checks, live fallback run) are v0 Runtime (runtime implementation).
- **Overlap:** Moderate with swe-agent (deferred) — but mini-swe-agent covers the lightweight fallback pattern specifically, while swe-agent was deferred for heavyweight overlap with Codex.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** Fallback-lane-separation pattern (primary + rehearsal-gated fallback) and deterministic-rehearsal-before-live-run policy.
- **Lane-boundary note:** Wrapper script and runtime preflight implementation belong in v0 Runtime. The fallback pattern itself is v1 Architecture.

### 4. gh-aw (Slice 4) — `keep_as_adopted` (clean fit)

- **Old rationale:** Extracted architecture patterns: read-only agent lane, compile-time lock artifact, sanitization policy, tracker/workflow identifiers.
- **v1 Architecture fit:** Strong. All four patterns directly improve Directive Workspace promotion contracts, observability, and safety boundaries. No runtime integration performed.
- **Overlap:** Low. Read-only/write-lane separation is unique to this candidate.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** (1) Read-only/write-lane agent separation, (2) compile-time lock artifact as execution contract, (3) sanitization policy surface, (4) tracker/workflow identifiers for auditability.

### 5. openmoss (Slice 5) — `keep_as_adopted` (clean fit)

- **Old rationale:** Extracted role-gated state transition matrix, review-score mapping, recovery path for blocked work.
- **v1 Architecture fit:** Strong. Role-gated transitions and review-driven scoring directly improve Directive lifecycle quality and decision mechanisms. No runtime integration performed.
- **Overlap:** Low. State-transition matrix is unique; review-score mapping complements scientify's quality-gate triplet.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** (1) Role-gated state transition matrix, (2) review-score to reward/penalty mapping, (3) blocked-work recovery path (detect → reassign → resume).

### 6. scientify (Slice 6) — `keep_as_adopted` (clean fit)

- **Old rationale:** Extracted promotion quality-gate triplet, deterministic downgrade policy, validation-state taxonomy, rendered quality telemetry.
- **v1 Architecture fit:** Strong. All four patterns directly improve Directive promotion/handoff quality control. No runtime integration performed.
- **Overlap:** Complementary with openmoss (Slice 5) — scientify covers promotion gates, openmoss covers lifecycle transitions. No conflict.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** (1) Quality-gate triplet with fail-reason strings, (2) deterministic downgrade to `degraded_quality`, (3) validation-state taxonomy with external validation loop, (4) rendered quality telemetry in decision artifacts.

### 7. metaclaw (Slice 7) — `keep_as_adopted` (clean fit)

- **Old rationale:** Extracted progressive mode-gating, scheduler-gated high-risk updates, explicit proxy contract boundaries.
- **v1 Architecture fit:** Strong. Mode-gating and scheduler-gated risk management directly improve Directive policy enforcement. No runtime/RL stack adopted.
- **Overlap:** Low. Mode-gating pattern is unique.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** (1) Progressive mode-gating (`baseline` → `elevated` by explicit policy), (2) scheduler-gated high-risk update lane, (3) proxy contract boundaries (auth + health + protocol).

### 8. Paper2Code (Architecture Slice) — `keep_as_adopted` (clean fit)

- **Old rationale:** Extracted stage-contract pipeline pattern, typed artifact model, fallback-aware parsing/contract validation.
- **v1 Architecture fit:** Strong. Stage-contract pattern directly addresses Directive lifecycle phase handoff formalization. Adopted under explicit v1 Architecture direction.
- **Overlap:** Complementary with gpt-researcher (evidence artifacts feed into stage handoffs). No conflict.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** (1) Stage-contract handoff model (`intake → analysis → experiment design → integration/proof`), (2) typed artifact schema (`IntakeNormalizedArtifact`, `AnalysisPlanArtifact`, etc.), (3) fallback-aware parsing/handoff validation.

### 9. gpt-researcher (Architecture Slice) — `keep_as_adopted` (clean fit)

- **Old rationale:** Extracted evidence unit normalization, citation/reference contracts, partial-result handling.
- **v1 Architecture fit:** Strong. Evidence and citation contracts directly improve Directive analysis artifact quality. Adopted under explicit v1 Architecture direction.
- **Overlap:** Complementary with Paper2Code (evidence artifacts + stage contracts form a coherent architecture improvement set). No conflict.
- **Decision:** `keep_as_adopted`
- **Retained mechanism:** (1) Evidence unit normalization (web + MCP shapes), (2) citation/reference contract (visited URL references + learning-citation map), (3) report/evaluation metadata contract, (4) partial/failure degradation pattern.

---

## overlap/conflict matrix

| Pair | Relationship | Conflict? |
|---|---|---|
| openmoss + scientify | Complementary (lifecycle transitions + promotion gates) | No |
| Paper2Code + gpt-researcher | Complementary (stage contracts + evidence artifacts) | No |
| mini-swe-agent + swe-agent (deferred) | mini-swe covers lightweight fallback; swe-agent deferred for heavyweight overlap | No (swe-agent deferred) |
| gh-aw + metaclaw | Complementary (safety boundaries + mode-gating) | No |
| autoresearch + agentics | Independent (experiment templates + operational playbooks) | No |

No conflicts detected across the adopted set.

---

## lane-boundary summary

Three early-batch candidates (autoresearch, agentics, mini-swe-agent) were adopted before the v1 Architecture / v0 Runtime lane distinction was formalized. Their extracted patterns are valid v1 Architecture contributions, but their planned-next implementation steps blur into v0 Runtime territory:

| Candidate | Extracted pattern (v1 Architecture) | Planned-next step (v0 Runtime drift) |
|---|---|---|
| autoresearch | Bounded experiment template | "Execute one real bounded run" |
| agentics | Operational playbook templates | "Run one live Daily Status Digest" |
| mini-swe-agent | Fallback-lane-separation pattern | "Add wrapper script, host preflight checks" |

**Recommendation:** Keep all three adopted for their extracted patterns. Tag their planned-next runtime steps as v0 Runtime follow-ups in future planning, not v1 Architecture tasks.

## transfer record

The lane-boundary runtime follow-ups have been transferred to v0 Runtime backlog here:

- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\follow-up\DIRECTIVE_RUNTIME_HANDOFF_FROM_V1_RECHECK_2026-03-19.md`

## Normalization annotation (retroactive, 2026-03-22)

Added by corpus normalization program. This record predates the source-adaptation contracts and is exempt from retroactive rewrite per `architecture-artifact-lifecycle` contract.

### Lifecycle classification

- Origin: `internally-generated` (governance validation of existing adopted set)
- Usefulness level: **`meta`** — this re-check validated the routing quality of all 9 Wave 1 candidates, ensuring correct Architecture-vs-Runtime lane classification
- Meta-usefulness category: `routing_quality`
- Status class: `product_materialized` — the recheck produced the locked reference pattern (`directive-v1-architecture-recheck-lock`) and the Runtime handoff transfer record
- Runtime threshold check: yes — the routing validation and lane-boundary governance are valuable without a runtime surface

### Self-improvement evidence (retroactive identification)

- Category: `routing_quality`
- Claim: The re-check improved Architecture routing by validating 9 candidates against v1 Architecture criteria and identifying 3 with planned-next steps that drift into Runtime territory
- Mechanism: Per-candidate recheck with explicit keep/reclassify decision + lane-boundary summary + Runtime handoff transfer
- Baseline observation: Before this re-check, 3 candidates (autoresearch, agentics, mini-swe-agent) had planned-next steps that blurred Architecture/Runtime boundaries
- Expected effect: Future planning correctly routes runtime implementation to Runtime instead of treating it as Architecture work
- Verification method: `next_cycle_comparison` — verify that the transferred Runtime follow-ups are tracked in Runtime, not Architecture

### Contract coverage assessment

- Source analysis: n/a (internal governance, not source-driven)
- Adaptation decision: n/a
- Adoption criteria: not applied (pre-doctrine), but the record's own re-check criteria function as an equivalent
- Adaptation quality: n/a (governance record, not source adaptation)
