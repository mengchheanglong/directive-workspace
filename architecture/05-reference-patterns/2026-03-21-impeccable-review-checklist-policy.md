# Impeccable Review Checklist Policy

Date: 2026-03-21
Track: Directive Architecture
Source slice: `2026-03-21-impeccable-contract-closure-slice-18.md`
Status: active architecture policy

## Policy Intent

Normalize Impeccable surviving value into a reusable Architecture review checklist and shared review-guardrail contract.

## Materialized Outputs

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\architecture-review-guardrails.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\architecture-review-checklist.md`

## Retained Mechanism

- named guardrail vocabulary
- explicit anti-pattern scan
- requirement that review output includes state, validation, ownership, and rollback clarity

## Directive Adaptation Rule

- keep the review guardrail semantics
- do not adopt the upstream skill pack or runtime packaging
- use the checklist for Architecture review quality first, with host UI use remaining advisory unless explicitly elevated

## Validation Hooks

- `npm run check:directive-impeccable-contracts`
- `npm run check:directive-workflow-doctrine`
- `npm run check:ops-stack`

## Closure Note

- this closes the Impeccable Wave 02 reference-pattern gap for the current slice
- later work should be optional host-consumption refinement, not missing Architecture ownership
