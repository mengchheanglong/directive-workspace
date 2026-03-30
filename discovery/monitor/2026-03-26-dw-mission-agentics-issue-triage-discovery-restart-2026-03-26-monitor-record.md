# Agentics Issue Triage Workflow Monitor Record

- Candidate id: `dw-mission-agentics-issue-triage-discovery-restart-2026-03-26`
- Candidate name: `Agentics Issue Triage Workflow`
- Monitor date: `2026-03-26`
- Current decision state: `monitor`
- Why kept in monitor: real mission value is present for Discovery intake filtering, backlog prioritization, duplicate detection, and evidence-backed routing, but the primary adoption target is still not clear enough to justify immediate Architecture or Runtime continuation.
- Trigger matrix path: `n/a - promotion triggers are recorded inline in this bounded monitor record`
- Promotion trigger conditions:
  - repeated real Discovery runs expose issue-triage or backlog-selection pain as a current bottleneck
  - a later mission-driven request makes the primary adoption target explicit enough for Architecture or Runtime routing
  - real operator evidence shows Directive Workspace needs structured duplicate detection, classification, or spam/off-topic rejection inside the Discovery front door
- Review cadence: monthly + on repeated Discovery triage pain
- Last review result: `2026-03-26` Discovery restart kept the candidate in monitor because Engine routing favored Discovery-held review over downstream route commitment.
- Next review date: `2026-04-26`
- No-op rule: if the promotion triggers remain unmet, stay `monitor` and update the timestamp only.
- Linked intake record: `discovery/intake/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-intake.md`
- Linked triage record: `discovery/triage/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-triage.md`
- Linked routing record: `discovery/routing-log/2026-03-26-dw-mission-agentics-issue-triage-discovery-restart-2026-03-26-routing-record.md`
