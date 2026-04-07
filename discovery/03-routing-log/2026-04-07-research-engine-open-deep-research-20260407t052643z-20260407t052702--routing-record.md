# Discovery Routing Record: Open Deep Research

Date: 2026-04-07

- Candidate id: research-engine-open-deep-research-20260407t052643z-20260407t052702.
- Candidate name: Open Deep Research
- Routing date: 2026-04-07
- Source type: external-system
- Decision state: adopt
- Adoption target: engine-owned product logic
- Route destination: architecture
- Why this route: Recommended architecture because its lane score (29) exceeded the alternatives.
- Why not the alternatives: No unresolved gap matched strongly enough, so the assessment relied on mission-fit and lane-signal scoring. Primary adoption target metadata is set to architecture, which contributes directly to lane scoring instead of relying only on keyword overlap. Structured source metadata says executable code is present, which strengthens repeated-runtime usefulness scoring. Structured source metadata says a workflow pattern is present, which strengthens architecture/runtime workflow interpretation beyond title keywords alone. Structured source metadata says the source primarily improves Directive Workspace itself, which strengthens Architecture scoring even when the source also contains executable code. Structured workflow-boundary metadata is set to bounded_protocol, which strengthens Architecture interpretation of explicit reusable workflow boundaries instead of relying only on title/summary tokens. Meta-usefulness signal is present (4/5), which strengthens Engine-improvement handling inside Architecture or Discovery. Signal disagreement requires review: keyword evidence pointed to runtime instead of architecture. Route explanation breakdown for architecture: keyword=15, metadata=14, gap=0.
- Handoff contract used: n/a
- Receiving track owner: architecture
- Required next artifact: architecture/01-experiments/2026-04-07-research-engine-open-deep-research-20260407t052643z-20260407t052-engine-handoff.md
- Re-entry/Promotion trigger conditions: adaptation_complete, improvement_complete, engine_boundary_preserved, decision_review
- Review cadence: before any downstream execution or promotion
- Mission priority score: 49
- Routing confidence: medium
- Matched gap id: n/a
- Matched gap rank: n/a
- Route conflict: yes
- Needs human review: yes
- Linked intake record: discovery/01-intake/2026-04-07-research-engine-open-deep-research-20260407t052643z-20260407t052702--intake.md
- Linked triage record: discovery/02-triage/2026-04-07-research-engine-open-deep-research-20260407t052643z-20260407t052702--triage.md
- Linked Engine run record: runtime/standalone-host/engine-runs/2026-04-07T05-27-02-536Z-research-engine-open-deep-research-20260407t052643z-20260407t052-21c6546d.json
- Linked Engine run report: runtime/standalone-host/engine-runs/2026-04-07T05-27-02-536Z-research-engine-open-deep-research-20260407t052643z-20260407t052-21c6546d.md

## Ambiguity Summary

- Top track: architecture
- Runner-up track: runtime
- Score delta: 7
- Conflicting signal families: keyword
- Conflicting tracks: runtime

## Review Guidance

- Guidance kind: conflicted_architecture_review
- Summary: Conflicted Architecture route requires explicit structural review before downstream adoption.
- Operator action: Review the competing Runtime-vs-Architecture signals, confirm Architecture ownership explicitly, and keep the fuller split-case record until the conflict is resolved.
- Required checks: Confirm why Architecture still owns the candidate despite the competing Runtime signal. | Record why the alternative lane was rejected before any downstream adoption step. | Keep the split-case structural record explicit during review.
- Stop-line: Do not treat this as a fast-path Architecture adoption or open downstream Runtime follow-through until the conflict is explicitly resolved.

## Routing Explanation Breakdown

- Keyword: Meta-usefulness signal is present (4/5), which strengthens Engine-improvement handling inside Architecture or Discovery.
- Keyword: Keyword-derived lane scores: discovery=15, architecture=15, runtime=18.
- Metadata: Primary adoption target metadata is set to architecture, which contributes directly to lane scoring instead of relying only on keyword overlap.
- Metadata: Structured source metadata says executable code is present, which strengthens repeated-runtime usefulness scoring.
- Metadata: Structured source metadata says a workflow pattern is present, which strengthens architecture/runtime workflow interpretation beyond title keywords alone.
- Metadata: Structured source metadata says the source primarily improves Directive Workspace itself, which strengthens Architecture scoring even when the source also contains executable code.
- Metadata: Structured workflow-boundary metadata is set to bounded_protocol, which strengthens Architecture interpretation of explicit reusable workflow boundaries instead of relying only on title/summary tokens.
- Metadata: Metadata-derived lane scores: discovery=0, architecture=14, runtime=4.
- Gap: No unresolved gap matched strongly enough, so the assessment relied on mission-fit and lane-signal scoring.
- Gap: Gap-derived lane scores: discovery=0, architecture=0, runtime=0.
- Ambiguity: Top lane architecture beat runtime by 7 points after ambiguity penalties.
- Ambiguity: Signal disagreement requires review: keyword evidence pointed to runtime instead of architecture.
