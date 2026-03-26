# Directive Agentics Slice 2 Playbooks

## Scope
Translated operator playbooks from `agentics` workflow patterns for Directive Runtime.
This slice is documentation-only and does not change runtime behavior.

## Playbook A: Directive Daily Status Digest

### objective
Generate a deterministic daily summary of directive capability movement and gate health.

### inputs
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\*.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\*.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\04-deferred-or-rejected\*.md`
- Latest gate outputs from `mission-control` checks.

### outputs
- One concise markdown digest with:
  - new experiments count
  - adopted/planned-next count
  - deferred/parked count
  - gate pass/fail snapshot
  - next actions list (max 3 items)

### guardrails
- Read-only scan of artifact files.
- No edits outside explicit execution artifact file.
- Hard-fail if any required gate output is missing.

### stop conditions
- Stop when all four required gate statuses are captured.
- Stop immediately if a gate check is failing and emit blocker.

### rollback
- Remove generated digest artifact only.

## Playbook B: Directive Docs Maintenance Sweep

### objective
Enforce minimum structure quality for new slice and execution docs.

### inputs
- New slice docs in `02-experiments` for current date.
- New decision docs in `03-adopted` and `04-deferred-or-rejected`.

### outputs
- Validation report with per-file checks:
  - required headings present
  - command evidence included
  - rollback note included
  - decision state explicit (adopt/defer/reject)

### guardrails
- Validation-only, no auto-rewrite.
- Fail closed if required headings are missing.
- Keep checks deterministic (string/pattern checks only).

### stop conditions
- Stop when all target files are checked exactly once.
- Stop immediately on unreadable file/path.

### rollback
- Delete validation report artifact only; templates remain as reusable playbooks.
