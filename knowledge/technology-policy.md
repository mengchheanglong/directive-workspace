# Technology Policy

Last updated: 2026-03-21
Status: canonical

## Purpose

This policy defines the default implementation language and the escalation rule for introducing lower-level runtime components.

Directive Workspace is still in a shaping and integration-heavy stage.  
At this stage, speed of iteration, contract clarity, and host compatibility matter more than raw performance.

## Default Rule

Directive Workspace uses **TypeScript as the default implementation language**.

That includes:
- shared product libraries
- schemas, validators, and generators
- host-facing adapters
- Forge core logic
- lifecycle and contract enforcement helpers

Reason:
- Mission Control, the current host, is already TypeScript-heavy
- product and host boundaries are easier to maintain in one primary language
- contracts, templates, and validators benefit from one typed implementation layer
- current project risk is architectural drift, not CPU-bound throughput

## Current Language Roles

### TypeScript

Use TypeScript by default for:
- product-owned Directive Workspace logic
- host integration logic
- contract validation
- generators and artifact assembly
- runtime orchestration and checks

### Markdown and JSON

Use markdown and JSON for:
- doctrine
- policies
- contracts
- schemas
- templates
- decision records

These are product artifacts, not secondary documentation.

### Python

Use Python only when it clearly earns its keep, for example:
- paper/research experiments
- ML-heavy or data-heavy tooling
- bounded reverse-engineering utilities
- one-off extraction probes

Python should not become the default product language for Directive Workspace core.

## Rust Introduction Rule

Rust is allowed later, but only for **measured hot paths**, not as a default rewrite target.

Good future Rust candidates:
- indexing engines
- graph processing
- large diffing/parsing workloads
- deterministic validation engines with heavy throughput needs
- performance-critical local runtime/CLI components

Bad Rust candidates:
- doctrine and contracts
- workflow policy logic
- routing rules
- fast-changing product logic
- host integration glue

## Escalation Rule

Do **not** move a Directive Workspace subsystem to Rust unless all of the following are true:
- the subsystem is already stable in TypeScript
- profiling shows a real bottleneck
- the bottleneck matters to operator experience or runtime reliability
- the Rust component can sit behind a stable interface
- the migration scope is narrow and reversible

Rule of thumb:
- keep orchestration and product definition in TypeScript
- add Rust only as an acceleration layer where performance is proven to matter

## Anti-Drift Rule

Do not propose a language migration just because:
- the system is growing
- the codebase feels serious
- Rust seems cleaner in theory

A language shift is justified only by measured bottlenecks and clear subsystem boundaries.

## Current Position

Current Directive Workspace phase:
- TypeScript is the most appropriate core language
- Rust is a future optimization option, not a present architectural requirement

Canonical conclusion:
- **TypeScript first**
- **Rust only for proven narrow hot paths later**
