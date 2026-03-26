import type {
  DirectiveEngineCapabilityGap,
  DirectiveEngineCapabilityGapPriority,
  DirectiveEngineMissionContext,
  DirectiveEngineRoutingAssessment,
  DirectiveEngineRoutingConfidence,
  DirectiveEngineSourceItem,
} from "./types.ts";

const DISCOVERY_KEYWORDS = [
  "discovery",
  "front door",
  "intake",
  "queue",
  "routing",
  "route",
  "monitor",
  "review cadence",
  "coverage",
  "gap",
];

const ARCHITECTURE_KEYWORDS = [
  "architecture",
  "contract",
  "schema",
  "policy",
  "workflow",
  "doctrine",
  "evaluation",
  "evaluator",
  "adaptation",
  "analysis",
  "operating logic",
  "operating code",
  "structure",
  "engine",
  "self-improvement",
];

const RUNTIME_KEYWORDS = [
  "runtime",
  "runtime",
  "callable",
  "skill",
  "automation",
  "workflow",
  "latency",
  "performance",
  "cost",
  "reliability",
  "import",
  "source-pack",
  "runtime capability",
];

const TRANSFORMATION_KEYWORDS = [
  "transform",
  "transformation",
  "behavior-preserving",
  "faster",
  "slower",
  "latency",
  "cost",
  "reliability",
  "same behavior",
  "same capability",
  "better implementation",
  "maintainability",
];

const META_USEFULNESS_KEYWORDS = [
  "engine",
  "routing",
  "adaptation",
  "self-improvement",
  "evaluation",
  "proof",
  "schema",
  "contract",
  "policy",
];

const RUNTIME_SOURCE_TYPES = new Set([
  "github-repo",
  "external-system",
]);

const STRUCTURAL_SOURCE_TYPES = new Set([
  "paper",
  "product-doc",
  "technical-essay",
  "workflow-writeup",
  "theory",
]);

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "from",
  "into",
  "through",
  "when",
  "only",
  "have",
  "will",
  "would",
  "should",
  "about",
  "candidate",
  "current",
  "active",
  "mission",
  "source",
]);

function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, Math.round(value)));
}

function priorityWeight(priority: DirectiveEngineCapabilityGapPriority) {
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function countKeywordHits(text: string, keywords: string[]) {
  const lowered = text.toLowerCase();
  return keywords.reduce(
    (count, keyword) => count + (lowered.includes(keyword.toLowerCase()) ? 1 : 0),
    0,
  );
}

function countTokenOverlap(left: string, right: string) {
  const leftTokens = new Set(tokenize(left));
  const rightTokens = new Set(tokenize(right));
  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  }
  return overlap;
}

