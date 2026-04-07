# Host Adapters

`hosts/adapters/` is the host-owned adapter edge for external systems and import flows.

It is the right home for code that:
- adapts outside payloads into Directive Workspace host-neutral requests
- imports external discovery bundles into the Discovery front door
- remains product-owned, but is primarily integration-shaped rather than lane lifecycle logic

What belongs here:
- OpenClaw submission and signal adapters
- external bundle/import adapters such as Research Engine discovery import

What does not belong here:
- Discovery lane lifecycle code
- Runtime lane lifecycle code
- Architecture lane lifecycle code
- canonical Engine state or truth resolution
- host-specific web/server/runtime code for a single host
