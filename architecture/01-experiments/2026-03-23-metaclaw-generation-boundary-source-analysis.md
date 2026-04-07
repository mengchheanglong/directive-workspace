# MetaClaw Generation Boundary Source Analysis

- Source id: `dw-src-metaclaw-generation-boundary`
- Source type: `workflow`
- Source reference:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\skill_manager.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\data_formatter.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\trainer.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\MetaClaw\metaclaw\rollout.py`
- Analysis date: `2026-03-23`
- Owning track: `Architecture`

## Mission alignment

- Active mission reference: `knowledge/active-mission.md`
- Mission relevance: Improves Architecture's self-improvement discipline by preventing old evidence from being blended with post-change confirmation after the system materially changes its own source-processing behavior.
- Capability gap addressed: Architecture has gained multiple self-improving mechanisms, but it still lacks an explicit rule for when earlier proof stops counting as confirmation of the new system.
- Usefulness level: `meta`

## Value map

- Extractable mechanisms:
  - generation bump when the operating surface changes materially
  - evidence tagged with the generation active at collection time
  - stale pending and queued evidence discarded after a generation bump
  - support-set vs query-set separation across self-improvement boundaries
- Value density: `high`
- Value type per mechanism:
  - `generation boundary` -> `contract`
  - `boundary note` -> `template`
  - `generation boundary schema` -> `schema`
  - `post-change clean proof rule` -> `policy`

## Baggage map

- Implementation baggage:
  - RL trainer internals
  - sampling-client hot swap behavior
  - queue management for training samples
- Stack baggage:
  - Python async rollout worker
  - LoRA/Tinker/MinT training stack
  - PRM scorer and evolver backend assumptions
- Scope baggage:
  - live conversation learning loop
  - reward-model and optimizer details
  - skills directory retrieval logic
- Complexity baggage:
  - full RL training clock cycle
  - support/query separation details tied to gradient updates

## Adaptation opportunity

- Adaptation candidates:
  - convert `generation` from RL sample freshness into an Architecture evidence-generation boundary
  - convert sample discard logic into a reusable rule for stale proof exclusion after self-improving adoptions
  - convert queue flush semantics into explicit boundary reset actions and clean-proof requirements
- Adaptation type per candidate:
  - `generation boundary contract` -> `reshape`, `simplify`, `constrain`
  - `boundary note template` -> `reshape`, `recompose`
  - `clean-proof rule` -> `constrain`, `extend`

## Improvement opportunity

- Improvement candidates:
  - make the boundary behavior explicit and reviewable in cycle evaluation instead of implicit in trainer code
  - preserve historical evidence as context while separating it from clean confirmation
  - make generation-boundary events machine-readable for future evaluators
- Improvement type per candidate:
  - explicit reviewable boundary -> `quality`
  - context-vs-confirmation separation -> `safety`
  - schema-backed boundary note -> `evaluability`

## Exclusion list

- Excluded elements:
  - RL reward computation
  - skill retrieval and evolution implementation
  - rollout worker server lifecycle
  - training backend integration
- Exclusion reason per element:
  - not required to improve Directive Workspace Architecture's self-improvement evidence discipline

## Analysis verdict

- Overall verdict: `proceed_to_extraction`
- Verdict rationale: The valuable part is not MetaClaw's RL stack. It is the stricter evidence rule underneath it: when a self-improving system changes its operating surface, older evidence should no longer count as clean confirmation of the new generation. Directive Workspace currently lacks that rule and can benefit directly from it at the Architecture cycle-evaluation layer.
- Extraction priority: `high`
- Estimated adaptation cost: `moderate`
