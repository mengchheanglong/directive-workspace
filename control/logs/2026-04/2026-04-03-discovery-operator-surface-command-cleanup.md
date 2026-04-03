# 2026-04-03 Discovery operator-surface command cleanup

- affected layer: Discovery operator surfaces and active capability-gap truth
- owning lane: Architecture
- mission usefulness: remove dead command references so operators follow repo-native Discovery surfaces instead of retired Mission Control paths
- proof path:
  - `rg -n "check:discovery-intake-queue|check:discovery-gap-worklist|check:discovery-front-door-coverage|mission-control" discovery/README.md discovery/capability-gaps.json package.json scripts -g '!node_modules'`
  - `npm run check:directive-workspace-composition`
  - `npm run check`
- rollback path:
  - revert `discovery/README.md`
  - revert `discovery/capability-gaps.json`
- stop-line: stop after active Discovery docs and gap notes no longer point at dead checker commands

## Result

- `discovery/README.md` now points at the repo-native queue writer/transition surfaces and the live gap-worklist selector check.
- `discovery/capability-gaps.json` no longer claims a dead Mission Control intake-queue checker or a non-existent `check:discovery-front-door-coverage` command.
- OpenClaw Discovery contract notes now point at the repo-native adapter checks under `scripts/openclaw/`.
