# CLAUDE.md

## Product identity

Directive Workspace is a **goal-driven capability evolution product**.

Its purpose is to help improve the user’s system based on the user’s active goal by:
- consuming external sources
- identifying mission-relevant usefulness
- extracting useful value
- adapting and improving that value
- proving it safely
- integrating it in Directive-owned form

Directive Workspace is not:
- a repo catalog
- a passive notes archive
- a paper summary system
- a coding-only evaluator
- a host feature inside Mission Control
- a loose collection of Discovery / Runtime / Architecture folders

Directive Workspace **is**:
a self-improving source adaptation system that turns sources into mission-relevant usefulness and becomes better over time at doing so.

## Correct hierarchy

Directive Workspace is the **whole product**.

Inside Directive Workspace, the **Engine** is the shared adaptation core.

Discovery, Runtime, and Architecture are the **three main operating lanes of the Engine**.

The correct hierarchy is:

- Directive Workspace
  - Engine
    - Discovery lane
    - Runtime lane
    - Architecture lane

Do not treat Discovery / Runtime / Architecture as loose peer products.
Do not collapse Engine into Architecture.
Architecture is the lane closest to the current mission because the current mission is to improve the Engine itself.

## Core engine definition

Engine is the shared adaptation core inside Directive Workspace.

Engine owns the common machinery across all lanes, including:
- mission / goal interpretation
- source normalization
- usefulness judgment
- default usefulness rationale
- routing logic
- extraction planning
- adaptation planning
- improvement planning
- proof / evaluation coordination
- decision handling
- integration coordination
- reporting coordination
- lifecycle tracking
- cross-lane handoff logic
- record / contract / registry coordination

If a piece of logic is shared across Discovery, Runtime, and Architecture, it likely belongs to Engine.

## Canonical workflow

The governing workflow is:

**Source → Analyze → Route → Extract → Adapt → Improve → Prove → Decide → Integrate + Report**

Important:
- **Decide** is required
- **Report** is required
- do not shorten the governing workflow in a way that drops either one

The system should not merely adopt useful things from sources.
It should:
- extract useful value
- adapt it to Directive Workspace
- improve on top of it when appropriate
- prove it
- decide on it
- integrate it in Directive-owned form
- report the outcome

The stronger rule is:

**extract → adapt → improve → prove → decide → integrate + report**

not merely:

**extract → adopt**

## Source entry rule

Every source enters through **Discovery** first.

Sources may include:
- GitHub repositories
- research papers
- tools
- frameworks
- methods
- workflows
- external systems
- other source material with extractable value

`External source` means either:
- a source already present inside the current system or context that has not yet been processed or still provides useful pressure
- a source outside the current system or context, including a newly found online source, when the currently available sources no longer provide useful pressure or the system has hit a bottleneck

In both cases, source selection remains mission-conditioned, and Discovery is still the required front door before any downstream lane work.

Raw source material belongs under `sources/`.

Do not treat transformed derivative work as raw source material.

## Discovery lane

Discovery is the **goal-aware intake, filtering, and routing lane**.

Discovery exists to:
- collect sources efficiently
- analyze sources against the active mission
- determine whether a source contains useful value
- identify extraction candidates
- identify risks and boundaries
- identify improvement opportunities on top of the source
- decide whether the source should route to Runtime or Architecture
- maintain capability-gap visibility
- keep source collection and filtering efficient

Discovery is not just intake.

Its real outputs include:
- usefulness judgment
- extraction candidates
- routing decision
- initial boundary/proof notes
- capability-gap linkage
- source triage and queue state

The shared usefulness and routing judgment machinery is Engine-owned.
Discovery consumes and records that shared judgment at the front door.
Discovery should not become a separate owner of duplicated mission-fit or usefulness heuristics.
Engine should also emit the default usefulness rationale into its own analysis/report outputs so downstream lanes do not have to reconstruct the explanation from raw routing signals alone.

Discovery is mainly the **efficiency layer** for collection, filtering, and routing.

## Runtime lane

Runtime is the **runtime usefulness conversion lane**.

Route to Runtime when the extracted value should become:
- a reusable skill
- a callable capability
- a source-pack
- a runtime workflow
- a repeated execution surface
- a reusable operational asset the user will call again

Runtime is responsible for converting extracted usefulness into Directive-owned runtime capability.

Runtime is the primary home of **behavior-preserving transformation** when the transformed result becomes reusable runtime capability.

Examples include:
- bad code → good code
- messy code → cleaner code
- slow code → faster code
- expensive code → cheaper code
- fragile code → more reliable code
- same behavior → better implementation
- same algorithm → better language/runtime fit

Runtime answers:

**How do we make this useful again and again?**

Runtime should emphasize:
- bounded runtime operationalization
- measurable usefulness
- proof and evaluator clarity
- rollback clarity
- reusable packaging
- promotion discipline

## Architecture lane

Architecture is the **Engine self-improvement lane**.

Route to Architecture when the extracted value improves:
- source analysis quality
- routing quality
- adaptation quality
- workflow design
- evaluator quality
- proof quality
- contract/schema/template quality
- engine structure
- engine efficiency
- long-term ability to consume and improve future sources

