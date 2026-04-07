# Architecture Corpus Normalization

Date: 2026-03-22
Track: Architecture
Type: deep audit + retroactive classification
Status: executed
Revision: 2 â€” corrected from initial baseline (see correction log at end)

## Objective

Apply the source-adaptation chain contracts (source-analysis, adaptation-decision, adoption-criteria, self-improvement, artifact-lifecycle) retroactively to the existing Architecture corpus.

This is not a rewrite. It is a classification pass that makes the corpus self-aware by mapping each adopted record to: origin, usefulness level, contract coverage, normalization status, and action needed.

## Audit scope

- All 24 records in `architecture/02-adopted/` as of 2026-03-22
- All 31 records in `architecture/05-reference-patterns/`
- All 8 records in `architecture/03-deferred-or-rejected/` (+ README)
- 52 experiment records in `architecture/01-experiments/` (sampled, not exhaustively classified)

## Classification of adopted records

### Wave 1 source-driven adoptions (2026-03-19)

| Record | Origin | Usefulness level | Status class | Source-analysis? | Adaptation-decision? | Adoption-criteria? | Self-improvement evidence? | Normalization status |
|---|---|---|---|---|---|---|---|---|
| `gh-aw` | source: gh-aw repo | structural | product_materialized | no | no (implicit in excluded baggage) | no | no | pre-doctrine, well-structured |
| `scientify` | source: scientify repo | structural | product_materialized | no | no (implicit) | no | no | pre-doctrine, well-structured |
| `gpt-researcher` | source: gpt-researcher repo | structural | product_materialized | no (has detailed extraction evidence instead) | no (implicit) | no | no | pre-doctrine, strongest extraction evidence |
| `Paper2Code` | source: Paper2Code repo | structural | product_materialized | no | no (implicit) | no | no | pre-doctrine, well-structured |
| `openmoss` | source: OpenMOSS repo | structural | product_materialized | no | no (implicit) | no | no | pre-doctrine, well-structured |
| `metaclaw` | source: metaclaw repo | structural | product_materialized | no | no (implicit) | no | no | pre-doctrine, clean closure |
| `autoresearch` | source: autoresearch repo | direct | routed_out_of_architecture | no | no | no | no | correctly Runtime-routed |
| `agentics` | source: agentics repo | direct | routed_out_of_architecture | no | no | no | no | correctly Runtime-routed |
| `mini-swe-agent` | source: mini-swe-agent repo | direct | routed_out_of_architecture | no | no | no | no | correctly Runtime-routed |
| `adopted-candidates-architecture-recheck` | internal | **meta** | product_materialized | n/a | n/a | no | yes (retroactive identification) | normalized retroactively, governance/routing validation record |

### Wave 2 closure adoptions (2026-03-21)

| Record | Origin | Usefulness level | Status class | Source-analysis? | Adaptation-decision? | Adoption-criteria? | Self-improvement evidence? | Normalization status |
|---|---|---|---|---|---|---|---|---|
| `codegraphcontext` | source: CodeGraphContext | structural | product_materialized | no | no | no | no | pre-doctrine, clean closure |
| `hermes` | source: hermes-agent | structural | product_materialized | no | no | no | no | pre-doctrine, clean closure |
| `impeccable` | source: impeccable skill pack | **meta** | product_materialized | no | no | no | yes (retroactive identification) | normalized retroactively, meta-usefulness now tracked |
| `celtrix` | source: Celtrix scaffolder | structural | product_materialized | no | no | no | no | pre-doctrine, clean closure |

### Wave 3 / recent adoptions (2026-03-21 â€“ 2026-03-22)

| Record | Origin | Usefulness level | Status class | Source-analysis? | Adaptation-decision? | Adoption-criteria? | Self-improvement evidence? | Normalization status |
|---|---|---|---|---|---|---|---|---|
| `agent-lab-orchestration-allowlist` | internal | structural | product_materialized | n/a (internal) | n/a | no | no | pre-doctrine, clean |
| `discovery-gap-priority-worklist` | internal | **meta** | product_materialized | n/a | n/a | no | **missing** | pre-doctrine, meta-usefulness untracked |
| `openclaw-discovery-submission-flow` | internal | structural | product_materialized | n/a | n/a | no | no | pre-doctrine, clean |
| `openclaw-maintenance-watchdog-signal-lane` | internal | structural | adopted | n/a | n/a | no | no | pre-doctrine, clean |
| `openclaw-runtime-verification-freshness` | internal | structural | adopted | n/a | n/a | no | no | pre-doctrine, clean |
| `rescue-openclaw-role` | internal | structural | adopted | n/a | n/a | no | no | pre-doctrine, clean |

### Self-referential adoptions (2026-03-22, this session)

