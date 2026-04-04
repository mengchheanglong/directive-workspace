# Directive Workspace Operating Model v2

Date: 2026-03-27
Status: historical/reference document
Origin: Local truth analysis + internet research

This document is preserved as historical diagnosis and design context. Active doctrine now lives in `../CLAUDE.md`, with active run priority in `../control/runbook/current-priority.md`. Use `./README.md` before treating any `knowledge/` document as current authority.

---

## 1. Live Diagnosis

**Maturity category: Post-proving, pre-velocity.**

The system has successfully proven every major workflow seam. The state report lists 15 proven capabilities. The composition checker passes. Opener functions enforce gates. Idempotency is verified. Negative-path validation works.

### By the numbers

| Metric | Count |
|--------|-------|
| Queue entries | 49 |
| Engine runs | 27 |
| Live anchors | 6 |
| Architecture experiment files | 166 (~23 cases, 7.2 artifacts/case avg) |
| Runtime follow-ups | 45 (38 never advanced — 84% stall rate) |
| Discovery intake records | 55 |
| Discovery triage records | 31 |
| Discovery routing records | 90 |
| shared/lib files | 52 |
| Contracts | 57 |
| Engine files | 12 |
| Scripts | 9 |

**The system is infrastructure-rich and throughput-poor.** The ratio of proven infrastructure to actual product value delivered is very high. Scientify is the only case that produced real implemented code. Paper2Code went through 4 Architecture stages to conclude "the pattern is interesting but no code change is justified" — 5 artifacts for a "noted, park it" outcome.

---

## 2. Friction Map

### Friction 1: Every case uses the same long chain regardless of confidence or value

Paper2Code and Scientify went through the same Discovery front door and the same artifact chain. Scientify produced 4 implemented TypeScript modules. Paper2Code produced a "stay_experimental" note. Both required the same number of operator-session steps.

**The problem:** There is no triage gate that says "this case is exploratory — record the finding and stop" vs "this case has concrete extractable value — go deep."

### Friction 2: The Architecture chain is 9+ stages deep for every case

The Architecture lane has: handoff → bounded-start → bounded-result → adoption-decision → adopted → implementation-target → implementation-result → retained → integration-record → consumption-record → post-consumption-evaluation. That is 11 stages. The system does not distinguish between "this source taught us something useful that we should note" and "this source contains a concrete mechanism we should adopt into operating code."

### Friction 3: Artifact-per-step creates bookkeeping that feels like progress

Each step produces a markdown file and often a JSON decision file. The operator must: refresh truth → audit state → execute one step → verify checks → report structured output. This 5-phase ceremony per step was essential when the system was unproven. Now that every opener is verified, every checker passes, and every state transition is tested — the ceremony protects against risks that are already mitigated.

### Friction 4: The Runtime lane has an 84% stall rate

45 follow-ups, 7 records. The system creates follow-up stubs automatically when a route is approved, but most never advance. These stubs are not harmful but create noise.

### Friction 5: The "one step per session" rule prevents batching

The truth-anchor workflow explicitly says: execute one bounded step. But steps like "open handoff + start bounded-start + close bounded-result" for a confirmatory Architecture case are tightly coupled and could be one move.

### Friction 6: Discovery creates 3+ artifacts for every source regardless

Every source through the front door produces: intake record, triage record, routing record, engine run record, engine run report. That is 5 files. For sources that are clearly going to be parked or noted, this is overhead.

---

## 3. Internet Research Summary

### Pattern 1: Shape Up Circuit Breaker and Appetite