Architecture is not passive documentation.
It is the **operating-code lane** of Directive Workspace.

Architecture turns extracted value into Directive-owned:
- contracts
- schemas
- templates
- workflow improvements
- routing logic
- evaluator structures
- policy improvements
- adaptation mechanisms
- engine improvements

Architecture answers:

**How do we make Directive Workspace better at becoming better?**

Architecture also owns behavior-preserving transformation when the transformed result improves the Engine itself while preserving intended system behavior.

## Routing rule

The primary routing question is:

**What is the primary adoption target of the extracted value?**

- If the target is **reusable runtime capability**, route to **Runtime**
- If the target is **system logic, workflow, evaluation, structure, or adaptation ability**, route to **Architecture**
- If unclear, keep the source in **Discovery** until the target becomes clear

Runtime and Architecture are separated by **adoption target**, not by source type.

A GitHub repo can route to Architecture.
A research paper can route to Runtime.
Source type does not decide the track by itself.

## Behavior-preserving transformation rule

Behavior-preserving transformation is a first-class adaptation pattern in Directive Workspace.

It means improving an implementation while preserving the intended behavior or capability.

Examples include:
- bad code → good code
- messy code → cleaner code
- slow code → faster code
- expensive code → cheaper code
- fragile code → more reliable code
- same behavior → better implementation
- same algorithm → better language/runtime fit

Ownership is determined by the **primary adoption target**:

- Route to **Runtime** when the transformed result becomes reusable runtime capability, callable skill, runtime workflow, or repeated execution surface.
- Route to **Architecture** when the transformed result improves the Engine, workflow, structure, evaluator quality, proof logic, contracts, schemas, templates, or long-term adaptation ability.

This means behavior-preserving transformation is not Runtime-only.
It is a shared Directive Workspace pattern whose ownership depends on what the transformation is ultimately for.

## Three levels of usefulness

Directive Workspace should distinguish between:

### 1. Direct usefulness
Useful immediately for repeated runtime/user-facing use.
Usually Runtime.

### 2. Structural usefulness
Useful for how the system works.
Usually Architecture.

### 3. Meta-usefulness
Useful because it improves Directive Workspace’s ability to discover, judge, extract, adapt, improve, and integrate future sources.
Deepest Architecture / Engine-core value.

The third level is central.

Directive Workspace matters because it becomes better at turning future sources into value.

## System priority right now

The main goal right now is **not** merely to process many sources through the workflow.

The main goal right now is to improve the system itself so:
- Discovery works as it is supposed to work
- Runtime works as it is supposed to work
- Architecture works as it is supposed to work
- Engine becomes the real shared adaptation core
- Directive Workspace becomes better at consuming and improving from future sources

That means the project is currently in an **Engine-building phase**.

### Current emphasis
- Discovery should become better at source collection, filtering, routing, and capability-gap visibility
- Runtime should become better at runtime usefulness conversion and behavior-preserving transformation
- Architecture should become better at improving the Engine’s adaptation ability
- Directive Workspace as a whole should become better at self-improvement through source consumption

Runtime is important, but it is not the center of the product.
Discovery is necessary, but mainly as an efficiency lane.
Architecture is closest to the current mission because the current mission is to improve the Engine itself.

## Non-negotiable principles

1. **No blind source adoption**
   - external sources are inputs, not truth

2. **No runtime integration without proof and rollback clarity**
   - reusable runtime capability must be bounded, measurable, and reversible

3. **Mission-conditioned usefulness**
   - usefulness must be judged against the active mission, not generic excitement

4. **Directive-owned integration**
   - integrated value should be converted into Directive-owned form where appropriate

5. **Extraction is not enough**
   - the system should adapt and improve extracted value where useful

6. **Architecture is operating code**
   - do not treat Architecture as passive notes

7. **Engine is the shared core**
   - shared machinery should not stay scattered or lane-local

8. **Reversible changes over speculative sprawl**
   - prefer grounded, staged, measurable changes

9. **Proof, decision, and reporting matter**
   - do not weaken the full workflow into a shorter informal pattern

10. **Usefulness beats novelty**
   - a source matters only if it advances the mission or the Engine’s future ability

## Working method

When making changes inside Directive Workspace:

1. Identify whether the work affects:
   - Engine
   - Discovery
   - Runtime
   - Architecture
   - shared doctrine/contracts/schemas/templates

2. Ask:
   - what mission does this help?
   - what kind of usefulness does this unlock?
   - is the value direct, structural, or meta-useful?
   - should it be lane-local or Engine-owned?
   - how will it be proved?
   - how will it be decided?
   - how will it be integrated and reported?
   - how can it be rolled back?

3. Prefer:
   - Engine truth over scattered lane-local duplication
   - lane clarity over vague folder presence
   - reversible structural corrections
   - real source-adaptation capability over surface wording only

## What to avoid

