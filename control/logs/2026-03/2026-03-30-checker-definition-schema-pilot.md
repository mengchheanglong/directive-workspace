# Cycle Entry

Cycle 1

Chosen task:

Materialize the retained ESLint-derived checker-definition slice as one shared Architecture-owned schema pattern and one tiny pilot registry for existing repo validation scripts.

Why it won:

The prior outside-source pass already selected ESLint as the strongest bounded artifact pressure. The smallest truthful next move was to make that retained slice real without reopening runtime, planner, or structural-mapping seams.

Affected layer:

Shared schema/contracts plus repo validation check wiring.

Owning lane:

Architecture.

Mission usefulness:

Creates one Directive-owned checker-definition surface that makes a small subset of repo validation scripts more explicit, more reusable, and easier to extend without broad migration.

Proof path:

Add one shared schema, one bounded pilot registry, one pilot validator, wire it into `npm run check`, then verify with `npm run report:directive-workspace-state` and `npm run check`.

Rollback path:

Remove the checker-definition schema, pilot registry, pilot validator, README/package wiring, and this cycle log.

Stop-line:

Stop after one schema-backed pilot subset exists, the reserve candidates remain visible, and the repo truth/check surfaces still pass.

Files touched:

- `shared/schemas/checker-definition-registry.schema.json`
- `shared/schemas/README.md`
- `scripts/checker-definition-pilot.json`
- `scripts/check-checker-definition-pilot.ts`
- `package.json`
- `control/logs/2026-03/2026-03-30-checker-definition-schema-pilot.md`

Verification run:

- `npm run report:directive-workspace-state`
- `npm run check`

Result:

The retained slice is now real as one shared checker-definition registry schema plus a two-check pilot covering `check:control-authority` and `check:directive-engine-stage-chaining`. The pilot validator proves the registry is wired to live repo scripts and that each declared proof marker appears in real successful output.

Next likely move:

If this pattern keeps paying for itself, extend the same schema to one parity-style checker such as `check:case-planner-parity` before considering any broader checker migration.

Risks / notes:

- Spectral ruleset/docs family was a serious candidate but lost this slice because it would pull the work toward broader ruleset machinery before the base checker-definition pattern is proven.
- OPA policy/testing family was also a serious candidate but lost this slice because it would broaden into policy-engine pressure before a smaller repo-local checker contract exists.
- Spectral and OPA remain valid retained reserve candidates if later checker-definition follow-on pressure needs ruleset layering, reusable custom functions, or policy-style test gates.