function flattenSourceText(source: DirectiveEngineSourceItem) {
  return [
    source.title,
    source.sourceRef,
    source.missionAlignmentHint ?? "",
    source.summary ?? "",
    ...(source.notes ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function sortOpenGaps(openGaps: DirectiveEngineCapabilityGap[]) {
  return [...openGaps]
    .filter((gap) => !gap.resolvedAt)
    .sort((left, right) => {
      const priorityDelta = priorityWeight(right.priority) - priorityWeight(left.priority);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }
      const detectedDelta = left.detectedAt.localeCompare(right.detectedAt);
      if (detectedDelta !== 0) {
        return detectedDelta;
      }
      return left.gapId.localeCompare(right.gapId);
    });
}

function findMatchedGap(input: {
  source: DirectiveEngineSourceItem;
  openGaps: DirectiveEngineCapabilityGap[];
  sourceText: string;
}) {
  const rankedGaps = sortOpenGaps(input.openGaps);

  if (input.source.capabilityGapId) {
    const directIndex = rankedGaps.findIndex((gap) => gap.gapId === input.source.capabilityGapId);
    if (directIndex >= 0) {
      return {
        gap: rankedGaps[directIndex] ?? null,
        rank: directIndex + 1,
      };
    }
  }

  let bestGap: DirectiveEngineCapabilityGap | null = null;
  let bestRank: number | null = null;
  let bestScore = 0;

  rankedGaps.forEach((gap, index) => {
    const overlap = countTokenOverlap(
      input.sourceText,
      [
        gap.gapId,
        gap.description,
        gap.relatedMissionObjective,
        gap.currentState,
        gap.desiredState,
        gap.resolutionNotes ?? "",
      ].join(" "),
    );
    if (overlap > bestScore) {
      bestScore = overlap;
      bestGap = gap;
      bestRank = index + 1;
    }
  });

  if (bestScore < 2) {
    return {
      gap: null,
      rank: null,
    };
  }

  return {
    gap: bestGap,
    rank: bestRank,
  };
}

function deriveMissionFit(
  sourceText: string,
  mission: DirectiveEngineMissionContext,
) {
  const objectiveOverlap = countTokenOverlap(sourceText, mission.currentObjective);
  const usefulnessOverlap = mission.usefulnessSignals.reduce(
    (score, signal) => score + countTokenOverlap(sourceText, signal),
    0,
  );
  const laneOverlap = mission.capabilityLanes.reduce(
    (score, lane) => score + countTokenOverlap(sourceText, lane),
    0,
  );
  return clampInt(objectiveOverlap + usefulnessOverlap + laneOverlap, 0, 5);
}

function deriveLaneScores(input: {
  source: DirectiveEngineSourceItem;
  sourceText: string;
  matchedGap: DirectiveEngineCapabilityGap | null;
}) {
  const discoverySignal = countKeywordHits(input.sourceText, DISCOVERY_KEYWORDS);
  const architectureSignal = countKeywordHits(input.sourceText, ARCHITECTURE_KEYWORDS);
  const baseRuntimeSignal = countKeywordHits(input.sourceText, RUNTIME_KEYWORDS);
  const metaUsefulnessSignal = countKeywordHits(input.sourceText, META_USEFULNESS_KEYWORDS);
  const transformationSignal = countKeywordHits(input.sourceText, TRANSFORMATION_KEYWORDS);
  const runtimeSignal =
    baseRuntimeSignal +
    (RUNTIME_SOURCE_TYPES.has(input.source.sourceType) ? 2 : 0);
  const structuralSignal =
    architectureSignal +
    (STRUCTURAL_SOURCE_TYPES.has(input.source.sourceType) ? 1 : 0);
  const matchedGapText = input.matchedGap
    ? [
      input.matchedGap.gapId,
      input.matchedGap.description,
      input.matchedGap.relatedMissionObjective,
      input.matchedGap.currentState,
      input.matchedGap.desiredState,
    ].join(" ")
    : "";

  const matchedGapDiscoverySignal = countKeywordHits(matchedGapText, DISCOVERY_KEYWORDS);
  const matchedGapArchitectureSignal = countKeywordHits(matchedGapText, ARCHITECTURE_KEYWORDS);
  const matchedGapRuntimeSignal =
    countKeywordHits(matchedGapText, RUNTIME_KEYWORDS)
    + countKeywordHits(matchedGapText, TRANSFORMATION_KEYWORDS);

  const laneScores = {
    discovery:
      discoverySignal * 3 +
      (input.source.sourceType === "internal-signal" ? 2 : 0) +
      matchedGapDiscoverySignal * 2,
    architecture:
      structuralSignal * 3 +
      matchedGapArchitectureSignal * 2,
    runtime:
      runtimeSignal * 3 +
      transformationSignal * 2 +
      matchedGapRuntimeSignal * 2,
  };

  return {
    laneScores,
    metaUsefulnessSignal: clampInt(metaUsefulnessSignal, 0, 5),
    transformationSignal: clampInt(transformationSignal, 0, 5),
    runtimeSignal: clampInt(runtimeSignal, 0, 5),
  };
}

function deriveRecommendedLane(
  laneScores: Record<"discovery" | "architecture" | "runtime", number>,
) {
  return (Object.entries(laneScores).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }
    return left[0].localeCompare(right[0]);
  })[0]?.[0] ?? "discovery") as "discovery" | "architecture" | "runtime";
}

function deriveAmbiguityPenalty(
  laneScores: Record<"discovery" | "architecture" | "runtime", number>,
) {
  const sortedScores = Object.values(laneScores).sort((left, right) => right - left);
  if (sortedScores.length < 2) {
    return 0;
  }
  const difference = sortedScores[0] - sortedScores[1];
  if (difference >= 4) return 0;
  if (difference >= 2) return 1;
  return 2;
}

function deriveConfidence(
  topLaneScore: number,
  ambiguityPenalty: number,
): DirectiveEngineRoutingConfidence {
  if (ambiguityPenalty === 0 && topLaneScore >= 10) {
    return "high";
  }
  if (ambiguityPenalty <= 1 && topLaneScore >= 6) {
    return "medium";
  }
  return "low";
}

