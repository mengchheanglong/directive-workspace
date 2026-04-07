# Integration Kit Examples

These example payloads are the host-neutral input shapes that pair with the integration-kit CLI.

Use them in this order:

1. front-door submission examples
- `discovery-submission-front-door.json`
- `discovery-submission-queue-only.json`
- `discovery-submission-fast-path.json`
- `discovery-submission-split-case.json`

2. upstream signal examples
- `openclaw-runtime-verification-signal.json`
- `openclaw-maintenance-watchdog-signal.json`

3. acceptance artifact example
- `host-integration-acceptance-report.json`

CLI pairings:

- `print-submission-example --shape <front_door|queue_only|fast_path|split_case>`
- `submission-memory-dry-run --input-json-path <submission example>`
- `print-signal-example --kind <runtime_verification|maintenance_watchdog>`
- `signal-adapter-dry-run --kind <runtime_verification|maintenance_watchdog> --input-json-path <signal example>`

The signal examples are adapter inputs, not direct Discovery submission payloads.
Run them through the adapter dry-run path first, then decide whether your host should submit the adapted request into Discovery.
