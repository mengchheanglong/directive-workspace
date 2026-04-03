# Runtime Follow-up

This folder stores Runtime follow-up records that open or park Runtime cases after Discovery routing or Architecture handoff.

Default rule:
- One follow-up record per case.
- If the case is exploratory or lacks delivery pressure, park it here. Do not continue deeper just to complete the chain.
- Do not assume the newest or deepest file here is the next artifact to continue from.

Canonical operator entry surface:
- `npm run report:runtime-follow-up-navigation`

Use that report as the default operator surface for this folder. Do not use raw folder browsing or folder recency as the default navigation method.

This folder is a mixed corpus:
- active follow-up records that open or park a Runtime case
- bounded support bundles for later proof/promotion slices
- historical cutover and planning notes (audit context)

Operator buckets:
- active = follow-up records whose current head is still the follow-up record
- support = deeper bundles or older follow-up records that are still useful as references, but are not the current head
- archive = explicitly archived historical artifacts under `runtime/follow-up/archive/`

Current head for a case is never determined by folder recency. Use:
- `npm run report:runtime-follow-up-navigation`
- `shared/lib/dw-state.ts`
- `npm run report:directive-workspace-state`

NOTE-mode Runtime guidance:
- the normal daily stop is the follow-up record
- if a case is parked or exploratory, stay at the active follow-up record unless a later Runtime stage adds concrete new product value
- support bundles are not the default daily navigation surface

Operator rule:
- do not archive or move support bundles while checkers still reference them
- use `runtime/follow-up/archive/` only for verified reference-free historical artifacts

Template:
- `shared/templates/runtime-follow-up-record.md`

Archive:
- `runtime/follow-up/archive/`
