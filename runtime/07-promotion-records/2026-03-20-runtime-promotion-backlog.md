# Runtime Promotion Backlog

Date: 2026-03-20
Owner: Directive Runtime
Status: active

## Purpose

Track Runtime candidates that already have execution records but are not yet eligible for promotion records or registry entries.

Promotion remains blocked until each candidate completes its bounded runtime slice with proof and host gate evidence.

## Pending Candidates

| Candidate id | Runtime record | Follow-up record | Current status | Required next artifact | Promotion readiness |
|---|---|---|---|---|---|
| _none_ | - | - | - | - | - |

## Legacy Live-Runtime Normalization Debt

| Candidate id | Current runtime state | Missing accounting | Required next artifact | Normalization target |
|---|---|---|---|---|
| _none_ | - | - | - | - |

## Normalized Legacy Live-Runtime This Cycle

| Candidate id | Runtime record | Promotion record | Registry entry | Decision |
|---|---|---|---|---|
| `agency-agents` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-21-agency-agents-runtime-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-agency-agents-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-agency-agents-registry-entry.md` | normalized as bounded legacy live-runtime lane |
| `desloppify` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-21-desloppify-runtime-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-desloppify-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-desloppify-registry-entry.md` | normalized as bounded legacy live-runtime lane |

## Promoted This Cycle

| Candidate id | Promotion record | Registry entry | Decision |
|---|---|---|---|
| `autoresearch` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-20-autoresearch-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-20-autoresearch-registry-entry.md` | approved for bounded callable follow-up |
| `agentics` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-20-agentics-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-20-agentics-registry-entry.md` | approved for bounded callable follow-up with maintenance blocker tracking |
| `mini-swe-agent` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-20-mini-swe-agent-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-20-mini-swe-agent-registry-entry.md` | approved for bounded callable fallback follow-up with UTF-8 runtime guard |
| `promptfoo` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-promptfoo-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-promptfoo-registry-entry.md` | approved for bounded callable eval follow-up |
| `puppeteer` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-puppeteer-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-puppeteer-registry-entry.md` | approved for bounded callable browser smoke follow-up |
| `skills-manager` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-skills-manager-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-skills-manager-registry-entry.md` | approved for bounded callable skill lifecycle import follow-up |
| `arscontexta` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-arscontexta-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-arscontexta-registry-entry.md` | approved for bounded callable context-operator import follow-up |
| `software-design-philosophy-skill` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-design-philosophy-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-design-philosophy-registry-entry.md` | approved for bounded callable design-review follow-up |
| `agency-agents` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-agency-agents-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-agency-agents-registry-entry.md` | approved as normalized bounded legacy live-runtime lane |
| `desloppify` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-desloppify-promotion-record.md` | `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\registry\2026-03-21-desloppify-registry-entry.md` | approved as normalized bounded legacy live-runtime lane |

## Required Gate Baseline Before Promotion

- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

## Decision Rule

Do not create a promotion record or registry entry for a candidate marked `pending runtime slice`.

Create promotion + registry artifacts only when:
- runtime slice evidence exists
- rollback path is documented in evidence
- required host gates are green
