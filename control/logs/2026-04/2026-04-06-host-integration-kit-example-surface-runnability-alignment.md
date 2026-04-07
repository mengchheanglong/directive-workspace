# 2026-04-06 Host Integration Kit Example Surface Runnability Alignment

## Affected layer

- host integration kit examples and CLI proof surface

## Owning lane

- host integration boundary consuming Discovery-first product surfaces

## Mission usefulness

- make the richer integration-kit examples runnable through product-owned adapter paths instead of leaving them as passive json
- keep third-party hosts aligned with current repo truth by proving both submission examples and upstream signal examples from the kit itself

## Slice

- added integration-kit CLI support for:
  - `print-signal-example --kind <runtime_verification|maintenance_watchdog>`
  - `signal-adapter-dry-run --kind <runtime_verification|maintenance_watchdog> --input-json-path <path>`
- added `hosts/integration-kit/examples/README.md`
- added `check:host-integration-kit-example-surfaces`
- wired the checker into the foundation batch
- updated the integration-kit README surfaces to document the new runnable example paths

## Proof path

- `npm run check:host-integration-kit-example-surfaces`
- `node --experimental-strip-types ./hosts/integration-kit/cli/host-integration-kit-cli.ts print-signal-example --kind runtime_verification`
- `node --experimental-strip-types ./hosts/integration-kit/cli/host-integration-kit-cli.ts signal-adapter-dry-run --kind maintenance_watchdog --input-json-path ./hosts/integration-kit/examples/openclaw-maintenance-watchdog-signal.json`

## Rollback path

- revert `hosts/integration-kit/cli/host-integration-kit-cli.ts`
- revert `hosts/integration-kit/README.md`
- revert `hosts/integration-kit/starter/README.md`
- delete `hosts/integration-kit/examples/README.md`
- revert `scripts/check-host-integration-kit-example-surfaces.ts`
- revert `scripts/check-batches.ts`
- revert `package.json`
- delete this log

## Stop summary

- stopped after making the example surface runnable and checked
- did not broaden into new host starter behavior or additional adapter semantics
