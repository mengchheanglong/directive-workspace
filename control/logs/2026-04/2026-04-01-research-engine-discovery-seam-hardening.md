Cycle

Chosen task:

Harden the bounded `research-engine` Discovery import seam so repeated imports stay safe, mixed-mission bundles fail closed, and the adapter remains Discovery-owned.

Why it won:

Current repo truth showed two concrete import hardening gaps in an otherwise useful Discovery front-door seam:

1. importing the same bundle twice failed on duplicate `candidate_id`
2. mission ids could drift across the manifest and packets without rejection

Affected layer:

Discovery front-door import boundary and bounded verification.

Owning lane:

Discovery

Mission usefulness:

Directive Workspace can keep using `research-engine` as a bounded Discovery skill without turning it into a parallel routing authority or a brittle one-shot importer.

Proof path:

1. Keep generic queue uniqueness strict.
2. Allocate explicit run-scoped imported candidate ids inside the `research-engine` seam, with deterministic collision suffixes for repeated shadow imports.
3. Enforce mission-id coherence across the bundle manifest, source-intelligence packet, and Discovery packet.
4. Stop carrying `routing_considerations` through the Discovery notes so imported packets stay bounded to intake/triage usefulness.
5. Extend the dedicated check to prove happy path import, repeated import safety, mixed-mission rejection, and Discovery-only boundary behavior.

Rollback path:

Revert only the Research Engine Discovery seam files and this bounded log.

Stop-line:

The `research-engine` seam is accepted once repeated imports are explicit and safe, mixed-mission bundles are rejected before import, and the adapter still enters only through the canonical Discovery front door.

Files touched:

- `shared/lib/research-engine-discovery-import.ts`
- `scripts/check-research-engine-discovery-import.ts`
- `control/logs/2026-04/2026-04-01-research-engine-discovery-seam-hardening.md`

Verification run:

- `npm run check:research-engine-discovery-import`
- `npm run check`

Result:

The seam now remains Discovery-owned, rejects mixed-mission bundles, and makes repeated shadow imports explicit instead of failing on a raw duplicate queue id.

Next likely move:

Review whether any other external Discovery feeder should follow the same canonical front-door import contract.
