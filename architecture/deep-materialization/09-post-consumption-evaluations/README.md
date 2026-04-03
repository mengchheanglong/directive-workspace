# Architecture Post-Consumption Evaluations (DEEP-only)

This folder is part of the optional Architecture DEEP continuation bundle.

Default rule:
- For NOTE/STANDARD Architecture work, stop at `bounded-result` in `architecture/02-experiments/`.
- Do not open post-consumption evaluations by default.

Use this folder only when the case is explicitly DEEP-mode and a consumption record has already been produced for the same case.

Typical entry conditions:
- a matching consumption record already exists in `architecture/08-consumption-records/`
- evaluation adds concrete evidence of whether the consumed value actually improved the system
- the evaluation produces actionable findings (e.g., reopen, revise, deprecate) rather than only confirming what is already known

This is the terminal folder in the Architecture DEEP continuation bundle.

If those conditions are not true, return to the shortest truthful path and stop at `bounded-result`.
