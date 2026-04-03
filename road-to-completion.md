# Road to Completion

## Purpose of this roadmap

This file is a product execution roadmap, not a truth ledger.

It exists to answer:

- what "complete enough" means for the current Engine-building phase
- what still has to happen for whole-product completion
- which seams should open next, in what order, and why

It must stay aligned with:

- [CLAUDE.md](./CLAUDE.md)
- [knowledge/active-mission.md](./knowledge/active-mission.md)
- [engine/workspace-truth.ts](./engine/workspace-truth.ts)

Important rule:

- `workspace-truth.ts` reflects what has already been proved
- it does **not** authorize new seams by itself
- proof comes first, then truth is updated to reflect it

---

## Two completion targets

### 1. Phase completion: current Engine-building phase

The current phase is complete when Directive Workspace can repeatedly do this without reopening the same manual glue seam each time:

1. A source enters through Discovery
2. The Engine analyzes, routes, extracts, adapts, improves, proves, decides, and reports
3. Architecture improvements remain product-owned and checked
4. At least one Runtime case becomes a **real callable capability**
5. At least one host can consume that capability through a bounded adapter path
6. Evidence from that cycle changes later routing, prioritization, or adaptation decisions

This is the minimum completion target for the current phase.

### 2. Whole-product completion: Directive Workspace as intended by the mission

The active mission still includes persistent orchestration and recurring capability strengthening in [knowledge/active-mission.md](./knowledge/active-mission.md).

So whole-product completion is stricter. It requires everything in phase completion **plus**:

1. bounded runtime promotion can be repeated across multiple cases
2. case lifecycle health is observable across the system
3. one bounded persistent coordination surface exists for recurring work
4. orchestration improves throughput or reliability without bypassing decision gates

Whole-product completion does **not** require:

- full automation
- no human judgment
- a dashboard-first experience
- every historical source being promoted to Runtime

---

## Ground rules

These rules exist so the roadmap does not drift ahead of repo truth.

### Truth rule

- Do not edit `workspace-truth.ts` to "open" a seam before proof exists.
- Update `workspace-truth.ts` only after a bounded slice has already succeeded and checks pass.

### Ownership rule

- Runtime-owned capability must exist **before** host integration proves the host boundary.
- Do not place first callable implementations directly under a host unless the explicit goal is to prove a host-local-only capability. That is not the current goal.

### Governance rule

- The capability gap registry remains human-reviewed.
- Evidence can propose gap candidates, but should not auto-open new gaps without an explicit doctrine decision.

### Automation rule

- Recommendations and scaffolding can be automated earlier.
- execution, promotion, and workflow advancement must remain explicitly approved until the manual path is proven repeatable.

---

## Current state - honest assessment

Use the live reports for exact numbers:

- `npm run report:directive-workspace-state`
- `npm run report:run-evidence-aggregation`
- `npm run report:case-catalog`

As of 2026-04-01, current repo truth is:

### Proven

| Surface | State |
| --- | --- |
| Discovery front door | Proven |
| Research Engine Discovery import seam | Proven and bounded |
| Engine routing / usefulness / staged planning | Proven |
| Canonical state resolver | Proven |
| Case mirror substrate | Proven |
| Architecture bounded chain | Proven |
| Truth / check / report discipline | Proven |
| Gap registry and generated worklist | Proven |

### Real but incomplete

| Surface | State | Missing |
| --- | --- | --- |
| Runtime lane | non-executing v0 through promotion-readiness | execution, callable capability, host use |
| Runtime promotion seam | promotion specifications exist | actual host consumption |
| Engine adaptation core | structured planning exists | deeper reusable adaptation machinery |
| Case catalog | all mirrored cases plannable | uneven downstream depth |
| Run evidence | aggregation exists | governing feedback loop |
| Boundary enforcement | checker-backed | deeper structural isolation |

### Explicitly still closed

These are still intentionally closed in [engine/workspace-truth.ts](./engine/workspace-truth.ts):

1. runtime execution
2. host integration
3. callable implementation
4. promotion automation
5. lifecycle orchestration
6. automatic downstream advancement

