# 2026-04-02 - Scientify Mission Control MCP Guard Pattern Recommendation

## Slice

- Owning lane: `Discovery`
- Case: `dw-live-scientify-engine-pressure-2026-03-24`
- Result: recommend one bounded Mission Control-specific guard/check seam pattern only

## Repo truth at intake time

- `dw-live-scientify-engine-pressure-2026-03-24` is the strongest parked Runtime reopen candidate.
- `npm run check:runtime-promotion-assistance` proves:
  - assistance state: `ready_but_external_host_candidate`
  - recommended action: `keep_parked_external_host_candidate`
  - missing prerequisites: none
- Focused Runtime state proves the remaining blocker is host scope, not missing Runtime artifacts:
  - promotion-readiness artifact exists
  - promotion specification exists
  - Runtime record, proof, capability boundary, follow-up, and routing artifacts exist
  - proposed host is `mission-control`
- Current repo-native guard/check seams exist only for repo-native hosts:
  - standalone Scientify
  - Directive Workspace web-host OpenMOSS

## External MCP findings used as Discovery input

Sources:

- https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/

Bounded findings:

- The MCP tools specification supports a narrow guard/check contract shape:
  - human approval remains in the loop for sensitive operations
  - tool definitions use explicit JSON input schema and may declare output schema
  - servers must validate inputs, implement access controls, rate limit invocations, and sanitize outputs
  - clients should validate results, show tool inputs before sensitive calls, and log tool usage for audit
- The tool-annotations guidance supplies a bounded risk vocabulary:
  - `readOnlyHint`
  - `destructiveHint`
  - `idempotentHint`
  - `openWorldHint`
- The same MCP guidance also limits what can be claimed:
  - annotations are hints, not enforcement
  - annotations from untrusted servers must be treated as untrusted
  - real safety guarantees must remain in deterministic controls, not hints alone
  - open-world tools should be treated as trust-boundary crossings and their outputs as potentially untrusted

## Recommendation

MCP guidance is strong enough to justify one bounded repo-native next step:

- recommend a one-case Mission Control-specific guard/check seam for `dw-live-scientify-engine-pressure-2026-03-24`

That recommendation stays narrow only if the future seam is defined as:

- one-case only
- manual only
- non-executing unless a later explicit bounded decision says otherwise
- review/check oriented rather than host-integration oriented
- explicitly outside broad Mission Control integration and outside generalized external-host support

## Recommended contract shape if the later seam is opened

If a later bounded decision chooses to open the seam, the repo-native guard/check contract should require:

- target host fixed to `mission-control` for this case only
- explicit human approval requirement before any external-host call
- explicit declaration that the seam remains non-executing and non-integrating
- JSON-schema-defined required inputs for the host-facing review surface
- structured output schema or equivalent checker-validated snapshot shape
- explicit sanitization rule for externally sourced content and returned tool output
- explicit access-control boundary and bounded allowed operations
- audit expectation for host-call logging
- MCP-style risk labeling captured as repo-native review metadata:
  - read-only unless a later decision changes it
  - non-destructive
  - idempotent where checker/review calls are retry-safe
  - open-world true because the host is external

## Explicit non-authorizations

This recommendation does not authorize:

- Mission Control integration
- broad external-host Runtime support
- runtime execution
- promotion automation
- generalized MCP-tool adoption as Runtime authority

## Why this is a recommendation, not a seam opening

- MCP gives a useful bounded pattern, but not a reason to override repo doctrine.
- Repo truth still lacks a Mission Control-specific guard artifact and primary checker.
- The safe next step is therefore contract/check recommendation only.

## Proof path

- `npm run check:runtime-promotion-assistance`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- `npm run check`

## Rollback

- Remove this log only.

## Stop-line

Stop once the recommendation is explicit. Do not implement the Mission Control seam, host integration, runtime execution, or promotion automation in this slice.
