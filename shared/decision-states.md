# Decision States

Valid Directive decision states:

- `reject`
- `defer`
- `monitor`
- `experiment`
- `accept_for_architecture`
- `route_to_forge_follow_up`
- `knowledge_only`

Rules:
- every candidate must end in one explicit state
- positive signal is not a decision by itself
- `accept_for_architecture` is not the same thing as runtime-callable delivery
