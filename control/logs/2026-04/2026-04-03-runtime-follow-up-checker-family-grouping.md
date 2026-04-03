# Runtime Follow-up Checker Family Grouping

- Date: 2026-04-03
- Slice type: checker-family organization
- Scope: `scripts/runtime-follow-up/`, `package.json`

## Why this slice

The root `scripts/` surface had a small, self-contained Runtime follow-up checker family that was only package-wired and did not depend on sibling script paths.

That made it a safe first grouping candidate:
- exact filenames were referenced only by `package.json`
- imports were all shared-lib imports
- rollback was a direct move back to the root `scripts/` surface

## What changed

- moved the `check-runtime-follow-up-*` trio under `scripts/runtime-follow-up/`
- updated `package.json` to keep the existing script names stable
- left all broader Runtime checker families in place

## Stop-line

One checker family is now grouped under `scripts/` without widening into a broader migration.
