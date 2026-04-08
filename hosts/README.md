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

Current repo-native hosts:
- `hosts/standalone-host/`
- `Directive Workspace Frontend (frontend/ app + hosts/web-host/ host)`

Host-neutral integration kit:
- `hosts/integration-kit/README.md`

Discovery importers:
- `discovery/importers/`
