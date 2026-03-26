# Discovery Intake Stack-Signals Checklist

Date: 2026-03-20
Track: Directive Discovery
Source slice: `2026-03-20-celtrix-implementation-slice-01.md`
Status: active intake addendum

## Purpose

Add stack-signals to intake so routing quality improves before deep triage.

## Required Stack Signals

Capture at intake time:
- primary language
- runtime environment
- framework/library core
- build/package system
- deployment assumptions
- external service assumptions
- state/data assumptions

## Routing Hints

Prefer Architecture route when:
- value is mostly contract/pattern/process improvement
- runtime surface is broad and risky
- integration requires framework-level changes

Prefer Runtime route when:
- value is a bounded callable/helper capability
- runtime objective is explicit and reversible
- gate validation can be done safely with current host checks

Prefer Discovery hold states when:
- value is useful but not actionable now
- source lacks concrete integration target
- risk exceeds current runway

## Intake Record Addendum Fields

Append these fields in future intake notes:
- `stack.language`
- `stack.runtime`
- `stack.framework`
- `stack.packageTool`
- `stack.deployment`
- `stack.externalDependencies`
- `stack.dataModelAssumptions`

## Boundary

This checklist is routing metadata only.
It does not authorize template/scaffolder runtime adoption.
