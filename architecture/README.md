# Directive Architecture

Directive Architecture is the reusable operating-code layer of Directive Workspace.

Architecture artifacts are not passive documentation. Contracts, schemas, templates, workflow rules, and doctrine are operating code (program-MD / org-as-code).

It owns:
- extraction of essential mechanisms from outside systems
- conversion of extracted value into product-owned contracts, schemas, templates, policies, and reusable rules
- bounded experiments to prove internal improvements
- adopted operating-code patterns and deferred decisions
- doctrine improvement over time
- Architecture decision records and bounded experiment notes only; raw source snapshots live under `C:\Users\User\.openclaw\workspace\directive-workspace\sources\`

It does not own:
- runtime/callable capability delivery (that is Runtime)
- host runtime code, database, or APIs (that is Mission Control)
- intake, triage, or routing (that is Discovery)
- raw upstream repo storage (that is `directive-workspace/sources/`)
- OpenClaw-native rescue role ownership (that belongs to OpenClaw)

OpenClaw note:
- if an Architecture document needs to mention OpenClaw rescue/recovery, reference `C:\Users\User\.openclaw\workspace\openclaw\RESCUE_OPENCLAW.md` instead of redefining the role here

Handoff rule:
- When Architecture work discovers runtime-worthy value, hand it to Runtime via the Architecture-to-Runtime handoff contract.
- Do not leak runtime work into Architecture.

Completion rule:
- Architecture is complete only when extracted value is materialized as product-owned Directive Workspace artifacts (contracts, schemas, templates, policies, rules).
- Mission Control host consumption can validate the result, but it does not define Architecture completion by itself.
- Canonical reference: `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\architecture-completion-rubric.md`

Default fast path:
- one routed candidate
- one bounded experiment slice
- one adopted or deferred outcome

Escalate beyond that only when the output becomes reusable doctrine, shared contract, or cross-track handoff.

Canonical references:
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\workflow.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\knowledge\architecture-completion-rubric.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\ARCHITECTURE_EXPLORATION.md`
