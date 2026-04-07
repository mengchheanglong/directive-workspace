# Directive Workspace Publish Readiness

Last updated: 2026-03-24

## Current Release Position

Directive Workspace is ready to be presented as a standalone product root, package-ready module surface, and configurable standalone host for shareable GitHub/local usage.

What is publish-ready now:
- product doctrine
- ownership boundaries
- initial canonical engine surface under `engine/`
- lane-owned Discovery / Runtime / Architecture operating surfaces
- Discovery / Runtime / Architecture lane structure
- shared contracts, status vocabulary, and decision vocabulary
- architecture records and experiments
- Runtime product-level core and records
- host integration notes
- root package-ready standalone surface at `@directive-workspace/product`
- minimal standalone filesystem reference host under `hosts/standalone-host/`
- minimal product-owned standalone frontend under `hosts/web-host/`
- bounded standalone reference HTTP API for health, Discovery submission, and Discovery overview
- bounded standalone Runtime-side local workflow support for follow-up, record, proof-bundle, transformation proof, transformation record, promotion, and registry artifact writing plus Runtime overview
- config-driven standalone runtime profile with persisted status/access/boot artifacts under the configured Directive root
- optional SQLite ledger/index for the standalone reference host while keeping filesystem artifacts canonical
- optional static bearer auth guard for the standalone reference API surface
- standalone bootstrap/init flow for outside GitHub/local users

What is not complete yet as a broader standalone host surface:
- deeper engine coverage beyond the current source intake -> routing -> proof-plan -> integration-proposal slice
- deeper lane coverage so more Discovery / Runtime / Architecture behavior runs through the canonical lane surfaces with less host-side reconstruction
- fuller canonical engine-owned runtime/state model for source intake, routing, adaptation, proof, and integration
- explicit host-adapter layer over that engine
- Runtime runtime implementation
- broader host API coverage beyond the current bounded endpoints
- broader host coverage beyond the current Discovery plus bounded-Runtime reference lanes
- final release packaging defaults beyond the current bootstrap/init path

Current runtime reality:
- Mission Control is the first broad runtime host
- Directive Workspace now has an initial canonical engine surface for host embedding
- Directive Workspace now has lane-owned Discovery / Runtime / Architecture operating surfaces
- Directive Workspace now ships a configurable standalone filesystem reference host for local execution, host-proof flows, bounded local HTTP API usage, optional bearer auth, persisted runtime status/access logging, and a Discovery front door that can persist full Engine run records
- Directive Workspace now also ships a minimal product-owned standalone frontend for direct product operation and testing over the same artifacts without replacing Mission Control
- that reference host now also supports a bounded local Runtime workflow for writing follow-up/record/proof/transformation/promotion/registry artifacts and reading Runtime overview state
- the reference host can also write to an optional product-owned SQLite ledger/index without borrowing Mission Control's database layer
- Runtime runtime behavior still executes through Mission Control
- Directive Workspace is already a standalone product boundary and shareable local host surface, but it is not yet engine-complete and not yet the broader host replacement for Mission Control

## Publish Goal

Publish Directive Workspace as:
- an objective-driven capability evolution system
- an engine-first product direction, not just a doctrine pack or host helper set
- a doctrine and operating-code system (contracts, schemas, templates, policies, workflow rules)
- an Engine-centered system with three main operating lanes (Discovery, Runtime, Architecture)
- a product that can later support multiple hosts

Do not publish it as:
- a fake all-hosts-complete runtime
- a drop-in replacement for Mission Control
- a bundle of external repos

## Readiness Status

Ready:
- standalone root exists
- root package-ready standalone surface exists
- minimal standalone filesystem reference host exists
- bounded standalone reference API host exists
- config-driven standalone runtime profile exists for the reference host
- optional SQLite persistence lane exists for the reference host
- product ownership is separated from Mission Control
- Architecture has been migrated under the standalone root
- Runtime has a standalone product surface
- Discovery has a standalone front-door surface
- host boundary is documented
- Mission Control integration remains green

Still polish-only:
- a few remaining Turbopack broad-pattern warnings in the host
- some legacy compatibility aliases remain intentionally
- no final external release packaging workflow yet
- license decision not yet locked
- root package currently uses placeholder version `0.0.0-private` until the release versioning scheme is locked

## Release Boundary

If released now, the external-facing message should be:

"Directive Workspace is an objective-driven capability evolution system that converts breakthroughs into mission-relevant usefulness.
It currently runs with Mission Control as its first broad runtime host and also ships a configurable standalone filesystem reference host with a bounded HTTP API, bounded local Runtime lifecycle workflow support, optional bearer auth, optional SQLite ledger persistence, and persisted runtime artifacts."

That message is accurate.

This message is not yet accurate:

"Directive Workspace already replaces Mission Control as the broad host/runtime surface."

## Publish Checklist

Required before external publish:
- root README states the correct release boundary
- ownership and host relationship are explicit
- doctrine and execution plan are canonical and current
- Discovery / Runtime / Architecture roles are documented clearly
- migration status is locked as complete
- contributor rules are written
- changelog baseline exists
- release scope explicitly states what is and is not included

Still pending before a public code release:
- choose and add a license
- lock the public versioning scheme (current root package uses placeholder `0.0.0-private`)
- expand the current DW engine slice so hosts embed one product kernel rather than many helper flows
- reduce remaining host-side reconstruction by expanding canonical Engine and lane surfaces where repeated pressure proves they belong
- decide whether to publish doctrine plus operating assets only, or include selected package/code artifacts too
- decide whether Runtime host mirrors stay internal or become part of the release story
- complete the broader standalone host surface beyond the current configurable filesystem/API/SQLite reference host

## Recommendation

Publish Directive Workspace first as:
- product doctrine plus operating code (contracts, schemas, templates, workflow rules, mission model, and proven bounded capability lanes)

Do not wait for:
- full Runtime runtime extraction
- zero Turbopack warnings in Mission Control

Those are host/runtime polish tasks, not blockers for the product boundary.
