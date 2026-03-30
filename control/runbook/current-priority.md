# Current Priority

## Current mission

Keep Directive Workspace moving as its own product and operating system for source adaptation.

Engine is the shared adaptation core inside Directive Workspace.
Discovery, Runtime, and Architecture are the main operating lanes of Engine.

Prioritize work that makes Directive Workspace more real, more reusable, and more operational through:
- clearer Engine ownership
- stronger lane boundaries
- better routing and source-to-usefulness flow
- better proof / decision / integration / reporting discipline
- measurable, reversible progress

## Current run priority

Choose the highest-ROI bounded next step from current repo truth.

Prefer:
1. correctness or state-truth fixes
2. broken or missing workflow wiring
3. missing proof / report / validation coverage for real workflow pressure
4. bounded Engine seam improvements
5. Architecture / Runtime / Discovery progress that increases shared system value
6. record or handoff correction only when it materially improves code-truth alignment

Do not start broad new work when a smaller high-value continuation is clearly available.

## Current product root after relocation

Canonical product root:
- `C:\Users\User\projects\directive-workspace`

Relocation status:
- relocation is complete enough for normal product work to proceed from the new root
- `npm run report:directive-workspace-state` passes from the new root
- `npm run check` passes from the new root
- `C:\Users\User\.openclaw\workspace\directive-workspace` is no longer the canonical product home

External integration status:
- Mission Control and OpenClaw remain external integrations and adapters
- they are not allowed to assume the old sibling-root layout under `.openclaw\workspace`
- future integration work must treat Directive Workspace as an external product root
