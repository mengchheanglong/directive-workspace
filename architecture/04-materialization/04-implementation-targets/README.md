# Architecture Implementation Targets (DEEP-only)

This folder is part of the optional Architecture DEEP continuation bundle.

Default rule:
- For NOTE/STANDARD Architecture work, stop at `bounded-result` in `architecture/01-experiments/`.
- Do not open an implementation target by default.

Use this folder only when the case is explicitly DEEP-mode and the next step adds a concrete new Directive-owned artifact that does not already exist.

Typical entry conditions:
- a bounded result has already been produced
- extension beyond `bounded-result` is explicitly justified
- the next step is implementation planning, not exploratory review

Typical downstream path after this folder:
- `architecture/05-implementation-results/`
- then retention/integration/consumption/evaluation only when still justified

If those conditions are not true, return to the shortest truthful path and stop at `bounded-result`.

