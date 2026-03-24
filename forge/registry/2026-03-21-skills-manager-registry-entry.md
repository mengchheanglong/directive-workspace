# Skills-Manager Registry Entry

- Candidate id: skills-manager
- Candidate name: skills-manager
- Registry date: 2026-03-21
- Linked promotion record: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\promotion-records\2026-03-21-skills-manager-promotion-record.md`
- Host: Mission Control
- Runtime surface: bounded skill lifecycle import lane
- Runtime status: callable (bounded-skill-lifecycle-lane)
- Proof path: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\records\2026-03-21-skills-manager-runtime-slice-01-proof.md`
- Last validated by: `npm run check:ops-stack`
- Last validation date: 2026-03-21
- Active risks: callable status depends on continued import-pack API behavior, deterministic seed metadata, and pack asset coverage remaining stable.
- Rollback path: use rollback section in promotion record and restore pack classification to `follow_up_only` if the skill-lifecycle lane drifts.
- Notes: callable status is bounded to importing the `Skills Lifecycle Operator` from the Forge-owned pack; it does not imply adoption of the full upstream desktop runtime or global skill-store ownership.
