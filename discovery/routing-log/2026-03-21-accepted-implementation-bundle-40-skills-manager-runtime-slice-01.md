# Accepted Implementation Bundle 40

- Date: 2026-03-21
- Candidate: `skills-manager`
- Track: Directive Forge
- Decision: accepted for bounded runtime implementation
- Why now:
  - Forge system bundles 02-04 are closed
  - the remaining value is a clean host-fit import lane rather than desktop runtime adoption
  - rollback is explicit and host-local
- Implementation bundle:
  - promote `skills-manager` to bounded callable skill lifecycle import lane
  - add Forge-owned guard/profile/record artifacts
  - add Mission Control import smoke artifact and host checker
- Expected validation:
  - `npm run forge:skills-manager:smoke`
  - `npm run check:directive-skills-manager-forge`
  - `npm run check:agents-import-packs-api-backend`
  - `npm run check:ops-stack`
