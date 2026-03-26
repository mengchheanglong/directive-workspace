# Promotion Quality Gate Contract (Scientify Pattern Adaptation)

Date: 2026-03-20
Track: Directive Architecture
Source anchor: `scientify` Slice 6 extracted quality-gate pattern

## Purpose

Standardize promotion-quality evidence before runtime-callable claims by requiring deterministic thresholds, observed metrics, explicit validation state, and fail reasons.

## Canonical Profile

- `promotion_quality_gate/v1`

## Required Threshold Fields

- `Full-text coverage threshold (%)`
- `Evidence-binding threshold (%)`
- `Citation-error threshold (%)`

Baseline policy:
- full-text coverage >= `80`
- evidence-binding >= `90`
- citation-error rate <= `2`

## Required Observed Metrics

- `Observed full-text coverage (%)`
- `Observed evidence-binding (%)`
- `Observed citation error rate (%)`

## Required Decision Fields

- `Quality gate result` (`pass | degraded_quality | fail`)
- `Validation state` (`self_validated | openreview_related | openreview_not_found | external_validated`)
- `Quality gate fail reasons`

## Deterministic Decision Logic

1. When observed metrics meet all thresholds, result must be `pass`.
2. When one or more metrics miss threshold, result must be `degraded_quality` or `fail`.
3. `pass` requires `Quality gate fail reasons: none`.
4. Non-pass result requires explicit non-empty fail reasons.
5. Promotion record and linked proof artifact must agree on candidate id and quality gate result.

## Adoption Boundary

- This is an Architecture-owned contract pattern.
- Runtime applies it in promotion/proof artifacts.
- Host checks enforce compliance (`check:directive-promotion-quality-contracts`).
