# 2026-04-06 Host Integration Kit Front-Door Starter Alignment

## Affected layer

- host integration kit starter, examples, and CLI guidance

## Owning lane

- Engine/Discovery boundary as taught through host integration examples

## Mission usefulness

- Make the integration kit teach the current product truth that Discovery stays first and the Engine owns route/review judgment.
- Preserve the older manual record-shape starter for hosts that truly need it, but stop presenting it as the default integration path.

## Slice

- added a preferred Engine-backed front-door starter:
  - `hosts/integration-kit/starter/discovery-front-door-adapter.template.ts`
  - `hosts/integration-kit/starter/discovery-front-door-adapter.smoke.template.ts`
- added a preferred front-door example payload:
  - `hosts/integration-kit/examples/discovery-submission-front-door.json`
- added a dedicated checker:
  - `scripts/check-host-integration-kit-front-door-starter.ts`
- wired the checker into the foundation batch
- updated the integration-kit README, starter README, package exports, and CLI example surface so new hosts are steered toward the front-door starter first
- normalized local starter/CLI `.ts` imports so the integration-kit surfaces run cleanly under the current Node + strip-types execution path
- labeled the older submission adapter as the manual record-shape path instead of the preferred default

## Proof path

- `npm run check:host-integration-kit-front-door-starter`
- `node --experimental-strip-types ./hosts/integration-kit/cli/host-integration-kit-cli.ts print-submission-example --shape front_door`
- `npm run check`

## Rollback path

- revert the new front-door starter files
- revert the integration-kit README / starter README / CLI / examples / package export updates
- revert `scripts/check-host-integration-kit-front-door-starter.ts`
- revert `scripts/check-batches.ts`
- revert `package.json`
- delete this log

## Stop summary

- stopped after making the preferred integration-kit path match current Engine-backed Discovery truth
- did not remove the older manual submission starter or redesign the broader host adapter model