**Source:** [Basecamp Shape Up — Decide When to Stop](https://basecamp.com/shapeup/3.5-chapter-14)

Shape Up sets a fixed **appetite** (time budget) upfront and uses a **circuit breaker** — if work is not done when time runs out, it stops by default. Extension requires proving all remaining work is "downhill" (no unknowns left). Work that still has unknowns goes back to shaping rather than continuing forward.

**Why it matters here:** Directive Workspace has no circuit breaker. Every case that enters the chain continues forward until an operator manually parks it. There is no default-stop. Paper2Code went through 4 Architecture stages to reach "stay_experimental" — a circuit breaker at the routing stage could have caught that this was exploratory, set a one-step appetite, and stopped after a single bounded analysis.

**Borrow:** Default-stop after bounded-result unless explicit extension criteria are met. Set appetite (depth) at triage time.
**Do not copy:** Shape Up's specific 6-week cycles — Directive Workspace is not sprint-based.

### Pattern 2: Proportional Design Docs (Uber/Google Pattern)

**Source:** [Pragmatic Engineer — RFCs and Design Docs](https://newsletter.pragmaticengineer.com/p/rfcs-and-design-docs)

Uber created **lightweight templates for team-scoped changes** and **heavyweight templates for organization-wide impacts**. The rule: "For small changes: don't bother. For non-trivial changes with dependencies: consider writing one. Effort should be proportionate to complexity."

**Why it matters here:** Directive Workspace uses one chain depth for every case. Scientify (which produced real code) used the same chain as Paper2Code (which produced a note). The proportionality principle says: classify cases early, match process depth to actual value/risk.

**Borrow:** Named tiers with different artifact requirements.
**Do not copy:** The specific template structure — Directive Workspace already has good templates.

### Pattern 3: Lightweight Architecture Decision Records (Thoughtworks)

**Source:** [Thoughtworks — Lightweight ADRs](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)

ADRs capture a decision and its rationale in a single short document. The key insight: "different decision making instruments being treated with different levels of care, allowing for appropriate risk tolerance and speed of decision making."

**Why it matters here:** Many Architecture cases could be a single ADR-style record instead of a 4-7 artifact chain. "Paper2Code's pipeline pattern is interesting but not actionable yet" is a one-document decision, not a 4-artifact chain.

**Borrow:** Single-artifact decision records for confirmatory/exploratory cases.
**Do not copy:** ADR's assumption that all decisions are architecture decisions — Directive Workspace has Runtime and Discovery too.

### Pattern 4: Lightweight Technology Governance (Thoughtworks)

**Source:** [Thoughtworks — Lightweight Technology Governance](https://www.thoughtworks.com/insights/articles/lightweight-technology-governance)

Six principles: move from mandate to vision, automate compliance, enlist gatekeepers as collaborators, provide paved roads, radiate information, get comfortable with evolution. Core idea: **governance effort should be proportional to risk, and automated where possible.**

**Why it matters here:** The opener functions already automate gate enforcement. The composition checker already automates compliance. But the operator ceremony (5-phase truth-anchor per step) is still manual for every case. The governance is in the code — the human ceremony can be lighter.

**Borrow:** Trust the automated gates more. Reduce human ceremony where programmatic checks already cover the risk.
**Do not copy:** Platform-team-specific org structures.

### Pattern 5: Golden Paths (Spotify/Netflix)

**Source:** [Spotify Engineering — Golden Paths](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem)

Golden Paths are opinionated default workflows that reduce cognitive load by making the compliant path the easiest one. Developers can deviate but the default is well-lit.

**Why it matters here:** Directive Workspace needs a default path per case type. Right now every case requires the operator to manually decide the next step. A golden path would say: "Architecture exploratory case → intake + one-shot analysis note → done unless explicitly extended."

**Borrow:** Named default paths per case type.
**Do not copy:** Developer self-service tooling — Directive Workspace is human-operated.

### Pattern 6: Software Engineering Triage Lifecycle

**Source:** [Triage in Software Engineering: A Systematic Review](https://arxiv.org/html/2511.08607v1)

Triage has four stages: intake/preprocessing, prioritization, assignment, resolution. The key insight: **classify early and route to different depth tracks.** Lower-acuity cases get shortened workflows.

**Why it matters here:** The Engine already routes to lanes (Discovery/Architecture/Runtime). But within each lane, there is no acuity/depth classification. All Architecture cases go through the same chain. A triage step at routing could classify: note-only, standard, deep.

**Borrow:** Depth classification at routing time.
**Do not copy:** Automated assignment — Directive Workspace has one operator.

---

## 4. Three Operating Modes

Replace the current one-size-fits-all chain with three named modes, decided at triage time:

### Mode 1: NOTE (Quick record, default stop)

- **When:** Source is interesting but not product-actionable. Confirmatory findings. Low confidence routing. Exploratory assessment.
- **Artifacts:** Discovery front door (intake + triage + routing) → one analysis note → done.
- **Architecture version:** Handoff → single bounded-result with verdict `noted`. No bounded-start needed.
- **Runtime version:** Follow-up stub → `parked_after_review`. No record opened.
- **Total artifacts:** 4-6 (Discovery set + 1 note)
- **Total operator steps:** 1-2 (intake + note)

### Mode 2: STANDARD (Bounded chain, circuit breaker at result)

- **When:** Source has concrete extractable value. Clear adoption target. Moderate confidence.
- **Artifacts:** Full Discovery front door → lane-appropriate chain up to bounded-result (Architecture) or capability-boundary (Runtime). **Default stop at result/boundary** — extension requires explicit justification.
- **Architecture version:** Handoff → bounded-start → bounded-result → stop unless adoption criteria are met.
- **Runtime version:** Follow-up → record → proof → capability-boundary → stop unless promotion criteria are met.
- **Batching allowed:** Tightly coupled steps (e.g., handoff + start, or record + proof) can be done in one session.
- **Total operator steps:** 2-4

### Mode 3: DEEP (Full chain, explicit extension at each gate)

- **When:** Source is being implemented into real code or real Engine changes. High-value, high-risk. Seam-opening work.
- **Artifacts:** Full chain including implementation, retention, integration, consumption, evaluation.
- **Architecture version:** Full 11-stage chain where each stage adds real value.
- **Runtime version:** Full chain through promotion-readiness and eventually host integration.
- **Step-per-session rule applies** for seam-opening work only.
- **Total operator steps:** 5+

### Decision Rule: How to Choose the Mode

At Discovery routing (or at the start of any downstream session), classify using this 3-question filter:

1. **Does this source produce concrete code, contracts, or Engine changes?** → If no → **NOTE**.
2. **Is the adoption target clear and the confidence moderate-to-high?** → If yes → **STANDARD**.
3. **Does this open a new seam, introduce real runtime capability, or change Engine operating code?** → If yes → **DEEP**.

If unsure between NOTE and STANDARD, default to NOTE. The circuit breaker principle: you can always upgrade a NOTE to STANDARD later, but you cannot undo the artifact overhead of an unnecessary STANDARD chain.

---

## 5. Stop-Line Rules

- **NOTE mode:** Stop after the analysis note. No continuation unless the operator explicitly decides the case has become product-actionable.
- **STANDARD mode:** Stop at bounded-result (Architecture) or capability-boundary (Runtime). Extension to the next stage requires answering: "What concrete product artifact does the next step produce that does not exist yet?"
- **DEEP mode:** Stop at each gate. Each extension requires: "Is the remaining work downhill (no unknowns)?"
- **Universal rule:** If a case has been `stay_experimental` or `needs-more-evidence` for 2+ sessions without new evidence, it is **parked**, not continued.

---

## 6. Batching Rules

- **Tightly coupled steps may be batched into one session** when:
  - The output of step N is a mechanical prerequisite for step N+1 (e.g., handoff → start)
  - No human judgment decision separates them
  - Both steps are in the same lane
- **Steps that should NOT be batched:**
  - Routing decision + downstream execution (the routing decision is a judgment call)
  - Implementation + proof (implementation may reveal issues that change the proof)
  - Anything that opens a new seam

---

## 7. Parking Rules

- A case is **parked** when it reaches a natural stop-line and no immediate next move is justified.
- Parked cases stay in the queue with their current status. No cleanup needed.
- A parked case can be **reopened** only by explicit operator decision with a stated reason.
- Reopened cases re-enter at their current stage, not from Discovery.
- Reopening does not retroactively change prior verdicts.
- Parked cases do not generate "next best move" suggestions.

---

## 8. Reopen Rules

- To reopen a parked case, the operator must state what new evidence or mission change justifies continuation.
- Reopened cases re-enter at their current stage, not from Discovery.
- Reopening does not retroactively change prior verdicts.

---

## 9. Concrete Replacement Policy

```
DIRECTIVE WORKSPACE OPERATING POLICY v2

BEFORE EVERY TASK:
  1. What case am I working on?
  2. What mode? (NOTE / STANDARD / DEEP)
  3. What is the stop-line for this session?

MODE SELECTION:
  - No concrete code/contract/Engine change expected → NOTE
  - Clear adoption target, moderate+ confidence      → STANDARD
  - Real implementation or seam-opening              → DEEP

NOTE MODE:
  - Discovery front door → one analysis note → done
  - Architecture: skip bounded-start, write result directly
  - Runtime: mark follow-up as reviewed, park
  - Max artifacts: 1 beyond Discovery set
  - Max sessions: 1

STANDARD MODE:
  - Full Discovery → lane chain up to result/boundary
  - Batch tightly coupled steps (handoff+start, record+proof)
  - Default stop at bounded-result or capability-boundary
  - Extension only if: concrete product artifact will be produced
  - Max sessions: 2-4

DEEP MODE:
  - Full chain, step by step
  - Each step produces real value (code, contracts, Engine changes)
  - Step-per-session for seam-opening work
  - Each extension justified explicitly

STOP RULES:
  - If verdict is stay_experimental → park, do not continue
  - If verdict is needs-more-evidence for 2+ sessions → park
  - If next step is "more formalization" not "more value" → stop
  - If confidence is low after analysis → NOTE mode, stop

BATCH RULES:
  - Mechanical prerequisites → batch
  - Judgment calls → do not batch
  - Same lane, no seam → batch OK
  - Cross-lane or seam-opening → do not batch

CEREMONY REDUCTION:
  - Trust automated checks (npm run check)
  - State report replaces manual truth-refresh narrative
  - Skip "Phase N" ceremony headers for NOTE mode
  - Structured output required only for DEEP mode
```

---

## 10. Quick Decision Checklist (before every task)

```
□ What case?
□ What mode? (NOTE / STANDARD / DEEP)
□ What is the stop-line?
□ Am I producing value or artifacts?
□ Can I batch the next 2-3 steps?
□ Has this case been parked before? Why am I reopening it?
```

---

## 11. Stop-Line Checklist (to prevent overcontinuation)

```
□ Is the next step producing a concrete product artifact (code, contract, Engine change)?
  → If no → STOP
□ Is the verdict stay_experimental or needs-more-evidence?
  → If yes → PARK, do not open the next stage
□ Have I been working on this case for 2+ sessions with no new evidence?
  → If yes → PARK
□ Am I opening a new seam or just completing bookkeeping?
  → If bookkeeping → STOP or BATCH into one move
□ Would I be embarrassed if someone asked "what real product value did step N+1 add?"
  → If yes → STOP
```

---

## 12. Migration Plan

1. **Immediate (no code changes):** Start using the 3-mode classification in the next session. The existing openers, chains, and checkers all still work. The change is in operator behavior, not infrastructure.

2. **Short-term (doctrine update):** Update `directive-workspace/CLAUDE.md` to include the operating policy. Add a `## Operating modes` section with the NOTE/STANDARD/DEEP definitions and decision rules.

3. **Medium-term (optional infrastructure):** Add a `mode` field to the Discovery intake queue entries so the queue shows which cases are NOTE vs STANDARD vs DEEP. This is a one-field addition to the queue schema, not a new system.

4. **Not required:** No opener changes. No state resolver changes. No checker changes. The existing infrastructure supports all three modes — the Architecture chain can stop at any stage, and the Runtime chain already has natural stop-lines. The change is in when the operator chooses to stop, not in what the system allows.

---

## 13. House Rule (for future sessions)

```
HOUSE RULE: Proportional ceremony.
- Classify every case as NOTE, STANDARD, or DEEP before starting.
- NOTE: 1 session, 1 artifact beyond Discovery, default stop.
- STANDARD: 2-4 sessions, batch tightly coupled steps, stop at result/boundary.
- DEEP: full chain, step-per-session for seam work only.
- Do not continue a case past its stop-line without explicit justification.
- "More formalization" is not the same as "more value."
- Trust npm run check. Skip manual truth-refresh narrative for NOTE mode.
```

---

## 14. Top Recommendation

**The single highest-leverage change: Classify every case at triage and default to NOTE mode.**

Why this is the highest-leverage change:

- It immediately eliminates the problem where every source goes through the same long chain
- It respects the existing infrastructure without changing any code
- It can be applied starting in the next session
- It preserves Discovery as the front door and preserves lane distinctions
- It reframes the operator's job from "advance the chain" to "decide how deep to go"
- It makes parking the default outcome for exploratory work instead of continuation
- It directly addresses the core pain: "too many rounds feel like chain-completion bookkeeping instead of real product progress"

The current system was built for a world where every chain needed proving. That world is over. The chains are proven. The question now is not "can the chain work?" but "which cases deserve the full chain?" The answer is: fewer than you think. Default to NOTE. Upgrade when justified.

---

## 15. What the Current System Does Well

For the record, these strengths should be preserved:

1. **Truthful state resolution** — `dw-state.ts` is a real canonical read surface that prevents drift
2. **Automated gate enforcement** — openers check eligibility before creating artifacts
3. **Composition checking** — `npm run check` catches broken links and invalid states
4. **Lane clarity** — Discovery/Architecture/Runtime distinctions are meaningful and well-enforced
5. **Rollback boundaries** — every artifact has an explicit rollback path
6. **Idempotent openers** — running an opener twice does not create duplicate artifacts
7. **Non-executing promotion** — the system explicitly separates "ready to promote" from "promoted"
8. **Discovery front door** — every source enters through the same shared Engine analysis

These are real product strengths. The operating model change preserves all of them.

---

## Sources

- [Basecamp Shape Up — Decide When to Stop](https://basecamp.com/shapeup/3.5-chapter-14)
- [Basecamp Shape Up — Set Boundaries (Appetite)](https://basecamp.com/shapeup/1.2-chapter-03)
- [Pragmatic Engineer — RFCs and Design Docs](https://newsletter.pragmaticengineer.com/p/rfcs-and-design-docs)
- [Thoughtworks — Lightweight Architecture Decision Records](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)
- [Thoughtworks — Lightweight Technology Governance](https://www.thoughtworks.com/insights/articles/lightweight-technology-governance)
- [Spotify Engineering — Golden Paths](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem)
- [Triage in Software Engineering: A Systematic Review](https://arxiv.org/html/2511.08607v1)
- [Architecture Decision Records](https://adr.github.io/)
- [UK Government ADR Framework (2025)](https://technology.blog.gov.uk/2025/12/08/the-architecture-decision-record-adr-framework-making-better-technology-decisions-across-the-public-sector/)
- [AWS — ADR Best Practices](https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/)
