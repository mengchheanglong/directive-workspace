# Skills-Manager Source Map

Date: 2026-03-20
Track: Directive Discovery
Type: source reference

## Source

- `C:\Users\User\.openclaw\workspace\agent-lab\tooling\skills-manager`

## Useful Value

### Skill-root precedence
- OpenClaw-style `skills/` preferred over `.claude/skills/`
- fallback only when the preferred root is absent or unreadable

### Conflict signaling
- dual-root warning is explicit and machine-readable
- migration path is documented, not left ambiguous

### Skill lifecycle
- central library vs project-local skill split
- update tracking and re-import discipline

## Routing Guidance

- skill-root policy -> `Directive Forge`
- migration/conflict warnings -> `Directive Discovery`
- inventory/update workflow -> `Directive Forge`

## Not To Preserve

- the desktop app as a required runtime dependency
- local UI assets
- upstream storage/runtime implementation
