# openhands Slice 11 Execution (2026-03-19)

## candidate verification
- Candidate: `OpenHands`
- Intake path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\OpenHands`
- Pinned revision: `28ecf0640425a4e27e1fde7d6b7b863a3e70de51`
- Describe/tag: `0.22.0-3016-g28ecf0640`
- Working tree state: clean (`git status --short` returned empty)

## bounded experiment contract (defined before run)
- Objective: validate extractable **product-surface separation + runtime policy toggles** pattern for Directive integration governance.
- Timebox: 45 minutes.
- Success criteria:
  1. Distinct surfaces (SDK/CLI/GUI/Cloud/Enterprise) are explicit.
  2. Workspace/runtime/agent/LLM boundaries are configurable.
  3. Prompt-extension and microagent toggles are explicit.
  4. Pattern can be adapted without adopting OpenHands runtime stack.

## reproducible proof
### scope (read-only)
- `README.md`
- `config.template.toml`

### proof output
```json
{
  "sdk_cli_gui_cloud_enterprise_surfaces": true,
  "license_boundary_mit_vs_enterprise": true,
  "benchmark_signal_present": true,
  "workspace_runtime_config_surfaces": true,
  "agent_llm_policy_toggles": true,
  "verdict": "pass"
}
```

## extracted pattern candidates
1. **Surface separation model**
- Clear split between SDK/CLI/local GUI/cloud/enterprise pathways.

2. **Runtime boundary configuration**
- Explicit workspace mounts, runtime selection, and default agent boundary.

3. **Prompt-extension/microagent control surface**
- Ability to enable/disable extension layers and microagent behavior.

## mapping to directive workspace
- Pattern maps to controlled promotion/handoff:
  - keep framework and runtime status distinct,
  - define explicit runtime boundary toggles in promotion contract,
  - isolate optional extension layers behind explicit switches.

## excluded as baggage
- Full OpenHands product/runtime stack and deployment model.
- Enterprise source-available feature surface.
- Agent runtime replacement in Mission Control.

## integration cost / risk / rollback
- Integration mode: `adapt` (pattern extraction only).
- Estimated cost: medium.
- Operational risk: medium due strong overlap with current execution lane capabilities.
- Rollback:
  1. Remove this execution artifact.
  2. Remove corresponding decision artifact.
  3. No runtime rollback required.