Avoid:
- treating Discovery / Runtime / Architecture as peer products
- collapsing Engine into Architecture
- reducing Directive Workspace to source collection only
- reducing Runtime to “tool adoption” only
- reducing Architecture to note-taking
- treating extraction as enough without adaptation/improvement
- dropping Decide or Report from the workflow
- keeping shared core logic scattered across lanes
- optimizing for novelty instead of mission usefulness
- broad speculative abstraction without workflow pressure

## Operating modes

Replace the one-size-fits-all chain with three named modes, decided at triage time.

### Mode 1: NOTE (Quick record, default stop)

- **When:** Source is interesting but not product-actionable. Confirmatory findings. Low confidence routing. Exploratory assessment.
- **Artifacts:** Discovery front door (intake + triage + routing) → one analysis note → done.
- **Architecture version:** Handoff → single bounded-result with verdict `noted`. No bounded-start needed.
- **Runtime version:** Follow-up stub → `parked_after_review`. No record opened.
- **Total artifacts:** 4-6 (Discovery set + 1 note)
- **Max sessions:** 1

### Mode 2: STANDARD (Bounded chain, circuit breaker at result)

- **When:** Source has concrete extractable value. Clear adoption target. Moderate confidence.
- **Artifacts:** Full Discovery front door → lane-appropriate chain up to bounded-result (Architecture) or capability-boundary (Runtime). **Default stop at result/boundary** — extension requires explicit justification.
- **Architecture version:** Handoff → bounded-start → bounded-result → stop unless adoption criteria are met.
- **Runtime version:** Follow-up → record → proof → capability-boundary → stop unless promotion criteria are met.
- **Batching allowed:** Tightly coupled steps (e.g., handoff + start, or record + proof) can be done in one session.
- **Max sessions:** 2-4

### Mode 3: DEEP (Full chain, explicit extension at each gate)

- **When:** Source is being implemented into real code or real Engine changes. High-value, high-risk. Seam-opening work.
- **Artifacts:** Full chain including implementation, retention, integration, consumption, evaluation.
- **Architecture version:** Full 11-stage chain where each stage adds real value.
- **Runtime version:** Full chain through promotion-readiness and eventually host integration.
- **Step-per-session rule applies** for seam-opening work only.
- **Max sessions:** 5+

### Mode decision rule

At Discovery routing (or at the start of any downstream session), classify using this 3-question filter:

1. **Does this source produce concrete code, contracts, or Engine changes?** → If no → **NOTE**.
2. **Is the adoption target clear and the confidence moderate-to-high?** → If yes → **STANDARD**.
3. **Does this open a new seam, introduce real runtime capability, or change Engine operating code?** → If yes → **DEEP**.

If unsure between NOTE and STANDARD, default to NOTE. You can always upgrade later, but you cannot undo the artifact overhead of an unnecessary STANDARD chain.

### Stop-line rules

- **NOTE mode:** Stop after the analysis note. No continuation unless the operator explicitly decides the case has become product-actionable.
- **STANDARD mode:** Stop at bounded-result (Architecture) or capability-boundary (Runtime). Extension to the next stage requires answering: "What concrete product artifact does the next step produce that does not exist yet?"
- **DEEP mode:** Stop at each gate. Each extension requires: "Is the remaining work downhill (no unknowns)?"
- **Universal rule:** If a case has been `stay_experimental` or `needs-more-evidence` for 2+ sessions without new evidence, it is **parked**, not continued.

### Batching rules

- **Tightly coupled steps may be batched into one session** when:
  - The output of step N is a mechanical prerequisite for step N+1 (e.g., handoff → start)
  - No human judgment decision separates them
  - Both steps are in the same lane
- **Steps that should NOT be batched:**
  - Routing decision + downstream execution (the routing decision is a judgment call)
  - Implementation + proof (implementation may reveal issues that change the proof)
  - Anything that opens a new seam

### Parking rules

- A case is **parked** when it reaches a natural stop-line and no immediate next move is justified.
- Parked cases stay in the queue with their current status. No cleanup needed.
- A parked case can be **reopened** only by explicit operator decision with a stated reason.
- Reopened cases re-enter at their current stage, not from Discovery.
- Parked cases do not generate "next best move" suggestions.

### Quick decision checklist (before every task)

1. What case am I working on?
2. What mode? (NOTE / STANDARD / DEEP)
3. What is the stop-line for this session?
4. Am I producing value or artifacts?
5. Can I batch the next 2-3 steps?
6. Has this case been parked before? Why am I reopening it?

### House rule: Proportional ceremony

- Classify every case as NOTE, STANDARD, or DEEP before starting.
- Do not continue a case past its stop-line without explicit justification.
- "More formalization" is not the same as "more value."
- Trust automated checks (`npm run check`). Skip manual truth-refresh narrative for NOTE mode.
- Default to NOTE. Upgrade when justified.

## Final doctrine sentence

Directive Workspace is a self-improving goal-driven product whose Engine consumes external sources, judges their mission-relevant usefulness, extracts and refines that usefulness, and upgrades either reusable runtime capability through Runtime or the system’s own operating intelligence through Architecture.
