# Architecture Cycle Evaluation — Wave 01 Baseline

- Cycle id: `architecture-wave-01-baseline`
- Cycle date range: `2026-03-19` to `2026-03-22`
- Evaluation date: `2026-03-23`
- Evaluator: `Codex`
- Owning track: `Architecture`
- Purpose: first real cycle evaluation using the corrected corpus-normalization baseline

## Evaluation scope note

This is the first Architecture cycle evaluation performed after the self-improvement contract and cycle-evaluation template were created.

The cycle being evaluated is partly pre-doctrine. That means:
- some counts are exact because the corpus normalization record classified the full adopted set
- some adaptation/improvement metrics are baseline estimates for **explicitly tracked** behavior, not claims that no implicit adaptation occurred

Primary baseline references:
- `architecture/02-experiments/2026-03-22-architecture-corpus-normalization.md`
- `architecture/03-adopted/2026-03-22-architecture-maturity-bundle-adopted.md`
- `shared/contracts/architecture-self-improvement-contract.md`

## Source processing metrics

- Sources processed this cycle: `17` distinct source-driven candidates with individual Architecture handling, plus `7` internally-generated Architecture adoption slices
- Mechanisms extracted: `24` adopted mechanisms in the current Architecture corpus baseline
- Mechanisms adapted (explicit adaptation, not raw adoption): `0` explicitly tracked in contract-shaped form across the pre-doctrine adopted set
- Mechanisms improved beyond source: `0` explicitly tracked with structured improvement deltas across the pre-doctrine adopted set
- Total adoptions: `24`
- Meta-useful adoptions: `7`
- Adaptation coverage: `0 / 24 = 0%` explicit baseline coverage
- Improvement coverage: `0 / 24 = 0%` explicit baseline coverage
- Meta-usefulness rate: `7 / 24 = 29.2%`

## Category-level assessment

### Analysis quality
- Current state: `adequate`
- Change since last cycle: `first_cycle`
- Evidence: source-driven work produced several high-value extractions, and `gpt-researcher` remains the strongest pre-doctrine evidence-heavy Architecture slice, but no adopted record in the evaluated cycle actually used `source-analysis-contract`
- Highest priority gap: exercise `shared/contracts/source-analysis-contract.md` on the next real source-driven Architecture slice so analysis quality stops being inferred from narrative quality alone

### Extraction quality
- Current state: `adequate`
- Change since last cycle: `first_cycle`
- Evidence: the corpus shows durable extraction value because 8 reference patterns were promoted into shared contracts and 14 structural adoptions remain product-materialized, but baggage exclusion and extraction precision were not tracked in a contract-shaped way
- Highest priority gap: require explicit value-map/baggage-map output on the next source-driven Architecture adoption instead of relying on implicit extracted-pattern prose

### Adaptation quality
- Current state: `weak`
- Change since last cycle: `first_cycle`
- Evidence: the normalization baseline found adaptation evidence to be implicit everywhere; the corpus contains Directive-owned artifacts, but no evaluated source-driven adoption used explicit `original_vs_adapted_delta` structure
- Highest priority gap: run one post-doctrine source-driven Architecture slice that completes `adaptation-decision-contract` with substantive adaptation deltas

### Improvement quality
- Current state: `weak`
- Change since last cycle: `first_cycle`
- Evidence: multiple adoptions clearly improved on source material in practice, but the cycle has no explicit `original_vs_improved_delta` record shape, so improvement quality is not yet measurable
- Highest priority gap: require one real Architecture adoption to document what went beyond the original source instead of only what was retained

### Routing quality
- Current state: `adequate`
- Change since last cycle: `first_cycle`
- Evidence: the corpus correctly classifies 3 direct-useful candidates as Forge-routed, and the retroactively normalized `adopted-candidates-architecture-recheck` record materially improved lane-boundary discipline
- Highest priority gap: make future Architecture adopted records carry clearer Forge-threshold and handoff references so route correctness is explicit, not reconstructed later

### Evaluation quality
- Current state: `strong`
- Change since last cycle: `first_cycle`
- Evidence: this cycle produced `architecture-review-guardrails`, the Architecture self-improvement contract, the cycle-evaluation template, and the corrected corpus-normalization baseline; Architecture can now evaluate itself with a real rubric instead of summary-only judgment
- Highest priority gap: use the evaluation machinery on at least one post-doctrine source-driven Architecture slice so evaluator quality is exercised on fresh work, not only on retrospective cleanup

### Handoff quality
- Current state: `adequate`
- Change since last cycle: `first_cycle`
- Evidence: Architecture now has explicit Forge-threshold logic and the prior lane-boundary recheck prevented early candidates from silently dragging runtime work back into Architecture, but handoff references across historical adopted records are still uneven
- Highest priority gap: require adopted records with direct usefulness to include explicit Forge handoff refs or explicit threshold justification

## Meta-usefulness claim verification

Review meta-useful adoptions that already contain a self-improvement evidence block.

| Adoption | Claim | Verification method | Result | Notes |
|---|---|---|---|---|
| `impeccable-wave-02-adopted` | Architecture review guardrails will improve future Architecture evaluation quality | `next_cycle_comparison` | `partially` | The current cleanup/evaluation pass caught lifecycle contradictions and stale baseline claims more systematically than earlier Architecture summaries, but there is not yet a second post-guardrail review cycle with comparable trend data |
| `adopted-candidates-architecture-recheck` | Future planning will route runtime implementation to Forge instead of leaving it inside Architecture | `next_cycle_comparison` | `partially` | Subsequent runtime transformation work stayed in Forge and Architecture was resumed only after Forge stopping conditions were met, but this is still one bounded observation rather than a longer trend |
| `architecture-maturity-bundle` | The next Architecture cycle evaluation will be able to fill real metrics and verify prior meta-usefulness claims | `next_cycle_comparison` | `confirmed` | This evaluation exists because that bundle added the self-improvement contract and cycle-evaluation template |
| `architecture-corpus-normalization` | Future Architecture records will be easier to classify and the cycle baseline will support recurring evaluation | `next_cycle_comparison` | `confirmed` | The corrected corpus-normalization baseline was used directly for this evaluation and for the lifecycle cleanup performed immediately before it |

## Cycle verdict

- Overall self-improvement: `improving`
- Strongest category this cycle: `evaluation_quality`
- Weakest category this cycle: `adaptation_quality`
- Next cycle priority: execute one real post-doctrine source-driven Architecture slice end-to-end through `source-analysis-contract`, `adaptation-decision-contract`, `architecture-adoption-criteria`, and this cycle-evaluation system
- Specific investment recommendation: do not spend the next Architecture slice on more governance expansion first; instead, choose one mission-relevant source candidate and force the full `analyze -> adapt -> improve -> decide` chain so adaptation coverage and improvement coverage move off the current `0% explicit baseline`

## Why this matters

This evaluation shows that Architecture has materially improved its own governance and evaluation machinery, but has **not yet proved** the new source-adaptation operating chain on a fresh source-driven Architecture case.

That makes the current system state:
- strong on lifecycle governance and evaluation scaffolding
- adequate on routing and extraction discipline
- still weak on explicit adaptation/improvement execution

The next Architecture cycle should therefore optimize for **using the system**, not adding more Architecture theory around it.
