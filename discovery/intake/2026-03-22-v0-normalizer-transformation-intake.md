# Discovery Intake: v0 Normalizer Transformation

Date: 2026-03-22
Owner: Directive Discovery
Reason: internal signal — doctrine audit identified zero real transformation cases despite first-class lane infrastructure.

## Intake Candidate

- Candidate id: `dw-transform-v0-normalizer-consolidation`
- Candidate name: `v0.ts Normalizer Consolidation`
- Intake date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `runtime/core/v0.ts` lines 129-254
- Submitted by: `operator`
- Why it entered the system: 10 normalizer functions in v0.ts follow an identical pattern (normalize → match → throw). This is a textbook behavior-preserving transformation candidate — same API, same behavior, better implementation.
- Claimed value: ~80% line reduction in normalizer section, elimination of copy-paste maintenance risk, proves transformation lane works on a real case.
- Initial relevance to the workspace: high
- Suspected adoption target: `Runtime`
- Mission alignment (which active-mission objective does this serve): Runtime operationalization — maintainability of Runtime core module
- Addresses known capability gap (gap_id or n/a): gap-transformation-lane
