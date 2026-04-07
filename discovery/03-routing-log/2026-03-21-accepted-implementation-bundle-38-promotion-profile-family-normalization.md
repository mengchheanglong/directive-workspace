# Accepted Implementation Bundle 38: Promotion Profile Family Normalization

Date: 2026-03-21
Status: accepted
Target track: Directive Runtime
Adoption target: Directive Runtime

## Why

Runtime had more than one promotion profile family, but the live system still relied on scattered implicit mapping between selector, proof shape, and checker.

## Accepted implementation

- add one Runtime-owned promotion profile catalog
- normalize promotion records to declare family, proof shape, and primary host checker
- add one host check for catalog integrity
- keep profile-specific proof enforcement in the existing dedicated host checks

## Output

- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\PROMOTION_PROFILES.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-21-runtime-system-bundle-04-promotion-profile-normalization.md`
