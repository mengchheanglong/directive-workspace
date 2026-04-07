# Directive mini-swe-agent Slice 3 Fallback Pattern

## scope
Extracted-value integration only. This slice does not import mini-swe-agent runtime into Mission Control production paths.

## extracted mechanism
- Stepwise loop: model proposes one command, environment executes, observation is fed back.
- Explicit completion token: `COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT` to end a run.
- Deterministic replay capability via predefined model outputs for bounded experiments.

## interface contract
- Input: constrained task statement + strict file scope.
- Action envelope: one command per step (`mswea_bash_command`).
- Output artifacts: trajectory JSON containing messages, actions, return codes, and exit status.

## workflow model and state transitions
1. `INIT` -> build config and task context.
2. `PROPOSE_ACTION` -> model emits one command action.
3. `EXECUTE` -> local shell executes action with timeout.
4. `OBSERVE` -> returncode/output appended to trajectory.
5. `DECIDE_NEXT` -> continue loop or emit completion token.
6. `EXIT` -> persist trajectory and summary.

## mission-control integration points
- Fallback lane (only when Codex lane is saturated): run bounded deterministic rehearsal first.
- Directive experiment artifacts should capture:
  - command transcript
  - modified file scope
  - pass/fail verification command
  - rollback command set
- Keep adapter replaceable: treat mini-swe-agent as a reference pattern, not a hard dependency.

## risk and baggage
- Host/runtime sensitivity on Windows terminals (encoding + console assumptions in CLI startup).
- Heavy dependency footprint for full install.
- Interpreter drift risk if verification command does not use pinned venv python.

## rollback
- Delete this runbook.
- Keep fallback lane disabled by default.
- Remove only slice-specific experiment artifacts; no API/schema rollback required.