That means the roadmap must open them deliberately and in order, not assume they are already available.

---

## Why the current seams are closed

The seams are not closed because the repo is confused. They are closed because the current product has favored proof, reversibility, and boundedness over premature operationalization.

Current honest read:

- **Runtime execution** is closed because the Runtime lane has only been proven through non-executing boundaries so far.
- **Host integration** is closed because the host boundary is now checked, but no Runtime-owned callable capability has crossed it yet.
- **Callable implementation** is closed because promotion specifications now exist, but no Runtime case has yet become a true Directive-owned callable surface.
- **Promotion automation** should remain closed until at least one manual promotion succeeds cleanly.
- **Lifecycle coordination** should remain read-only until manual promotion and evidence loops are proven.
- **Persistent orchestration** should remain closed until the system has a demonstrated recurring coordination problem that read-only lifecycle coordination cannot solve.

---

## Phase plan

### Phase 0: Foundation closure and roadmap alignment

**Status:** current

**Goal:** make the roadmap, mission wording, and truth surfaces agree before opening Runtime seams.

**Scope:**

- keep all current checks green
- keep the gap worklist empty unless a new explicit gap is opened
- update `active-mission.md` only if the current priority has actually shifted
- update `workspace-truth.ts` only to reflect already-proved surfaces such as the bounded Research Engine seam and promotion specification generation

**Proof gate:**

- `npm run check` passes
- reports remain coherent
- roadmap, mission, and truth no longer contradict each other

**Rollback:**

- revert documentation-only changes

---

### Phase 1: First Runtime-owned callable capability

**Goal:** one Runtime case produces a real Directive-owned callable capability that runs outside pure planning/specification.

**Why first:** this is the biggest remaining product ceiling.

**Scope:**

- choose one Runtime case with the clearest bounded path
- current strongest candidate: `dw-source-scientify-research-workflow-plugin-2026-03-27`
- implement one bounded callable surface owned by Runtime, not by the host

**Rules:**

- the first callable implementation should live in a Runtime-owned surface
- the host may invoke it later, but should not own the first implementation
- keep scope to one capability family, one case, one host target

**Steps:**

1. define one explicit callable capability contract
2. implement the selected Scientify literature-access tools as Directive-owned modules
3. add focused proofs with real API calls or realistic bounded live checks
4. measure latency, success rate, and error behavior
5. keep the implementation callable directly before any host integration

**What this unlocks:**

- proof that Runtime can become real product capability, not only bounded paperwork
- a clean artifact for the host boundary to consume later

**Proof gate:**

- the callable capability works through a bounded Runtime-owned invocation surface
- proof artifacts exist
- rollback is tested

**Rollback:**

- remove the callable surface and leave promotion-readiness and promotion spec intact

---

### Phase 2: First host adapter consumption

**Goal:** one host consumes one promoted Runtime capability through a bounded adapter contract.

**Why second:** first prove Runtime owns a callable capability, then prove a host can consume it without collapsing the boundary.

**Scope:**

- one host only
- one capability only
- one adapter contract only
- no automation

**Likely host:** standalone-host

**Steps:**

1. define a host-loading contract in `shared/contracts/`
2. add a promotion-spec reader / adapter loader in the standalone host
3. wire the adapter to the Runtime-owned callable capability from Phase 1
4. verify the host boundary check still passes
5. verify the host can call the capability without importing Runtime internals directly

**Proof gate:**

- standalone-host can expose the promoted capability through the adapter
- the adapter contract is explicit and checked

**Rollback:**

- remove the host adapter loading logic
- keep the Runtime-owned callable surface

---

### Phase 3: First full manual Runtime promotion

**Goal:** complete one Runtime case end-to-end manually, with explicit approvals at every gate.

**Why third:** Phases 1 and 2 prove the pieces. This proves the chain.

**Scope:**

- one case only
- explicit manual approvals only
- no automation

**Steps:**

