# Architecture Consumption Records (DEEP-only)

This folder is part of the optional Architecture DEEP continuation bundle.

Default rule:
- For NOTE/STANDARD Architecture work, stop at `bounded-result` in `architecture/01-experiments/`.
- Do not open consumption records by default.

Use this folder only when the case is explicitly DEEP-mode and an integration record has already been produced for the same case.

Typical entry conditions:
- a matching integration record already exists in `architecture/07-integration-records/`
- consumption recording adds concrete evidence of real downstream use of the integrated value
- the consumption step is not duplicating what the integration record already proves

Typical downstream path after this folder:
- `architecture/09-post-consumption-evaluations/` only when still justified

If those conditions are not true, return to the shortest truthful path and stop at `bounded-result`.

