# Deferred Decision: SWE-agent Slice 8 (2026-03-19)

## decision
- **Defer**

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\SWE-agent`
- Commit: `bfdcfa5f6c4c974e9fc754445b469a7564b7bb92`
- Describe: `v1.1.0-151-gbfdcfa5f`

## why deferred
1. Upstream README explicitly indicates mini-swe-agent has superseded this runtime path.
2. Directive Workspace already adopted mini-swe-agent extracted patterns in prior slice.
3. Runtime overlap risk is high; marginal ROI is low for additional framework-level extraction now.

## extracted value retained
- Config-governed run budgets/retry,
- trajectory audit traces,
- hook-composition extension pattern.

## excluded as baggage
- Full SWE-agent runtime/tooling stack and benchmark runner integration.

## re-entry criteria
1. mini-swe-agent lane shows sustained quality ceiling in tracked mission tasks, and
2. a specific missing mechanism (not generic coding power) is identified that SWE-agent uniquely addresses.

## rollback
- Delete this defer record and corresponding execution artifact if re-opened.
