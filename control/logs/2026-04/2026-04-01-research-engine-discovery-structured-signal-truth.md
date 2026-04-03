Cycle

Chosen task:

Persist Research Engine signal summary as structured Discovery queue/state truth instead of leaving it only in imported note prose.

Why it won:

The prior RE slice added a compact candidate-level signal summary to the DW handoff and imported notes, but Discovery still had to parse notes to use it. The next highest-ROI improvement was to persist that signal structurally so canonical queue/state/report surfaces could expose it directly.

Affected layer:

Discovery submission/queue contract, canonical shared state resolution, RE import CLI output, and the dedicated RE seam proof.

Owning lane:

Architecture

Mission usefulness:

Discovery can now use RE signal band and score summary as first-class queue/state truth for intake and triage instead of relying on note parsing.

Proof path:

1. Thread `discovery_signal_band`, `signal_total_score`, and `signal_score_summary` through the Discovery submission and queue entry contract.
2. Preserve those fields from the RE importer into queue truth.
3. Expose them through canonical `dw-state` focus resolution.
4. Expose them in the import CLI result.
5. Strengthen the dedicated RE seam check to prove persisted queue truth and canonical state visibility.

Rollback path:

Revert only the bounded RE Discovery queue/state files and this log.

Stop-line:

Stop once the compact RE signal summary is available as structured Discovery queue/state truth and the dedicated plus repo-wide checks pass.
