# Structured Output Fallback Parser Policy (Paper2Code Slice 2)

Date: 2026-03-20
Track: Directive Architecture
Source anchor: `Paper2Code` planned-next Slice 2

## Objective

Define a deterministic, typed fallback parsing policy for noisy structured outputs so lifecycle artifacts remain valid without runtime stack coupling.

## Policy

Fallback order:
1. strict JSON parse
2. fenced JSON parse
3. extracted JSON segment parse
4. trailing-comma cleanup parse
5. typed list fallback for list-shaped fields

## Typed Targets

- `source_urls[]`
- `visited_urls[]`
- `errors[]`
- `citations[]`
- `research_costs`
- `quality_signals`

## Guardrails

- preserve explicit null/empty when parsing fails
- do not mark strict artifacts valid unless required fields remain typed
- keep fallback deterministic (no probabilistic repair logic)

## Enforcement Surface

- parser implementation:
  - `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\structured-output-fallback.ts`
- lifecycle artifact binding:
  - `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- host check:
  - `npm run check:directive-structured-output-fallback`