1. advance one Runtime case through callable implementation and host integration
2. add any new case stages only after the artifacts exist
3. update planner rules to recognize the new stages
4. record the post-promotion proof and final decision
5. record the outcome in run evidence
6. update truth surfaces only after the full slice is proven

**Proof gate:**

- one case has a recorded lifecycle from Discovery intake to callable, host-consumed Runtime capability
- the planner can represent the new stages
- evidence records the outcome

**Rollback:**

- revert case-stage advancement and host exposure
- keep lower-level callable/runtime artifacts if they remain truthful

---

### Phase 4: Evidence-to-decision loop

**Goal:** evidence changes later decisions instead of staying as passive reporting.

**Why fourth:** the first complete Runtime cycle creates real operational data worth acting on.

**Scope:**

- keep it recommendation-first
- do not auto-mutate routing logic blindly
- do not auto-open gaps

**Steps:**

1. extend run evidence aggregation with stall rates, conversion rates, and stage-duration outliers
2. add `report:routing-effectiveness`
3. add `check:run-evidence-quality`
4. produce explicit recommendations or anomaly flags from evidence
5. if evidence suggests a new gap, record it through normal human-reviewed gap governance

**Proof gate:**

- at least one real routing, prioritization, or adaptation decision changes because of evidence
- that change is documented and checkable

---

### Phase 5: Repeatability across more Runtime promotions

**Goal:** prove the promotion pathway is not a one-off.

**Why fifth:** one successful case is not enough.

**Scope:**

- promote two more Runtime cases manually
- prefer diversity where justified:
  - different integration mode
  - different host
  - or materially different capability form
- do not force host diversity if repo truth does not justify it yet

**Steps:**

1. choose two additional Runtime candidates from current promotion-readiness cases
2. implement callable capability and host consumption for each
3. compare lifecycle metrics and friction points
4. revise the promotion contract only if repeated evidence justifies it

**Proof gate:**

- three total Runtime promotions have succeeded
- lifecycle metrics exist for all three
- the pathway is shown to be repeatable

---

### Phase 6: Semi-automated promotion assistance

**Goal:** reduce manual effort while keeping approval gates explicit.

**Scope:**

- planner recommendations only
- scaffold generation only
- no automatic advancement

**Steps:**

1. extend planner rules to recommend promotion follow-through where legal
2. create a bounded scaffolding script for the next promotion artifact
3. require explicit approval before any scaffold becomes live
4. add a discipline checker proving no case advanced without approval

**Proof gate:**

- at least two promotions use the assisted path
- manual effort is measurably lower than in Phase 5

---

### Phase 7: Deepen Engine adaptation machinery

**Goal:** move the Engine from structured adaptation planning toward stronger reusable adaptation logic.

**Why now:** once Runtime operational data exists, the Engine can improve from evidence instead of theory.

**Scope:**

- source-type-aware extraction/adaptation/improvement
- adaptation evaluation against historical outcomes
- better reuse of evidence in future planning

**Steps:**

1. export and test the adaptation planning functions more directly
2. add source-type-aware branches where evidence justifies them
3. add adaptation-quality evaluation
4. feed adaptation-quality findings back into routing/adaptation decisions as reviewable soft signals

**Proof gate:**

- adaptation quality is measurable
- at least one real source type gets a demonstrably better adaptation path

---

### Phase 8: Read-only lifecycle coordination

**Goal:** make active-case health visible and prioritized without auto-advancing work.

**Why late:** coordination without a proven manual pathway would just become planning theater.

**Scope:**

- read-only lifecycle coordinator
- no workflow engine
- no auto-advancement

**Steps:**

1. synthesize case snapshots, planner recommendations, and review cadences
2. produce a lifecycle health report
3. flag overdue or stalled cases
4. keep all actions recommendation-only

**Proof gate:**

- the coordinator correctly identifies real cases needing attention
- its recommendations match current doctrine

---

### Phase 9: Bounded persistent orchestration

**Goal:** satisfy the mission's orchestration requirement without turning Directive Workspace into an uncontrolled workflow engine.

**Why last:** this is the most sensitive seam and should only open after manual and semi-automated paths are already trustworthy.

**Scope:**