| Record | Origin | Usefulness level | Status class | Source-analysis? | Adaptation-decision? | Adoption-criteria? | Self-improvement evidence? | Normalization status |
|---|---|---|---|---|---|---|---|---|
| `source-adaptation-chain` | internal | **meta** | product_materialized | self-referential | self-referential | self-referential | no (predates self-improvement contract) | first-generation doctrine |
| `source-adaptation-integration` | internal | **meta** | product_materialized | n/a | n/a | n/a | no | first-generation doctrine |
| `architecture-maturity-bundle` | internal | **meta** | product_materialized | n/a | n/a | n/a | **yes â€” first record with evidence** | current doctrine |
| `architecture-corpus-normalization` | internal | **meta** | product_materialized | n/a | n/a | n/a | yes | current doctrine, self-referential |

### Adopted record summary

| Usefulness level | Count | Records |
|---|---|---|
| structural | 14 | gh-aw, scientify, gpt-researcher, Paper2Code, openmoss, metaclaw, codegraphcontext, hermes, celtrix, agent-lab-orchestration-allowlist, openclaw-discovery-submission-flow, openclaw-maintenance-watchdog-signal-lane, openclaw-runtime-verification-freshness, rescue-openclaw-role |
| direct (Runtime-routed) | 3 | autoresearch, agentics, mini-swe-agent |
| meta | 7 | adopted-candidates-architecture-recheck, impeccable, discovery-gap-priority-worklist, source-adaptation-chain, source-adaptation-integration, architecture-maturity-bundle, architecture-corpus-normalization |
| **Total** | **24** | |

Self-improvement evidence present: 4 of 7 meta-useful records (impeccable, adopted-candidates-architecture-recheck, architecture-maturity-bundle, architecture-corpus-normalization).

## Reference pattern classification

### Patterns that were promoted to shared contracts (correctly graduated)

| Reference pattern | Promoted to | Status |
|---|---|---|
| `promotion-quality-gate-contract` | `shared/contracts/promotion-quality-gate.md` | promoted, reference retained as policy note |
| `hermes-context-compaction-contract` | `shared/contracts/context-compaction-fidelity.md` | promoted, reference retained |
| `codegraphcontext-index-query-contract` | `shared/contracts/index-query-state-boundary.md` | promoted, reference retained |
| `impeccable-review-policy` | `shared/contracts/architecture-review-guardrails.md` | promoted, reference retained |
| `gh-aw-lane-split-contract-policy` | `shared/contracts/automation-lane-split.md` | promoted, reference retained |
| `metaclaw-escalation-policy` | `shared/contracts/escalation-boundary-policy.md` | promoted, reference retained |
| `openmoss-lifecycle-policy` | `shared/contracts/lifecycle-transition-policy.md` | promoted, reference retained |
| `discovery-gap-priority-worklist-policy` | `shared/contracts/discovery-gap-worklist.md` | promoted, reference retained |

### Patterns that remain as reference-only (not yet promoted)

| Reference pattern | Type | Should it promote? |
|---|---|---|
| `agent-orchestrator-pattern-split` | pattern | no â€” context only, value already absorbed by Architecture lane-split thinking |
| `hermes-agent-surviving-patterns` | analysis-notes | no â€” value absorbed by compaction-fidelity contract |
| `codegraphcontext-analysis-patterns` | analysis-notes | no â€” value absorbed by index-query-state-boundary contract |
| `impeccable-frontend-guardrails` | policy | no â€” narrower subset, value absorbed by review-guardrails contract |
| `arscontexta-context-patterns` | analysis-notes | no â€” context only |
| `cross-source-theory-paper-patterns` | analysis-notes | no â€” context only |
| `superpowers-workflow-discipline` | pattern | no â€” context only |
| `citation-set-fallback-policy` | policy | no â€” value absorbed by citation-set-fallback contract |
| `stage-evidence-citation-handoff-contract` | contract-draft | **retired** â€” fully absorbed by shared schemas |
| `structured-output-fallback-parser-policy` | policy | no â€” value absorbed by shared contract |
| `integration-proof-template-generator-policy` | policy | no â€” value absorbed by shared lib |
| `impeccable-reanalysis-policy-bundle-02` | analysis-notes | no â€” context only |
| `impeccable-review-checklist-policy` | policy | no â€” value absorbed by review-guardrails contract |
| `paper2code-stage-schema-normalization` | policy | no â€” value absorbed by shared schemas |
| `celtrix-stack-signal-policy` | policy | no â€” value absorbed by intake-stack-signals contract |
| `hermes-compaction-fidelity-policy` | policy | no â€” value absorbed by compaction-fidelity contract |
| `codegraphcontext-state-boundary-policy` | policy | no â€” value absorbed by index-query-state-boundary contract |

