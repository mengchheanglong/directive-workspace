# Directive Workspace Operating-Model Simplification Plan

Last updated: 2026-04-03
Status: proposed

## Purpose

Reduce operator ceremony without weakening:
- Discovery-first routing
- Engine ownership
- proof / decision / reporting discipline
- canonical state resolution
- rollback clarity

This plan is based on:
- current repo truth
- [knowledge/operating-model-v2.md](C:/Users/User/projects/directive-workspace/knowledge/operating-model-v2.md)
- current control policies
- external patterns from Shape Up, ADR practice, and Golden Path systems

## Diagnosis

Directive Workspace is now post-proving.

The chain machinery works, but the operator cost is still shaped for an earlier phase where every seam needed to be proven from scratch.

Current friction comes from:
- overcontinuation after the useful answer is already known
- long Architecture downstream chains used too often
- too many records for low-confidence or exploratory cases
- manual ceremony that duplicates protections already enforced by openers, checks, and the canonical state resolver

## Core Simplification Rule

Default to the shortest truthful path.

Escalate only when the next stage produces a concrete new product artifact or opens a real seam.

## Cut Now

### 1. Remove minimum-run pressure

Current problem:
- [control/policies/continuation-rules.md](C:/Users/User/projects/directive-workspace/control/policies/continuation-rules.md) says to aim for at least 5 bounded cycles before early stop.

Change:
- remove the minimum continuation target
- stop as soon as the current bounded slice reaches a truthful stop-line

Why:
- this rule rewards chain continuation instead of value production
- it directly conflicts with NOTE/STANDARD default stopping

### 2. Make NOTE the real default

Change:
- treat NOTE as the default unless clear evidence requires STANDARD or DEEP

Meaning:
- Discovery front door
- one bounded Architecture result, or one parked Runtime follow-up
- stop

Why:
- most cases do not justify a deep chain
- exploratory and confirmatory work should not look like implementation programs

### 3. Make Architecture bounded-result the normal completion point

Change:
- for Architecture, the default finish line is `bounded-result`
- do not continue automatically into:
  - adopted
  - implementation-target
  - implementation-result
  - retained
  - integration-record
  - consumption-record
  - post-consumption-evaluation

Extension rule:
- only continue if the next stage produces a concrete Directive-owned artifact or a real required consumption proof that does not already exist

Why:
- the current Architecture tail is the largest ceremony source
- many cases only need an explicit result and decision, not the full downstream bundle

### 4. Make the long Architecture tail DEEP-only

Change:
- keep the existing downstream Architecture stages available
- classify them as DEEP-mode only

Use them only when:
- real implementation work exists
- retained product-owned materialization is being added
- real integration/consumption evidence is being recorded
- the remaining work is clearly downhill

Why:
- this preserves the proven machinery without forcing it on every case

### 5. Prefer Discovery fast path over split records

Change:
- default to one fast-path Discovery record
- only split into intake + triage + routing when the case is disputed, held, complex, or rerouted

Why:
- many simple cases do not need the heavier Discovery record family

### 6. Park Runtime earlier

Change:
- if a Runtime case is exploratory or lacks strong delivery pressure, stop at:
  - follow-up review
  - or capability-boundary

Do not continue deeper just to complete the chain.

Why:
- Runtime follow-up sprawl is a major noise source
- the stall pattern was already documented in [knowledge/operating-model-v2.md](C:/Users/User/projects/directive-workspace/knowledge/operating-model-v2.md)

### 7. Batch mechanical pairs

Allowed batching by default:
- Architecture handoff + bounded-start
- Runtime record + proof

Do not batch:
- routing judgment + downstream execution
- implementation + proof
- seam-opening work

Why:
- these pairs are often mechanical prerequisites, not separate decisions

## Keep

Do not simplify away:
- Discovery as the front door
- Decide
- Report
- [shared/lib/dw-state.ts](C:/Users/User/projects/directive-workspace/shared/lib/dw-state.ts) as canonical state resolution
- opener gating
- `npm run check`
- proof and rollback expectations for meaningful slices
- lane boundaries between Discovery, Runtime, and Architecture

These are truth protections, not ceremony overhead.

## Active Policy Changes Needed

### First policy wave

1. [control/policies/continuation-rules.md](C:/Users/User/projects/directive-workspace/control/policies/continuation-rules.md)
- remove the 5-cycle minimum
- stop on first truthful verified stop-line
- phrase continuation as optional after reassessment, not expected by default

2. [control/runbook/current-priority.md](C:/Users/User/projects/directive-workspace/control/runbook/current-priority.md)
- explicitly prefer shorter truthful completions over chain continuation

3. [knowledge/workflow.md](C:/Users/User/projects/directive-workspace/knowledge/workflow.md)
- make NOTE the explicit default
- make Architecture bounded-result the normal stop-line
- state that downstream Architecture stages are DEEP-only unless a new concrete product artifact is being added

### Second policy wave

4. [architecture/README.md](C:/Users/User/projects/directive-workspace/architecture/README.md)
- rewrite the default path to:
  - routed candidate
  - one bounded experiment/result
  - adopted/deferred only when justified

5. [control/policies/logging-rules.md](C:/Users/User/projects/directive-workspace/control/policies/logging-rules.md)
- note that NOTE-mode work should use the lightest possible logging and should not imitate DEEP-mode structure

## Proposed Operating Rule

Before every case:
1. What mode: NOTE, STANDARD, or DEEP?
2. What is the earliest truthful stop-line?
3. What concrete new artifact would the next stage add?

If that question has no strong answer, stop.

## Success Criteria

This simplification is working when:
- fewer Architecture cases continue beyond bounded-result
- fewer Runtime cases open deep chains without delivery pressure
- more cases end in one verified session or one short STANDARD chain
- operators spend less time narrating truth that the system already checks
- `npm run check` and canonical state resolution remain authoritative

## Recommended Order

1. change continuation policy
2. change workflow/default mode wording
3. change Architecture README/default path wording
4. only then consider deeper structural cleanup

## Explicit Non-Goal

This plan does not remove the deep chain infrastructure.

It changes when that infrastructure is used.