function deriveRecommendedRecordShape(input: {
  recommendedLaneId: "discovery" | "architecture" | "runtime";
  confidence: DirectiveEngineRoutingConfidence;
  matchedGap: DirectiveEngineCapabilityGap | null;
}) {
  if (input.confidence === "high" && input.matchedGap) {
    if (input.recommendedLaneId === "architecture") {
      return "split_case";
    }
    return "fast_path";
  }

  if (input.confidence === "medium" && input.recommendedLaneId !== "discovery") {
    return "fast_path";
  }

  return "queue_only";
}

export function assessDirectiveEngineRouting(input: {
  source: DirectiveEngineSourceItem;
  mission: DirectiveEngineMissionContext;
  openGaps: DirectiveEngineCapabilityGap[];
}): DirectiveEngineRoutingAssessment {
  const sourceText = flattenSourceText(input.source);
  const { gap: matchedGap, rank: matchedGapRank } = findMatchedGap({
    source: input.source,
    openGaps: input.openGaps,
    sourceText,
  });
  const missionFit = deriveMissionFit(sourceText, input.mission);
  const gapAlignment = matchedGap ? priorityWeight(matchedGap.priority) + 1 : 0;
  const { laneScores, metaUsefulnessSignal, transformationSignal, runtimeSignal } = deriveLaneScores({
    source: input.source,
    sourceText,
    matchedGap,
  });
  const recommendedLaneId = deriveRecommendedLane(laneScores);
  const ambiguityPenalty = deriveAmbiguityPenalty(laneScores);
  const topLaneScore = laneScores[recommendedLaneId];
  const total =
    missionFit * 4 +
    gapAlignment * 5 +
    topLaneScore +
    transformationSignal -
    ambiguityPenalty * 4;
  const missionPriorityScore = clampInt(total, 0, 100);
  const confidence = deriveConfidence(topLaneScore, ambiguityPenalty);
  const recommendedRecordShape = deriveRecommendedRecordShape({
    recommendedLaneId,
    confidence,
    matchedGap,
  });
  const needsHumanReview =
    confidence === "low" ||
    matchedGap === null ||
    recommendedRecordShape === "queue_only";

  const rationale: string[] = [];
  if (matchedGap && matchedGapRank !== null) {
    rationale.push(
      `Matched open gap ${matchedGap.gapId} (rank ${matchedGapRank}) as the closest current mission pressure.`,
    );
  } else {
    rationale.push(
      "No unresolved gap matched strongly enough, so the assessment relied on mission-fit and lane-signal scoring.",
    );
  }
  rationale.push(
    `Recommended ${recommendedLaneId} because its lane score (${laneScores[recommendedLaneId]}) exceeded the alternatives.`,
  );
  if (transformationSignal > 0) {
    rationale.push(
      `Transformation signal is present (${transformationSignal}/5), which strengthens Runtime-style behavior-preserving work.`,
    );
  }
  if (metaUsefulnessSignal > 0) {
    rationale.push(
      `Meta-usefulness signal is present (${metaUsefulnessSignal}/5), which strengthens Engine-improvement handling inside Architecture or Discovery.`,
    );
  }
  if (recommendedRecordShape === "fast_path") {
    rationale.push(
      "Fast-path is recommended because the route appears bounded enough to avoid a full split-case path.",
    );
  } else if (recommendedRecordShape === "split_case") {
    rationale.push(
      "Split-case is recommended because the candidate looks structural or ambiguous enough to benefit from fuller Discovery records.",
    );
  } else {
    rationale.push(
      "Queue-only is recommended because the candidate still needs more routing clarity before record expansion.",
    );
  }

  return {
    recommendedLaneId,
    recommendedRecordShape,
    missionPriorityScore,
    confidence,
    matchedGapId: matchedGap?.gapId ?? null,
    matchedGapRank,
    explicitRouteDestination: null,
    routeConflict: false,
    needsHumanReview,
    scoreBreakdown: {
      missionFit,
      gapAlignment,
      laneScores,
      metaUsefulnessSignal,
      transformationSignal,
      runtimeSignal,
      ambiguityPenalty,
      total: missionPriorityScore,
    },
    rationale,
  };
}
