# Rescue OpenClaw Role Reference Correction

- Candidate id: rescue-openclaw-role-correction
- Candidate name: Rescue OpenClaw reference correction
- Decision date: 2026-03-22
- Decision state: adopted
- Adoption target: Architecture reference correction

## Why this correction was needed

An earlier documentation slice incorrectly centered `Rescue OpenClaw` inside Directive Workspace / Architecture.
That was the wrong ownership model for the user's actual intent.

The intended role is OpenClaw-native:
- fix OpenClaw when OpenClaw is down or broken
- focus on OpenClaw service health, recovery, and repair
- avoid tying the role to Directive Workspace, Mission Control, or general workspace doctrine

## Correct decision

Directive Workspace does not own Rescue OpenClaw.

OpenClaw owns:
- `openclaw/RESCUE_OPENCLAW.md`
- `openclaw/RESCUE_PROTOCOL.md`
- `openclaw/templates/*`

Directive Workspace may only reference those OpenClaw-owned rescue docs when needed.

## What changed in the correction

- added OpenClaw-native rescue docs under `openclaw/`
- downgraded Directive rescue docs to reference-only
- removed Directive ownership language from the affected Directive docs
- replaced the earlier Architecture-owned framing with explicit OpenClaw ownership

## Result

`Rescue OpenClaw` now means:
- OpenClaw's own internal recovery role
- activated when OpenClaw is down, degraded, unhealthy, misconfigured, or blocked
- focused on restoring OpenClaw safely with the minimum effective repair

## Rollback note

If the OpenClaw-native location changes later, Directive references should continue to defer rather than re-own the role.