- one bounded recurring coordination surface
- durable state tracking across sessions
- no bypass of approval gates
- no broad orchestration platform redesign

**Possible shape:**

- scheduled re-check of review cadences
- resumable follow-through on one recurring Runtime or Discovery workflow
- durable reminders or resumable work packets, not autonomous execution

**Steps:**

1. identify one recurring coordination failure that the read-only coordinator cannot solve
2. define the smallest durable coordination primitive needed to solve it
3. implement it with strict bounded state and rollback
4. prove that it improves reliability or throughput without bypassing legal next-step doctrine

**Proof gate:**

- one persistent coordination loop demonstrably improves reliability or continuity
- approval gates remain intact

**Rollback:**

- disable the orchestration primitive and revert to read-only lifecycle coordination

---

## Dependency graph

```text
Phase 0: Foundation closure and roadmap alignment
    |
Phase 1: First Runtime-owned callable capability
    |
Phase 2: First host adapter consumption
    |
Phase 3: First full manual Runtime promotion
   / \
  /   \
Phase 4: Evidence-to-decision loop    Phase 5: Repeatable Runtime promotion
   \                                  /
    \                                /
      Phase 6: Semi-automated promotion assistance
                |
      Phase 7: Deepen Engine adaptation machinery
                |
      Phase 8: Read-only lifecycle coordination
                |
      Phase 9: Bounded persistent orchestration
```

Notes:

- Phases 4 and 5 can overlap after Phase 3.
- Phase 6 requires evidence from both actual promotions and the evidence loop.
- Phase 7 benefits from Runtime operational data; it should not be front-loaded.
- Phase 9 is required only if whole-product completion still includes persistent orchestration. If the mission changes, this phase may be redefined or removed.

---

## What is not part of completion

- full automation
- replacing human judgment at decision gates
- dashboard-first operation
- multi-user or multi-tenant support
- turning Directive Workspace into a general workflow engine
- forcing every historical source through full Runtime

Completion means the pathway works reliably, not that every possible downstream automation has been built.

---

## Main risks

### Real risks

1. Over-engineering the first Runtime promotion instead of proving the narrowest working path.
2. Letting host code own callable capability before Runtime owns it.
3. Turning evidence into reporting theater instead of changed decisions.
4. Letting Architecture momentum keep winning while Runtime remains mostly theoretical.
5. Treating promotion specifications as completion instead of as one enabling artifact.
6. Trying to auto-open gaps or routes before the evidence loop and governance rules are mature enough.

### False risks

1. "We need to redesign the Engine first."
2. "We need many more contracts before we can promote."
3. "We need many more sources before we can operationalize."
4. "We need orchestration before proving one full manual Runtime cycle."

---

## Success metrics per phase

| Phase | Primary metric | Target |
| --- | --- | --- |
| 0 | alignment and stability | checks pass, reports coherent, roadmap and truth aligned |
| 1 | working Runtime-owned callable capability | one bounded capability runs with proof and rollback |
| 2 | host adapter consumption | one host exposes the capability through an adapter |
| 3 | full manual promotion | one case completes the Runtime chain end-to-end |
| 4 | evidence changes decisions | at least one real decision changes because of evidence |
| 5 | repeatability | three successful Runtime promotions total |
| 6 | reduced effort | promotion assistance lowers manual work without bypassing approval |
| 7 | adaptation quality | at least one source-type-specific adaptation path improves measurably |
| 8 | lifecycle visibility | active cases have trustworthy health signals and recommendations |
| 9 | bounded orchestration value | one durable coordination loop improves continuity without bypassing gates |

---

## One-sentence tests

### Phase-complete

Directive Workspace is phase-complete when a source enters through Discovery, the Engine routes and adapts it, Runtime produces a Directive-owned callable capability, a host consumes it through a bounded adapter, and evidence from that cycle improves the next cycle without reopening the same glue seam.

### Whole-product-complete

Directive Workspace is whole-product-complete when the above is repeatable across cases and one bounded persistent coordination loop improves continuity without bypassing proof, decision, integration, or reporting discipline.
