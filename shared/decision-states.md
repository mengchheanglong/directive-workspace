# Decision States

Valid Directive decision states:

- `reject`
- `defer`
- `monitor`
- `experiment`
- `hold_in_discovery`
- `accept_for_architecture`
- `route_to_runtime_follow_up`
- `needs_human_review`
- `knowledge_only`

Rules:
- every candidate must end in one explicit state
- positive signal is not a decision by itself
- `accept_for_architecture` is not the same thing as runtime-callable delivery
- `needs_human_review` means the Engine found a bounded likely route, but explicit review is still required before downstream adoption

Current Engine preliminary-decision states:

- `hold_in_discovery`
- `accept_for_architecture`
- `route_to_runtime_follow_up`
- `needs_human_review`
