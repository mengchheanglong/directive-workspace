# Directive Engine Run

- Run ID: `66b7e9ee-cc70-4eed-b211-2994220b4b3f`
- Received At: `2026-04-06T15:10:00.000Z`
- Candidate ID: `dw-test-open-deep-research-autoloop-2026-04-06`
- Candidate Name: Open Deep Research Autoloop Test
- Source Type: `external-system`
- Source Ref: `https://github.com/langchain-ai/open_deep_research`
- Selected Lane: `architecture`
- Usefulness Level: `meta`
- Decision State: `accept_for_architecture`
- Integration Mode: `adapt`
- Proof Kind: `architecture_validation`
- Run Record Path: `runtime/standalone-host/engine-runs/2026-04-06T15-10-00-000Z-dw-test-open-deep-research-autoloop-2026-04-06-66b7e9ee.json`

## Mission Fit

Research Engine identified this source as useful for typed research phases, reusable provider seams, and bounded acquisition-versus-synthesis workflow design.

## Usefulness Rationale

Meta-usefulness: the generated adaptation and improvement plans are Engine-self-improvement oriented, so the value is primarily about improving how Directive Workspace discovers, judges, adapts, proves, or integrates future sources rather than exposing repeated host-call value.

## Report Summary

Sync the accept_for_architecture decision and adapt integration plan into Directive Workspace reporting surfaces. Usefulness rationale: Meta-usefulness: the generated adaptation and improvement plans are Engine-self-improvement oriented, so the value is primarily about improving how Directive Workspace discovers, judges, adapts, proves, or integrates future sources rather than exposing repeated host-call value.

## Routing Rationale

- No unresolved gap matched strongly enough, so the assessment relied on mission-fit and lane-signal scoring.
- Recommended architecture because its lane score (23) exceeded the alternatives.
- Primary adoption target metadata is set to architecture, which contributes directly to lane scoring instead of relying only on keyword overlap.
- Structured source metadata says executable code is present, which strengthens repeated-runtime usefulness scoring.
- Structured source metadata says a workflow pattern is present, which strengthens architecture/runtime workflow interpretation beyond title keywords alone.
- Structured source metadata says the source primarily improves Directive Workspace itself, which strengthens Architecture scoring even when the source also contains executable code.
- Structured workflow-boundary metadata is set to bounded_protocol, which strengthens Architecture interpretation of explicit reusable workflow boundaries instead of relying only on title/summary tokens.
- Meta-usefulness signal is present (3/5), which strengthens Engine-improvement handling inside Architecture or Discovery.
- Route explanation breakdown for architecture: keyword=9, metadata=14, gap=0.
- Split-case is recommended because strong Architecture signals justify a fuller structural record even without an open gap match.

## Routing Explanation Breakdown

- Keyword: Meta-usefulness signal is present (3/5), which strengthens Engine-improvement handling inside Architecture or Discovery.
- Keyword: Keyword-derived lane scores: discovery=6, architecture=9, runtime=9.
- Metadata: Primary adoption target metadata is set to architecture, which contributes directly to lane scoring instead of relying only on keyword overlap.
- Metadata: Structured source metadata says executable code is present, which strengthens repeated-runtime usefulness scoring.
- Metadata: Structured source metadata says a workflow pattern is present, which strengthens architecture/runtime workflow interpretation beyond title keywords alone.
- Metadata: Structured source metadata says the source primarily improves Directive Workspace itself, which strengthens Architecture scoring even when the source also contains executable code.
- Metadata: Structured workflow-boundary metadata is set to bounded_protocol, which strengthens Architecture interpretation of explicit reusable workflow boundaries instead of relying only on title/summary tokens.
- Metadata: Metadata-derived lane scores: discovery=0, architecture=14, runtime=4.
- Gap: No unresolved gap matched strongly enough, so the assessment relied on mission-fit and lane-signal scoring.
- Gap: Gap-derived lane scores: discovery=0, architecture=0, runtime=0.
- Ambiguity: Top lane architecture beat runtime by 10 points after ambiguity penalties.
- Ambiguity: No material signal-family disagreement remained after scoring; keyword, metadata, and gap alignment all supported architecture or had no competing winner.

## Next Action

Materialize the adapted mechanism as engine-owned product logic only after the staged proof boundary for "improve engine self-improvement quality" remains explicit through adaptation_complete.
