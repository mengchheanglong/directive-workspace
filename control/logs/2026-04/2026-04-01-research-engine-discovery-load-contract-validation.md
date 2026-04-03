Cycle

Chosen task:

Fail closed on malformed Research Engine Discovery handoff packets during load instead of discovering packet skew only later during adaptation.

Why it won:

After the structured-signal-truth slice, the next dominant gap was that the TypeScript RE loader still trusted too much of the handoff packet pair. Discovery could still encounter malformed candidate signal fields only after deeper adaptation work instead of rejecting the bad handoff immediately.

Affected layer:

Research Engine Discovery bundle loader and dedicated import seam proof.

Owning lane:

Architecture

Mission usefulness:

Discovery now rejects malformed RE handoff packets before queue mutation, which keeps intake and triage truth cleaner and makes RE import failures clearer and earlier.

Proof path:

1. Validate Discovery-consumed `strong_signals` structure in the source-intelligence packet during load.
2. Validate Discovery-consumed candidate handoff fields in the DW Discovery packet during load.
3. Strengthen the dedicated RE seam check with one malformed-packet rejection case.
4. Re-run the dedicated RE seam check and full repo checks.

Rollback path:

Revert only the RE Discovery loader/check files and this bounded log.

Stop-line:

Stop once malformed Discovery-consumed RE packet fields fail closed during load and the dedicated plus repo-wide checks pass.
