# Accepted Implementation Bundle 43: Runtime Import-Source Policy Alignment

Date: 2026-03-21
Status: accepted
Owner: Directive Runtime

## Why accepted

The host import-pack lane still had a private default-source list that bypassed Runtime classification policy.

## Accepted target

- `Directive Runtime`

## Accepted outputs

- canonical `runtime/IMPORT_SOURCE_POLICY.json`
- backend import-lane alignment with catalog + policy
- host enforcement for default/explicit/blocked import behavior

## Guard

Do not widen import behavior beyond the policy catalog while Wave 02 still has legacy live-runtime normalization debt.
