# Promptfoo Runtime Follow-up

Date: 2026-03-20
Track: Directive Forge
Type: eval runtime follow-up
Status: planned

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\promptfoo`

## Runtime Value To Evaluate

- callable evaluation runs
- red-team checks against prompt/task surfaces
- CI-friendly regression checks for promoted AI capability

## Keep Rule

Keep:
- bounded eval harness behavior
- explicit result artifacts
- promotion-time regression checks

Do not keep blindly:
- whole upstream repo as a Forge dependency
- upstream runtime assumptions without host justification

## Exit Condition

This source becomes removable when:
- the retained eval workflow is product-owned in Forge or explicitly dropped
