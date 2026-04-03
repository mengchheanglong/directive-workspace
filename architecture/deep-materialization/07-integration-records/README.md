# Architecture Integration Records (DEEP-only)

This folder is part of the optional Architecture DEEP continuation bundle.

Default rule:
- For NOTE/STANDARD Architecture work, stop at `bounded-result` in `architecture/02-experiments/`.
- Do not open integration records by default.

Use this folder only when the case is explicitly DEEP-mode and a retained output has already been produced as a bounded implementation slice.

Typical entry conditions:
- a matching retained output already exists in `architecture/06-retained/`
- integration recording adds concrete evidence of how the retained value was wired into real product surfaces
- the integration step is not duplicating what the retained output already proves

Typical downstream path after this folder:
- `architecture/08-consumption-records/`
- then post-consumption evaluation only when still justified

If those conditions are not true, return to the shortest truthful path and stop at `bounded-result`.
