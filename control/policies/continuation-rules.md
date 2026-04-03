# Continuation Rules

## Task selection policy

At the start of each cycle:
1. refresh repo truth from the current codebase, records, and relevant docs
2. re-read the most relevant instruction files for the touched area
3. identify candidate next tasks
4. rank them by ROI using:
   - mission usefulness
   - bounded scope
   - verification strength
   - dependency readiness
   - regression risk
   - shared Engine value
5. choose exactly one bounded next step

If multiple tasks are close, prefer the one with:
1. stronger verification
2. lower regression risk
3. more immediate workflow usefulness
4. less doctrinal ambiguity

If the best task is blocked, skip to the next highest-ROI bounded task instead of stalling.

## Required cycle framing

Before each cycle, determine and record:
- affected layer
- owning lane
- chosen task
- why it is the highest-ROI next move
- mission usefulness
- proof path
- rollback path
- stop-line

Implement only up to the stop-line, even if more work is possible.

Do not mix unrelated tasks into the same cycle unless they are tightly required to complete the chosen bounded slice.

## Run persistence rule

Continuation is allowed, not required.

Do not continue merely because one bounded slice completed cleanly.

After each completed cycle:
1. refresh repo truth
2. identify the next best bounded step
3. continue only if the next bounded step:
   - aligned with doctrine
   - bounded
   - verifiable
   - lower risk than broad redesign
   - and produces a concrete new product artifact, proof result, or seam decision that does not already exist

Only stop when:
- there are no more reasonable bounded tasks left
- the next tasks all require human judgment
- the next tasks all require external access or approval not available
- the next useful move would require a broad redesign
- validation is blocked in a way that cannot be resolved safely
- the current slice has reached its truthful stop-line and the next move would add more formality than value
