# OpenMOSS Review Feedback Lib Source Analysis

- Source id: `dw-src-openmoss-review-feedback-lib`
- Source type: `workflow`
- Source reference:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\OpenMOSS\app\services\review_service.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\OpenMOSS\app\services\reward_service.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\OpenMOSS\app\services\sub_task_service.py`
- Analysis date: `2026-03-23`
- Owning track: `Architecture`

## Mission alignment

- Active mission reference: `knowledge/active-mission.md`
- Mission relevance: Improves Directive Workspace's internal review, lifecycle, and blocked-recovery discipline by turning already-adopted OpenMOSS patterns into executable product-owned code instead of leaving them as contracts only.
- Capability gap addressed: The system already has lifecycle and score-feedback policies, but no canonical shared-lib helper operationalizes them as deterministic code.
- Usefulness level: `meta`

## Value map

- Extractable mechanisms:
  - deterministic lifecycle transition matrix
  - role-gated transition checks
  - deterministic review-score delta mapping
  - blocked-work recovery plan builder
  - review outcome resolver that combines quality band, score delta, and next-state recommendation
- Value density: `high`
- Value type per mechanism:
  - `transition matrix` -> `policy`
  - `role-gated checks` -> `algorithm`
  - `score delta mapping` -> `algorithm`
  - `blocked recovery plan` -> `workflow`
  - `review outcome resolver` -> `shared-lib`

## Baggage map

- Implementation baggage:
  - SQLAlchemy session handling
  - database transaction scope
  - OpenMOSS task/sub-task tables
- Stack baggage:
  - FastAPI backend
  - Python ORM integration
  - OpenMOSS role and agent IDs
- Scope baggage:
  - OpenMOSS task hierarchy and runtime dashboard
  - agent score leaderboards
- Complexity baggage:
  - full backend service layer
  - persistence and router behavior around review submission

## Adaptation opportunity

- Adaptation candidates:
  - convert OpenMOSS transition and score logic into a host-neutral TypeScript shared lib
  - keep deterministic review-to-feedback behavior while removing database side effects
  - map blocked reassign/resume logic into a reusable recovery-plan builder
- Adaptation type per candidate:
  - `lifecycle-review-feedback shared lib` -> `reshape`, `simplify`, `recompose`
  - `blocked recovery plan builder` -> `reshape`, `constrain`
  - `review outcome resolver` -> `simplify`, `extend`

## Improvement opportunity

- Improvement candidates:
  - unify lifecycle transition, score feedback, and blocked recovery into one product-owned executable surface
  - align the logic with Directive Workspace lifecycle states instead of OpenMOSS sub-task states
  - make the helper reusable across Architecture, Discovery, and later Runtime review loops
- Improvement type per candidate:
  - unified executable surface -> `composability`
  - Directive-specific lifecycle alignment -> `quality`
  - cross-track reuse -> `generality`

## Exclusion list

- Excluded elements:
  - SQL transaction code
  - OpenMOSS tables and IDs
  - backend API surfaces
  - UI and leaderboard behavior
- Exclusion reason per element:
  - not required for the reusable Directive-owned review/lifecycle engine

## Analysis verdict

- Overall verdict: `proceed_to_extraction`
- Verdict rationale: OpenMOSS contains a real executable system pattern that Directive Workspace already judged useful at the policy level. The remaining high-value move is to operationalize that pattern as product-owned code. That is a better fit than more contract-only extraction because it directly improves the system's ability to run deterministic review and recovery behavior.
- Extraction priority: `high`
- Estimated adaptation cost: `moderate`
