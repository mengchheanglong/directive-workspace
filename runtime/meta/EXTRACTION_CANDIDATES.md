# Runtime Core Extraction Candidates

Current host:
- `C:\Users\User\.openclaw\workspace\mission-control`

Goal:
- identify Runtime logic that can move into Directive Workspace without dragging host-specific runtime code with it

## Good first candidates

### 1. Shared vocabulary and normalizers

Current location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\v0.ts`

Host shim:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\v0.ts`

Current cutover status:
- extracted into Runtime successfully
- standalone package consumption attempted and rolled back
- Mission Control currently uses a local host mirror until Turbopack compatibility is resolved

Low-risk extraction candidates:
- source type constants
- workflow metadata constants
- status types
- runtime status types
- decision types
- integration mode types
- normalizers such as:
  - `normalizeDirectiveSourceType`
  - `normalizeDirectiveDecision`
  - `normalizeDirectiveIntegrationMode`
  - related status normalizers

Reason:
- host-agnostic
- pure logic
- no DB or filesystem dependency

### 2. Integration proof parser

Current location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\v0.ts`

Candidate:
- `parseDirectiveIntegrationProof`

Reason:
- pure parser
- useful to Runtime product layer and host layer

### 3. Promotion contract validation rules

Current canonical location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\decision-policy.ts`

Host mirror:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\decision-policy.ts`

Extracted in this slice:
- due date validation
- required gate validation
- rollback plan validation
- integration proof validation wrapper
- status resolution helpers

Reason:
- these are Runtime policy rules, not host storage rules

### 4. Decision contract normalization

Current canonical location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\decision-contract.ts`

Host mirror:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\decision-contract.ts`

Extracted in this slice:
- adopt-decision contract normalization
- integration surface and runtime target validation
- normalized adopt payload assembly before host-side DB/report effects

Reason:
- this is Runtime contract logic, not Mission Control storage logic

### 5. Candidate and experiment workflow contract normalization

Current canonical location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\workflow-contract.ts`

Host mirror:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\workflow-contract.ts`

Extracted in this slice:
- candidate intake normalization
- analysis payload normalization
- experiment payload normalization
- evaluation payload normalization

Reason:
- these are Runtime workflow contracts, not host persistence logic

### 6. Presentation and lifecycle summary contract

Current canonical location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\presentation-contract.ts`

Host mirror:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\presentation-contract.ts`

Extracted in this slice:
- lead-time math for report and lifecycle summaries
- integration proof artifact/report body builders
- decision report body builder
- lifecycle summary derivation from capability, decision, and integration rows

Reason:
- these are Runtime presentation and derived-state rules
- host service should orchestrate repos/filesystem, not own report text or lifecycle math

### 7. Proof request and proof object contract

Current canonical location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\proof-contract.ts`

Host mirror:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\proof-contract.ts`

Extracted in this slice:
- proof method/reference/summary defaults
- integration proof object assembly

Reason:
- these are Runtime proof contract rules
- host service should only handle filesystem/report side effects

### 8. Capability transition patch contract

Current canonical location:
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\core\capability-patch-contract.ts`

Host mirror:
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\capability-patch-contract.ts`

Extracted in this slice:
- analysis capability update payload
- experiment/evaluation status transition payloads
- decision status/runtime transition payload
- integration proof metadata merge payload

Reason:
- these are Runtime transition rules, not host persistence primitives
- host service should orchestrate writes, not assemble transition-shaped payloads inline

## Keep in Mission Control for now

- repositories
- database schema
- API route handlers
- report creation
- filesystem artifact writing
- host-specific runtime status transitions tied to DB writes

## Extraction rule

Extract only code that is:
- host-agnostic
- pure or near-pure
- not tied to Mission Control repos, DB, or reporting side effects
