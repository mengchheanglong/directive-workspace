# OpenClaw Checker Family Grouping

- Date: 2026-04-03
- Slice type: checker-family organization
- Scope: `scripts/openclaw/`, `package.json`, `control/state/operator-simplicity-migration-*.json`

## Why this slice

The preceding audit proved the `openclaw` trio was the next safe grouping candidate:
- exact path references were limited to `package.json`
- the family did not depend on sibling script paths
- the trio already formed one coherent Discovery-adapter surface

## What changed

- moved the three `check-openclaw-*` files under `scripts/openclaw/`
- kept the existing npm command names stable by updating only the package entry-point paths
- updated the one self-referential source path inside the discovery-submission adapter checker

## Stop-line

One additional checker family is now grouped without widening into a broader scripts reshuffle.
