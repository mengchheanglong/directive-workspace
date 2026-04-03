# Architecture Retained Outputs (DEEP-only)

This folder is part of the optional Architecture DEEP continuation bundle.

Default rule:
- For NOTE/STANDARD Architecture work, stop at `bounded-result` in `architecture/02-experiments/`.
- Do not open retained outputs by default.

Use this folder only when the case is explicitly DEEP-mode and an implementation result has already been recorded as a bounded implementation slice.

Typical entry conditions:
- a matching implementation result already exists in `architecture/05-implementation-results/`
- retention adds concrete Directive-owned reusable Architecture value
- keeping the output as retained state is justified for downstream use

Typical downstream path after this folder:
- `architecture/07-integration-records/`
- then consumption/evaluation only when still justified

If those conditions are not true, return to the shortest truthful path and stop at `bounded-result`.
