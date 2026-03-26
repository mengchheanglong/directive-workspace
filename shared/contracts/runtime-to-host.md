# Runtime To Host Handoff

Use this handoff when a Runtime candidate is ready to move from product-owned runtime planning into host-owned implementation or activation work.

When to use:
- a Runtime runtime slice has finished bounded validation
- the callable surface is concrete enough to target a host integration path
- proof, rollback, and gate expectations are known

Required fields:
- candidate id
- candidate name
- Runtime record reference
- promotion contract reference
- target host
- target runtime surface
- proposed runtime status
- implementation owner
- required gates
- rollback plan
- proof expectation
- host-specific notes

Rules:
- Runtime owns the promotion record.
- The host owns runtime code, deployment behavior, and host-side verification.
- No host activation is considered complete without linked proof and explicit rollback.

Current host:
- `Mission Control`
