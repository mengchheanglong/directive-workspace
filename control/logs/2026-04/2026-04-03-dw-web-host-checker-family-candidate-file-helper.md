# DW Web-Host Checker Family Candidate-File Helper

- Affected layer: checker-family support under `scripts/`
- Owning lane: shared operator/check surface for Runtime host-promotion proof
- Mission usefulness: remove duplicated candidate-file discovery logic from the DW web-host promotion checker family
- Proof path:
  - `npm run check:directive-scientify-dw-web-host-promotion-input-package`
  - `npm run check:directive-scientify-dw-web-host-profile-checker-decision`
  - `npm run check:directive-scientify-dw-web-host-seam-review-compile-contract`
  - `npm run check`
- Rollback path: restore the local `listCandidateFiles()` helper in each checker and remove the shared helper

Completed:
- added `scripts/list-candidate-markdown-files.ts`
- migrated the repeated candidate-file helper out of the DW web-host promotion-input-package, profile-checker-decision, and seam-review-compile-contract checkers
- removed the duplicated local helper from the migrated family

Stop summary:
- repeated checker-family filesystem logic is now centralized
- affected checker family still passes
