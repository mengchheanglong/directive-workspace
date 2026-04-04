import type { DirectiveEngineLanePlanningInput } from "./lane.ts";
import type { DirectiveEngineUsefulnessLevel } from "./types.ts";

export function classifyDirectiveEngineUsefulness(
  input: DirectiveEngineLanePlanningInput,
): DirectiveEngineUsefulnessLevel {
  if (input.lane.laneId === "runtime") {
    if (
      input.source.primaryAdoptionTarget === "runtime"
      || input.source.containsExecutableCode
    ) {
      return "direct";
    }
    return "direct";
  }

  if (
    input.source.primaryAdoptionTarget === "architecture"
    && input.source.containsWorkflowPattern
  ) {
    return "meta";
  }

  if (input.routingAssessment.scoreBreakdown.metaUsefulnessSignal > 0) {
    return "meta";
  }

  return "structural";
}

export function explainDirectiveEngineUsefulness(
  input: DirectiveEngineLanePlanningInput,
  usefulnessLevel: DirectiveEngineUsefulnessLevel,
) {
  if (usefulnessLevel === "direct") {
    if (input.routingAssessment.scoreBreakdown.transformationSignal > 0) {
      return "Direct usefulness: the candidate targets reusable runtime capability and shows transformation signals, so the value looks useful in repeated runtime use while preserving or improving implementation quality.";
    }

    return "Direct usefulness: the candidate targets reusable runtime capability, so the value is primarily useful as something the host can call or run again.";
  }

  if (usefulnessLevel === "meta") {
    if (
      input.source.primaryAdoptionTarget === "architecture"
      && input.source.containsWorkflowPattern
    ) {
      return "Meta-usefulness: structured source metadata marks the candidate as an Architecture-targeted workflow pattern, so the value is primarily about improving how Directive Workspace works rather than exposing repeated host-call value.";
    }
    return "Meta-usefulness: shared Engine analysis detected engine-improvement signals, so the value appears to improve how Directive Workspace discovers, judges, adapts, proves, or integrates future sources.";
  }

  return `Structural usefulness: the candidate improves how Directive Workspace works in the ${input.lane.label} lane without reading as repeated runtime capability or deep Engine self-improvement.`;
}
