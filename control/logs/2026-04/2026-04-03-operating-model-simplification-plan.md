# 2026-04-03 operating-model simplification plan

- affected layer: Engine operating policy and lane ceremony
- owning lane: Architecture
- mission usefulness: reduce operator overhead now that the core workflow seams are already proven
- proof path:
  - `knowledge/operating-model-v2.md`
  - `control/policies/continuation-rules.md`
  - `knowledge/workflow.md`
  - `architecture/README.md`
- rollback path:
  - remove `knowledge/operating-model-simplification-plan.md`
  - remove this log entry
- stop-line: produce one concrete cut-now / keep / deep-only proposal without rewriting the active rules yet

## Result

- Added one concrete simplification plan anchored to current repo truth and the already-documented NOTE / STANDARD / DEEP model.
- The strongest proposed cuts are:
  - remove minimum-cycle pressure
  - make NOTE the real default
  - make Architecture bounded-result the normal finish line
  - reserve the long Architecture tail for DEEP-mode work only
