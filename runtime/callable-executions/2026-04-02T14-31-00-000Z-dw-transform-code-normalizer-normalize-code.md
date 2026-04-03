# Directive Runtime Callable Execution

- Execution ID: `2026-04-02T14-31-00-000Z-dw-transform-code-normalizer-normalize-code`
- Execution At: `2026-04-02T14:31:00.000Z`
- Capability ID: `dw-transform-code-normalizer`
- Capability Title: Code Normalizer (Behavior-Preserving Transformation)
- Capability Form: `runtime_owned_behavior_preserving_transformation`
- Tool: `normalize-code`
- Status: `success`
- Result OK: `true`
- Timeout Ms: `10000`
- Duration Ms: `0`
- Record Path: `runtime/callable-executions/2026-04-02T14-31-00-000Z-dw-transform-code-normalizer-normalize-code.json`
- Report Path: `runtime/callable-executions/2026-04-02T14-31-00-000Z-dw-transform-code-normalizer-normalize-code.md`

## Input Summary

- Kind: `object`
- Size Bytes: `113`
- Keys: `code`
- Preview: `{"code":"export const answer = 42;  \n\n\nexport function square(value: number) {\n  return value * value;\n}\n"}`

## Result Summary

- Kind: `object`
- Top-level Count: `3`
- Keys: `ok`, `normalizedCode`, `preservationProof`
- Preview: `{"ok":true,"normalizedCode":"export const answer = 42;\n\nexport function square(value: number) {\n  return value * value;\n}\n","preservationProof":{"inputLines":7,"outputLines":6,"inputNonBlankLines":4,"outputNonBlankLines":4,"transfor...`

## Boundaries

- One shared Runtime-owned callable executor surface only
- No host integration
- No promotion automation
- No automatic workflow advancement

