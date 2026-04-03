# Workspace Truth Next Negative-Path Gate Decision

Cycle 1

Decision:

Authorize `stale statuses`.

Why this class won:

- It has the clearest shared resolver/report/check seam still open after the broken-link slice.
- The repo already exposes a machine-checkable queue status derivation surface in `hosts/web-host/data.ts` through `status_effective`, `status_warning`, `current_case_stage`, and `current_head`.
- Current composition coverage proves stale-status handling is a live repo-native risk class, not a hypothetical policy concern.

Why `overstated next steps` did not win:

- The shared resolver already downgrades stale artifact-local next steps through `finalizeResolvedFocus()` and `buildStaleCurrentHeadArtifactNextStepMessage(...)`.
- The composition checker already carries broad direct assertions that Architecture and Runtime artifacts stop advertising optimistic downstream movement once the live current head moved on.
- The remaining next-step seams look more policy-shaped and less narrowly machine-checkable than the queue/status derivation seam.

Repo-truth basis:

- `shared/lib/dw-state/shared.ts` already downgrades stale artifact-local next steps when `currentHead` moved downstream.
- `scripts/check-directive-workspace-composition.ts` already proves multiple next-step honesty cases for Architecture and historical Runtime artifacts.
- `hosts/web-host/data.ts` still contains a distinct queue-facing status derivation function, `deriveFrontendQueueStatus(...)`, which is the clearest remaining bounded seam for stale-status hardening.
- Existing queue/status checks already prove stale-status pressure on:
  - completed entries whose canonical result no longer resolves cleanly
  - routed entries whose live case head progressed downstream
  - routed entries that should remain clean when the stub is still live

Proof path for the next authorized slice:

- Keep the next slice inside `stale statuses` only.
- Start from the queue-facing derivation surface in `hosts/web-host/data.ts`.
- Pick one exact stale-status subtype and prove it with the existing workspace-state/composition machinery.

Rollback path:

- Remove this gate log only.

Stop-line:

This thread ends at the gate decision. Do not implement the stale-status slice here. A separate bounded Architecture slice must choose and harden one exact stale-status subtype.
