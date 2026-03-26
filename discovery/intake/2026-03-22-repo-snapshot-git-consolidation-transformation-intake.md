# Discovery Fast Path: Repo Snapshot Git Consolidation Transformation

- Candidate id: `dw-transform-repo-snapshot-git-consolidation`
- Candidate name: `Repo Snapshot Git Command Consolidation`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - reduce repo-snapshot git metadata overhead inside context-pack assembly`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- reduces process-spawn overhead in a dominant `buildRepoSnapshot` subpath
- preserves the existing git snapshot shape while cutting repeated git command work
- improves a host-level runtime dependency that materially affects context-pack build cost

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving runtime-latency transformation on a mission-relevant host surface`

## Bounded Claim

Consolidate branch, dirty-file, and ahead/behind collection into one `git status --porcelain=1 --branch` call while preserving:
- `GitSnapshot` output shape
- changed file ordering and truncation behavior
- staged / modified / untracked counts
- recent commit reporting
- summary string behavior

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts`
- do not change `GitSnapshot` types or repo-snapshot consumers
- benchmark the legacy multi-call git path against the consolidated path on the real control-plane repo

## Result Link

- Runtime record: `runtime/records/2026-03-22-repo-snapshot-git-consolidation-transformation-record.md`
