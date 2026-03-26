# Architecture Cycle Evaluation - Wave 09 Versioned Decision Envelope Activation

- Cycle id: `architecture-wave-09-versioned-decision-envelope-activation`
- Cycle date range: `2026-03-23` to `2026-03-23`
- Evaluation date: `2026-03-23`
- Evaluator: `Codex`
- Owning track: `Architecture`

## Evaluation scope note

This cycle evaluates the step after:
- `architecture/02-experiments/2026-03-23-architecture-cycle-evaluation-wave-08.md`

Wave 08 removed the host-script persistence seam from retained Architecture decisions.
The remaining structural gap was that the retained decisions themselves were still unversioned JSON.

Primary record refs:
- `architecture/03-adopted/2026-03-23-mini-swe-agent-adoption-decision-envelope-lib-adopted.md`

Evaluation surface:
- `shared/lib/architecture-adoption-decision-envelope.ts`
- `shared/lib/architecture-adoption-artifacts.ts`
- `shared/schemas/architecture-adoption-decision.schema.json`
- `shared/lib/architecture-adoption-decision-store.ts`

## Source processing metrics

- Decision source records reviewed: `1`
- Sources processed this cycle: `1` new external source family (`mini-swe-agent`)
- Mechanisms extracted: `1`
- Mechanisms adapted (explicit adaptation, not raw adoption): `1`
- Mechanisms improved beyond source: `1`
- Adoption decision artifacts reviewed: `1`
- Adoption verdict counts: `1 adopt`, `0 hand_off_to_runtime`, `0 stay_experimental`, `0 defer`, `0 reject`
- Artifact type distribution: `1 shared-lib`
- Completion-status distribution: `1 product_materialized`
- Runtime handoff required decisions: `0`
- Total adoptions: `1`
- Meta-useful adoptions: `1`
- Adaptation coverage: `1 / 1 = 100%`
- Improvement coverage: `1 / 1 = 100%`
- Meta-usefulness rate: `1 / 1 = 100%`
- Transformation-artifact gate pass rate: `1 / 1 = 100%`
- Packet-consumption reuse rate: `not_applicable` for this retained-artifact slice
- Generation-boundary events: `0`
- Post-generation confirmations: `1` the retained decision corpus was re-emitted through backfill with explicit `decision_format` identity

## Category-level assessment

### Analysis quality
- Current state: `strong`
- Change since last cycle: `stable`
- Evidence: the slice picked a real retained-artifact system gap and a real reusable mechanism from `mini-swe-agent` instead of broad agent/runtime behavior
- Highest priority gap: test the same extraction standard on one more source family outside agent-run serialization

### Extraction quality
- Current state: `strong`
- Change since last cycle: `stable`
- Evidence: the slice extracted only the versioned-envelope and recursive-merge mechanics needed by Directive Architecture
- Highest priority gap: keep avoiding over-extraction from source repos with much broader runtime baggage

### Adaptation quality
- Current state: `strong`
- Change since last cycle: `stable`
- Evidence: the source mechanism was reshaped into a Directive-specific versioned decision envelope and wired into the retained corpus without importing source runtime structure
- Highest priority gap: exercise the version boundary through a later actual format increment, not just the first format declaration

### Improvement quality
- Current state: `strong`
- Change since last cycle: `improved`
- Evidence: retained decisions are now explicitly self-identifying by format and optional nested sections are built through a reusable merge primitive instead of ad hoc assembly
- Highest priority gap: add a later reader/upgrade path for pre-format or future-format decisions if the schema changes again

### Routing quality
- Current state: `strong`
- Change since last cycle: `stable`
- Evidence: the mechanism clearly belongs in Architecture because it improves retained decision durability rather than runtime capability
- Highest priority gap: none for this slice

### Evaluation quality
- Current state: `strong`
- Change since last cycle: `improved`
- Evidence: the retained decision corpus was regenerated through backfill and remains checker-valid while now carrying explicit format identity
- Highest priority gap: add a corpus checker assertion that every retained decision artifact carries the current canonical format

### Handoff quality
- Current state: `adequate`
- Change since last cycle: `stable`
- Evidence: this slice correctly required no Runtime handoff
- Highest priority gap: continue separating retained Architecture format mechanics from any future runtime artifact-envelope work

## Meta-usefulness claim verification

| Adoption | Claim | Verification method | Result | Notes |
|---|---|---|---|---|
| `mini-swe-agent-adoption-decision-envelope-lib` | retained Architecture decisions will become safer to evolve once they carry an explicit format identifier and canonical merge discipline | `structural_inspection` | `confirmed` | the adoption-artifact builder, schema, store-backed writer, and re-emitted retained corpus now all use the explicit `decision_format` |

## Generation boundary review

| Boundary | Triggering adoption | Stale evidence excluded | Carry-forward allowed | Clean post-boundary proof present? |
|---|---|---|---|---|
| none opened in this cycle | n/a | n/a | n/a | `yes` |

## Cycle verdict

- Overall self-improvement: `improving`
- Strongest category this cycle: `improvement_quality`
- Weakest category this cycle: `handoff_quality`
- Next cycle priority: add one corpus-level executable check that current retained decisions all carry the canonical format and then pick the next host-script seam worth removing through a source-driven Architecture extraction
- Specific investment recommendation: keep improving the retained Architecture system at the executable layer, but stop if the next source candidate offers only naming or documentation value instead of a real code mechanism
