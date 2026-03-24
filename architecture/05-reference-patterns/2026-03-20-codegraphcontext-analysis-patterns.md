# CodeGraphContext Analysis Patterns

Date: 2026-03-20
Track: Directive Architecture
Type: reference pattern extraction

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling-parked\CodeGraphContext`

## Surviving Value

Keep the analysis pattern:
- graph-backed code understanding
- dual mode boundary between CLI use and AI-facing server mode
- local indexing before higher-level reasoning

## Directive Use

- useful as an Architecture reference for code-understanding surfaces
- useful as a reminder to separate indexing from query/use surfaces

## Do Not Keep

- the full graph database stack
- the full MCP/runtime package as a default Directive dependency
- heavy storage/runtime budget without explicit need
