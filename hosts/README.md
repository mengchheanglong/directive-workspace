# Hosts

Hosts consume Directive Workspace outputs.

A host owns:
- runtime code
- runtime database
- runtime APIs
- host-specific gates
- operator-facing behavior

A host does not own:
- product doctrine
- decision-state vocabulary
- adoption-target vocabulary
- Engine lane boundaries

Current host:
- `Mission Control`
- `Directive Workspace Frontend (frontend/ app + hosts/web-host/ host)`

Host-neutral integration kit:
- `C:\Users\User\.openclaw\workspace\directive-workspace\hosts\integration-kit\README.md`

Host-owned adapter edge:
- `hosts/adapters/`
