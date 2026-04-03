Cycle

Chosen task:

Add a compact candidate-level Research Engine signal summary to the Discovery handoff so Directive Workspace Discovery can triage imported candidates without opening deeper RE artifacts first.

Why it won:

Research Engine already computed strong-vs-weak signal judgment and scorecard-derived evidence quality internally, but the DW Discovery packet dropped that compact triage signal. Discovery therefore got rich prose and deeper artifacts, but not one bounded per-candidate summary of how strong the RE signal actually was.

Affected layer:

Research Engine DW packet/export contract, Discovery import note shaping, and the dedicated RE seam proof.

Owning lane:

Architecture

Mission usefulness:

Discovery now gets one compact, candidate-level RE signal band and score summary directly in the handoff packet and imported note. That improves intake and triage usefulness without granting RE any route or adoption authority.

Proof path:

1. Add `discovery_signal_band`, `signal_total_score`, and `signal_score_summary` to the RE DW packet contract.
2. Derive those fields from existing RE scoring logic without widening RE ownership.
3. Preserve them in imported Discovery notes.
4. Strengthen the dedicated RE seam check and RE Python tests.
5. Regenerate the RE artifacts and rerun the repo checks.

Rollback path:

Revert only the RE DW packet contract/export/import/check files and this bounded log.

Stop-line:

Stop once Discovery can see one compact RE signal summary per imported candidate through the canonical RE-to-Discovery seam and the dedicated plus repo-wide checks pass.