### Governance/infrastructure reference patterns (previously omitted)

| Reference pattern | Type | Should it promote? |
|---|---|---|
| `directive-v1-architecture-recheck-lock` | governance lock | no â€” locked baseline record, value is the lock itself |
| `future-candidates-agency-agents-arscontexta` | parked-candidates note | no â€” partially superseded by arscontexta-context-patterns; retains future-candidate context |
| `dw-cross-source-wave-01-integration-contract-artifact` | generated artifact | no â€” machine-generated integration contract for cross-source wave; context only |
| `dw-cross-source-wave-01-proof-checklist-artifact` | generated artifact | no â€” machine-generated proof checklist for cross-source wave; context only |
| `promptfoo-evaluation-patterns` | pattern extraction | no â€” evaluation discipline patterns; value partially absorbed by evaluator contract |
| `agent-lab-orchestration-allowlist-policy` | policy | no â€” value absorbed by source-pack-curation-allowlist contract |

### Reference pattern assessment summary

- 8 patterns were correctly promoted to shared contracts (strong lifecycle execution)
- 22 patterns remain as reference-only (16 previously classified + 6 previously omitted)
- Of the 22, most have had their value absorbed by the promoted shared contracts or are governance/infrastructure records
- 1 has now been retired (`stage-evidence-citation-handoff-contract`)
- None require urgent promotion â€” the shared contract layer already captures the surviving value
- **Total reference patterns: 31** (8 promoted + 22 reference-only + 1 retired)

## Classification of deferred/rejected records

The `architecture/03-deferred-or-rejected/` directory contains 8 records (+ README). These were not classified in the initial normalization pass. The recheck record (`recheck-deferred-rejected-v2`) already contains good per-candidate classification.

| Record | Type | Current classification | Notes |
|---|---|---|---|
| `low-tier-decisions` | batch reject/defer | `defer_monitor` | Batch of 5 low-scoring candidates; Paper2Code later promoted and adopted |
| `day3-parked-candidates` | parking note | `defer_monitor` | Historical context; all listed candidates now have individual records |
| `gpt-researcher-deferred` | individual defer | superseded | Original blocker was host runtime instability; later promoted and adopted via architecture slice |
| `swe-agent-slice-8-deferred` | individual defer | `defer_monitor` | Overlap with mini-swe-agent/Codex; useful patterns already extracted |
| `autoresearchclaw-slice-9-deferred` | individual defer | `defer_monitor` | High complexity; most valuable gating patterns already extracted |
| `autogen-slice-10-deferred` | individual defer | `defer_monitor` | Broad framework; layering/event contract patterns retained as context |
| `openhands-slice-11-deferred` | individual defer | `defer_monitor` | Strong overlap with existing lanes; boundary patterns already captured |
| `recheck-deferred-rejected-v2` | governance recheck | active baseline | Locked recheck of all deferred/rejected candidates under v1 Architecture criteria |

Deferred/rejected lifecycle assessment:
- 2 records are superseded (gpt-researcher-deferred by adopted slice, low-tier-decisions partially by Paper2Code adoption)
- 4 records are `defer_monitor` with extracted value already absorbed
- 1 is a governance baseline (recheck-deferred-rejected-v2)
- 1 is a historical context note (day3-parked-candidates)
- No deferred record requires immediate action

## Key audit findings

### Finding 1: No pre-doctrine record uses the new contracts

Zero out of 24 adopted records reference source-analysis-contract, adaptation-decision-contract, architecture-adoption-criteria, or architecture-self-improvement-contract. The contracts exist but have never been exercised against real source-driven work.

**Impact:** The contracts are untested against real Architecture work. The first source-driven Architecture slice that uses them will be the real validation.

**Action:** Not a problem to fix retroactively. The lifecycle contract marks pre-doctrine records as exempt from retroactive rewrite. New work must use the contracts going forward.

### Finding 2: Three meta-useful adoptions still lack self-improvement evidence

Retroactive normalization closed two of the original evidence gaps:
- `impeccable` now carries retroactive self-improvement evidence in the `evaluation_quality` category
- `adopted-candidates-architecture-recheck` now carries retroactive self-improvement evidence in the `routing_quality` category

The remaining uncovered meta-useful records are:
- `discovery-gap-priority-worklist`
- `source-adaptation-chain`
- `source-adaptation-integration`

**Impact:** Meta-useful work is now tracked more honestly, but the self-improvement feedback loop still has incomplete coverage (4 of 7 meta-useful records have evidence).

**Action:** Future cycle evaluations should treat the remaining uncovered meta-useful records as backlog for retroactive evidence or explicit exemption rationale.

### Finding 3: Usefulness level was never classified â€” now it is

This normalization record classifies all 24 adopted Architecture records by usefulness level:
- 14 records are structural (system-improving mechanisms)
- 3 records are direct (correctly Runtime-routed)
- 7 records are meta (self-improving mechanisms, 4 have self-improvement evidence)

This distribution is healthy. Architecture should be dominated by structural usefulness with a meaningful meta-useful minority. The meta-useful rate (29%) is higher than expected, partly because the self-referential doctrine records (source-adaptation-chain, integration, maturity, corpus-normalization) are inherently meta.

### Finding 4: Adaptation evidence is implicit everywhere

Every source-driven adopted record has "extracted patterns" and "excluded baggage" sections, which implicitly contain adaptation evidence. But none explicitly describe:
- what was changed between the original mechanism and the Directive-owned form (adaptation delta)
- what was improved beyond the original source (improvement delta)

The information exists in the aggregate record, but it's scattered across experiment and adopted notes rather than structured per the adaptation-decision contract.

**Impact:** Moderate. The adaptation quality of pre-doctrine work cannot be systematically assessed. New work with the adaptation-decision contract will fix this going forward.

### Finding 5: Reference patterns have good lifecycle execution

8 of 31 reference patterns were promoted to shared contracts. This is a healthy promotion rate (26%). The remaining 23 include:
- 17 policy/analysis notes whose value has been absorbed by promoted contracts
- 6 governance/infrastructure records (locks, generated artifacts, parked candidates) that were omitted from the initial normalization

The reference-pattern folder is acting correctly as a staging area, not a parking lot.

### Finding 6: Experiment-to-adopted transition quality varies widely

Compare:
- `gpt-researcher` experiment: 200+ lines of detailed extraction evidence with specific file references, contract shapes, and validation rules â€” strongest record
- `discovery-gap-driven-priority-loop`: 30 lines, claim + bounded change + proof method â€” adequate but thin
- `agentics-slice-2-execution`: mostly commands-run + pass/fail â€” execution evidence only, no analysis depth

The lifecycle contract now defines what each state requires, which should normalize future quality.

### Finding 7: Deferred/rejected records have their own governance layer

The `recheck-deferred-rejected-v2` record already provides a well-structured classification of all deferred candidates with per-candidate status (still_reject, defer_monitor, promote_to_queue) and reclassification rules. This governance layer was functional but invisible to the normalization baseline until this correction.

## Normalization result

### What this record provides

1. **All 24 adopted Architecture records are classified by usefulness level** (direct/structural/meta)
2. **All 24 adopted records are assessed for contract coverage** (which new contracts they do/don't satisfy)
3. **All 7 meta-useful records are identified** even when the original authors didn't flag them
4. **All 31 reference patterns are assessed for lifecycle state** (promoted, absorbed, governance, or retired/reference-only)
5. **All 8 deferred/rejected records are classified** with current status and lifecycle assessment
6. **The Architecture corpus is now self-aware** â€” it knows what it has, at what level, with what gaps

### What this record does NOT do

- Rewrite pre-doctrine records (not needed â€” the lifecycle contract exempts them)
- Create artificial compliance (pre-doctrine records are classified, not judged)
- Replace the cycle evaluation template (this is a one-time normalization, not a recurring evaluation)

## Verdict

The Architecture corpus is structurally sound but pre-doctrine. The main gap is not quality â€” it's classification and self-awareness. This normalization record closes that gap for the current corpus. The `architecture-artifact-lifecycle` contract prevents the gap from recurring in future work.

## Correction log

### Revision 2 corrections (from initial baseline)

| Item | Initial claim | Corrected value | Impact |
|---|---|---|---|
| Adopted record count | "21" (findings text) / 22 (tables) | **24** | 2 records were omitted: `adopted-candidates-architecture-recheck`, `architecture-corpus-normalization-adopted` |
| Structural count | 12 | **14** | Arithmetic error in original Finding 3 |
| Meta count | 5 | **7** | `adopted-candidates-architecture-recheck` and `architecture-corpus-normalization` are meta-useful |
| Direct count | 3 | 3 | Unchanged |
| Reference pattern count | 25 (8 promoted + 17 reference-only) | **31** (8 promoted + 23 reference-only) | 6 governance/infrastructure patterns were completely omitted |
| Deferred/rejected classification | "3 deferred/rejected records" mentioned in scope, none classified | **8 records fully classified** | Entire deferred/rejected corpus was unclassified |
| Finding 3 arithmetic | "12 + 3 + 5 = 21" (doesn't add up) | 14 + 3 + 7 = 24 | Internal contradiction fixed |
| Self-improvement evidence | "only 1 had evidence" | **4 have evidence** (`impeccable`, `adopted-candidates-architecture-recheck`, `architecture-maturity-bundle`, and this normalization) | Undercounted before retroactive normalization |

